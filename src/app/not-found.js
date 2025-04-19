'use client';

import Image from 'next/image';
import Link from 'next/link';
import errorImage from '../../public/assists/images/error.png'; // adjust if your path is different

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto w-full">
        {/* Left Text Section */}
        <div className="text-center md:text-left space-y-4">
          <h1 className="text-5xl font-extrabold text-gray-800">Oops!</h1>
          <p className="text-gray-600 text-lg">
            The page you are looking for does not exist.
          </p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition"
          >
            GO BACK
          </Link>
        </div>

        {/* Right Image Section */}
        <div className="flex justify-center md:justify-end">
          <Image
            src={errorImage}
            alt="404 Error Illustration"
            width={400}
            height={300}
            priority
          />
        </div>
      </div>
    </div>
  );
}
