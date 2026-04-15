import React from 'react';
import Navbar from '../components/Navbar';

const StudentLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a]">
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;