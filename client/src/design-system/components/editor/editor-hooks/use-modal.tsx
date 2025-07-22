/* eslint-disable react-refresh/only-export-components */
import { JSX, useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/design-system/primitives/dialog";

const Modal = ({
  modalContent,
  onClose,
}: {
  modalContent: ModalContent | null;
  onClose: () => void;
}) => {
  if (modalContent === null) {
    return null;
  }
  const { title, content } = modalContent;
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

type ModalContent = {
  closeOnClickOutside: boolean;
  content: JSX.Element;
  title: string;
};

export const useEditorModal = (): [
  JSX.Element | null,
  (title: string, showModal: (onClose: () => void) => JSX.Element) => void,
] => {
  const [modalContent, setModalContent] = useState<null | ModalContent>(null);

  const onClose = useCallback(() => {
    setModalContent(null);
  }, []);

  const showModal = (
    title: string,
    getContent: (onClose: () => void) => JSX.Element,
    closeOnClickOutside = false,
  ) => {
    setModalContent({
      closeOnClickOutside,
      content: getContent(onClose),
      title,
    });
  };
  return [<Modal modalContent={modalContent} onClose={onClose} />, showModal];
};
