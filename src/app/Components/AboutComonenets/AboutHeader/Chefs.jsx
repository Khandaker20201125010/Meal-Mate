import React from 'react';
import Image from 'next/image';
import chef1Img from '../../../../../public/assists/images/chef1.jpg';
import chef2Img from '../../../../../public/assists/images/chef2.jpg';
import chef3Img from '../../../../../public/assists/images/chef3.jpg';
import chef4Img from '../../../../../public/assists/images/chef4.jpg';
import chef5Img from '../../../../../public/assists/images/chef5.jpg';
import chef6Img from '../../../../../public/assists/images/chef6.jpg';

const chefs = [
  {
    name: 'Chef Damien Ortal',
    title: 'Boulangerie Chef Instructor',
    img: chef1Img,
  },
  {
    name: 'Chef Frédéric Oger',
    title: 'Pastry Chef Instructor',
    img: chef2Img,
  },
  {
    name: 'Chef Thierry Lerallu',
    title: 'Head Baker & Pastry Chef Instructor',
    img: chef3Img,
  },
  {
    name: 'Chef Julien Bartement',
    title: 'Cuisine Chef Instructor',
    img: chef4Img,
  },
  {
    name: 'Chef Sylvain Dubreau',
    title: 'Cuisine Chef Instructor',
    img: chef5Img,
  },
  {
    name: 'Chef Stéphane Frelon',
    title: 'Technical Director',
    img: chef6Img,
  },
];

const Chefs = () => {
  return (
    <section className="py-12 ">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8 text-start">
          Meet Our Chefs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {chefs.map((chef, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative group"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={chef.img}
                  alt={chef.name}
                  fill
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {chef.name}
                </h3>
                <p className="text-gray-600">{chef.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Chefs;
