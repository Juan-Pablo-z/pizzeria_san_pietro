import { getPedidosPendientes } from "@/actions/facturas.actions";
import { CocinaOrders } from "./components/CocinaOrders";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cocina",
  description: "Página de la cocina",
};

export default async function NamePage() {
  const [pedidos] = await Promise.all([getPedidosPendientes()]);

  if (!pedidos) return null;

  return (
    <div>
      <CocinaOrders orders={pedidos} />
    </div>
  );
}
