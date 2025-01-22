import { Prompt } from '../types.js';

export const PROMPTS: Prompt[] = [
  {
    name: 'style-analyzer',
    promptText: 'You are a comprehensive style analyzer. Analyze the images and provide categorized labels in this exact format:\nMOOD: label1, label2, label3\nSTYLE: label1, label2, label3\nCOLORS: label1, label2, label3\nMATERIALS: label1, label2, label3\nAESTHETIC: label1, label2, label3\n\nIMPORTANT RULES:\n- Return ONLY single words or hyphenated terms (e.g., \'minimalist\', \'earth-toned\', \'silk-blend\')\n- NO phrases or full sentences\n- NO image numbering or prefixes\n- NO categories or headers\n- Separate all labels with commas',
    votes: {
      good: 0,
      ok: 0,
      bad: 0
    }
  }
]; 