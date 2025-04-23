'use client';
import { useState } from "react";
import galleryBG from "../../../../public/assists/images/galleryBg.jpg";
import { FaGreaterThan } from "react-icons/fa6";
import { BentoGridGallery } from "./BentoGridGallery";


const GalleryImg = () => {


    return (
        <div>
            <div
                style={{ backgroundImage: `url(${galleryBG.src})` }}
                className="relative bg-cover bg-center h-[350px] bg-fixed"
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 text-white flex flex-col items-center justify-center gap-2 h-full">
                    <h1 className="text-3xl font-serif">Gallery</h1>
                    <p className="flex items-center">
                        MealMate <FaGreaterThan className="mx-1" /> Gallery
                    </p>
                </div>
            </div>
            <div className="bg-gradient-to-b from-[#f4f0e8] to-[#f4f0e8]">
                <div className="text-center px-4 py-12 sm:py-16 md:py-20">
                    <p className="text-orange-400 text-sm sm:text-base md:text-lg">
                        A Taste of Our Passion
                    </p>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif mt-2">
                        The Essence of Our Kitchen
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-neutral-600 mt-4 max-w-xl mx-auto">
                        Discover the harmony of flavor and craftsmanship in every dish we serve.
                    </p>
                </div>

                <div>  <BentoGridGallery></BentoGridGallery></div>
            </div>

        </div>
    );
};

export default GalleryImg;