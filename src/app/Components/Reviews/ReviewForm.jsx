'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { FiUpload, FiImage, FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ReviewForm = ({ onSubmitSuccess }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const checkAuth = async () => {
        if (status === 'unauthenticated') {
            const result = await Swal.fire({
                title: 'Sign In Required',
                text: 'You need to be signed in to submit a review. Would you like to sign up now?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Sign Up',
                cancelButtonText: 'Cancel',
            });

            if (result.isConfirmed) {
                router.push('/signup');
            }
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check authentication first
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) return;

        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append('userEmail', session.user.email);
            formData.append('userName', session.user.name);
            formData.append('rating', rating.toString());
            formData.append('comment', comment);
            if (image) formData.append('image', image);

            const response = await fetch('/api/reviews', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit review');
            }

            toast.success('Review submitted!');
            setRating(0);
            setComment('');
            setImage(null);
            if (onSubmitSuccess) onSubmitSuccess();
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.message);
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Toaster position="top-right" />
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500">{error}</p>}

                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <button
                            type="button"
                            key={i}
                            className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            onClick={() => setRating(i + 1)}
                        >
                            ★
                        </button>
                    ))}
                </div>

                <textarea
                    className="w-full border rounded p-2"
                    placeholder="Your review"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={4}
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Upload Image (Optional)
                    </label>
                    
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            id="review-image-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        
                        <label
                            htmlFor="review-image-upload"
                            className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-50 text-orange-500 cursor-pointer hover:bg-orange-100 transition-colors duration-200"
                        >
                            <FiImage className="h-5 w-5" />
                        </label>
                        
                        {image ? (
                            <div className="flex-1 flex items-center gap-3 p-2 bg-gray-50 rounded-md border border-gray-200">
                                <FiUpload className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600 truncate flex-1">
                                    {image.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setImage(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Remove file"
                                >
                                    <FiX className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 text-sm text-gray-500 italic py-2">
                                No image selected
                            </div>
                        )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">
                        Supports JPG, PNG up to 5MB
                    </p>
                </div>

                <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
                    disabled={submitting}
                >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;