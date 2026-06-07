import {
    Dialog,
    DialogTitle,
    DialogBody,
    DialogActions,
} from "@/Components/ui/Dialog";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerName: string;
    email: string | null;
    phone: string | null;
}

export default function ContactModal({
    isOpen,
    onClose,
    customerName,
    email,
    phone,
}: ContactModalProps) {
    return (
        <Dialog open={isOpen} onClose={onClose} size="md">
            <DialogTitle>Contact Customer</DialogTitle>

            <DialogBody>
                <div className="space-y-3">
                    <p className="font-display font-extrabold text-gray-900 text-base">
                        {customerName}
                    </p>

                    {email && (
                        <a
                            href={`mailto:${email}`}
                            className="flex items-center gap-3 rounded-card border border-brand-100 bg-brand-50 p-3 hover:bg-brand-100 transition-colors group"
                        >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-button bg-brand-100 group-hover:bg-brand-200 transition-colors">
                                <EnvelopeIcon className="size-4 text-brand-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-display font-extrabold text-gray-400 uppercase tracking-wide">
                                    Email
                                </p>
                                <p className="text-sm font-display font-extrabold text-brand-600 truncate">
                                    {email}
                                </p>
                            </div>
                        </a>
                    )}

                    {phone && (
                        <a
                            href={`tel:${phone}`}
                            className="flex items-center gap-3 rounded-card border border-green-100 bg-green-50 p-3 hover:bg-green-100 transition-colors group"
                        >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-button bg-green-100 group-hover:bg-green-200 transition-colors">
                                <PhoneIcon className="size-4 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-display font-extrabold text-gray-400 uppercase tracking-wide">
                                    Phone
                                </p>
                                <p className="text-sm font-display font-extrabold text-green-700">
                                    {phone}
                                </p>
                            </div>
                        </a>
                    )}

                    {!email && !phone && (
                        <p className="py-6 text-center text-sm text-gray-400 font-display font-extrabold">
                            No contact information available.
                        </p>
                    )}
                </div>
            </DialogBody>

            <DialogActions>
                <button type="button" onClick={onClose} className="btn-outline">
                    Close
                </button>
                {email && (
                    <a
                        href={`mailto:${email}`}
                        className="btn-secondary inline-flex items-center gap-2"
                    >
                        <EnvelopeIcon className="size-4" />
                        Send Email
                    </a>
                )}
                {phone && (
                    <a
                        href={`tel:${phone}`}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <PhoneIcon className="size-4" />
                        Call
                    </a>
                )}
            </DialogActions>
        </Dialog>
    );
}
