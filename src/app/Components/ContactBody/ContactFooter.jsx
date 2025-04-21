import contactFooter from "../../../../public/assists/images/contactimg.jpg";

const ContactFooter = () => {
  return (
    <div className="">
      {/* Background Image with Overlay */}
      <div
        style={{ backgroundImage: `url(${contactFooter.src})` }}
        className="relative bg-cover bg-center h-[500px]"
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>

      {/* Map Full Width */}
      <div className="w-full bg-gradient-to-tr from-orange-50 to-orange-100 rounded-lg">
        <div className="py-8 text-center">
          <h1 className='text-4xl font-serif'>Our Head Office</h1>
          <p className="mt-2 text-gray-500">Visit our Head Office</p>
        </div>
        <iframe
          className="w-full h-[300px] md:h-[400px] lg:h-[450px] border-none"
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d919.094361843567!2d89.5253752695489!3d22.86251123445304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjLCsDUxJzQ1LjAiTiA4OcKwMzEnMzMuNyJF!5e0!3m2!1sen!2sbd!4v1731098432634!5m2!1sen!2sbd"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactFooter;
