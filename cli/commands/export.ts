import { promises as fs } from "node:fs";
import path from "node:path";
import type { LayoutId } from "@japanese-layout-analyzer/core";
import {
  getRomanTable,
  layoutIdOrder,
  findShortestKeystrokes,
  normalizeText,
  computeStrokeMetrics,
  computeHandLoad,
  computeLoadMetrics,
} from "@japanese-layout-analyzer/core";
import { listLayouts } from "./layout";
import { config } from "../config";

type CorpusIndex = {
  schemaVersion: number;
  corpora: Array<{ id: string; name: string; file: string }>;
};

type CorpusMetrics = {
  schemaVersion: number;
  corpus: { id: string; name: string; source?: string };
  layouts: Record<
    string,
    {
      name: string;
      metrics: {
        efficiency: number;
        hand: number;
        strokeMetrics: ReturnType<typeof computeStrokeMetrics>;
        loadMetrics: ReturnType<typeof computeLoadMetrics>;
      };
    }
  >;
};

type ExportOptions = {
  corpus?: string;
  layout?: string;
  outDir?: string;
  corpusId?: string;
  corpusName?: string;
};

const ensureDir = async (dir: string) => {
  await fs.mkdir(dir, { recursive: true });
};

const readJson = async <T>(filePath: string): Promise<T | null> => {
  try {
    const contents = await fs.readFile(filePath, "utf8");
    return JSON.parse(contents) as T;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return null;
    }
    throw error;
  }
};

const writeJson = async (filePath: string, payload: unknown) => {
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2) + "\n");
};

const resolveCorpusTargets = async (
  option: string | undefined,
  corpusIdOverride: string | undefined,
  corpusNameOverride: string | undefined
) => {
  const targets: Array<{ id: string; name: string; filePath: string }> = [];

  const addTarget = async (value: string) => {
    const filePath = await resolveCorpusFile(value);
    const id = corpusIdOverride ?? deriveCorpusId(value, filePath);
    const name =
      corpusNameOverride ??
      config.corpus.names[path.basename(filePath)] ??
      id;
    targets.push({ id, name, filePath });
  };

  if (!option || option === "all") {
    const textsDir = path.join(process.cwd(), "data", "texts");
    const entries = await fs.readdir(textsDir, { withFileTypes: true });
    const files = entries.filter(
      (entry) => entry.isFile() && entry.name.endsWith(".txt")
    );
    for (const entry of files) {
      const id = entry.name.replace(/\.txt$/, "");
      const filePath = path.join(textsDir, entry.name);
      const name = config.corpus.names[entry.name] ?? id;
      targets.push({ id, name, filePath });
    }
    return targets;
  }

  await addTarget(option);
  return targets;
};

const resolveCorpusFile = async (value: string) => {
  const directPath = path.resolve(value);
  const stat = await fs.stat(directPath);
  if (stat.isFile()) return directPath;
  throw new Error(`Corpus not found: ${value}`);
};

const deriveCorpusId = (_value: string, filePath: string) => {
  return path.basename(filePath).replace(/\.txt$/, "");
};

const resolveLayouts = async (option: string | undefined) => {
  if (!option || option === "all") {
    const layouts = await listLayouts();
    const validLayouts = layouts.filter((layoutId) =>
      Boolean(getRomanTable(layoutId as LayoutId))
    );
    const invalidLayouts = layouts.filter(
      (layoutId) => !getRomanTable(layoutId as LayoutId)
    );
    if (invalidLayouts.length > 0) {
      console.warn(
        `Skipped layouts without roman table: ${invalidLayouts.join(", ")}`
      );
    }
    return sortLayouts(validLayouts);
  }
  if (!getRomanTable(option as LayoutId)) {
    throw new Error(`Unknown layout: ${option}`);
  }
  return [option];
};

function sortLayouts(layouts: string[]) {
  const orderMap = new Map(
    layoutIdOrder.map((layoutId, index) => [layoutId, index])
  );
  return [...layouts].sort((a, b) => {
    const aIndex = orderMap.get(a as LayoutId);
    const bIndex = orderMap.get(b as LayoutId);
    if (aIndex === undefined && bIndex === undefined) return 0;
    if (aIndex === undefined) return 1;
    if (bIndex === undefined) return -1;
    return aIndex - bIndex;
  });
}

const computeLayoutMetrics = (text: string, layoutId: string) => {
  const table = getRomanTable(layoutId as LayoutId);
  if (!table) {
    throw new Error(`Unknown layout: ${layoutId}`);
  }
  const normalized = normalizeText(text);
  const keystrokes = findShortestKeystrokes(table, normalized);

  if (!keystrokes) {
    throw new Error(
      `Failed to convert text to keystrokes for layout: ${layoutId}`
    );
  }

  const strokeMetrics = computeStrokeMetrics(keystrokes);
  const handLoad = computeHandLoad(keystrokes);
  const efficiency = normalized.length
    ? keystrokes.length / normalized.length
    : 0;

  return {
    efficiency,
    hand: handLoad.left,
    strokeMetrics,
    loadMetrics: computeLoadMetrics(keystrokes),
  };
};

export const exportCommand = async (options: ExportOptions) => {
  if (!options.corpus && !options.layout) {
    throw new Error("Specify --corpus or --layout.");
  }

  const outDir = options.outDir
    ? path.resolve(options.outDir)
    : path.join(process.cwd(), "web", "public", "metrics");
  await ensureDir(outDir);

  const corpusTargets = await resolveCorpusTargets(
    options.corpus ?? "all",
    options.corpusId,
    options.corpusName
  );
  const layoutTargets = await resolveLayouts(options.layout);

  const indexPath = path.join(outDir, "index.json");
  const corpusIndex = (await readJson<CorpusIndex>(indexPath)) ?? {
    schemaVersion: 1,
    corpora: [],
  };

  for (const corpus of corpusTargets) {
    const corpusFileName = `${corpus.id}.json`;
    const corpusFilePath = path.join(outDir, corpusFileName);
    const corpusData = (await readJson<CorpusMetrics>(corpusFilePath)) ?? {
      schemaVersion: 1,
      corpus: {
        id: corpus.id,
        name: corpus.name,
        source: path.basename(corpus.filePath),
      },
      layouts: {},
    };

    corpusData.corpus = {
      ...corpusData.corpus,
      id: corpus.id,
      name: corpus.name,
      source: corpusData.corpus.source ?? path.basename(corpus.filePath),
    };
    if (!corpusData.layouts || Array.isArray(corpusData.layouts)) {
      corpusData.layouts = {};
    }

    const text = await fs.readFile(corpus.filePath, "utf8");

    for (const layoutId of layoutTargets) {
      const metrics = computeLayoutMetrics(text, layoutId);
      const existing = corpusData.layouts[layoutId];
      const name =
        config.layout.names[layoutId as LayoutId] ?? existing?.name ?? layoutId;
      corpusData.layouts[layoutId] = { name, metrics };
    }

    await writeJson(corpusFilePath, corpusData);

    const indexEntry = corpusIndex.corpora.find(
      (entry) => entry.id === corpus.id
    );
    const fileRef = `/metrics/${corpusFileName}`;
    if (indexEntry) {
      indexEntry.name = corpus.name;
      indexEntry.file = fileRef;
    } else {
      corpusIndex.corpora.push({
        id: corpus.id,
        name: corpus.name,
        file: fileRef,
      });
    }
  }

  await writeJson(indexPath, corpusIndex);
};
