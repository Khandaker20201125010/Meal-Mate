import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Swal from "sweetalert2";

const image_hosting_token = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_token}`;

const UpdateMenuModal = ({ isOpen, onClose, menu, onUpdateSuccess }) => {
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Always call useEffect, even if menu is undefined
  useEffect(() => {
    if (menu?.image) {
      setImagePreview(menu.image);
    }
  }, [menu]);

  if (!isOpen || !menu) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = menu.image;

    // If a new image is selected, upload to imgbb
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

    const updatedMenu = {
      title: e.target.title.value,
      description: e.target.description.value,
      smallPrice: parseFloat(e.target.smallPrice.value),
      largePrice: parseFloat(e.target.largePrice.value),
      category: e.target.category.value.split(",").map((c) => c.trim()),
      image: imageUrl,
    };

    try {
      await axios.put(`/api/menus/${menu._id}`, updatedMenu);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Menu item updated successfully",
        confirmButtonText: "Great",
      });
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update menu:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating the menu item.",
      });
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h3 className="text-xl font-semibold mb-4">Update Menu</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={menu.title}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              defaultValue={menu.description}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Small Price</label>
            <input
              type="number"
              name="smallPrice"
              defaultValue={menu.smallPrice}
              className="w-full border px-3 py-2 rounded"
              step="0.01"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Large Price</label>
            <input
              type="number"
              name="largePrice"
              defaultValue={menu.largePrice}
              className="w-full border px-3 py-2 rounded"
              step="0.01"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Category (comma-separated)</label>
            <input
              type="text"
              name="category"
              defaultValue={menu.category?.join(", ")}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Image</label>
            {imagePreview && (
              <Image width={200} height={200}
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded mb-2"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border px-3 py-2 rounded"
            />
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

export default UpdateMenuModal;
