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
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      {/* Top Banner */}
      <nav className="max-w-6xl mx-auto mb-12 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="text-indigo-600 w-8 h-8" />
          <span className="text-xl font-bold text-slate-900tracking-tight">ATS Resume Checker</span>
        </div>
        <div className="text-xs text-slate-500 font-medium px-3 py-1 bg-slate-100 rounded-full">
          Professional Tool 2.0
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Job Description Input Section */}
              <div className="professional-card p-6 flex flex-col">
                <div className="section-header flex items-center gap-2 text-slate-900">
                  <ClipboardList className="w-5 h-5 text-indigo-500" />
                  <h2 className="font-semibold text-lg">Job Description</h2>
                </div>
                <p className="text-slate-500 text-sm mb-4">Paste the requirement details here to extract keywords for comparison.</p>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste JD text here..."
                  className="flex-grow min-h-[350px] bg-slate-50 border border-slate-200 rounded-lg p-4 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-sm leading-relaxed"
                />
              </div>

              {/* Resume Upload & Actions Section */}
              <div className="flex flex-col gap-6">
                <div className="professional-card p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                    <Upload className="text-indigo-600 w-7 h-7" />
                  </div>
                  <h3 className="text-slate-900 font-semibold text-lg mb-2">Upload Resume</h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Upload your resume in PDF or DOCX format. Analysis is deterministic and strictly skill-based.</p>
                  
                  <div className="w-full relative group">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className={`p-4 border-2 border-dashed rounded-lg transition-all ${file ? 'border-green-300 bg-green-50' : 'border-slate-200 group-hover:border-indigo-300'}`}>
                      <span className="text-sm font-medium text-slate-600">
                        {file ? file.name : "Drag and drop or click to select"}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-black text-white p-4 rounded-lg font-bold shadow-md transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2"
                  >
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing Analysis...</> : "Start ATS Analysis"}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">Deterministic Score • No Fake AI • Skill Based</p>
                </div>

                <div className="professional-card p-5 bg-indigo-50/30 border-indigo-100">
                   <div className="flex gap-3">
                      <Info className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                      <div>
                         <h4 className="text-sm font-bold text-indigo-900 mb-1">How it works</h4>
                         <p className="text-xs text-indigo-800 leading-relaxed">Our engine uses exact token matching against the Job Description. It checks for industry keywords, section completeness, and formatting standards favored by major ATS platforms.</p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium self-start mb-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Analyze another resume
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Result Sidebar: Score */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  <div className="professional-card p-8 flex flex-col items-center text-center">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">ATS Compatibility</h3>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="60"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-slate-100"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="60"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={377}
                          initial={{ strokeDashoffset: 377 }}
                          animate={{ strokeDashoffset: 377 - (377 * result.atsScore) / 100 }}
                          transition={{ duration: 1 }}
                          className={result.atsScore >= 70 ? "text-green-500" : result.atsScore >= 50 ? "text-amber-500" : "text-red-500"}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-3xl font-black text-slate-900">{result.atsScore}%</span>
                    </div>
                    <p className="text-sm font-bold mt-6 text-slate-700">
                       {result.atsScore >= 75 ? "Excellent Alignment" : result.atsScore >= 50 ? "Moderately Compatible" : "Low Alignment"}
                    </p>
                  </div>

                  <div className="professional-card p-5">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Score Breakdown</h4>
                     <ul className="space-y-4">
                        <li className="flex justify-between items-center text-sm">
                           <span className="text-slate-600">Keyword Match</span>
                           <span className="font-bold">50% Wt.</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                           <span className="text-slate-600">Completeness</span>
                           <span className="font-bold">25% Wt.</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                           <span className="text-slate-600">Formatting</span>
                           <span className="font-bold">15% Wt.</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                           <span className="text-slate-600">Density</span>
                           <span className="font-bold">10% Wt.</span>
                        </li>
                     </ul>
                  </div>
                </div>

                {/* Main Results Panel */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Matches Card */}
                  <div className="professional-card p-6">
                    <div className="section-header flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-bold text-slate-900">Technical Skill Alignment</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedKeywords.length > 0 ? (
                        result.matchedKeywords.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded text-xs font-bold uppercase tracking-tight">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-400 text-sm italic py-2">No direct keyword matches found in current comparison.</p>
                      )}
                    </div>
                  </div>

                  {/* Missing Gaps Card */}
                  <div className="professional-card p-6">
                    <div className="section-header flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <h4 className="font-bold text-slate-900">Identified Gaps</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.length > 0 ? (
                        result.missingKeywords.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded text-xs font-bold uppercase tracking-tight">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-green-600 text-sm font-medium">Great! All critical keywords from JD were found in resume.</p>
                      )}
                    </div>
                  </div>

                  {/* Suggestions & Warnings Card */}
                  <div className="professional-card p-6">
                    <div className="section-header flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded bg-amber-50 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-amber-600" />
                      </div>
                      <h4 className="font-bold text-slate-900">Optimization Suggestions</h4>
                    </div>
                    <div className="space-y-4">
                       {result.warnings.length > 0 && (
                          <div className="space-y-2">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Formatting Warnings</p>
                             {result.warnings.map((warning, i) => (
                                <div key={i} className="flex gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-100 italic">
                                   <span>•</span> {warning}
                                </div>
                             ))}
                          </div>
                       )}
                       {result.suggestions.length > 0 && (
                          <div className="space-y-2">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Strategic Advice</p>
                             {result.suggestions.map((suggestion, i) => (
                                <div key={i} className="flex gap-3 text-sm text-slate-700 font-medium">
                                   <span className="text-indigo-400">→</span> {suggestion}
                                </div>
                             ))}
                          </div>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-6xl mx-auto mt-16 text-center border-t border-slate-200 pt-8 text-slate-400 text-xs">
        <p className="mb-2 uppercase tracking-tighter">Deterministic ATS Scorer • Strictly Technical • Confidential Processing</p>
        <p>© 2024 Professional Recruitment Suite</p>
      </footer>
    </div>
  );
}

export default App;
