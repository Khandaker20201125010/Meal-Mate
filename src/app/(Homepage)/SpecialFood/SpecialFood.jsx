"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination ,Autoplay  } from "swiper/modules";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SpecialFood = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const fetchMenus = async () => {
    try {
      const { data } = await axios.get(`/api/menus`);
      setMenus(data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const specialCategoryItems = menus.filter(item =>
    item.category.includes("Special")
  );

  return (
    <div className="bg-[#f8ece1]">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between px-4 py-8 gap-6">
        <div className="text-center lg:text-left">
          <h1 className="font-bold text-xl text-gray-700">Special Food</h1>
            <h1 className="mt-5 font-bold text-4xl md:text-5xl text-gray-900 cursor-pointer">
              View Our <br className="hidden md:block" />
              Menu
            </h1>
        </div>

        <div className="float-animation bg-orange-600 text-white flex items-center justify-center p-6 w-28 h-28 mt-5 rounded-full cursor-pointer hover:bg-orange-700 transition-all">
          <Link href="/menu">View All</Link>
        </div>
      </div>

      <div className="w-full px-4 py-8">
        <Swiper
         modules={[ Autoplay]}
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 3000, // 3 seconds between slides
            disableOnInteraction: false, // keeps autoplay running after user interaction
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {specialCategoryItems.length > 0 ? (
            specialCategoryItems.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="relative rounded-xl overflow-hidden h-60">
                  <Image
                    sizes="100%"
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-md"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <div className="mt-3 flex gap-4 text-green-700 font-medium">
                    <span>Small : {item.smallPrice}$</span>
                    <span>Large : {item.largePrice}$</span>
                  </div>
                  <button className="btn btn-sm rounded-md bg-orange-600 text-white mt-1 hover:bg-orange-600">View Details</button>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <div className="text-center text-gray-600">No special items found</div>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default SpecialFood;
