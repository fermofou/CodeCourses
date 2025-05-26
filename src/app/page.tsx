import {
  ArrowRight,
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
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

import { Button } from "@/components/ui/custom-button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useUserData } from "../userData";

type LeaderboardEntry = {
  id: string;
  name: string;
  points: number;
  level: number;
  image_url: string;
};

export default function Home() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mcoins, setMcoins] = useState(112750);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const {
    state: { userData, loading, error },
  } = useUserData();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        console.log("Leaderboard data:", data);
        setLeaderboard(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 60000);
    return () => clearInterval(interval);
  }, []);

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
    const incrementCoins = () => {
      setMcoins((prev) =>
        Math.min(prev + Math.floor(Math.random() * 20) + 1, 999999)
      );
    };

    const scheduleNextIncrement = () => {
      const delay = Math.random() * 1500 + 500;
      return setTimeout(() => {
        incrementCoins();
        timeoutRef.current = scheduleNextIncrement();
      }, delay);
    };

    const timeoutRef = { current: null as any };
    timeoutRef.current = scheduleNextIncrement();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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
            <span className="text-xl font-bold">CodeCourses</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link
              to="/challenges"
              className="text-black transition-colors hover:text-primary"
            >
              Programming Challenges
            </Link>
            <Link
              to="/leaderboard"
              className="text-black transition-colors hover:text-primary"
            >
              Leaderboard
            </Link>
            <Link
              to="/rewards"
              className="text-black transition-colors hover:text-primary"
            >
              Rewards
            </Link>
            {userData?.admin && (
              <Link
                to="/admin"
                className="text-black transition-colors hover:text-primary"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Updated Auth Section */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/register")}
                className="hidden sm:inline-flex"
              >
                Register
              </Button>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {userData?.points} MC
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      Nivel {userData?.level}
                    </span>
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
                    <span className="font-medium">{userData?.points} MC</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="font-medium">Level {userData?.level}</span>
                  </div>
                </div>
              </SignedIn>
              {/*
              <Link
                to="/challenges"
                className="text-black px-2 py-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Programming Challenges
              </Link>{" "}
              */}
              <Link
                to="/leaderboard"
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
                Rewards
              </Link>
              {userData?.admin && (
                <Link
                  to="/admin"
                  className="text-black px-2 py-1.5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <SignedOut>
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/register");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Register
                  </Button>
                </div>
              </SignedOut>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>

          <div className="container relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-24">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    Develop your talent,{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                      grow with us :)
                    </span>
                  </h1>
                  <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    Your exclusive platform like Mahindra to enhance your
                    programming skills, participating in technical challenges
                    and gain recognition within the company.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={() => navigate("/login")}
                  >
                    Start now <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/challenges")}
                  >
                    See challenges
                  </Button>
                </div>
                <div className="flex flex-col space-y-12 pt-8">
                  {/* Top stats in a grid */}
                  <div className="grid grid-cols-2 gap-8 max-w-md mx-auto w-full">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <h4 className="text-5xl font-bold text-primary">50+</h4>
                      <p className="text-base text-muted-foreground font-medium">
                        Internal Challenges
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-3">
                      <h4 className="text-5xl font-bold text-primary">300+</h4>
                      <p className="text-base text-muted-foreground font-medium">
                        Active Mahindras
                      </p>
                    </div>
                  </div>

                  {/* MCoins counter centered below */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-muted/30 px-8 py-6 rounded-2xl">
                      <AnimatedCounter value={mcoins} className="text-5xl" />
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Coins className="h-5 w-5" />
                      <p className="text-base font-medium">MCoins Earned</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-3xl" />
                <div className="relative bg-card rounded-2xl border p-6 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">Spotlight Challenge</h3>
                        <p className="text-sm text-muted-foreground">
                          Data Structures and Alghoritms
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                          <Coins className="h-3 w-3 inline mr-1" />
                          60 MC
                        </span>
                        <Button variant="outline" size="sm">
                          Solve
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg bg-black/95 p-4 font-mono text-sm text-green-400 space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-muted pb-2">
                        <span>Reverse String</span>
                        <div className="flex gap-2">
                          <span className="text-primary">Time: 1s</span>
                          <span>Memory: 128MB</span>
                        </div>
                      </div>
                      <pre className="space-y-2 overflow-x-auto">
                        <code>{`Problem:
Implement a function that reverses a string
without using built-in reversal methods.

Input:
A string S (1 ≤ |S| ≤ 100) containing letters and numbers.

Output:
The string S reversed.

Example Input:
"TechMahindra2024"

Example Output:
"4202ardnihaMhceT"`}</code>
                      </pre>
                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-muted pt-2">
                        <span>Dificulty: Easy</span>
                        <span>Success rate: 85%</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-primary" />
                          <span className="font-medium">60 MCoins</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>•</span>
                          <span>Tries: 156</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                          <span className="text-muted-foreground">
                            Expected complexity
                          </span>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full w-[30%] bg-green-500 rounded-full" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">
                            Optimization level
                          </span>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full w-[40%] bg-yellow-500 rounded-full" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="bg-muted px-2 py-1 rounded-full text-xs">
                          Strings
                        </span>
                        <span className="bg-muted px-2 py-1 rounded-full text-xs">
                          Arrays
                        </span>
                        <span className="bg-muted px-2 py-1 rounded-full text-xs">
                          Basics
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-muted/50 py-24">
          <div className="container space-y-12">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
              Benefits for Mahindras
            </h2>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6 space-y-2">
                  <Brain className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Technical Challenges</h3>
                  <p className="text-sm text-muted-foreground">
                    Challenges designed by our experts, aligned with the Tech
                    Mahindra's projects and technologies.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-2">
                  <Target className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">
                    {" "}
                    Professional Development
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Earn MCoins and gain experience that will be reflected in
                    your performance evaluation and growth opportunities.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-2">
                  <Gift className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Recognition</h3>
                  <p className="text-sm text-muted-foreground">
                    Redeem your MCoins for exclusive benefits like days off,
                    premium courses, and company merchandise.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="leaderboard" className="py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Top Mahindras
              </h2>
              <p className="text-xl text-muted-foreground max-w-[42rem] mx-auto">
                This week's top developers at our company.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  {leaderboard
                    .slice(0, 5)
                    .map((entry: LeaderboardEntry, index: number) => (
                      <div
                        key={entry.id}
                        className={`flex items-center justify-between py-4 px-4 border-b last:border-0 ${
                          index === 0 ? "bg-primary/5 rounded-lg" : ""
                        }`}
                      >
                        <div className="flex items-center gap-6">
                          <div className="text-2xl font-bold text-muted-foreground">
                            {index === 0 && (
                              <Crown className="h-7 w-7 inline mr-2 text-primary" />
                            )}
                            {index + 1}°
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-full overflow-hidden ${
                                index === 0 ? "bg-zinc-200" : "bg-muted"
                              }`}
                            >
                              {entry.image_url ? (
                                <img
                                  src={entry.image_url}
                                  alt={`${entry.name}'s avatar`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <span className="font-semibold">
                                {entry.name}
                              </span>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Level {entry.level}</span>
                                <span>•</span>
                                <span>{entry.points} points</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="font-semibold">
                              {entry.points} XP
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <Coins className="h-4 w-4" />
                            <span className="font-medium">
                              {entry.points} MC
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="coming-soon" className="bg-muted/50 py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <span className="text-primary text-sm font-medium">
                Coming soon
              </span>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                New Functionalities
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 flex gap-4">
                  <Brain className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Tech Mahindra Trivia</h3>
                    <p className="text-sm text-muted-foreground">
                      Show your knowledge in our technologies and internal
                      processes.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex gap-4">
                  <Sparkles className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Tournaments by Area</h3>
                    <p className="text-sm text-muted-foreground">
                      Compete with other Mahindras in your department in
                      specialized challenges.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Tech Mahindra. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Terms
            </Link>
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
