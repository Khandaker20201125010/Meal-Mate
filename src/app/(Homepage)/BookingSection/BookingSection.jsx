"use client";
import React, { useEffect, useState } from "react";
import bg from "../../../../public/assists/images/sine-150x150.png";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const BookingSection = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "1 Person",
    date: "",
    time: "",
    specialRequests: ""
  });
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setShowVideo(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const checkAuth = async () => {
    if (!session) {
      const result = await Swal.fire({
        title: 'Sign In Required',
        text: 'You need to be signed in to make a reservation. Would you like to sign up now?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Sign Up',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        router.push('/signup');
      }
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;
  
    try {
      setLoading(true);
      
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userEmail: session.user.email,
          userName: session.user.name
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to make reservation');
      }
  
      // Success SweetAlert
      await Swal.fire({
        title: 'Success!',
        text: 'Your reservation has been booked successfully!',
        icon: 'success',
        confirmButtonText: 'Great!',
        timer: 3000,
        timerProgressBar: true,
      });
  
      // Reset form
      setFormData({
        name: "",
        phone: "",
        guests: "1 Person",
        date: "",
        time: "",
        specialRequests: ""
      });
  
    } catch (error) {
      console.error('Booking error:', error);
      
      // Error SweetAlert
      await Swal.fire({
        title: 'Error!',
        text: error.message || 'Something went wrong with your reservation',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-[750px] md:h-[800px] overflow-hidden">
      {/* Background Video */}
      {showVideo && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/videos/Cooking.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Foreground Content */}
      <div className="relative z-20 flex items-end justify-center h-full px-4 py-16">
        <div className="relative bg-white rounded-xl p-4 sm:p-5 shadow-2xl max-w-3xl w-full text-center border border-gray-200">
          {/* Spinning Circle */}
          <div className="absolute -top-6 sm:-top-8 md:-top-10 -right-6 sm:-right-8 md:-right-10 z-30">
            <div
              style={{ backgroundImage: `url(${bg.src})` }}
              className="animate-spin-slow w-[90px] sm:w-[120px] md:w-[150px] h-[90px] sm:h-[120px] md:h-[150px] rounded-full"
            ></div>
            <div className="absolute inset-0 flex items-center justify-center -rotate-12">
              <i className="text-white text-[12px] sm:text-[14px] md:text-[20px] font-semibold">
                <span className="block">Book</span>
                <span className="block">Now!</span>
              </i>
            </div>
          </div>

          {/* Header */}
          <div className="border px-4 py-6 sm:px-6 sm:py-8 md:p-10 rounded-xl">
            <h4 className="text-sm text-[#9c4f2c] italic font-medium mb-2">
              Contact and bookings
            </h4>
            <h2 className="text-xl sm:text-2xl md:text-3xl mb-6 font-semibold">
              BOOK YOUR TABLE AT MEALMATE
            </h2>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border rounded-full px-4 py-3 w-full text-sm sm:text-base"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="border rounded-full px-4 py-3 w-full text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="border rounded-full px-4 py-3 w-full text-sm sm:text-base"
                >
                  <option>1 Person</option>
                  <option>2 People</option>
                  <option>3 People</option>
                  <option>4 People</option>
                </select>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="border rounded-full px-4 py-3 w-full text-sm sm:text-base"
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="border rounded-full px-4 py-3 w-full text-sm sm:text-base"
                />
              </div>

              <textarea
                name="specialRequests"
                placeholder="Special Requests"
                value={formData.specialRequests}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 w-full text-sm sm:text-base"
                rows={3}
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#6B1E1E] text-white px-6 py-3 w-full rounded-full mt-4 hover:bg-[#551818] transition text-sm sm:text-base disabled:opacity-70"
              >
                {loading ? 'Processing...' : 'BOOK A TABLE →'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom background transition */}
      <div className="absolute -bottom-10 w-full h-64 bg-[#faebdd] z-0" />
    </div>  
  );
};

export default BookingSection;