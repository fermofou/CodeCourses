import { Container, Section, Bar } from "@column-resizer/react";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { ChallengeDescription } from "./components/ChallengeDescription";
import { CodeEditor } from "./components/CodeEditor";
import { ConsoleOutput } from "./components/ConsoleOutput";
import { SubmissionResult } from "./components/SubmissionResult";
import { useChallengeData } from "./hooks/useChallengeData";
import { useBackendHealth } from "./hooks/useBackendHealth";
import { ChallengeContext } from "./context/ChallengeContext";
import { useCodeExecution } from "./hooks/useCodeExecution";

export default function ChallengePage() {
  const { challenge, isLoading } = useChallengeData();
  const { isBackendAvailable } = useBackendHealth();
  const {
    code,
    setCode,
    selectedLanguage,
    setSelectedLanguage,
    consoleOutput,
    results,
    isExecuting,
    submissionResult,
    handleRunCode,
    handleSubmitCode,
    clearSubmissionResult,
  } = useCodeExecution();

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
            height: "calc(100vh - 56px)",
            display: "flex",
            minHeight: 0,
          }}
        >
          <Section
            minSize={400}
            defaultSize={50}
            style={{ minHeight: 0 }}
            className="overflow-hidden"
          >
            <div className="h-full py-2 pl-2">
              <Card className="h-full flex flex-col border-2">
                <ChallengeDescription
                  challenge={challenge}
                  isLoading={isLoading}
                />
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
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                />
              </div>

              {/* Console Output Section - Takes 30% of height */}
              <div className="h-[30%]">
                <ConsoleOutput
                  consoleOutput={consoleOutput}
                  results={results}
                  isExecuting={isExecuting}
                  onRetry={handleRunCode}
                />
              </div>
            </div>
          </Section>
        </Container>

        {/* Submission Result Modal */}
        {submissionResult && (
          <SubmissionResult
            status={submissionResult.status === "accept" ? "accept" : "deny"}
            message={submissionResult.message}
            onClose={clearSubmissionResult}
            executionTime={submissionResult.executionTime}
            coinsEarned={submissionResult.coinsEarned}
            TestCases={submissionResult.TestCases}
            totalCases={submissionResult.totalCases}
          />
        )}
      </div>
    </ChallengeContext.Provider>
  );
}
