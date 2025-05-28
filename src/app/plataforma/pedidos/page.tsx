import { getClientTypes } from "@/actions/client-types.actions";
import { getPedidosPaginated } from "@/actions/facturas.actions";
import { Metadata } from "next";
import { PedidosManager } from "./components/PedidosManager";

export const metadata: Metadata = {
  title: "Pedidos",
  description: "Página de pedidos",
};

interface Props {
  searchParams: {
    page?: number;
    limit?: number;
    fktc_fac?: string;
    sortDirection?: "asc" | "desc";
    startDate?: string;
    endDate?: string;
  };
}

export default async function NamePage({ searchParams }: Props) {
  const {
    page = 1,
    limit = 10,
    fktc_fac,
    sortDirection = "desc",
    startDate,
    endDate,
  } = searchParams;

  const [{ data, totalPages }, clientTypes]: any[] = await Promise.all([
    getPedidosPaginated({
      page,
      limit,
      fktc_fac,
      sortDirection,
      startDate,
      endDate,
    }),
    getClientTypes(),
  ]);

  return (
    <div className="main-container">
      <h1 className="title mb-4">Lista de Tareas</h1>
      <PedidosManager
        pedidos={data}
        totalPages={totalPages}
        clientTypes={[
          {
            cod_tc: "all",
            dtipo_cliente: "Todos",
          } as any,
          ...clientTypes,
        ]}
        filters={{
          currentPage: +page,
          pageSize: limit,
          fktc_fac,
          sortDirection,
          startDate,
          endDate,
        }}
      />
    </div>
  );
}
