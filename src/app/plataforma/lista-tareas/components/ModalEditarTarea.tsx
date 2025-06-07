"use client";

import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input, Textarea, Button } from "@heroui/react";

interface ModalEditarTareaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (titulo: string, contenido: string) => void;
  initialTitle: string;
  initialContent: string;
}

export const ModalEditarTarea = ({
  isOpen,
  onClose,
  onSave,
  initialTitle,
  initialContent,
}: ModalEditarTareaProps) => {
  const [titulo, setTitulo] = useState(initialTitle);
  const [contenido, setContenido] = useState(initialContent);

  // Actualizar cuando abres otro modal
  useEffect(() => {
    setTitulo(initialTitle);
    setContenido(initialContent);
  }, [initialTitle, initialContent]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
      <ModalContent>
        <ModalHeader className="text-lg font-bold">Editar Tarea</ModalHeader>
        <ModalBody className="flex flex-col gap-2">
          <Input label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <Textarea label="Contenido" value={contenido} onChange={(e) => setContenido(e.target.value)} />
        </ModalBody>
<ModalFooter className="bg-white rounded-b-xl">
  <Button variant="ghost" onClick={onClose}>
    Cancelar
  </Button>
  <Button color="success" onClick={() => onSave(titulo, contenido)}>
    Guardar
  </Button>
</ModalFooter>

      </ModalContent>
    </Modal>
  );
};
