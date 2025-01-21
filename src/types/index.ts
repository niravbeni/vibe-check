export interface CustomImageData {
  url: string;
  base64: string;
}

export interface PromptResult {
  promptId: number;
  labels: string[];
}

export interface PromptData {
  id: number;
  name: string;
  text: string;
  votes: {
    good: number;
    ok: number;
    bad: number;
  };
  totalVotes: number;
  percentages: {
    good: number;
    ok: number;
    bad: number;
  };
} 