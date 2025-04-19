'use client';

import { useState } from 'react';

const MenuCardsBody = ({ menu }) => {
    const { image, title, smallPrice, largePrice, desc } = menu;
    const [size, setSize] = useState('small');

    const price = size === 'small' ? smallPrice : largePrice;

    return (
        <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                />
            </div>
            <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold text-orange-600">{title}</h2>

                <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name={`size-${menu._id || name}`}
                            value="small"
                            checked={size === 'small'}
                            onChange={() => setSize('small')}
                            className="radio radio-sm radio-warning"
                        />
                        <span className="text-sm">Small</span>
                    </label>

                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name={`size-${menu._id || name}`}
                            value="large"
                            checked={size === 'large'}
                            onChange={() => setSize('large')}
                            className="radio radio-sm radio-warning"
                        />
                        <span className="text-sm">Large</span>
                    </label>
                </div>

                <p className="text-gray-700 font-medium text-lg">Price: ${price}</p>

                <button className="btn btn-md bg-orange-500 hover:bg-orange-600 text-white w-full mt-2">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default MenuCardsBody;
