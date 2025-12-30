import type { LayoutId } from "@japanese-layout-analyzer/core";
import { layoutDiagrams } from "../lib/layout-diagram";
import LayoutDiagramPanel from "./LayoutDiagramPanel";

type LayoutProps = {
  layoutId: LayoutId;
};

type LayoutMetaProps = {
  linkHref: string;
  linkLabel: string;
};

function LayoutMeta({ linkHref, linkLabel }: LayoutMetaProps) {
  return (
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
  );
}

function QwertyLayout() {
  const diagrams = layoutDiagrams.qwerty;

  return (
    <div className="flex flex-col gap-6">
      <LayoutDiagramPanel diagrams={diagrams} showName={false} />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">Qwerty配列</h3>
        <LayoutMeta
          linkHref="https://ja.wikipedia.org/wiki/QWERTY%E9%85%8D%E5%88%97"
          linkLabel="QWERTY配列 (Wikipedia)"
        />
      </div>
      <div className="space-y-2">
        <p>
          ほとんどのキーボードに採用されている標準的な配列。文字の配置はタイプライターが元になっている。
        </p>
      </div>
    </div>
  );
}

function OnishiLayout() {
  const diagrams = layoutDiagrams.oonisi;

  return (
    <div className="flex flex-col gap-6">
      <LayoutDiagramPanel diagrams={diagrams} showName={false} />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">大西配列</h3>
        <LayoutMeta
          linkHref="https://o24.works/layout/"
          linkLabel="大西配列｜ローマ字をもっと打ちやすく"
        />
      </div>
      <div className="space-y-2">
        <p>作: 大西拓磨</p>
        <p>
          ローマ字をもっとも入力しやすいように、100万文字の統計から開発された配列。
        </p>
        <p>母音と子音が左右に分かれているため、交互打鍵率が高い。</p>
        <p>
          頻度の多い文字が打ちやすい場所に配置することや、同指連続を少なくすることが考えられており、悪運指が少ない。
        </p>
        <p>
          また、覚えやすさを考慮して、濁音・半濁音が清音の上下に配置されている。
        </p>
      </div>
    </div>
  );
}

function HanaLayout() {
  const diagrams = layoutDiagrams.hana;

  return (
    <div className="flex flex-col gap-6">
      <LayoutDiagramPanel diagrams={diagrams} />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">花配列</h3>
      </div>
      <div className="space-y-2">
        <p>作: 冨樫雅文</p>
        <p>
          頻度の高いシフトキーは押しやすい位置にあるべきという考えから、中指前置シフトを採用した配列。
        </p>
        <p>
          シフト面のかなは、反対の手の中指（dキーまたはkキー）を押してから入力する。
        </p>
        <p>交互打鍵率が高くなるように設計されている。</p>
        <p>
          中指前置シフトの他の配列と比べると、上段の使用率が高い特徴がある。
        </p>
      </div>
    </div>
  );
}

function TsukiLayout() {
  const diagrams = layoutDiagrams["tsuki-2-263"];

  return (
    <div className="flex flex-col gap-6">
      <LayoutDiagramPanel diagrams={diagrams} />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">
          月配列2-263式
        </h3>
        <LayoutMeta
          linkHref="https://jisx6004.client.jp/tsuki.html"
          linkLabel="中指前置シフト新JIS「月配列」"
        />
      </div>
      <div className="space-y-2">
        <p>作: 2ちゃんねる</p>
        <p>
          シフト面のかなは、反対の手の中指（dキーまたはkキー）を押してから入力する。
        </p>
        <p>2chの、パソコン一般板・新JISスレッドで生まれた配列。</p>
        <p>
          新JIS配列に中指シフトを組み合わせたらどうなるかというアイデアで作られた。
        </p>
        <p>
          新JIS配列の特性を引き継いでいるため、交互打鍵率の高い配列になっている。
        </p>
      </div>
    </div>
  );
}

function YukikaLayout() {
  const diagrams = layoutDiagrams.yukika;

  return (
    <div className="flex flex-col gap-6">
      <LayoutDiagramPanel diagrams={diagrams} />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">幸花配列</h3>
        <LayoutMeta
          linkHref="http://oookaworks.seesaa.net/article/503093275.html#gsc.tab=0"
          linkLabel="月配列一覧: 大岡俊彦の作品置き場"
        />
      </div>
      <div className="space-y-2">
        <p>月配列4-698式、◯配列とも呼ばれる。</p>
        <p>シフトは中指前置シフトで、逆手シフトを使う。</p>
        <p>遺伝的アルゴリズムによって作られた計算配列。</p>
      </div>
    </div>
  );
}

function MizunaraLayout() {
  const diagrams = layoutDiagrams.mizunara;

  return (
    <div className="flex flex-col gap-6">
      <LayoutDiagramPanel diagrams={diagrams} />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">ミズナラ配列</h3>
        <LayoutMeta
          linkHref="http://keybor.web.fc2.com/mizunara-v1.0.html"
          linkLabel="ミズナラ配列 v1.0"
        />
      </div>
      <div className="space-y-2">
        <p>作: keybor</p>
        <p>清濁分置、30キー以内の月配列。</p>
        <p>シフトは中指と薬指の前置シフトで、逆手シフトを使う。</p>
        <p>
          シフト方式は異なるが、ぶな配列と同じ評価基準とアルゴリズムで作られている。
        </p>
      </div>
    </div>
  );
}

function HybridTsukiLayout() {
  const diagrams = layoutDiagrams["hybrid-tsuki"];

  return (
    <div className="flex flex-col gap-6">
      <LayoutDiagramPanel diagrams={diagrams} />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">
          ハイブリッド月配列
        </h3>
        <LayoutMeta
          linkHref="https://takahata-shin.hatenadiary.org/entry/20150505/1430818677"
          linkLabel="ハイブリッド月配列"
        />
      </div>
      <div className="space-y-2">
        <p>作: takahata_shin</p>
        <p>キー範囲が広く、様々機能があり、やや複雑な月系配列。</p>
        <p>「。」「、」「？」の3キーが前置シフトキーを兼用している。</p>
        <p>
          拗音になるかなが排他的に配置されているため、拗音はシフトを省略して入力できる。
        </p>
        <p>
          上記の配列図には載っていない部分があるが、一部は行段のように入力できるため、覚えやすくなっている。
        </p>
        <p>
          濁音は「a k @」を「ZBP」行、「a j s d h / p
          :」を「あいうえおゃゅょ」段と考えて、
          <br /> (aa, aj, as, ad, a/, ap, a:) =
          (ざ、じ、ず、ぜ、ぞ、じゃ、じゅ、じょ) のように入力できる。
        </p>
        <p>
          外来音は「ertg」を「FVWL」行、「/ 8 p y
          :」を「あいうえお」段と考えて、
          <br />
          (e/, e8, ep, ey, e:) =
          (ふぁ、ふぃ、ふ、ふぇ、ふぉ)のように入力できる。
        </p>
      </div>
    </div>
  );
}
function BunaLayout() {
  const diagrams = layoutDiagrams.buna;

  return (
    <div className="flex flex-col gap-6">
      <LayoutDiagramPanel diagrams={diagrams} />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">ぶな配列</h3>
        <LayoutMeta
          linkHref="http://keybor.blog96.fc2.com/blog-entry-107.html"
          linkLabel="ちょっと、かな配列 ぶな配列v2.0 (20180325-04版)"
        />
      </div>
      <div className="space-y-2">
        <p>作: keybor</p>
        <p>清濁別置、速度重視の計算配列。</p>
        <p>シフトは中指前置シフトで、同手シフトも使うことが特徴。</p>
        <p>
          2文字の連節の頻度と、2打鍵の所要時間をもとに、打鍵時間が最小になるように計算によって作られた。
        </p>
      </div>
    </div>
  );
}

function HidedukiLayout() {
  const diagrams = layoutDiagrams.hideduki;

  return (
    <div className="flex flex-col gap-6">
      <LayoutDiagramPanel diagrams={diagrams} />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">英月配列</h3>
        <LayoutMeta
          linkHref="https://x.com/madeinwariofan/status/1147041872583331842"
          linkLabel="英月配列（ひでづきはいれつ）v4.1"
        />
      </div>
      <div className="space-y-2">
        <p>作: ソケセテ</p>
        <p>30キーに収まるコンパクトな月配列。</p>
        <p>シフトは前置シフトで、清・濁・半濁・小書き同置。</p>
        <p>
          シフト面は逆手中指前置シフト、濁音はL前置シフト、半濁音と小書きは同手中指前置シフトで入力する。
        </p>
        <p>
          小書き、濁音、半濁音が排他的に配置されており、シフトを省略して2打鍵で入力できる。
        </p>
      </div>
    </div>
  );
}

function BurichutoroLayout() {
  const diagrams = layoutDiagrams["burichutoro-20221015"];

  return (
    <div className="flex flex-col gap-6">
      <LayoutDiagramPanel diagrams={diagrams} />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">ブリ中トロ配列</h3>
        <LayoutMeta
          linkHref="https://mobitan.hateblo.jp/entry/2022/11/30/221433"
          linkLabel="ブリ中トロ配列 3年目の改良（2022/10/15版）"
        />
      </div>
      <div className="space-y-2">
        <div>作: mobitan</div>
        <p>
          TRONかな配列をベースに、ハイブリッド月配列の句読点共有などのアイデアを取り入れた配列。
        </p>
        <p>「、」「。」の2キーが前置シフトキーを兼用している。</p>
        <p>
          拗音と外来音の入力方法についてはここでは省略するが、すべてのモーラを2打鍵以内で入力できる。
        </p>
        <p>
          他にも、ですます調の文章を効率的に打つためのショートカットが用意されている。
        </p>
      </div>
    </div>
  );
}

function TukiringoLayout() {
  const diagrams = layoutDiagrams.tukiringo;

  return (
    <div className="flex flex-col gap-6">
      <LayoutDiagramPanel diagrams={diagrams} />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">月林檎配列</h3>
        <LayoutMeta
          linkHref="https://menmentsu.hateblo.jp/entry/2021/01/12/230614"
          linkLabel="月林檎配列（上段中指シフト3段かな配列）"
        />
      </div>
      <div className="space-y-2">
        <div>作: めんめんつ</div>
        <p>
          清濁同置のシンプルな月配列。薙刀式や月見草配列に影響を受けている。
        </p>
        <p>シフトは後置シフトで、シフトキーは「ょ」「゛」の2つ。</p>
        <p>
          シフト面は「ょ」後置、濁音は「゛」後置で入力する。半濁点の代わりに
          ぱ行＝ま行＋濁点で入力する。
        </p>
        <p>濁音は排他的に配置されているため、シフトが省略可能。</p>
        <p>
          CapsLock/Control位置に
          \（バッククォート）を割り当てて使うことが想定されている。
        </p>
      </div>
    </div>
  );
}

function FumidukiLayout() {
  const diagrams = layoutDiagrams.fumiduki;

  return (
    <div className="flex flex-col gap-6">
      <LayoutDiagramPanel diagrams={diagrams} />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">文月配列</h3>
        <LayoutMeta
          linkHref="https://x.com/CordialBun/status/1974436234165625290"
          linkLabel="文月配列"
        />
      </div>
      <div className="space-y-2">
        <div>作: さんごぱん</div>
        <div>
          日本語の文章を楽しく、効率的に入力するために作られたかな入力配列。
        </div>
        <div>
          清・濁・半濁・小書き同置で、排他的配置によりすべてのかなを2打鍵以内で入力できる。
        </div>
        <p>シフトは前置で、シフトキーは中指と薬指の4つ。</p>
        <p>
          シフト面は中指逆手シフトで入力する。小書きは「っ」「ょ」は単打で、それ以外は中指同手シフトで入力する。
        </p>
        <p>
          濁音は「が」「で」は単打で、それ以外は逆手薬指シフトで入力する。半濁音は同手薬指シフトで入力する。
        </p>
      </div>
    </div>
  );
}

function LayoutFallback({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
      {label} の配列図は準備中です。
    </div>
  );
}

export function Layouts({ layoutId }: LayoutProps) {
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
}
