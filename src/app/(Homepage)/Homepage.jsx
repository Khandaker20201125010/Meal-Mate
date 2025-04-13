import React from 'react';
import Banner from '../Components/Banner/Banner';
import SpecialFood from './SpecialFood/SpecialFood';
import MichelinSection from './MichelinSection/MichelinSection';
import BookingSection from './BookingSection/BookingSection';

const Homepage = () => {
    return (
        <div>
            <Banner></Banner>
            <SpecialFood></SpecialFood>
            <MichelinSection></MichelinSection>
            <BookingSection></BookingSection>
        </div>
    );
};

export default Homepage;