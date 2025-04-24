'use client';
import Modal from '@/components/ui/Modal';
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
    const totalAmount = myCarts.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalQuantity = myCarts.reduce((acc, item) => acc + item.quantity, 0);
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
            <div className='flex justify-between'>
                <div>
                    <h2 className="text-2xl font-semibold mb-4 font-serif">My Orders {myCarts.length}</h2>
                </div>
                <div className='flex-col'>
                    <div className="text-right  text-lg font-semibold border-b-2 py-2">
                        <span className='mx-2'>{totalQuantity} Menu </span> Total Amount: <span className='text-red-500 text-xl'>${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className='text-right m-2'>
                        <button data-tip="Pay Your Bill" className='tooltip  tooltip-warning btn  btn-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md'>Pay</button>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 text-left">Image</th>
                            <th className="py-2 px-4 text-left">Title</th>
                            <th className="py-2 px-4 text-left">Size</th>
                            <th className="py-2 px-4 text-left">Price</th>
                            <th className="py-2 px-4 text-left">Quantity</th>
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
                                <td className="py-2 px-4 space-x-2">
                                    <button data-tip="Cancel Order"
                                        onClick={() => handleDelete(Cart._id)}
                                        className="btn btn-circle rounded-full hover:bg-black  tooltip  tooltip-error"
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
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    {selectedBooking && (
                        // Pass the onPaymentSuccess callback as a prop
                        <Payment booked={selectedBooking} onPaymentSuccess={handlePaymentSuccess} />
                    )}
                </Modal>
            )}
        </div>
    );
};

export default MyOrder;