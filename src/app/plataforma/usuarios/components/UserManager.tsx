"use client";

import { deleteUser, deleteUserAndTasks } from "@/actions/users-actions";
import { CustomTable } from "@/components/CustomTable";
import { ModalEliminarEmpleado } from "@/components/ModalEliminarEmpleado";
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
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<{
    ced: string;
    nombre: string;
  } | null>(null);

  const handleDeleteUser = async (cedUser: string) => {
    try {
      await deleteUser(cedUser);
      toast.success("✅ Empleado eliminado correctamente");
      setUsers((prev) => prev.filter((u) => u.ced_user !== cedUser));
    } catch (error: any) {
      if (
        error.message.includes("No puedes eliminar un usuario con tareas asignadas")
      ) {
        const confirm = window.confirm(
          "Este usuario tiene tareas asignadas. ¿Deseas eliminar también sus tareas?"
        );
        if (confirm) {
          try {
            await deleteUserAndTasks(cedUser);
            toast.success("✅ Empleado y sus tareas eliminados correctamente");
            setUsers((prev) => prev.filter((u) => u.ced_user !== cedUser));
          } catch {
            toast.error("❌ Error al eliminar usuario y tareas");
          }
        } else {
          toast.info("Operación cancelada");
        }
      } else {
        toast.error("❌ Error al eliminar el empleado");
      }
    }
  };

  return (
    <div className="main-container">
      <h1 className="title">Gestión de Empleados</h1>
      <div className="mt-4 flex flex-col gap-3">
        <div className="grid">
          <Link href={"/plataforma/usuarios/crear"}>
            <Button className="bg-green-500 text-white hover:bg-green-700">
              Crear empleado
            </Button>
          </Link>
        </div>
        <CustomTable
          emptyMessage="No hay empleados registrados"
          columns={[
            { header: "Cédula", accessor: "ced_user", type: "text" },
            { header: "Nombre", accessor: "nom_user", type: "text" },
            { header: "Correo", accessor: "email_user", type: "text" },
            { header: "Cargo", accessor: "dcar", type: "text" },
            {
              header: "Acción",
              accessor: "options",
              template: ({ ced_user, nom_user }: User) => (
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
                    onClick={() => {
                      setUsuarioAEliminar({ ced: ced_user, nombre: nom_user });
                      setModalAbierto(true);
                    }}
                    isIconOnly
                    size="sm"
                    aria-label="Eliminar"
                    className="bg-gray-100 hover:bg-red-600 text-gray-700 hover:text-white rounded-full shadow-md transition duration-200"
                  >
                    <i className="i-mdi-delete text-lg" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={users}
        />
      </div>

      <ModalEliminarEmpleado
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setUsuarioAEliminar(null);
        }}
        nombre={usuarioAEliminar?.nombre || ""}
        onConfirm={async () => {
          if (!usuarioAEliminar) return;
          await handleDeleteUser(usuarioAEliminar.ced);
          setModalAbierto(false);
          setUsuarioAEliminar(null);
        }}
      />
    </div>
  );
};

export default UserManager;
