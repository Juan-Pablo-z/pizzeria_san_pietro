import { getCargos } from "@/actions/cargos.actions";
import { getUserByCed } from "@/actions/users-actions";
import { Metadata } from "next";
import { UserForm } from "../../components/UserForm";

export const metadata: Metadata = {
  title: "Editar Usuario",
  description: "Edita un usuario",
};

interface Props {
  params: {
    ced: string;
  };
}

const Page: React.FC<Props> = async ({ params: { ced } }) => {
  const [cargos, user] = await Promise.all([getCargos(), getUserByCed(ced)]);
  if (!cargos || !user) return null;

  return (
    <div className="main-container">
      <h1 className="title">Editar Usuario</h1>
      <UserForm cargos={cargos} initialValues={user} />
    </div>
  );
};

export default Page;
