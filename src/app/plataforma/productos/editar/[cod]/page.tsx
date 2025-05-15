import { getCargos } from "@/actions/cargos.actions";
import { getUserByCed } from "@/actions/users-actions";
import { Metadata } from "next";
import ProductForm from "../../components/ProductForm";
import { getClientTypes } from "@/actions/client-types.actions";
import { getProductByCod } from "@/actions/products.actions";

export const metadata: Metadata = {
  title: "Editar Producto",
  description: "Edita un producto",
};

interface Props {
  params: {
    cod: string;
  };
}

const Page: React.FC<Props> = async ({ params: { cod } }) => {
  const [clientTypes, product] = await Promise.all([
    getClientTypes(),
    getProductByCod(cod),
  ]);
  if (!clientTypes || !product) return null;

  return (
    <div className="main-container">
      <h1 className="title">Editar Producto</h1>
      <ProductForm clientTypes={clientTypes} initialValues={product} />
    </div>
  );
};

export default Page;
