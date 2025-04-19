"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Contacts", href: "/contact" },
  { name: "About", href: "/about" },
];

const NavLinks = ({ textColor, isTop }) => {
  const pathname = usePathname();

  return (
    <ul className="flex gap-5">
      {links.map(({ name, href }) => {
        const isActive = pathname === href;
        return (
          <li key={name}>
            <Link
              href={href}
              className={`font-bold px-4 py-2 rounded-md transition-all duration-300 ${
                isActive
                  ? `${isTop ? "text-white" : "text-orange-500"} border-b-2 border-orange-500`
                  : `${textColor} border-b border-transparent hover:border-orange-500`
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
