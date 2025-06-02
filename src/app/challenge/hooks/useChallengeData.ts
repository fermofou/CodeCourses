import { useState, useEffect } from "react";
import { Challenge } from "../types";
import { languageOptions, startingCodeTemplates } from "../constants";
import { getProbId } from "../utils/url";

export function useChallengeData() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userID = 6; // TODO: Get this from auth context

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const probID = getProbId();
        if (!probID) {
          throw new Error("No problem ID found in URL");
        }

        const response = await fetch(
          `api/challenge?probID=${probID}&userID=${userID}`
        );
        const dataChallenge = await response.json();

        // Handle test cases properly
        if (typeof dataChallenge.tests === "string") {
          try {
            dataChallenge.testCases = JSON.parse(dataChallenge.tests);
          } catch (e) {
            console.error("Failed to parse test cases:", e);
            dataChallenge.testCases = [];
          }
        } else {
          dataChallenge.testCases = dataChallenge.tests || [];
        }

        setChallenge(dataChallenge);
      } catch (err) {
        console.error("Failed to fetch challenge:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenge();
  }, []);

  return { challenge, isLoading };
} 