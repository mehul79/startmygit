// Tiny inline icon set — all currentColor, sized via props. ponytail: no icon lib.
type P = { size?: number; className?: string };
const base = (size = 16) => ({ width: size, height: size, "aria-hidden": true as const });

export const GitHubIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

export const StarIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
  </svg>
);

export const RepoIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
  </svg>
);

export const LockIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4Zm6.5 0a2.5 2.5 0 0 0-5 0v2h5Z" />
  </svg>
);

export const ArrowRightIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowUpRightIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 12 12 4M6 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronDownIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SunIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="3" />
    <path d="M8 .5v2M8 13.5v2M15.5 8h-2M2.5 8h-2M13.06 2.94l-1.42 1.42M4.36 11.64l-1.42 1.42M13.06 13.06l-1.42-1.42M4.36 4.36 2.94 2.94" strokeLinecap="round" />
  </svg>
);

export const MoonIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.5 1a6.5 6.5 0 1 0 7.4 9.9A6 6 0 0 1 6.5 1Z" />
  </svg>
);

export const CodeMarkIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m5 4-4 4 4 4M11 4l4 4-4 4M9.5 2.5l-3 11" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
