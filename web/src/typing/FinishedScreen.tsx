type FinishedScreenProps = {
  typed: string;
  onReset: () => void;
};

export const FinishedScreen = ({ typed, onReset }: FinishedScreenProps) => {
  return (
    <section className="py-6">
      <div className="flex flex-col gap-3">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          Finished
        </div>
        <div className="text-2xl font-semibold text-slate-900">
          お疲れ様でした
        </div>
        <button
          onClick={onReset}
          className="mt-2 w-fit rounded-full bg-slate-900 px-4 py-2 text-sm text-white"
        >
          リトライ
        </button>
      </div>
    </section>
  );
};
