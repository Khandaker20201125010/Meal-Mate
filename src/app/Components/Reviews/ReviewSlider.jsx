'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { FaStar, FaRegStar, FaQuoteLeft } from 'react-icons/fa';

const ReviewSlider = ({ refreshSignal = 0 }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await axios.get('/api/reviews');
                setReviews(data);
            } catch (err) {
                console.error("Error fetching reviews:", err);
            }
        };
        fetchReviews();
    }, [refreshSignal]);

    if (reviews.length === 0) {
        return <p className="text-center text-gray-500 py-10">No reviews yet.</p>;
    }

    return (
        <div className="bg-[#faebdd] p-10 mt-2">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2 text-orange-500 font-serif">Customer Reviews</h2>
                <p className="text-gray-600">"See what our customers have to say about our fine dining experience."</p>
            </div>

            <Carousel opts={{ align: 'start', loop: true }} className="w-full max-w-6xl mx-auto">
                <CarouselContent>
                    {reviews.map((review, idx) => {
                        const date = new Date(review.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                        });

                        return (
                            <CarouselItem
                                key={idx}
                                className="p-4 sm:basis-full md:basis-1/2 lg:basis-1/3"
                            >
                                <Card data-aos="zoom-in" className="h-full group transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl bg-white rounded-xl overflow-hidden">
                                    <CardContent className="flex flex-col h-full p-8 relative animate-fadeIn">
                                        <FaQuoteLeft className="text-4xl text-orange-200 mb-4" />
                                        <p className="text-gray-700 text-base mb-6 leading-relaxed flex-1">
                                            “{review.comment}”
                                        </p>

                                        <div className="flex items-center justify-between mt-6">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) =>
                                                    i < review.rating
                                                        ? <FaStar key={i} className="text-yellow-400" />
                                                        : <FaRegStar key={i} className="text-gray-300" />
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400 italic">{date}</span>
                                        </div>

                                        <p className="mt-4 font-semibold text-gray-800">{review.userName}</p>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default ReviewSlider;
