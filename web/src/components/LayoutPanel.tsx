import type { CSSProperties } from "react";
import type { LayoutDiagram } from "../lib/layout-diagram";
import {
  ortholinearLayout,
  rowStaggeredLayout,
  type KeyboardLayout,
  type KeyboardRow,
} from "@japanese-layout-analyzer/core";

type LayoutPanelProps = {
  title?: string;
  diagram: LayoutDiagram;
  layoutMode: "staggered" | "ortholinear";
};

const rowOrder: KeyboardRow[] = [
  "NumberRow",
  "TopRow",
  "MiddleRow",
  "BottomRow",
];

type KeyCell = { unit: number; offset?: number; label: string };

function buildKeyRows(layout: KeyboardLayout, diagram: LayoutDiagram) {
  return rowOrder.map((row) =>
    layout[row].map((key) => ({
      unit: key.unit,
      offset: key.offset,
      label: diagram[key.code] ?? "",
    }))
  );
}

export default function LayoutPanel({
  title = "配列図",
  diagram,
  layoutMode,
}: LayoutPanelProps) {
  const layout =
    layoutMode === "ortholinear" ? ortholinearLayout : rowStaggeredLayout;
  const keyRows = buildKeyRows(layout, diagram);

  return (
    <div style={{ "--unit-size": "4.5rem" } as CSSProperties}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <span className="text-sm text-slate-500">単打</span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div
          className="space-y-0 flex justify-center"
          style={{ minWidth: "640px" }}
        >
          <div>
            {keyRows.map((row, rowIndex) => (
              <div
                key={`diagram-row-${rowIndex}`}
                className="flex flex-nowrap gap-0"
              >
                {row.map((cell: KeyCell, colIndex) => (
                  <div
                    key={`diagram-key-${rowIndex}-${colIndex}`}
                    className={`flex items-center justify-center border-b-4 border-r-4 border-white border rounded-xl text-2xl font-semibold ${
                      rowIndex === 0 ? "border-t-4" : ""
                    } ${colIndex === 0 ? "border-l-4" : ""} ${
                      cell.label
                        ? "bg-white text-slate-900 shadow-[inset_0_0_0_2px_rgba(0,0,0,0.65)]"
                        : "bg-slate-50 text-slate-400"
                    }`}
                    style={{
                      width: `calc(var(--unit-size, 3rem) * ${cell.unit})`,
                      height: "var(--unit-size, 3rem)",
                      marginLeft: `calc(var(--unit-size, 3rem) * ${
                        cell.offset ?? 0
                      })`,
                    }}
                  >
                    <span className="truncate px-1">{cell.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
