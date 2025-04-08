import { SignedIn, UserButton, SignedOut } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/custom-button";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import { Search, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Product {
  reward_id: number;
  name: string;
  description: string;
  inventory_count: number;
  cost: number;
}

("use client");

export default function RewardsPage() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = React.useState("swag");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [rewards, setRewards] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
    setSelectedProduct(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/rewards")
      .then((response) => response.json())
      .then((data) => setRewards(data))
      .catch((error) => console.error("Error fetching rewards:", error));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r p-4">
          <div className="space-y-8">
            <div>
              <h2 className="mb-2 text-lg font-semibold">Rewards</h2>
              <nav className="space-y-1">
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-black hover:bg-gray-100"
                >
                  Articulos
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-black hover:bg-gray-100"
                >
                  Mis compras
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-black hover:bg-gray-100"
                >
                  Mis favoritos
                </a>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
              {["Disponibles", "Todos", "Desarrollo", "Ocio"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeTab === tab.toLowerCase()
                      ? "bg-primary text-white"
                      : "bg-white text-black hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cartItems.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItems.length}
                </Badge>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Earn cool stuff!</h1>
            <p className="text-gray-600 text-sm">
              Top picks for you. Updated daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {rewards.map((reward) => (
              <div
                key={reward.reward_id}
                className="rounded-lg border p-4 cursor-pointer"
                onClick={() => setSelectedProduct(reward)}
              >
                <img
                  src={`assets/${reward.reward_id}.jpg`} //dejen reward_id
                  alt={reward.name}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
                <h3 className="font-medium">{reward.name}</h3>
                <p className="text-sm text-gray-600">
                  {reward.cost} mahindricks
                </p>
              </div>
            ))}
          </div>
        </main>
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
    </div>
  );
}
