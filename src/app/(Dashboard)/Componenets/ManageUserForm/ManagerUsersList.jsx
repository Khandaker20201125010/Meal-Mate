'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { GrUpdate } from 'react-icons/gr';
import { Eraser } from 'lucide-react';
import UpdateUsersModal from './UpdateUsersModal';

const ManagerUsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/users`);
            setUsers(response.data.users || []);
        } catch (err) {
            console.error('Error fetching users:', err.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load users.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_URL}/api/users?id=${userId}`
            );
            if (response.status === 200) {
                Swal.fire({
                    title: "Deleted!",
                    text: "User has been removed successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                setUsers((prev) => prev.filter((user) => user._id !== userId));
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete user. Please try again later.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Manage users</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 text-left">Image</th>
                            <th className="py-2 px-4 text-left">Name</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Role</th>
                            <th className="py-2 px-4 text-left">Update</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b">
                                <td className="py-2 px-4">
                                    {user.image && (
                                        <Image
                                            src={sanitizeImageUrl(user.image)}
                                            alt={user.name || 'User'}
                                            width={50}
                                            height={50}
                                            className="object-cover rounded-full "
                                        />
                                    )}
                                </td>
                                <td className="py-2 px-4">{user.name}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4 uppercase">{user.role}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setIsUpdateModalOpen(true);
                                        }}
                                        className="btn btn-circle rounded-full hover:bg-blue-600"
                                    >
                                        <GrUpdate className="text-2xl text-blue-500 hover:text-white" />
                                    </button>
                                </td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="btn btn-circle rounded-full hover:bg-black"
                                    >
                                        <Eraser className="text-2xl text-red-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!loading && users.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-4 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isUpdateModalOpen && selectedUser && (
                <UpdateUsersModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    User={selectedUser}
                    onUpdateSuccess={fetchUsers}
                />
            )}
        </div>
    );
};

// Fix malformed imgbb URLs (e.g. i.ibb.co.com => i.ibb.co)
function sanitizeImageUrl(imageUrl) {
    try {
        const url = new URL(imageUrl);
        if (url.hostname === "i.ibb.co.com") {
            url.hostname = "i.ibb.co";
        }
        return url.toString();
    } catch (e) {
        console.error("Invalid image URL:", imageUrl);
        return "";
    }
}

export default ManagerUsersList;
