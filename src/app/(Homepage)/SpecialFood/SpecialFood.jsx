"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const SpecialFood = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Check if user is Pro
  const isProUser = session?.user?.status === 'pro';

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

  // Apply discount to special items
  const specialCategoryItems = menus.filter(item =>
    item.category.includes("Special")
  ).map(item => ({
    ...item,
    // Apply 20% discount for Pro users
    smallPrice: isProUser ? item.smallPrice * 0.8 : item.smallPrice,
    largePrice: isProUser ? item.largePrice * 0.8 : item.largePrice
  }));

  return (
    <div className="bg-[#f8ece1]">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between px-4 py-8 gap-6">
        <div className="text-center lg:text-left">
          <h1 className="font-bold text-xl text-gray-700">Special Food</h1>
          <h1 className="mt-5 font-bold text-4xl md:text-5xl text-gray-900 cursor-pointer">
            View Our <br className="hidden md:block" />
            Menu
          </h1>
          {isProUser && (
            <div className="mt-2 text-green-600 font-medium">
              Enjoy 20% Pro discount on all items!
            </div>
          )}
        </div>

        <div className="float-animation bg-orange-600 text-white flex items-center justify-center p-6 w-28 h-28 mt-5 rounded-full cursor-pointer hover:bg-orange-700 transition-all">
          <Link href="/menu">View All</Link>
        </div>
      </div>

      <div className="w-full px-4 py-8">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
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
                  <div className="mt-3 flex flex-col gap-1 text-green-700 font-medium">
                    <div>
                      <span>Small: {item.smallPrice.toFixed(2)}$</span>
                      {isProUser && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {(item.smallPrice / 0.8).toFixed(2)}$
                        </span>
                      )}
                    </div>
                    <div>
                      <span>Large: {item.largePrice.toFixed(2)}$</span>
                      {isProUser && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {(item.largePrice / 0.8).toFixed(2)}$
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href={`/menu/${item._id}`}>
                    <button className="btn btn-sm rounded-md bg-orange-600 text-white mt-1 hover:bg-orange-600">
                      View Details
                    </button>
                  </Link>
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