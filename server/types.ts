export type Score = 'good' | 'ok' | 'bad';

export interface PromptVotes {
  good: number;
  ok: number;
  bad: number;
}

export interface Prompt {
  name: string;
  promptText: string;
  votes: PromptVotes;
} 