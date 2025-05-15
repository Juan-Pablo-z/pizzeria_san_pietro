import { getClientTypes } from "@/actions/client-types.actions";
import {
  getPedidosCaja,
  getPedidosPaginated,
} from "@/actions/facturas.actions";
import { PedidosTable } from "@/components/PedidosTable";
import { Metadata } from "next";
import { CajaTable } from "./CajaTable";

export const metadata: Metadata = {
  title: "Caja",
  description: "Caja y facturación del restaurante",
};

export default async function NamePage() {
  const [pedidos] = await Promise.all([getPedidosCaja()]);

  if (!pedidos) return null;

  return (
    <div className="main-container">
      <h1 className="title mb-4">Caja y facturación</h1>
      <CajaTable pedidos={pedidos} />
    </div>
  );
}
