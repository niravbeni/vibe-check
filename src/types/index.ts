export interface CustomImageData {
  url: string;
  base64: string;
}

export interface PromptResult {
  promptId: string;
  promptText: string;
  labels: string[];
}

export interface PromptData {
  id: string;
  name: string;
  votes: {
    good: number;
    ok: number;
    bad: number;
  };
  percentages: {
    good: number;
    ok: number;
    bad: number;
  };
  totalVotes: number;
} 