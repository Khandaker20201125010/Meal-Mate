'use client';

const Footer = () => {
    return (
        <div>
            <footer className="bg-[#fdf0e5] text-[#2d1e19] text-sm px-8 py-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

                    <div>
                        <h2 className="text-3xl font-serif mb-4">MEAL MATE</h2>
                        <p className="mb-4">Be the first to know about new collections, special events, and what’s going on at our place.</p>
                        <div className="flex space-x-4">
                            <i className="fab fa-facebook-f"></i>
                            <i className="fab fa-x-twitter"></i>
                            <i className="fab fa-instagram"></i>
                            <i className="fab fa-pinterest"></i>
                            <i className="fas fa-video"></i>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">CONTACT US</h3>
                        <p>MEAL MATE Restaurant & Fine Dining,<br />Khulna,Bangladesh</p>
                        <p className="mt-2 text-[#9e2d1d] font-semibold">+1890 123 456<br />+1891 345 888</p>
                        <p className="text-sm mt-1">reservations@example.com</p>
                    </div>


                    <div>
                        <h3 className="font-semibold mb-2">USEFULL LINKS</h3>
                        <ul className="space-y-1">
                            <li><a href="#">Favorite place</a></li>
                            <li><a href="#">Our history</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Places to get lost</a></li>
                            <li><a href="#">Our brand</a></li>
                        </ul>
                    </div>


                    <div>
                        <h3 className="font-semibold mb-2">OUR NEWSLETTER</h3>
                        <p>See our privacy policy for more details.</p>
                        <form className="mt-4">

                            <input type="email" placeholder="Enter your email..." className="w-full p-2 rounded-full border border-gray-300 mb-2" />
                            <button type="submit" className="bg-[#7b2d1d] text-white px-5 py-2 rounded-full hover:bg-[#5e2115] transition">
                                SUBSCRIBE →
                            </button>
                        </form>
                    </div>
                </div>
                <div className="border-t mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
                    <p>Copyright © {new Date().getFullYear()} <span className="text-black font-semibold">MEAL MATE</span>. All Rights Reserved.</p>
                    <div className="flex gap-4 mt-2 md:mt-0">
                        <a href="#">Privacy & Cookie Policy</a>
                        <span>|</span>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Footer;