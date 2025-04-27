import React from 'react';
import CheckReservation from '../../../Componenets/CheckReservation/CheckReservation';
import AdminGuard from '@/src/services/AdminGuard';

const page = () => {
    return (
        <div>
           <AdminGuard> <CheckReservation></CheckReservation></AdminGuard>
        </div>
    );
};

export default page;