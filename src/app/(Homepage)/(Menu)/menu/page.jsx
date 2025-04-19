import React from 'react';
import MenuBanner from '../MenuBanner/MenuBanner';
import MenuCards from '../MenuCards/MenuCards';

const menu = () => {
    return (
        <div>
           <MenuBanner></MenuBanner>
           <MenuCards></MenuCards>
        </div>
    );
};

export default menu;