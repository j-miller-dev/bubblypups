import React from 'react';
import {PhoneIcon} from '@heroicons/react/24/solid';

interface CallNowButtonProps {
    phoneNumber: string;
    className?: string;
}

export const CallNowButton: React.FC<CallNowButtonProps> = ({
                                                                phoneNumber = '555-123-4567',
                                                                className = ''
                                                            }) => {
    // Format phone number for tel: link (remove non-numeric characters)
    const formattedNumber = phoneNumber.replace(/\D/g, '');

    return (
        <a
            href={`tel:${formattedNumber}`}
            className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        bg-pink-500 hover:bg-pink-600
        text-white font-medium
        py-3 px-5 rounded-full
        shadow-lg hover:shadow-xl
        transition-all duration-300
        transform hover:scale-105
        animate-pulse hover:animate-none
        ${className}
      `}
            aria-label="Call now"
        >
            <PhoneIcon className="h-5 w-5"/>
            <span>Call Now</span>
        </a>
    );
};
