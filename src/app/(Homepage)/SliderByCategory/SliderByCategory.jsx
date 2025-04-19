'use client';
import { useEffect, useState } from 'react';
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
import sl from '../../../../public/assists/images/sl.png';
import sr from '../../../../public/assists/images/sr.png';
import { FaEye } from 'react-icons/fa';

const SliderByCategory = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

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
        console.log(menus);
    }, []);

    // ✅ Calculate unique categories *after* menus are set
    const uniqueCategoryItems = Array.from(
        new Map(menus.map(item => [item.category, item])).values()
    );

    return (
        <div className="bg-[#ebdccd] p-10">
            {/* Background sketches */}
            <div className="relative px-4 md:px-8 lg:px-16 py-12">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-0 opacity-10 hidden md:block">
                    <Image src={sl} alt="Sketch Left" className="w-auto h-[300px]" />
                </div>
                <div className="absolute right-0 top-3/5 transform -translate-y-1/2 z-0 opacity-10 hidden md:block">
                    <Image src={sr} alt="Sketch Right" className="w-auto h-[300px]" />
                </div>

                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <h1 className="text-xl md:text-3xl font-bold mb-4 text-orange-500">
                        Choose Your Favourite Category
                    </h1>
                    <p className="italic text-gray-600 text-base md:text-xl md:w-2/3 mx-auto">
                        “To be truly original is to invent the future of food, to question,
                        to experiment, to imagine.”
                    </p>
                </div>
            </div>

            {/* Carousel */}
            {loading ? (
                <p className="text-center text-orange-600 text-lg">Loading menus...</p>
            ) : (
                <div>
                    <Carousel
                        opts={{ align: 'start', loop: true }}
                        className="w-full max-w-6xl mx-auto"
                    >
                        <CarouselContent>
                            {uniqueCategoryItems.map((item, index) => (
                                <CarouselItem
                                    key={index}
                                    className="sm:basis-full md:basis-1/2 lg:basis-1/3"
                                >
                                    <div className="p-2">
                                        <Card className="shadow-none h-[450px] relative overflow-hidden  rounded-xl">
                                            <CardContent className="p-0 h-full">
                                                <div className="relative w-full h-full group overflow-hidden rounded-xl">
                                                    {/* Gradient overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent z-10"></div>

                                                    {/* Full image */}
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        sizes="100vw"
                                                        className="object-cover w-full h-full z-0"
                                                    />

                                                    {/* Overlay category text */}
                                                    <div className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-[200%] opacity-0 group-hover:translate-y-[-50%] group-hover:opacity-100 transition-all duration-500 ease-in-out z-20">
                                                        <div className="flex-col absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold">
                                                            <div className='border-2 rounded-full p-2'><FaEye className='text-2xl ' /></div>
                                                            <div> {Array.isArray(item.category) ? item.category.join(', ') : item.category}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>

                            ))}
                        </CarouselContent>

                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                </div>
            )}
        </div>
    );
};

export default SliderByCategory;
