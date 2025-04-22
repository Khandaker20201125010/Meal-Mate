'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const ReviewsBody = ({ refreshSignal }) => {
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

    return (
        <div className="space-y-6">
            {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet.</p>
            ) : (
                reviews.map((review, i) => (
                    <div key={i} className="bg-white p-4 rounded shadow">
                        <div className="flex items-start justify-between">
                            <p className="font-semibold text-lg">{review.userName}</p>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, idx) => (
                                    <span key={idx} className={idx < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                ))}
                            </div>
                        </div>
                        <p className="mt-2 text-gray-700">{review.comment}</p>
                        {review.image && (
                            <Image
                                src={review.image}
                                alt="Review"
                                width={200}
                                height={200}
                                className="mt-3 rounded"
                            />
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ReviewsBody;
