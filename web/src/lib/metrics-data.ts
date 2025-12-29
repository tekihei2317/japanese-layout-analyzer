import { promises as fs } from "node:fs";

export type LayoutMetrics = {
  efficiency: number;
  hand: number;
  strokeMetrics: {
    bigram: {
      sfb: number;
      scissors: number;
    };
    trigram: {
      sfb: number;
      sft: number;
      alt: number;
      altSfs: number;
      rollIn: number;
      rollOut: number;
      oneHandIn: number;
      oneHandOut: number;
      redirect: number;
      redirectSfs: number;
    };
  };
  loadMetrics?: {
    key: Record<string, number>;
    row: Record<string, { L: number; R: number }>;
    finger: Record<string, number>;
    hand: Record<string, number>;
  };
};

export type CorpusPayload = {
  schemaVersion: number;
  corpus: {
    id: string;
    name: string;
    source?: string;
  };
  layouts: Record<string, { name: string; metrics: LayoutMetrics }>;
};

export type CorpusIndex = {
  schemaVersion: number;
  corpora: Array<{
    id: string;
    name: string;
    file: string;
  }>;
};

function resolveMetricsPath(file: string) {
  return new URL(`../../public${file}`, import.meta.url);
}

async function loadCorpusIndex() {
  const indexPath = resolveMetricsPath("/metrics/index.json");
  const indexRaw = await fs.readFile(indexPath, "utf8");
  return JSON.parse(indexRaw) as CorpusIndex;
}

async function loadCorpusData(file: string) {
  const corpusPath = resolveMetricsPath(file);
  const corpusRaw = await fs.readFile(corpusPath, "utf8");
  return JSON.parse(corpusRaw) as CorpusPayload;
}

export async function loadMetricsData() {
  const index = await loadCorpusIndex();
  const corpusEntries = await Promise.all(
    index.corpora.map(async (corpus) => {
      const payload = await loadCorpusData(corpus.file);
      return [corpus.id, payload] as const;
    })
  );
  return {
    index,
    corpusDataById: Object.fromEntries(corpusEntries),
  };
}
