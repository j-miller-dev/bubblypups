import { useState, useRef } from "react";
import { router } from "@inertiajs/react";
import {
    HeartIcon,
    CameraIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

interface DogPhotoUploadProps {
    dog: {
        id: number;
        photo_url?: string;
        name: string;
    };
    size?: "sm" | "md" | "lg";
}

const sizeClasses = {
    sm: "size-16",
    md: "size-24",
    lg: "size-32",
};

const iconSizeClasses = {
    sm: "size-6",
    md: "size-10",
    lg: "size-14",
};

export default function DogPhotoUpload({
    dog,
    size = "md",
}: DogPhotoUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasPhoto = !!dog.photo_url;
    const displayUrl = preview || dog.photo_url;

    function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setIsUploading(true);

        router.post(
            route("my.dogs.photo.update", dog.id),
            { photo: file },
            {
                forceFormData: true,
                onSuccess: () => setPreview(null),
                onFinish: () => setIsUploading(false),
            }
        );
    }

    function handleDelete() {
        if (!hasPhoto) return;

        router.delete(route("my.dogs.photo.destroy", dog.id));
    }

    function triggerFileInput() {
        fileInputRef.current?.click();
    }

    return (
        <div className={`relative ${sizeClasses[size]} group`}>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleUpload}
                className="hidden"
            />

            {/* Photo or placeholder */}
            <div
                className={`${sizeClasses[size]} rounded-full overflow-hidden bg-brand-100 flex items-center justify-center`}
            >
                {displayUrl ? (
                    <img
                        src={displayUrl}
                        alt={dog.name}
                        className="size-full object-cover"
                    />
                ) : (
                    <HeartIcon
                        className={`${iconSizeClasses[size]} text-brand-400`}
                        aria-hidden
                    />
                )}
            </div>

            {/* Loading overlay */}
            {isUploading && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <div className="size-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Hover overlay with actions */}
            {!isUploading && (
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={triggerFileInput}
                        className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        title="Upload photo"
                    >
                        <CameraIcon className="size-5 text-white" />
                    </button>

                    {hasPhoto && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="p-1.5 rounded-full bg-white/20 hover:bg-red-500/80 transition-colors"
                            title="Delete photo"
                        >
                            <TrashIcon className="size-5 text-white" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
