'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  text: string;
  item_type: string;
  options?: any;
}

export default function Assessment() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Array<{ item_id: string; response: string | number }>>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Attempt to get student ID from local storage
    const id = localStorage.getItem('student_id') || `stu-${Date.now()}`;
    setStudentId(id);
    localStorage.setItem('student_id', id); // ensure it's saved

    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/assessment/generate?num_per_section=5');
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        setQuestions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);

  const handleResponse = async (answer: string | number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setTimeout(async () => {
      const currentQ = questions[currentIndex];
      const newResponses = [...responses, { item_id: currentQ.id, response: answer }];
      
      setResponses(newResponses);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setIsTransitioning(false);
      } else {
        // Finished all questions, submit
        await submitAssessment(newResponses);
      }
    }, 300); // 300ms transition
  };

  const submitAssessment = async (finalResponses: any) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          responses: finalResponses
        }),
      });

      if (!res.ok) throw new Error('Failed to submit assessment');
      
      router.push(`/dashboard/${studentId}`); 
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-cyan-400 text-xl flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
          <div>INITIALIZING_ORDEAL...</div>
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center flex-col space-y-4 font-mono text-center px-4">
        <p className="text-red-500 text-xl">ERROR_DETECTED: {error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-900/50 text-red-400 border border-red-500 rounded hover:bg-red-800 transition-colors">
          REBOOT_SYSTEM
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
     return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-mono">NO_DATA_FOUND.</div>;
  }

  if (submitting) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center flex-col space-y-4 font-mono">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mb-4 shadow-[0_0_15px_#06b6d4]"></div>
        <p className="text-cyan-400 text-xl animate-pulse">COMPILING_RESULTS...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isLikert = currentQ.item_type.toLowerCase().includes('likert');
  const isSjt = currentQ.item_type.toLowerCase().includes('sjt');
  const isCognitive = currentQ.item_type.toLowerCase().includes('cognitive');

  let parsedOptions: any = null;
  if (currentQ.options) {
      if (typeof currentQ.options === 'string') {
          try {
             parsedOptions = JSON.parse(currentQ.options);
          } catch(e) {
             parsedOptions = null;
          }
      } else {
          parsedOptions = currentQ.options;
      }
  }

  const progressPercentage = ((currentIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-6 sm:py-12 px-4 sm:px-6 font-mono text-slate-300 selection:bg-cyan-500/30">
      
      {/* Progress Bar Header */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex justify-between items-center mb-3 text-xs sm:text-sm text-cyan-500">
          <span className="uppercase tracking-widest font-bold drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">System_Check: {currentIndex + 1}/{questions.length}</span>
          <span className="uppercase tracking-widest border border-cyan-800 bg-cyan-950/30 px-3 py-1 rounded shadow-inner">{currentQ.item_type}</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-3 sm:h-4 border border-slate-800 relative overflow-hidden shadow-inner">
          <div 
            className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4,inset_0_0_5px_#fff] transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className={`w-full max-w-3xl flex-1 flex flex-col transition-all duration-300 transform ${isTransitioning ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
        
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-10 md:p-12 rounded-2xl shadow-2xl shadow-black/50 relative overflow-hidden flex-1 flex flex-col">
          {/* Decorative scanner line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          
          <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-white mb-10 leading-relaxed font-sans">
            <span className="text-cyan-500 font-mono mr-3 text-2xl font-bold">{'>'}</span>
            {currentQ.text}
          </h3>

          {error && <p className="text-red-400 mb-6 bg-red-950/30 p-4 rounded border border-red-900 shadow-inner">{error}</p>}

          <div className="space-y-6 w-full mt-auto">
            {isLikert && (
              <div className="flex flex-col space-y-6">
                <div className="flex justify-between items-end px-2 sm:px-4 text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-bold">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
                <div className="flex justify-between gap-2 sm:gap-4">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleResponse(score)}
                      className="flex-1 py-8 sm:py-10 bg-slate-950 border border-slate-700 hover:border-cyan-400 hover:bg-cyan-950/40 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] rounded-xl text-2xl sm:text-3xl font-black transition-all transform active:scale-95 text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(isSjt || isCognitive) && parsedOptions && Array.isArray(parsedOptions) && (
              <div className="flex flex-col space-y-4">
                 {parsedOptions.map((opt: any, idx: number) => {
                    const val = opt.value || opt.id || String.fromCharCode(65 + idx);
                    const label = opt.label || opt.text || opt;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleResponse(val)}
                        className="w-full text-left p-6 sm:p-8 rounded-xl border border-slate-700 bg-slate-950 hover:bg-cyan-950/20 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all transform active:scale-[0.98] text-slate-300 hover:text-cyan-50 group flex items-start focus:outline-none focus:border-cyan-500"
                      >
                         <span className="font-mono font-bold text-cyan-600 group-hover:text-cyan-400 mr-5 text-xl sm:text-2xl mt-[-2px]">[{val}]</span> 
                         <span className="text-base sm:text-lg md:text-xl font-sans leading-relaxed">{label}</span>
                      </button>
                    );
                 })}
              </div>
            )}

            {(isSjt || isCognitive) && (!parsedOptions || !Array.isArray(parsedOptions)) && (
              <div className="flex flex-col space-y-4">
                {['A', 'B', 'C', 'D'].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleResponse(val)}
                    className="w-full p-6 sm:p-8 rounded-xl border border-slate-700 bg-slate-950 hover:bg-cyan-950/20 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all transform active:scale-[0.98] text-center font-bold text-slate-400 hover:text-cyan-400 text-xl focus:outline-none focus:border-cyan-500"
                  >
                    Select Option {val}
                  </button>
                ))}
              </div>
            )}
            
            {!isLikert && !isSjt && !isCognitive && (
               <div className="flex flex-col space-y-4">
                  <input 
                    type="text" 
                    placeholder="ENTER_RESPONSE_"
                    className="w-full p-6 bg-slate-950 border border-slate-700 rounded-xl text-cyan-400 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] text-lg sm:text-xl transition-all font-mono"
                    onKeyDown={(e) => {
                       if (e.key === 'Enter' && e.currentTarget.value) {
                           handleResponse(e.currentTarget.value);
                       }
                    }}
                  />
                  <p className="text-sm text-slate-500 flex items-center mt-2">
                    <kbd className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded mr-3 text-xs font-bold text-slate-300 shadow-inner">ENTER</kbd> 
                    to submit response
                  </p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
