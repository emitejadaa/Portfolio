type SectionHeadingProps = {
  index: string;
  label: string;
  title?: string;
};

/** "01 / STACK" mono eyebrow + optional headline, baseline-aligned. */
export function SectionHeading({ index, label, title }: SectionHeadingProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 16,
        marginBottom: title ? 36 : 30,
        flexWrap: "wrap",
      }}
    >
      <span className="et-eyebrow">
        {index} / {label}
      </span>
      {title && (
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>
      )}
    </div>
  );
}
