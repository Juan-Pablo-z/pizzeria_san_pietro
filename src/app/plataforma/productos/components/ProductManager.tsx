"use client";

import { changeProductStatus, deleteProduct } from "@/actions/products.actions";
import { CustomTable } from "@/components/CustomTable";
import { Status } from "@/enum";
import { formatMoney } from "@/helpers";
import { ClientType, Product } from "@/interfaces";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  clientTypes: ClientType[];
  products: Product[];
}

const ProductManager: React.FC<Props> = ({
  clientTypes,
  products: initialProducts,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId);
      toast.success("Producto eliminado correctamente");
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.cod_prod !== productId)
      );
    } catch (error) {
      toast.error("Error al eliminar el producto");
    }
  };

  const handleChangeStatus = async (productId: number, status: Status) => {
    try {
      await changeProductStatus(productId, status);
      toast.success(
        `Producto ${
          status === Status.ACTIVO ? "activado" : "desactivado"
        } correctamente`
      );
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.cod_prod === productId ? { ...p, fkcods_prod: status } : p
        )
      );
    } catch (error) {
      toast.error("Error al cambiar el estado del producto");
    }
  };

  const clientTypesMap: Record<number, string> = useMemo(
    () =>
      clientTypes.reduce(
        (acc, clientType) => ({
          ...acc,
          [clientType.cod_tc]: clientType.dtipo_cliente,
        }),
        {}
      ),
    [clientTypes]
  );

  return (
    <div className="main-container">
      <h1 className="title">Gestión de Productos</h1>
      <div className="mt-4 flex flex-col gap-3">
        <div className="grid">
          <Link href={"/plataforma/productos/crear"}>
            <Button className="btn btn-black">Crear producto</Button>
          </Link>
        </div>
        <CustomTable
          emptyMessage="No hay productos registrados"
          columns={[
            { accessor: "img_prod", type: "icon", header: "i-mdi-image" },
            { header: "Nombre", accessor: "nom_prod", type: "text" },
            {
              header: "Precio",
              accessor: "precio_base",
              type: "price",
              align: "center",
              width: 100,
            },
            {
              header: "Recargos",
              accessor: "recargos",
              width: 100,
              template: ({ recargos, precio_base }: Product) => (
                <>
                  {recargos.length ? (
                    <Popover color="default">
                      <PopoverTrigger>
                        <Button size="sm" className="bg-light">
                          Mostrar
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="px-1 py-2">
                          <div className="text-small font-extrabold">
                            Recargos:
                          </div>
                          <hr className="text-zinc-200 my-0.5" />
                          {recargos.map(({ recargo_cliente, fkcod_tc_rec }) => (
                            <div
                              key={fkcod_tc_rec}
                              className="flex gap-2 justify-between"
                            >
                              <div>{clientTypesMap[fkcod_tc_rec]}:</div>
                              <div>
                                {formatMoney(precio_base + recargo_cliente)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    ""
                  )}
                </>
              ),
            },
            {
              header: "Acción",
              accessor: "options",
              width: 100,
              template: ({ fkcods_prod, cod_prod }: Product) => {
                return (
                  <div className="flex gap-2">
                    <Link 
                    href={`/plataforma/productos/editar/${cod_prod}`}
                    className="btn btn-icon btn-blue"
                    >
                      <i className="i-mdi-pencil" />
                    </Link>
                    {fkcods_prod === Status.ACTIVO ? (
                      <Tooltip
                        content="Desactivar"
                        placement="bottom"
                        className="bg-gray text-white"
                      >
                        <button
                          onClick={() =>
                            handleChangeStatus(cod_prod, Status.DESACTIVADO)
                          }
                          className="btn btn-icon btn-success"
                        >
                          <i className="i-mdi-check" />
                        </button>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        content="Activar"
                        placement="bottom"
                        className="bg-success text-white"
                      >
                        <button
                          onClick={() =>
                            handleChangeStatus(cod_prod, Status.ACTIVO)
                          }
                          className="btn btn-icon btn-disabled"
                        >
                          <i className="i-mdi-close" />
                        </button>
                      </Tooltip>
                    )}

                    <button
                      onClick={() => handleDeleteProduct(cod_prod)}
                      className="btn btn-icon btn-danger"
                    >
                      <i className="i-mdi-delete" />
                    </button>
                  </div>
                );
              },
            },
          ]}
          data={products}
        />
      </div>
    </div>
  );
};

export default ProductManager;
