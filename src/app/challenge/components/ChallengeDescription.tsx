import { Brain, Trophy, BarChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Challenge } from "../types";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

interface LeaderboardEntry {
  user_name: string;
  time: number;
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(
    null
  );

  useEffect(() => {
    if (challenge?.problem_id) {
      fetch(`/api/getLeaderboardProblem?problemId=${challenge.problem_id}`)
        .then((res) => res.json())
        .then((data) => setLeaderboard(data))
        .catch((err) => {
          console.error("Failed to fetch leaderboard", err);
          setLeaderboard([]);
        });
    }
  }, [challenge?.problem_id]);

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
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{challenge.title}</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5"
                  >
                    <BarChart className="h-4 w-4" />
                    Standings
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Challenge Standings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-3 gap-4 p-3 font-medium text-sm bg-muted/50">
                        <div>Rank</div>
                        <div>User</div>
                        <div>Time</div>
                      </div>
                      {leaderboard === null ? (
                        <div className="p-3 text-sm text-muted-foreground">
                          Be first to answer!
                        </div>
                      ) : leaderboard.length === 0 ? (
                        <div className="p-3 text-sm text-muted-foreground">
                          No entries yet.
                        </div>
                      ) : (
                        leaderboard.map((entry, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-3 gap-4 p-3 border-t text-sm"
                          >
                            <div className="font-medium">#{i + 1}</div>
                            <div>{entry.user_name}</div>
                            <div className="text-green-600 font-mono">
                              {(entry.time / 1000).toFixed(3)}s
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
