import React from 'react';
import { Search, X, ArrowUpDown, Filter } from 'lucide-react';
import { getCategories } from '../data/candlesticks';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  sortBy: 'default' | 'winrate' | 'name' | 'signal';
  onSortChange: (sort: 'default' | 'winrate' | 'name' | 'signal') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
}) => {
  const categories = getCategories();

  return (
    <div className="space-y-2.5 py-1">
      {/* Search Input & Sort Selector */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="pattern-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 100+ patterns (Engulfing, Doji, Hammer, SMC...)"
            className="w-full bg-white border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600/30 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all font-sans shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative shrink-0">
          <select
            id="pattern-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-2 outline-none focus:border-teal-600 appearance-none pr-7 cursor-pointer font-mono shadow-sm"
          >
            <option value="default">SORT: DEFAULT</option>
            <option value="winrate">SORT: WIN RATE</option>
            <option value="signal">SORT: SIGNAL</option>
            <option value="name">SORT: NAME</option>
          </select>
          <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Category Pills (horizontal scroll for mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-xs">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              id={`filter-cat-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold text-xs transition-all shrink-0 select-none uppercase tracking-wide cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20 border border-teal-600'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
