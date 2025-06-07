import { Cargos } from "@/enum/cargos.enum";
import { Card, CardBody, cn, Divider } from "@nextui-org/react";
import Link from "next/link";

const MENU_ITEMS = [
  {
    icon: "i-mdi-users-group",
    name: "Empleados",
    href: "/plataforma/usuarios",
    roles: [Cargos.ADMIN],
  },
  {
    icon: "i-mdi-file-document-plus-outline",
    name: "Nueva tarea",
    href: "/plataforma/tomar-pedido",
    roles: [Cargos.ADMIN, Cargos.MESERA],
  },
  {
    icon: "i-mdi-file-chart-outline",
    name: "Reportes",
    href: "/plataforma/reportes",
    roles: [Cargos.ADMIN],
  },
  {
    icon: "i-mdi-clipboard-text-clock-outline",
    name: "Tareas",
    href: "/plataforma/lista-tareas",
    roles: [Cargos.ADMIN, Cargos.COCINERA_JEFE, Cargos.COCINERA, Cargos.MESERA],
  },
];

export default function DashboardPage() {
  return (
    <div className="main-container">
      <h1 className="title">Bienvenido a Pizzeria San pietro</h1>
      <Divider className="my-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MENU_ITEMS.map(({ href, icon, name }) => (
          <Card key={href} as={Link} href={href} className="bg-dark hover:bg-green-700 text-white">
            <CardBody className="text-center">
              <div>
                <i className={cn(icon, "text-6xl")} />
              </div>
              <h3 className="text-lg">{name}</h3>
            </CardBody>
          </Card>
        ))}
      </div>
      <Divider className="my-4" />
    </div>
  );
}
