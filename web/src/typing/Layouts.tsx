import type { LayoutId } from "@japanese-layout-analyzer/core";

type LayoutProps = {
  layoutId: LayoutId;
};

type LayoutMetaProps = {
  description?: string;
  linkHref: string;
  linkLabel: string;
};

type KeyGridProps = {
  rows: string[][];
};

const KeyGrid = ({ rows }: KeyGridProps) => {
  const columns = Math.max(...rows.map((row) => row.length));

  return (
    <div className="grid gap-2">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
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
  );
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
        <KeyGrid rows={rows} />
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
          <KeyGrid rows={oneStroke} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            シフト
          </div>
          <KeyGrid rows={shift} />
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
          <KeyGrid rows={oneStroke} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            ☆前置
          </div>
          <KeyGrid rows={shift} />
        </div>
      </div>
    </div>
  );
};

const YukikaLayout = () => {
  const oneStroke = [
    ["こ", "な", "と", "け", "ろ", "", "む", "る", "い", "の", "れ", "め"],
    ["た", "て", "☆", "か", "は", "", "っ", "ん", "☆", "゛", "し", "ー"],
    ["す", "ょ", "せ", "き", "さ", "", "く", "う", "、", "。", "゜", ""],
  ];

  const shift = [
    ["ぁ", "ね", "や", "ほ", "ゆ", "", "ぬ", "わ", "あ", "に", "ぇ", "「"],
    ["ぃ", "お", "ら", "も", "ふ", "", "ゃ", "つ", "ま", "ち", "え", "」"],
    ["ぅ", "ゅ", "そ", "よ", "へ", "", "み", "り", "ひ", "を", "ぉ", ""],
  ];

  return (
    <div className="flex flex-col gap-6">
      <LayoutMeta
        linkHref="http://oookaworks.seesaa.net/article/503093275.html#gsc.tab=0"
        linkLabel="月配列一覧: 大岡俊彦の作品置き場"
        description="月配列4-698式、◯配列とも呼ばれる計算配列の先駆け。遺伝的アルゴリズムで配置を決めています。"
      />
      <div className="flex flex-col gap-6">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          配列図
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            単打
          </div>
          <KeyGrid rows={oneStroke} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            ☆前置
          </div>
          <KeyGrid rows={shift} />
        </div>
      </div>
    </div>
  );
};

const BunaLayout = () => {
  const oneStroke = [
    ["こ", "に", "は", "て", "も", "り", "っ", "し", "の", "き", "れ"],
    ["で", "か", "☆", "な", "た", "く", "ん", "★", "い", "と", "ら"],
    ["だ", "が", "ま", "す", "ょ", "る", "う", "、", "。", "", ""],
  ];

  const starShift = [
    ["づ", "＿", "ぢ", "ぷ", "ぅ", "ぬ", "ぱ", "げ", "じ", "ゃ", "「"],
    ["ば", "さ", "☆", "ゅ", "ぜ", "ひ", "を", "め", "ー", "ぶ", "」"],
    ["ぴ", "ぞ", "＿", "ゆ", "ヴ", "ず", "む", "ぎ", "ぐ", "ぽ", ""],
  ];

  const blackShift = [
    ["べ", "ぼ", "ほ", "そ", "へ", "＿", "ぺ", "ぇ", "え", "や", ""],
    ["わ", "せ", "け", "ど", "あ", "び", "つ", "★", "お", "ろ", ""],
    ["ふ", "ざ", "ご", "ね", "よ", "み", "ち", "ぉ", "ぃ", "ぁ", ""],
  ];

  return (
    <div className="flex flex-col gap-6">
      <LayoutMeta
        linkHref="http://keybor.blog96.fc2.com/blog-entry-107.html"
        linkLabel="ちょっと、かな配列 ぶな配列v2.0 (20180325-04版)"
        description="月系の前置シフト計算配列。2連節頻度と2打鍵時間を基に、山登り法で入力時間が最小化されるよう配置されています。"
      />
      <div className="flex flex-col gap-6">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          配列図
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            シフト無し
          </div>
          <KeyGrid rows={oneStroke} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            ☆シフト
          </div>
          <KeyGrid rows={starShift} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            ★シフト
          </div>
          <KeyGrid rows={blackShift} />
        </div>
      </div>
    </div>
  );
};

const MizunaraLayout = () => {
  const oneStroke = [
    ["も", "に", "は", "て", "で", "れ", "っ", "し", "と", "の"],
    ["か", "★", "☆", "な", "る", "き", "ん", "☆", "★", "い"],
    ["こ", "が", "だ", "た", "ょ", "く", "う", "、", "。", "　"],
  ];

  const starShift = [
    ["ご", "づ", "ぼ", "ほ", "へ", "ぉ", "ぷ", "ぶ", "え", "ゃ"],
    ["あ", "け", "す", "お", "さ", "ひ", "つ", "ち", "じ", "ま"],
    ["や", "ゆ", "ぜ", "ね", "よ", "ぬ", "み", "ぺ", "ゅ", "ぴ"],
  ];

  const blackShift = [
    ["べ", "ぃ", "ぁ", "ど", "ぞ", "　", "ぱ", "ぽ", "ば", "ず"],
    ["ら", "せ", "わ", "ろ", "そ", "ぎ", "ー", "め", "り", "を"],
    ["び", "ぇ", "げ", "ふ", "ざ", "ぐ", "む", "ゔ", "ぅ", "ぢ"],
  ];

  return (
    <div className="flex flex-col gap-6">
      <LayoutMeta
        linkHref="http://keybor.web.fc2.com/mizunara-v1.0.html"
        linkLabel="ミズナラ配列 v1.0"
        description="ぶな配列と同じ方法で作られた計算配列。前置シフトで中指・薬指の4キーを使い、クロスシフトを採用しています。"
      />
      <div className="flex flex-col gap-6">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          配列図
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            単打
          </div>
          <KeyGrid rows={oneStroke} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            ☆シフト
          </div>
          <KeyGrid rows={starShift} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            ★シフト
          </div>
          <KeyGrid rows={blackShift} />
        </div>
      </div>
    </div>
  );
};

const TukiringoLayout = () => {
  const oneStroke = [
    ["", "せ", "こ", "ょ", "ら", "さ", "や", "す", "゛", "ん", "ゃ", "ー"],
    ["き", "れ", "し", "て", "と", "く", "は", "か", "い", "う", "る", "っ"],
    ["", "ち", "よ", "に", "の", "ゅ", "な", "た", "お", "め", "つ", ""],
  ];

  const shift = [
    ["", "ぁ", "ぃ", "ょ", "け", "ろ", "ほ", "ね", "", "み", "ぉ", "ぅ"],
    ["", "ふ", "", "ぬ", "り", "。", "、", "あ", "ま", "え", "へ", "む"],
    ["", "", "ゎ", "", "も", "ひ", "そ", "を", "わ", "ゆ", "ぇ", ""],
  ];

  return (
    <div className="flex flex-col gap-6">
      <LayoutMeta
        linkHref="https://menmentsu.hateblo.jp/entry/2021/01/12/230614"
        linkLabel="月林檎配列（上段中指シフト3段かな配列）"
        description="後置シフトの月系配列。33キーを使い、清濁同置で濁音は2打鍵。ょを後置シフトと兼用します。"
      />
      <div className="flex flex-col gap-6">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          配列図
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            通常面
          </div>
          <KeyGrid rows={oneStroke} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            ょ後置シフト
          </div>
          <KeyGrid rows={shift} />
        </div>
      </div>
    </div>
  );
};

const FumidukiLayout = () => {
  const oneStroke = [
    ["も", "か", "し", "て", "よ", "つ", "ん", "い", "の", "ま", "を"],
    ["は", "濁", "★", "た", "と", "く", "う", "☆", "濁", "が", "に"],
    ["よ", "せ", "す", "な", "で", "っ", "る", "、", "。", "ー", ""],
  ];

  const shift = [
    ["　", "け", "れ", "そ", "ろ", "　", "み", "ふ", "や", "へ", "　"],
    ["め", "さ", "き", "あ", "お", "り", "ら", "こ", "ゆ", "え", "　"],
    ["　", "ぬ", "ね", "ほ", "　", "む", "ち", "ひ", "わ", "　", "　"],
  ];

  return (
    <div className="flex flex-col gap-6">
      <LayoutMeta
        linkHref="https://x.com/CordialBun/status/1974436234165625290"
        linkLabel="文月配列"
        description="日本語を楽しく効率的に書くために作られた配列です。頻出濁音は単打、それ以外は清濁同置で、小書き・濁音は排他的配置です。"
      />
      <div className="flex flex-col gap-6">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          配列図
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            単打
          </div>
          <KeyGrid rows={oneStroke} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            ★前置
          </div>
          <KeyGrid rows={shift} />
        </div>
      </div>
    </div>
  );
};

const BurichutoroLayout = () => {
  const oneStroke = [
    ["ゅ", "こ", "と", "さ", "ゃ", "わ", "き", "し", "く", "ち", ""],
    ["た", "か", "、", "て", "は", "の", "い", "。", "う", "ん", "ー"],
    ["ょ", "に", "な", "る", "も", "つ", "す", "お", "あ", "っ", ""],
  ];

  const kShift = [
    ["ひ", "ね", "ど", "め", "ふ", "ゔ", "ぎ", "ぃ", "ぐ", "ぢ", ""],
    ["だ", "が", "を", "で", "ま", "ぁ", "り", "？", "れ", "", "/"],
    ["へ", "そ", "せ", "け", "ほ", "づ", "ず", "ぅ", "ぇ", "ぉ", ""],
  ];

  const dShift = [
    ["ぴ", "ご", "ぬ", "ざ", "ぷ", "む", "ゆ", "じ", "や", "ふぁ", ""],
    ["ょう", "ら", "！", "よ", "ぱ", "ば", "ろ", "を", "ます", "ゅう", "~"],
    ["ぺ", "ぞ", "ぜ", "げ", "ぽ", "ぼ", "です", "え", "み", "ふぉ", ""],
  ];

  return (
    <div className="flex flex-col gap-6">
      <LayoutMeta
        linkHref="https://mobitan.hateblo.jp/entry/2022/11/30/221433"
        linkLabel="ブリ中トロ配列 3年目の改良（2022/10/15版）"
        description="TRONかな配列の中指シフト化をベースに、ハイブリッド月配列の拗音シフトを導入した配列です。"
      />
      <div className="flex flex-col gap-6">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          配列図
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            単打
          </div>
          <KeyGrid rows={oneStroke} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            K前置
          </div>
          <KeyGrid rows={kShift} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            D前置
          </div>
          <KeyGrid rows={dShift} />
        </div>
      </div>
    </div>
  );
};

const HybridTsukiLayout = () => {
  const oneStroke = [
    ["ま", "て", "た", "っ", "を", "ぇ", "に", "な", "の", "ゅ", "ぱ"],
    ["？", "う", "、", "し", "が", "お", "い", "。", "と", "か", "ょ"],
    ["は", "も", "る", "こ", "ら", "く", "ん", "す", "で", "ゃ", ""],
  ];

  const dotShift = [
    ["ぎ", "ぐ", "ふ", "ゔ", "", "", "", "", "", "びゅ", ""],
    ["ば", "ぶ", "べ", "せ", "む", "ぼ", "び", "や", "つ", "れ", "びょ"],
    ["", "", "", "き", "", "", "ほ", "", "", "びゃ", ""],
  ];

  const commaShift = [
    ["", "", "", "", "", "", "", "ひ", "み", "ご", ""],
    ["あ", "ち", "え", "だ", "げ", "", "り", "よ", "そ", "け", ""],
    ["", "", "", "め", "", "", "ぬ", "ね", "", "", ""],
  ];

  const questionShift = [
    ["", "", "", "", "", "", "", "へ", "ゆ", "じゅ", ""],
    ["ざ", "ず", "ぜ", "さ", "", "ぞ", "じ", "ど", "わ", "ろ", "じょ"],
    ["", "", "", "", "", "", "", "", "", "じゃ", ""],
  ];

  return (
    <div className="flex flex-col gap-6">
      <LayoutMeta
        linkHref="https://takahata-shin.hatenadiary.org/entry/20150505/1430818677"
        linkLabel="ハイブリッド月配列"
        description="句読点や拗音のキー共有を取り入れた月系配列。拗音になるイ段を排他的に配置し、2打で拗音が打てる設計です。"
      />
      <div className="flex flex-col gap-6">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          配列図
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            単打
          </div>
          <KeyGrid rows={oneStroke} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            。シフト
          </div>
          <KeyGrid rows={dotShift} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            、シフト
          </div>
          <KeyGrid rows={commaShift} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            ？シフト
          </div>
          <KeyGrid rows={questionShift} />
        </div>
      </div>
    </div>
  );
};

const HidedukiLayout = () => {
  const oneStroke = [
    ["そ", "き", "し", "て", "は", "を", "ん", "い", "る", "ー"],
    ["す", "か", "★", "と", "た", "く", "う", "☆", "△", "；"],
    ["ち", "こ", "に", "な", "さ", "の", "り", "、", "。", "・"],
  ];

  const shift = [
    ["ゐ", "お", "み", "え", "め", "へ", "ふ", "せ", "ゆ", "ぬ"],
    ["ね", "れ", "ら", "あ", "わ", "や", "ま", "も", "よ", "；"],
    ["ゑ", "ろ", "け", "ほ", "む", "ひ", "つ", "", "", "・"],
  ];

  return (
    <div className="flex flex-col gap-6">
      <LayoutMeta
        linkHref="https://zenn.dev/bantako/scraps/f0744cac168cb0"
        linkLabel="英月配列の紹介"
        description="30キーに収まるコンパクトな月配列。全てのかなを2打鍵以内に入力できる。濁音はL前置シフト、半濁音と小書きは同手の中指前置シフト。"
      />
      <div className="flex flex-col gap-6">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          配列図
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            単打
          </div>
          <KeyGrid rows={oneStroke} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
            シフト
          </div>
          <KeyGrid rows={shift} />
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
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", ""].map((key) =>
      key ? toLabel(mapping[key]) : key
    ),
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", ""].map((key) =>
      key ? toLabel(mapping[key]) : key
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
        <KeyGrid rows={rows} />
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
  if (layoutId === "yukika") {
    return <YukikaLayout />;
  }
  if (layoutId === "buna") {
    return <BunaLayout />;
  }
  if (layoutId === "mizunara") {
    return <MizunaraLayout />;
  }
  if (layoutId === "tukiringo") {
    return <TukiringoLayout />;
  }
  if (layoutId === "fumiduki") {
    return <FumidukiLayout />;
  }
  if (layoutId === "burichutoro-20221015") {
    return <BurichutoroLayout />;
  }
  if (layoutId === "hybrid-tsuki") {
    return <HybridTsukiLayout />;
  }
  if (layoutId === "hideduki") {
    return <HidedukiLayout />;
  }
  if (layoutId === "oonisi") {
    return <OnishiLayout />;
  }
  return <LayoutFallback label={layoutId} />;
};
