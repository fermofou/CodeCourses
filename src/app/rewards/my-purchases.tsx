"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

interface Purchase {
  id: number;
  reward_id: number;
  name: string;
  description: string;
  cost: number;
  timestamp: string;
  status: string;
}

export default function MyPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/myRewards?userId=${user.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch purchases");
        }

        const data = await response.json();
        setPurchases(data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching purchases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Purchases</h1>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading your purchases...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Purchases</h1>
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">My Purchases</h1>
        <p className="text-gray-600 text-sm">
          View all your claimed rewards and their status.
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold mb-2">No purchases yet</h2>
          <p className="text-gray-500 mb-1">
            Buy something and see your history here!
          </p>
          <p className="text-sm text-gray-400">
            Start browsing items to earn cool rewards.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm dark:border-gray-700"
            >
              <img
                src={`assets/${purchase.reward_id}.jpg`}
                alt={purchase.name}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h3 className="font-medium mb-2 dark:text-white">{purchase.name}</h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Purchased:{" "}
                {new Date(purchase.timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    purchase.status === "completed"
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : purchase.status === "pending"
                      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {purchase.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
