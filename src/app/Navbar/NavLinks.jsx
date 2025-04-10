"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "Appointment", href: "/appointment" },
  { name: "Contact Us", href: "/contact" },
  { name: "About", href: "/about" }
];

const NavLinks = ({ textColor }) => {
  const pathname = usePathname();

  return (
    <ul className="flex gap-5">
      {links.map(({ name, href }) => {
        const isActive = pathname === href;
        return (
          <li key={name}>
            <Link
              href={href}
              className={`font-bold px-4 py-2 rounded-md transition-all duration-500 ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:brightness-90"
                  : `bg-transparent ${textColor} border-b border-transparent hover:border-orange-500 `
              }`}
            >
              {name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
