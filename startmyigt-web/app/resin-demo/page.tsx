import { ArrowIcon, IconButton, PillButton, Toggle } from "@/components/resin";

export default function ResinDemoPage() {
  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center gap-6"
      style={{ background: "oklch(97% 0.003 280)" }}
    >
      <PillButton>Get Started</PillButton>
      <IconButton aria-label="Next">
        <ArrowIcon />
      </IconButton>
      <Toggle aria-label="Enable notifications" defaultChecked />
    </div>
  );
}
