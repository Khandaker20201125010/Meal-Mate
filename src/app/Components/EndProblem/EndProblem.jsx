"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import p1 from "../../../../public/assists/images/p1.png";
import p2 from "../../../../public/assists/images/p2.png";
import Link from "next/link";
import { Typewriter } from 'react-simple-typewriter';
const EndProblem = () => {
    const [showVideo, setShowVideo] = useState(false);

    useEffect(() => {
        setShowVideo(true);
    }, []);

    return (
        <section className="relative w-full h-[700px] md:h-[600px] overflow-hidden text-white">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                {showVideo && (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        preload="auto"
                    >
                        <source src="/videos/foodpresentbg.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6">
                <div className="flex flex-col max-sm:flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12 max-w-6xl w-full mx-auto">
                    {/* Left Images */}
                    <div className="relative w-[220px] sm:w-[300px] lg:w-[400px]">
                        <Image
                            src={p1}
                            alt="Main Dish"
                            className="w-full h-auto rounded-xl shadow-xl animate-spin-slow "
                            priority
                        />
                        <Image
                            src={p2}
                            alt="Drink"
                            className="absolute -bottom-6 -left-16 w-[100px] sm:w-[140px] lg:w-[160px] float-animation "
                            priority
                        />
                    </div>

                    {/* Right Text */}
                    <div className="text-center lg:text-left max-w-xl mt-8 lg:mt-0">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 leading-tight">
                            <Typewriter
                                words={['Got A Problem? We Got You!']}
                                loop={0} // 0 = infinite
                                cursor
                                cursorStyle="."
                                typeSpeed={150}
                                deleteSpeed={50}
                                delaySpeed={2000}
                            />
                        </h2>
                        <p className="text-sm md:text-base text-gray-200 mb-6">
                            "We Rise By Lifting Others" is what we believe in. You won't stay stuck in the
                            process; that's our promise. All the support tickets are taken care of with
                            high priority. You will hear back from us within 12 hours of receiving your mail.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                            <Link href="/contact">
                                <button className="btn bg-[#d3a465] hover:bg-[#b88a4c] text-white font-medium sm:font-semibold px-5 sm:px-6 py-2 rounded-full transition transform hover:scale-105">
                                    Contact Us
                                </button>
                            </Link>
                            <Link href="/menu">
                                <button className="btn bg-[#d3a465] hover:bg-[#b88a4c] text-white font-medium sm:font-semibold px-5 sm:px-6 py-2 rounded-full transition transform hover:scale-105">
                                    Purchase Now
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EndProblem;