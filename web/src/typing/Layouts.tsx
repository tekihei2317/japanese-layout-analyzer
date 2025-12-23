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
      <div className="flex flex-wrap items-center gap-3 text-slate-600">
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
                className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 shadow-sm"
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
  const oneStroke = [
    ["そ", "こ", "し", "て", "ょ", "つ", "ん", "い", "の", "り", "ち"],
    ["は", "か", "☆", "と", "た", "く", "う", "★", "゛", "き", "れ"],
    ["す", "け", "に", "な", "さ", "っ", "る", "、", "。", "゜", "・"],
  ];

  const shift = [
    ["ぁ", "ひ", "ほ", "ふ", "め", "ぬ", "え", "み", "や", "ぇ", "「"],
    ["ぃ", "を", "ら", "あ", "よ", "ま", "お", "も", "わ", "ゆ", "」"],
    ["ぅ", "へ", "せ", "ゅ", "ゃ", "む", "ろ", "ね", "ー", "ぉ", "　"],
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2 text-slate-600">
        <a
          className="text-teal-700 underline underline-offset-4"
          href="https://jisx6004.client.jp/tsuki.html"
          target="_blank"
          rel="noreferrer"
        >
          中指前置シフト新JIS「月配列」
        </a>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-2 uppercase tracking-wider text-slate-400">
            単打
          </div>
          <div className="grid gap-2">
            {oneStroke.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-11 gap-2">
                {row.map((keyLabel, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="text-xl flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 shadow-sm"
                  >
                    {keyLabel}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 uppercase tracking-wider text-slate-400">
            シフト
          </div>
          <div className="grid gap-2">
            {shift.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-11 gap-2">
                {row.map((keyLabel, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="text-xl flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 shadow-sm"
                  >
                    {keyLabel}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
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
