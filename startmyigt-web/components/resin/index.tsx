"use client";

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/*
 * "Resin" material, in pure Tailwind utilities (no CSS module).
 * CSS custom properties are declared as Tailwind arbitrary-property
 * utilities on the root button, then read back via var() inside every
 * gradient/shadow arbitrary value below — retheme by overriding
 * --resin-hue / --resin-glow-hue (or any single --resin-* var).
 */
const RESIN_VARS = `
  [--resin-hue:290] [--resin-glow-hue:310]
  [--resin-body-top:oklch(34%_0.13_var(--resin-hue))]
  [--resin-body-bottom:oklch(20%_0.15_calc(var(--resin-hue)_+_2))]
  [--resin-glow:oklch(52%_0.24_var(--resin-glow-hue))]
  [--resin-rim:oklch(68%_0.22_calc(var(--resin-glow-hue)_+_6))]
  [--resin-body-top-h:oklch(40%_0.14_var(--resin-hue))]
  [--resin-body-bottom-h:oklch(24%_0.17_calc(var(--resin-hue)_+_2))]
  [--resin-glow-h:oklch(60%_0.27_var(--resin-glow-hue))]
  [--resin-rim-h:oklch(76%_0.23_calc(var(--resin-glow-hue)_+_6))]
  [--resin-body-top-a:oklch(26%_0.11_var(--resin-hue))]
  [--resin-body-bottom-a:oklch(16%_0.13_calc(var(--resin-hue)_+_2))]
  [--resin-glow-a:oklch(42%_0.19_var(--resin-glow-hue))]
  [--resin-shadow:oklch(18%_0.12_var(--resin-hue)/0.55)]
  [--resin-ambient:oklch(55%_0.22_calc(var(--resin-hue)_+_10)/0.38)]
  [--resin-focus-ring:oklch(85%_0.12_300/0.7)]
  [--resin-text:oklch(99%_0_0)]
  [--resin-text-shadow:oklch(15%_0.12_var(--resin-hue)/0.6)]
`;

const RESIN_BASE = `
  group relative inline-flex border-0 bg-transparent p-0 cursor-pointer
  [-webkit-tap-highlight-color:transparent] font-[inherit]
  disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none
`;

// Wide diffused ambient glow — a blurred layer sitting behind the body.
const AMBIENT = `
  pointer-events-none absolute inset-[-14px] z-0 opacity-75 blur-[11px]
  bg-[radial-gradient(closest-side,var(--resin-ambient)_0%,transparent_72%)]
  transition-[inset,opacity,filter] duration-[180ms] ease-out motion-reduce:transition-none
  group-hover:inset-[-20px] group-hover:opacity-95 group-hover:blur-[15px]
  group-active:inset-[-8px] group-active:opacity-50 group-active:blur-[8px]
`;

// The physical body: top specular strip + lower radial glow + base gradient,
// stacked as separate background layers (first listed paints on top).
const BODY = `
  relative z-[1] flex h-full w-full items-center justify-center
  transition-[transform,box-shadow,background] duration-[180ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]
  motion-reduce:transition-none
  bg-[linear-gradient(to_bottom,oklch(100%_0_0/0.32)_0%,transparent_16%),radial-gradient(120%_85%_at_50%_116%,var(--resin-glow)_0%,transparent_58%),linear-gradient(180deg,var(--resin-body-top)_0%,var(--resin-body-bottom)_100%)]
  shadow-[inset_0_-10px_14px_-6px_var(--resin-rim),inset_0_0_0_1px_oklch(100%_0_0/0.05),0_3px_5px_-2px_oklch(10%_0.06_var(--resin-hue)/0.5),0_16px_24px_-10px_oklch(12%_0.08_var(--resin-hue)/0.55)]
  group-hover:translate-y-[-1px]
  group-hover:bg-[linear-gradient(to_bottom,oklch(100%_0_0/0.42)_0%,transparent_22%),radial-gradient(135%_115%_at_50%_132%,var(--resin-glow-h)_0%,transparent_66%),linear-gradient(180deg,var(--resin-body-top-h)_0%,var(--resin-body-bottom-h)_100%)]
  group-hover:shadow-[inset_0_-16px_22px_-6px_var(--resin-rim-h),inset_0_0_0_1px_oklch(100%_0_0/0.08),0_4px_6px_-2px_oklch(10%_0.06_var(--resin-hue)/0.55),0_22px_32px_-10px_oklch(12%_0.08_var(--resin-hue)/0.6)]
  group-active:translate-y-[3px] group-active:scale-[0.985]
  group-active:bg-[linear-gradient(to_bottom,oklch(100%_0_0/0.14)_0%,transparent_10%),radial-gradient(100%_75%_at_50%_108%,var(--resin-glow-a)_0%,transparent_52%),linear-gradient(180deg,var(--resin-body-top-a)_0%,var(--resin-body-bottom-a)_100%)]
  group-active:shadow-[inset_0_-6px_10px_-4px_var(--resin-glow-a),inset_0_3px_6px_0_oklch(0%_0_0/0.4),0_6px_10px_-6px_oklch(12%_0.08_var(--resin-hue)/0.45)]
  group-focus-visible:shadow-[inset_0_-10px_14px_-6px_var(--resin-rim),inset_0_0_0_1px_oklch(100%_0_0/0.05),0_16px_24px_-10px_oklch(12%_0.08_var(--resin-hue)/0.55),0_0_0_3px_var(--resin-focus-ring)]
`;

const LABEL = `
  relative inline-flex items-center gap-2 whitespace-nowrap px-6
  text-[var(--resin-text)] text-[0.9375rem] font-semibold
  [text-shadow:0_1px_2px_var(--resin-text-shadow)]
`;

const ICON = `
  relative text-[var(--resin-text)] [filter:drop-shadow(0_1px_1px_var(--resin-text-shadow))]
`;

const KNOB = `
  absolute left-[5px] top-1/2 z-[2] h-[34px] w-[34px] -translate-y-1/2 translate-x-0 rounded-full
  bg-[radial-gradient(circle_at_35%_30%,oklch(100%_0_0)_0%,oklch(93%_0.004_280)_55%,oklch(85%_0.008_280)_100%)]
  shadow-[inset_0_1px_1px_oklch(100%_0_0/0.85),inset_0_-2px_3px_oklch(70%_0.015_280/0.5),0_2px_5px_oklch(20%_0.1_var(--resin-hue)/0.4),0_1px_2px_oklch(20%_0.1_var(--resin-hue)/0.3)]
  transition-transform duration-[180ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none
  group-data-[checked=true]:translate-x-9
  group-active:scale-[0.97]
`;

const PILL_RADIUS = "rounded-full";
const SQUARE_RADIUS = "rounded-[15px]";

type ResinButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function PillButton({ children, className, style, ...props }: ResinButtonProps) {
  return (
    <button
      {...props}
      className={cx(RESIN_VARS, RESIN_BASE, className)}
      style={{ minWidth: 132, height: 48, ...style }}
    >
      <span className={cx(AMBIENT, PILL_RADIUS)} aria-hidden />
      <span className={cx(BODY, PILL_RADIUS)}>
        <span className={LABEL}>{children}</span>
      </span>
    </button>
  );
}

export function IconButton({
  children,
  "aria-label": ariaLabel,
  className,
  style,
  ...props
}: ResinButtonProps & { "aria-label": string }) {
  return (
    <button
      {...props}
      aria-label={ariaLabel}
      className={cx(RESIN_VARS, RESIN_BASE, className)}
      style={{ width: 46, height: 46, ...style }}
    >
      <span className={cx(AMBIENT, SQUARE_RADIUS)} aria-hidden />
      <span className={cx(BODY, SQUARE_RADIUS)}>
        <span className={ICON}>{children}</span>
      </span>
    </button>
  );
}

export function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Toggle({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  "aria-label": ariaLabel,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label": string;
}) {
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const isChecked = checked ?? internal;

  function toggle() {
    if (disabled) return;
    const next = !isChecked;
    if (checked === undefined) setInternal(next);
    onCheckedChange?.(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={ariaLabel}
      disabled={disabled}
      data-checked={isChecked}
      onClick={toggle}
      className={cx(RESIN_VARS, RESIN_BASE, PILL_RADIUS)}
      style={{ width: 82, height: 44 }}
    >
      <span className={cx(AMBIENT, PILL_RADIUS)} aria-hidden />
      <span className={cx(BODY, PILL_RADIUS)}>
        <span className={KNOB} aria-hidden />
      </span>
    </button>
  );
}
