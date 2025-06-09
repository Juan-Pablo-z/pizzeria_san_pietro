import { getCargos } from "@/actions/cargos.actions";
import { Metadata } from "next";
import { UserForm } from "../components/UserForm";
import { Divider } from "@heroui/react";

export const metadata: Metadata = {
  title: "Crear Usuario",
  description: "Crea un nuevo usuario",
};

const Page: React.FC = async () => {
  const [cargos] = await Promise.all([getCargos()]);
  if(!cargos) return null;
  return (
    <div className="main-container">
      <h1 className="title mb-4">Crear Usuario</h1>
      <Divider className="my-4"/>
      <UserForm cargos={cargos} />
    </div>
  );
};

export default Page;
