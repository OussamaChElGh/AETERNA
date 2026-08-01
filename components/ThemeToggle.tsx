'use client';
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="inline-flex items-center justify-center p-2 text-brand-muted hover:text-brand-ink transition-colors"
      title="Alternar tema"
    >
      <div className="relative w-5 h-5">
        <Sun className="h-5 w-5 absolute transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
        <Moon className="h-5 w-5 absolute transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
      </div>
      <span className="sr-only">Alternar tema</span>
    </button>
  )
}
