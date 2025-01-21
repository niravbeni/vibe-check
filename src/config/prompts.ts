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

export const PROMPTS: Prompt[] = [
  {
    id: "prompt1",
    name: "Prompt A",
    promptText: "Describe the overall theme and mood of these 3 images",
    systemPrompt: "You are an expert at analyzing images and identifying themes. Return exactly 10 labels that capture the overall mood, theme, and feeling of these images. Return only the labels as a comma-separated list.",
    votes: {
      good: 0,
      ok: 0,
      bad: 0
    }
  },
  {
    id: "prompt2",
    name: "Prompt B",
    promptText: "What common elements or themes do you observe across these images?",
    systemPrompt: "You are an expert at finding connections between images. Return exactly 10 labels that identify common elements, patterns, or themes across these images. Return only the labels as a comma-separated list.",
    votes: {
      good: 0,
      ok: 0,
      bad: 0
    }
  },
  {
    id: "prompt3",
    name: "Prompt C",
    promptText: "List the key objects, emotions, and concepts present in these images",
    systemPrompt: "You are an expert at identifying objects and emotions in images. Return exactly 10 labels that list the key objects, emotions, and concepts present in these images. Return only the labels as a comma-separated list.",
    votes: {
      good: 0,
      ok: 0,
      bad: 0
    }
  }
] 