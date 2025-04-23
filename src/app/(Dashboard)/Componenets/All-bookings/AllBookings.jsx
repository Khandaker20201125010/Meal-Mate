'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Eraser } from 'lucide-react';
import Swal from 'sweetalert2';

const AllBookings = () => {
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/bookings')
            .then((response) => {
                setAllBookings(response.data);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to fetch all bookings');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will cancel the booking and restore quantity!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/bookings/${id}`)
                    .then(() => {
                        setAllBookings(prev => prev.filter(booking => booking._id !== id));
                        Swal.fire('Deleted!', 'The booking was canceled.', 'success');
                    })
                    .catch(() => {
                        Swal.fire('Error!', 'Failed to delete booking.', 'error');
                    });
            }
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">All Bookings</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 text-left">Image</th>
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
                                <td className="py-2 px-4">{booking.size}</td>
                                <td className="py-2 px-4">${booking.price}</td>
                                <td className="py-2 px-4">{booking.quantity}</td>
                                <td className="py-2 px-4 space-x-2">

                                    {booking.status}

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
