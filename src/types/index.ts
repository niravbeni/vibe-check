export interface CustomImageData {
  url: string;
  base64: string;
}

export interface LabelCategories {
  mood: string[];
  style: string[];
  colors: string[];
  materials: string[];
  aesthetic: string[];
}

export interface PromptResult {
  promptId: number;
  labels: string[];
}

export interface PromptData {
  id: number;
  name: string;
  promptText: string;
  goodVotes: number;
  okVotes: number;
  badVotes: number;
  totalVotes: number;
  goodPercentage: number;
  okPercentage: number;
  badPercentage: number;
} 