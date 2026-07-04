import Link from "next/link";
import { FactionForm } from "@/components/admin/FactionForm";

export default function NewFactionPage() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/factions" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← ФРАКЦИИ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">НОВАЯ ФРАКЦИЯ</h1>
      </div>
      <FactionForm />
    </div>
  );
}
