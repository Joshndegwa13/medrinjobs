import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-block text-2xl sm:text-3xl font-bold hover:opacity-90 transition-opacity"
          >
            <span className="bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
              Medrin Jobs
            </span>
          </Link>
          <p className="mt-4 text-gray-400">
            Find your dream job today
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;