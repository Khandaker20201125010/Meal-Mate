'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const CheckReservation = () => {
  const { data: session } = useSession();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reservations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      
      const data = await response.json();
      setReservations(data.reservations);
    } catch (error) {
      console.error('Fetch error:', error);
      Swal.fire('Error!', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const result = await Swal.fire({
        title: 'Confirm Status Change',
        text: `Are you sure you want to change status to ${newStatus}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!'
      });

      if (result.isConfirmed) {
        const response = await fetch(`/api/reservations/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
          throw new Error('Failed to update status');
        }

        await Swal.fire('Updated!', 'Status changed successfully', 'success');
        fetchReservations(); // Refresh the list
      }
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire('Error!', error.message, 'error');
    }
  };

 const handleCancelReservation = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, cancel it!'
            });

            if (result.isConfirmed) {
                const response = await fetch(`/api/reservations/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to cancel');
                }

                await Swal.fire('Cancelled!', 'Reservation cancelled', 'success');
                fetchReservations();
            }
        } catch (error) {
            console.error('Cancel error:', error);
            Swal.fire('Error!', error.message, 'error');
        }
    };
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Reservations</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">User Email</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Guests</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Time</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id} className="border-b">
                <td className="py-2 px-4">{reservation.name}</td>
                <td className="py-2 px-4">{reservation.userEmail}</td>
                <td className="py-2 px-4">{reservation.phone}</td>
                <td className="py-2 px-4">{reservation.guests}</td>
                <td className="py-2 px-4">{new Date(reservation.date).toLocaleDateString()}</td>
                <td className="py-2 px-4">{reservation.time}</td>
                <td className="py-2 px-4">
                  <select
                    value={reservation.status}
                    onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[reservation.status] || 'bg-gray-100'}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleCancelReservation(reservation._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-full text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && reservations.length === 0 && (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-500">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckReservation;