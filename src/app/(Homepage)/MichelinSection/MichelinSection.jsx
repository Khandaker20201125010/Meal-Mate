import Image from "next/image";
import moddlefood from "../../../../public/assists/images/middlefood.jpg";
import moddlefoodone from "../../../../public/assists/images/middlefood2.png";
import moddlefoodtwo from "../../../../public/assists/images/middlefood3.png";
import { Button } from "@/components/ui/button";


const MichelinSection = () => {
    return (
        <div>
            <section className="bg-[#faebdd] py-16 px-4 relative overflow-hidden">

                <div className="flex flex-col lg:flex-row justify-center items-center gap-10 max-w-6xl mx-auto">

                    <div className="bg-white px-4 py-6  rounded-full shadow-md text-center w-40 h-56  float-animation">
                        <div className="border-2 p-4 w-32 h-44 rounded-full">
                            <p className="text-xl">🌸🌸</p>
                            <h3 className="font-semibold mt-2 text-md">MICHELIN<br />2024</h3>
                            <p className="text-gray-500 mt-1 text-[10px]">Excellent cooking,<br />worth a detour</p>
                        </div>
                    </div>

                    {/* Center Image */}
                    <div style={{ backgroundImage: `url(${moddlefood.src})` }} className="bg-cover   p-2 rounded-full border-4 border-white  shadow-lg">
                        <div className="overflow-hidden border-2 rounded-full w-[280px] h-[360px]">
                         
                        </div>
                    </div>

                    {/* Right Card */}
                    <div className="bg-white px-4 py-6  rounded-full shadow-md text-center w-40 h-56 float-animation">
                        <div className="border-2 p-4 w-32 h-44 rounded-full">
                            <p className="text-xl">🌸🌸🌸</p>
                            <h3 className="font-semibold mt-2 text-md">MICHELIN<br />2025</h3>
                            <p className="text-gray-500 mt-1 text-[10px]">Exceptional cuisine,<br />worth a special journey</p>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center mt-16 max-w-2xl mx-auto">
                    <div className="text-3xl mb-2">🌰</div>
                    <p className="italic text-sm text-orange-800 mb-2">Awakening experiences</p>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">LAUGH, CELEBRATE, INVITE YOURSELF</h2>
                    <p className="text-gray-700 text-sm mb-6">
                        Whether you're feeling peckish or hungry, whether it's midday or midnight, our
                        menu has something to satisfy every appetite. Mediterranean and Lille flavours
                        blend together to offer you pleasures to share (or keep for yourself...).
                    </p>
                    <Button>Join Us Now</Button>
                </div>

                {/* Optional Background Sketches */}
                {/* You can add them via absolute positioned background images */}
            </section>

        </div>
    );
};

export default MichelinSection;