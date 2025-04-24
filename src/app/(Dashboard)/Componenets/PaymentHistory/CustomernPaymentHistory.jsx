'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CustomerPaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session } = useSession();

    const fetchPayments = async () => {
        if (!session?.user?.email) return;

        try {
            const response = await axios.get(`/api/payments?email=${session.user.email}`);
            setPayments(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch payment history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [session]);

    if (loading) return <div className="p-4">Loading payment history...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">My Payment History { payments.length}</h2>

            {payments.length === 0 ? (
                <p className="text-gray-500">No payment history found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 text-left">Date</th>
                                <th className="py-2 px-4 text-left">Transaction ID</th>
                                <th className="py-2 px-4 text-left">Amount</th>
                                <th className="py-2 px-4 text-left">Items</th>
                                <th className="py-2 px-4 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment._id} className="border-b">
                                    <td className="py-2 px-4">
                                        {new Date(payment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4">
                                        {payment.transactionId}
                                    </td>
                                    <td className="py-2 px-4">
                                        ${payment.amount?.toFixed(2)}
                                    </td>

                                    <td className="py-2 px-4">
                                        <ul className="list-disc pl-5">
                                            {payment.items?.map((item, index) => (
                                                <li key={index}>
                                                    {item.quantity}x {item.title} (${item.unitPrice})
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="py-2 px-4">
                                        <span className={`px-2 py-1 rounded ${payment.status === 'Paid'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CustomerPaymentHistory;