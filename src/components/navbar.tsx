import { Link, useLocation, useNavigate } from "react-router-dom";
import { SignedIn, UserButton, SignedOut } from "@clerk/clerk-react";
import { Coins, Trophy, PlayCircle, CheckCircle2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext, useState, useRef, useEffect } from "react";
import { ChallengeContext } from "@/app/challenge/context/ChallengeContext";
import { useUserData } from "../userData";
import { ThemeToggle } from "./theme-toggle";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isChallengePage = location.pathname === "/challenge";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const {
    state: { userData, loading, error },
  } = useUserData();

  useEffect(() => {
    console.log("Navbar userData:", userData);
    console.log("admin value:", userData?.admin);
  }, [userData]);

  // Get the challenge functions if we're on the challenge page
  const challengeFunctions = isChallengePage
    ? useContext(ChallengeContext)
    : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="container mx-auto flex h-16 items-center justify-between overflow-x-auto whitespace-nowrap px-4 md:px-8">
        {/* Logo section */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-foreground transition-colors hover:text-primary"
          >
            <div className="flex items-center justify-center w-8 h-8 border border-foreground rounded-md">
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
          <div className="h-4 w-px bg-border" />
          {isChallengePage && (
            <Button
              variant="ghost"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link to="/challenges">Problem Set</Link>
            </Button>
          )}
        </div>

        {/* Center Navigation or Challenge Buttons */}
        {isChallengePage ? (
          <div className="flex-1 flex justify-center">
            <div className="isolate flex -space-x-px">
              <Button
                variant="outline"
                className="rounded-r-none focus:z-10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 hover:outline-none hover:ring-0 hover:border-input"
                onClick={challengeFunctions?.handleRunCode}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Run Code
              </Button>
              <Button
                className="rounded-l-none focus:z-10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 hover:outline-none hover:ring-0 bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
                onClick={challengeFunctions?.handleSubmitCode}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </div>
          </div>
        ) : (
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link
              to="/challenges"
              className="text-foreground transition-colors hover:text-primary"
            >
              Programming Challenges
            </Link>
            <Link
              to="/leaderboard"
              className="text-foreground transition-colors hover:text-primary"
            >
              Leaderboard
            </Link>
            <Link
              to="/rewards"
              className="text-foreground transition-colors hover:text-primary"
            >
              Rewards
            </Link>
            {userData?.admin && (
              <Link
                to="/admin"
                className="text-foreground transition-colors hover:text-primary"
              >
                Admin
              </Link>
            )}
          </nav>
        )}
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
              onClick={() => navigate("/signup")}
              className="hidden sm:inline-flex"
            >
              Register
            </Button>
          </SignedOut>

          {/* User Section */}
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
              <ThemeToggle />
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
            {/* 
            {userData?.admin && (
              <Link
                to="/admin"
                className="text-black px-2 py-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
              */}
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
  );
};

export default Navbar;
