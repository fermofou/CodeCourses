import type React from "react"
import { useUser } from "@clerk/clerk-react"
import { Medal } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type LeaderboardEntry = {
  id: string
  name: string
  score: number
  problemsSolved: number
}

const mockLeaderboardData: LeaderboardEntry[] = [
  { id: "1", name: "Alice", score: 1500, problemsSolved: 120 },
  { id: "2", name: "Bob", score: 1450, problemsSolved: 115 },
  { id: "3", name: "Charlie", score: 1400, problemsSolved: 110 },
  { id: "4", name: "David", score: 1350, problemsSolved: 105 },
  { id: "5", name: "Eve", score: 1300, problemsSolved: 100 },
]

const getMedalInfo = (rank: number) => {
  switch (rank) {
    case 0:
      return { color: "text-yellow-400", title: "Gold" }
    case 1:
      return { color: "text-gray-400", title: "Silver" }
    case 2:
      return { color: "text-amber-700", title: "Bronze" }
    default:
      return { color: "hidden", title: "" }
  }
}

const getRowStyle = (rank: number) => {
  switch (rank) {
    case 0:
      return "bg-[#FFF7E6] hover:bg-[#FFE7B3] border-yellow-200"
    case 1:
      return "bg-[#F5F5F5] hover:bg-[#E5E5E5] border-gray-200"
    case 2:
      return "bg-[#FFF1E6] hover:bg-[#FFE1CC] border-amber-200"
    default:
      return "hover:bg-gray-50 border-gray-200"
  }
}

const Leaderboard: React.FC = () => {
  const { user } = useUser()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#ED2831]">Leaderboard</h1>
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-[#ED2831]/20">
            <TableHead className="w-20 text-[#ED2831]">Rank</TableHead>
            <TableHead className="text-[#ED2831]">User</TableHead>
            <TableHead className="text-right text-[#ED2831]">Score</TableHead>
            <TableHead className="text-right text-[#ED2831]">Problems Solved</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockLeaderboardData.map((entry, index) => {
            const { color } = getMedalInfo(index)
            return (
              <TableRow
                key={entry.id}
                className={`${user?.id === entry.id ? "bg-primary/10" : ""} 
                  ${getRowStyle(index)} border-b transition-colors`}
              >
                <TableCell className="w-20 font-medium">
                  {index < 3 ? (
                    <div className="flex items-center justify-center">
                      <Medal className={`w-6 h-6 ${color}`} />
                    </div>
                  ) : (
                    <div className="text-center">{index + 1}</div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar
                      className={`${index < 3 ? "border-2" : "border"} ${
                        index === 0
                          ? "border-yellow-400 bg-yellow-50"
                          : index === 1
                            ? "border-gray-400 bg-gray-50"
                            : index === 2
                              ? "border-amber-700 bg-amber-50"
                              : "border-gray-200 bg-gray-100"
                      }`}
                    >
                      <AvatarFallback
                        className={`
                        font-medium
                        ${
                          index === 0
                            ? "text-yellow-700"
                            : index === 1
                              ? "text-gray-700"
                              : index === 2
                                ? "text-amber-800"
                                : "text-gray-600"
                        }
                      `}
                      >
                        {entry.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{entry.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{entry.score}</TableCell>
                <TableCell className="text-right font-medium">{entry.problemsSolved}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default Leaderboard

