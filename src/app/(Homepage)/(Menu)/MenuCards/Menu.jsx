'use client';
import React, { Suspense } from 'react';
import MenuBanner from '../MenuBanner/MenuBanner';
import MenuCards from './MenuCards';

const Menu = () => {
    return (
        <div>
            <MenuBanner></MenuBanner>
            <Suspense fallback={<div>Loading menu...</div>}>
                <MenuCards />
            </Suspense>
        </div>
    );
};

export default Menu;