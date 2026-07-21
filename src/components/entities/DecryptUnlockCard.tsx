"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLoreStore } from "@/lib/store";
import { CLEARANCE_LABELS, normalizeKey } from "@/lib/redact";

export interface UnlockData {
  id: string;
  title: string;
  grantsLevel: number;
  cipherText: string;
  solutionKey: string;
  rewardCode: string;
  hint: string | null;
}

export function DecryptUnlockCard({ unlock }: { unlock: UnlockData }) {
  const { hasSolvedUnlock, solveUnlock, raiseClearance, unlockKey, clearanceLevel } =
    useLoreStore();
  const [open, setOpen] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solved = hasSolvedUnlock(unlock.id);

  const tryDecrypt = () => {
    setError(null);
    if (normalizeKey(keyInput) !== normalizeKey(unlock.solutionKey)) {
      setError("Ключ не подходит. Ищите подсказку в других записях архива.");
      return;
    }
    solveUnlock(unlock.id);
    raiseClearance(unlock.grantsLevel);
    unlockKey(unlock.rewardCode);
    setSuccess(true);
  };

  const modal =
    mounted &&
    open &&
    createPortal(
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          aria-label="Закрыть"
          onClick={() => !success && setOpen(false)}
        />
        <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-amber-400/40 bg-gray-950 shadow-2xl shadow-amber-900/20">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-amber-400/20 bg-gray-950/95 px-6 py-4 backdrop-blur">
            <div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-amber-400/80">
                ТЕРМИНАЛ РАСШИФРОВКИ // CLEARANCE MODULE
              </div>
              <h2 className="mt-1 font-mono text-lg text-amber-400">{unlock.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono text-sm text-gray-500 transition-colors hover:text-gray-200"
            >
              [ ESC ]
            </button>
          </div>

          <div className="space-y-6 px-6 py-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-gray-800 bg-gray-900/40 p-4">
                <div className="mb-2 font-mono text-[10px] tracking-widest text-gray-600">
                  ЦЕЛЕВОЙ УРОВЕНЬ
                </div>
                <div className="font-mono text-sm text-amber-300">
                  L{unlock.grantsLevel} ·{" "}
                  {CLEARANCE_LABELS[unlock.grantsLevel] ?? unlock.grantsLevel}
                </div>
                {clearanceLevel >= unlock.grantsLevel && (
                  <p className="mt-2 font-mono text-[10px] text-gray-600">
                    Текущий допуск уже не ниже целевого (L{clearanceLevel})
                  </p>
                )}
              </div>
              <div className="border border-gray-800 bg-gray-900/40 p-4">
                <div className="mb-2 font-mono text-[10px] tracking-widest text-gray-600">
                  ПОДСКАЗКА
                </div>
                <p className="font-mono text-sm text-gray-400">
                  {unlock.hint || "Источник ключа не указан. Ищите в диалогах и документах."}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 font-mono text-[10px] tracking-widest text-gray-600">
                ШИФРТЕКСТ
              </div>
              <pre className="min-h-[140px] whitespace-pre-wrap break-words border border-gray-800 bg-black/60 p-5 font-mono text-sm leading-relaxed text-amber-100/80">
                {unlock.cipherText}
              </pre>
            </div>

            {!success ? (
              <div className="space-y-3 border border-gray-800 bg-gray-900/30 p-5">
                <label className="block font-mono text-[10px] tracking-widest text-gray-600">
                  КЛЮЧ РАСШИФРОВКИ
                </label>
                <input
                  autoFocus
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full border border-gray-700 bg-gray-950 px-4 py-3 font-mono text-base text-gray-100 outline-none focus:border-amber-400"
                  placeholder="Слово или фраза из архива…"
                  onKeyDown={(e) => e.key === "Enter" && tryDecrypt()}
                />
                {error && (
                  <p className="font-mono text-xs text-red-400">{error}</p>
                )}
                <button
                  type="button"
                  onClick={tryDecrypt}
                  className="w-full border border-amber-400/40 bg-amber-400/10 px-4 py-3 font-mono text-xs tracking-widest text-amber-400 transition-colors hover:bg-amber-400/20"
                >
                  ПРИМЕНИТЬ КЛЮЧ
                </button>
              </div>
            ) : (
              <div className="space-y-4 border border-emerald-400/30 bg-emerald-400/5 p-6 text-center">
                <div className="font-mono text-[10px] tracking-widest text-emerald-400/80">
                  РАСШИФРОВКА УСПЕШНА
                </div>
                <div className="font-mono text-xs text-gray-500">КОД ДОПУСКА</div>
                <code className="block font-mono text-2xl tracking-wider text-emerald-400">
                  {unlock.rewardCode}
                </code>
                <p className="font-mono text-xs text-gray-500">
                  Уровень допуска обновлён до L{unlock.grantsLevel}
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-2 border border-emerald-400/30 px-6 py-2 font-mono text-xs text-emerald-400 hover:bg-emerald-400/10"
                >
                  ЗАКРЫТЬ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <div className="my-3 border border-amber-400/30 bg-amber-400/5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 font-mono text-[10px] tracking-widest text-amber-400">
              ЗАШИФРОВАННЫЙ ФРАГМЕНТ
            </div>
            <h3 className="font-mono text-sm text-gray-200">{unlock.title}</h3>
            <p className="mt-1 font-mono text-[10px] text-gray-600">
              Открывает допуск:{" "}
              {CLEARANCE_LABELS[unlock.grantsLevel] ?? unlock.grantsLevel}
            </p>
          </div>
          {!solved && (
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                setError(null);
                setSuccess(false);
                setKeyInput("");
              }}
              className="shrink-0 bg-amber-400/10 px-3 py-1.5 font-mono text-[10px] text-amber-400 hover:bg-amber-400/20"
            >
              РАСШИФРОВАТЬ
            </button>
          )}
          {solved && (
            <span className="shrink-0 font-mono text-[10px] text-emerald-400">
              РАСШИФРОВАНО
            </span>
          )}
        </div>

        {solved && (
          <div className="mt-3 border-t border-amber-400/20 pt-3">
            <div className="mb-1 font-mono text-[10px] text-gray-600">КОД ДОПУСКА</div>
            <code className="font-mono text-sm text-emerald-400">{unlock.rewardCode}</code>
          </div>
        )}
      </div>
      {modal}
    </>
  );
}
