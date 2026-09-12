import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";

export function SelectMenu({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
  icon?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const selectedIndex = Math.max(
    0,
    options.findIndex(([key]) => key === value),
  );
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    const buttons =
      root.current?.querySelectorAll<HTMLButtonElement>('[role="option"]');
    buttons?.[selectedIndex]?.focus();
    return () => document.removeEventListener("pointerdown", close);
  }, [open, selectedIndex]);
  return (
    <div
      ref={root}
      className={`shop-select-menu ${icon ? "shop-select-icon" : ""}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={icon ? "shop-sort-control" : "shop-select-trigger"}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        title={label}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {icon ?? (
          <>
            {options.find(([key]) => key === value)?.[1]}
            <ChevronDown size={14} />
          </>
        )}
      </button>
      {open && (
        <div
          id={id}
          role="listbox"
          aria-label={label}
          className="shop-select-options"
          onKeyDown={(event) => {
            const buttons = Array.from(
              event.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
            );
            const index = buttons.indexOf(
              document.activeElement as HTMLButtonElement,
            );
            if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              trigger.current?.focus();
            }
            if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? buttons.length - 1
                    : (index +
                        (event.key === "ArrowDown" ? 1 : -1) +
                        buttons.length) %
                      buttons.length;
              buttons[next]?.focus();
            }
          }}
        >
          {options.map(([key, text]) => (
            <button
              key={key}
              type="button"
              role="option"
              aria-selected={key === value}
              onClick={() => {
                onChange(key);
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              <span>{text}</span>
              {key === value && <Check size={14} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
