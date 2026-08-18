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
            {/* Drag handle — mobile only */}
            <div className="mb-6 flex justify-center sm:hidden">
                <div className="h-1.5 w-12 rounded-full bg-gray-200" />
            </div>

            <DialogTitle className="text-xl sm:text-base/6">{title}</DialogTitle>
            <DialogDescription className="mt-3 text-base sm:text-sm">{description}</DialogDescription>

            <DialogActions className="mt-10 gap-4 sm:mt-8 sm:gap-3">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="!py-4 sm:!py-[calc(--spacing(1.5)-1px)]"
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    className={`!py-4 sm:!py-[calc(--spacing(2)-1px)] ${destructive ? "!bg-red-500 !text-white hover:!bg-red-600" : ""}`}
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
