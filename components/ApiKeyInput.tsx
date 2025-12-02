import React, { useState } from 'react';
import { Button } from './Button';

interface ApiKeyInputProps {
  onSubmit: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-slate-100">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-[#00205B] mb-2">Velkommen</h2>
          <p className="text-slate-600">
            For å starte refleksjonsspillet trenger vi en Google Gemini API-nøkkel.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 mb-1">
              API-nøkkel
            </label>
            <input
              type="password"
              id="apiKey"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00205B] focus:border-[#00205B] outline-none transition-colors"
              placeholder="Lim inn nøkkel her..."
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={!key}>
            Start spillet
          </Button>
        </form>
        <p className="mt-4 text-xs text-center text-slate-400">
          Nøkkelen lagres kun i nettleserens minne for denne sesjonen.
        </p>
      </div>
    </div>
  );
};