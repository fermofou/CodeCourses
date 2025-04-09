import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
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
import { SignedIn, UserButton } from "@clerk/clerk-react";
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

  return null; // Not a valid format
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
  { value: "java", label: "Java", extension: java },
  { value: "cpp", label: "C++", extension: cpp },
];

const startingCodeTemplates = {
  javascript: `function reverseString(str) {
  // Tu código aquí
  
}`,
  python: `def reverse_string(s):
    # Tu código aquí
    pass`,
  java: `public class Solution {
    public String reverseString(String str) {
        // Tu código aquí
        return "";
    }
}`,
  cpp: `string reverseString(string str) {
    // Tu código aquí
    return "";
}`,
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

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  useEffect(() => {
    let probID = getProbId();
    const fetchChallenge = async () => {
      //console.log(`http://localhost:8080/challenge?probID=${probID}&userID=${userID}`);
      try {
        const response = await fetch(
          `http://localhost:8080/challenge?probID=${probID}&userID=${userID}`
        );
        const dataChallenge = await response.json();
        dataChallenge.testCases = JSON.parse(dataChallenge.tests);
        setChallenge(dataChallenge);
        //console.log(data);
        // Set starting code to match challenge’s language, fallback to JS
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
  const userID = 6;
  const handleRunCode = useCallback(() => {
    // Clear previous results and console output
    setResults(null);
    setConsoleOutput([]);

    // Add a placeholder message to show the execution was triggered
    setConsoleOutput((prev) => [...prev, "Code execution triggered..."]);

    // Simulate a successful result after a short delay
    setTimeout(() => {
      // This is just a placeholder - replace with your actual execution logic
      setConsoleOutput((prev) => [
        ...prev,
        "Input: TechMahindra2024",
        "Your output: 4202ardnihaMhceT",
      ]);

      setResults({
        success: true,
        message: "¡Prueba superada! La función funciona correctamente.",
      });
    }, 1000);
  }, []);

  const handleSubmitCode = useCallback(() => {
    // Implement submission logic here
    setConsoleOutput((prev) => [...prev, "Submitting code..."]);

    // Simulate submission
    setTimeout(() => {
      setResults({
        success: true,
        message: "¡Solución enviada correctamente!",
      });
    }, 1500);
  }, []);

  return (
    <ChallengeContext.Provider value={{ handleRunCode, handleSubmitCode }}>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

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
                      consoleOutput.map((line, index) => (
                        <div key={index} className="text-sm mb-1">
                          {line}
                        </div>
                      ))
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
