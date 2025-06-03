import { CheckCircle2, XCircle, Clock, Coins, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SubmissionResultProps {
  status: "accept" | "deny";
  message: string;
  onClose: () => void;
  executionTime?: number;
  coinsEarned?: number;
  TestCases?: number;
  totalCases?: number;
}

export function SubmissionResult({
  status,
  message,
  onClose,
  executionTime,
  coinsEarned,
  TestCases,
  totalCases,
}: SubmissionResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <Card className="w-[90%] max-w-md p-6 bg-background">
        <div className="flex flex-col items-center gap-4">
          {status === "accept" ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-500"
            >
              <CheckCircle2 size={64} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-red-500"
            >
              <XCircle size={64} />
            </motion.div>
          )}

          <h2 className="text-2xl font-bold text-center">
            {status === "accept" ? "Submission Accepted!" : "Submission Failed"}
          </h2>

          <p className="text-center text-muted-foreground">{message}</p>

          {status === "accept" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full space-y-3 mt-2"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Execution Time
                    </p>
                    <p className="font-semibold">{executionTime}ms</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Coins Earned
                    </p>
                    <p className="font-semibold">+{coinsEarned}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <Trophy className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Test Cases</p>
                  <p className="font-semibold">
                    {TestCases}/{totalCases} passed
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <Button
            onClick={onClose}
            variant={status === "accept" ? "default" : "destructive"}
            className={cn(
              "mt-4",
              status === "accept" && "bg-green-600 hover:bg-green-700"
            )}
          >
            {status === "accept" ? "Continue" : "Try Again"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
