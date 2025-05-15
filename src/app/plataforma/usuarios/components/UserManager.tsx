"use client";

import { deleteUser } from "@/actions/users-actions";
import { CustomTable } from "@/components/CustomTable";
import { User } from "@/interfaces";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  users: User[];
}

const UserManager: React.FC<Props> = ({ users: initialUsers }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleDeleteUser = async (cedUser: string) => {
    try {
      await deleteUser(cedUser);
      toast.success("Usuario eliminado correctamente");
      setUsers((prevUsers) => prevUsers.filter((u) => u.ced_user !== cedUser));
    } catch (error) {
      toast.error("Error al eliminar el usuario");
    }
  };

  return (
    <div className="main-container">
      <h1 className="title">Gestión de Usuarios</h1>
      <div className="mt-4 flex flex-col gap-3">
        <div className="grid">
          <Link href={"/plataforma/usuarios/crear"}>
            <Button className="btn btn-black">Crear usuario</Button>
          </Link>
        </div>
        <CustomTable
          emptyMessage="No hay usuarios registrados"
          columns={[
            { header: "Cedula", accessor: "ced_user", type: "text" },
            { header: "Nombre", accessor: "nom_user", type: "text" },
            { header: "Correo", accessor: "email_user", type: "text" },
            { header: "Cargo", accessor: "dcar", type: "text" },
            {
              header: "Acción",
              accessor: "options",
              template: ({ ced_user }: User) => {
                return (
                  <div className="flex gap-2">
                    <Button
                      as={Link}
                      href={`/plataforma/usuarios/editar/${ced_user}`}
                      size="sm"
                      isIconOnly
                      className="bg-blue text-white"
                    >
                      <i className="i-mdi-pencil" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteUser(ced_user)}
                      size="sm"
                      isIconOnly
                      className="bg-danger text-white"
                    >
                      <i className="i-mdi-delete" />
                    </Button>
                  </div>
                );
              },
            },
          ]}
          data={users}
        />
      </div>
    </div>
  );
};

export default UserManager;
