type SectionHeadingProps = {
  label: string;
  eyebrow?: string;
};

export function SectionHeading({ label, eyebrow }: SectionHeadingProps) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">
        {label}
      </h2>
    </div>
  );
}
