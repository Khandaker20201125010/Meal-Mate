"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "Appointment", href: "/appointment" },
  { name: "Contact Us", href: "/contact" },
  { name: "About", href: "/about" },
];

const MobileMenu = ({ isOpen, closeMenu }) => {
  const pathname = usePathname();

  return (
    <div
      className={`lg:hidden fixed top-20 left-0 w-full min-h-full transition-transform duration-500 ease-in-out z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"} bg-[#ebdccd] p-4`}
    >
      <ul className="space-y-6 text-2xl min-h-screen flex flex-col">
        {links.map(({ name, href }) => {
          const isActive = pathname === href;
          return (
            <li key={name} onClick={closeMenu}>
              <Link
                href={href}
                className={`font-bold px-4 py-2 rounded-md block transition-all duration-500 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-transparent text-white"
                    : "text-black hover:border-b-2 border-orange-900"
                }`}
              >
                {name}
              </Link>
            </li>
          );
        })}
        <li className="pt-6">
          <Link href="/login" onClick={closeMenu}>
            <button className="btn w-full btn-outline text-white border-white">
              Login
            </button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MobileMenu;
