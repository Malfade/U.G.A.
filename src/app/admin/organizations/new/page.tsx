import Link from "next/link";
import { OrganizationForm } from "@/components/admin/OrganizationForm";

export default function NewOrganizationPage() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/organizations" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← ОРГАНИЗАЦИИ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
          СОЗДАТЬ ОРГАНИЗАЦИЮ
        </h1>
      </div>
      <OrganizationForm />
    </div>
  );
}
