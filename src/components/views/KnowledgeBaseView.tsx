import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { KnowledgeArticle, SupportCategory, SupportedLanguage } from '../../types';
import {
  Search,
  BookOpen,
  ArrowRight,
  ExternalLink,
  PhoneCall,
  X,
  ThumbsUp,
  GraduationCap,
  Sparkles,
  FileCheck,
  Shield,
  Award
} from 'lucide-react';
import { BSAIButton } from '../common/BSAIButton';

interface KnowledgeBaseViewProps {
  currentLanguage: SupportedLanguage;
  onAskAIAboutArticle: (topic: string, category: SupportCategory) => void;
}

const CATEGORIES = ['All', 'Government Services', 'Education', 'Health', 'Other'];

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  currentLanguage,
  onAskAIAboutArticle,
}) => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.getKnowledgeArticles({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined,
        });
        setArticles(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, [selectedCategory, searchQuery]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Government Services':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '🏛️' };
      case 'Education':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '🎓' };
      case 'Health':
        return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: '🏥' };
      default:
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: '📜' };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl pb-8">
      {/* Header & Search Bar with Study Intelligence Banner */}
      <div className="space-y-4">
        <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-display text-bsai-indigo">
                Citizen & Study Knowledge Base
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                <GraduationCap className="w-3.5 h-3.5 text-bsai-teal" />
                Verified Study Hub
              </span>
            </div>
            <p className="text-xs text-bsai-indigoLight mt-0.5">
              Search official procedures, scholarship eligibility, certificate guides, and DigiLocker integrations
            </p>
          </div>
        </div>

        {/* Search Input Bar with multi-hue focus */}
        <div className="relative max-w-2xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 150+ citizen schemes (e.g. NSP Scholarship, PM-Kisan, Ayushman Card, DigiLocker)..."
            className="w-full bg-white/90 backdrop-blur-md border border-bsai-border rounded-2xl pl-10 pr-4 py-3 text-xs text-bsai-indigo placeholder-bsai-indigoMuted focus:outline-none focus:border-bsai-teal focus:ring-2 focus:ring-bsai-teal/20 shadow-xs transition-all"
          />
          <Search className="w-4 h-4 text-bsai-teal absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === c
                  ? 'bg-gradient-to-r from-bsai-teal to-teal-700 text-white shadow-xs'
                  : 'bg-white/80 text-bsai-indigoLight border border-bsai-border hover:bg-bsai-pearl hover:border-bsai-teal/50'
              }`}
            >
              {c === 'Education' && <span>🎓</span>}
              {c === 'Government Services' && <span>🏛️</span>}
              {c === 'Health' && <span>🏥</span>}
              {c === 'All' && <span>✨</span>}
              {c === 'Other' && <span>📜</span>}
              <span>{c}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2x3 Grid of Clean Article Cards with Rich Color Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((art) => {
          const style = getCategoryColor(art.category);
          return (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-bsai-border shadow-2xs hover:shadow-md hover:border-bsai-teal transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className={`w-9 h-9 rounded-xl ${style.bg} ${style.border} border flex items-center justify-center text-base shrink-0 group-hover:scale-110 transition-transform shadow-2xs`}>
                    {style.icon}
                  </span>
                  <h3 className="font-bold text-xs text-bsai-indigo group-hover:text-bsai-teal transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                </div>

                <p className="text-[11px] text-bsai-indigoMuted leading-relaxed line-clamp-2">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-bsai-border/70 flex items-center justify-between text-[10px]">
                <span className={`${style.bg} ${style.text} font-bold px-2.5 py-0.5 rounded-md border ${style.border}`}>
                  {art.category}
                </span>
                <span className="text-bsai-indigoMuted font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-bsai-saffron" />
                  Verified
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bsai-indigoDark/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto border border-bsai-border shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-bsai-pearl hover:bg-bsai-border text-bsai-indigo transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold bg-bsai-tealBg text-bsai-teal px-2.5 py-0.5 rounded-md">
              {selectedArticle.category}
            </span>

            <h2 className="text-xl font-bold font-display text-bsai-indigo">
              {selectedArticle.title}
            </h2>

            <div className="text-xs text-bsai-indigoLight leading-relaxed space-y-2 whitespace-pre-wrap bg-bsai-pearl/30 p-4 rounded-2xl border border-bsai-border/60">
              {selectedArticle.content}
            </div>

            <div className="pt-4 border-t border-bsai-border flex flex-col sm:flex-row justify-between items-center gap-3">
              <BSAIButton
                variant="primary"
                size="md"
                onClick={() => {
                  onAskAIAboutArticle(selectedArticle.title, selectedArticle.category);
                  setSelectedArticle(null);
                }}
                icon={<Sparkles className="w-4 h-4 text-cyan-200" />}
                iconPosition="left"
              >
                Ask BSAI Assistant About This
              </BSAIButton>

              <div className="text-xs text-bsai-indigoMuted flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Helpful count: {selectedArticle.helpfulCount} citizens</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

