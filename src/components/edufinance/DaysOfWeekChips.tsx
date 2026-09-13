import { cn } from "@/lib/utils";

const DOW = ["D", "S", "T", "Q", "Q", "S", "S"];
const DOW_LABELS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function DaysOfWeekChips({
  value,
  onChange,
}: {
  value: number[];
  onChange: (next: number[]) => void;
}) {
  const normalizedValue = Array.isArray(value)
    ? value.map((v) => Number(v)).filter((n) => !isNaN(n))
    : [];

  function toggle(dow: number) {
    const exists = normalizedValue.includes(dow);
    const next = exists
      ? normalizedValue.filter((d) => d !== dow)
      : [...normalizedValue, dow];
    onChange(next.sort((a, b) => a - b));
  }

  return (
    <div className="flex flex-wrap gap-2 py-1">
      {DOW.map((letter, i) => {
        const on = normalizedValue.includes(i);
        return (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(i);
            }}
            aria-label={DOW_LABELS[i]}
            aria-pressed={on}
            className={cn(
              "flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-xl font-bold text-sm transition-all select-none",
              "active:scale-95 touch-manipulation cursor-pointer border",
              on
                ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/25 ring-2 ring-primary/20"
                : "border-border/80 bg-background text-muted-foreground hover:bg-muted/70 hover:text-foreground hover:border-border"
            )}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}

export function formatDaysOfWeek(days: number[] | null | undefined): string {
  if (!days || days.length === 0) return "—";
  const abbr = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return [...days].sort().map((d) => abbr[d]).join(" · ");
}
