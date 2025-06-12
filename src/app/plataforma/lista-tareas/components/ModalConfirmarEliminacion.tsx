"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalConfirmarEliminacion = ({ isOpen, onClose, onConfirm }: Props) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
      <ModalContent>
        <ModalHeader className="text-lg font-bold text-red-600">
          Confirmar Eliminación
        </ModalHeader>
        <ModalBody>
          <p>¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button color="danger" onClick={onConfirm}>
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
