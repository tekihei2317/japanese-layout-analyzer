import { useMemo, useState } from "react";
import type { CorpusIndex, CorpusPayload } from "../lib/metrics-data";

type LayoutRow = {
  id: string;
  name: string;
  metrics: CorpusPayload["layouts"][string]["metrics"];
};

type MetricFormat = "percent" | "ratio" | "count";

type MetricKey =
  | "efficiency"
  | "sfbs"
  | "scissors"
  | "sfss"
  | "SFB"
  | "SFB_sfb"
  | "SFB_sft"
  | "ALT"
  | "ALT_alt"
  | "ALT_alt-sfs"
  | "ROLL"
  | "ROLL_roll-in"
  | "ROLL_roll-out"
  | "ONEHAND"
  | "ONEHAND_onehand-in"
  | "ONEHAND_onehand-out"
  | "REDIRECT"
  | "REDIRECT_redirect"
  | "REDIRECT_redirect-sfs"
  | "hand"
  | "inOut";

export type MetricDefinition = {
  key: MetricKey;
  label: string;
  unit: string;
  format: MetricFormat;
  group?: string;
};

function formatMetric(value: number | undefined, metric: MetricDefinition) {
  if (value === undefined || Number.isNaN(value)) return "-";
  if (metric.format === "percent") {
    return `${(value * 100).toFixed(1)}%`;
  }
  if (metric.format === "ratio") {
    return value.toFixed(2);
  }
  return value.toLocaleString("en-US");
}

const displayMetrics: MetricDefinition[] = [
  {
    key: "efficiency",
    label: "打鍵効率",
    unit: "ratio",
    format: "ratio",
    group: "1-gram",
  },
  {
    key: "sfbs",
    label: "SFBs",
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
    key: "sfss",
    label: "SFSs",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "hand",
    label: "Left hand",
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
  {
    key: "SFB",
    label: "SFB",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "SFB_sfb",
    label: "sfb",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "SFB_sft",
    label: "sft",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "ALT",
    label: "ALT",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "ALT_alt",
    label: "alt",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "ALT_alt-sfs",
    label: "alt-sfs",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "ROLL",
    label: "ROLL",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "ROLL_roll-in",
    label: "roll-in",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "ROLL_roll-out",
    label: "roll-out",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "ONEHAND",
    label: "ONEHAND",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "ONEHAND_onehand-in",
    label: "onehand-in",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "ONEHAND_onehand-out",
    label: "onehand-out",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "REDIRECT",
    label: "REDIRECT",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "REDIRECT_redirect",
    label: "redirect",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
  {
    key: "REDIRECT_redirect-sfs",
    label: "redirect-sfs",
    unit: "%",
    format: "percent",
    group: "3-gram",
  },
];

function metricValue(row: LayoutRow, key: MetricKey) {
  const { strokeMetrics } = row.metrics;
  if (key === "efficiency") return row.metrics.efficiency;
  if (key === "hand") return row.metrics.hand;
  if (key === "sfbs") return strokeMetrics.bigram.sfb;
  if (key === "scissors") return strokeMetrics.bigram.scissors;
  if (key === "sfss")
    return strokeMetrics.trigram.altSfs + strokeMetrics.trigram.redirectSfs;
  if (key === "inOut") {
    const inCount =
      strokeMetrics.trigram.rollIn + strokeMetrics.trigram.oneHandIn;
    const outCount =
      strokeMetrics.trigram.rollOut + strokeMetrics.trigram.oneHandOut;
    return outCount ? inCount / outCount : 0;
  }

  // SFB
  if (key === "SFB")
    return strokeMetrics.trigram.sfb + strokeMetrics.trigram.sft;
  if (key === "SFB_sfb") return strokeMetrics.trigram.sfb;
  if (key === "SFB_sft") return strokeMetrics.trigram.sft;

  // ALT
  if (key === "ALT")
    return strokeMetrics.trigram.alt + strokeMetrics.trigram.altSfs;
  if (key === "ALT_alt") return strokeMetrics.trigram.alt;
  if (key === "ALT_alt-sfs") return strokeMetrics.trigram.altSfs;
  // ROLL
  if (key === "ROLL")
    return strokeMetrics.trigram.rollIn + strokeMetrics.trigram.rollOut;
  if (key === "ROLL_roll-in") return strokeMetrics.trigram.rollIn;
  if (key === "ROLL_roll-out") return strokeMetrics.trigram.rollOut;

  // ONEHAND
  if (key === "ONEHAND")
    return strokeMetrics.trigram.oneHandIn + strokeMetrics.trigram.oneHandOut;
  if (key === "ONEHAND_onehand-in") return strokeMetrics.trigram.oneHandIn;
  if (key === "ONEHAND_onehand-out") return strokeMetrics.trigram.oneHandOut;

  // REDIRECT
  if (key === "REDIRECT")
    return strokeMetrics.trigram.redirect + strokeMetrics.trigram.redirectSfs;
  if (key === "REDIRECT_redirect") return strokeMetrics.trigram.redirect;
  if (key === "REDIRECT_redirect-sfs") return strokeMetrics.trigram.redirectSfs;

  return undefined;
}

type TableAppProps = {
  index: CorpusIndex;
  corpusDataById: Record<string, CorpusPayload>;
};

export default function TableApp({ index, corpusDataById }: TableAppProps) {
  const [selectedId, setSelectedId] = useState<string>(
    index.corpora[0]?.id ?? ""
  );
  const [sortKey, setSortKey] = useState<MetricKey | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const data = selectedId ? corpusDataById[selectedId] ?? null : null;
  const error =
    selectedId && !data ? "選択したコーパスのデータが見つかりません。" : null;

  const metrics = displayMetrics;
  const rows = useMemo<LayoutRow[]>(() => {
    if (!data?.layouts) return [];
    return Object.entries(data.layouts).map(([id, entry]) => ({
      id,
      name: entry.name ?? id,
      metrics: entry.metrics,
    }));
  }, [data]);

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

  const handleSort = (key: MetricKey) => {
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
  const tableWidth = displayMetrics.length * 120;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900">テーブル</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
        <table
          className="table-fixed text-left text-sm sm:text-base"
          style={{ width: tableWidth }}
        >
          <thead className="bg-slate-50 text-sm tracking-wider text-slate-500">
            <tr>
              <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2 font-medium w-40">
                配列
              </th>
              {metrics.map((metric) => (
                <th
                  key={metric.key}
                  className="cursor-pointer select-none px-3 py-2 font-medium transition hover:bg-slate-100/70"
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
            {rows.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-slate-500"
                  colSpan={metrics.length + 1}
                >
                  データがありません。
                </td>
              </tr>
            ) : (
              sortedRows.map((row, index) => {
                const rowBg = index % 2 === 0 ? "bg-white" : "bg-slate-50";
                return (
                  <tr key={row.id} className={rowBg}>
                    <td className="whitespace-nowrap sticky left-0 z-10 bg-inherit px-4 py-3 font-semibold text-slate-800">
                      {row.name}
                    </td>
                    {metrics.map((metric) => (
                      <td key={metric.key} className="px-4 py-3 text-slate-600">
                        {formatMetric(metricValue(row, metric.key), metric)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
