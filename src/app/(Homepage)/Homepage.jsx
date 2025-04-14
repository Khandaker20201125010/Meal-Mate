import React from "react";
import Banner from "../Components/Banner/Banner";
import SpecialFood from "./SpecialFood/SpecialFood";
import MichelinSection from "./MichelinSection/MichelinSection";
import BookingSection from "./BookingSection/BookingSection";
import SliderByCategory from "./SliderByCategory/SliderByCategory";

const Homepage = () => {
  return (
    <div>
      <Banner></Banner>
      <SpecialFood></SpecialFood>
      <MichelinSection></MichelinSection>
      <SliderByCategory></SliderByCategory>
      <BookingSection></BookingSection>
    </div>
  );
};

export default Homepage;
