export interface ImageData {
  url: string;  // for display
  base64: string;  // for API
}

export interface PromptResult {
  promptId: string;
  promptText: string;
  labels: string[];
}

export type Score = 'bad' | 'ok' | 'good';

export interface Evaluation {
  promptId: string;
  score: Score;
} 