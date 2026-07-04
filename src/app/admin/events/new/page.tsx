import Link from "next/link";
import { EventForm } from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/events" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← СОБЫТИЯ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
          СОЗДАТЬ СОБЫТИЕ
        </h1>
      </div>
      <EventForm />
    </div>
  );
}
