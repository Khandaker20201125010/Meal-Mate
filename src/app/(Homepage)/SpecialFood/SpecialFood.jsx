"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";




const foodItems = [
    {
        title: "Harvest Bowl",
        desc: "Roasted chicken, roasted sweet potatoes, apples, goat cheese",
        small: "$7.0",
        large: "$10.0",
        image: "/images/harvest.jpg",
    },
    {
        title: "Summer Asian Slaw",
        desc: "Pickled carrots + celery, tomatoes, cilantro, blue cheese, za’atar",
        small: "$10.0",
        large: "$14.0",
        image: "/images/asian.jpg",
    },
    {
        title: "Shredded Brussels Sprout",
        desc: "Raw beets, cucumbers, basil, sunflower seeds, warm wild rice, shredded kale",
        small: "$9.0",
        large: "$13.0",
        image: "/images/brussels.jpg",
    },
    {
        title: "Easy Pasta Salad",
        desc: "Goat cheese, roasted almonds, wild rice, vinaigrette",
        small: "$11.0",
        large: "$16.0",
        image: "/images/pasta.jpg",
    },
    {
        title: "Easy Pasta Salad",
        desc: "Goat cheese, roasted almonds, wild rice, vinaigrette",
        small: "$11.0",
        large: "$16.0",
        image: "/images/pasta.jpg",
    },
    {
        title: "Easy Pasta Salad",
        desc: "Goat cheese, roasted almonds, wild rice, vinaigrette",
        small: "$11.0",
        large: "$16.0",
        image: "/images/pasta.jpg",
    },
];

const SpecialFood = () => {
    return (
        <div className=" bg-[#f8ece1]">
            <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between px-4 py-8 gap-6">
              
                <div className="text-center lg:text-left">
                    <h1 className="font-bold text-xl text-gray-700">Special Food</h1>
                    <h1 className="mt-5 font-bold text-4xl md:text-5xl text-gray-900">
                        View Our <br className="hidden md:block" />
                        Menu
                    </h1>
                </div>

              
                <div className="bg-orange-600 text-white flex items-center justify-center p-6 w-20 h-20 mt-5 rounded-full cursor-pointer hover:bg-orange-700 transition-all">
                    View All
                </div>
            </div>


            <div className="w-full px-4 py-8 ">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={20}
                    pagination={{ clickable: true }}

                    breakpoints={{
                        640: { slidesPerView: 1.5 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                >
                    {foodItems.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="rounded-xl  overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-60 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.desc}</p>
                                    <div className="mt-3 flex gap-4 text-green-700 font-medium">
                                        <span>Small {item.small}</span>
                                        <span>Large {item.large}</span>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default SpecialFood;