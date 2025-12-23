import type { LayoutId } from "@japanese-layout-analyzer/core";

type LayoutProps = {
  layoutId: LayoutId;
};

const QwertyLayout = () => {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"],
    ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 text-lg text-slate-600">
        <a
          className="text-teal-700 underline underline-offset-4"
          href="https://ja.wikipedia.org/wiki/QWERTY%E9%85%8D%E5%88%97"
          target="_blank"
          rel="noreferrer"
        >
          参考リンク
        </a>
      </div>
      <div className="grid gap-2">
        {rows.map((row, rowIndex) => (
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
};

const TsukiLayout = () => {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "☆"],
    ["Z", "X", "C", "V", "B", "N", "M", "☆", "☆", "☆"],
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
          月配列 2-263式
        </span>
        <a
          className="text-teal-700 underline underline-offset-4"
          href="https://o2mt.net/moon/"
          target="_blank"
          rel="noreferrer"
        >
          公式サイト
        </a>
      </div>
      <div className="grid gap-2">
        {rows.map((row, rowIndex) => (
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
};

const LayoutFallback = ({ label }: { label: string }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
      {label} の配列図は準備中です。
    </div>
  );
};

export const Layouts = ({ layoutId }: LayoutProps) => {
  if (layoutId === "qwerty") {
    return <QwertyLayout />;
  }
  if (layoutId === "tsuki-2-263") {
    return <TsukiLayout />;
  }
  return <LayoutFallback label={layoutId} />;
};
