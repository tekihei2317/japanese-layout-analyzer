import type { CSSProperties } from "react";
import {
  rowStaggeredLayout,
  type KeyboardLayout,
  type KeyboardRow,
} from "@japanese-layout-analyzer/core";
import type { LayoutDiagram, LayoutDiagrams } from "../lib/layout-diagram";

type LayoutDiagramPanelProps = {
  showName?: boolean;
  diagrams: LayoutDiagrams;
};

const rowOrder: KeyboardRow[] = [
  "NumberRow",
  "TopRow",
  "MiddleRow",
  "BottomRow",
];

function buildKeyRows(layout: KeyboardLayout, diagram: LayoutDiagram) {
  return rowOrder.map((row) =>
    layout[row].map((key) => ({
      unit: key.unit,
      offset: key.offset,
      label: diagram[key.code] ?? "",
    }))
  );
}

export default function LayoutDiagramPanel({
  showName,
  diagrams,
}: LayoutDiagramPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      {diagrams.map((entry) => {
        const rows = buildKeyRows(rowStaggeredLayout, entry.diagram);
        return (
          <div key={entry.name} className="flex flex-col gap-2">
            {(showName === undefined || showName) && (
              <div className="text-sm uppercase tracking-wider text-slate-600">
                {entry.name}
              </div>
            )}
            <div
              className="space-y-0 flex justify-center"
              style={{ "--unit-size": "3.5rem" } as CSSProperties}
            >
              <div>
                {rows.map((row, rowIndex) => (
                  <div
                    key={`${entry.name}-${rowIndex}`}
                    className="flex flex-nowrap gap-0"
                  >
                    {row.map((cell, colIndex) => (
                      <div
                        key={`${entry.name}-${rowIndex}-${colIndex}`}
                        className={`flex items-center justify-center border-b-2 border-r-2 border-white border text-lg font-semibold ${
                          rowIndex === 0 ? "border-t-2" : ""
                        } ${colIndex === 0 ? "border-l-2" : ""} ${
                          cell.label
                            ? "bg-white text-slate-900 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.2)]"
                            : "bg-slate-50 text-slate-400"
                        }`}
                        style={{
                          width: `calc(var(--unit-size, 2.6rem) * ${cell.unit})`,
                          height: "var(--unit-size, 2.6rem)",
                          marginLeft: `calc(var(--unit-size, 2.6rem) * ${
                            cell.offset ?? 0
                          })`,
                        }}
                      >
                        <span className="truncate px-1">
                          {cell.label || " "}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
