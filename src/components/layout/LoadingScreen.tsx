"use client";

import { useEffect, useState, useRef } from "react";

const BOOT_LINES = [
  { text: "UNIFIED GLOBAL ARCHIVE v7.4", delay: 0 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", delay: 100 },
  { text: "", delay: 200 },
  { text: "[ BOOT ] Инициализация ядра системы...", delay: 300 },
  { text: "[ OK   ] Модуль шифрования загружен", delay: 600 },
  { text: "[ OK   ] Подключение к узлам сети ARCHIVE_NET", delay: 900 },
  { text: "[ WARN ] Обнаружено 3 повреждённых сектора", delay: 1200 },
  { text: "[ OK   ] Загрузка базы данных сущностей", delay: 1500 },
  { text: "[ OK   ] Модуль фракционного доступа активирован", delay: 1800 },
  { text: "[ OK   ] Картографический модуль инициализирован", delay: 2000 },
  { text: "[ OK   ] ARG-подсистема блокировок готова", delay: 2200 },
  { text: "[ OK   ] Протокол объективной истины подключён", delay: 2400 },
  { text: "", delay: 2600 },
  { text: "[ SYS  ] Все модули загружены. Доступ разрешён.", delay: 2700 },
  { text: "", delay: 2900 },
  { text: "ДОБРО ПОЖАЛОВАТЬ, ОПЕРАТОР", delay: 3000 },
];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < BOOT_LINES.length; i++) {
      timers.push(setTimeout(() => {
        setVisibleLines(i + 1);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }, BOOT_LINES[i].delay));
    }

    timers.push(setTimeout(() => {
      setFadeOut(true);
    }, 3600));

    timers.push(setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 4200));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#050505] flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-1 bg-emerald-400/5 animate-scanline" />
      </div>

      {/* CRT vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <div className="w-full max-w-xl px-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="font-mono text-emerald-400 text-3xl tracking-[0.3em] font-bold">
              ◎ U.G.A.
            </div>
            <div className="font-mono text-emerald-400/40 text-[10px] tracking-[0.5em] mt-1">
              UNIFIED GLOBAL ARCHIVE
            </div>
          </div>
        </div>

        {/* Terminal output */}
        <div className="bg-black/50 border border-gray-800 rounded-lg p-4 font-mono text-xs mb-6 h-72 overflow-hidden relative">
          <div className="space-y-1">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className={`animate-fade-in ${
                  line.text.includes("[ WARN ]")
                    ? "text-amber-400"
                    : line.text.includes("ДОБРО ПОЖАЛОВАТЬ")
                    ? "text-emerald-400 text-sm font-bold mt-2"
                    : line.text.includes("━")
                    ? "text-gray-700"
                    : line.text.includes("UNIFIED")
                    ? "text-emerald-400/80"
                    : "text-gray-500"
                }`}
              >
                {line.text}
                {i === visibleLines - 1 && !fadeOut && (
                  <span className="inline-block w-2 h-3 bg-emerald-400 ml-1 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between font-mono text-[10px]">
            <span className="text-gray-600">ЗАГРУЗКА СИСТЕМЫ</span>
            <span className="text-emerald-400">{progress}%</span>
          </div>
          <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
        </div>

        {/* Classification notice */}
        <div className="mt-6 text-center">
          <div className="font-mono text-[9px] text-gray-700 tracking-widest">
            УРОВЕНЬ ДОПУСКА: СТАНДАРТНЫЙ • ПРОТОКОЛ: ОТКРЫТЫЙ КАНАЛ
          </div>
        </div>
      </div>
    </div>
  );
}
