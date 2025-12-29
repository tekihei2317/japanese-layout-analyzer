import { useMemo, useState } from "react";
import type { CorpusPayload } from "../lib/metrics-data";
import { layoutDiagrams } from "../lib/layout-diagram";
import LayoutPanel from "./LayoutPanel";
import LoadSection from "./LoadSection";
import MetricsSection, { type MetricsSummary } from "./MetricsSection";

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
  metrics: MetricsSummary;
};

function formatPercent(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) return "-";
  return `${(value * 100).toFixed(1)}%`;
}

function formatRatio(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) return "-";
  return value.toFixed(2);
}

function toPercentValue(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) return 0;
  return value * 100;
}

function buildMetricsSummary(
  metrics: CorpusPayload["layouts"][string]["metrics"]
): MetricsSummary {
  const { strokeMetrics } = metrics;
  const sfb3 = strokeMetrics.trigram.sfb + strokeMetrics.trigram.sft;
  const sfs3 = strokeMetrics.trigram.altSfs + strokeMetrics.trigram.redirectSfs;
  const alt3 = strokeMetrics.trigram.alt + strokeMetrics.trigram.altSfs;
  const roll3 = strokeMetrics.trigram.rollIn + strokeMetrics.trigram.rollOut;
  const onehand3 =
    strokeMetrics.trigram.oneHandIn + strokeMetrics.trigram.oneHandOut;
  const redirect3 =
    strokeMetrics.trigram.redirect + strokeMetrics.trigram.redirectSfs;
  const inCount =
    strokeMetrics.trigram.rollIn + strokeMetrics.trigram.oneHandIn;
  const outCount =
    strokeMetrics.trigram.rollOut + strokeMetrics.trigram.oneHandOut;
  const inOut = outCount ? inCount / outCount : 0;

  return {
    table: {
      efficiency: formatRatio(metrics.efficiency),
      sfb2: formatPercent(strokeMetrics.bigram.sfb),
      scissors: formatPercent(strokeMetrics.bigram.scissors),
      sfs3: formatPercent(sfs3),
      hand: formatPercent(metrics.hand),
      inOut: formatRatio(inOut),
    },
    bars: {
      sfb3: toPercentValue(sfb3),
      alt3: toPercentValue(alt3),
      roll3: toPercentValue(roll3),
      onehand3: toPercentValue(onehand3),
      redirect3: toPercentValue(redirect3),
    },
  };
}

function buildLayoutViews(payload: CorpusPayload | undefined): LayoutView[] {
  if (!payload) return [];
  return Object.entries(payload.layouts ?? {}).map(([layoutId, entry]) => {
    return {
      layoutId,
      name: entry.name ?? layoutId,
      loadMetrics: entry.metrics.loadMetrics,
      metrics: buildMetricsSummary(entry.metrics),
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
  const layoutViews = useMemo(
    () => buildLayoutViews(currentPayload),
    [currentPayload]
  );

  const corpusLabel =
    index.corpora.find((corpus) => corpus.id === selectedCorpusId)?.name ?? "-";

  return (
    <div className="relative flex flex-col gap-10">
      <aside className="absolute right-full h-full hidden xl:block">
        <nav className="sticky top-16 w-48">
          <div className="space-y-2">
            <ul className="space-y-2">
              {layoutViews.map((view) => (
                <li key={`nav-${view.layoutId}`}>
                  <a
                    className="block hover:text-slate-900"
                    href={`#${view.layoutId}`}
                  >
                    {view.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>

      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-4 pb-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              配列一覧
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600">
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
            <label className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600">
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
        </header>

        <section className="space-y-10 bg-white">
          {layoutViews.length === 0 ? (
            <div className="px-2 py-8 text-slate-600">
              {corpusLabel} のメトリクスが見つかりませんでした。
            </div>
          ) : null}
          {layoutViews.map((view) => (
            <div key={view.layoutId} className="py-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2
                  id={view.layoutId}
                  className="scroll-mt-6 text-2xl font-semibold text-slate-900"
                >
                  {view.name}
                </h2>
              </div>

              <div className="mt-6">
                <LayoutPanel
                  diagram={
                    layoutDiagrams[
                      view.layoutId as keyof typeof layoutDiagrams
                    ] ?? {}
                  }
                  layoutMode={layoutMode}
                />
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
    </div>
  );
}
