import { GoogleGenAI } from "@google/genai";
import { DIMENSIONS, SYSTEM_PROMPT_CORE } from '../constants';
import { UserAnswer, Dimension } from '../types';

let genAI: GoogleGenAI | null = null;

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenAI({ apiKey });
};

export const generateDimensionFeedback = async (
  dimension: Dimension,
  value: number
): Promise<string> => {
  if (!genAI) throw new Error("API Key not initialized");

  const prompt = `
  Brukeren har vurdert seg selv på dimensjonen: ${dimension.title}.
  Skalaen er 1-5.
  1 = ${dimension.leftLabel} (${dimension.leftDescription})
  5 = ${dimension.rightLabel} (${dimension.rightDescription})
  
  Brukerens svar: ${value}

  Gi en kort tilbakemelding på 3–5 setninger som inneholder:
   - Én mulig styrke ved å ligge der på skalaen i en lederrolle.
   - Én mulig utfordring eller fallgruve for selvledelse.
   - Et refleksjonsspørsmål (f.eks "Hvordan merker du dette i jobbhverdagen din?").
  
   Hold det kort og konsist.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT_CORE,
      }
    });
    return response.text || "Kunne ikke generere tilbakemelding.";
  } catch (error) {
    console.error("Error generating feedback:", error);
    return "Det oppstod en feil ved generering av tilbakemelding. Vennligst prøv igjen.";
  }
};

export const generateFinalSummary = async (answers: UserAnswer[]): Promise<string> => {
  if (!genAI) throw new Error("API Key not initialized");

  const answersSummary = answers.map(a => {
    const dim = DIMENSIONS.find(d => d.id === a.dimensionId);
    return `- ${dim?.title}: Svarte ${a.value} (1=${dim?.leftLabel}, 5=${dim?.rightLabel})`;
  }).join('\n');

  const prompt = `
  Brukeren har nå fullført alle fire dimensjonene. Her er svarene:
  ${answersSummary}

  Oppsummer overordnet i 5–7 setninger:
   - Hvilken tendens ser du i svarene?
   - Hvordan kan dette støtte god selvledelse?
   - Hvilke mulige blindsoner kan brukeren være litt oppmerksom på?
   
  Avslutt med 1–2 refleksjonsspørsmål knyttet til selvledelse.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT_CORE,
      }
    });
    return response.text || "Kunne ikke generere oppsummering.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Det oppstod en feil ved generering av oppsummering.";
  }
};