'use client';
import axios from 'axios';
import { Eraser } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const MyOrder = () => {
    const [myCarts, setMyCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session, status } = useSession(); 

    const fetchCarts = async () => {
        if (!session?.user?.email) return;

        try {
            const res = await axios.get(`/api/cart?userEmail=${session.user.email}`);
            setMyCarts(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch Carts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchCarts();
        }
    }, [session, status]);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/cart/${id}`)
                    .then(() => {
                        setMyCarts(myCarts.filter(Cart => Cart._id !== id));
                        Swal.fire('Deleted!', 'Your Cart has been canceled.', 'success');
                    })
                    .catch(() => {
                        Swal.fire('Error!', 'Something went wrong.', 'error');
                    });
            }
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">My Carts</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 text-left">Image</th>
                            <th className="py-2 px-4 text-left">Image</th>
                            <th className="py-2 px-4 text-left">Title</th>
                            <th className="py-2 px-4 text-left">Size</th>
                            <th className="py-2 px-4 text-left">Price</th>
                            <th className="py-2 px-4 text-left">Quantity</th>
                            <th className="py-2 px-4 text-left">Status</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myCarts.map((Cart) => (
                            <tr key={Cart._id} className="border-b">
                                <td className="py-2 px-4">
                                    {Cart.image?.startsWith('http') && (
                                        <Image
                                            src={Cart.image}
                                            alt={Cart.title}
                                            width={50}
                                            height={50}
                                            className="object-cover rounded-full w-16 h-16"
                                        />
                                    )}
                                </td>
                                <td className="py-2 px-4">{Cart.title}</td>
                                <td className="py-2 px-4">{Cart.size}</td>
                                <td className="py-2 px-4">${Cart.price}</td>
                                <td className="py-2 px-4">{Cart.quantity}</td>
                                <td className="py-2 px-4 uppercase text-green-400">{Cart.status}</td>
                                <td className="py-2 px-4 space-x-2">
                                    <button
                                        onClick={() => handleDelete(Cart._id)}
                                        className="btn btn-circle rounded-full hover:bg-black"
                                    >
                                        <Eraser className="text-2xl text-red-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {myCarts.length === 0 && (
                            <tr>
                                <td colSpan="6" className="py-4 text-center text-gray-500">
                                    You didn't make any Carts
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyOrder;