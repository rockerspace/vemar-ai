import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  X,
  ShieldCheck,
  AlertTriangle,
  Scale,
  ExternalLink,
  Languages,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { useLocalization, SEBI_FINANCIAL_GLOSSARY, SebiTermDefinition } from '../context/LocalizationContext';

export const SebiGlossaryModal: React.FC = () => {
  const { isGlossaryOpen, closeGlossary, language, setLanguage, isHindi } = useLocalization();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', labelEn: 'All Terms', labelHi: 'सभी शब्दावली' },
    { id: 'REGULATORY', labelEn: 'Statutory Regulations', labelHi: 'नियामक विनियम' },
    { id: 'INTERMEDIARY', labelEn: 'Intermediaries (RIA/RA)', labelHi: 'पंजीकृत मध्यस्थ' },
    { id: 'MARKET_INFRA', labelEn: 'Market Infrastructure', labelHi: 'बाजार अवसंरचना' },
    { id: 'FRAUD_FORENSIC', labelEn: 'Synthetic Fraud & Deepfakes', labelHi: 'कृत्रिम धोखाधड़ी व डीपफेक' },
    { id: 'ENFORCEMENT', labelEn: 'Pre-Trade Enforcement', labelHi: 'पूर्व-व्यापार प्रवर्तन' }
  ];

  const filteredTerms = useMemo(() => {
    return SEBI_FINANCIAL_GLOSSARY.filter((item) => {
      const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        item.termEn.toLowerCase().includes(term) ||
        item.termHi.toLowerCase().includes(term) ||
        item.transliteration.toLowerCase().includes(term) ||
        item.statutoryRef.toLowerCase().includes(term) ||
        item.definitionEn.toLowerCase().includes(term) ||
        item.definitionHi.toLowerCase().includes(term);

      return matchCategory && (!searchTerm.trim() || matchSearch);
    });
  }, [searchTerm, selectedCategory]);

  if (!isGlossaryOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{isHindi ? 'सेबी पूंजी बाजार शब्दावली एवं वैधानिक संदर्भ' : 'SEBI Capital Markets Terminology & Glossary'}</span>
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  SEBI ECOSYSTEM
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isHindi
                  ? 'भारतीय प्रतिभूति एवं विनिमय बोर्ड (SEBI) के आधिकारिक नियम, हिन्दी अनुवाद एवं साइबर सुरक्षा चेतावनी।'
                  : 'Official statutory terminology, Hindi/Devanagari translations, and forensic guidance under Indian Securities Regulations.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle inside modal */}
            <button
              type="button"
              onClick={() => setLanguage(isHindi ? 'en' : 'hi')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isHindi ? 'Switch to English' : 'हिन्दी में देखें'}</span>
            </button>

            <button
              type="button"
              onClick={closeGlossary}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                isHindi
                  ? 'शब्द, सेबी अधिनियम, या विवरण खोजें (जैसे: SCORES, PFUTP, RIA, डीमैट, वॉयस क्लोन)...'
                  : 'Search by term, regulation, or keyword (e.g. SCORES, PFUTP, RIA, Demat, Voice Clone)...'
              }
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 text-[11px] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              {isHindi ? 'श्रेणी:' : 'Category:'}
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-800'
                }`}
              >
                {isHindi ? cat.labelHi : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Glossary Terms List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">
                {isHindi ? 'कोई शब्दावली नहीं मिली' : 'No matching SEBI terms found'}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {isHindi ? 'कृपया दूसरा कीवर्ड खोजें।' : 'Try modifying your search or clearing category filters.'}
              </p>
            </div>
          ) : (
            filteredTerms.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-3 hover:border-slate-700 transition-all"
              >
                {/* Term Titles */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-900 pb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span className="text-emerald-400">{item.termHi}</span>
                      <span className="text-slate-500 text-xs hidden sm:inline">|</span>
                      <span className="text-slate-300 text-xs sm:text-sm font-semibold">{item.termEn}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                      Transliteration: {item.transliteration}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Statutory Reference Tag */}
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-900/50 px-3 py-1 rounded-lg w-fit">
                  <Scale className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold">{isHindi ? 'वैधानिक प्रावधान:' : 'Statutory Reference:'}</span>
                  <span>{item.statutoryRef}</span>
                </div>

                {/* Definitions Side-by-side or stacked */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/60">
                    <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1 flex items-center gap-1">
                      <span>🇮🇳</span>
                      <span>हिन्दी परिभाषा (Hindi Definition)</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {item.definitionHi}
                    </p>
                  </div>

                  <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/60">
                    <div className="text-[10px] uppercase font-bold text-cyan-400 mb-1 flex items-center gap-1">
                      <span>🌐</span>
                      <span>English Definition</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.definitionEn}
                    </p>
                  </div>
                </div>

                {/* Fraud Threat Warning */}
                <div className="flex items-start gap-2 bg-amber-950/25 border border-amber-800/40 rounded-lg p-2.5 text-xs text-amber-200/90">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 font-semibold mr-1">
                      {isHindi ? 'धोखाधड़ी चेतावनी:' : 'Fraud Warning Indicator:'}
                    </strong>
                    <span>{isHindi ? item.threatWarningHi : item.threatWarningEn}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {isHindi
                ? 'सेबी मास्टर परिपत्र एवं सूचना प्रौद्योगिकी अधिनियम 2000 के अनुसार मान्य शब्दावली।'
                : 'Verified against SEBI Master Circulars, PFUTP 2003, and Indian IT Act 2000.'}
            </span>
          </div>

          <button
            type="button"
            onClick={closeGlossary}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            {isHindi ? 'बंद करें' : 'Close Glossary'}
          </button>
        </div>
      </div>
    </div>
  );
};
