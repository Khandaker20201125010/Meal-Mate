'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const BreadcrumbHeader = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Remove "dashboard" from display but keep its index for link building
  const displaySegments = segments.filter(segment => segment !== 'dashboard');

  return (
    <div className="flex items-center space-x-2 ">
      <Link href="/" className="text-blue-600 hover:underline font-medium">
        Home
      </Link>
      {displaySegments.map((segment, index) => {
        // Build full path including the original segments to maintain routing
        const realIndex = segments.findIndex((s, i) =>
          segments.filter(seg => seg !== 'dashboard')[index] === s &&
          segments.slice(0, i).filter(s => s !== 'dashboard').length === index
        );
        const path = '/' + segments.slice(0, realIndex + 1).join('/');
        const isLast = index === displaySegments.length - 1;

        return (
          <div key={path} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-gray-500" />
            {isLast ? (
              <span className="text-gray-700 capitalize">{segment.replace(/-/g, ' ')}</span>
            ) : (
              <Link
                href={path}
                className="text-blue-600 hover:underline capitalize font-medium"
              >
                {segment.replace(/-/g, ' ')}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BreadcrumbHeader;
