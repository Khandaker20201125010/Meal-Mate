import { FaGreaterThan } from 'react-icons/fa6';
import d1 from '../../../../public/assists/images/d1.jpg';

const DetailsBanner = () => {
    return (
        <div
            style={{ backgroundImage: `url(${d1.src})` }}
            className="relative bg-cover bg-center h-[300px] bg-fixed"
        >
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10 text-white flex flex-col items-center justify-center gap-2 h-full">
                <h1 className="text-3xl">Details</h1>
                <p className="flex items-center">
                    MealMate <FaGreaterThan className="mx-1" />View Details 
                </p>
            </div>
        </div>
    );
};

export default DetailsBanner;