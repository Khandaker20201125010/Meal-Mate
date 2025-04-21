import { FaGreaterThan } from "react-icons/fa6";
import aboutBG from "../../../../../public/assists/images/br-about.jpg"

const AboutBG = () => {
    return (
          <div
              style={{ backgroundImage: `url(${aboutBG.src})` }}
              className="relative bg-cover bg-center h-[400px] bg-fixed"
          >
              <div className="absolute inset-0 bg-black opacity-30"></div>
              <div className="relative z-10 text-white flex flex-col items-center justify-center gap-2 h-full">
                  <h1 className="text-3xl">About Story</h1>
                  <p className="flex items-center">
                      MealMate <FaGreaterThan className="mx-1" /> About Story
                  </p>
              </div>
          </div>
    );
};

export default AboutBG;