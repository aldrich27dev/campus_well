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

const MotionDiv = motion.div;
const MotionButton = motion.button;

const Assessment = () => {
  const { addNotification, user, profile } = useSystem();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [answers, setAnswers] = useState({});

  const questions = [
    { id: 'q1', text: 'How often have you felt unable to control the important things in your life?', category: 'Control' },
    { id: 'q2', text: 'How often have you felt confident about your ability to handle your personal problems?', category: 'Confidence' },
    { id: 'q3', text: 'How often have you felt that things were going your way?', category: 'Outlook' },
    { id: 'q4', text: 'How often have you felt difficulties were piling up so high that you could not overcome them?', category: 'Stress' },
    { id: 'q5', text: 'How often have you been upset because of something that happened unexpectedly?', category: 'Emotional' },
    { id: 'q6', text: 'How often have you felt that you were on top of things?', category: 'Capability' },
  ];

  const options = [
    { label: 'Never', value: 0 },
    { label: 'Rarely', value: 1 },
    { label: 'Sometimes', value: 2 },
    { label: 'Fairly Often', value: 3 },
    { label: 'Very Often', value: 4 },
  ];

  const handleAnswer = (value) => {
    const updatedAnswers = { ...answers, [questions[currentStep].id]: value };
    setAnswers(updatedAnswers);

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const handleSubmit = () => {
    setIsAnalyzing(true);
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

    setTimeout(() => {
      if (totalScore >= 12) {
        addNotification(
          { name: user?.name || 'Aldrich Naag', yearLevel: profile?.yearLevel || '2nd Year' },
          'High Stress Alert Detected',
          {
            risk: 'High',
            type: 'assessment',
            category: 'assessment',
            roles: ['student'],
            message: 'A support check-in has been shared with the counseling team after your recent assessment.',
          }
        );

        addNotification(
          { name: user?.name || 'Aldrich Naag', yearLevel: profile?.yearLevel || '2nd Year' },
          'High Stress Alert Detected',
          {
            risk: 'High',
            type: 'assessment',
            category: 'assessment',
            roles: ['counselor', 'admin'],
            message: `${user?.name || 'Aldrich Naag'} - ${profile?.yearLevel || '2nd Year'} triggered a high-risk wellness alert.`,
          }
        );
      }
      setIsAnalyzing(false);
      setIsFinished(true);
    }, 1500);
  };

  return (
    <main className="flex items-center justify-center py-4 md:py-8 px-4 min-h-[85vh]">
      <div className="max-w-3xl w-full">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <MotionDiv
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface dark:bg-surface-elevated rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl border border-border"
            >
              <div className="mb-6 text-center">
                <div className="inline-flex p-2.5 rounded-xl bg-campus-blue/10 text-campus-blue dark:text-campus-green mb-3">
                  <ClipboardCheck size={20} />
                </div>
                <h2 className="text-lg md:text-xl font-black text-foreground uppercase tracking-tighter italic">
                  Wellness Assessment
                </h2>
                <div className="mt-4 flex items-center gap-1.5">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                        i <= currentStep ? 'bg-campus-blue dark:bg-campus-green' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <MotionDiv
                key={currentStep}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="min-h-[320px] md:min-h-[220px]"
              >
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[9px] font-black uppercase text-campus-green tracking-[0.2em]">
                    {questions[currentStep].category} // Question {currentStep + 1}
                  </span>
                  <span className="text-[9px] font-bold text-muted-foreground">
                    {currentStep + 1} / {questions.length}
                  </span>
                </div>

                <h3 className="text-base md:text-lg font-bold text-foreground mb-6 leading-tight">
                  {questions[currentStep].text}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      className={`group flex items-center justify-between p-3.5 md:p-4 rounded-xl border-2 transition-all text-left ${
                        answers[questions[currentStep].id] === opt.value
                          ? 'border-campus-blue bg-campus-blue/5'
                          : 'border-border hover:border-campus-blue'
                      }`}
                    >
                      <span className={`font-bold text-xs md:text-sm ${
                        answers[questions[currentStep].id] === opt.value ? 'text-campus-blue dark:text-campus-green' : 'text-muted-foreground'
                      }`}>
                        {opt.label}
                      </span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        answers[questions[currentStep].id] === opt.value ? 'border-campus-blue bg-campus-blue' : 'border-border'
                      }`}>
                        {answers[questions[currentStep].id] === opt.value && <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </MotionDiv>

              <div className="mt-6 flex justify-between items-center border-t border-border pt-5">
                <button
                  disabled={currentStep === 0 || isAnalyzing}
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex items-center gap-2 text-muted-foreground font-bold text-[10px] hover:text-foreground disabled:opacity-0"
                >
                  <ChevronLeft size={14} /> Back
                </button>

                {currentStep === questions.length - 1 && answers[questions[currentStep].id] !== undefined && (
                  <MotionButton
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={handleSubmit}
                    disabled={isAnalyzing}
                    className="bg-campus-blue text-primary-foreground px-6 md:px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-soft hover:scale-105 transition-all flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <> <Loader2 size={14} className="animate-spin" /> Processing... </>
                    ) : (
                      'Finalize Assessment'
                    )}
                  </MotionButton>
                )}
              </div>
            </MotionDiv>
          ) : (
            <MotionDiv
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface dark:bg-surface-elevated rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl border border-border"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-campus-green/15 text-campus-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter italic">Data Recorded</h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                Response stored in <span className="font-bold text-campus-blue dark:text-campus-green">D2: WellnessDB</span>.
              </p>

              <div className="mt-8 p-4 bg-campus-blue/5 dark:bg-campus-blue/10 rounded-2xl flex items-start gap-3 text-left border border-campus-blue/10">
                <Info className="text-campus-blue dark:text-campus-green shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] text-campus-blue dark:text-campus-green font-bold uppercase tracking-tight">
                  Security Note: Your data is encrypted per Process 3.2 protocols.
                </p>
              </div>

              <button
                onClick={() => navigate('/student/dashboard')}
                className="mt-8 w-full py-4 bg-campus-blue text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-[10px]"
              >
                Return to Portal
              </button>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Assessment;
