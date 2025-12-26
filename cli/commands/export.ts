import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  LayoutId,
  RomanTable,
  Rule,
} from "@japanese-layout-analyzer/core";
import {
  getRomanTable,
  findShortestKeystrokes,
  normalizeText,
  computeMetrics,
} from "@japanese-layout-analyzer/core";
import { listLayouts } from "./layout";

type MetricDefinition = {
  key: string;
  label: string;
  unit: string;
  format: "percent" | "ratio" | "count";
  group?: string;
};

type CorpusIndex = {
  schemaVersion: number;
  corpora: Array<{ id: string; name: string; file: string }>;
};

type CorpusMetrics = {
  schemaVersion: number;
  corpus: { id: string; name: string; source?: string };
  metrics: MetricDefinition[];
  layouts: Array<{ id: string; name: string; values: Record<string, number> }>;
};

type ExportOptions = {
  corpus?: string;
  layout?: string;
  outDir?: string;
  corpusId?: string;
  corpusName?: string;
};

const defaultMetrics: MetricDefinition[] = [
  {
    key: "efficiency",
    label: "打鍵効率",
    unit: "ratio",
    format: "ratio",
    group: "1-gram",
  },
  { key: "sfb", label: "SFBs", unit: "%", format: "percent", group: "2-gram" },
  { key: "sfs", label: "SFSs", unit: "%", format: "percent", group: "2-gram" },
  {
    key: "scissors",
    label: "Scissors",
    unit: "%",
    format: "percent",
    group: "2-gram",
  },
  {
    key: "hand",
    label: "Hand use (L)",
    unit: "%",
    format: "percent",
    group: "load",
  },
];

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
    const name = corpusNameOverride ?? id;
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
      targets.push({ id, name: id, filePath });
    }
    return targets;
  }

  await addTarget(option);
  return targets;
};

const resolveCorpusFile = async (value: string) => {
  const directPath = path.resolve(value);
  try {
    const stat = await fs.stat(directPath);
    if (stat.isFile()) return directPath;
  } catch {
    // ignore
  }

  const fromDataDir = path.join(process.cwd(), "data", "texts", `${value}.txt`);
  const stat = await fs.stat(fromDataDir);
  if (stat.isFile()) return fromDataDir;
  throw new Error(`Corpus not found: ${value}`);
};

const deriveCorpusId = (value: string, filePath: string) => {
  if (value !== "all" && !value.includes(path.sep) && !value.endsWith(".txt")) {
    return value;
  }
  return path.basename(filePath).replace(/\.txt$/, "");
};

const resolveLayouts = async (option: string | undefined) => {
  if (!option || option === "all") {
    return listLayouts();
  }
  return [option];
};

const ensureMetrics = (metrics: MetricDefinition[]) => {
  const existing = new Set(metrics.map((metric) => metric.key));
  defaultMetrics.forEach((metric) => {
    if (!existing.has(metric.key)) metrics.push(metric);
  });
};

const computeLayoutMetrics = (text: string, layoutId: string) => {
  const table = getRomanTable(layoutId as LayoutId);
  const rules = table as RomanTable as Rule[];
  const normalized = normalizeText(text);
  const keystrokes = findShortestKeystrokes(rules, normalized);

  if (!keystrokes) {
    throw new Error(
      `Failed to convert text to keystrokes for layout: ${layoutId}`
    );
  }

  const metrics = computeMetrics(keystrokes);
  const efficiency = normalized.length
    ? keystrokes.length / normalized.length
    : 0;

  return {
    efficiency,
    sfb: metrics.sfb,
    sfs: metrics.sfs,
    scissors: metrics.scissors,
    hand: metrics.handLoad.left,
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
      metrics: [...defaultMetrics],
      layouts: [],
    };

    corpusData.corpus = {
      ...corpusData.corpus,
      id: corpus.id,
      name: corpus.name,
      source: corpusData.corpus.source ?? path.basename(corpus.filePath),
    };
    ensureMetrics(corpusData.metrics);

    const text = await fs.readFile(corpus.filePath, "utf8");

    for (const layoutId of layoutTargets) {
      const values = computeLayoutMetrics(text, layoutId);
      const existing = corpusData.layouts.find(
        (entry) => entry.id === layoutId
      );
      if (existing) {
        existing.values = { ...existing.values, ...values };
      } else {
        corpusData.layouts.push({ id: layoutId, name: layoutId, values });
      }
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
