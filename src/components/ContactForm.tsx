"use client";

import { RESTAURANT_CONTACT } from "@/constants";
import { redirectWhatsApp } from "@/helpers";
import { Button } from "@nextui-org/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

export const ContactSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no debe exceder los 100 caracteres"),
  email: z
    .string()
    .email("Debe ser un correo electrónico válido")
    .max(100, "El correo electrónico no debe exceder los 100 caracteres"),
  message: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .max(400, "La contraseña no debe exceder los 400 caracteres"),
});

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({});

const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
  const { name, email, message } = data;

  try {
    const phone = RESTAURANT_CONTACT.PHONE_NUMBER;
    const text = `Hola soy *${name}*.\nMi correo electrónico es *${email}*.\n${message}`;
    const encodedText = encodeURIComponent(text);

    window.location.href = `/whatsapp?number=${phone}&text=${encodedText}`;
    reset();
  } catch (error) {
    console.error("Error al enviar mensaje a WhatsApp:", error);
  }
};


  return (
    <div className="contact-form">
      <form action="#" method="post" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          placeholder="Pepito Perez"
          {...register("name", { required: true })}
          required
        />

        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          placeholder="example@email.com"
          {...register("email", { required: true })}
          required
        />

        <label htmlFor="message">Mensaje</label>
        <textarea
          id="message"
          placeholder="Escriba aquí su mensaje..."
          {...register("message", { required: true })}
          required
        ></textarea>

        <Button className="btn btn-black" type="submit">
          Enviar
        </Button>
      </form>
    </div>
  );
};
