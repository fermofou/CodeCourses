import { SignedIn, UserButton, SignedOut } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/custom-button";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
("use client");

export default function RewardsPage() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = React.useState("swag");
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
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar/>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r p-4">
          <div className="space-y-8">
            <div>
              <h2 className="mb-2 text-lg font-semibold">Rewards</h2>
              <nav className="space-y-1">
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Discover
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                >
                  My rewards
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                >
                  My mahindricks
                </a>
              </nav>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-semibold">Social</h2>
              <nav className="space-y-1">
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Ranking
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                >
                  About
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Profile
                </a>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
              {["Swag", "Gift Cards", "More"].map((tab) => (
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="rounded-lg border p-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-02-24%20083113-hq8J0n8OSWJzCYYDqk898Ec0MZcZLO.png"
                alt="Mochila"
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h3 className="font-medium">Mochila</h3>
              <p className="text-sm text-gray-600">4,500 mahindricks</p>
            </div>
            <div className="rounded-lg border p-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-02-24%20083113-hq8J0n8OSWJzCYYDqk898Ec0MZcZLO.png"
                alt="Taza café"
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h3 className="font-medium">Taza café</h3>
              <p className="text-sm text-gray-600">1,000 mahindricks</p>
            </div>
            <div className="rounded-lg border p-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-02-24%20083113-hq8J0n8OSWJzCYYDqk898Ec0MZcZLO.png"
                alt="Libro Designing Data Intensive A..."
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h3 className="font-medium">
                Libro Designing Data Intensive A...
              </h3>
              <p className="text-sm text-gray-600">10,000 mahindricks</p>
            </div>
            <div className="rounded-lg border p-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-02-24%20083113-hq8J0n8OSWJzCYYDqk898Ec0MZcZLO.png"
                alt="Stickers Github"
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h3 className="font-medium">Stickers Github</h3>
              <p className="text-sm text-gray-600">100 mahindricks</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-1">Made for You</h2>
            <p className="text-gray-600 text-sm mb-6">Restocked Items</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Additional product cards would go here */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
