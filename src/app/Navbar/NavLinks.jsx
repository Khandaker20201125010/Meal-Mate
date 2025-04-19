"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Contacts", href: "/contact" },
  { name: "About", href: "/about" },
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
                  ? "border-b-2 border-orange-600  text-orange-600 hover:brightness-90"
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
