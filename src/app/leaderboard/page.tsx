import Navbar from "@/components/navbar"
import Leaderboard from "./leaderboard"

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <Leaderboard />
      </main>
    </div>
  )
}

