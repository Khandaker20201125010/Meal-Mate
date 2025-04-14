'use client'
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import sl from "../../../../public/assists/images/sl.png"
import sr from "../../../../public/assists/images/sr.png"
const foodbyCategory = [
    {
        title: "Harvest Bowl",
        Category: "Breakfast",
        desc: "Roasted chicken, roasted sweet potatoes, apples, goat cheese",
        small: "$7.0",
        large: "$10.0",
        image: "/images/harvest.jpg",
    },
    {
        title: "Summer Asian Slaw",
        Category: "Lunch",
        desc: "Pickled carrots + celery, tomatoes, cilantro, blue cheese, za’atar",
        small: "$10.0",
        large: "$14.0",
        image: "/images/asian.jpg",
    },
    {
        title: "Shredded Brussels Sprout",
        Category: "Dinner",
        desc: "Raw beets, cucumbers, basil, sunflower seeds, warm wild rice, shredded kale",
        small: "$9.0",
        large: "$13.0",
        image: "/images/brussels.jpg",
    },
    {
        title: "Easy Pasta Salad",
        Category: "Snacks",
        desc: "Goat cheese, roasted almonds, wild rice, vinaigrette",
        small: "$11.0",
        large: "$16.0",
        image: "/images/pasta.jpg",
    },
    {
        title: "Easy Pasta Salad",
        Category: "Specials",
        desc: "Goat cheese, roasted almonds, wild rice, vinaigrette",
        small: "$11.0",
        large: "$16.0",
        image: "/images/pasta.jpg",
    },
    {
        title: "Easy Pasta Salad",
        Category: "Discounts",
        desc: "Goat cheese, roasted almonds, wild rice, vinaigrette",
        small: "$11.0",
        large: "$16.0",
        image: "/images/pasta.jpg",
    },

];
const uniqueCategoryItems = Array.from(
    new Map(foodbyCategory.map(item => [item.Category, item])).values()
);

const SliderByCategory = () => {
    return (
        <div className="bg-[#ebdccd] p-10">
            <div className="relative px-4 md:px-8 lg:px-16 py-12">
                {/* Background Illustrations - Absolute, Behind Content */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-0 opacity-10 hidden md:block">
                    <Image
                        src={sl}
                        alt="Sketch Left"
                        className="w-auto h-[300px]"
                    />
                </div>
                <div className="absolute right-0 top-3/5 transform -translate-y-1/2 z-0 opacity-10 hidden md:block">
                    <Image
                        src={sr}
                        alt="Sketch Right"
                        className="w-auto h-[300px]"
                    />
                </div>

                {/* Text content stays above */}
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <h1 className="text-xl md:text-3xl font-bold mb-4 text-orange-500">
                        Choose Your Favourite Category
                    </h1>
                    <p className="italic text-gray-600 text-base md:text-xl md:w-2/3 mx-auto">
                        “To be truly original is to invent the future of food, to question, to experiment, to imagine.”
                    </p>
                </div>
            </div>

            <div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-6xl mx-auto"
                >
                    <CarouselContent>
                        {uniqueCategoryItems.map((item, index) => (
                            <CarouselItem key={index} className="sm:basis-full md:basis-1/2 lg:basis-1/3">
                                <div className="p-2">
                                    <Card className="shadow-md">
                                        <CardContent className="p-4">
                                            <div className="relative aspect-[4/3] w-full mb-3 rounded-md overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    layout="fill"
                                                    objectFit="cover"
                                                />
                                            </div>
                                            <div className="text-sm text-orange-700 font-medium mb-1">
                                                {item.Category}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Hide navigation on small screens */}
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                </Carousel>

            </div>
        </div>
    );
};

export default SliderByCategory;
