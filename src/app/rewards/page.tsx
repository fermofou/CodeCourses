"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import LeftBar from "./left-bar";
import Rewards from "./rewards";
import MyPurchases from "./my-purchases";

export default function RewardsPage() {
  const [activeView, setActiveView] = useState<
    "items" | "purchases" | "favorites"
  >("items");

  const renderContent = () => {
    switch (activeView) {
      case "items":
        return <Rewards />;
      case "purchases":
        return <MyPurchases />;
      case "favorites":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
            <p className="text-gray-600">
              Your favorite items will appear here.
            </p>
          </div>
        );
      default:
        return <Rewards />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex">
        <LeftBar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1">{renderContent()}</main>
      </div>
    </div>
  );
}
