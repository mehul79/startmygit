"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));

    function onKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() !== "d") return;
      setDark((prev) => {
        const next = !prev;
        applyTheme(next);
        return next;
      });
    }

    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  function toggle() {
    setDark((prev) => {
      const next = !prev;
      applyTheme(next);
      return next;
    });
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${dark ? "light" : "dark"} theme (press D)`}
      title="Toggle theme (D)"
      className="flex items-center border-l border-rule px-4 text-ink-muted transition-colors hover:text-orange"
    >
      {dark ? <SunIcon size={17} /> : <MoonIcon size={17} />}
    </button>
  );
}
