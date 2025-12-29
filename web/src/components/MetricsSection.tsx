type MetricDisplay = {
  label: string;
  value: string;
};

type MetricsSectionProps = {
  metrics: MetricDisplay[];
};

export default function MetricsSection({ metrics }: MetricsSectionProps) {
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">指標</h3>
          <p className="text-sm text-slate-500">
            シンプルな横並びテーブルで表示します。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1 font-medium text-slate-600">
            フィルタ: 全指標
          </button>
          <button className="rounded-full border border-slate-200 bg-white px-4 py-1 font-medium text-slate-600">
            比較: QWERTY
          </button>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full text-left text-sm sm:text-base">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              {metrics.map((metric) => (
                <th key={metric.label} className="px-4 py-3 font-medium">
                  {metric.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              {metrics.map((metric) => (
                <td key={metric.label} className="px-4 py-3 text-slate-700">
                  {metric.value}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
