import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  ClipboardCheck,   
  CheckCircle2,
  Info,
  Loader2 
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';

const Assessment = () => {
  const { addNotification, user } = useSystem();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); 
  const [answers, setAnswers] = useState({});

  // ADDED: Expanded question set
  const questions = [
    { id: 'q1', text: "How often have you felt unable to control the important things in your life?", category: "Control" },
    { id: 'q2', text: "How often have you felt confident about your ability to handle your personal problems?", category: "Confidence" },
    { id: 'q3', text: "How often have you felt that things were going your way?", category: "Outlook" },
    { id: 'q4', text: "How often have you felt difficulties were piling up so high that you could not overcome them?", category: "Stress" },
    { id: 'q5', text: "How often have you been upset because of something that happened unexpectedly?", category: "Emotional" },
    { id: 'q6', text: "How often have you felt that you were on top of things?", category: "Capability" },
  ];

  const options = [
    { label: "Never", value: 0 },
    { label: "Rarely", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Fairly Often", value: 3 },
    { label: "Very Often", value: 4 },
  ];

  const handleAnswer = (value) => {
    const updatedAnswers = { ...answers, [questions[currentStep].id]: value };
    setAnswers(updatedAnswers);
    
    // Auto-advance logic: only if not the last question
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const handleSubmit = () => {
    setIsAnalyzing(true);
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    
    setTimeout(() => {
      if (totalScore >= 12) { // Adjusted threshold for more questions
        addNotification(user?.name || "Aldrich Naag", "High Stress Alert Detected");
      }
      setIsAnalyzing(false);
      setIsFinished(true);
    }, 1500); 
  };

  return (
    <main className="flex items-center justify-center py-4 md:py-8 px-4 min-h-[85vh]">
      <div className="max-w-3xl w-full"> {/* Increased max-width for better grid layout */}
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-xl border border-slate-100 dark:border-slate-800"
            >
              {/* Progress Header */}
              <div className="mb-6 text-center">
                <div className="inline-flex p-2.5 rounded-xl bg-[#1e3a8a]/10 text-[#1e3a8a] mb-3">
                  <ClipboardCheck size={20} />
                </div>
                <h2 className="text-lg md:text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
                  Wellness Assessment
                </h2>
                <div className="mt-4 flex items-center gap-1.5">
                  {questions.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                        i <= currentStep ? 'bg-[#1e3a8a]' : 'bg-slate-100 dark:bg-slate-800'
                      }`} 
                    />
                  ))}
                </div>
              </div>

              {/* Question Area */}
              <motion.div
                key={currentStep}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="min-h-[320px] md:min-h-[220px]"
              >
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[9px] font-black uppercase text-[#92c37c] tracking-[0.2em]">
                    {questions[currentStep].category} // Question {currentStep + 1}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">
                    {currentStep + 1} / {questions.length}
                  </span>
                </div>
                
                <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 leading-tight">
                  {questions[currentStep].text}
                </h3>

                {/* UPDATED: Responsive Grid to save vertical space */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      className={`group flex items-center justify-between p-3.5 md:p-4 rounded-xl border-2 transition-all text-left ${
                        answers[questions[currentStep].id] === opt.value 
                        ? 'border-[#1e3a8a] bg-[#1e3a8a]/5' 
                        : 'border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className={`font-bold text-xs md:text-sm ${
                        answers[questions[currentStep].id] === opt.value ? 'text-[#1e3a8a]' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {opt.label}
                      </span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                         answers[questions[currentStep].id] === opt.value ? 'border-[#1e3a8a] bg-[#1e3a8a]' : 'border-slate-200 dark:border-slate-700'
                      }`}>
                        {answers[questions[currentStep].id] === opt.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Footer Controls */}
              <div className="mt-6 flex justify-between items-center border-t border-slate-50 dark:border-slate-800 pt-5">
                <button 
                  disabled={currentStep === 0 || isAnalyzing}
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex items-center gap-2 text-slate-400 font-bold text-[10px] hover:text-slate-600 disabled:opacity-0"
                >
                  <ChevronLeft size={14} /> Back
                </button>
                
                {/* Submit button logic */}
                {currentStep === questions.length - 1 && answers[questions[currentStep].id] !== undefined && (
                  <motion.button 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={handleSubmit}
                    disabled={isAnalyzing}
                    className="bg-[#1e3a8a] text-white px-6 md:px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <> <Loader2 size={14} className="animate-spin" /> Processing... </>
                    ) : (
                      'Finalize Assessment'
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            /* Success State remains consistent */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">Data Recorded</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm leading-relaxed">
                Response stored in <span className="font-bold text-[#1e3a8a]">D2: WellnessDB</span>. 
              </p>
              
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-start gap-3 text-left">
                <Info className="text-[#1e3a8a] shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] text-blue-800 dark:text-blue-300 font-bold uppercase tracking-tight">
                  Security Note: Your data is encrypted per Process 3.2 protocols.
                </p>
              </div>

              <button 
                onClick={() => navigate('/student/dashboard')}
                className="mt-8 w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]"
              >
                Return to Portal
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Assessment;