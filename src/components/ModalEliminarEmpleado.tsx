"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@nextui-org/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nombre: string;
}

export const ModalEliminarEmpleado = ({ isOpen, onClose, onConfirm, nombre }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" placement="center">
      <ModalContent>
        <ModalHeader className="text-xl font-bold text-red-600">
          Confirmar eliminación
        </ModalHeader>
        <ModalBody>
          <p>
            ¿Estás seguro de que deseas eliminar al empleado <strong>{nombre}</strong>? Esta acción no se puede deshacer.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onClick={onClose}>
            Cancelar
          </Button>
          <Button color="danger" onClick={onConfirm}>
            Sí, eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
