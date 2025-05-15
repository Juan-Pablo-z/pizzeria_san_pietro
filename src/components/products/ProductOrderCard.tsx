"use client";

import { Product } from "@/interfaces";
import { useOrderStore } from "@/store";
import { motion } from "framer-motion";
import React from "react";
import { ProductQuantity } from "./ProductQuantity";
import { formatMoney, getImage } from "@/helpers";
import { Button } from "@nextui-org/react";
import Image from "next/image";

interface Props {
  product: Product;
  inputText: string;
}

export const ProductOrderCard: React.FC<Props> = ({ product, inputText }) => {
  const { calculateRecargo } = useOrderStore();

  const {
    cod_prod,
    nom_prod,
    img_prod,
    dprod,
    precio_base,
    recargos = [],
  } = product;

  const { addProductToOrder, getProductInOrder } = useOrderStore();
  const productInOrder = getProductInOrder(cod_prod);

  const highlightMatches = (text: string, keyword: string) => {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi"); // Expresión regular para buscar todas las coincidencias
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleAddProduct = () => {
    addProductToOrder({
      cod_prod,
      nom_prod,
      precio_base,
      quantity: 1,
      img_prod,
      recargos,
    });
  };

  const productPrice = formatMoney(precio_base + calculateRecargo(recargos))

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      className="card-menu-meals"
    >
      <Image className="z-1" width={120} height={120} src={getImage(img_prod)} alt={nom_prod} />
      <div className="content-card">
        {/* Nombre con texto resaltado */}
        <h3>{highlightMatches(nom_prod, inputText)}</h3>{" "}
        {/* Descripción con texto resaltado */}
        {/* <p className="line-2">{highlightMatches(dprod, inputText)}</p>{" "} */}
        <p className="line-clamp-1 md:line-clamp-2">{dprod}</p>
        <div className="flex-1">

        </div>
        <div className="price-add-container">
          <span>{productPrice}</span>
          {productInOrder ? (
            <ProductQuantity productId={cod_prod} />
          ) : (
            <Button
              className="btn btn-primary"
              onClick={handleAddProduct}
            >
              Agregar
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
