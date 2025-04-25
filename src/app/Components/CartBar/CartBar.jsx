'use client';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TbShoppingCartHeart } from "react-icons/tb";
import axios from "axios";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import Modal from "@/components/ui/Modal";
import Payment from "../../(Dashboard)/Componenets/Payments/Payment";
import Link from "next/link";

const CartBar = () => {
    const [myCarts, setMyCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sliderVisible, setSliderVisible] = useState(false);
    const { data: session, status } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [cartCount, setCartCount] = useState(0); // Local cart count state

    // Initialize cart count from localStorage
    useEffect(() => {
        const storedCount = localStorage.getItem('cartCount');
        if (storedCount) {
            setCartCount(parseInt(storedCount));
        }
    }, []);

    const fetchCarts = async () => {
        if (!session?.user?.email) return;

        try {
            const res = await axios.get(`/api/cart?userEmail=${session.user.email}`);
            setMyCarts(res.data);
            // Sync with localStorage and state
            const newCount = res.data.length;
            setCartCount(newCount);
            localStorage.setItem('cartCount', newCount.toString());
        } catch (err) {
            console.error(err);
            setError("Failed to fetch carts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedCount = localStorage.getItem('cartCount');
        if (storedCount) {
            setCartCount(parseInt(storedCount));
        }

        const handleCartUpdate = () => {
            if (status === 'authenticated') {
                fetchCarts();
            }
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, [status]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/cart/${id}`);
                const updatedCarts = myCarts.filter(cart => cart._id !== id);
                setMyCarts(updatedCarts);
                // Update cart count
                const newCount = updatedCarts.length;
                setCartCount(newCount);
                localStorage.setItem('cartCount', newCount.toString());
                Swal.fire('Deleted!', 'Item removed from cart.', 'success');
            } catch (err) {
                Swal.fire('Error!', 'Failed to delete item.', 'error');
            }
        }
    };

    const totalAmount = myCarts.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (loading) return (
        <div className="top-4 right-4 z-50">
            <div className="relative w-10 h-10">
                <TbShoppingCartHeart className='text-orange-600 text-3xl opacity-50' />
            </div>
        </div>
    );

    if (error) return (
        <div className="fixed top-4 right-4 z-50">
            <div className="relative w-10 h-10">
                <TbShoppingCartHeart className='text-orange-600 text-3xl opacity-50' />
            </div>
        </div>
    );

    return (
        <div className="top-4 z-50">
            <div className="relative">
                {/* Cart Icon with Badge */}
                <button
                    onClick={() => setSliderVisible(!sliderVisible)}
                    className="p-2 rounded-full btn bg-transparent border-none transition-colors"
                >
                    <div className="indicator">
                        <TbShoppingCartHeart className="text-3xl text-orange-600" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-white border-orange-600 border-2 text-orange-600 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </button>

                {/* Slider Overlay */}
                <div
                    className={`fixed inset-0 backdrop-blur-sm bg-opacity-50 transition-opacity duration-300 ${sliderVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setSliderVisible(false)}
                />

                {/* Cart Panel */}
                <div className={`fixed top-0 right-0 min-h-screen w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-in-out transform ${sliderVisible ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-6 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Your Cart ({cartCount})</h2>
                            <button
                                onClick={() => setSliderVisible(false)}
                                className="btn btn-circle btn-sm bg-orange-500 text-white hover:bg-orange-600"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-grow overflow-y-auto max-h-[calc(100vh-250px)]">
                            {myCarts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <p className="text-gray-500 text-lg py-10">Your cart is empty</p>
                                    <Link href="/menu">
                                        <button
                                            onClick={() => setSliderVisible(false)}
                                            className="btn px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                                        >
                                            Continue Shopping
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                <ul className="divide-y">
                                    {myCarts.map((item) => (
                                        <li key={item._id} className="py-4 px-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-medium text-gray-800">{item.title}</h3>
                                                            <p className="text-sm text-gray-500 mt-1">{item.size}</p>
                                                        </div>
                                                        <p className="font-medium text-green-600">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-sm text-gray-500">
                                                            Qty: {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleDelete(item._id)}
                                                            className="btn btn-circle btn-sm p-1 text-red-500 hover:text-red-700"
                                                        >
                                                            <MdDelete className="text-xl" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Checkout Section */}
                        {myCarts.length > 0 && (
                            <div className="border-t pt-4 mt-auto">
                                <div className="flex justify-between mb-4">
                                    <span className="font-bold">Total:</span>
                                    <span className="font-bold text-green-500">
                                        ${totalAmount.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedBooking({
                                            price: totalAmount,
                                            quantity: myCarts.reduce((acc, item) => acc + item.quantity, 0),
                                            items: myCarts,
                                            email: session?.user?.email,
                                        });
                                        setIsModalOpen(true);
                                    }}
                                    className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition-colors"
                                >
                                    Proceed to Payment (${totalAmount.toFixed(2)})
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    {selectedBooking && (
                        <Payment
                            booked={selectedBooking}
                            onPaymentSuccess={() => {
                                setIsModalOpen(false);
                                fetchCarts(); // Refresh cart after payment
                            }}
                        />
                    )}
                </Modal>
            )}
        </div>
    );
};

export default CartBar;