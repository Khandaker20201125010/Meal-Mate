'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import MenuCardsBody from './MenuCardsBody';

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
        return <p className="text-center p-4">Loading menus…</p>;
    }

    return (
        <section id="menu-section" className="px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-orange-500 mb-4">
                Our Menu
            </h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
                Explore our delicious selection of meals, freshly prepared and served with love.
            </p>

            {/* search + sort */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by name…"
                    className="p-2 border rounded-md w-1/3 text-black"
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
                                ? 'bg-orange-500 text-white'
                                : 'bg-transparent text-orange-500 border border-orange-500 hover:bg-orange-100'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* grid */}
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentSet.length > 0 ? (
                    currentSet.map(m => <MenuCardsBody key={m._id} menu={m} />)
                ) : (
                    <p className="col-span-full text-center text-gray-600">
                        No menus found.
                    </p>
                )}
            </div>

            {/* pagination */}
            <div className="flex justify-center mt-8 space-x-2">
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
            </div>
        </section>
    );
};

export default MenuCards;
