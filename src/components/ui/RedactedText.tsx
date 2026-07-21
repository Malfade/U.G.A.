"use client";

import { isEmpty } from "@/lib/redact";

interface RedactedTextProps {
  value: string | null | undefined;
  className?: string;
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3";
}

/** Renders value as-is. Returns null if empty — never auto-redacts. */
export function RedactedText({
  value,
  className = "",
  as: Tag = "span",
}: RedactedTextProps) {
  if (isEmpty(value)) return null;
  return <Tag className={className}>{value}</Tag>;
}
