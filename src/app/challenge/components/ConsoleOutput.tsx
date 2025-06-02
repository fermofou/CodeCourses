import { Terminal } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ConsoleOutputProps {
  consoleOutput: string[];
  results: {
    success: boolean;
    message: string;
  } | null;
  isExecuting: boolean;
  onRetry: () => void;
}

export function ConsoleOutput({
  consoleOutput,
  results,
  isExecuting,
  onRetry,
}: ConsoleOutputProps) {
  return (
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
                onClick={onRetry}
                className="ml-2 text-sm underline hover:text-white"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
} 