
'use client';
import { Eye, X } from "lucide-react";
import Image from "next/image";
const ImageModal = ({ image, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-80 flex items-center justify-center animate-fadeIn">
            <div className="relative w-full h-full max-w-5xl mx-auto p-4">
                <button
                    className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
                    onClick={onClose}
                >
                    <X size={30} />
                </button>

                <div className="relative w-full h-full max-h-[90vh]">
                    <Image
                        src={image}
                        alt="Full size"
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageModal;