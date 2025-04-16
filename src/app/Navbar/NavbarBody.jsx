"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SlMenu } from "react-icons/sl";
import { AiOutlineClose } from "react-icons/ai";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import { Button } from "@/components/ui/button";

const NavbarBody = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [navColor, setNavColor] = useState("bg-transparent"); // Default transparent background
  const [textColor, setTextColor] = useState("text-white");
  const [buttonColor, setButtonColor] = useState("bg-transparent");

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY === 0) {
      setNavbarVisible(true);
      setNavColor("bg-transparent"); // Ensure navbar remains transparent at top
      setTextColor("text-white");
      setButtonColor("bg-transparent text-orange-900 ");
    } else if (currentScrollY > lastScrollY) {
      setNavbarVisible(false);
    } else {
      setNavbarVisible(true);
      setNavColor("bg-white"); // Set to white after scrolling down
      setTextColor("text-orange-500");
      setButtonColor(
        "bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:text-gray-200 ",
      );
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    setIsOpen(false); // Close menu on route change
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`${lastScrollY === 0 ? "absolute" : "fixed"
        } top-0 left-0 right-0 mx-auto max-w-[90rem] z-50 transition-all duration-300 ${navColor} ${navbarVisible ? "transform-none" : "-translate-y-full"
        }`}
    >
      <div className="navbar px-4 py-2 flex justify-between items-center">
        <Logo />
        <div className="hidden lg:flex">
          <NavLinks textColor={textColor} />
        </div>

        <div className="hidden lg:block">
          <a
            href="/login"
            className={` ${buttonColor} border-blue-900 mx-4 rounded-full`}
          >
            <button className="btn px-6 py-2 border border-white text-white font-semibold tracking-wider rounded-full backdrop-blur-lg bg-opacity-75 bg-transparent transition hover:bg-gradient-to-r from-pink-500 to-orange-500">
              Login →
            </button>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <AiOutlineClose size={28} className="text-orange-500" />
            ) : (
              <SlMenu size={28} className="text-orange-500" />
            )}
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isOpen} closeMenu={() => setIsOpen(false)} />
    </div>
  );
};

export default NavbarBody;
