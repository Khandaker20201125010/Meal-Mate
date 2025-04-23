import React from 'react';
import ManageMenuList from '../../../Componenets/ManageMenuList/ManageMenuList';
import AdminGuard from '@/src/services/AdminGuard';

const page = () => {
    
    return (
        <div>
           <AdminGuard> <ManageMenuList></ManageMenuList></AdminGuard>
        </div>
    );
};

export default page;