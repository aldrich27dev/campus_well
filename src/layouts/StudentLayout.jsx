import React from 'react';
import Navbar from '../components/Navbar';

const StudentLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <main className="max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 md:px-10">
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;
