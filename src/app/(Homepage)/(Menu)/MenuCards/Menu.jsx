'use client';
import React, { Suspense } from 'react';
import MenuBanner from '../MenuBanner/MenuBanner';
import MenuCards from './MenuCards';
import Loading from '@/src/Loading';

const Menu = () => {
    return (
        <div>
            <MenuBanner></MenuBanner>
            <Suspense fallback={<div><Loading></Loading></div>}>
                <MenuCards />
            </Suspense>
        </div>
    );
};

export default Menu;