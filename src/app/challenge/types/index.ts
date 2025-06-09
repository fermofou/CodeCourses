export type Challenge = {
  problem_id: number;
  title: string;
  difficulty: number;
  solved: boolean;
  timeLimit: string;
  testCases: { input: string; expectedOutput: string }[];
  memoryLimit: number;
  question: string;
  inputs: string[];
  outputs: string[];
};

export type LanguageOption = {
  value: string;
  label: string;
  extension: any;
};

export type ExecutionResult = {
  success: boolean;
  message: string;
} | null;
