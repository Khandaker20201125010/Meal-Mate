'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, User } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <User size={20} />, label: 'Profile', href: '/dashboard/profile' },
  ];

  return (
    <div className={`bg-gray-900 text-white ${isOpen ? 'w-64' : 'w-16'} transition-all h-screen`}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-4 text-left">
        ☰
      </button>
      <nav className="space-y-2 px-2">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <div className="flex items-center gap-4 p-2 hover:bg-gray-700 rounded cursor-pointer">
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
