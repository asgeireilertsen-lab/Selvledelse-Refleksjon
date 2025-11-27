import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Very simple parsing for bold text and list items to avoid heavy dependencies
  // for this specific requirement.
  
  const parseLine = (line: string, index: number) => {
    if (line.trim().startsWith('- ')) {
      return (
        <li key={index} className="ml-4 list-disc pl-1 mb-2 text-slate-700 leading-relaxed">
           {formatBold(line.replace('- ', ''))}
        </li>
      );
    }
    if (line.trim() === '') {
      return <div key={index} className="h-4"></div>;
    }
    return (
      <p key={index} className="mb-3 text-slate-700 leading-relaxed">
        {formatBold(line)}
      </p>
    );
  };

  const formatBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="prose prose-slate max-w-none">
      {content.split('\n').map((line, i) => parseLine(line, i))}
    </div>
  );
};