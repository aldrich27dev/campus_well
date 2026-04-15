import React, { useState } from 'react';
import StudentLayout from '../layouts/StudentLayout';

const Resources = () => {
  const categories = ['All', 'Anxiety', 'Sleep', 'Academic Stress', 'Mindfulness'];
  const [activeCat, setActiveCat] = useState('All');

  const resources = [
    { title: "5-Minute Grounding Technique", type: "Article", cat: "Anxiety", time: "3 min read" },
    { title: "Managing GRC Exam Week", type: "Guide", cat: "Academic Stress", time: "10 min read" },
    { title: "Better Sleep Hygiene for Students", type: "Video", cat: "Sleep", time: "5 min video" },
    { title: "Deep Breathing Exercises", type: "Audio", cat: "Mindfulness", time: "2 min audio" },
  ];

  return (
    <StudentLayout activeTab="resources">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 italic underline decoration-campus-green decoration-4">Wellness Library</h1>
            <p className="text-sm text-slate-500">Credible resources to support your mental journey.</p>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeCat === cat 
                  ? 'bg-campus-blue text-white shadow-lg shadow-campus-blue/20' 
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-campus-green'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.filter(r => activeCat === 'All' || r.cat === activeCat).map((res, i) => (
            <div key={i} className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer">
              <div className="h-32 bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-campus-blue/20 to-campus-green/20 group-hover:scale-110 transition-transform duration-500"></div>
                <span className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-[10px] font-black uppercase text-campus-blue">
                  {res.type}
                </span>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-bold text-campus-green uppercase mb-1">{res.cat}</p>
                <h3 className="font-bold text-slate-800 leading-tight group-hover:text-campus-blue transition-colors">
                  {res.title}
                </h3>
                <p className="text-[10px] text-slate-400 mt-4 flex items-center gap-1">
                  ⏱ {res.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
};

export default Resources;