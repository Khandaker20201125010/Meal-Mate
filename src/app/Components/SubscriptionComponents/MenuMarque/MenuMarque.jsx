import Link from "next/link";
import Marquee from "react-fast-marquee";
import { GiPizzaSlice, GiHamburger, GiFruitBowl, GiNoodles, GiCakeSlice, GiCoffeeCup } from "react-icons/gi";

const MenuMarque = () => {
    const menuItems = [
        { icon: <GiPizzaSlice className="text-3xl" />, text: "Freshly Baked Pizzas" },
        { icon: <GiHamburger className="text-3xl" />, text: "Juicy Burgers" },
        { icon: <GiFruitBowl className="text-3xl" />, text: "Healthy Salads" },
        { icon: <GiNoodles className="text-3xl" />, text: "Authentic Pastas" },
        { icon: <GiCakeSlice className="text-3xl" />, text: "Delicious Desserts" },
        { icon: <GiCoffeeCup className="text-3xl" />, text: "Premium Coffee" }
    ];

    return (
        <div className="bg-[#faebdd] py-8 ">
            <h3 className="text-center text-2xl md:text-3xl font-bold text-orange-600 mb-6 font-serif">
                Our Specialties
            </h3>

            <div className="relative">
                <Marquee
                    pauseOnHover
                    direction="left"
                    speed={40}
                    gradient={true}
                    gradientColor={[250, 235, 221]}
                    gradientWidth={100}
                >
                    <div className="flex items-center gap-8 px-4">
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-orange-100 hover:shadow-md transition-all"
                            >
                                <span className="text-orange-500">{item.icon}</span>
                                <span className="text-lg font-semibold text-orange-700 tracking-wide">
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </Marquee>

                <Marquee
                    pauseOnHover
                    direction="right"
                    speed={35}
                    gradient={true}
                    gradientColor={[250, 235, 221]}
                    gradientWidth={100}
                    className="mt-4"
                >
                    <div className="flex items-center gap-8 px-4">
                        {menuItems.reverse().map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-orange-100 hover:shadow-md transition-all"
                            >
                                <span className="text-orange-500">{item.icon}</span>
                                <span className="text-lg font-semibold text-orange-700 tracking-wide">
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </Marquee>
            </div>

            <div className="text-center mt-8">
                <Link href="/menu">  <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105">
                    Explore Full Menu
                </button></Link>
            </div>
        </div>
    );
};

export default MenuMarque;