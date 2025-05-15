import ProductManager from "./components/ProductManager";
import { Metadata } from "next";
import { getClientTypes } from "@/actions/client-types.actions";
import { getProducts } from "@/actions/products.actions";

export const metadata: Metadata = {
  title: "Gestión de Productos",
  description: "Gestiona los productos del restaurante",
};

const Page: React.FC = async () => {
  const [products, clientTypes] = await Promise.all([
    getProducts({
      includeDeactivated: true,
      includeAdditionals: true,
    }),
    getClientTypes(),
  ]);

  if (!products || !clientTypes) return null;

  return <ProductManager products={products} clientTypes={clientTypes} />;
};

export default Page;
