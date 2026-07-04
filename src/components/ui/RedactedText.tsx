"use client";

import { isRedacted } from "@/lib/redact";

interface RedactedTextProps {
  value: string | null | undefined;
  className?: string;
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3";
}

export function RedactedText({
  value,
  className = "",
  as: Tag = "span",
}: RedactedTextProps) {
  if (isRedacted(value)) {
    return (
      <Tag
        className={`redacted-dark inline-block px-1 rounded text-sm tracking-widest select-none ${className}`}
      >
        ████████████
      </Tag>
    );
  }

  return <Tag className={className}>{value}</Tag>;
}
