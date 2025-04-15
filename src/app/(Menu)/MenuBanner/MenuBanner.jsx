import { FaGreaterThan } from 'react-icons/fa6';
import menuBanner from '../../../../public/assists/images/menu-banner.jpg'

const MenuBanner = () => {
    return (
        <div
            style={{ backgroundImage: `url(${menuBanner.src})` }}
            className="relative bg-cover bg-center h-[300px]"
        >
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10 text-white flex flex-col items-center justify-center gap-2 h-full">
                <h1 className="text-3xl">Menu-Lists</h1>
                <p className="flex items-center">
                    MealMate <FaGreaterThan className="mx-1" /> Menu-List
                </p>
            </div>
        </div>

    );
};

export default MenuBanner;