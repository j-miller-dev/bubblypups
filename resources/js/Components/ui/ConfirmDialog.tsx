import {
    Dialog,
    DialogActions,
    DialogDescription,
    DialogTitle,
} from "./Dialog";
import { Button } from "./Button";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    destructive?: boolean;
}

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Confirm",
    destructive = false,
}: Props) {
    return (
        <Dialog open={open} onClose={onClose} size="sm">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
            <DialogActions>
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    className={
                        destructive
                            ? "!bg-red-500 !text-white hover:!bg-red-600"
                            : ""
                    }
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
