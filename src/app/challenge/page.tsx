import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { csharp } from "@replit/codemirror-lang-csharp";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Trophy,
  Brain,
  PlayCircle,
  CheckCircle2,
  Coins,
  Code,
  Terminal,
} from "lucide-react";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { Container, Section, Bar } from "@column-resizer/react";
import Navbar from "@/components/navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createContext, useContext } from "react";

type Challenge = {
  id: number;
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

function getProbId() {
  const url = new URL(window.location.href);
  const query = url.search.substring(1);

  if (/^\d+$/.test(query)) return query;
  if (/^\d+=?$/.test(query)) return query.split("=")[0];

  return null;
}

const sampleChallenge = {
  title: "Inversión de Cadenas",
  difficulty: "Fácil",
  timeLimit: "1s",
  memoryLimit: "128MB",
  description: `Implementa una función que invierta una cadena de texto sin utilizar métodos incorporados de inversión.

Entrada:
Una cadena S (1 ≤ |S| ≤ 100) conteniendo letras y números.

Salida:
La cadena S invertida.

Ejemplo de Entrada:
"TechMahindra2024"

Ejemplo de Salida:
"4202ardnihaMhceT"`,
  startingCode: `function reverseString(str) {
  // Tu código aquí
  
}`,
  testCases: [
    { input: '"TechMahindra2024"', expectedOutput: '"4202ardnihaMhceT"' },
    { input: '"Hello123"', expectedOutput: '"321olleH"' },
  ],
};

// Add language options
const languageOptions = [
  { value: "javascript", label: "JavaScript", extension: javascript },
  { value: "python", label: "Python", extension: python },
  { value: "cpp", label: "C++", extension: cpp },
  { value: "csharp", label: "C#", extension: csharp },
];

const startingCodeTemplates = {
  javascript: `// Write your solution here
function solution(input) {
  // Your code here
  
  return result;
}`,
  python: `# Write your solution here
def solution(input):
    # Your code here
    
    return result`,
  cpp: `// Write your solution here
string solution(string input) {
    // Your code here
    
    return result;
}`,
  csharp: `
using System;

class Program
{
    static string Solution(string input)
    {
        // Your code here
        string result = input.ToUpper(); // Example modification
        return result;
    }

    static void Main()
    {
        Console.WriteLine(Solution("Hello"));
    }
}

`,
};

// Create a context for the challenge page functions
export const ChallengeContext = createContext<{
  handleRunCode: () => void;
  handleSubmitCode: () => void;
}>({
  handleRunCode: () => {},
  handleSubmitCode: () => {},
});

export default function ChallengePage() {
  const [code, setCode] = useState(startingCodeTemplates.javascript);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [results, setResults] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(
    null
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [challenge, setChallenge] = useState<Challenge | null>(null);

  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("/health");
        if (response.ok) {
          setIsBackendAvailable(true);
          console.log("Backend is available");
        } else {
          setIsBackendAvailable(false);
          console.error("Backend health check failed:", response.status);
        }
      } catch (error) {
        setIsBackendAvailable(false);
        console.error("Backend is not available:", error);
      }
    };

    checkBackend();
  }, []);
  const userID = 6;
  useEffect(() => {
    let probID = getProbId();
    const fetchChallenge = async () => {
      //console.log(`http://localhost:8080/challenge?probID=${probID}&userID=${userID}`);
      try {
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
        //console.log(data);
        // Set starting code to match challenge's language, fallback to JS
        const defaultLang = dataChallenge.language || "javascript";
        setSelectedLanguage(
          languageOptions.find((lang) => lang.value === defaultLang) ||
            languageOptions[0]
        );
        setCode(
          startingCodeTemplates[
            defaultLang as keyof typeof startingCodeTemplates
          ]
        );
      } catch (err) {
        console.error("Failed to fetch challenge:", err);
      }
    };

    fetchChallenge();
  }, []);

  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  const handleRunCode = useCallback(async () => {
    // Clear previous results and console output
    setResults(null);
    setConsoleOutput([]);
    setIsExecuting(true);

    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    // Add a placeholder message to show the execution was triggered
    setConsoleOutput((prev) => [...prev, "Executing code..."]);

    try {
      // Log the request payload
      const payload = {
        language: selectedLanguage.value,
        code: code,
        // Add test cases if available
        testCases: challenge?.testCases || [],
      };
      console.log("Sending request with payload:", payload);
      setConsoleOutput((prev) => [...prev, "Processing..."]);

      // Submit code to backend
      const response = await fetch("/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response not ok:", response.status, errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Received initial response:", data);

      if (!data.job_id) {
        throw new Error("No job ID received from server");
      }

      const jobId = data.job_id;
      setConsoleOutput((prev) => [...prev, "Waiting for results..."]);

      // Set up timeout first
      const newTimeoutId = setTimeout(() => {
        clearInterval(pollInterval);
        setConsoleOutput((prev) => [
          ...prev,
          "Execution is taking longer than expected...",
          "You can try running the code again or wait a bit longer.",
        ]);
        setResults({
          success: false,
          message: "Execution is taking longer than expected",
        });
        setIsExecuting(false);
      }, 30000);

      setTimeoutId(newTimeoutId);

      // Poll for results
      const pollInterval = setInterval(async () => {
        try {
          console.log(`Polling for results of job ${jobId}...`);
          const resultResponse = await fetch(`/result/${jobId}`);

          if (!resultResponse.ok) {
            clearInterval(pollInterval);
            clearTimeout(newTimeoutId);
            setTimeoutId(null);
            const errorText = await resultResponse.text();
            console.error(
              "Result polling failed:",
              resultResponse.status,
              errorText
            );
            throw new Error(
              `Result polling failed: ${resultResponse.status} - ${errorText}`
            );
          }

          const resultData = await resultResponse.json();
          console.log("Received result data:", resultData);

          if (
            resultData.status === "completed" ||
            resultData.status === "success"
          ) {
            // Clear both interval and timeout immediately
            clearInterval(pollInterval);
            clearTimeout(newTimeoutId);
            setTimeoutId(null);

            // Format the output to be cleaner
            const formattedOutput: string[] = [];

            // Add standard output if available
            if (resultData.output) {
              let cleanOutput = resultData.output
                .replace(/Fetching code from:.*?\n/g, "")
                .replace(/Executing file:.*?\n/g, "")
                .replace(/Compiling file:.*?\n/g, "")
                .replace(/Executing compiled program\s*/g, "")
                .replace(/STDOUT:\s*/g, "")
                .replace(/STDERR:\s*/g, "")
                .replace(/^python\s+/g, "") // Remove "python" prefix if it exists
                .replace(/^g\+\+\s+.*?\n/g, "") // Remove g++ compilation commands
                .replace(/^cc\s+.*?\n/g, "") // Remove cc compilation commands
                .replace(/^gcc\s+.*?\n/g, "") // Remove gcc compilation commands
                .replace(/\s+/g, " ") // Normalize whitespace
                .trim();

              if (cleanOutput) {
                formattedOutput.push(cleanOutput);
              }
            }

            // Add standard error if available
            if (resultData.error && resultData.error !== "None") {
              let cleanError = resultData.error
                .replace(/STDERR:\s*/g, "")
                .replace(/^g\+\+\s+.*?\n/g, "") // Remove g++ compilation commands
                .replace(/^cc\s+.*?\n/g, "") // Remove cc compilation commands
                .replace(/^gcc\s+.*?\n/g, "") // Remove gcc compilation commands
                .trim();

              if (cleanError) {
                formattedOutput.push(`Error: ${cleanError}`);
              }
            }

            // Add execution time if available
            if (resultData.exec_time_ms) {
              formattedOutput.push(
                `Execution time: ${resultData.exec_time_ms}ms`
              );
            }

            // Update console output with formatted results
            setConsoleOutput((prev) =>
              [
                ...prev.filter((line) => !line.includes("Status: pending")), // Remove pending status messages
                ...formattedOutput,
              ].filter(Boolean)
            );

            setResults({
              success: !resultData.error,
              message: resultData.error
                ? `Code execution failed: ${resultData.error}`
                : "Code executed successfully",
            });
            setIsExecuting(false);
            return; // Exit early after successful completion
          } else if (resultData.status === "error") {
            clearInterval(pollInterval);
            // Clear the timeout since we got an error
            if (timeoutId) {
              clearTimeout(timeoutId);
              setTimeoutId(null);
            }
            setConsoleOutput((prev) => [
              ...prev,
              `Error: ${resultData.error || "Unknown error"}`,
            ]);
            setResults({
              success: false,
              message: `Code execution failed: ${
                resultData.error || "Unknown error"
              }`,
            });
            setIsExecuting(false);
          } else {
            // For any other status, just log it
            setConsoleOutput((prev) => [
              ...prev,
              `Status: ${resultData.status}`,
            ]);
          }
        } catch (pollError) {
          clearInterval(pollInterval);
          // Clear the timeout since we got an error
          if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
          }
          const errorMessage =
            pollError instanceof Error
              ? pollError.message
              : "Unknown polling error";
          console.error("Error during result polling:", errorMessage);
          setConsoleOutput((prev) => [
            ...prev,
            `Error during result polling: ${errorMessage}`,
          ]);
          setResults({
            success: false,
            message: `Failed to get execution results: ${errorMessage}`,
          });
          setIsExecuting(false);
        }
      }, 1000); // Poll every second
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error executing code:", errorMessage);
      setConsoleOutput((prev) => [...prev, `Error: ${errorMessage}`]);
      setResults({
        success: false,
        message: `Failed to execute code: ${errorMessage}`,
      });
      setIsExecuting(false);
    }
  }, [code, selectedLanguage, challenge, timeoutId]);

  const handleSubmitCode = useCallback(async () => {
    setConsoleOutput((prev) => [...prev, "Submitting code..."]);
    setIsExecuting(true);

    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    try {
      // Log the request payload
      const payload = {
        language: selectedLanguage.value,
        code: code,
        // Add test cases if available
        testCases: challenge?.testCases || [],
      };
      console.log("Sending submission with payload:", payload);
      setConsoleOutput((prev) => [...prev, "Processing..."]);

      // Submit code to backend
      const response = await fetch("/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response not ok:", response.status, errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Received initial response:", data);

      if (!data.job_id) {
        throw new Error("No job ID received from server");
      }

      const jobId = data.job_id;
      setConsoleOutput((prev) => [...prev, "Waiting for results..."]);

      // Set up timeout first
      const submitTimeoutId = setTimeout(() => {
        clearInterval(pollInterval);
        setConsoleOutput((prev) => [
          ...prev,
          "Submission is taking longer than expected...",
          "You can try submitting again or wait a bit longer.",
        ]);
        setResults({
          success: false,
          message: "Submission is taking longer than expected",
        });
        setIsExecuting(false);
      }, 30000);

      setTimeoutId(submitTimeoutId);

      // Poll for results
      const pollInterval = setInterval(async () => {
        try {
          console.log(`Polling for results of job ${jobId}...`);
          const resultResponse = await fetch(`/result/${jobId}`);

          if (!resultResponse.ok) {
            clearInterval(pollInterval);
            clearTimeout(submitTimeoutId);
            setTimeoutId(null);
            const errorText = await resultResponse.text();
            console.error(
              "Result polling failed:",
              resultResponse.status,
              errorText
            );
            throw new Error(
              `Result polling failed: ${resultResponse.status} - ${errorText}`
            );
          }

          const resultData = await resultResponse.json();
          console.log("Received result data:", resultData);

          if (
            resultData.status === "completed" ||
            resultData.status === "success"
          ) {
            // Clear both interval and timeout immediately
            clearInterval(pollInterval);
            clearTimeout(submitTimeoutId);
            setTimeoutId(null);

            // Format the output to be cleaner
            const formattedOutput: string[] = [];

            // Add standard output if available
            if (resultData.output) {
              let cleanOutput = resultData.output
                .replace(/Fetching code from:.*?\n/g, "")
                .replace(/Executing file:.*?\n/g, "")
                .replace(/Compiling file:.*?\n/g, "")
                .replace(/Executing compiled program\s*/g, "")
                .replace(/STDOUT:\s*/g, "")
                .replace(/STDERR:\s*/g, "")
                .replace(/^python\s+/g, "") // Remove "python" prefix if it exists
                .replace(/^g\+\+\s+.*?\n/g, "") // Remove g++ compilation commands
                .replace(/^cc\s+.*?\n/g, "") // Remove cc compilation commands
                .replace(/^gcc\s+.*?\n/g, "") // Remove gcc compilation commands
                .replace(/\s+/g, " ") // Normalize whitespace
                .trim();

              if (cleanOutput) {
                formattedOutput.push(cleanOutput);
              }
            }

            // Add standard error if available
            if (resultData.error && resultData.error !== "None") {
              let cleanError = resultData.error
                .replace(/STDERR:\s*/g, "")
                .replace(/^g\+\+\s+.*?\n/g, "") // Remove g++ compilation commands
                .replace(/^cc\s+.*?\n/g, "") // Remove cc compilation commands
                .replace(/^gcc\s+.*?\n/g, "") // Remove gcc compilation commands
                .trim();

              if (cleanError) {
                formattedOutput.push(`Error: ${cleanError}`);
              }
            }

            // Add execution time if available
            if (resultData.exec_time_ms) {
              formattedOutput.push(
                `Execution time: ${resultData.exec_time_ms}ms`
              );
            }

            // Update console output with formatted results
            setConsoleOutput((prev) =>
              [
                ...prev.filter((line) => !line.includes("Status: pending")), // Remove pending status messages
                ...formattedOutput,
              ].filter(Boolean)
            );

            setResults({
              success: !resultData.error,
              message: resultData.error
                ? `Submission failed: ${resultData.error}`
                : "Code submitted successfully",
            });
            setIsExecuting(false);
            return; // Exit early after successful completion
          } else if (resultData.status === "error") {
            clearInterval(pollInterval);
            setConsoleOutput((prev) => [
              ...prev,
              `Error: ${resultData.error || "Unknown error"}`,
            ]);
            setResults({
              success: false,
              message: `Submission failed: ${
                resultData.error || "Unknown error"
              }`,
            });
          } else {
            // For any other status, just log it
            setConsoleOutput((prev) => [
              ...prev,
              `Status: ${resultData.status}`,
            ]);
          }
        } catch (pollError) {
          clearInterval(pollInterval);
          // Clear the timeout since we got an error
          if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
          }
          const errorMessage =
            pollError instanceof Error
              ? pollError.message
              : "Unknown polling error";
          console.error("Error during result polling:", errorMessage);
          setConsoleOutput((prev) => [
            ...prev,
            `Error during result polling: ${errorMessage}`,
          ]);
          setResults({
            success: false,
            message: `Failed to get execution results: ${errorMessage}`,
          });
          setIsExecuting(false);
        }
      }, 1000); // Poll every second
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error submitting code:", errorMessage);
      setConsoleOutput((prev) => [...prev, `Error: ${errorMessage}`]);
      setResults({
        success: false,
        message: `Failed to submit code: ${errorMessage}`,
      });
      setIsExecuting(false);
    }
  }, [code, selectedLanguage, challenge, timeoutId]);

  return (
    <ChallengeContext.Provider value={{ handleRunCode, handleSubmitCode }}>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        {/* Backend availability warning */}
        {isBackendAvailable === false && (
          <div className="bg-red-500 text-white p-2 text-center">
            <p className="font-bold">
              Warning: Code execution service is not available
            </p>
            <p className="text-sm">
              Please make sure the backend server is running on port 8080
            </p>
          </div>
        )}

        {/* Main Content */}
        <Container
          style={{
            width: "100%",
            height: "calc(100vh - 56px)", // 56px is the header height (h-14)
            display: "flex",
            minHeight: 0, // This is important for Firefox
          }}
        >
          <Section
            minSize={400}
            defaultSize={50}
            style={{ minHeight: 0 }} // This is important for Firefox
            className="overflow-hidden"
          >
            <div className="h-full py-2 pl-2">
              {/* Wrapped the content in a Card */}
              <Card className="h-full flex flex-col border-2">
                <div className="bg-muted/50 p-4 border-b">
                  <h2 className="font-semibold flex items-center gap-1.5 text-sm">
                    <Brain className="h-3.5 w-3.5" />
                    Challenge description
                  </h2>
                </div>

                {challenge ? (
                  <div className="p-6 overflow-y-auto">
                    {/* Challenge Description */}
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-3xl font-bold">
                          {challenge.title}
                        </h1>
                        <div className="flex items-center gap-4 mt-2">
                          <span
                            className={`inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full ${
                              challenge.difficulty < 2
                                ? "bg-green-500/10 text-green-500"
                                : challenge.difficulty === 2
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            <Brain className="h-4 w-4" />
                            {challenge.difficulty === 1
                              ? "Fácil"
                              : challenge.difficulty === 2
                              ? "Medio"
                              : "Difícil"}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-sm bg-red-500/10 text-red-500 px-3 py-1 rounded-full">
                            <Trophy className="h-4 w-4" />
                            {challenge.difficulty * 100} MC
                          </span>
                        </div>
                      </div>

                      <Card className="p-6">
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                          <pre className="whitespace-pre-wrap text-sm">
                            {challenge.question}
                          </pre>
                        </div>
                      </Card>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Test Cases</h3>
                        <div className="grid gap-4">
                          {challenge.testCases.map((testCase, index) => (
                            <Card key={index} className="p-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">
                                    Input:
                                  </p>
                                  <pre className="mt-1 text-sm">
                                    {testCase.input}
                                  </pre>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">
                                    Expected Output:
                                  </p>
                                  <pre className="mt-1 text-sm">
                                    {testCase.expectedOutput}
                                  </pre>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">Cargando desafío...</div>
                )}
              </Card>
            </div>
          </Section>

          <Bar
            size={4}
            className="bg-transparent hover:bg-primary/50 transition-colors"
            style={{ cursor: "col-resize" }}
          />

          <Section
            minSize={400}
            defaultSize={50}
            style={{ minHeight: 0 }}
            className="overflow-hidden"
          >
            <div className="h-full py-2 pr-2 flex flex-col">
              {/* Code Editor Section - Takes 70% of height */}
              <div className="h-[70%] mb-2">
                <Card className="h-full flex flex-col border-2 overflow-hidden">
                  <div className="bg-muted/50 p-4 border-b">
                    <h2 className="font-semibold flex items-center gap-1.5 text-sm">
                      <Code className="h-3.5 w-3.5" />
                      Código
                    </h2>
                  </div>

                  <div className="border-b bg-background p-4">
                    <div className="flex justify-between items-center">
                      <Select
                        value={selectedLanguage.value}
                        onValueChange={(value) => {
                          const language = languageOptions.find(
                            (l) => l.value === value
                          );
                          if (language) {
                            setSelectedLanguage(language);
                            setCode(
                              startingCodeTemplates[
                                value as keyof typeof startingCodeTemplates
                              ]
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border">
                          {languageOptions.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        onClick={() =>
                          setCode(
                            startingCodeTemplates[
                              selectedLanguage.value as keyof typeof startingCodeTemplates
                            ]
                          )
                        }
                        size="sm"
                      >
                        Reiniciar código
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 min-h-0 relative overflow-hidden">
                    <CodeMirror
                      value={code}
                      height="100%"
                      theme={vscodeDark}
                      extensions={[selectedLanguage.extension({ jsx: true })]}
                      onChange={(value) => setCode(value)}
                      className="text-sm absolute inset-0 overflow-hidden"
                    />
                  </div>
                </Card>
              </div>

              {/* Console Output Section - Takes 30% of height */}
              <div className="h-[30%]">
                <Card className="h-full flex flex-col border-2 overflow-hidden">
                  <div className="bg-muted/50 p-4 border-b">
                    <h2 className="font-semibold flex items-center gap-1.5 text-sm">
                      <Terminal className="h-3.5 w-3.5" />
                      Console Output
                    </h2>
                  </div>
                  <div className="flex-1 overflow-auto p-4 bg-black text-white font-mono">
                    {consoleOutput.length === 0 ? (
                      <div className="text-gray-500 text-sm">
                        Run your code to see output here
                      </div>
                    ) : (
                      <>
                        {consoleOutput.map((line, index) => {
                          // Determine the line type for styling
                          let lineClass = "text-sm mb-1";

                          if (line.startsWith("Output:")) {
                            lineClass += " text-green-400";
                          } else if (line.startsWith("Error:")) {
                            lineClass += " text-red-400";
                          } else if (line.startsWith("Execution time:")) {
                            lineClass += " text-blue-400";
                          } else if (
                            line.startsWith("Executing code...") ||
                            line.startsWith("Processing...") ||
                            line.startsWith("Waiting for results...")
                          ) {
                            lineClass += " text-gray-400";
                          } else if (line.startsWith("Status:")) {
                            lineClass += " text-yellow-400";
                          } else if (
                            line.startsWith("Execution is taking longer") ||
                            line.startsWith("Submission is taking longer")
                          ) {
                            lineClass += " text-orange-400";
                          }

                          return (
                            <div key={index} className={lineClass}>
                              {line}
                            </div>
                          );
                        })}

                        {isExecuting && (
                          <div className="mt-2 text-blue-400 text-sm flex items-center">
                            <div className="animate-spin mr-2">⚙️</div>
                            <span>Processing your code...</span>
                          </div>
                        )}
                      </>
                    )}
                    {results && (
                      <div
                        className={`mt-4 p-2 rounded ${
                          results.success
                            ? "bg-green-900/30 text-green-400"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {results.message}
                        {!results.success && !isExecuting && (
                          <button
                            onClick={handleRunCode}
                            className="ml-2 text-sm underline hover:text-white"
                          >
                            Try again
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </Section>
        </Container>
      </div>
    </ChallengeContext.Provider>
  );
}
