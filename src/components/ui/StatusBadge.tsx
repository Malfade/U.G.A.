"use client";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-900/50 text-green-400 border-green-700",
  "активна": "bg-green-900/50 text-green-400 border-green-700",
  "активен": "bg-green-900/50 text-green-400 border-green-700",
  inactive: "bg-gray-800/50 text-gray-400 border-gray-600",
  missing: "bg-yellow-900/50 text-yellow-400 border-yellow-700",
  "пропал": "bg-yellow-900/50 text-yellow-400 border-yellow-700",
  "пропала": "bg-yellow-900/50 text-yellow-400 border-yellow-700",
  deceased: "bg-red-900/50 text-red-400 border-red-700",
  "мертв": "bg-red-900/50 text-red-400 border-red-700",
  "мертва": "bg-red-900/50 text-red-400 border-red-700",
  unknown: "bg-purple-900/50 text-purple-400 border-purple-700",
  "неизвестен": "bg-purple-900/50 text-purple-400 border-purple-700",
  threat: "bg-red-900/50 text-red-400 border-red-700",
  "угроза": "bg-red-900/50 text-red-400 border-red-700",
};

export function StatusBadge({ status }: { status: string | null | undefined }) {
  if (!status) {
    return (
      <span className="inline-block px-2 py-0.5 text-xs rounded border bg-gray-800/50 text-gray-500 border-gray-700">
        ██████
      </span>
    );
  }
  const color =
    STATUS_COLORS[status.toLowerCase()] ??
    "bg-gray-800/50 text-gray-300 border-gray-600";
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs rounded border font-mono uppercase tracking-wider ${color}`}
    >
      {status}
    </span>
  );
}
