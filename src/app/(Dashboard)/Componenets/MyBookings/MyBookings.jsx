'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Eraser } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';

const MyBookings = () => {
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session, status } = useSession(); // <- get session

    const fetchBookings = async () => {
        if (!session?.user?.email) return;

        try {
            const res = await axios.get(`/api/bookings?userEmail=${session.user.email}`);
            setMyBookings(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchBookings();
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
                axios.delete(`/api/bookings/${id}`)
                    .then(() => {
                        setMyBookings(myBookings.filter(booking => booking._id !== id));
                        Swal.fire('Deleted!', 'Your booking has been canceled.', 'success');
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
            <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
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
                        {myBookings.map((booking) => (
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
                                    <button
                                        onClick={() => handleDelete(booking._id)}
                                        className="btn btn-circle rounded-full hover:bg-black"
                                    >
                                        <Eraser className="text-2xl text-red-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {myBookings.length === 0 && (
                            <tr>
                                <td colSpan="6" className="py-4 text-center text-gray-500">
                                   You didn't make any bookings
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyBookings;
