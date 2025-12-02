import React from 'react';
import { Dimension } from '../types';

interface DimensionCardProps {
  dimension: Dimension;
  onSelectValue: (value: number) => void;
}

export const DimensionCard: React.FC<DimensionCardProps> = ({ dimension, onSelectValue }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden max-w-3xl w-full mx-auto animate-fade-in-up">
      <div className="bg-[#F0F1F5] p-6 border-b border-slate-100">
        <h2 className="text-xl md:text-2xl font-bold text-[#00205B] text-center">
          {dimension.title}
        </h2>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 text-slate-700">
          <div className="flex-1 p-4 bg-[#F0F1F5] rounded-lg border border-slate-200 w-full md:w-auto">
            <h3 className="font-bold text-[#00205B] mb-1 text-lg">{dimension.leftLabel}</h3>
            <p className="text-sm leading-relaxed">{dimension.leftDescription}</p>
          </div>
          
          <div className="hidden md:block text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline><polyline points="12 19 5 12 12 5"></polyline></svg>
          </div>

          <div className="flex-1 p-4 bg-[#F0F1F5] rounded-lg border border-slate-200 w-full md:w-auto text-right md:text-left">
            <h3 className="font-bold text-[#00205B] mb-1 text-lg">{dimension.rightLabel}</h3>
            <p className="text-sm leading-relaxed">{dimension.rightDescription}</p>
          </div>
        </div>

        <div className="mb-6">
            <p className="text-center text-slate-500 mb-4 font-medium">Hvor plasserer du deg selv?</p>
            <div className="grid grid-cols-5 gap-2 sm:gap-4 max-w-xl mx-auto">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        onClick={() => onSelectValue(num)}
                        className="aspect-square rounded-lg border-2 border-slate-200 hover:border-[#00205B] hover:bg-[#F0F1F5] text-slate-600 hover:text-[#00205B] font-bold text-lg sm:text-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00205B] flex items-center justify-center shadow-sm"
                        aria-label={`Velg verdi ${num}`}
                    >
                        {num}
                    </button>
                ))}
            </div>
            <div className="flex justify-between max-w-xl mx-auto mt-2 text-xs text-slate-400 px-1">
                <span>{dimension.leftLabel}</span>
                <span>{dimension.rightLabel}</span>
            </div>
        </div>
      </div>
    </div>
  );
};