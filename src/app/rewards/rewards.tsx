"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/clerk-react";
import { useUserData } from "../../userData";

interface Product {
  reward_id: number;
  name: string;
  description: string;
  inventory_count: number;
  cost: number;
}

export default function Rewards() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [rewards, setRewards] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const { user } = useUser();
  const {
    state: { userData, loading, error },
  } = useUserData();
  const [userPoints, setUserPoints] = useState(userData?.points ?? 0);

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (userData?.points !== undefined) {
      setUserPoints(userData.points);
    }
  }, [userData]);

  useEffect(() => {
    fetch("/api/rewards")
      .then((response) => response.json())
      .then((data) => setRewards(data))
      .catch((error) => console.error("Error fetching rewards:", error));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Earn cool stuff!</h1>
          <p className="text-gray-600 text-sm">
            Top picks for you. Updated daily.
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-full bg-white hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="h-6 w-6 text-primary" />
            {cartItems.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {cartItems.length}
              </Badge>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {rewards.map((reward) => (
          <div
            key={reward.reward_id}
            className="rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedProduct(reward)}
          >
            <img
              src={`assets/${reward.reward_id}.jpg`}
              alt={reward.name}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <h3 className="font-medium">{reward.name}</h3>
            <p className="text-sm text-gray-600">{reward.cost} mahindricks</p>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>Product Details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <img
                src={`assets/${selectedProduct?.reward_id}.jpg`}
                alt={selectedProduct?.name}
                className="w-full h-64 object-cover rounded-md"
              />
              <div>
                <p className="text-lg font-semibold mb-2">
                  {selectedProduct?.cost} mahindricks
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Available: {selectedProduct?.inventory_count}
                </p>
                <Button
                  onClick={() => selectedProduct && addToCart(selectedProduct)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cart Modal */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Cart</DialogTitle>
            <DialogDescription>
              Review your items and purchase one at a time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500">Your cart is empty.</p>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={`${item.reward_id}-${index}`}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.cost} mahindricks
                    </p>
                  </div>
                  <Button
                    onClick={async () => {
                      if (userPoints >= item.cost) {
                        console.log(`Claiming reward: ${item.reward_id}`);
                        const payload = {
                          userID: user?.id,
                          rewardID: item.reward_id,
                        };
                        try {
                          const response = await fetch("/claim", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(payload),
                          });

                          const data = await response.json();

                          if (response.ok) {
                            alert(data.message);
                            setUserPoints((prev) => prev - item.cost);
                          } else {
                            alert(
                              `Error: ${data.message || "Failed to claim"}`
                            );
                          }
                        } catch (error) {
                          alert(`Request failed: ${error.message}`);
                        }

                        setCartItems((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      } else {
                        console.log("Not enough points");
                      }
                    }}
                    variant="default"
                    disabled={userPoints < item.cost}
                    className={
                      userPoints < item.cost
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  >
                    {userPoints < item.cost ? "Not enough points" : "Buy"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
