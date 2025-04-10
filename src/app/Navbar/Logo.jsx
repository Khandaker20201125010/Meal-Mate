import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/assists/logos/logo.png"; 

const Logo = () => (
  <Link href="/">
    <Image
      src={logo}
      alt="Logo"
      className="w-10 md:w-16 max-sm:h-12 max-sm:w-12 rounded-full max-sm:bg-white max-sm:rounded-full"
    />
  </Link>
);

export default Logo;
