'use client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

const DetailspageBody = () => {
    const { id } = useParams();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const loadMenuDetails = useCallback(async () => {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_URL}/api/menus/${id}`
            );
            setMenu(data);
        } catch (error) {
            console.error("Error fetching menu details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) loadMenuDetails();
    }, [id, loadMenuDetails]);

    const handleQuantityChange = (type) => {
        setQuantity(prev =>
            type === 'inc' ? Math.min(menu.quantity, prev + 1) : Math.max(1, prev - 1)
        );
    };

    const handleAddToCart = () => {
        alert(`Added ${quantity} x ${menu.title} to cart`);
    };

    const handleAddBooking = () => {
        alert(`Booked ${quantity} x ${menu.title}`);
    };

    if (loading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    if (!menu) {
        return <div className="p-4 text-center text-red-500">Menu not found.</div>;
    }

    return (
        <div className="container z-10 mx-auto p-6 mt-16 bg-gradient-to-br from-orange-50 to-white shadow-xl ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <Image
                    width={500}
                    height={500}
                    src={menu.image}
                    alt={menu.title}
                    className="w-full h-[420px] object-cover  shadow-md"
                    priority 
                />
                <div>
                    <h1 className="text-4xl font-bold text-orange-600 mb-3">{menu.title}</h1>
                    <p className="text-gray-700 text-md mb-4 leading-relaxed">{menu.desc}</p>

                    <div className="text-lg mb-4 space-y-6 border-b py-6">

                        <p><span className="font-semibold text-gray-800">In Stock:</span> {menu.quantity}</p>
                        <p><span className="font-semibold text-gray-800">Category:</span> {menu.category.join(', ')}</p>
                        <div className='flex gap-10'>
                            <p className='text-red-500 md:text-3xl'><span className="font-semibold text-gray-800 md:text-xl">Price (Small):</span> ${menu.smallPrice.toFixed(2)}</p>
                            <p className='text-red-500 md:text-3xl'><span className="font-semibold text-gray-800 md:text-xl">Price (Large):</span> ${menu.largePrice.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 my-6">
                        <button
                            onClick={() => handleQuantityChange('dec')}
                            className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold px-3 py-1 rounded text-lg"
                        >-</button>
                        <span className="text-lg font-semibold">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange('inc')}
                            className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold px-3 py-1 rounded text-lg"
                        >+</button>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full shadow font-semibold transition"
                        >
                            🛒 Add to Cart
                        </button>
                        <button
                            onClick={handleAddBooking}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full shadow font-semibold transition"
                        >
                            📅 Add Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailspageBody;
