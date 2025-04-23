import React from 'react';
import ManagerUsersList from '../../../Componenets/ManageUserForm/ManagerUsersList';
import AdminGuard from '@/src/services/AdminGuard';

const page = () => {
    return (
        <div>
         <AdminGuard> <ManagerUsersList></ManagerUsersList></AdminGuard>
        </div>
    );
};

export default page;