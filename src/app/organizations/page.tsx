import { prisma } from "@/lib/db";
import Link from "next/link";
import { RedactedText } from "@/components/ui/RedactedText";

export default async function OrganizationsPage() {
  const orgs = await prisma.organization.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-mono text-xl text-gray-200 tracking-wider">
          ⬡ ОРГАНИЗАЦИИ
        </h1>
        <p className="font-mono text-xs text-gray-600 mt-1">
          Записей: {orgs.length}
        </p>
      </div>

      <div className="archive-grid">
        {orgs.map((org) => (
          <Link
            key={org.id}
            href={`/organizations/${org.id}`}
            className="border border-gray-800 rounded-lg p-4 hover:border-gray-600 hover:bg-gray-900/50 transition-all group"
          >
            <h2 className="font-mono text-sm text-gray-200 group-hover:text-emerald-400 transition-colors mb-2">
              {org.name}
            </h2>
            <RedactedText
              value={org.description}
              className="text-xs text-gray-500 line-clamp-3"
              as="p"
            />
            {org.foundedDate && (
              <div className="font-mono text-[10px] text-gray-600 mt-3">
                Основана: {org.foundedDate}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
