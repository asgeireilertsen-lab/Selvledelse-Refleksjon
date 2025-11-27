import React, { useState, useEffect } from 'react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { DimensionCard } from './components/DimensionCard';
import { Button } from './components/Button';
import { ProgressBar } from './components/ProgressBar';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { DIMENSIONS } from './constants';
import { GameState, UserAnswer } from './types';
import { initializeGemini, generateDimensionFeedback, generateFinalSummary } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.API_KEY_INPUT);
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<string>('');
  const [finalSummary, setFinalSummary] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Initialize scrolling to top when state changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [gameState, currentDimensionIndex]);

  // Check for API key in URL on mount (for LMS embedding)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlKey = params.get('key') || params.get('apiKey');
    
    if (urlKey) {
      try {
        initializeGemini(urlKey);
        setGameState(GameState.INTRO);
      } catch (e) {
        console.error("Kunne ikke initialisere med URL-nøkkel");
        // Fallback to manual input if URL key fails silently
      }
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    try {
      initializeGemini(key);
      setGameState(GameState.INTRO);
    } catch (e) {
      setError("Kunne ikke starte tjenesten med den angitte nøkkelen.");
    }
  };

  const handleStart = () => {
    setGameState(GameState.DIMENSION_INPUT);
  };

  const handleDimensionSelect = async (value: number) => {
    setGameState(GameState.FEEDBACK_LOADING);
    const dimension = DIMENSIONS[currentDimensionIndex];
    
    // Save answer
    const newAnswer: UserAnswer = { dimensionId: dimension.id, value };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    try {
      const feedback = await generateDimensionFeedback(dimension, value);
      setCurrentFeedback(feedback);
      setGameState(GameState.FEEDBACK_DISPLAY);
    } catch (e) {
      setError("Noe gikk galt med KI-tjenesten. Prøv igjen.");
      setGameState(GameState.DIMENSION_INPUT); // Revert to let user try again
    }
  };

  const handleNext = async () => {
    if (currentDimensionIndex < DIMENSIONS.length - 1) {
      setCurrentDimensionIndex(prev => prev + 1);
      setGameState(GameState.DIMENSION_INPUT);
    } else {
      setGameState(GameState.SUMMARY_LOADING);
      try {
        const summary = await generateFinalSummary(answers);
        setFinalSummary(summary);
        setGameState(GameState.SUMMARY_DISPLAY);
      } catch (e) {
        setError("Kunne ikke generere sluttrapporten.");
      }
    }
  };

  const handleRestart = () => {
    setAnswers([]);
    setCurrentDimensionIndex(0);
    setCurrentFeedback('');
    setFinalSummary('');
    
    // If we have a URL key, go straight to INTRO, otherwise API_KEY_INPUT
    const params = new URLSearchParams(window.location.search);
    const urlKey = params.get('key') || params.get('apiKey');
    setGameState(urlKey ? GameState.INTRO : GameState.API_KEY_INPUT);
  };

  // --- Render Functions ---

  if (gameState === GameState.API_KEY_INPUT) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <ApiKeyInput onSubmit={handleApiKeySubmit} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center text-sm">Ref</span>
            <span className="hidden sm:inline">Menneskesyn & Selvledelse</span>
          </h1>
          {gameState !== GameState.INTRO && gameState !== GameState.SUMMARY_DISPLAY && (
             <div className="text-sm font-medium text-slate-500">
               Del {currentDimensionIndex + 1} av {DIMENSIONS.length}
             </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
            {error}
            <button onClick={() => setError(null)} className="ml-4 underline text-sm">Lukk</button>
          </div>
        )}

        {/* INTRO SCREEN */}
        {gameState === GameState.INTRO && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-100 text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Velkommen til refleksjonsspillet</h2>
            <div className="space-y-4 text-slate-600 text-lg leading-relaxed mb-8">
              <p>
                Dette er et verktøy designet for erfarne ledere. Vi skal utforske fire dimensjoner 
                av ditt menneskesyn – hvordan du ubevisst forstår mennesker.
              </p>
              <p>
                Dette påvirker direkte hvordan du utøver selvledelse i hverdagen.
              </p>
              <p className="bg-blue-50 p-4 rounded-lg text-blue-800 font-medium text-base">
                Husk: Det finnes ingen riktige eller gale svar. Dette er en øvelse i bevisstgjøring, ikke en test.
              </p>
            </div>
            <Button onClick={handleStart} className="w-full sm:w-auto text-lg px-8">
              Start Refleksjon
            </Button>
          </div>
        )}

        {/* GAME LOOP */}
        {(gameState === GameState.DIMENSION_INPUT || gameState === GameState.FEEDBACK_LOADING || gameState === GameState.FEEDBACK_DISPLAY) && (
          <>
            <ProgressBar currentStep={currentDimensionIndex + (gameState === GameState.DIMENSION_INPUT ? 0 : 1)} totalSteps={DIMENSIONS.length} />
            
            {gameState === GameState.DIMENSION_INPUT && (
              <DimensionCard 
                dimension={DIMENSIONS[currentDimensionIndex]} 
                onSelectValue={handleDimensionSelect} 
              />
            )}

            {gameState === GameState.FEEDBACK_LOADING && (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-medium text-slate-600">Analyserer ditt valg...</h3>
                <p className="text-slate-400 mt-2">Din lederprofil oppdateres</p>
              </div>
            )}

            {gameState === GameState.FEEDBACK_DISPLAY && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden max-w-2xl mx-auto animate-fade-in-up">
                <div className="bg-slate-800 text-white p-6">
                  <h3 className="text-xl font-bold">Refleksjon</h3>
                </div>
                <div className="p-8">
                  <MarkdownRenderer content={currentFeedback} />
                  <div className="mt-8 flex justify-end">
                    <Button onClick={handleNext} variant="secondary">
                      {currentDimensionIndex < DIMENSIONS.length - 1 ? 'Neste Dimensjon' : 'Se Oppsummering'} &rarr;
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* SUMMARY LOADING */}
        {gameState === GameState.SUMMARY_LOADING && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-bold text-slate-800">Genererer din profil...</h3>
            <p className="text-slate-500 mt-2 max-w-md">Sammenstiller dine svar på de fire dimensjonene for å gi en helhetlig tilbakemelding.</p>
          </div>
        )}

        {/* SUMMARY DISPLAY */}
        {gameState === GameState.SUMMARY_DISPLAY && (
          <div className="max-w-3xl mx-auto animate-fade-in-up pb-10">
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8 md:p-10 text-center">
                <h2 className="text-3xl font-bold mb-2">Din Menneskesyn-profil</h2>
                <p className="text-slate-300">Oppsummering og veien videre for din selvledelse</p>
              </div>
              
              <div className="p-8 md:p-10">
                <div className="bg-slate-50 p-6 rounded-lg mb-8 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Dine valg</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {answers.map((ans, idx) => {
                       const dim = DIMENSIONS.find(d => d.id === ans.dimensionId);
                       return (
                         <div key={idx} className="flex justify-between items-center bg-white p-3 rounded border border-slate-200">
                           <span className="text-slate-600 text-sm font-medium">{dim?.title}</span>
                           <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">{ans.value}</span>
                         </div>
                       );
                    })}
                  </div>
                </div>

                <div className="mb-10">
                   <MarkdownRenderer content={finalSummary} />
                </div>

                <div className="border-t border-slate-100 pt-8 flex flex-col items-center gap-4">
                  <p className="text-slate-500 text-center text-sm">
                    Takk for at du gjennomførte refleksjonsspillet.
                  </p>
                  <Button onClick={handleRestart} variant="outline">
                    Start på nytt
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;