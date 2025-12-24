import type { LayoutId } from "@japanese-layout-analyzer/core";

type LayoutProps = {
  layoutId: LayoutId;
};

type LayoutMetaProps = {
  description?: string;
  linkHref: string;
  linkLabel: string;
};

const LayoutMeta = ({ description, linkHref, linkLabel }: LayoutMetaProps) => {
  return (
    <div className="grid gap-3 text-slate-600">
      <div>
        <a
          className="text-teal-700 underline underline-offset-4"
          href={linkHref}
          target="_blank"
          rel="noreferrer"
        >
          {linkLabel}
        </a>
      </div>
      <div>
        <p>{description}</p>
      </div>
    </div>
  );
};

const QwertyLayout = () => {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"],
    ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
  ];

  return (
    <div className="flex flex-col gap-6">
      <LayoutMeta
        linkHref="https://ja.wikipedia.org/wiki/QWERTY%E9%85%8D%E5%88%97"
        linkLabel="QWERTY配列 (Wikipedia)"
      />
      <div>
        <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
          配列図
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
      <LayoutMeta
        linkHref="https://jisx6004.client.jp/tsuki.html"
        linkLabel="中指前置シフト新JIS「月配列」"
      />
      <div className="flex flex-col gap-6">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          配列図
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            単打
          </div>
          <div className="grid gap-2">
            {oneStroke.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-11 gap-2">
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
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            シフト
          </div>
          <div className="grid gap-2">
            {shift.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-11 gap-2">
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
      </div>
    </div>
  );
};

const HanaLayout = () => {
  const oneStroke = [
    ["ょ", "て", "と", "こ", "は", "っ", "く", "う", "る", "ら", "ー"],
    ["す", "か", "☆", "き", "た", "ん", "れ", "☆", "゛", "ろ", "り"],
    ["さ", "し", "な", "の", "に", "し", "つ", "。", "、", "め", "え"],
  ];

  const shift = [
    ["ひ", "け", "ぇ", "ほ", "へ", "ゃ", "ま", "そ", "も", "ぃ", "「"],
    ["ぁ", "よ", "ゅ", "や", "゜", "よ", "ふ", "ち", "む", "ぉ", "」"],
    ["ぅ", "せ", "あ", "わ", "ゆ", "ね", "み", "を", "お", "ぬ", "　"],
  ];

  return (
    <div className="flex flex-col gap-6">
      <LayoutMeta
        linkHref="https://powerhouse63w.blogspot.com/2019/02/blog-post.html"
        linkLabel="花配列のキー配列図を作った"
        description="中指前置シフトの先駆けとなった配列で、月配列より上段の使用率が高いのが特徴です。"
      />
      <div className="flex flex-col gap-6">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          配列図
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            単打
          </div>
          <div className="grid gap-2">
            {oneStroke.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-11 gap-2">
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
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            ☆前置
          </div>
          <div className="grid gap-2">
            {shift.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-11 gap-2">
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

const OnishiLayout = () => {
  const mapping: Record<string, string> = {
    q: "q",
    w: "l",
    e: "u",
    r: ",",
    t: ".",
    y: "f",
    u: "w",
    i: "r",
    o: "y",
    p: "p",
    a: "e",
    s: "i",
    d: "a",
    f: "o",
    g: "-",
    h: "k",
    j: "t",
    k: "n",
    l: "s",
    ";": "h",
    z: "z",
    x: "x",
    c: "c",
    v: "v",
    b: ";",
    n: "g",
    m: "d",
    ",": "m",
    ".": "j",
    "/": "b",
    "-": "/",
  };

  const toLabel = (value: string) =>
    /[a-z]/.test(value) ? value.toUpperCase() : value;

  const rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((key) =>
      toLabel(mapping[key])
    ),
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"].map((key) =>
      toLabel(mapping[key])
    ),
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "-"].map((key) =>
      toLabel(mapping[key])
    ),
  ];

  return (
    <div className="flex flex-col gap-6">
      <LayoutMeta
        linkHref="https://o24.works/layout/"
        linkLabel="大西配列｜ローマ字をもっと打ちやすく"
      />
      <div>
        <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
          配列図
        </div>
        <div className="grid gap-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-11 gap-2">
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
  if (layoutId === "hana") {
    return <HanaLayout />;
  }
  if (layoutId === "oonisi") {
    return <OnishiLayout />;
  }
  return <LayoutFallback label={layoutId} />;
};
