import { useMemo, useState } from "react";
import type { CorpusPayload, MetricDefinition } from "../lib/metrics-data";
import LayoutPanel from "./LayoutPanel";
import LoadSection from "./LoadSection";
import MetricsSection from "./MetricsSection";

type TopPageAppProps = {
  index: {
    corpora: Array<{ id: string; name: string }>;
  };
  corpusDataById: Record<string, CorpusPayload>;
};

type LayoutView = {
  layoutId: string;
  name: string;
  loadMetrics: CorpusPayload["layouts"][string]["metrics"]["loadMetrics"];
  metrics: Array<{ label: string; value: string }>;
};

const defaultMetrics: MetricDefinition[] = [
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

function metricValue(
  metrics: CorpusPayload["layouts"][string]["metrics"],
  key: string
) {
  const { strokeMetrics } = metrics;
  if (key === "efficiency") return metrics.efficiency;
  if (key === "hand") return metrics.hand;
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
}

function buildLayoutViews(
  payload: CorpusPayload | undefined,
  metrics: MetricDefinition[]
): LayoutView[] {
  if (!payload) return [];
  return Object.entries(payload.layouts ?? {}).map(([layoutId, entry]) => {
    const formatted = metrics.map((metric) => ({
      label: metric.label,
      value: formatMetric(metricValue(entry.metrics, metric.key), metric),
    }));
    return {
      layoutId,
      name: entry.name ?? layoutId,
      loadMetrics: entry.metrics.loadMetrics,
      metrics: formatted,
    };
  });
}

export default function TopPageApp({ index, corpusDataById }: TopPageAppProps) {
  const initialCorpusId = index.corpora[0]?.id ?? "";
  const [selectedCorpusId, setSelectedCorpusId] = useState(initialCorpusId);
  const [layoutMode, setLayoutMode] = useState<"staggered" | "ortholinear">(
    "staggered"
  );

  const currentPayload = corpusDataById[selectedCorpusId];
  const metricDefinitions = currentPayload?.metrics ?? defaultMetrics;

  const layoutViews = useMemo(
    () => buildLayoutViews(currentPayload, metricDefinitions),
    [currentPayload, metricDefinitions]
  );

  const corpusLabel =
    index.corpora.find((corpus) => corpus.id === selectedCorpusId)?.name ?? "-";

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            配列指標ダッシュボード
          </h1>
        </div>
        {/* <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600"> */}
        <div className="flex gap-4">
          <div>
            <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 shadow-sm">
              <span>コーパス</span>
              <select
                className="cursor-pointer bg-transparent text-lg text-slate-700"
                value={selectedCorpusId}
                onChange={(event) => setSelectedCorpusId(event.target.value)}
              >
                {index.corpora.map((corpus) => (
                  <option key={corpus.id} value={corpus.id}>
                    {corpus.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 shadow-sm">
              <span>配列表示</span>
              <select
                className="cursor-pointer bg-transparent text-lg text-slate-700"
                value={layoutMode}
                onChange={(event) =>
                  setLayoutMode(
                    event.target.value as "staggered" | "ortholinear"
                  )
                }
              >
                <option value="staggered">ロースタッガード</option>
                <option value="ortholinear">オーソリニア</option>
              </select>
            </label>
          </div>
        </div>
      </header>

      <section className="grid gap-8">
        {layoutViews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/90 p-6 text-slate-600">
            {corpusLabel} のメトリクスが見つかりませんでした。
          </div>
        ) : null}
        {layoutViews.map((view) => (
          <div
            key={view.layoutId}
            className="rounded-3xl border border-slate-200 bg-white/90 p-6 backdrop-blur"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-slate-900">
                {view.name}
              </h2>
            </div>

            <div className="mt-6">
              <LayoutPanel />
            </div>

            <LoadSection
              loadMetrics={view.loadMetrics}
              layoutMode={layoutMode}
            />
            <MetricsSection metrics={view.metrics} />
          </div>
        ))}
      </section>
    </div>
  );
}
