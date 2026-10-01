interface BrandLogoProps {
  tone?: "default" | "inverse";
  compact?: boolean;
}

/** A shared vector identity: a heart-shaped wish with a little spark of joy. */
export default function BrandLogo({
  tone = "default",
  compact = false,
}: BrandLogoProps) {
  return (
    <span
      className={`brand-logo brand-logo--${tone}${compact ? " brand-logo--compact" : ""}`}
    >
      <svg
        className="brand-logo__mark"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="2" y="2" width="44" height="44" rx="15" fill="currentColor" />
        <path
          d="M24 35.5C21.3 33.3 11.5 26.9 11.5 20.2C11.5 16.7 14.1 14 17.6 14C20.1 14 22.4 15.6 24 18C25.6 15.6 27.9 14 30.4 14C33.9 14 36.5 16.7 36.5 20.2C36.5 26.9 26.7 33.3 24 35.5Z"
          fill="#fff8ee"
        />
        <path
          d="M17 23L21.5 28L24 24.5L26.5 28L31 23"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35 6L36.5 10.5L41 12L36.5 13.5L35 18L33.5 13.5L29 12L33.5 10.5L35 6Z"
          fill="#f2dba5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="brand-logo__wordmark">
        wishly<span className="brand-logo__dot">.</span>
      </span>
    </span>
  );
}
