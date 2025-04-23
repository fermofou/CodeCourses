import { Link, useLocation } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Coins, Trophy, PlayCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { ChallengeContext } from "@/app/challenge/page";

const Navbar = () => {
  const location = useLocation();
  const isChallengePage = location.pathname === "/challenge";

  // Get the challenge functions if we're on the challenge page
  const challengeFunctions = isChallengePage
    ? useContext(ChallengeContext)
    : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo section */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center space-x-2">
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
          <nav className="items-center space-x-8 text-sm font-medium">
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
            <Link
              to="/repos"
              className="text-black transition-colors hover:text-primary"
            >
              Repos
            </Link>
            <Link
              to="/admin"
              className="text-black transition-colors hover:text-primary"
            >
              Admin
            </Link>
          </nav>
        )}

        {/* User Section */}
        <SignedIn>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
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
      </div>
    </header>
  );
};

export default Navbar;
