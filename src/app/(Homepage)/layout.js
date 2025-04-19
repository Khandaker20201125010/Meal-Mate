'use client'; // Marking the component as client-side

import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { usePathname } from "next/navigation";

const metadata = {
  title: "MEALMATE | Home",
};

export default function RootLayout({ children }) {
  const [isLoginOrSignup, setIsLoginOrSignup] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoginOrSignup(
      pathname.includes("login") || pathname.includes("signup")
    );
  }, [pathname]);

  return (
    <>
      {/* Conditionally render Navbar and Footer only on non-login and non-signup pages */}

      <>
        <div className="flex flex-col min-h-screen">
          {!isLoginOrSignup && (<Navbar />)}
          <main className="flex-grow">{children}</main>
          {!isLoginOrSignup && (<Footer />)}
        </div>
      </>



    </>
  );
}
