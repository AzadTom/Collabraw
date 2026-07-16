import { cn } from "@/lib/utils";
import { useTheme } from "../ThemeProvider/ThemeProvider";
import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      className={cn(
        className,
        "w-[60px] h-[32px] flex rounded-full bg-[var(--background)] hover:bg-[var(--background)] border border-[var(--muted-foreground)] relative overflow-hidden"
      )}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span
        className={cn(
          "absolute top-0 left-0 size-[30px] flex justify-center items-center rounded-full bg-[#a5a5a5] text-[var(--foreground)] transition-all duration-300 ease-in-out",
          isDark ? "translate-x-[28px]" : "translate-x-0"
        )}
      >
        {isDark ? (
          <Moon className="transition-opacity duration-300" size={20} />
        ) : (
          <Sun className="transition-opacity duration-300" size={20} />
        )}
      </span>
    </Button>
  );
};
