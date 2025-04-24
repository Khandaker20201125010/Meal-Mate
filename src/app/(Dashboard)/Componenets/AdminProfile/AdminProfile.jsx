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
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'

const AdminDashboard = () => {
    const { data: session } = useSession()
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalMenuItems: 0
    })
    const [recentPayments, setRecentPayments] = useState([])
    const [popularItems, setPopularItems] = useState([])
    const [loading, setLoading] = useState(true)

    const [error, setError] = useState(null)
    useEffect(() => {
        // In your fetchData function
        // In your fetchData function
        // In your fetchData function
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [statsRes, paymentsRes, menuStatsRes] = await Promise.all([
                    axios.get('/api/stats'),
                    axios.get('/api/payments?limit=5'),
                    axios.get('/api/menus?popular=true')
                ]);

                setStats(statsRes.data);
                setRecentPayments(paymentsRes.data);

                // Handle the new response structure
                const responseData = menuStatsRes.data;

                // Set category data for chart
                if (responseData.categoryStats) {
                    const categoryData = responseData.categoryStats.map(cat => ({
                        name: cat._id,
                        quantity: cat.totalQuantity,
                        revenue: cat.totalRevenue
                    }));
                    setPopularItems(categoryData);
                }

                // Set popular menu items if available
                if (responseData.popularMenus) {
                    // You might want to set this to another state variable
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError({
                    message: 'Failed to load dashboard data',
                    details: error.response?.data?.error || error.message,
                    apiError: error.response?.data?.details // Show API error details
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData()
    }, [])


    if (loading) return <div className="p-8">Loading dashboard...</div>

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">{session?.user?.email}</span>
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {session?.user?.name?.charAt(0) || 'A'}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={<FiDollarSign size={24} />}
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toFixed(2)}`}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Category Performance Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Category Performance</h2>
                    <div className="h-80">
                        {popularItems.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={popularItems}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis yAxisId="left" orientation="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            name === 'Revenue' ? `$${value.toFixed(2)}` : value,
                                            name
                                        ]}
                                    />
                                    <Legend />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="quantity"
                                        name="Items Sold"
                                        fill="#4f46e5"
                                        barSize={20}
                                    />
                                    <Bar
                                        yAxisId="right"
                                        dataKey="revenue"
                                        name="Revenue"
                                        fill="#10b981"
                                        barSize={20}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                No category data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
                    <div className="space-y-4">
                        {recentPayments.map(payment => (
                            <div key={`payment-${payment._id}-${new Date(payment.createdAt).getTime()}`} className="border-b pb-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">{payment.email}</span>
                                    <span className="text-green-600">${payment.amount}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(payment.createdAt).toLocaleDateString()}
                                </div>
                                <div className="text-sm">
                                    {payment.items.map((item, index) => (
                                        <div key={`payment-item-${payment._id}-${index}`} className="flex justify-between mt-1">
                                            <span>{item.title}</span>
                                            <span>{item.quantity}x ${item.unitPrice}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popular Items */}
            {/* Popular Items */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Top Selling Menu Items</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {recentPayments.flatMap(payment => payment.items)
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
                        .slice(0, 5)
                        .map((item, index) => (
                            <div key={`top-item-${index}`} className="border rounded-lg p-3">
                                <div className="h-40 bg-gray-100 rounded mb-2 overflow-hidden flex items-center justify-center">
                                    <span className="text-gray-400">Item image</span>
                                </div>
                                <h3 className="font-medium">{item.title}</h3>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Sold: {item.quantity}</span>
                                    <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
                                </div>
                            </div>
                        ))
                    }
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