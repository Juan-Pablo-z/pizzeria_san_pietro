import { Metadata } from "next";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button, Divider } from "@heroui/react";
import { CardTarea } from "./components/CardTarea";
import "./css/estilos.css";


export const metadata: Metadata = {
  title: "Lista de Tareas",
};

const tareas = [
  { id: 1, title: "Tarea 1", content: "Contenido de la tarea 11" },
  { id: 2, title: "Tarea 2", content: "Contenido de la tarea 2" },
  { id: 3, title: "Tarea 3", content: "Contenido de la tarea 3" },
];

export default function ListaTareasPage() {
  return (
    <div className="main-container">
      <h1 className="title mb-4">Lista de Tareas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="w-auto h-auto card-animada-pendientes ">
          <CardHeader className="flex flex-col items-center bg-secondary text-white">
            <h2 className="text-lg font-semibold text-center">Pendientes</h2>
          </CardHeader>
          <CardBody className="flex flex-col items-center gap-2 p-4">
              {tareas.map((tarea) => (
                <CardTarea
                  key={tarea.id}
                  title={tarea.title}
                  content={tarea.content}
                  // onEdit={() => console.log("Editar tarea", tarea.id)}
                  // onDelete={() => console.log("Eliminar tarea", tarea.id)}
                />
              ))}
            {/* </div> */}
          </CardBody>
        </Card>
        <Card className="w-auto h-auto card-animada-proceso">
          <CardHeader className="flex flex-col items-center bg-gray text-white">
            <h2 className="text-lg font-semibold text-center">En Proceso</h2>
          </CardHeader>
          <CardBody>

          </CardBody>
        </Card>
        <Card className="w-auto h-auto card-animada-terminadas text-white">
          <CardHeader className="flex flex-col items-center bg-primary">
            <h2 className="text-lg font-semibold text-center">Terminadas</h2>
          </CardHeader>

          <CardBody>

          </CardBody>
        </Card>
      </div>
    </div>
  );
}
