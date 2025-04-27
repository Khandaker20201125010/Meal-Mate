import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import Loading from '@/src/Loading';

const image_hosting_token = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_token}`;

const CustomerProfile = () => {
    const { data: session } = useSession();
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [completedPayments, setCompletedPayments] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch user data
                const userRes = await axios.get(`/api/users?email=${session.user.email}`);
                setUserData(userRes.data);
                setFormData({
                    name: userRes.data.name || '',
                    email: userRes.data.email || '',
                    phone: userRes.data.phone || '',
                    address: userRes.data.address || ''
                });

                // Fetch user orders
                const ordersRes = await axios.get(`/api/bookings?userEmail=${session.user.email}`);
                setOrders(ordersRes.data);

                // Fetch completed payments
                const paymentsRes = await axios.get(`/api/payments?email=${session.user.email}`);
                setCompletedPayments(paymentsRes.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        if (session?.user?.email) {
            fetchData();
        }
    }, [session]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const uploadImageToHostingService = async (imageFile) => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await axios.post(image_hosting_api, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                return response.data.data.url;
            } else {
                throw new Error('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            let imageUrl = userData?.image;
            if (selectedImage) {
                imageUrl = await uploadImageToHostingService(selectedImage);
            }

            const updatedUserData = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                ...(imageUrl && { image: imageUrl })
            };

            const res = await axios.put(`/api/users/${userData._id}`, updatedUserData);

            setUserData(res.data);
            setIsEditing(false);
            setSelectedImage(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loading></Loading></div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                            {userData?.image ? (
                                <Image
                                    src={userData.image}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold">
                                    {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>

                        {isEditing && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Change Profile Picture
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                />
                            </div>
                        )}

                        <h2 className="text-xl font-semibold">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded text-center"
                                />
                            ) : (
                                userData?.name || 'User'
                            )}
                        </h2>
                        <p className="text-gray-600">{userData?.email}</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Phone</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                />
                            ) : (
                                <p>{userData?.phone || 'Not provided'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Address</label>
                            {isEditing ? (
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                    rows="3"
                                />
                            ) : (
                                <p>{userData?.address || 'Not provided'}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            {isEditing ? (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-6">My Orders</h2>

                    {orders.length === 0 ? (
                        <p>You haven't placed any orders yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {orders.map(order => (
                                <div key={order._id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-medium">Order #{order._id.slice(-6).toUpperCase()}</h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : order.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="border-t pt-3">
                                        <h4 className="font-medium mb-2">Items:</h4>
                                        <ul className="space-y-2">
                                            {order.items.map((item, index) => (
                                                <li key={index} className="flex justify-between">
                                                    <span>{item.title} x {item.quantity}</span>
                                                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="border-t pt-3 flex justify-between font-medium">
                                        <span>Total:</span>
                                        <span>${order.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-medium text-gray-600 mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold">{orders.length}</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-medium text-gray-600 mb-2">Completed Payments</h3>
                    <p className="text-3xl font-bold">
                        {completedPayments.length}
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-medium text-gray-600 mb-2">Bookings</h3>
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold">{orders.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold">
                                {orders.filter(o => o.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;