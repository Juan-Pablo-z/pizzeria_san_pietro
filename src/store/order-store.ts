import { ClientType, ProductOrdered, Recargo } from "@/interfaces";
import { create } from "zustand";

interface State {
  products: ProductOrdered[];
  clientType: ClientType | null;
}

interface Actions {
  addProductToOrder: (product: ProductOrdered) => void;
  incraseProductQuantity: (productId: number) => void;
  decraseProductQuantity: (productId: number) => void;
  removeProduct: (productId: number) => void;

  getProductInOrder: (productId: number) => ProductOrdered | undefined;

  clearOrder: () => void;
  setClientType: (clientType: ClientType) => void;

  getTotalPrice: () => number;

  calculateRecargo: (recargos: Recargo[]) => number;
}

export const useOrderStore = create<State & Actions>()((set, get) => ({
  products: [],
  clientType: null,
  addProductToOrder: (productOrdered: ProductOrdered) => {
    const { products } = get();

    // 1. Revisar si el producto existe en el carrito
    const productInOrder = products.some(
      (product) => product.cod_prod === productOrdered.cod_prod
    );

    if (!productInOrder) {
      set({ products: [...products, productOrdered] });
      return;
    }

    // 2. Si el producto existe en el carrito, actualizar la cantidad
    const updatedOrderProducts = products.map((product) => {
      if (product.cod_prod === productOrdered.cod_prod) {
        return {
          ...product,
          quantity: product.quantity + productOrdered.quantity,
        };
      }

      return product;
    });

    set({ products: updatedOrderProducts });
  },
  incraseProductQuantity: (productId: number) => {
    const { products } = get();
    const updatedOrderProducts = products.map((product) => {
      if (product.cod_prod === productId) {
        return {
          ...product,
          quantity: product.quantity + 1,
        };
      }
      return product;
    });

    set({ products: updatedOrderProducts });
  },
  decraseProductQuantity: (productId: number) => {
    const { products, removeProduct, getProductInOrder } = get();

    const product = getProductInOrder(productId);

    if (!product) return;

    if (product.quantity === 1) {
      return removeProduct(productId);
    }

    const updatedOrderProducts = products.map((product) => {
      if (product.cod_prod === productId) {
        return {
          ...product,
          quantity: product.quantity - 1,
        };
      }
      return product;
    });

    set({ products: updatedOrderProducts });
  },
  removeProduct: (productId: number) => {
    const { products } = get();
    const updatedOrderProducts = products.filter(
      (product) => product.cod_prod !== productId
    );

    set({ products: updatedOrderProducts });
  },
  getProductInOrder: (productId: number) => {
    const { products } = get();
    return products.find((product) => product.cod_prod === productId);
  },
  clearOrder: () => {
    set({ products: [] });
  },
  setClientType: (clientType: ClientType) => {
    set({ clientType });
  },
  getTotalPrice: () => {
    const { products, clientType } = get();

    const total = products.reduce((acc, product) => {
      const recargo = product.recargos.find(
        (recargo) => recargo.fkcod_tc_rec === clientType?.cod_tc
      ) || { recargo_cliente: 0 };
      return (
        acc + (product.precio_base + recargo.recargo_cliente) * product.quantity
      );
    }, 0);

    return total;
  },
  calculateRecargo: (recargos: Recargo[] = []) => {
    const { clientType } = get();
    if (!clientType) return 0;
    const recargo = recargos.find(
      (recargo) => recargo.fkcod_tc_rec === clientType.cod_tc
    );
    if (!recargo) return 0;
    return recargo.recargo_cliente;
  },
}));
