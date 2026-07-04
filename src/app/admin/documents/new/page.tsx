import Link from "next/link";
import { DocumentForm } from "@/components/admin/DocumentForm";

export default function NewDocumentPage() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/documents" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← ДОКУМЕНТЫ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
          СОЗДАТЬ ДОКУМЕНТ
        </h1>
      </div>
      <DocumentForm />
    </div>
  );
}
