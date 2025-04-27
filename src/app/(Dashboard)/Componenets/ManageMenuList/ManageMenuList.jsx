"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { GrUpdate } from 'react-icons/gr';
import { Eraser } from 'lucide-react';
import Swal from 'sweetalert2';
import UpdateMenuModal from './UpdateMenuModal';
import Loading from '@/src/Loading';

const ManageMenuList = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchMenus = async () => {
    try {
      const { data } = await axios.get('/api/menus');
      setMenus(data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'bg-gradient-to-r from-pink-500 via-pink-600 to-orange-500 text-white',
        cancelButton: 'bg-blue-500 text-white hover:bg-blue-600',
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/menus/${id}`);
        setMenus((prev) => prev.filter((menu) => menu._id !== id));
        Swal.fire('Deleted!', 'Your menu item has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting menu:', error);
        Swal.fire('Error!', 'There was an issue deleting the menu item.', 'error');
      }
    } else {
      Swal.fire('Cancelled', 'Your menu item is safe :)', 'info');
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  if (loading) {
    return <div className="text-center p-4"><Loading></Loading></div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Menus</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Small Price</th>
              <th className="py-2 px-4 text-left">Large Price</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Update</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu._id} className="border-b">
                <td className="py-2 px-4">
                  {(() => {
                    let src = menu.image;
                    try {
                      const url = new URL(menu.image);
                      // fix incorrect domain if needed
                      if (url.hostname === 'i.ibb.co.com') {
                        url.host = 'i.ibb.co';
                        src = url.toString();
                      }
                      if (url.hostname === 'i.ibb.co') {
                        return (
                          <Image
                            src={src}
                            alt={menu.title}
                            width={50}
                            height={50}
                            className="object-cover rounded w-16 h-16"
                          />
                        );
                      }
                    } catch (err) {
                      console.error('Invalid image URL:', menu.image);
                    }
                    return null;
                  })()}
                </td>
                <td className="py-2 px-4">{menu.title}</td>
                <td className="py-2 px-4">{menu.category?.join(', ')}</td>
                <td className="py-2 px-4">${menu.smallPrice}</td>
                <td className="py-2 px-4">${menu.largePrice}</td>
                <td className="py-2 px-4">${menu.quantity}</td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() => {
                      setSelectedMenu(menu);
                      setIsUpdateModalOpen(true);
                    }}
                    className="btn btn-circle rounded-full hover:bg-blue-600"
                  >
                    <GrUpdate className="text-2xl text-blue-500 hover:text-white" />
                  </button>
                </td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() => handleDelete(menu._id)}
                    className="btn btn-circle rounded-full hover:bg-black"
                  >
                    <Eraser className="text-2xl text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
            {menus.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No menu items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UpdateMenuModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        menu={selectedMenu}
        onUpdateSuccess={fetchMenus}
      />
    </div>
  );
};

export default ManageMenuList;
