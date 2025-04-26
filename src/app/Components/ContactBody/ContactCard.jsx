'use client';
import React from 'react';
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegClock,
  FaEnvelope,
} from 'react-icons/fa';

const contactDetails = [
  {
    icon: <FaMapMarkerAlt />,
    title: 'Address',
    lines: [
      'Daulatpur, Pabla Street,',
      'Khulna, Bangladesh - 4508',
    ],
  },
  {
    icon: <FaPhoneAlt />,
    title: 'Contact Number',
    lines: ['+88 (0)12 3-456 789', '+88 (0)12 3456 789'],
  },
  {
    icon: <FaRegClock />,
    title: 'Opening Hours',
    lines: [
      'Mon - Thu: 7.30 AM - 10.30 PM',
      'Fri - Sun: 6.30 AM - 11.30 PM',
    ],
  },
  {
    icon: <FaEnvelope />,
    title: 'Email',
    lines: ['prantokih42@gmail.com', 'Contact@Example.Com'],
  },
];

const ContactCard = () => (
  <section data-aos="fade-right" className=" bg-gradient-to-tr from-orange-50 to-orange-100  text-black py-16">
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <p className="text-orange-500 uppercase tracking-widest mb-2">
        Reach Us
      </p>
      <h2 className="text-4xl font-serif mb-10">Our Head Office</h2>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8">
        {contactDetails.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-start ${
              idx !== 0
                ? 'md:pl-8 md:border-l md:border-gray-700'
                : ''
            }`}
          >
            {/* Icon */}
            <div className="flex-shrink-0 bg-orange-300 p-4 rounded-full mr-4 text-pink-800 text-2xl">
              {item.icon}
            </div>

            {/* Text */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {item.title}
              </h3>
              {item.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ContactCard;
