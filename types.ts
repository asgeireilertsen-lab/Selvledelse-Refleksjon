export interface Dimension {
  id: string;
  title: string;
  leftLabel: string;
  leftDescription: string;
  rightLabel: string;
  rightDescription: string;
}

export interface UserAnswer {
  dimensionId: string;
  value: number; // 1-5
}

export interface FeedbackResponse {
  text: string;
}

export enum GameState {
  API_KEY_INPUT,
  INTRO,
  DIMENSION_INPUT,
  FEEDBACK_LOADING,
  FEEDBACK_DISPLAY,
  SUMMARY_LOADING,
  SUMMARY_DISPLAY
}