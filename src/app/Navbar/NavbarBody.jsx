"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SlMenu } from "react-icons/sl";
import { AiOutlineClose } from "react-icons/ai";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { MdSpaceDashboard } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";

const NavbarBody = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [navColor, setNavColor] = useState("bg-transparent");
  const [textColor, setTextColor] = useState("text-white");
  const [buttonColor, setButtonColor] = useState("bg-transparent");

  useEffect(() => {
    setIsOpen(false); // close mobile menu on route change
  }, [pathname]);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY === 0) {
      setNavbarVisible(true);
      setNavColor("bg-transparent");
      setTextColor("text-white");
      setButtonColor("bg-transparent text-orange-900 ");
    } else if (currentScrollY > lastScrollY) {
      setNavbarVisible(false);
    } else {
      setNavbarVisible(true);
      setNavColor("bg-white");
      setTextColor("text-orange-500");
      setButtonColor(
        "bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:text-gray-200 "
      );
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (status === "loading") return null;

  return (
    <div
      className={`${lastScrollY === 0 ? "absolute" : "fixed"} top-0 left-0 right-0 mx-auto max-w-[90rem] z-50 transition-all duration-300 ${navColor} ${navbarVisible ? "transform-none" : "-translate-y-full"
        }`}
    >
      <div className="navbar px-4 py-2 flex justify-between items-center">
        <Logo />
        <div className="hidden lg:flex ">
          <NavLinks textColor={textColor} isTop={lastScrollY === 0} />
        </div>

        <div className="hidden lg:block">
          {!session ? (
            <a href="/login" className={`${buttonColor} border-blue-900 mx-4 rounded-full`}>
              <button className="btn px-6 py-2 border border-white text-white font-semibold tracking-wider rounded-full backdrop-blur-lg bg-opacity-75 bg-transparent transition hover:bg-gradient-to-r from-pink-500 to-orange-500">
                Login →
              </button>
            </a>
          ) : (
            <div className="dropdown dropdown-end mx-16">
              {/* Avatar Button */}
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar border border-white"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden relative border border-white">
                  <Image
                    src={
                      session?.user?.image ||
                      "https://i.ibb.co.com/PfGH0x7/c-HJpdm-F0-ZS9sci9pb-WFn-ZXMvd2-Vic2l0-ZS8y-MDIz-LTAx-L3-Jt-Nj-A5-LXNvb-Glka-WNvbi13-LTAw-Mi1w-Ln-Bu.jpg"
                    }
                    alt="User Avatar"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Dropdown Content */}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 text-black rounded-box shadow w-52 mt-2 z-[999]"
              >
                <li className="px-4 py-2 font-medium border-b border-gray-200">
                  {session?.user?.email}
                </li>
                <li>
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md">
                    <MdSpaceDashboard /> Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left rounded-md"
                  >
                    <LuLogOut /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>


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
