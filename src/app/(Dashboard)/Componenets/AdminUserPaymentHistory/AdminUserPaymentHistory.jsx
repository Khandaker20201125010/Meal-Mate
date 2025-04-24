'use client'; // ✅ Correct usage

import { useSession } from 'next-auth/react';
import AdminPaymentHistory from '../PaymentHistory/AdminPaymentHistory';
import CustomernPaymentHistory from '../PaymentHistory/CustomernPaymentHistory';
import AdminGuard from '@/src/services/AdminGuard';

const AdminUserPaymentHistory = () => {
    const { data: session, status } = useSession();
    const role = session?.user?.role;

    return (
        <div>
            {role === "admin" ? (
                <AdminGuard>
                    <AdminPaymentHistory />
                </AdminGuard>
            ) : (
                <CustomernPaymentHistory />
            )}
        </div>
    );
};

export default AdminUserPaymentHistory;
