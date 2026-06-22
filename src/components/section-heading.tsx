type SectionHeadingProps = {
  label: string;
  eyebrow?: string;
};

export function SectionHeading({ label, eyebrow }: SectionHeadingProps) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-400">
          <span className="h-px w-6 bg-emerald-500/60" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
        {label}
      </h2>
    </div>
  );
}
