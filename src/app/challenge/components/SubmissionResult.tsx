import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface SubmissionResultProps {
  status: "accept" | "deny";
  message: string;
  onClose: () => void;
}

export function SubmissionResult({ status, message, onClose }: SubmissionResultProps) {
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
          
          <p className="text-center text-muted-foreground">
            {message}
          </p>
          
          <Button
            onClick={onClose}
            variant={status === "accept" ? "default" : "destructive"}
            className="mt-4"
          >
            {status === "accept" ? "Continue" : "Try Again"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
} 