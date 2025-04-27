'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import {
    FiDollarSign,
    FiUsers,
    FiCalendar,
    FiShoppingBag,
    FiPieChart
} from 'react-icons/fi'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid,
    Legend
} from 'recharts'
import Image from 'next/image'
import Loading from '@/src/Loading'

const AdminDashboard = () => {
    const { data: session } = useSession()
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalMenuItems: 0
    });


    const [recentPayments, setRecentPayments] = useState([])
    const [popularItems, setPopularItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const calculatedTotalRevenue = recentPayments.reduce(
        (sum, payment) => sum + payment.amount, 0
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [statsRes, paymentsRes, categoryStatsRes] = await Promise.all([
                    axios.get('/api/stats'),
                    axios.get('/api/payments?limit=5'),
                    axios.get('/api/category-stats')
                ]);

                setStats(statsRes.data);

                // Process payments with images
                const paymentsWithImages = await Promise.all(
                    paymentsRes.data.map(async (payment) => {
                        const itemsWithImages = await Promise.all(
                            payment.items.map(async (item) => {
                                try {
                                    const menuRes = await axios.get(`/api/menus/${item.menuId}`);
                                    // Ensure image URL is properly formatted
                                    let imageUrl = menuRes.data.image;
                                    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
                                        imageUrl = `/${imageUrl}`;
                                    }
                                    return {
                                        ...item,
                                        image: imageUrl || null
                                    };
                                } catch (err) {
                                    console.error(`Error fetching menu item ${item.menuId}:`, err);
                                    return {
                                        ...item,
                                        image: null
                                    };
                                }
                            })
                        );
                        return {
                            ...payment,
                            items: itemsWithImages
                        };
                    })
                );

                setRecentPayments(paymentsWithImages);

                // Transform category data for the chart
                const categoryData = categoryStatsRes.data.map(cat => ({
                    name: cat._id,
                    quantity: cat.totalQuantity,
                    revenue: cat.totalRevenue
                }));

                setPopularItems(categoryData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError({
                    message: 'Failed to load dashboard data',
                    details: error.response?.data?.error || error.message,
                    apiError: error.response?.data?.details
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8"><Loading></Loading></div>;
    if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

    // Process top selling items
    const topSellingItems = recentPayments
        .flatMap(payment => payment.items)
        .reduce((acc, item) => {
            const existing = acc.find(i => i.menuId === item.menuId);
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                acc.push({ ...item });
            }
            return acc;
        }, [])
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Admin Dashboard
                </h1>

                {/* User Info */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-sm sm:text-base text-gray-600 truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">
                        {session?.user?.email}
                    </span>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm sm:text-base font-semibold">
                        {session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                </div>
            </div>


            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={<FiDollarSign size={24} />}
                    title="Total Revenue"
                    value={`$${(stats.totalRevenue || calculatedTotalRevenue).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`}
                    color="bg-blue-100 text-blue-600"
                />
                <StatCard
                    icon={<FiUsers size={24} />}
                    title="Total Users"
                    value={stats.totalUsers}
                    color="bg-green-100 text-green-600"
                />
                <StatCard
                    icon={<FiShoppingBag size={24} />}
                    title="Total Orders"
                    value={stats.totalOrders}
                    color="bg-purple-100 text-purple-600"
                />
                <StatCard
                    icon={<FiPieChart size={24} />}
                    title="Menu Items"
                    value={stats.totalMenuItems}
                    color="bg-orange-100 text-orange-600"
                />
            </div>

            {/* Charts and Recent Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Category Performance Chart - Now fully responsive */}
                <div className="bg-white   rounded-lg shadow-sm lg:col-span-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 text-center mb-3 sm:mb-4">
                        Category Performance
                    </h3>
                    {popularItems.length > 0 ? (
                        <div className="w-full h-[450px] sm:h-[450px] md:h-[500px] xl:h-[600px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={popularItems}
                                    margin={{
                                        top: 20,
                                        right: 10,
                                        left: 0,
                                        bottom: window.innerWidth < 640 ? 90 : 60,
                                    }}
                                    barCategoryGap={window.innerWidth < 640 ? 10 : 15}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="name"
                                        angle={window.innerWidth < 640 ? -90 : -45}
                                        textAnchor="end"
                                        height={window.innerWidth < 640 ? 80 : 60}
                                        tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                                        interval={0}
                                        stroke="#555"
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        stroke="#555"
                                        tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                                        width={window.innerWidth < 640 ? 40 : 60}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="#555"
                                        tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                                        width={window.innerWidth < 640 ? 40 : 60}
                                    />
                                    <Tooltip
                                        content={({ payload }) => {
                                            if (payload && payload.length > 1) {
                                                const { name, quantity, revenue } = payload[0].payload;
                                                return (
                                                    <div className="bg-white p-2 border border-gray-300 rounded-lg shadow-lg text-xs sm:text-sm">
                                                        <p className="text-black font-medium">{name}</p>
                                                        <p><span className="font-medium">Sold:</span> {quantity}</p>
                                                        <p><span className="font-medium">Revenue:</span> ${revenue.toFixed(2)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        wrapperStyle={{
                                            fontSize: window.innerWidth < 640 ? '10px' : '12px',
                                            paddingTop: '10px'
                                        }}
                                    />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="quantity"
                                        name="Items Sold"
                                        fill="#FFA500"
                                        barSize={window.innerWidth < 640 ? 40 : 50}
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        yAxisId="right"
                                        dataKey="revenue"
                                        name="Revenue"
                                        fill="#10b981"
                                        barSize={window.innerWidth < 640 ? 40 : 50}
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 py-8 text-sm sm:text-base">
                            {error ? "Error loading category data" : "No category data available"}
                        </p>
                    )}
                </div>

                {/* Recent Payments - Responsive version */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4">
                        Recent Payments
                    </h2>

                    {/* Scrollable container */}
                    <div className="space-y-3 sm:space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
                        {recentPayments.map(payment => (
                            <div key={`payment-${payment._id}`} className="border-b pb-2 sm:pb-3">
                                <div className="flex justify-between items-start">
                                    <span className="font-medium text-sm sm:text-base truncate max-w-[120px] md:max-w-[180px]">
                                        {payment.email}
                                    </span>
                                    <span className="text-green-600 text-sm sm:text-base whitespace-nowrap">
                                        ${payment.amount}
                                    </span>
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {new Date(payment.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year:
                                            typeof window !== 'undefined' && window.innerWidth < 640
                                                ? undefined
                                                : 'numeric',
                                    })}
                                </div>
                                <div className="mt-1 text-xs sm:text-sm">
                                    {payment.items.map((item, index) => (
                                        <div
                                            key={`payment-item-${index}`}
                                            className="flex justify-between mt-1"
                                        >
                                            <span className="truncate max-w-[100px] sm:max-w-[150px]">
                                                {item.title}
                                            </span>
                                            <span className="whitespace-nowrap">
                                                {item.quantity}x ${item.unitPrice}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Popular Items */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Top Selling Menu Items</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {topSellingItems.map((item, index) => (
                        <div key={`top-item-${index}`} className="border rounded-md p-3">
                            <div className="h-40 bg-gray-100 rounded mb-2 overflow-hidden relative">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        unoptimized={true}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <span className="text-gray-500">No image</span>
                                    </div>
                                )}
                            </div>
                            <h3 className="font-medium">{item.title}</h3>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Sold: {item.quantity}</span>
                                <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const StatCard = ({ icon, title, value, color }) => (
    <div className={`p-6 rounded-lg shadow-sm ${color.split(' ')[0]}`}>
        <div className="flex justify-between items-center">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${color.split(' ')[1]}`}>
                {icon}
            </div>
        </div>
    </div>
)

export default AdminDashboard