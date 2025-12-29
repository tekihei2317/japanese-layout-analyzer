import { useEffect, useMemo, useState } from "react";

type MetricFormat = "percent" | "ratio" | "count";

type MetricDefinition = {
  key: string;
  label: string;
  unit: string;
  format: MetricFormat;
  group?: string;
};

type LayoutRow = {
  id: string;
  name: string;
  metrics: {
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
  };
};

type CorpusPayload = {
  schemaVersion: number;
  corpus: {
    id: string;
    name: string;
    source?: string;
  };
  metrics?: MetricDefinition[];
  layouts: Record<string, { name: string; metrics: LayoutRow["metrics"] }>;
};

type CorpusIndex = {
  schemaVersion: number;
  corpora: Array<{
    id: string;
    name: string;
    file: string;
  }>;
};

const formatMetric = (value: number | undefined, metric: MetricDefinition) => {
  if (value === undefined || Number.isNaN(value)) return "-";
  if (metric.format === "percent") {
    return `${(value * 100).toFixed(1)}%`;
  }
  if (metric.format === "ratio") {
    return value.toFixed(2);
  }
  return value.toLocaleString("en-US");
};

const displayMetrics: MetricDefinition[] = [
  {
    key: "efficiency",
    label: "打鍵効率",
    unit: "ratio",
    format: "ratio",
    group: "1-gram",
  },
  {
    key: "sfb2",
    label: "SFB (2-gram)",
    unit: "%",
    format: "percent",
    group: "2-gram",
  },
  {
    key: "scissors",
    label: "Scissors",
    unit: "%",
    format: "percent",
    group: "2-gram",
  },
  {
    key: "sfb3",
    label: "SFB (3-gram)",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "sfs3",
    label: "SFS (3-gram)",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "alt3",
    label: "ALT (3-gram)",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "roll3",
    label: "ROLL (3-gram)",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "onehand3",
    label: "ONEHAND (3-gram)",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "redirect3",
    label: "REDIRECT (3-gram)",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "hand",
    label: "Hand use (L)",
    unit: "%",
    format: "percent",
    group: "load",
  },
  {
    key: "inOut",
    label: "In:out roll",
    unit: "ratio",
    format: "ratio",
    group: "3-gram",
  },
];

const metricValue = (row: LayoutRow, key: string) => {
  const { strokeMetrics } = row.metrics;
  if (key === "efficiency") return row.metrics.efficiency;
  if (key === "hand") return row.metrics.hand;
  if (key === "sfb2") return strokeMetrics.bigram.sfb;
  if (key === "scissors") return strokeMetrics.bigram.scissors;
  if (key === "sfb3")
    return strokeMetrics.trigram.sfb + strokeMetrics.trigram.sft;
  if (key === "sfs3")
    return strokeMetrics.trigram.altSfs + strokeMetrics.trigram.redirectSfs;
  if (key === "alt3")
    return strokeMetrics.trigram.alt + strokeMetrics.trigram.altSfs;
  if (key === "roll3")
    return strokeMetrics.trigram.rollIn + strokeMetrics.trigram.rollOut;
  if (key === "onehand3")
    return strokeMetrics.trigram.oneHandIn + strokeMetrics.trigram.oneHandOut;
  if (key === "redirect3")
    return strokeMetrics.trigram.redirect + strokeMetrics.trigram.redirectSfs;
  if (key === "inOut") {
    const inCount =
      strokeMetrics.trigram.rollIn + strokeMetrics.trigram.oneHandIn;
    const outCount =
      strokeMetrics.trigram.rollOut + strokeMetrics.trigram.oneHandOut;
    return outCount ? inCount / outCount : 0;
  }
  return undefined;
};

export default function TableApp() {
  const [index, setIndex] = useState<CorpusIndex | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [data, setData] = useState<CorpusPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const loadIndex = async () => {
      try {
        const response = await fetch("/metrics/index.json");
        if (!response.ok) throw new Error("Failed to load corpus list.");
        const payload = (await response.json()) as CorpusIndex;
        setIndex(payload);
        setSelectedId(payload.corpora[0]?.id ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load.");
      }
    };
    void loadIndex();
  }, []);

  useEffect(() => {
    if (!index || !selectedId) return;
    const corpus = index.corpora.find((item) => item.id === selectedId);
    if (!corpus) return;

    const loadCorpus = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(corpus.file);
        if (!response.ok) throw new Error("Failed to load corpus data.");
        const payload = (await response.json()) as CorpusPayload;
        setData(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    void loadCorpus();
  }, [index, selectedId]);

  const metrics = displayMetrics;
  const rows = useMemo<LayoutRow[]>(() => {
    if (!data?.layouts) return [];
    return Object.entries(data.layouts).map(([id, entry]) => ({
      id,
      name: entry.name ?? id,
      metrics: entry.metrics,
    }));
  }, [data]);

  const corpusLabel = useMemo(() => {
    if (!index || !selectedId) return "-";
    return index.corpora.find((item) => item.id === selectedId)?.name ?? "-";
  }, [index, selectedId]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const direction = sortDirection === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const aValue = metricValue(a, sortKey);
      const bValue = metricValue(b, sortKey);
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      return (aValue - bValue) * direction;
    });
  }, [rows, sortDirection, sortKey]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("desc");
  };

  const sortLabel = (key: string) => {
    if (sortKey !== key) return "";
    return sortDirection === "asc" ? "▲" : "▼";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900">指標一覧</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <label className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600">
            <span className="mr-2">コーパス</span>
            <select
              className="bg-transparent text-slate-700"
              value={selectedId ?? ""}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              {index?.corpora.map((corpus) => (
                <option key={corpus.id} value={corpus.id}>
                  {corpus.name}
                </option>
              ))}
            </select>
          </label>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">
            配列数: {rows.length}
          </span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">
            参照指標: {metrics.length}
          </span>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="min-w-full text-left text-sm sm:text-base">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3 font-medium">
                配列
              </th>
              {metrics.map((metric) => (
                <th
                  key={metric.key}
                  className="cursor-pointer select-none px-4 py-3 font-medium transition hover:bg-slate-100/70"
                  onClick={() => handleSort(metric.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{metric.label}</span>
                    <span className="inline-block w-3 text-[10px] text-slate-400">
                      {sortLabel(metric.key) || "\u00A0"}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  className="px-4 py-6 text-slate-500"
                  colSpan={metrics.length + 1}
                >
                  {corpusLabel} のデータを読み込み中...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-slate-500"
                  colSpan={metrics.length + 1}
                >
                  データがありません。
                </td>
              </tr>
            ) : (
              sortedRows.map((row, index) => (
                <tr
                  key={row.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                >
                  <td className="whitespace-nowrap sticky left-0 z-10 bg-inherit px-4 py-3 font-semibold text-slate-800">
                    {row.name}
                  </td>
                  {metrics.map((metric) => (
                    <td key={metric.key} className="px-4 py-3 text-slate-600">
                      {formatMetric(metricValue(row, metric.key), metric)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
