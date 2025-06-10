"use client"

import { useEffect, useState, useRef } from "react"
import { useUser } from "@clerk/clerk-react"
import { Trophy, Crown } from "lucide-react"
import { TrophyOutlined } from "@ant-design/icons"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import UserProfileModal from "@/components/UserProfileModal"


type LeaderboardEntry = {
  name: string
  points: number
  level: number
  id: string
  image_url: string
  is_admin: boolean
  mail: string
}

const calculateRank = (level: number): string => {
  if (level >= 100) return "Grandmaster"
  if (level >= 80) return "Master"
  if (level >= 60) return "Candidate"
  if (level >= 40) return "Expert"
  if (level >= 20) return "Specialist"
  if (level >= 10) return "Pupil"
  return "Newbie"
}

const getRankColor = (rank: string): string => {
  switch (rank) {
    case "Grandmaster":
      return "text-[#FF0000]"
    case "Master":
      return "text-[#FF8C00]"
    case "Candidate":
      return "text-[#AA00AA]"
    case "Expert":
      return "text-[#0000FF]"
    case "Specialist":
      return "text-[#03A89E]"
    case "Pupil":
      return "text-[#008000]"
    case "Newbie":
      return "text-[#808080]"
    default:
      return ""
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

const Leaderboard = () => {
  const { user } = useUser()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard")
        const data = await res.json()
        // Sort the data by level in descending order
        const sortedData = data.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.level - a.level)
        setLeaderboard(sortedData)
      } catch (err) {
        console.error("Error al obtener leaderboard:", err)
      }
    }

    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 5000)
    return () => clearInterval(interval)
  }, [])

  const showUserProfile = (entry: LeaderboardEntry) => {
    if (!entry.id) {
      console.error("No user ID found for entry:", entry)
      return
    }
    setSelectedUser(entry)
    setIsProfileModalOpen(true)
  }

  const top3 = leaderboard.slice(0, 3)
  const restOfLeaderboard = leaderboard.slice(3)

  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-background to-background rounded-xl">
      <div className="mb-12">
      </div>

      {/* Podium Section */}
      {top3.length > 0 && (
        <div className="mb-12 relative">
          <div className="flex justify-center items-end h-64 gap-4">
            {/* Second Place */}
            {top3.length > 1 && (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar 
                    className="w-20 h-20 border-4 border-gray-300 dark:border-gray-600 cursor-pointer"
                    onClick={() => showUserProfile(top3[1])}
                  >
                    {top3[1].image_url ? (
                      <img
                        src={top3[1].image_url || "/placeholder.svg"}
                        alt={`${top3[1].name}'s profile`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <AvatarFallback className="text-2xl">{top3[1].name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div className="text-center mt-2">
                  <p 
                    className="font-bold text-lg cursor-pointer hover:text-red-600 dark:text-gray-100"
                    onClick={() => showUserProfile(top3[1])}
                  >
                    {top3[1].name}
                  </p>
                  
                </div>
                <div className="w-28 h-28 bg-gray-300 dark:bg-gray-700 rounded-t-lg flex items-center justify-center mt-2">
                  <span className="text-4xl font-bold text-white">2</span>
                </div>
              </div>
            )}

            {/* First Place */}
            {top3.length > 0 && (
              <div className="flex flex-col items-center -mt-8">
                <div className="relative">
                  <Crown className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-10 h-10 text-yellow-500" />
                  <Avatar 
                    className="w-24 h-24 border-4 border-yellow-400 cursor-pointer"
                    onClick={() => showUserProfile(top3[0])}
                  >
                    {top3[0].image_url ? (
                      <img
                        src={top3[0].image_url || "/placeholder.svg"}
                        alt={`${top3[0].name}'s profile`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <AvatarFallback className="text-3xl">{top3[0].name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div className="text-center mt-2">
                  <p 
                    className="font-bold text-xl cursor-pointer hover:text-red-600 dark:text-gray-100"
                    onClick={() => showUserProfile(top3[0])}
                  >
                    {top3[0].name}
                  </p>
                  
                </div>
                <div className="w-32 h-36 bg-yellow-400 rounded-t-lg flex items-center justify-center mt-2">
                  <span className="text-5xl font-bold text-white">1</span>
                </div>
              </div>
            )}

            {/* Third Place */}
            {top3.length > 2 && (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar 
                    className="w-20 h-20 border-4 border-amber-700 cursor-pointer"
                    onClick={() => showUserProfile(top3[2])}
                  >
                    {top3[2].image_url ? (
                      <img
                        src={top3[2].image_url || "/placeholder.svg"}
                        alt={`${top3[2].name}'s profile`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <AvatarFallback className="text-2xl">{top3[2].name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div className="text-center mt-2">
                  <p 
                    className="font-bold text-lg cursor-pointer hover:text-red-600 dark:text-gray-100"
                    onClick={() => showUserProfile(top3[2])}
                  >
                    {top3[2].name}
                  </p>
                  
                </div>
                <div className="w-28 h-28 bg-amber-700 rounded-t-lg flex items-center justify-center mt-2">
                  <span className="text-4xl font-bold text-white">3</span>
                </div>
              </div>
            )}
          </div>
          <div className="w-full h-6 bg-red-600 rounded-t-lg mt-0"></div>
        </div>
      )}

      {/* Rest of Leaderboard */}
      <Card className="overflow-hidden border-2 border-red-200 dark:border-red-800">
        <Table>
          <TableHeader>
            <TableRow className="text-sm sm:text-base px-2 sm:px-4 border-b-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
              <TableHead className="w-20 text-[#333333] dark:text-gray-100 font-bold">Rank</TableHead>
              <TableHead className="text-[#333333] dark:text-gray-100 font-bold">User</TableHead>
              <TableHead className="text-[#333333] dark:text-gray-100 font-bold">Division</TableHead>
              <TableHead className="text-right text-[#333333] dark:text-gray-100 font-bold hidden sm:table-cell">Points</TableHead>
              <TableHead className="text-right text-[#333333] dark:text-gray-100 font-bold">Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restOfLeaderboard.map((entry, index) => {
              const actualRank = index + 4 // Since we're starting after top 3
              const isCurrentUser = user?.fullName === entry.name
              const rank = calculateRank(entry.level)
              const rankColor = getRankColor(rank)

              return (
                <TableRow
                  key={`${entry.name}-${entry.points}`}
                  className={`${isCurrentUser ? "bg-red-50 dark:bg-red-950" : ""} 
                    hover:bg-gray-50 dark:hover:bg-gray-800 border-b transition-colors cursor-pointer`}
                  onClick={() => showUserProfile(entry)}
                >
                  <TableCell className="w-20 font-medium">
                    <div className="text-center flex items-center justify-center">
                      <div className="bg-red-100 dark:bg-red-900 w-8 h-8 rounded-full flex items-center justify-center">
                        {actualRank}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="border border-red-200 dark:border-red-800">
                        {entry.image_url ? (
                          <img
                            src={entry.image_url || "/placeholder.svg"}
                            alt={`${entry.name}'s profile`}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-medium dark:text-gray-100">{entry.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${rankColor}`}>{rank}</span>
                  </TableCell>
                  <TableCell className="text-right font-medium hidden sm:table-cell dark:text-gray-100">{entry.points}</TableCell>
                  <TableCell className="text-right font-medium dark:text-gray-100">{entry.level}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={
          selectedUser
            ? {
                id: selectedUser.id,
                name: selectedUser.name,
                level: selectedUser.level,
                points: selectedUser.points,
                mail: selectedUser.mail,
                is_admin: selectedUser.is_admin,
                image_url: selectedUser.image_url,
              }
            : null
        }
      />
    </div>
  )
}

export default Leaderboard
