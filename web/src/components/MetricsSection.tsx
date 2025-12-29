export type MetricsSummary = {
  table: {
    efficiency: string;
    sfb2: string;
    scissors: string;
    sfs3: string;
    hand: string;
    inOut: string;
  };
  bars: {
    sfb3: number;
    alt3: number;
    roll3: number;
    onehand3: number;
    redirect3: number;
  };
};

type MetricsShowcaseProps = {
  metrics: MetricsSummary;
};

const tableOrder: Array<{ key: keyof MetricsSummary["table"]; label: string }> =
  [
    { key: "efficiency", label: "打鍵効率" },
    { key: "sfb2", label: "同指連続" },
    { key: "scissors", label: "シザー" },
    { key: "sfs3", label: "同指スキップ連続" },
    { key: "inOut", label: "内:外ロール比" },
  ];

const barOrder: Array<{
  key: keyof MetricsSummary["bars"];
  label: string;
  color: string;
}> = [
  { key: "sfb3", label: "同指", color: "bg-rose-500" },
  { key: "alt3", label: "交互", color: "bg-amber-500" },
  { key: "roll3", label: "ロール", color: "bg-emerald-500" },
  { key: "onehand3", label: "片手", color: "bg-sky-500" },
  { key: "redirect3", label: "折り返し", color: "bg-slate-600" },
];

export default function MetricsSection({ metrics }: MetricsShowcaseProps) {
  const total = barOrder.reduce(
    (sum, metric) => sum + metrics.bars[metric.key],
    0
  );

  return (
    <div className="mt-8 space-y-8">
      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">指標</h3>
        </div>
        <div className="mt-4 overflow-x-auto border border-slate-200 bg-white">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-sm tracking-wider text-slate-500">
              <tr>
                {tableOrder.map((metric) => (
                  <th key={metric.key} className="px-4 py-3 font-medium">
                    {metric.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                {tableOrder.map((metric) => (
                  <td key={metric.key} className="px-4 py-3 text-slate-700">
                    {metrics.table[metric.key]}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">3-gram 内訳</h3>
          <span className="text-sm text-slate-500">%</span>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex h-10 w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
            {barOrder.map((metric) => {
              const value = metrics.bars[metric.key];
              return (
                <div
                  key={metric.key}
                  className={`flex items-center justify-center text-xs font-semibold text-white ${metric.color}`}
                  style={{ width: `${value}%` }}
                >
                  {value >= 3 ? `${value.toFixed(1)}%` : ""}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            {barOrder.map((metric) => (
              <div key={metric.key} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${metric.color}`} />
                <span>{metric.label}</span>
                <span className="text-slate-500">
                  {metrics.bars[metric.key].toFixed(1)}%
                </span>
              </div>
            ))}
            <span className="text-slate-400">合計: {total.toFixed(1)}%</span>
          </div>
        </div>
      </section>
    </div>
  );
}
