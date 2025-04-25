'use client';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TbShoppingCartHeart } from "react-icons/tb";
import axios from "axios";

const CartBar = () => {
    const [myCarts, setMyCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sliderVisible, setSliderVisible] = useState(false); // To manage the visibility of the slider
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

    if (loading) return <div className="w-10 h-10"></div>; // Loading placeholder
    if (error) return <div className="w-10 h-10"></div>; // Error placeholder

    return (
        <div className="relative w-10 h-10">
            <div tabIndex={0} role="button" className="btn bg-transparent rounded-full border-none shadow-none" onClick={() => setSliderVisible(!sliderVisible)}>
                <div className="indicator">
                    <TbShoppingCartHeart className="text-3xl text-orange-600" />
                    {/* Display cart length inside a badge or span */}
                    <span className="badge badge-sm absolute w-7 h-7 rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-orange-600 text-white">
                        +{myCarts.length}
                    </span>
                </div>
            </div>

            {/* Slider Menu */}
            <div
                className={`fixed top-16 right-0 w-72 h-full bg-white shadow-xl transition-transform duration-500 ${sliderVisible ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-4">
                    {/* Content inside the slider */}
                    <h2 className="text-xl font-bold">Your Cart</h2>
                    {/* Add cart items here */}
                    <ul>
                        {myCarts.map((cartItem, index) => (
                            <li key={index} className="my-2">
                                <p>{cartItem.name}</p>
                                <p>Price: ${cartItem.price}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CartBar;
