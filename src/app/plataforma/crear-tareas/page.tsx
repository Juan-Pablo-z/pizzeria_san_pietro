import { getUsers } from "@/actions/users-actions";
import CrearTareas from "./components/CrearTareas";
import { Divider } from "@heroui/react";

export default async function page() {
  const users = (await getUsers()) || [];
  return (
    <div className="main-container">
      <h1 className="title mb-4">Tomar pedido</h1>
      <Divider className="my-4" />
      <CrearTareas users={users} />
    </div>
  );
}
