"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import LeftBar from "./left-bar";
import Rewards from "./rewards";
import MyPurchases from "./my-purchases";
import { Menu } from "lucide-react"; // Optional: for hamburger icon

export default function RewardsPage() {
  const [activeView, setActiveView] = useState<
    "items" | "purchases" | "favorites"
  >("items");
  const [showSidebar, setShowSidebar] = useState(false);

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

      {/* Toggle button for mobile */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-sm font-medium flex items-center gap-2"
        >
          <Menu className="w-5 h-5" />
          Menu
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar: hidden on mobile unless toggled */}
        <div
          className={`fixed z-40 md:static md:block transition-transform duration-200 bg-white border-r w-64 p-4 ${
            showSidebar ? "block" : "hidden"
          } md:translate-x-0`}
        >
          <LeftBar
            activeView={activeView}
            onViewChange={(view) => {
              setActiveView(view);
              setShowSidebar(false); // auto-close on selection in mobile
            }}
          />
        </div>

        {/* Main content */}
        <main className="flex-1">{renderContent()}</main>
      </div>
    </div>
  );
}
