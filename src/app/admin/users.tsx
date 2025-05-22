import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input, Button } from "antd"; // Change this line
import { EditOutlined } from "@ant-design/icons";

interface UserType {
  name: string;  // Changed from username to match leaderboard
  id: string;
  level: number;
  points: number;
}

const calculateRank = (points: number): string => {
  if (points >= 2600) return "Grandmaster";
  if (points >= 2300) return "Master";
  if (points >= 1900) return "Candidate";
  if (points >= 1600) return "Expert";
  if (points >= 1400) return "Specialist";
  if (points >= 1200) return "Pupil";
  return "Newbie";
};

const getRankColor = (rank: string): string => {
  switch (rank) {
    case "Grandmaster": return "text-[#FF0000]";
    case "Master": return "text-[#FF8C00]";
    case "Candidate": return "text-[#AA00AA]";
    case "Expert": return "text-[#0000FF]";
    case "Specialist": return "text-[#03A89E]";
    case "Pupil": return "text-[#008000]";
    case "Newbie": return "text-[#808080]";
    default: return "";
  }
};

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(""); // Add this state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/leaderboard")  // Using the same endpoint as leaderboard
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    // Add interval to refresh data like in leaderboard
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Users</h1>
        <p className="text-gray-600">Manage platform users</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Input.Search
            placeholder="Search users..."
            style={{ width: 250 }}
            allowClear
            onSearch={(value) => setSearchText(value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-b-2">
            <TableHead className="w-[35%]">User</TableHead>
            <TableHead className="w-[20%] text-left">Rank</TableHead>
            <TableHead className="w-[15%] text-center">Level</TableHead>
            <TableHead className="w-[15%] text-center">Points</TableHead>
            <TableHead className="w-[15%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users
            .filter(user => 
              user.name.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((user) => {
              const rank = calculateRank(user.points);
              const rankColor = getRankColor(rank);

              return (
                <TableRow key={user.id} className="border-b transition-colors hover:bg-muted/50">
                  <TableCell className="w-[35%]">
                    <div className="flex items-center space-x-3">
                      <Avatar className="border border-gray-200">
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[20%]">
                    <div className="flex items-center">
                      <span className={getRankColor(rank)}>{rank}</span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[15%] text-center font-medium">{user.level}</TableCell>
                  <TableCell className="w-[15%] text-center font-medium">{user.points}</TableCell>
                  <TableCell className="w-[15%] text-right">
                    <div className="flex justify-end gap-3">
                      <Button 
                        icon={<EditOutlined />} 
                        onClick={() => console.log('Edit', user.id)}
                      >
                        Edit
                      </Button>
                      <Button 
                        danger 
                        onClick={() => console.log('Delete', user.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )})}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;