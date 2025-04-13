"use client";
import React from "react";
import bg from "../../../../public/assists/images/sine-150x150.png";

const BookingSection = () => {
  return (
    <div className="relative h-[750px] md:h-[800px] overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <iframe
          className="w-full h-full object-cover max-sm:hidden"
          src="https://www.youtube.com/embed/yEGuPMJpmj8?autoplay=1&mute=1&loop=1&playlist=yEGuPMJpmj8&controls=0&showinfo=0&modestbranding=1"
          title="Background Video"
          allow="autoplay; fullscreen"
        ></iframe>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Foreground Content */}
      <div className="relative z-20 flex items-end justify-center h-full px-4">
        <div className="relative bg-white rounded-xl p-4 sm:p-5 shadow-2xl max-w-3xl w-full text-center border border-gray-200">
          {/* Spinning Circle */}
          <div className="absolute -top-6 sm:-top-8 md:-top-10 -right-6 sm:-right-8 md:-right-10 z-30">
            <div
              style={{
                backgroundImage: `url(${bg.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="animate-spin-slow w-[90px] sm:w-[120px] md:w-[150px] h-[90px] sm:h-[120px] md:h-[150px] p-2 rounded-full "
            ></div>
            <div className="absolute inset-0 flex items-center justify-center -rotate-12">
              <i className="text-white text-[12px] sm:text-[14px] md:text-[20px] font-semibold text-center leading-tight">
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
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  className="border rounded-full px-4 py-3 w-full text-sm sm:text-base"
                />
                <input
                  type="text"
                  placeholder="Phone number"
                  className="border rounded-full px-4 py-3 w-full text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select className="border rounded-full px-4 py-3 w-full text-sm sm:text-base">
                  <option>1 Person</option>
                  <option>2 People</option>
                  <option>3 People</option>
                  <option>4 People</option>
                </select>
                <input
                  type="date"
                  className="border rounded-full px-4 py-3 w-full text-sm sm:text-base"
                />
                <input
                  type="time"
                  className="border rounded-full px-4 py-3 w-full text-sm sm:text-base"
                />
              </div>

              <textarea
                placeholder="Special Requests"
                className="border rounded-xl px-4 py-3 w-full text-sm sm:text-base"
                rows={3}
              ></textarea>

              <button
                type="submit"
                className="bg-[#6B1E1E] text-white px-6 py-3 w-full rounded-full mt-4 hover:bg-[#551818] transition text-sm sm:text-base"
              >
                BOOK A TABLE →
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom background transition */}
      <div className="absolute bottom-0 w-full h-24 bg-[#fbe8d3] z-10" />
    </div>
  );
};

export default BookingSection;
