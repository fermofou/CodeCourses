import type React from "react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Medal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserProfileModal from "@/components/UserProfileModal";

type LeaderboardEntry = {
  name: string;
  points: number;
  level: number;
  id: string;
  image_url: string;
  is_admin: boolean;
};

const getMedalInfo = (rank: number) => {
  switch (rank) {
    case 0:
      return { color: "text-yellow-400", title: "Gold" };
    case 1:
      return { color: "text-gray-400", title: "Silver" };
    case 2:
      return { color: "text-amber-700", title: "Bronze" };
    default:
      return { color: "hidden", title: "" };
  }
};

const getRowStyle = (rank: number) => {
  switch (rank) {
    case 0:
      return "bg-[#FFF7E6] hover:bg-[#FFE7B3] border-yellow-200";
    case 1:
      return "bg-[#F5F5F5] hover:bg-[#E5E5E5] border-gray-200";
    case 2:
      return "bg-[#FFF1E6] hover:bg-[#FFE1CC] border-amber-200";
    default:
      return "hover:bg-gray-50 border-gray-200";
  }
};

const calculateRank = (level: number): string => {
  if (level >= 100) return "Grandmaster";
  if (level >= 80) return "Master";
  if (level >= 60) return "Candidate";
  if (level >= 40) return "Expert";
  if (level >= 20) return "Specialist";
  if (level >= 10) return "Pupil";
  return "Newbie";
};

const getRankColor = (rank: string): string => {
  switch (rank) {
    case "Grandmaster":
      return "text-[#FF0000]";
    case "Master":
      return "text-[#FF8C00]";
    case "Candidate":
      return "text-[#AA00AA]";
    case "Expert":
      return "text-[#0000FF]";
    case "Specialist":
      return "text-[#03A89E]";
    case "Pupil":
      return "text-[#008000]";
    case "Newbie":
      return "text-[#808080]";
    default:
      return "";
  }
};

const Leaderboard: React.FC = () => {
  const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(
    null
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        console.log("Leaderboard data:", data); // Debug log
        setLeaderboard(data);
      } catch (err) {
        console.error("Error al obtener leaderboard:", err);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const showUserProfile = (entry: LeaderboardEntry) => {
    console.log("Showing profile for user:", entry); // Debug log
    if (!entry.id) {
      console.error("No user ID found for entry:", entry);
      return;
    }
    setSelectedUser(entry);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#ED2831]">Leaderboard</h1>
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-[#ED2831]/20">
            <TableHead className="w-20 text-[#ED2831]">Rank</TableHead>
            <TableHead className="text-[#ED2831]">User</TableHead>
            <TableHead className="text-[#ED2831]">Division</TableHead>
            <TableHead className="text-right text-[#ED2831]">Points</TableHead>
            <TableHead className="text-right text-[#ED2831]">Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((entry, index) => {
            const { color } = getMedalInfo(index);
            const isCurrentUser = user?.fullName === entry.name;
            const rank = calculateRank(entry.level);
            const rankColor = getRankColor(rank);

            return (
              <TableRow
                key={`${entry.name}-${entry.points}`}
                className={`${isCurrentUser ? "bg-primary/10" : ""} 
                  ${getRowStyle(
                    index
                  )} border-b transition-colors cursor-pointer`}
                onClick={() => showUserProfile(entry)}
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
                      className={`${
                        index < 3 ? "border-2" : "border"
                      } border-gray-200`}
                    >
                      {entry.image_url ? (
                        <img
                          src={entry.image_url}
                          alt={`${entry.name}'s profile`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>

                    <span className="font-medium">{entry.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${rankColor}`}>{rank}</span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {entry.points}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {entry.level}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default Leaderboard;
