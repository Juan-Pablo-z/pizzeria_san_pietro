import { getTareaPorId, getUsuarios, getPrioridades } from "@/actions/tareas-actions";
import EditarTareaForm from "../components/EditarTareaForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function EditarTareaPage({ params }: PageProps) {
  const id = Number(params.id);

  if (isNaN(id)) return notFound();

  const tarea = await getTareaPorId(id);
  if (!tarea) return notFound();

  const [users, prioridades] = await Promise.all([
    getUsuarios(),
    getPrioridades(),
  ]);

  return (
    <EditarTareaForm
      tarea={tarea}
      users={users}
      prioridades={prioridades}
    />
  );
}
