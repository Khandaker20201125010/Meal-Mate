'use client';
import React, { useState } from 'react';
import ReviewsBody from './ReviewsBody';
import ReviewForm from './ReviewForm';

const Reviews = () => {
    const [refreshSignal, setRefreshSignal] = useState(0);
    const [activeTab, setActiveTab] = useState('write'); // 'write' or 'view'

    const handleRefresh = () => setRefreshSignal(prev => prev + 1);

    return (
        <div className="max-w-7xl mx-auto mt-10 py-10">
            {/* Tab Navigation */}
            <div className="flex border-b border-orange-200">
                <button
                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'write' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-orange-500'}`}
                    onClick={() => setActiveTab('write')}
                >
                    Write a Review
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'view' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-orange-500'}`}
                    onClick={() => setActiveTab('view')}
                >
                    View Reviews
                </button>
            </div>

            {/* Tab Content - Left-aligned */}
            <div className="text-left mt-4">
                {activeTab === 'write' ? (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-orange-600">Leave Your Review</h2>
                        <ReviewForm onSubmitSuccess={() => {
                            handleRefresh();
                            setActiveTab('view'); // Switch to view tab after submission
                        }} />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-orange-600">Customer Reviews</h2>
                        <ReviewsBody refreshSignal={refreshSignal} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;