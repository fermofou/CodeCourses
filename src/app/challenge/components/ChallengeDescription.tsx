import { Brain, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Challenge } from "../types";

interface ChallengeDescriptionProps {
  challenge: Challenge | null;
  isLoading: boolean;
}

export function ChallengeDescription({
  challenge,
  isLoading,
}: ChallengeDescriptionProps) {
  if (isLoading) {
    return <div className="p-6">Cargando desafío...</div>;
  }

  if (!challenge) {
    return <div className="p-6">No se encontró el desafío</div>;
  }

  return (
    <>
      <div className="bg-muted/50 p-4 border-b">
        <h2 className="font-semibold flex items-center gap-1.5 text-sm">
          <Brain className="h-3.5 w-3.5" />
          Challenge description
        </h2>
      </div>

      <div className="p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{challenge.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span
                className={`inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full ${
                  challenge.difficulty <= 2
                    ? "bg-green-500/10 text-green-500"
                    : challenge.difficulty < 4
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                <Brain className="h-4 w-4" />
                {challenge.difficulty <= 2
                  ? "Fácil"
                  : challenge.difficulty < 4
                  ? "Medio"
                  : "Difícil"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm bg-red-500/10 text-red-500 px-3 py-1 rounded-full">
                <Trophy className="h-4 w-4" />
                {challenge.difficulty * 20} MC
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
                      <pre className="mt-1 text-sm">{testCase.input}</pre>
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
    </>
  );
}
