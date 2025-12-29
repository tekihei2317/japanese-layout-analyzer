import type { CSSProperties } from "react";
import {
  ortholinearLayout,
  rowStaggeredLayout,
  type KeyboardLayout,
  type KeyboardRow,
} from "@japanese-layout-analyzer/core";

type LayoutMode = "staggered" | "ortholinear";

type LoadMetricsPayload = {
  key: Record<string, number>;
  row: Record<string, { L: number; R: number }>;
  finger: Record<string, number>;
  hand: Record<string, number>;
};

type LoadSectionProps = {
  loadMetrics?: LoadMetricsPayload;
  layoutMode: LayoutMode;
};

type KeyCell = { unit: number; offset?: number; value: number };

const rowOrder: KeyboardRow[] = [
  "NumberRow",
  "TopRow",
  "MiddleRow",
  "BottomRow",
  "SpaceRow",
];

const fingerOrder = [
  { key: "LeftPinky", label: "LP" },
  { key: "LeftRing", label: "LR" },
  { key: "LeftMiddle", label: "LM" },
  { key: "LeftIndex", label: "LI" },
  { key: "LeftThumb", label: "LT" },
  { key: "RightThumb", label: "RT" },
  { key: "RightIndex", label: "RI" },
  { key: "RightMiddle", label: "RM" },
  { key: "RightRing", label: "RR" },
  { key: "RightPinky", label: "RP" },
];

function toPercent(value: number | undefined) {
  return typeof value === "number" ? value * 100 : 0;
}

function buildKeyRows(
  layout: KeyboardLayout,
  metrics: LoadMetricsPayload | undefined
) {
  return rowOrder.map((row) =>
    layout[row].map((key) => ({
      unit: key.unit,
      offset: key.offset,
      value: toPercent(metrics?.key[key.code]),
    }))
  );
}

function loadClass(value: number) {
  if (value >= 8) return "bg-rose-500/90 text-white";
  if (value >= 6) return "bg-rose-400/90 text-white";
  if (value >= 4) return "bg-rose-300/90 text-rose-900";
  if (value >= 2) return "bg-rose-200/90 text-rose-900";
  if (value >= 1) return "bg-rose-100/90 text-rose-900";
  return "bg-slate-100 text-slate-500";
}

function barWidth(value: number, max: number) {
  return `${Math.round((value / max) * 100)}%`;
}

function barHeight(value: number, max: number) {
  return `${Math.round((value / max) * 100)}%`;
}

export default function LoadSection({
  loadMetrics,
  layoutMode,
}: LoadSectionProps) {
  const rowSumsLeft = rowOrder.map((row) =>
    toPercent(loadMetrics?.row[row]?.L)
  );
  const rowSumsRight = rowOrder.map((row) =>
    toPercent(loadMetrics?.row[row]?.R)
  );
  const fingerLoads = fingerOrder.map((finger) => ({
    label: finger.label,
    value: toPercent(loadMetrics?.finger[finger.key]),
  }));
  const leftSum = toPercent(loadMetrics?.hand.L);
  const rightSum = toPercent(loadMetrics?.hand.R);
  const maxFinger = Math.max(1, ...fingerLoads.map((entry) => entry.value));
  const maxRow = Math.max(1, ...rowSumsLeft, ...rowSumsRight);

  const layout =
    layoutMode === "ortholinear" ? ortholinearLayout : rowStaggeredLayout;
  const keyRows = buildKeyRows(layout, loadMetrics);

  return (
    <div className="mt-8" style={{ "--unit-size": "3rem" } as CSSProperties}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">負担率</h3>
        <span className="text-sm text-slate-500">%</span>
      </div>

      <div className="mt-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr_1fr]">
          <div className="space-y-2 text-[11px] text-slate-600">
            <div className="text-sm font-semibold text-slate-700">行負荷</div>
            {rowSumsLeft.map((value, index) => (
              <div
                key={`row-left-${index}`}
                className="flex items-center gap-2"
              >
                <span className="w-10 text-right font-semibold text-slate-600">
                  {value.toFixed(1)}
                </span>
                <div className="h-3 flex-1 rounded-full bg-rose-100">
                  <div
                    className="ml-auto h-3 rounded-full bg-rose-500"
                    style={{ width: barWidth(value, maxRow) }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold text-slate-700">指負荷</div>
            <div
              className="grid gap-2 text-[11px] text-slate-600"
              style={{
                gridTemplateColumns: `repeat(${fingerLoads.length}, minmax(0, 1fr))`,
              }}
            >
              {fingerLoads.map((entry) => (
                <div
                  key={entry.label}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="font-semibold text-slate-600">
                    {entry.value.toFixed(1)}
                  </span>
                  <div className="flex h-20 w-full items-end justify-center rounded-lg bg-rose-100">
                    <div
                      className="w-full rounded-md bg-rose-500"
                      style={{ height: barHeight(entry.value, maxFinger) }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {entry.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-[11px] text-slate-600">
            <div className="text-sm font-semibold text-slate-700 text-right">
              行負荷
            </div>
            {rowSumsRight.map((value, index) => (
              <div
                key={`row-right-${index}`}
                className="flex items-center gap-2"
              >
                <div className="h-3 flex-1 rounded-full bg-rose-100">
                  <div
                    className="h-3 rounded-full bg-rose-500"
                    style={{ width: barWidth(value, maxRow) }}
                  />
                </div>
                <span className="w-10 text-left font-semibold text-slate-600">
                  {value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <span className="px-3 py-1 text-center">
            左手合計: {leftSum.toFixed(1)}%
          </span>
          <span className="px-3 py-1 text-center">
            右手合計: {rightSum.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <div
          className="space-y-0 flex justify-center"
          style={{ minWidth: "640px" }}
        >
          <div>
            {keyRows.map((row, rowIndex) => (
              <div
                key={`key-row-${rowIndex}`}
                className="flex flex-nowrap gap-0"
              >
                {row.map((cell: KeyCell, colIndex) => (
                  <div
                    key={`key-${rowIndex}-${colIndex}`}
                    className={`flex items-center justify-center border-b-2 border-r-2 border-white border text-sm font-semibold ${
                      rowIndex === 0 ? "border-t-2" : ""
                    } ${colIndex === 0 ? "border-l-2" : ""} ${loadClass(
                      cell.value
                    )}`}
                    style={{
                      width: `calc(var(--unit-size, 3rem) * ${cell.unit})`,
                      height: "var(--unit-size, 3rem)",
                      marginLeft: `calc(var(--unit-size, 3rem) * ${
                        cell.offset ?? 0
                      })`,
                    }}
                    title={`${cell.value.toFixed(1)}%`}
                  >
                    <span className="truncate px-1">
                      {cell.value.toFixed(1)}
                    </span>
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
