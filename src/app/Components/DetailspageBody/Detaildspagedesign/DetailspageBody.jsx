'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import { dispatchCartUpdate } from '@/src/app/lib/events';
import Loading from '@/src/Loading';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaCartPlus, FaRegCalendarPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
const DetailspageBody = () => {
    const { id } = useParams();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState('small');
    const isProUser = session?.user?.status === 'pro';
    const basePrice = menu ? (size === 'small' ? menu.smallPrice : menu.largePrice) : 0;
    const price = isProUser ? basePrice * 0.8 : basePrice;
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
            title: `<strong>Add to Cart</strong>`,
            html: `
            <div class="text-left">
                <p class="mb-2">You're adding:</p>
                <div class="flex items-center gap-4 p-3 bg-gray-100 rounded-lg shadow-sm">
                    <img src="${menu.image}" alt="${menu.title}" class="w-14 h-14 rounded-md object-cover border"/>
                    <div>
                        <h4 class="font-bold text-gray-800">${menu.title}</h4>
                        <p class="text-sm text-gray-600">${quantity} × $${price.toFixed(2)} = <b>$${(price * quantity).toFixed(2)}</b></p>
                        ${size ? `<p class="text-sm text-gray-500 mt-1">Size: <b>${size}</b></p>` : ''}
                    </div>
                </div>
            </div>
        `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `
            <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Yes, Add
            </span>
        `,
            cancelButtonText: `
            <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Cancel
            </span>
        `,
            customClass: {
                popup: 'animate__animated animate__fadeInDown',
                confirmButton: 'swal2-confirm btn border-none text-white bg-gradient-to-br from-pink-500 to-orange-600 hover:bg-orange-600 !text-white font-semibold py-2 px-4 rounded shadow-md transition',
                cancelButton: 'swal2-cancel btn border-none text-white bg-red-500 hover:bg-red-600 !text-white font-semibold py-2 px-4 rounded shadow-md transition',
                actions: 'flex justify-between gap-5',
            },
            buttonsStyling: false,
            background: '#f9fafb',
            backdrop: 'rgba(0,0,0,0.4)' // Removed GIF reference
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
                    // Update quantity
                    setMenu(prev => ({
                        ...prev,
                        quantity: prev.quantity - quantity
                    }));

                    // Update cart count
                    const currentCount = parseInt(localStorage.getItem('cartCount')) || 0;
                    localStorage.setItem('cartCount', (currentCount + 1).toString());
                    dispatchCartUpdate();

                    // Enhanced confetti effect
                    const showConfetti = () => {
                        confetti({
                            particleCount: 150,
                            spread: 90,
                            origin: { y: 0.6 },
                            colors: ['#22c55e', '#3b82f6', '#facc15', '#ec4899', '#10b981']
                        });

                        // Additional bursts for better effect
                        setTimeout(() => {
                            confetti({
                                particleCount: 100,
                                angle: 60,
                                spread: 55,
                                origin: { x: 0 }
                            });
                            confetti({
                                particleCount: 100,
                                angle: 120,
                                spread: 55,
                                origin: { x: 1 }
                            });
                        }, 250);
                    };

                    // Audio feedback
                    const playBeep = () => {
                        try {
                            const ctx = new (window.AudioContext || window.webkitAudioContext)();
                            const oscillator = ctx.createOscillator();
                            const gain = ctx.createGain();

                            oscillator.type = 'triangle';
                            oscillator.frequency.value = 660;
                            gain.gain.value = 0.1;

                            oscillator.connect(gain);
                            gain.connect(ctx.destination);

                            oscillator.start();
                            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
                            oscillator.stop(ctx.currentTime + 1);
                        } catch (e) {
                            console.warn("Audio not supported", e);
                        }
                    };

                    playBeep();
                    showConfetti();

                    await Swal.fire({
                        title: 'Added to Cart!',
                        text: `${menu.title} has been added to your cart.`,
                        icon: 'success',
                        showConfirmButton: true,
                        confirmButtonText: 'Awesome!',
                        background: '#ecfdf5',
                        customClass: {
                            popup: 'animate__animated animate__bounceIn',
                            confirmButton: 'bg-emerald-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-emerald-600 transition'
                        },
                        timer: 3000,
                        timerProgressBar: true
                    });
                } else {
                    throw new Error('Server error');
                }
            } catch (err) {
                console.error('Cart error:', err);
                Swal.fire({
                    title: 'Error',
                    text: err.response?.data?.error || 'Could not add item.',
                    icon: 'error',
                    showClass: {
                        popup: 'animate__animated animate__shakeX'
                    }
                });
            }
        }
    };


    const handleAddBooking = async () => {
        const isAuthenticated = await checkAuth('make bookings');
        if (!isAuthenticated) return;

        const result = await Swal.fire({
            title: `<strong>Confirm Booking</strong>`,
            html: `
            <div class="text-left">
                <p class="mb-2">You're booking:</p>
                <div class="flex items-center gap-4 p-3 bg-gray-100 rounded-lg shadow-sm">
                    <img src="${menu.image}" alt="${menu.title}" class="w-14 h-14 rounded-md object-cover border"/>
                    <div>
                        <h4 class="font-bold text-gray-800">${menu.title}</h4>
                        <p class="text-sm text-gray-600">${quantity} × $${price.toFixed(2)} = <b>$${(price * quantity).toFixed(2)}</b></p>
                        ${size ? `<p class="text-sm text-gray-500 mt-1">Size: <b>${size}</b></p>` : ''}
                        <p class="text-sm text-blue-600 mt-1">Status: <b>Booked</b></p>
                    </div>
                </div>
            </div>
        `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `
            <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Confirm Booking
            </span>
        `,
            cancelButtonText: `
            <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Cancel
            </span>
        `,
            customClass: {
                popup: 'animate__animated animate__fadeInDown',
                confirmButton: 'swal2-confirm btn border-none text-white bg-gradient-to-br from-pink-500 to-orange-600 hover:from-orange-600 hover:to-pink-600 !text-white font-semibold py-2 px-4 rounded shadow-md transition',
                cancelButton: 'swal2-cancel btn border-none text-white bg-red-600 hover:bg-red-700 !text-white font-semibold py-2 px-4 rounded shadow-md transition',
                actions: 'flex justify-between gap-5',
            },
            buttonsStyling: false,
            background: '#f9fafb',
            backdrop: 'rgba(0,0,0,0.4)'
        });

        if (result.isConfirmed) {
            try {
                // Show loading state
                Swal.fire({
                    title: 'Processing Booking',
                    html: 'Please wait...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    background: '#f8f9fa',
                    showClass: {
                        popup: 'animate__animated animate__fadeIn'
                    }
                });

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

                // Update quantity
                setMenu(prev => ({
                    ...prev,
                    quantity: prev.quantity - quantity
                }));

                // Enhanced confetti effect
                const showConfetti = () => {
                    confetti({
                        particleCount: 150,
                        spread: 90,
                        origin: { y: 0.6 },
                        colors: ['#22c55e', '#3b82f6', '#facc15', '#ec4899', '#10b981']
                    });

                    setTimeout(() => {
                        confetti({
                            particleCount: 100,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0 }
                        });
                        confetti({
                            particleCount: 100,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1 }
                        });
                    }, 250);
                };

                // Audio feedback
                const playBeep = () => {
                    try {
                        const ctx = new (window.AudioContext || window.webkitAudioContext)();
                        const oscillator = ctx.createOscillator();
                        const gain = ctx.createGain();

                        oscillator.type = 'triangle';
                        oscillator.frequency.value = 660;
                        gain.gain.value = 0.1;

                        oscillator.connect(gain);
                        gain.connect(ctx.destination);

                        oscillator.start();
                        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
                        oscillator.stop(ctx.currentTime + 1);
                    } catch (e) {
                        console.warn("Audio not supported", e);
                    }
                };

                playBeep();
                showConfetti();

                await Swal.fire({
                    title: 'Booking Confirmed!',
                    text: `${menu.title} has been successfully booked.`,
                    icon: 'success',
                    showConfirmButton: true,
                    confirmButtonText: 'Great!',
                    background: '#ecfdf5',
                    customClass: {
                        popup: 'animate__animated animate__bounceIn',
                        confirmButton: 'bg-emerald-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-emerald-600 transition'
                    },
                    timer: 3000,
                    timerProgressBar: true
                });

            } catch (err) {
                console.error("Booking error:", err.response?.data || err.message);

                Swal.fire({
                    title: 'Booking Error',
                    html: `Could not complete booking. <br/><small>${err.response?.data?.error || err.message}</small>`,
                    icon: 'error',
                    showClass: {
                        popup: 'animate__animated animate__shakeX'
                    },
                    background: '#fef2f2',
                    customClass: {
                        confirmButton: 'bg-red-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-red-600 transition'
                    }
                });
            }
        }
    };


    if (loading) {
        return <div className="p-4 text-center"><Loading></Loading></div>;
    }

    if (!menu) {
        return <div className="p-4 text-center text-red-500"><Loading></Loading></div>;
    }

    return (
        <div>
            <div className="container z-10 mx-auto p-6 mt-16 bg-gradient-to-br from-orange-50 to-white shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <Image
                        src={menu.image}
                        alt={menu.title}
                        width={500}
                        height={500}
                        className="w-full h-auto max-h-[480px] object-cover shadow-md"
                        priority
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
                            <button
                                data-tip="Add to Cart !"
                                onClick={handleAddToCart}
                                className="tooltip tooltip-error btn flex items-center justify-center gap-1 sm:gap-2 w-full sm:w-1/2 bg-gradient-to-br from-pink-500 to-orange-600 hover:bg-orange-600 text-white px-3 sm:px-5 py-2 rounded-md shadow font-semibold transition text-sm sm:text-base"
                            >
                                <FaCartPlus className="text-lg sm:text-xl" />
                                Add to Cart
                            </button>

                            <button
                                data-tip="Add Booking !"
                                onClick={handleAddBooking}
                                className="tooltip tooltip-error btn flex items-center justify-center gap-1 sm:gap-2 w-full sm:w-1/2 bg-gradient-to-br from-orange-500 to-pink-600 hover:bg-pink-600 text-white px-3 sm:px-5 py-2 rounded-md shadow font-semibold transition text-sm sm:text-base"
                            >
                                <FaRegCalendarPlus className="text-lg sm:text-xl" />
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