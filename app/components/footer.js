import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">triphla</h2>
          <p className="mt-2 text-sm text-gray-400">
            Your AI-powered mental health companion. Confidential, secure, and always available.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/chat" className="hover:text-white">Chat</a></li>
            <li><a href="/about" className="hover:text-white">About</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact / Info */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Contact</h3>
          <p className="text-sm text-gray-400">Email: sibajit_ug_23@ece.nits.ac.in</p>
          <p className="text-sm text-gray-400">Phone: 910123XXXX</p>
          <div className="flex space-x-4 mt-4">
            {/* Replace with your icons or use lucide-react */}
            <a href="#" className="hover:text-white">🌐</a>
            <a href="#" className="hover:text-white">🐦</a>
            <a href="#" className="hover:text-white">📘</a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} triphla. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
