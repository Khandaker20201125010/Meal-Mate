'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const MenuCardsBody = ({ menu }) => {
  const [size, setSize] = useState('small');
  const { data: session } = useSession();
  const isProUser = session?.user?.status === 'pro';

  // Calculate base price
  const basePrice = size === 'small' ? menu.smallPrice : menu.largePrice;
  
  // Apply 20% discount for pro users
  const price = isProUser ? basePrice * 0.8 : basePrice;

  return (
    <div data-aos="zoom-in" className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={menu.image}
          alt={menu.title}
          className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
        />
      </div>
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-semibold text-orange-600">{menu.title}</h2>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name={`size-${menu._id}`}
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
              name={`size-${menu._id}`}
              value="large"
              checked={size === 'large'}
              onChange={() => setSize('large')}
              className="radio radio-sm radio-warning"
            />
            <span className="text-sm">Large</span>
          </label>
        </div>
        <p className="text-gray-700 font-medium text-lg">
          Price: ${price.toFixed(2)}
          {isProUser && (
            <span className="ml-2 text-green-500 text-sm">
              (20% Pro discount applied!)
            </span>
          )}
        </p>
        <Link href={`/menu/${menu._id}`}>
          <button className="btn w-full btn-sm bg-orange-500 hover:bg-orange-600 text-white">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MenuCardsBody;