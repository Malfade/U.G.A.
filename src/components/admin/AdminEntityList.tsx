"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface AdminEntityItem {
  id: string;
  title: string;
  subtitle?: string;
  status?: string | null;
  editHref: string;
  viewHref: string;
}

export function AdminEntityList({ items }: { items: AdminEntityItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border border-gray-800 rounded-lg px-4 py-3 hover:bg-gray-900/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div>
              <div className="font-mono text-sm text-gray-200">
                {item.title}
              </div>
              {item.subtitle && (
                <div className="font-mono text-xs text-gray-600">
                  {item.subtitle}
                </div>
              )}
            </div>
            {item.status && <StatusBadge status={item.status} />}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={item.viewHref}
              className="px-3 py-1 text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors"
            >
              ПРОСМОТР
            </Link>
            <Link
              href={item.editHref}
              className="px-3 py-1 text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-400/5 rounded transition-colors"
            >
              РЕДАКТИРОВАТЬ
            </Link>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-center py-8 font-mono text-xs text-gray-600">
          Нет записей
        </div>
      )}
    </div>
  );
}
