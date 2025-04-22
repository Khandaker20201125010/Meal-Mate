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
        <div className='bg-[#faebdd]  p-10 mt-2'>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-orange-500 font-serif">Customer Reviews</h2>
                <p>"See what our customers have to say about our fine dining experience."</p>
            </div>
            <Carousel opts={{ align: 'start', loop: true }} className="w-full max-w-6xl mx-auto z-10">
                <CarouselContent>
                    {reviews.map((review, idx) => {
                        const date = new Date(review.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                        });

                        return (
                            <CarouselItem key={idx} className="p-2 sm:basis-full md:basis-1/2 lg:basis-1/3">
                                <Card className="h-full flex flex-col justify-between rounded-lg overflow-hidden  bg-gradient-to-r from-orange-50 to-orange-100">
                                    <CardContent className="flex flex-col h-full p-6">
                                        <FaQuoteLeft className="text-3xl text-orange-200 mb-4" />
                                        <p className="text-gray-700 flex-1 mb-6">“{review.comment}”</p>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) =>
                                                    i < review.rating
                                                        ? <FaStar key={i} className="text-yellow-400" />
                                                        : <FaRegStar key={i} className="text-gray-300" />
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500 italic">{date}</span>
                                        </div>

                                        <p className="font-semibold text-gray-800">{review.userName}</p>
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
