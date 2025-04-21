import AboutBG from "@/src/app/Components/AboutComonenets/AboutBG/AboutBG";
import AboutHeader from "@/src/app/Components/AboutComonenets/AboutHeader/AboutHeader";
import Instanthelp from "@/src/app/Components/AboutComonenets/AboutHeader/Instanthelp";

const page = () => {
    return (
        <div className="bg-gradient-to-b from-[#f4f0e8] to-[#f4f0e8]">
            <AboutBG></AboutBG>
            <AboutHeader></AboutHeader>
            <Instanthelp></Instanthelp>
        </div>
    );
};

export default page;