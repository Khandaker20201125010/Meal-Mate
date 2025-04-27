import React from "react";
import Banner from "../Components/Banner/Banner";
import SpecialFood from "./SpecialFood/SpecialFood";
import MichelinSection from "./MichelinSection/MichelinSection";
import BookingSection from "./BookingSection/BookingSection";
import SliderByCategory from "./SliderByCategory/SliderByCategory";
import ReviewSlider from "../Components/Reviews/ReviewSlider";
import EndProblem from "../Components/EndProblem/EndProblem";
import Subscriptionhome from "../Components/SubscriptionComponents/MenuMarque/Subscriptionhome";

const Homepage = () => {
  return (
    <div className="bg-[#faebdd]">
      <Banner></Banner>
      <SpecialFood></SpecialFood>
      <MichelinSection></MichelinSection>
      <SliderByCategory></SliderByCategory>
      <BookingSection></BookingSection>
      <Subscriptionhome></Subscriptionhome>
      <ReviewSlider></ReviewSlider>
      <EndProblem></EndProblem>
    </div>
  );
};

export default Homepage;
