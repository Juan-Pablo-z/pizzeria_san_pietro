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
      toast.success("Empleado eliminado correctamente");
      setUsers((prevUsers) => prevUsers.filter((u) => u.ced_user !== cedUser));
    } catch (error) {
      toast.error("Error al eliminar el empleado");
    }
  };

  return (
    <div className="main-container">
      <h1 className="title">Gestión de Empleados</h1>
      <div className="mt-4 flex flex-col gap-3">
        <div className="grid">
          <Link href={"/plataforma/usuarios/crear"}>
            <Button className="bg-green-500 text-white hover:bg-green-700">Crear empleado</Button>
          </Link>
        </div>
        <CustomTable
          emptyMessage="No hay empleados registrados"
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
<div className="flex items-center justify-center gap-2">
  <Button
    as={Link}
    href={`/plataforma/usuarios/editar/${ced_user}`}
    isIconOnly
    size="sm"
    aria-label="Editar"
    className="bg-gray-100 hover:bg-green-500 text-gray-700 hover:text-white rounded-full shadow-md transition duration-200"
  >
    <i className="i-mdi-pencil text-lg" />
  </Button>

  <Button
    onClick={() => handleDeleteUser(ced_user)}
    isIconOnly
    size="sm"
    aria-label="Eliminar"
    className="bg-gray-100 hover:bg-red-600 text-gray-700 hover:text-white rounded-full shadow-md transition duration-200"
  >
    <i className="i-mdi-delete text-lg" />
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
