"use client";

import { createProduct, updateProduct } from "@/actions/products.actions";
import { getImage } from "@/helpers";
import { ClientType, Product } from "@/interfaces";
import {
  Button,
  Card,
  Divider,
  Input,
  Switch,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  initialValues?: Partial<Product>;
  clientTypes: ClientType[];
}

import * as z from "zod";

const ProductSchema = z.object({
  nom_prod: z
    .string()
    .min(1, "El nombre del producto es obligatorio")
    .max(100, "El nombre no debe exceder los 100 caracteres"),
  dprod: z
    .string()
    .min(1, "La descripción del producto es obligatoria")
    .max(200, "La descripción no debe exceder los 200 caracteres"),
  precio_base: z
    .number({
      required_error: "El precio base es obligatorio",
      invalid_type_error: "El precio base debe ser un número",
    })
    .positive("El precio base debe ser mayor a 0"),
  img_prod: z.string().min(1, "Debes subir una imagen del producto"),
  recargos: z
    .array(
      z.object({
        fkcod_tc_rec: z.number().int(),
        recargo_cliente: z
          .number()
          .min(0, "El recargo debe ser mayor o igual a 0"),
      })
    )
    .optional(),
});

const ProductForm: React.FC<Props> = ({ initialValues, clientTypes }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Product>({
    defaultValues: {
      nom_prod: initialValues?.nom_prod || "",
      dprod: initialValues?.dprod || "",
      precio_base: initialValues?.precio_base || 0,
      recargos: initialValues?.recargos || [],
    },
  });

  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.img_prod ? getImage(initialValues?.img_prod) : null
  );
  const [recargos, setRecargos] = useState<Record<string, number>>(
    initialValues?.recargos?.reduce(
      (acc, recargo) => ({
        ...acc,
        [recargo.fkcod_tc_rec]: recargo.recargo_cliente,
      }),
      {}
    ) || {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isAdditional, setIsAdditional] = useState<boolean>(
    initialValues?.es_adicional || false
  );

  const onSubmit: SubmitHandler<Product> = async (data) => {
    const formattedRecargos = clientTypes
      .map((clientType) => ({
        fkcod_tc_rec: clientType.cod_tc,
        recargo_cliente: recargos[clientType.cod_tc] || 0,
      }))
      .filter((e) => e.recargo_cliente > 0);

    const productData = { ...data, recargos: formattedRecargos };

    try {
      if (initialValues?.cod_prod) {
        const formData = new FormData();
        formData.append("file", image!);
        setIsLoading(true);

        // Editar producto
        await updateProduct(
          initialValues.cod_prod,
          { ...productData, es_adicional: isAdditional },
          image ? formData : undefined
        );
        toast.success("Producto editado correctamente");
        router.push("/plataforma/productos");
        return;
      } else {
        if (!image) {
          return toast.error("Debes subir una imagen del producto");
        }

        try {
          ProductSchema.parse({ ...productData, img_prod: image.name });
        } catch (error) {
          console.log(error);
          if (error instanceof z.ZodError) {
            error.errors.forEach((err) => {
              toast.error(err.message);
            });
            return;
          }
        }

        const formData = new FormData();
        formData.append("file", image);
        setIsLoading(true);

        await createProduct(formData, {
          ...productData,
          es_adicional: isAdditional,
        });
        toast.success("Producto creado correctamente");
        router.push("/plataforma/productos");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (img) {
      const url = URL.createObjectURL(img);
      setImagePreview(url);
      setImage(img);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleRecargoChange = (cod_tc: number, valor: number) => {
    setRecargos((prev) => ({ ...prev, [cod_tc]: valor }));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 grid gap-4 animate__fade-in-up"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="p-4 flex-1">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-extrabold mb-2">Datos básicos</h2>
                <Divider />
              </div>
              <Input
                fullWidth
                labelPlacement="outside"
                size="md"
                label="Nombre"
                placeholder="Escribe el nombre del producto..."
                {...register("nom_prod", { required: true })}
                isDisabled={isLoading}
                isInvalid={!!errors.nom_prod}
                errorMessage={errors.nom_prod?.message}
                isRequired
              />

              <Textarea
                fullWidth
                labelPlacement="outside"
                size="md"
                label="Descripción"
                placeholder="Describe el producto..."
                {...register("dprod", { required: true })}
                isDisabled={isLoading}
                isInvalid={!!errors.dprod}
                errorMessage={errors.dprod?.message}
                isRequired
              />

              <Input
                fullWidth
                size="md"
                type="number"
                labelPlacement="outside"
                label="Precio base"
                placeholder="0"
                isDisabled={isLoading}
                {...register("precio_base", {
                  required: true,
                  valueAsNumber: true,
                })}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
                isInvalid={!!errors.precio_base}
                errorMessage={errors.precio_base?.message}
                isRequired
              />
            </div>
          </div>
        </Card>
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="p-4 md:w-full lg:w-[260px] flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-extrabold mb-2">Recargos</h2>
              <Divider />
            </div>
            {clientTypes.map((clientType) => (
              <div key={clientType.cod_tc}>
                <Input
                  fullWidth
                  labelPlacement="outside"
                  size="md"
                  type="number"
                  label={`${clientType.dtipo_cliente}:`}
                  placeholder="0"
                  value={recargos[clientType.cod_tc] + "" || ""}
                  onChange={(e) =>
                    handleRecargoChange(clientType.cod_tc, +e.target.value)
                  }
                  isDisabled={isLoading}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                />
              </div>
            ))}
            <Divider />
            <div className="flex justify-between items-center">
              <Switch
                size="sm"
                isSelected={isAdditional}
                onValueChange={setIsAdditional}
              >
                Es adicional
              </Switch>

              <Tooltip
                content={
                  <div>
                    <p className="text-xs w-[200px] p-2">
                      Si activas esta opción, el producto se mostrará como un
                      producto adicional en el menú. Ejemplo: Portacomida de
                      icopor.
                    </p>
                  </div>
                }
                placement="top"
              >
                <i className="i-mdi-info-circle-outline text-gray" />
              </Tooltip>
            </div>
          </Card>
          <Card className="p-4 gap-4">
            <div>
              <h2 className="text-xl font-extrabold mb-2">
                Imagen del producto
              </h2>
              <Divider />
            </div>
            <div className="flex">
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Imagen del producto"
                    className="object-cover rounded-xl border-light border"
                    width={260}
                    height={300}
                  />
                  <div className="absolute -top-2 -right-2 rounded-full bg-white ">
                    <Tooltip
                      content="Eliminar"
                      color="danger"
                      placement="bottom"
                    >
                      <button
                        onClick={handleDeleteImage}
                        className=" btn btn-icon btn-danger rounded-full"
                      >
                        <i className="i-mdi-close" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="h-[260px] w-full flex flex-col items-center justify-center aspect-square rounded-lg border-1.5 border-dashed border-neutral-300 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <i className="i-mdi-cloud-upload-outline text-neutral-400 text-6xl mb-2" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click para subir</span> la
                      imagen
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG o JPG (Max. 5MB)
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg"
                    onChange={handleUploadImage}
                  />
                </label>
              )}
            </div>
          </Card>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          isLoading={isLoading}
          isDisabled={isLoading || !isValid}
          className="btn btn-primary w-full lg:w-[292px]"
          type="submit"
        >
          {isLoading ? "Guardando producto..." : "Guardar producto"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
