'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Swal from "sweetalert2";

const image_hosting_token = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_token}`;

const UpdateUsersModal = ({ isOpen, onClose, User, onUpdateSuccess }) => {
    const [imagePreview, setImagePreview] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [role, setRole] = useState("");

    useEffect(() => {
        if (User?.image) {
            setImagePreview(User.image);
        }
        if (User?.role) {
            setRole(User.role);
        }
    }, [User]);

    if (!isOpen || !User) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        let imageUrl = User.image;

        // Optional: handle new image upload
        if (imageFile) {
            const formData = new FormData();
            formData.append("image", imageFile);
            try {
                const res = await axios.post(image_hosting_api, formData);
                imageUrl = res.data.data.display_url;
            } catch (error) {
                console.error("Image upload failed:", error);
                Swal.fire({
                    icon: "error",
                    title: "Image Upload Failed",
                    text: "Unable to upload image. Please try again.",
                });
                return;
            }
        }

        const updatedUser = {
            role,
            image: imageUrl,
        };

        try {
            await axios.put(`/api/users/${User._id}`, updatedUser);
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "User updated successfully",
                confirmButtonText: "Great",
            });
            onUpdateSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to update User:", error);
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: "There was an error updating the user.",
            });
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
                <h3 className="text-xl font-semibold mb-4">Update User Role</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1">Image</label>
                        {imagePreview && (
                            <Image
                                width={200}
                                height={200}
                                src={imagePreview}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded mb-2"
                            />
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Name</label>
                        <input
                            type="text"
                            value={User.name}
                            disabled
                            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Email</label>
                        <input
                            type="text"
                            value={User.email}
                            disabled
                            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Role</label>
                        <select
                            name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUsersModal;
