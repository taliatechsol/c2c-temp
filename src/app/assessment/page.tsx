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
    const currentQ = questions[currentIndex];
    const newResponses = [...responses, { item_id: currentQ.id, response: answer }];
    
    setResponses(newResponses);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finished all questions, submit
      await submitAssessment(newResponses);
    }
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
      
      router.push('/dashboard'); // Or wherever appropriate
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center flex-col space-y-4">
        <p className="text-red-500">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded">Retry</button>
      </div>
    );
  }

  if (questions.length === 0) {
     return <div className="min-h-[80vh] flex items-center justify-center">No questions found.</div>;
  }

  if (submitting) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center flex-col space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-gray-600 dark:text-gray-300">Evaluating your ordeal...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isLikert = currentQ.item_type.toLowerCase().includes('likert');
  const isSjt = currentQ.item_type.toLowerCase().includes('sjt');
  const isCognitive = currentQ.item_type.toLowerCase().includes('cognitive');

  // Helper to parse options if they are provided as a JSON string or object
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

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        
        <div className="mb-8 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span className="uppercase tracking-wider">{currentQ.item_type}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8 dark:bg-gray-700">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentIndex) / questions.length) * 100}%` }}></div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {currentQ.text}
        </h3>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-4">
          {isLikert && (
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => handleResponse(score)}
                  className="flex-1 py-4 px-2 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 rounded-lg text-lg font-medium transition-colors text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {score}
                </button>
              ))}
              <div className="w-full flex justify-between text-xs text-gray-500 mt-2 sm:hidden px-2">
                 <span>Strongly Disagree</span>
                 <span>Strongly Agree</span>
              </div>
            </div>
          )}

          {(isSjt || isCognitive) && parsedOptions && Array.isArray(parsedOptions) && (
            <div className="flex flex-col space-y-3 mt-8">
               {parsedOptions.map((opt: any, idx: number) => {
                  const val = opt.value || opt.id || String.fromCharCode(65 + idx); // A, B, C, D...
                  const label = opt.label || opt.text || opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleResponse(val)}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 hover:border-indigo-300 transition-colors text-gray-800 dark:text-gray-100"
                    >
                       <span className="font-semibold mr-2">{val}.</span> {label}
                    </button>
                  );
               })}
            </div>
          )}

          {/* Fallback for SJT/Cognitive if options not well formed */}
          {(isSjt || isCognitive) && (!parsedOptions || !Array.isArray(parsedOptions)) && (
            <div className="flex flex-col space-y-3 mt-8">
              {['A', 'B', 'C', 'D'].map((val) => (
                <button
                  key={val}
                  onClick={() => handleResponse(val)}
                  className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 hover:border-indigo-300 transition-colors text-center font-bold text-gray-800 dark:text-gray-100"
                >
                  Option {val}
                </button>
              ))}
            </div>
          )}
          
          {/* Fallback if item_type is unrecognized */}
          {!isLikert && !isSjt && !isCognitive && (
             <div className="mt-8 flex flex-col space-y-4">
                <input 
                  type="text" 
                  placeholder="Type your answer..."
                  className="w-full p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onKeyDown={(e) => {
                     if (e.key === 'Enter' && e.currentTarget.value) {
                         handleResponse(e.currentTarget.value);
                     }
                  }}
                />
                <p className="text-sm text-gray-500">Press Enter to submit</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
