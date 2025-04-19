'use client';
import React, { useEffect, useState } from 'react';
import MenuCardsBody from './MenuCardsBody';
import axios from 'axios';

const MenuCards = () => {
    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceSortOrder, setPriceSortOrder] = useState('asc');
    const itemsPerPage = 9;
    const [selectedCategory, setSelectedCategory] = useState('All Menu');

    const categories = ['All Menu', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Discount', 'Special'];

    // Fetch menus from the API
    const fetchMenus = async () => {
        try {
            const { data } = await axios.get('/api/menus');
            console.log('Fetched Menus:', data); // Log the data to check if it's coming in correctly
            if (Array.isArray(data) && data.length > 0) {
                setMenus(data);
                setFilteredMenus(data);  // Initially display all menus
            } else {
                console.log('No menus found in the response');
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    // Filter, search, and sort logic
    useEffect(() => {
        console.log('Menus:', menus); // Log menus before filtering

        // Filter by search query
        const filteredBySearch = menus.filter(menu => {
            const title = menu.title ? menu.title.toLowerCase() : '';
            const searchLower = searchQuery.toLowerCase();
            return title.includes(searchLower);
        });

        console.log('Filtered by Search:', filteredBySearch); // Check filtered search

        // Filter by selected category
        let filteredByCategory =
            selectedCategory === 'All Menu'
                ? filteredBySearch
                : filteredBySearch.filter(menu => {
                    if (Array.isArray(menu.category)) {
                        return menu.category.some(cat =>
                            cat.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
                        );
                    }
                    return false;
                });


        console.log('Filtered by Category:', filteredByCategory); // Check filtered by category

        // Sort by price
        if (priceSortOrder === 'asc') {
            filteredByCategory.sort((a, b) => a.smallPrice - b.smallPrice);
        } else {
            filteredByCategory.sort((a, b) => b.smallPrice - a.smallPrice);
        }

        setFilteredMenus(filteredByCategory); // Apply all filters and sorting
        setCurrentPage(1); // Reset to first page on filtering or sorting
    }, [searchQuery, selectedCategory, priceSortOrder, menus]);

    const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentMenus = filteredMenus.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handlePriceSortChange = (event) => {
        setPriceSortOrder(event.target.value);
    };

    console.log('Filtered Menus:', filteredMenus); // Check if menus are being filtered correctly

    if (loading) {
        return <div className="text-center p-4">Loading menus...</div>;
    }

    return (
        <div className="px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-orange-500 mb-4">Our Menu</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
                Explore our delicious selection of meals, freshly prepared and served with love.
            </p>

            {/* Search Bar */}
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by menu name"
                    className="p-2 border rounded-md text-black w-1/3"
                />

            </div>
            {/* Price Sort */}
            <div className="flex justify-center mb-6">
                <select
                    value={priceSortOrder}
                    onChange={handlePriceSortChange}
                    className="p-2 border rounded-md text-black"
                >
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
            </div>


            {/* Category Tabs */}
            <div className="flex justify-center mb-6">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`mx-2 py-2 px-4 rounded-lg text-lg font-semibold transition duration-300 ${selectedCategory === category
                            ? 'bg-orange-500 text-white'
                            : 'bg-transparent text-orange-500 border border-orange-500 hover:bg-orange-100'
                            }`}
                    >
                        {category}
                    </button>
                ))}

            </div>


            {/* Menu Cards */}
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentMenus.length > 0 ? (
                    currentMenus.map((menu) => <MenuCardsBody key={menu._id} menu={menu} />)
                ) : (
                    <div className="col-span-full text-center text-gray-600">No menus found.</div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-sm px-4 py-2 border rounded bg-orange-400 text-black hover:bg-orange-500 disabled:opacity-50"
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`btn btn-sm px-3 py-1 border rounded ${currentPage === i + 1
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-100'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-sm px-4 py-2 border rounded bg-orange-400 text-black hover:bg-orange-500 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MenuCards;
