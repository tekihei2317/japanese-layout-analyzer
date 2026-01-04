import { type LayoutId } from "@japanese-layout-analyzer/core";
import { words } from "./words";

const layoutOptions: { id: LayoutId; label: string }[] = [
  { id: "qwerty", label: "QWERTY" },
  { id: "oonisi", label: "大西配列" },
  { id: "hana", label: "花配列" },
  { id: "tsuki-2-263", label: "月配列2-263式" },
  { id: "yukika", label: "幸花配列" },
  { id: "mizunara", label: "ミズナラ配列" },
  { id: "hybrid-tsuki", label: "ハイブリッド月配列" },
  { id: "buna", label: "ぶな配列" },
  { id: "hideduki", label: "英月配列" },
  { id: "burichutoro-20221015", label: "ブリ中トロ配列 2022/10/15版" },
  { id: "tsukimisou", label: "月見草配列 v2" },
  { id: "tukiringo", label: "月林檎配列" },
  { id: "fumiduki", label: "文月配列" },
];

const durations = [15, 30, 60, 120];

export type Settings = {
  wordSetId: keyof typeof words;
  durationSec: number;
  layoutId: LayoutId;
};

type SettingPanelProps = {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
};

export const SettingPanel = ({ settings, setSettings }: SettingPanelProps) => {
  return (
    <section>
      <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-[1.2fr_1fr_1fr] sm:items-center">
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400">
            配列
          </span>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            value={settings.layoutId}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                layoutId: event.target.value as LayoutId,
              }))
            }
          >
            {layoutOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400">
            ワード
          </span>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            value={settings.wordSetId}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                wordSetId: event.target.value as keyof typeof words,
              }))
            }
          >
            <option value="aozora">青空文庫（小説）</option>
            <option value="typewell">タイプウェル 基本常用語</option>
          </select>
        </label>
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400">
            制限時間（秒）
          </span>
          <div className="flex flex-wrap gap-2">
            {durations.map((durationSec) => (
              <button
                key={durationSec}
                type="button"
                onClick={() =>
                  setSettings((prev) => ({ ...prev, durationSec }))
                }
                className={`rounded-full px-3 py-1 text-sm transition ${
                  settings.durationSec === durationSec
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {durationSec}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
