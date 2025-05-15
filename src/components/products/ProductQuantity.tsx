"use client";

import { useOrderStore } from "@/store";

interface Props {
  productId: number;
}

export const ProductQuantity: React.FC<Props> = ({ productId }) => {
  const { incraseProductQuantity, decraseProductQuantity, getProductInOrder } =
    useOrderStore();
  const productInOrder = getProductInOrder(productId);

  if (!productInOrder) return null;

  return (
    <span className="quantity-selector">
      <button
        type="button"
        className="quantity-left"
        id="decrease"
        onClick={() => decraseProductQuantity(productId)}
      >
        <i className="i-mdi-minus"></i>
      </button>
      <span className="quantity-numer" id="quantity">
        {productInOrder.quantity}
      </span>
      <button
        type="button"
        className="quantity-right"
        id="increase"
        onClick={() => incraseProductQuantity(productId)}
      >
        <i className="i-mdi-plus"></i>
      </button>
    </span>
  );
};
