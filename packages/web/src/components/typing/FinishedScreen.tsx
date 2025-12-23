type FinishedScreenProps = {
  typed: string;
  onReset: () => void;
};

export const FinishedScreen = ({ typed, onReset }: FinishedScreenProps) => {
  return (
    <section className="border border-slate-200 bg-white/90 p-6 backdrop-blur">
      <div className="flex flex-col gap-3">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          Finished
        </div>
        <div className="text-2xl font-semibold text-slate-900">
          完了しました
        </div>
        <div className="text-sm text-slate-500">入力結果: {typed}</div>
        <button
          onClick={onReset}
          className="mt-2 w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"
        >
          リセット
        </button>
      </div>
    </section>
  );
};
