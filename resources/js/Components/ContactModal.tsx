import {
    Dialog,
    DialogTitle,
    DialogBody,
    DialogActions,
} from "@/Components/ui/Dialog";
import { Button } from "@/Components/ui/Button";
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
    const handleEmail = () => {
        if (email) {
            window.location.href = `mailto:${email}`;
        }
    };

    const handleCall = () => {
        if (phone) {
            window.location.href = `tel:${phone}`;
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} size="md">
            <DialogTitle>Contact Customer</DialogTitle>

            <DialogBody>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {customerName}
                        </h3>
                    </div>

                    {email && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <EnvelopeIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700">
                                    Email
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                    {email}
                                </p>
                            </div>
                        </div>
                    )}

                    {phone && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <PhoneIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700">
                                    Phone
                                </p>
                                <p className="text-sm text-gray-600">
                                    {phone}
                                </p>
                            </div>
                        </div>
                    )}

                    {!email && !phone && (
                        <p className="text-sm text-gray-500 text-center py-4">
                            No contact information available for this customer.
                        </p>
                    )}
                </div>
            </DialogBody>

            <DialogActions>
                <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
                    Close
                </Button>
                {email && (
                    <Button
                        onClick={handleEmail}
                        className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2"
                    >
                        <EnvelopeIcon className="h-4 w-4" />
                        Send Email
                    </Button>
                )}
                {phone && (
                    <Button
                        onClick={handleCall}
                        className="bg-green-600 hover:bg-green-700 text-white inline-flex items-center gap-2"
                    >
                        <PhoneIcon className="h-4 w-4" />
                        Call
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
