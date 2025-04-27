'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Eraser } from 'lucide-react';
import Swal from 'sweetalert2';
import Loading from '@/src/Loading';

const AllBookings = () => {
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('/api/bookings');
            setAllBookings(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch all bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);
    const handleStatusUpdate = async (id) => {
        try {
            // First get the booking data
            const bookingRes = await axios.get(`/api/bookings/${id}`);
            const booking = bookingRes.data;

            // Create cart item from booking
            const cartItem = {
                userEmail: booking.userEmail,
                menuId: booking.menuId,
                title: booking.title,
                quantity: booking.quantity,
                size: booking.size,
                price: booking.price,
                image: booking.image,
                status: 'processing'
            };

            // Add to cart
            await axios.post('/api/cart', cartItem);

            // Instead of updating to 'accepted', delete the booking
            await axios.delete(`/api/bookings/${id}`);

            // Update UI by removing the accepted booking
            setAllBookings((prev) => prev.filter((b) => b._id !== id));

            Swal.fire('Accepted!', 'Booking moved to cart.', 'success');
        } catch (err) {
            console.error(err);
            Swal.fire('Error!', 'Failed to accept booking.', 'error');
        }
    };
    if (loading) return <p><Loading></Loading></p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">All Bookings</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 text-left">Image</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Title</th>
                            <th className="py-2 px-4 text-left">Size</th>
                            <th className="py-2 px-4 text-left">Price</th>
                            <th className="py-2 px-4 text-left">Quantity</th>
                            <th className="py-2 px-4 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allBookings.map((booking) => (
                            <tr key={booking._id} className="border-b">
                                <td className="py-2 px-4">
                                    {booking.image?.startsWith('http') && (
                                        <Image
                                            src={booking.image}
                                            alt={booking.title}
                                            width={50}
                                            height={50}
                                            className="object-cover rounded-full w-16 h-16"
                                        />
                                    )}
                                </td>
                                <td className="py-2 px-4">{booking.title}</td>
                                <td className="py-2 px-4">{booking.userEmail}</td>
                                <td className="py-2 px-4">{booking.size}</td>
                                <td className="py-2 px-4">${booking.price}</td>
                                <td className="py-2 px-4">{booking.quantity}</td>
                                <td className="py-2 px-4">
                                    {booking.status === 'requested' ? (
                                        <button
                                            onClick={() => handleStatusUpdate(booking._id)}
                                            className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200"
                                        >
                                            Accept Order
                                        </button>
                                    ) : (
                                        <span className={`px-3 py-1 rounded ${booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {allBookings.length === 0 && (
                            <tr>
                                <td colSpan="6" className="py-4 text-center text-gray-500">
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllBookings;
