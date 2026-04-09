import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-emerald-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                YPD
              </div>
              <span className="text-xl font-bold">AME Church YPD</span>
            </div>
            <p className="text-emerald-300 mb-4">
              The Young People's Division of the African Methodist Episcopal Church.
              Empowering youth and young adults to grow in faith, leadership, and community.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-emerald-300 hover:text-amber-400 transition">Facebook</a>
              <a href="#" className="text-emerald-300 hover:text-amber-400 transition">Instagram</a>
              <a href="#" className="text-emerald-300 hover:text-amber-400 transition">YouTube</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-amber-400 font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-emerald-300 hover:text-amber-400 transition">Home</Link></li>
              <li><Link to="/about" className="text-emerald-300 hover:text-amber-400 transition">About Us</Link></li>
              <li><Link to="/events" className="text-emerald-300 hover:text-amber-400 transition">Events</Link></li>
              <li><Link to="/blog" className="text-emerald-300 hover:text-amber-400 transition">Blog</Link></li>
              <li><Link to="/charges" className="text-emerald-300 hover:text-amber-400 transition">Church Finder</Link></li>
              <li><Link to="/media" className="text-emerald-300 hover:text-amber-400 transition">Media</Link></li>
              <li><Link to="/contact" className="text-emerald-300 hover:text-amber-400 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-amber-400 font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-emerald-300">
              <li>📧 info@amechurchypd.com</li>
              <li>📞 +27 12 345 6789</li>
              <li>📍 South Africa</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-700 mt-8 pt-8 text-center text-emerald-400">
          <p>© {new Date().getFullYear()} AME Church Young People's Division. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;