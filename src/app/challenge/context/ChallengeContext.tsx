import { createContext } from "react";

export const ChallengeContext = createContext<{
  handleRunCode: () => void;
  handleSubmitCode: () => void;
}>({
  handleRunCode: () => {},
  handleSubmitCode: () => {},
}); 