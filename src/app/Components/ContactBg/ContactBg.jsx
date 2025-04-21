import { FaGreaterThan } from 'react-icons/fa';
import contactBg from '../../../../public/assists/images/bg-contact.jpg'

const ContactBg = () => {
    return (
        <div
            style={{ backgroundImage: `url(${contactBg.src})` }}
            className="relative bg-cover bg-center h-[400px] bg-fixed"
        >
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10 text-white flex flex-col items-center justify-center gap-2 h-full">
                <h1 className="text-3xl">Feel Free toContact</h1>
                <p className="flex items-center">
                    MealMate <FaGreaterThan className="mx-1" /> Contact
                </p>
            </div>
        </div>
    );
};

export default ContactBg;