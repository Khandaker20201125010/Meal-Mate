'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import MenuCardsBody from './MenuCardsBody';
import mb1 from '../../../../../public/assists/images/mb1.png';
import mb2 from '../../../../../public/assists/images/mb2.png';
import mb4 from '../../../../../public/assists/images/mb4.png';
import mb5 from '../../../../../public/assists/images/mb5.png';
import Image from 'next/image';
import Loading from '@/src/Loading';
const MenuCards = () => {
    const params = useSearchParams();
    const initialCat = params.get('category') || 'All Menu';

    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState(initialCat);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceSortOrder, setPriceSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const categories = [
        'All Menu',
        'Breakfast',
        'Lunch',
        'Dinner',
        'Snack',
        'Discount',
        'Special',
    ];

    useEffect(() => {
        axios
            .get('/api/menus')
            .then(({ data }) => {
                setMenus(data);
                setFilteredMenus(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Update category when URL param changes
    useEffect(() => {
        const catFromURL = params.get('category') || 'All Menu';
        setSelectedCategory(catFromURL);
    }, [params]);

    // Filter + sort
    useEffect(() => {
        let arr = menus.filter(m =>
            m.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (selectedCategory !== 'All Menu') {
            arr = arr.filter(m =>
                Array.isArray(m.category) &&
                m.category.some(c => c.toLowerCase() === selectedCategory.toLowerCase())
            );
        }

        arr.sort((a, b) =>
            priceSortOrder === 'asc'
                ? a.smallPrice - b.smallPrice
                : b.smallPrice - a.smallPrice
        );

        setFilteredMenus(arr);
        setCurrentPage(1);
    }, [menus, searchQuery, selectedCategory, priceSortOrder]);

    const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const currentSet = filteredMenus.slice(start, start + itemsPerPage);

    if (loading) {
        return <div className="text-center p-4"><Loading /></div>;
    }

    return (
        <section id="menu-section" className="px-4 py-8 ">
            <div className='relative  px-4 md:px-8 lg:px-16 py-12'>

                <div className="absolute right-16 top-3/5 transform -translate-y-1/2 opacity-35 hidden md:block  ">
                    <Image src={mb2} alt="" width={200} height={300} className='w-auto h-auto' />
                </div>
                <p className="text-center text-yellow-500 max-w-2xl mx-auto mb-4">
                    Good Food, Great Times
                </p>
                <h1 className=" text-3xl md:text-4xl font-bold text-center text-orange-500 mb-2">
                    View Our Menus
                </h1>
            </div>
            {/* search + sort */}
            <div className="flex max-sm:flex-col flex-wrap justify-center gap-4 mb-6">
                <div className="absolute left-20 transform -translate-y-1/2 opacity-35  hidden md:block  ">
                    <Image src={mb1} alt="" width={200} height={300} className='w-auto h-auto' />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by name…"
                    className="p-2 border rounded-md w-1/3 max-sm:w-full text-black"
                />
                <select
                    value={priceSortOrder}
                    onChange={e => setPriceSortOrder(e.target.value)}
                    className="p-2 border rounded-md text-black"
                >
                    <option value="asc">Price: Low→High</option>
                    <option value="desc">Price: High→Low</option>
                </select>
            </div>

            {/* tabs */}
            <div className="flex flex-wrap justify-center mb-6">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`mx-2 py-2 px-4 rounded-lg font-semibold transition ${selectedCategory === cat
                            ? 'bg-orange-500 text-white '
                            : 'bg-transparent text-orange-500 border border-orange-500 hover:bg-orange-100'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* grid */}
            <div className="relative z-10 container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {currentSet.length > 0 ? (
                    currentSet.map(m => <MenuCardsBody key={m._id} menu={m} />)
                ) : (
                    <p className="col-span-full text-center text-gray-600">
                        No menus found.
                    </p>
                )}
            </div>

            {/* pagination */}
            <div className="flex justify-center mt-8 space-x-2 ">
                <div className="absolute opacity-35 left-0 z-0 transform -translate-y-1/2  hidden md:block  ">
                    <Image src={mb4} alt="" width={200} height={300} className='w-auto h-auto' />
                </div>
                <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn btn-sm px-4 py-2 bg-orange-400 text-white rounded disabled:opacity-50"
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`btn btn-sm px-3 py-1 rounded ${currentPage === i + 1
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-orange-500 border border-orange-500'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn btn-sm px-4 py-2 bg-orange-400 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
                <div className="absolute opacity-35 right-0 z-0 transform -translate-y-1/2  hidden md:block ">
                    <Image src={mb5} alt="" width={200} height={300} className='w-auto h-auto' />
                </div>
            </div>
        </section>
    );
};

export default MenuCards;
