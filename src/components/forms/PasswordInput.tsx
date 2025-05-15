"use client";

import { Input, InputProps } from "@nextui-org/react";
import { useState } from "react";

interface Props extends InputProps {
  register: any;
}

export const PasswordInput: React.FC<Props> = ({ register, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      fullWidth
      labelPlacement="outside"
      size="md"
      label="Contraseña"
      placeholder="*********"
      isRequired
      type={isVisible ? "text" : "password"}
      autoComplete="current-password"
      endContent={
        <button
          className="focus:outline-none h-6 w-6"
          type="button"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
          {isVisible ? (
            <i className="i-mdi-eye-off text-2xl text-default-400 pointer-events-none" />
          ) : (
            <i className="i-mdi-eye text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      {...register}
      {...props}
    />
  );
};
