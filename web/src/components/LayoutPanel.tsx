type LayoutPanelProps = {
  title?: string;
};

const layoutRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "—"],
  ["Z", "X", "C", "V", "B", "N", "M", "—", "—", "—"],
];

export default function LayoutPanel({ title = "配列図" }: LayoutPanelProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <span className="text-sm text-slate-500">3行 x 10列</span>
      </div>
      <div className="mt-4 grid gap-2">
        {layoutRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-10 gap-2">
            {row.map((keyLabel, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm"
              >
                {keyLabel}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
