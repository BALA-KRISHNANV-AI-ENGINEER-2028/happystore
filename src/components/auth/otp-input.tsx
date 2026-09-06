import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}

export function OtpInput({ length = 6, value, onChange, invalid }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  function setDigit(index: number, digit: string) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(""));
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      e.preventDefault();
      onChange(pasted.padEnd(length, "").slice(0, length).trimEnd());
      refs.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  }

  return (
    <div className="flex gap-2.5" onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            "h-12 w-11 rounded-md border bg-surface text-center font-mono text-heading-sm font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:border-primary",
            invalid ? "border-error" : "border-border-strong",
          )}
        />
      ))}
    </div>
  );
}
