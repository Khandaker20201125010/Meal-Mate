'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { FaEye } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import sl from '../../../../public/assists/images/sl.png';
import sr from '../../../../public/assists/images/sr.png';

const SliderByCategory = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        axios
            .get('/api/menus')
            .then(({ data }) => setMenus(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const allCats = menus.flatMap(m => m.category);
    const uniqueCats = Array.from(new Set(allCats));

    const handleCategoryClick = (cat) => {
        console.log('Navigating to category:', cat); // Debug log
        router.push(`/menu?category=${encodeURIComponent(cat)}`);
    };

    return (
        <div className="bg-[#ebdccd] p-10">
            {/* Header */}
            <div className="relative px-4 md:px-8 lg:px-16 py-12">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 opacity-10 hidden md:block">
                    <Image src={sl} alt="" width={300} height={300} className='h-auto w-auto' />
                </div>
                <div className="absolute right-0 top-3/5 transform -translate-y-1/2 opacity-10 hidden md:block">
                    <Image src={sr} alt="" width={300} height={300} className='h-auto w-auto' />
                </div>
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <h1 className="text-xl md:text-3xl font-bold mb-4 text-orange-500">
                        Choose Your Favourite Category
                    </h1>
                    <p className="italic text-gray-600 md:text-xl">
                        “To be truly original is to invent the future of food…”
                    </p>
                </div>
            </div>

            {/* Carousel */}
            <Carousel opts={{ align: 'start', loop: true }} className="w-full max-w-6xl mx-auto">
                <CarouselContent>
                    {uniqueCats.map((cat, i) => (
                        <CarouselItem key={i} className="p-2 sm:basis-full md:basis-1/2 lg:basis-1/3">
                            <Card className="h-[450px] rounded-xl overflow-hidden relative shadow-none">
                                <CardContent className="p-0 h-full">
                                    <div className="relative w-full h-full group">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent z-10" />
                                        <Image
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Adjust based on your layout
                                            src={menus.find(m => m.category.includes(cat))?.image || sl}
                                            alt={cat}
                                            fill
                                            className="object-cover z-0 h-auto w-auto"
                                        />
                                        <div className="absolute inset-0 transform -translate-y-full group-hover:translate-y-0 transition-all duration-500 bg-black/40 z-20 flex flex-col items-center justify-center">
                                            <div
                                                className="border-2 p-2 rounded-full cursor-pointer mb-2"
                                                onClick={() => handleCategoryClick(cat)}
                                            >
                                                <FaEye className="text-white text-2xl" />
                                            </div>
                                            <p className="text-white font-semibold">{cat}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </div>
    );
};

export default SliderByCategory;
