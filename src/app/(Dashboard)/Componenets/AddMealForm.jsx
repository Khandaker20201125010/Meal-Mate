"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { LuImageUp } from "react-icons/lu";

const image_hosting_token = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_token}`;

const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Discount", "Special"];

const AddMealForm = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        trigger,
        formState: { errors },
    } = useForm();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setValue("image", file);
            trigger("image");
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    const onSubmit = (data) => {
        console.log("Form Data:", {
            ...data,
            image: data.image[0], // image file
        });
        reset();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Add Meal</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block font-medium">Title</label>
                    <input
                        type="text"
                        {...register("title", { required: "Title is required" })}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block font-medium">Description</label>
                    <textarea
                        {...register("desc", { required: "Description is required" })}
                        className="w-full border border-gray-300 rounded p-2"
                        rows="4"
                    ></textarea>
                    {errors.desc && <p className="text-red-500 text-sm">{errors.desc.message}</p>}
                </div>

                {/* Small Price */}
                <div>
                    <label className="block font-medium">Small Price</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("smallPrice", { required: "Small price is required" })}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                    {errors.smallPrice && <p className="text-red-500 text-sm">{errors.smallPrice.message}</p>}
                </div>

                {/* Large Price */}
                <div>
                    <label className="block font-medium">Large Price</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("largePrice", { required: "Large price is required" })}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                    {errors.largePrice && <p className="text-red-500 text-sm">{errors.largePrice.message}</p>}
                </div>

                {/* Image */}
                <label className="block font-medium">Image</label>
                <div className="border-dashed border-2 border-gray-300 text-center rounded-lg relative w-full h-64">
                    {!previewImage ? (
                        <label className="text-gray-400 p-10 cursor-pointer flex flex-col items-center justify-center h-full">
                            Upload Your Photo
                            <LuImageUp className="text-3xl mt-2" />
                            <input
                                type="file"
                                {...register("image", { required: "Image is required" })}
                                className="hidden"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange} // Use the updated handler
                            />
                        </label>
                    ) : (
                        <div className="relative w-full h-full">
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-red-500 text-white text-xs p-1 rounded-full"
                            >
                                <MdOutlineCancel className="text-2xl" />
                            </button>
                        </div>
                    )}
                </div>
                {errors.image && (
                    <p className="text-red-500 text-sm">{errors.image.message}</p>
                )}

                {/* Categories */}
                <div>
                    <label className="block font-medium mb-2">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => (
                            <label key={cat} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={cat}
                                    {...register("category")}
                                    className="accent-green-600"
                                />
                                {cat}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddMealForm;

