import React from 'react';
import AddMealForm from '../../../Componenets/AddMealForm';
import AdminGuard from '@/src/services/AdminGuard';

const page = () => {
    return (
        <div className='w-full py-1'>
          <AdminGuard> <AddMealForm></AddMealForm></AdminGuard>
        </div>
    );
};

export default page;