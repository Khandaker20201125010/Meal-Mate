'use client';
import AdminGuard from "@/src/services/AdminGuard";
import AdminProfile from "../../Componenets/AdminProfile/AdminProfile";
import CustomerProfile from "../../Componenets/CustomerProfile/CustomerProfile";
import { useSession } from "next-auth/react";
import Loading from "@/src/Loading";
const AdminUserProfile = () => {
    const { data: session, status } = useSession();
    const role = session?.user?.role;
    if (status === "loading") {
        return <div><Loading></Loading></div>; 
    }

    return (
        <div>
            {role === "admin" ? (
                <AdminGuard>
                    <AdminProfile />
                </AdminGuard>
            ) : (
                <CustomerProfile />
            )}
        </div>
    );
};

export default AdminUserProfile;