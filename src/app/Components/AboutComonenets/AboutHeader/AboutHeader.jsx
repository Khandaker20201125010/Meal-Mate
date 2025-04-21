'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import a1 from "../../../../../public/assists/images/a1.jpg";
import garlic from "../../../../../public/assists/images/garlic.png";
import herb from "../../../../../public/assists/images/mb1.png";

const AboutHeader = () => {
    const [offsetY, setOffsetY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffsetY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const clampedOffset = Math.min(offsetY, 300);

    return (
        <div className="mt-20 relative min-h-screen bg-gradient-to-b from-[#f4f0e8] to-[#f4f0e8] text-black font-serif overflow-hidden">
            {/* Decorative Herbs */}
            <div
                className="absolute top-20 left-10 w-32 md:w-48 opacity-50 z-0 transition-transform duration-300 ease-out"
                style={{ transform: `translateY(${clampedOffset * -0.3}px)` }}
            >
                <Image src={herb} alt="Herb" />
            </div>

            <div
                className="absolute bottom-10 right-10 w-20 md:w-32 opacity-50 z-0 transition-transform duration-300 ease-out"
                style={{ transform: `translateY(${clampedOffset * -0.3}px)` }}
            >
                <Image src={garlic} alt="Garlic" />
            </div>

            {/* Main content with image behind text */}
            <div className="relative z-10 h-screen flex flex-col md:flex-row items-start md:items-center px-6 sm:px-10 lg:px-24">
                <div className="relative max-w-5xl w-full">
                    {/* Image Behind Text for md+ screens */}
                    <div
                        className="hidden md:block absolute -top-16 right-0 w-[250px] sm:w-[350px] md:w-[400px] lg:w-[450px] z-0 opacity-80 transition-transform duration-300 ease-out"
                        style={{ transform: `translateY(${clampedOffset * -0.2}px)` }}
                    >
                        <Image
                            src={a1}
                            alt="Dish"
                            className="rounded-lg shadow-xl object-cover w-full h-auto"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="relative z-10 p-4 sm:p-6 lg:p-8 rounded-xl bg-opacity-80">
                        <p className="text-sm tracking-widest mb-4">01</p>
                        <h1 className="text-3xl md:w-1/2 sm:text-4xl md:text-5xl lg:text-[70px] font-serif leading-tight mb-6 flex items-center gap-4 text-black">
                            About <span className="font-light">Us</span>
                            <span className="flex-grow border-t border-black/30 "></span>
                        </h1>
                        <p className="text-base sm:text-lg leading-relaxed font-sans sm:w-4/5 lg:w-3/5">
                            Welcome to <strong>“MealMate”</strong> – where culinary artistry meets your palate in a symphony of flavors and textures! <br />
                            Nestled in the heart of the bustling city, our restaurant beckons you to embark on a gastronomic journey like no other.
                        </p>
                    </div>

                    {/* Inline Image for small screens */}
                    <div className="block md:hidden mt-6 w-full">
                        <Image
                            src={a1}
                            alt="Dish"
                            className="rounded-lg shadow-xl object-cover w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutHeader;
