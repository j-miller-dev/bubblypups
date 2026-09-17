import type { ReactNode } from "react";

export interface ModalProps {
    children: ReactNode;
    show?: boolean;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
    closeable?: boolean;
    onClose?: () => void;
}

declare const Modal: (props: ModalProps) => JSX.Element;

export default Modal;
