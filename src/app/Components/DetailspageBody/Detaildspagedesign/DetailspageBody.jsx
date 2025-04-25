'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaCartPlus, FaRegCalendarPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

const DetailspageBody = () => {
    const { id } = useParams();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState('small');
    const price = menu ? (size === 'small' ? menu.smallPrice : menu.largePrice) : 0;
    const [relatedMenus, setRelatedMenus] = useState([]);

    const checkAuth = async (action) => {
        if (status === 'unauthenticated') {
            const result = await Swal.fire({
                title: 'Authentication Required',
                text: `You need to be logged in to ${action}. Do you want to sign up now?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Sign Up',
                cancelButtonText: 'Cancel',
            });

            if (result.isConfirmed) {
                router.push('/signup');
            }
            return false;
        }
        return true;
    };

    const fetchRelatedMenus = useCallback(async () => {
        if (!menu) return;

        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/menus`);
            const related = data.filter(item =>
                item._id !== menu._id && item.category.some(cat => menu.category.includes(cat))
            );
            setRelatedMenus(related);
        } catch (error) {
            console.error("Error fetching related menus:", error);
        }
    }, [menu]);

    useEffect(() => {
        if (menu) {
            fetchRelatedMenus();
        }
    }, [menu, fetchRelatedMenus]);

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

    const handleAddToCart = async () => {
        const isAuthenticated = await checkAuth('add items to cart');
        if (!isAuthenticated) return;

        const result = await Swal.fire({
            title: 'Add to Cart',
            text: `Add ${quantity} x ${menu.title} to cart for $${(price * quantity).toFixed(2)}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Add',
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/cart`, {
                    userEmail: session?.user?.email,
                    menuId: menu._id,
                    title: menu.title,
                    quantity,
                    size,
                    price: price * quantity,
                    image: menu.image,
                });

                if (response.status === 201) {
                    setMenu(prev => ({
                        ...prev,
                        quantity: prev.quantity - quantity
                    }));
                    Swal.fire('Added!', 'Item added to cart.', 'success');
                } else {
                    Swal.fire('Error', 'Something went wrong while adding to cart.', 'error');
                }
            } catch (err) {
                console.error('Error adding to cart:', err);
                Swal.fire('Error', `Could not add to cart. ${err.response?.data?.error || err.message}`, 'error');
            }
        }
    };

    const handleAddBooking = async () => {
        const isAuthenticated = await checkAuth('make bookings');
        if (!isAuthenticated) return;

        const result = await Swal.fire({
            title: 'Add Booking',
            text: `Book ${quantity} x ${menu.title} for $${(price * quantity).toFixed(2)}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Book',
        });

        if (result.isConfirmed) {
            try {
                const bookingData = {
                    userEmail: session.user.email,
                    menuId: menu._id,
                    title: menu.title,
                    quantity,
                    size,
                    price: price * quantity,
                    image: menu.image,
                    status: 'booked',
                };

                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_URL}/api/bookings`,
                    bookingData
                );

                setMenu(prev => ({
                    ...prev,
                    quantity: prev.quantity - quantity
                }));

                Swal.fire('Booked!', 'Your booking was successful.', 'success');
            } catch (err) {
                console.error("Booking error:", err.response?.data || err.message);
                Swal.fire(
                    'Error',
                    err.response?.data?.error || 'Could not complete booking.',
                    'error'
                );
            }
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    if (!menu) {
        return <div className="p-4 text-center text-red-500">Menu not found.</div>;
    }

    return (
        <div>
            <div className="container z-10 mx-auto p-6 mt-16 bg-gradient-to-br from-orange-50 to-white shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <Image
                        width={500}
                        height={500}
                        src={menu.image}
                        alt={menu.title}
                        className="w-full h-[480px] object-cover shadow-md"
                        priority
                    />
                    <div>
                        <h1 className="text-4xl font-bold text-orange-600 mb-3 font-serif">{menu.title}</h1>
                        <p className="text-gray-700 text-md mb-4 leading-relaxed">{menu.desc}</p>

                        <div className="text-lg mb-4 space-y-6 border-b py-6">
                            <p><span className="font-semibold text-gray-800">In Stock:</span> {menu.quantity}</p>
                            <p><span className="font-semibold text-gray-800">Category:</span> {menu.category.join(', ')}</p>
                            <div className="flex gap-4 items-center">
                                <label className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        name={`size-${menu._id}`}
                                        value="small"
                                        checked={size === 'small'}
                                        onChange={() => setSize('small')}
                                        className="radio radio-sm radio-warning"
                                    />
                                    <span className="text-sm">Small</span>
                                </label>
                                <label className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        name={`size-${menu._id}`}
                                        value="large"
                                        checked={size === 'large'}
                                        onChange={() => setSize('large')}
                                        className="radio radio-sm radio-warning"
                                    />
                                    <span className="text-sm">Large</span>
                                </label>
                            </div>
                            <p className="text-gray-700 font-medium text-lg">
                                Total Price: <span className='text-red-500 text-3xl'> ${(price * quantity).toFixed(2)}</span>
                            </p>
                            <p className="text-sm text-gray-500">($ {price.toFixed(2)} each)</p>
                        </div>

                        <div className="flex items-center gap-3 my-6">
                            <button
                                onClick={() => handleQuantityChange('dec')}
                                className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold px-3 py-1 rounded text-lg"
                            >-</button>
                            <span className="text-lg font-semibold px-10">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange('inc')}
                                className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold px-3 py-1 rounded text-lg"
                            >+</button>
                        </div>

                        <div className="flex gap-4 w-full">
                            <button
                                onClick={handleAddToCart}
                                className="btn flex items-center justify-center gap-2 w-1/2 bg-gradient-to-br from-pink-500 to-orange-600 hover:bg-orange-600 text-white px-5 py-2 rounded-md shadow font-semibold transition"
                            >
                                <FaCartPlus className="text-xl" />
                                Add to Cart
                            </button>

                            <button
                                onClick={handleAddBooking}
                                className="btn flex items-center justify-center gap-2 w-1/2 bg-gradient-to-br from-orange-500 to-pink-600 hover:bg-pink-600 text-white px-5 py-2 rounded-md shadow font-semibold transition"
                            >
                                <FaRegCalendarPlus className="text-xl" />
                                Add Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {relatedMenus.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-4 text-center text-orange-600 font-serif">Similar Menus You Might Like</h2>
                    <Carousel opts={{ align: 'start', loop: true }} className="w-full max-w-7xl mx-auto">
                        <CarouselContent>
                            {relatedMenus.map((item) => (
                                <CarouselItem key={item._id} className="p-2 sm:basis-full md:basis-1/2 lg:basis-1/3">
                                    <Link href={`/menu/${item._id}`}>
                                        <Card className="h-[250px] rounded-xl overflow-hidden relative shadow-none">
                                            <CardContent className="p-0 h-full">
                                                <div className="relative w-full h-full group cursor-pointer">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent z-10" />
                                                    <Image
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover z-0 "
                                                    />
                                                    <div className="absolute inset-0 transform -translate-y-full group-hover:translate-y-0 transition-all duration-500 bg-black/40 z-20 flex items-center justify-center">
                                                        <p className="text-white font-semibold text-lg">{item.title}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            )}
        </div>
    );
};

export default DetailspageBody;