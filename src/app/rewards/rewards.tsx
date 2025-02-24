import { Search } from "lucide-react";
import {
  Trophy,
  Gift,
  User,
  Brain,
  Target,
  Sparkles,
  Crown,
  Menu,
  Coins,
} from "lucide-react";

import { SignedIn, UserButton, SignedOut } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/custom-button";
import React, { useState, useEffect, useRef } from "react";
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <Link
            to="/"
            className="flex items-center space-x-2 text-black transition-colors hover:text-primary"
          >
            <div className="flex items-center justify-center w-8 h-8 border border-black rounded-md">
              <div className="flex items-center">
                <span className="text-[#6D6C71] text-lg font-bold leading-none">
                  T
                </span>
                <span className="text-[#ED2831] text-lg font-bold leading-none">
                  M
                </span>
              </div>
            </div>
            <span className="text-xl font-bold">TechCraft</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link
              to="#challenges"
              className="text-black transition-colors hover:text-primary"
            >
              Retos de Programación
            </Link>
            <Link
              to="#leaderboard"
              className="text-black transition-colors hover:text-primary"
            >
              Tabla de Posiciones
            </Link>
            <Link
              to="#"
              className="text-black transition-colors hover:text-primary"
            >
              Recompensas
            </Link>
          </nav>

          {/* Updated Auth Section */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="hidden sm:inline-flex"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => navigate("/register")}
                className="hidden sm:inline-flex"
              >
                Registrarse
              </Button>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">2,500 MC</span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Nivel 12</span>
                  </div>
                </div>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-8 h-8 rounded-full ring-2 ring-primary/10 hover:ring-primary/30 transition-all",
                      userButtonTrigger: "ring-0 outline-0",
                    },
                  }}
                />
              </div>
            </SignedIn>

            {/* Mobile Menu Button */}
            <Button
              ref={buttonRef}
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Updated Mobile Menu */}
        {isMobileMenuOpen && (
          <div ref={menuRef} className="md:hidden border-t">
            <div className="container flex flex-col space-y-4 py-4 px-4">
              <SignedIn>
                <div className="flex items-center justify-between p-2 mb-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Coins className="h-5 w-5 text-primary" />
                    <span className="font-medium">2,500 MC</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="font-medium">Nivel 12</span>
                  </div>
                </div>
              </SignedIn>

              <Link
                to="#challenges"
                className="text-black px-2 py-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Retos de Programación
              </Link>
              <Link
                to="#leaderboard"
                className="text-black px-2 py-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
              <Link
                to="/rewards"
                className="text-black px-2 py-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Recompensas
              </Link>

              <SignedOut>
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/register");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Registrarse
                  </Button>
                </div>
              </SignedOut>
            </div>
          </div>
        )}
      </header>

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
