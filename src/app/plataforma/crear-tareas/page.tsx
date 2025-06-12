import { getUsers } from "@/actions/users-actions";
import CrearTareas from "./components/CrearTareas";
import { Divider } from "@heroui/react";
import { get } from "http";
import { getPrioridades } from "@/actions/prioridad-actions";

export default async function page() {
  const users = (await getUsers()) || [];
  const prioridades = (await getPrioridades()) || [];
  return (
    <div className="main-container">
      <h1 className="title mb-4">Crear Tarea</h1>
      <Divider className="my-4" />
      <CrearTareas users={users} prioridades={prioridades} />
    </div>
  );
}
