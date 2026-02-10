import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle2, AlertCircle, Lightbulb, ChevronLeft, Loader2, ClipboardCheck, ClipboardList, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ats-resume-analyze.onrender.com/api/resume';

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setError('File size exceeds 2MB limit');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      setError('Please provide both your resume and the job description.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, formData);
      setResult(response.data);
    } catch (err) {
      setError('Analysis failed. Please ensure the backend is running and the file is a valid PDF or DOCX.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setFile(null);
    setJobDescription('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-3 md:p-8">
      {/* Top Banner - Made more compact on mobile */}
      <nav className="max-w-6xl mx-auto mb-6 md:mb-12 flex justify-between items-center bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          
          <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">ATS Resume Checker</span>
        </div>
        <div className="hidden sm:block text-[10px] md:text-xs text-slate-500 font-bold px-3 py-1 bg-slate-100 rounded-full uppercase tracking-wider">
          v2.1 Stable
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8"
            >
              {/* Job Description Input Section - takes more space on wide screens */}
              <div className="lg:col-span-7 professional-card p-4 md:p-6 flex flex-col order-2 lg:order-1">
                <div className="section-header flex items-center gap-2 text-slate-900">
                  <ClipboardList className="w-5 h-5 text-indigo-500" />
                  <h2 className="font-bold text-base md:text-lg">Job Description</h2>
                </div>
                <p className="text-slate-500 text-xs md:text-sm mb-4">Paste the requirements to extract mandatory keywords.</p>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description text here..."
                  className="flex-grow min-h-[250px] md:min-h-[400px] bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-sm leading-relaxed"
                />
              </div>

              {/* Sidebar: Upload & Action - order-1 on mobile to be at top */}
              <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-2">
                <div className="professional-card p-6 md:p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                    <Upload className="text-indigo-600 w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg mb-2">Upload Resume</h3>
                  <p className="text-slate-500 text-xs md:text-sm mb-6 max-w-[240px] mx-auto">Upload PDF or DOCX. Your privacy is protected.</p>
                  
                  <div className="w-full relative group">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className={`p-4 md:p-6 border-2 border-dashed rounded-xl transition-all flex flex-col items-center gap-2 ${file ? 'border-green-400 bg-green-50' : 'border-slate-200 group-hover:border-indigo-400 group-hover:bg-indigo-50/30'}`}>
                      <FileText className={`w-5 h-5 ${file ? 'text-green-500' : 'text-slate-400'}`} />
                      <span className={`text-xs md:text-sm font-bold truncate max-w-full px-2 ${file ? 'text-green-700' : 'text-slate-500'}`}>
                        {file ? file.name : "Tap to select file"}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-bold">{error}</span>
                  </motion.div>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 md:py-5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : "Run Professional Scan"}
                  </button>
                  <div className="flex items-center justify-center gap-2 opacity-50">
                    <span className="h-[1px] w-4 bg-slate-400"></span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Deterministic Engine</p>
                    <span className="h-[1px] w-4 bg-slate-400"></span>
                  </div>
                </div>

                <div className="professional-card p-5 bg-indigo-900 text-white border-none shadow-xl shadow-indigo-100 hidden lg:block">
                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Info className="w-5 h-5 text-indigo-200" />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold mb-1">Hiring Logic</h4>
                         <p className="text-xs text-indigo-100 leading-relaxed opacity-80">We use exact word boundaries to match technical skills, ensuring 0% false positives, similar to major corporate ATS platforms.</p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors font-bold self-start text-sm bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Scanner
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Result Sidebar: Score */}
                <div className="lg:col-span-1 flex flex-col gap-6 order-1">
                  <div className="professional-card p-8 flex flex-col items-center text-center relative overflow-hidden">
                    {/* Background decoration for score */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-50"></div>
                    
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 relative">Final Compatibility</h3>
                    <div className="relative w-36 h-36 flex items-center justify-center mb-2">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="66"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="transparent"
                          className="text-slate-100"
                        />
                        <motion.circle
                          cx="72"
                          cy="72"
                          r="66"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={415}
                          initial={{ strokeDashoffset: 415 }}
                          animate={{ strokeDashoffset: 415 - (415 * result.atsScore) / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={result.atsScore >= 75 ? "text-green-500" : result.atsScore >= 50 ? "text-indigo-500" : "text-rose-500"}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">{result.atsScore}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter -mt-1">Percent</span>
                      </div>
                    </div>
                    <p className={`text-sm font-black mt-6 px-4 py-1.5 rounded-full uppercase tracking-wider ${result.atsScore >= 75 ? "bg-green-50 text-green-700" : result.atsScore >= 50 ? "bg-indigo-50 text-indigo-700" : "bg-rose-50 text-rose-700"}`}>
                       {result.atsScore >= 75 ? "Gold Standard" : result.atsScore >= 50 ? "Good Potential" : "Needs Review"}
                    </p>
                  </div>

                  <div className="professional-card p-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Algorithm Weighting</h4>
                     <div className="space-y-5">
                        {[
                          { label: 'Keyword Match', weight: '50', color: 'bg-indigo-500' },
                          { label: 'Completeness', weight: '25', color: 'bg-blue-400' },
                          { label: 'Formatting', weight: '15', color: 'bg-slate-400' },
                          { label: 'Density', weight: '10', color: 'bg-slate-300' }
                        ].map((item, i) => (
                          <div key={i}>
                            <div className="flex justify-between items-end mb-1.5">
                              <span className="text-xs font-bold text-slate-700">{item.label}</span>
                              <span className="text-[10px] font-black text-slate-400">{item.weight}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.weight}%` }}
                                transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                                className={`h-full ${item.color}`}
                              />
                            </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>

                {/* Main Results Panel */}
                <div className="lg:col-span-3 space-y-6 order-2">
                  {/* Matches Card */}
                  <div className="professional-card p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm md:text-base">Technical Skill Alignment</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Matched in Dictionary</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-500 tabular-nums">
                        {result.matchedKeywords.length} Skills Detected
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {result.matchedKeywords.length > 0 ? (
                        result.matchedKeywords.map((skill, i) => (
                          <motion.span 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            key={i} 
                            className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-bold shadow-sm"
                          >
                            {skill}
                          </motion.span>
                        ))
                      ) : (
                        <div className="w-full py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <p className="text-slate-400 text-sm italic">No direct technical matches found.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Missing Gaps Card */}
                  <div className="professional-card p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm md:text-base">Expansion Gaps</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Missing Technologies</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-orange-50 rounded-full text-orange-700 tabular-nums">
                        {result.missingKeywords.length} Improvements
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {result.missingKeywords.length > 0 ? (
                        result.missingKeywords.map((skill, i) => (
                          <motion.span 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            key={i} 
                            className="px-3 py-1.5 bg-orange-50/50 text-orange-800 border border-orange-100 rounded-lg text-xs font-bold"
                          >
                            + {skill}
                          </motion.span>
                        ))
                      ) : (
                        <div className="w-full py-6 text-center bg-green-50 rounded-xl border border-dashed border-green-200">
                          <p className="text-green-700 text-sm font-bold">Perfect match! No core skills missing.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Combined Advice & Warning Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="professional-card p-5">
                      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Strategic Advice</h4>
                      </div>
                      <div className="space-y-3">
                         {result.suggestions.map((suggestion, i) => (
                            <div key={i} className="flex gap-2 text-xs leading-relaxed text-slate-600">
                               <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                               {suggestion}
                            </div>
                         ))}
                      </div>
                    </div>

                    <div className="professional-card p-5">
                      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Formatting Checks</h4>
                      </div>
                      <div className="space-y-3">
                         {result.warnings.length > 0 ? result.warnings.map((warning, i) => (
                            <div key={i} className="text-xs leading-relaxed text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                               {warning}
                            </div>
                         )) : (
                           <p className="text-xs text-green-600 font-bold py-2">✓ Layout looks ATS-friendly</p>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 md:mt-20 text-center border-t border-slate-200 pt-8 pb-12">
       
        <div className="pt-4 border-t border-slate-100 max-w-xs mx-auto">
          <p className="text-[10px] text-slate-400 uppercase tracking-tighter mb-1"> ATS Scorer • Strictly Technical</p>
          <p className="text-[10px] text-slate-400">© 2026 DEVELOPED BY MD-ABUSAYATH</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
