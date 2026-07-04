import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function HomePage() {
  const [charCount, eventCount, docCount, orgCount, locCount] =
    await Promise.all([
      prisma.character.count(),
      prisma.event.count(),
      prisma.document.count(),
      prisma.organization.count(),
      prisma.location.count(),
    ]);

  const recentEvents = await prisma.event.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, date: true },
  });

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <div className="font-mono text-gray-600 text-xs tracking-[0.3em] mb-2">
          ▪ СИСТЕМА ИНИЦИАЛИЗИРОВАНА ▪
        </div>
        <h1 className="font-mono text-3xl text-emerald-400 tracking-wider font-bold mb-1">
          UNIFIED GLOBAL ARCHIVE
        </h1>
        <div className="font-mono text-sm text-gray-500">
          Версия 7.4 // Статус сети: Частично восстановлена
        </div>
        <div className="font-mono text-xs text-gray-700 mt-2">
          Последний вход: Неизвестный пользователь
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        <StatCard label="ПЕРСОНАЖИ" count={charCount} href="/characters" icon="◉" />
        <StatCard label="СОБЫТИЯ" count={eventCount} href="/events" icon="◫" />
        <StatCard label="ДОКУМЕНТЫ" count={docCount} href="/documents" icon="▤" />
        <StatCard label="ОРГАНИЗАЦИИ" count={orgCount} href="/organizations" icon="⬡" />
        <StatCard label="ЛОКАЦИИ" count={locCount} href="/map" icon="◎" />
        <StatCard label="СЕТЬ СВЯЗЕЙ" count={"∞"} href="/graph" icon="◬" />
      </div>

      {recentEvents.length > 0 && (
        <div className="border border-gray-800 rounded-lg p-6">
          <h2 className="font-mono text-xs text-gray-500 tracking-widest mb-4">
            ПОСЛЕДНИЕ ИНЦИДЕНТЫ
          </h2>
          <div className="space-y-3">
            {recentEvents.map((ev) => (
              <Link
                key={ev.id}
                href={`/events/${ev.id}`}
                className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-900 transition-colors group"
              >
                <span className="font-mono text-sm text-gray-300 group-hover:text-emerald-400 transition-colors">
                  {ev.name}
                </span>
                <span className="font-mono text-xs text-gray-600">
                  {ev.date ?? "██████"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {charCount === 0 && (
        <div className="text-center mt-12 border border-dashed border-gray-800 rounded-lg p-8">
          <div className="font-mono text-gray-600 text-sm mb-2">
            АРХИВ ПУСТ
          </div>
          <div className="font-mono text-gray-700 text-xs mb-4">
            Данные ещё не загружены в систему
          </div>
          <Link
            href="/admin"
            className="inline-block px-4 py-2 bg-emerald-400/10 text-emerald-400 rounded font-mono text-xs hover:bg-emerald-400/20 transition-colors"
          >
            ПАНЕЛЬ УПРАВЛЕНИЯ →
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  count,
  href,
  icon,
}: {
  label: string;
  count: number | string;
  href: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 hover:bg-gray-900/50 transition-all group"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg text-gray-600 group-hover:text-emerald-400 transition-colors">
          {icon}
        </span>
        <span className="font-mono text-[10px] text-gray-600 tracking-widest">
          {label}
        </span>
      </div>
      <div className="font-mono text-2xl text-gray-300 group-hover:text-emerald-400 transition-colors">
        {count}
      </div>
    </Link>
  );
}
