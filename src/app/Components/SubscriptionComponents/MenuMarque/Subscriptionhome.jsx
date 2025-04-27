'use client';
import React, { useState } from 'react';
import MenuMarque from './MenuMarque';
import { BarChart2, Crown, Gift, X } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import SubscriptionCheckoutForm from '@/src/app/(Dashboard)/Componenets/Payments/SubscriptionCheckoutForm';
import Swal from 'sweetalert2';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Subscriptionhome = () => {
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

    const handleSuccess = () => {
        setIsSubscriptionModalOpen(false);

        // Create a simple confetti effect using CSS
        const showConfetti = () => {
            const colors = ['#f97316', '#22c55e', '#3b82f6', '#eab308', '#a855f7'];
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.pointerEvents = 'none';
            container.style.zIndex = '9999';

            for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.style.position = 'absolute';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.left = `${Math.random() * 100}vw`;
                confetti.style.top = '-10px';
                confetti.style.opacity = '0.8';

                const animation = confetti.animate(
                    [
                        { transform: 'translateY(0) rotate(0deg)', opacity: 0.8 },
                        { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                    ],
                    {
                        duration: 2000 + Math.random() * 3000,
                        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
                    }
                );

                animation.onfinish = () => confetti.remove();
                container.appendChild(confetti);
            }

            document.body.appendChild(container);
            setTimeout(() => container.remove(), 3000);
        };

        Swal.fire({
            title: '<strong>Premium Activated!</strong>',
            html: `
                <div class="text-center">
                    <div class="animate-bounce mb-4">
                        <svg class="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <p class="text-lg text-gray-700">You're now part of our Foodie Pro family!</p>
                    <p class="text-sm text-gray-500 mt-2">Check your email for subscription details.</p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Got it!',
            confirmButtonColor: '#f97316',
            background: '#fff7ed',
            backdrop: 'rgba(0,0,0,0.4)',
            timer: 8000,
            timerProgressBar: true,
            didOpen: () => {
                showConfetti();
                // Use browser's built-in audio if available
                if (typeof window !== 'undefined' && window.Audio) {
                    try {
                        // Simple beep sound using the Web Audio API
                        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                        const oscillator = audioCtx.createOscillator();
                        const gainNode = audioCtx.createGain();

                        oscillator.type = 'triangle';
                        oscillator.frequency.value = 880;
                        gainNode.gain.value = 0.1;

                        oscillator.connect(gainNode);
                        gainNode.connect(audioCtx.destination);

                        oscillator.start();
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
                        oscillator.stop(audioCtx.currentTime + 1);
                    } catch (e) {
                        console.log('Audio playback error:', e);
                    }
                }
            }
        });
    };

    return (
        <div>
            <MenuMarque />

            {/* Subscription Section */}
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
                        <button
                            onClick={() => setIsSubscriptionModalOpen(true)}
                            className="btn relative px-10 py-8 border-none bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl text-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
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

            {/* Subscription Modal */}
            {isSubscriptionModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
                        <button
                            onClick={() => setIsSubscriptionModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-orange-600 mb-6 text-center">
                                Upgrade to Foodie Pro
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-full">
                                        <Crown className="text-amber-600" size={20} />
                                    </div>
                                    <span className="font-medium">$9/month - Cancel anytime</span>
                                </div>
                            </div>

                            <Elements stripe={stripePromise}>
                                <SubscriptionCheckoutForm onSuccess={handleSuccess} />
                            </Elements>

                            <p className="text-sm text-gray-500 mt-4 text-center">
                                Secure payment processed by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscriptionhome;