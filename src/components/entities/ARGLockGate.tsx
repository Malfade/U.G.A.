"use client";

import { useState } from "react";
import { useLoreStore } from "@/lib/store";
import { DamagedDocument } from "./DamagedDocument";

interface ARGLockProps {
  locks: { id: string; keyRequired: string; hint: string | null }[];
  content: string;
  damagePercent: number;
}

export function ARGLockGate({ locks, content, damagePercent }: ARGLockProps) {
  const { hasKey, unlockKey } = useLoreStore();
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState(false);

  const allUnlocked = locks.every((lock) => hasKey(lock.keyRequired));

  if (allUnlocked) {
    return <DamagedDocument content={content} damagePercent={damagePercent} />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = inputCode.trim().toUpperCase();
    const matchingLock = locks.find((l) => l.keyRequired === code);
    if (matchingLock) {
      unlockKey(code);
      setInputCode("");
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="border border-red-900/50 rounded-lg p-6 bg-red-950/10">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🔒</div>
        <div className="font-mono text-sm text-red-400 mb-1">
          ОШИБКА ДОСТУПА
        </div>
        <div className="font-mono text-xs text-gray-500">
          Для просмотра требуется ключ доступа
        </div>
      </div>

      {locks.map((lock) => (
        <div key={lock.id} className="mb-4">
          {lock.hint && (
            <div className="font-mono text-xs text-gray-600 mb-2">
              Подсказка: {lock.hint}
            </div>
          )}
          {hasKey(lock.keyRequired) ? (
            <div className="font-mono text-xs text-green-400">
              ✓ Ключ {lock.keyRequired} применён
            </div>
          ) : (
            <div className="font-mono text-xs text-red-400">
              ✗ Требуется: ключ доступа
            </div>
          )}
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="ВВЕДИТЕ КОД ДОСТУПА"
          className={`flex-1 bg-gray-950 border rounded px-3 py-2 font-mono text-sm text-gray-200 placeholder-gray-700 focus:outline-none focus:border-emerald-400 transition-colors ${
            error ? "border-red-500 animate-glitch" : "border-gray-800"
          }`}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded font-mono text-xs text-gray-300 hover:bg-gray-800 hover:text-emerald-400 transition-colors"
        >
          ВВОД
        </button>
      </form>

      {error && (
        <div className="font-mono text-xs text-red-400 mt-2 animate-glitch">
          ✗ НЕВЕРНЫЙ КОД ДОСТУПА
        </div>
      )}
    </div>
  );
}
