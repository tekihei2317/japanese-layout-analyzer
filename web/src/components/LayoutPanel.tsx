import type { LayoutDiagram } from "../lib/layout-diagram";

type LayoutPanelProps = {
  title?: string;
  diagram: LayoutDiagram;
};

const layoutRows = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "Semicolon"],
  ["z", "x", "c", "v", "b", "n", "m", "Comma", "Period", "Slash"],
] as const;

export default function LayoutPanel({
  title = "配列図",
  diagram,
}: LayoutPanelProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <span className="text-sm text-slate-500">3行 x 10列</span>
      </div>
      <div className="mt-4 grid gap-2">
        {layoutRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-10 gap-2">
            {row.map((keyCode, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm"
              >
                {diagram[keyCode] ?? "—"}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
