import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Globe,
  Scale,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Check,
  ShieldAlert,
  BookOpen,
  Filter,
  FileCheck2,
  AlertTriangle,
  Lightbulb,
  Building2,
  FileText
} from 'lucide-react';

export interface RegulatoryCitation {
  title: string;
  url: string;
  domain?: string;
}

export interface RegulatoryFaq {
  id: string;
  question: string;
  regulator: 'SEBI' | 'SEC' | 'FINRA' | 'SEBI & SEC' | 'SEC & FINRA' | 'GLOBAL';
  jurisdiction: 'IN' | 'US' | 'GLOBAL';
  topic: 'Executive Deepfakes' | 'Voice Vishing' | 'AI Finfluencers' | 'Digital Provenance' | 'Supervisory & CSCRF' | 'Market Manipulation' | string;
  categoryBadge: string;
  statutoryReference: string;
  effectiveDate: string;
  summary: string;
  officialClarification: string;
  keyDirectives: string[];
  investorProtectionAction: string;
  statutoryReferences: string[];
  verifiedCitations: RegulatoryCitation[];
  searchQueries?: string[];
  lastUpdated: string;
  isGroundedSearch?: boolean;
}

interface RegulatoryFaqSectionProps {
  jurisdiction?: 'IN' | 'US' | 'GLOBAL';
  initialSearch?: string;
}

const TOPIC_FILTERS = [
  'All Topics',
  'Executive Deepfakes',
  'Voice Vishing',
  'AI Finfluencers',
  'Supervisory & CSCRF',
  'Digital Provenance'
];

export const RegulatoryFaqSection: React.FC<RegulatoryFaqSectionProps> = ({
  jurisdiction: initialJurisdiction = 'GLOBAL',
  initialSearch = ''
}) => {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<'ALL' | 'IN' | 'US'>(
    initialJurisdiction === 'GLOBAL' ? 'ALL' : initialJurisdiction
  );
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [faqs, setFaqs] = useState<RegulatoryFaq[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<string | null>('faq-sebi-01');
  const [customInquiry, setCustomInquiry] = useState<string>('');
  const [isSearchingGrounded, setIsSearchingGrounded] = useState<boolean>(false);
  const [activeGroundedResult, setActiveGroundedResult] = useState<RegulatoryFaq | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchEngineTelemetry, setSearchEngineTelemetry] = useState<{
    source: string;
    model: string;
    queries: string[];
  }>({
    source: 'GOOGLE_SEARCH_GROUNDED',
    model: 'gemini-3.8-flash',
    queries: ['SEBI deepfake circular', 'SEC Rule 10b-5 synthetic media']
  });

  // Sync when prop updates
  useEffect(() => {
    if (initialJurisdiction === 'IN' || initialJurisdiction === 'US') {
      setSelectedJurisdiction(initialJurisdiction);
    }
  }, [initialJurisdiction]);

  // Load baseline FAQs from backend
  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/regulatory-faq');
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          setFaqs(data.items);
          if (data.items.length > 0 && !expandedId) {
            setExpandedId(data.items[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load regulatory FAQs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Handle custom interactive inquiry with Google Search Grounding
  const handleExecuteGroundedQuery = async (queryText?: string) => {
    const textToQuery = (queryText || customInquiry || searchQuery).trim();
    if (!textToQuery) return;

    setIsSearchingGrounded(true);
    try {
      const res = await fetch('/api/regulatory-faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToQuery,
          topic: selectedTopic !== 'All Topics' ? selectedTopic : undefined,
          jurisdiction: selectedJurisdiction === 'ALL' ? 'GLOBAL' : selectedJurisdiction
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.clarification) {
          const groundedItem: RegulatoryFaq = {
            ...data.clarification,
            isGroundedSearch: true
          };

          setActiveGroundedResult(groundedItem);
          setExpandedId(groundedItem.id);
          setSearchEngineTelemetry({
            source: data.source || 'GOOGLE_SEARCH_GROUNDED',
            model: data.modelUsed || 'gemini-3.8-flash',
            queries: data.searchQueries || [textToQuery]
          });

          // Prepend to faqs list if not already present
          setFaqs((prev) => [groundedItem, ...prev.filter((f) => f.id !== groundedItem.id)]);
        }
      }
    } catch (err) {
      console.error('Failed to execute search-grounded query:', err);
    } finally {
      setIsSearchingGrounded(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      // Jurisdiction filter
      if (selectedJurisdiction !== 'ALL') {
        if (faq.jurisdiction !== selectedJurisdiction && faq.jurisdiction !== 'GLOBAL') {
          return false;
        }
      }

      // Topic filter
      if (selectedTopic !== 'All Topics') {
        const matchesTopic =
          faq.topic.toLowerCase().includes(selectedTopic.toLowerCase()) ||
          faq.categoryBadge.toLowerCase().includes(selectedTopic.toLowerCase());
        if (!matchesTopic) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          faq.question.toLowerCase().includes(q) ||
          faq.summary.toLowerCase().includes(q) ||
          faq.officialClarification.toLowerCase().includes(q) ||
          faq.statutoryReference.toLowerCase().includes(q) ||
          faq.keyDirectives.some((kd) => kd.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [faqs, selectedJurisdiction, selectedTopic, searchQuery]);

  return (
    <div id="regulatory-faq-section" className="space-y-6 pt-4">
      {/* Section Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Google Search Grounded • Real-Time Regulatory Clarifications</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Scale className="w-6 h-6 text-cyan-400 shrink-0" />
              <span>SEBI & SEC Synthetic Media Regulatory FAQ</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore official statutory clarifications, binding circulars, and supervisory directives from the{' '}
              <span className="text-cyan-300 font-medium">Securities and Exchange Board of India (SEBI)</span>, the{' '}
              <span className="text-cyan-300 font-medium">U.S. SEC</span>, and{' '}
              <span className="text-cyan-300 font-medium">FINRA</span> regarding deepfakes, AI voice cloning, finfluencer
              syndicates, and C2PA digital provenance.
            </p>
          </div>

          {/* Telemetry pill */}
          <div className="shrink-0 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2 min-w-[220px]">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                GROUNDING ACTIVE
              </span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                {searchEngineTelemetry.model}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              <span className="text-slate-500 block text-[10px]">VERIFIED DOMAINS</span>
              <span className="font-mono text-cyan-400">sebi.gov.in • sec.gov • finra.org</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" />
              <span>Continuous Google Search Sync</span>
            </div>
          </div>
        </div>

        {/* Live Search & Ask Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteGroundedQuery();
            }}
            className="flex flex-col sm:flex-row items-stretch gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customInquiry}
                onChange={(e) => {
                  setCustomInquiry(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                placeholder="Ask any question on SEBI or SEC synthetic media regulation (e.g. 'Can brokers use AI avatars?')..."
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
              />
              {customInquiry && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomInquiry('');
                    setSearchQuery('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSearchingGrounded || !customInquiry.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-900/30 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            >
              {isSearchingGrounded ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Grounding via Google Search...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Ask Regulatory AI</span>
                </>
              )}
            </button>
          </form>

          {/* Prompt Suggestion Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider">Quick Inquiries:</span>
            {[
              'SEBI deepfake corporate announcements rule',
              'AI finfluencers partnership ban',
              'SEBI CSCRF 15-minute incident reporting SLA',
              'SEC Rule 10b-5 synthetic media prosecution',
              'FINRA Notice 24-11 voice cloning WSP'
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setCustomInquiry(chip);
                  setSearchQuery(chip);
                  handleExecuteGroundedQuery(chip);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-cyan-300 text-[11px] transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
        {/* Jurisdiction Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedJurisdiction('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              selectedJurisdiction === 'ALL'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Regulators
          </button>
          <button
            type="button"
            onClick={() => setSelectedJurisdiction('IN')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedJurisdiction === 'IN'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🇮🇳</span>
            <span>SEBI (India)</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedJurisdiction('US')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedJurisdiction === 'US'
                ? 'bg-blue-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🇺🇸</span>
            <span>SEC & FINRA (US)</span>
          </button>
        </div>

        {/* Topic Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 hidden md:block" />
          {TOPIC_FILTERS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setSelectedTopic(topic)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedTopic === topic
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Active Grounded Alert (if user triggered a custom grounded search) */}
      {activeGroundedResult && (
        <div className="bg-cyan-950/30 border border-cyan-500/40 rounded-xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-300">Google Search Grounding Results Received</span>
              <span className="bg-cyan-900/60 text-cyan-200 px-2 py-0.5 rounded text-[10px] font-mono">
                {searchEngineTelemetry.source}
              </span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Query grounded across official securities regulatory gazettes and circular archives. Retrieved authoritative clarification below.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <h4 className="text-sm font-semibold text-white">Querying Regulatory Knowledge Engine...</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Syncing statutory gazettes, SEBI CSCRF framework, and SEC EDGAR synthetic media guidance.
          </p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-sm font-semibold text-white">No Matching Regulatory Clarifications Found</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query, or click "Ask Regulatory AI" above to run a live Google Search grounded query on the topic.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedTopic('All Topics');
              setSelectedJurisdiction('ALL');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-400 font-medium transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Accordion List of Regulatory FAQs */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white">{filteredFaqs.length}</strong> official regulatory clarifications
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Click card to expand statutory directives</span>
          </div>

          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            const isSEBI = faq.regulator.includes('SEBI');
            const isSEC = faq.regulator.includes('SEC') || faq.regulator.includes('FINRA');

            return (
              <div
                key={faq.id}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-900/95 border-cyan-500/40 shadow-xl shadow-cyan-950/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="p-5 cursor-pointer flex items-start justify-between gap-4 select-none"
                >
                  <div className="space-y-2.5 flex-1">
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Regulator Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase font-mono flex items-center gap-1.5 border ${
                          isSEBI
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : isSEC
                            ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                            : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        }`}
                      >
                        <Building2 className="w-3 h-3" />
                        <span>{faq.regulator}</span>
                      </span>

                      {/* Topic Category */}
                      <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[10px] font-medium border border-slate-700/60">
                        {faq.topic}
                      </span>

                      {/* Category Badge / Circular reference */}
                      <span className="px-2 py-0.5 rounded-md bg-slate-950 text-cyan-400 text-[10px] font-mono border border-slate-800">
                        {faq.categoryBadge}
                      </span>

                      {/* Grounded Badge */}
                      {faq.isGroundedSearch && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Google Search Grounded</span>
                        </span>
                      )}
                    </div>

                    {/* Question Headline */}
                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                      {faq.question}
                    </h4>

                    {/* Summary Snippet */}
                    <p className="text-xs text-slate-300 leading-relaxed">{faq.summary}</p>
                  </div>

                  {/* Expand / Collapse Icon */}
                  <div className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white shrink-0 mt-1 transition-colors">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-5 bg-slate-950/40">
                    {/* Official Clarification & Legal Basis */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                        <FileCheck2 className="w-4 h-4" />
                        <span>Official Regulatory Clarification & Statutory Position</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {faq.officialClarification}
                      </div>
                    </div>

                    {/* Key Directives & Compliance Mandates */}
                    {faq.keyDirectives && faq.keyDirectives.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                          <Scale className="w-4 h-4 text-amber-400" />
                          <span>Key Statutory Directives & Market Mandates</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {faq.keyDirectives.map((directive, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300"
                            >
                              <span className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed">{directive}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Investor Protection Action Box */}
                    {faq.investorProtectionAction && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                            Actionable Investor Protection Guidance
                          </h5>
                          <p className="text-xs text-amber-100/90 leading-relaxed">
                            {faq.investorProtectionAction}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Statutory References Codes */}
                    {faq.statutoryReferences && faq.statutoryReferences.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                          Statutory Enactments & Master Circulars:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {faq.statutoryReferences.map((ref, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                            >
                              {ref}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Verified Official Regulatory Citations */}
                    {faq.verifiedCitations && faq.verifiedCitations.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Verified Regulatory Citations & Official Portals</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Effective: {faq.effectiveDate}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {faq.verifiedCitations.map((citation, idx) => (
                            <a
                              key={idx}
                              href={citation.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-start justify-between gap-2 group"
                            >
                              <div className="space-y-1 min-w-0">
                                <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate block">
                                  {citation.title}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono block truncate">
                                  {citation.domain || new URL(citation.url).hostname}
                                </span>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 transition-colors mt-0.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Bar Footer */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`${faq.question}\n\n${faq.officialClarification}\n\nStatutory Ref: ${faq.statutoryReference}`, faq.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedId === faq.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-medium">Citation Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Regulatory Citation</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleExecuteGroundedQuery(faq.question)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Re-check with Live Search</span>
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono">
                        Master Registry Ref: {faq.statutoryReference}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
