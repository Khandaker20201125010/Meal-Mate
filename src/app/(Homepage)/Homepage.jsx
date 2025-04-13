import React from 'react';
import Banner from '../Components/Banner/Banner';
import SpecialFood from './SpecialFood/SpecialFood';
import MichelinSection from './MichelinSection/MichelinSection';

const Homepage = () => {
    return (
        <div>
            <Banner></Banner>
            <SpecialFood></SpecialFood>
            <MichelinSection></MichelinSection>
        </div>
    );
};

export default Homepage;