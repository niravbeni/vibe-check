export interface PromptVotes {
  good: number;
  ok: number;
  bad: number;
}

export interface Prompt {
  id: string;
  name: string;
  promptText: string;
  systemPrompt: string;
  votes: PromptVotes;
}

export type Score = 'good' | 'ok' | 'bad'; 