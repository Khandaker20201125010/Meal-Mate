'use client';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Image from 'next/image';
import mb2 from '../../../../public/assists/images/mb2.png';
const ContactBody = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire('Success!', 'Your message has been sent.', 'success');
      setForm({ name: '', email: '', message: '' });
    } else {
      Swal.fire('Error!', data.error || 'Something went wrong.', 'error');
    }
  };

  return (
    <div>
      <div className='text-center'>
        <p className='text-orange-500 uppercase tracking-widest mb-2'>Contact Us</p>
        <h1 className='text-4xl font-serif mb-10'>Get In Touch For Booking</h1>
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-6">
        <div className="relative w-full max-w-md">
          {/* Top‑Left Decorative Image */}
          <div className="absolute -top-24 -left-24 z-0 hidden md:block opacity-30">
            <Image
              src={mb2}
              alt="Decor Top Left"
              width={200}
              height={80}
              className="h-auto w-auto"
              priority
            />
          </div>

          {/* Bottom‑Right Decorative Image */}
          <div className="absolute -bottom-24 -right-24 z-0 hidden md:block opacity-30">
            <Image
              src={mb2}
              alt="Decor Bottom Right"
              width={200}
              height={80}
              className="h-auto w-auto"
              priority
            />
          </div>


          {/* === Contact Form Card === */}
          <div className="relative z-10 card w-full bg-gradient-to-br from-pink-100 via-orange-100 to-pink-100 shadow-2xl rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">Contact Us</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Your Name</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="input input-bordered input-primary w-full"
                />
              </div>

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Your Email</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  className="input input-bordered input-primary w-full"
                />
              </div>

              {/* Message Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Your Message</span>
                </label>
                <textarea
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  required
                  className="textarea textarea-bordered textarea-primary w-full h-32 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="form-control mt-4">
                <button
                  type="submit"
                  className="btn rounded-full bg-gradient-to-r from-pink-600 to-orange-600 text-white w-full text-lg font-semibold"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ContactBody;
