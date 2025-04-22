import React from "react";
import Banner from "../Components/Banner/Banner";
import SpecialFood from "./SpecialFood/SpecialFood";
import MichelinSection from "./MichelinSection/MichelinSection";
import BookingSection from "./BookingSection/BookingSection";
import SliderByCategory from "./SliderByCategory/SliderByCategory";
import ReviewSlider from "../Components/Reviews/ReviewSlider";

const Homepage = () => {
  return (
    <div className="bg-[#faebdd]">
      <Banner></Banner>
      <SpecialFood></SpecialFood>
      <MichelinSection></MichelinSection>
      <SliderByCategory></SliderByCategory>
      <BookingSection></BookingSection>
      <ReviewSlider></ReviewSlider>
    </div>
  );
};

export default Homepage;
