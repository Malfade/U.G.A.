import Link from "next/link";
import { LocationForm } from "@/components/admin/LocationForm";

export default function NewLocationPage() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/locations" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← ЛОКАЦИИ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
          СОЗДАТЬ ЛОКАЦИЮ
        </h1>
      </div>
      <LocationForm />
    </div>
  );
}
