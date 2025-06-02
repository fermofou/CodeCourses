import { useState, useEffect } from "react";

export function useBackendHealth() {
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);

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

  return { isBackendAvailable };
} 