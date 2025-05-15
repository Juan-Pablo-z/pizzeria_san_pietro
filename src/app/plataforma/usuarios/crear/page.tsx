import { getCargos } from "@/actions/cargos.actions";
import { Metadata } from "next";
import { UserForm } from "../components/UserForm";

export const metadata: Metadata = {
  title: "Crear Usuario",
  description: "Crea un nuevo usuario",
};

const Page: React.FC = async () => {
  const [cargos] = await Promise.all([getCargos()]);
  if(!cargos) return null;
  return (
    <div className="main-container">
      <h1 className="title">Crear Usuario</h1>
      <UserForm cargos={cargos} />
    </div>
  );
};

export default Page;
