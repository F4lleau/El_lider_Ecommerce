import { useParams } from "react-router-dom";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { AdminError, AdminLoading } from "@/components/admin/AdminState";
import { adminCategoriesApi } from "@/features/admin/api";
import { useAdminData } from "@/features/admin/use-admin-data";

export default function AdminCategoryFormPage() {
  const id = Number(useParams().id); const editing = Number.isInteger(id) && id > 0; const { data, isLoading, error } = useAdminData(editing ? () => adminCategoriesApi.get(id) : async () => null);
  if (isLoading) return <AdminLoading />; if (error) return <AdminError message={error} />;
  return <div><div className="mb-7"><span className="eyebrow">Catálogo</span><h1 className="section-title">{editing ? "Editar categoría" : "Nueva categoría"}</h1></div><CategoryForm category={data ?? undefined} /></div>;
}
