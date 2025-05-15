import { getClientTypes } from "@/actions/client-types.actions";
import { Metadata } from "next";
import { TakeOrder } from "./components/TakeOrder";
import { getProducts } from "@/actions/products.actions";

export const metadata: Metadata = {
  title: "Tomar pedido",
};

export default async function TomarPedidoPage() {
  const [products, clientTypes] = await Promise.all([
    getProducts({
      includeAdditionals: true,
    }),
    getClientTypes(),
  ]);

  if (!products || !clientTypes) return null;

  return <TakeOrder products={products} clientTypes={clientTypes} />;
}
