'use client'
import axios from "axios";
import { useEffect, useState } from "react";

const AdminPaymentHistory = () => {
    const [allPayments, setAllPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPayments = async () => {
        try {
            const response = await axios.get('/api/payments');
            // Ensure response.data is an array
            const paymentsData = Array.isArray(response.data) ? response.data : [];
            setAllPayments(paymentsData);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch all Payments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // Safely flatten payments with their items
    const flattenedPayments = allPayments.reduce((acc, payment) => {
        // Ensure payment.items exists and is an array
        const items = Array.isArray(payment?.items) ? payment.items : [];
        const flattenedItems = items.map(item => ({
            ...payment,
            ...item,
            paymentId: payment._id
        }));
        return [...acc, ...flattenedItems];
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">All Payments {allPayments.length}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    {/* Table headers remain the same */}
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 text-left">Payment ID</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Amount</th>
                            <th className="py-2 px-4 text-left">Title</th>
                            <th className="py-2 px-4 text-left">Size</th>
                            <th className="py-2 px-4 text-left">Unit Price</th>
                            <th className="py-2 px-4 text-left">Quantity</th>
                            <th className="py-2 px-4 text-left">Status</th>
                            <th className="py-2 px-4 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flattenedPayments.length > 0 ? (
                            flattenedPayments.map((payment, index) => (
                                <tr key={`${payment.paymentId}-${index}`} className="border-b">
                                    <td className="py-2 px-4">{payment.paymentId || 'N/A'}</td>
                                    <td className="py-2 px-4">{payment.email || 'N/A'}</td>
                                    <td className="py-2 px-4">${payment.amount || '0'}</td>
                                    <td className="py-2 px-4">{payment.title || 'N/A'}</td>
                                    <td className="py-2 px-4">{payment.size || 'N/A'}</td>
                                    <td className="py-2 px-4">${payment.unitPrice || '0'}</td>
                                    <td className="py-2 px-4">{payment.quantity || '0'}</td>
                                    <td className="py-2 px-4">
                                        <span className={`px-2 py-1 rounded ${
                                            payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {payment.status || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4">
                                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="py-4 text-center text-gray-500">
                                    No Payments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPaymentHistory;