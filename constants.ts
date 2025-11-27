import { Dimension } from './types';

export const DIMENSIONS: Dimension[] = [
  {
    id: 'actor_pawn',
    title: 'Aktør – Brikke',
    leftLabel: 'Aktør',
    leftDescription: 'Vi handler ut fra egne initiativer.',
    rightLabel: 'Brikke',
    rightDescription: 'Vi reagerer mest basert på stimuli fra verden rundt oss.'
  },
  {
    id: 'nature_nurture',
    title: 'Arv – Miljø',
    leftLabel: 'Arv',
    leftDescription: 'Arvede og medfødte karakteristikker er mest bestemmende for atferd.',
    rightLabel: 'Miljø',
    rightDescription: 'Faktorer i miljøet har størst innflytelse på vår atferd.'
  },
  {
    id: 'uniqueness_similarity',
    title: 'Unikhet – Likhet',
    leftLabel: 'Unikhet',
    leftDescription: 'Vi er unike og kan ikke sammenlignes med andre.',
    rightLabel: 'Likhet',
    rightDescription: 'Mennesker er grunnleggende like i hvem vi er som mennesker.'
  },
  {
    id: 'optimism_pessimism',
    title: 'Optimistisk – Pessimistisk (om endring)',
    leftLabel: 'Optimistisk',
    leftDescription: 'Viktige/store endringer i personlighet og atferd kan inntreffe hele livet.',
    rightLabel: 'Pessimistisk',
    rightDescription: 'Vår personlighet og atferd er stabil og kan ikke endres.'
  }
];

export const SYSTEM_PROMPT_CORE = `
Du er en samtalepartner i et kort refleksjonsspill om menneskesyn og selvledelse.
Målgruppen er erfarne prosjektledere, teamledere og mellomledere i arbeidslivet.

Oppgave:
- Hjelp brukeren å plassere seg selv på fire menneskesyn-dimensjoner.
- Gi korte, konkrete tilbakemeldinger på hvert valg.
- Koble alt til selvledelse i jobb- og hverdagsliv.
- Dette er IKKE en test eller diagnose, bare en refleksjonsøvelse.

Språk og stil:
- Skriv på norsk.
- Bruk "du"-form.
- Vær profesjonell, tydelig og vennlig, ikke coachy eller terapeutisk.
- Ikke gi psykologiske diagnoser, og ikke gi råd om behandling.
- Hold fokus på arbeidshverdag, selvledelse, valg og refleksjon.
`;