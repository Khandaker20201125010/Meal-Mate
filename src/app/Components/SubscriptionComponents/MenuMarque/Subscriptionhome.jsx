'use client';
import React, { useState } from 'react';
import MenuMarque from './MenuMarque';
import { BarChart2, Crown, Gift } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import { loadStripe } from "@stripe/stripe-js";
import SubscriptionCheckoutForm from '@/src/app/(Dashboard)/Componenets/Payments/SubscriptionCheckoutForm';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const Subscriptionhome = () => {
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const handleUpgradeToPro = () => {
        setIsSubscriptionModalOpen(true);
    };

    return (
        <div>
            <MenuMarque></MenuMarque>
            <section className="bg-gradient-to-br from-orange-50 to-amber-100 py-12 px-6 md:px-16 rounded-3xl shadow-xl mx-4 md:mx-20 my-16 border border-orange-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 max-w-6xl mx-auto">
                    {/* Text Section */}
                    <div className="text-center md:text-left space-y-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
                            Join Our Foodie Family!
                        </h2>
                        <p className="text-lg text-orange-800 max-w-lg">
                            Get exclusive perks and be the first to know about our special offers, new menu items, and foodie events!
                        </p>

                        <div className="space-y-4 text-xl">
                            <div className="flex items-center gap-4 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-all duration-300 group">
                                <div className="p-2 bg-amber-100 rounded-full group-hover:rotate-12 transition-transform duration-300">
                                    <Crown className="text-amber-600" size={24} />
                                </div>
                                <span className="font-medium text-orange-900">Priority support</span>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-all duration-300 group">
                                <div className="p-2 bg-amber-100 rounded-full group-hover:rotate-12 transition-transform duration-300">
                                    <Gift className="text-amber-600" size={24} />
                                </div>
                                <span className="font-medium text-orange-900">Exclusive features</span>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-all duration-300 group">
                                <div className="p-2 bg-amber-100 rounded-full group-hover:rotate-12 transition-transform duration-300">
                                    <BarChart2 className="text-amber-600" size={24} />
                                </div>
                                <span className="font-medium text-orange-900">Advanced analytics</span>
                            </div>
                        </div>
                    </div>

                    {/* Button Section */}
                    <div className="relative">
                        <div className="absolute -inset-3 bg-amber-400/30 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
                        <button open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}
                            className="relative px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl text-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            Subscribe Now
                            <span className="absolute -right-2 -top-2 flex h-6 w-6">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-6 w-6 bg-amber-500"></span>
                            </span>
                        </button>
                        <p className="text-center text-sm text-orange-700 mt-3">
                            Join 10,000+ happy foodies!
                        </p>
                    </div>
                </div>
               
            </section>
        </div>
    );
};

export default Subscriptionhome;