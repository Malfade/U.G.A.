"use client";

const LEVEL_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: "ОТКРЫТЫЙ", color: "text-green-400" },
  1: { label: "ОГРАНИЧЕННЫЙ", color: "text-yellow-400" },
  2: { label: "СЕКРЕТНЫЙ", color: "text-orange-400" },
  3: { label: "СОВЕРШЕННО СЕКРЕТНЫЙ", color: "text-red-400" },
  4: { label: "ОСОБОЙ ВАЖНОСТИ", color: "text-red-500" },
};

export function AccessLevel({ level }: { level: number }) {
  const info = LEVEL_LABELS[level] ?? LEVEL_LABELS[0]!;
  return (
    <span className={`font-mono text-xs uppercase tracking-wider ${info.color}`}>
      [{info.label}]
    </span>
  );
}
