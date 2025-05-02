import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: "alexcoder",
      fullName: "Alex Rodriguez",
      rank: "Master",
      solved: 245,
      rating: 2156,
      lastActive: "2025-04-05",
    },
    {
      id: 2,
      username: "mariaprogrammer",
      fullName: "Maria Gonzalez",
      rank: "Expert",
      solved: 187,
      rating: 1875,
      lastActive: "2025-04-04",
    },
    {
      id: 3,
      username: "carlos_dev",
      fullName: "Carlos Mendez",
      rank: "Specialist",
      solved: 132,
      rating: 1543,
      lastActive: "2025-04-03",
    },
    {
      id: 4,
      username: "juliaCoder",
      fullName: "Julia Lopez",
      rank: "Candidate Master",
      solved: 212,
      rating: 1987,
      lastActive: "2025-04-06",
    },
    {
      id: 5,
      username: "david_algo",
      fullName: "David Herrera",
      rank: "Pupil",
      solved: 76,
      rating: 1250,
      lastActive: "2025-04-01",
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [sortDir, setSortDir] = useState("desc");

  const sortedUsers = [...users].sort((a, b) => {
    if (sortDir === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  const filteredUsers = sortedUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  };

  const getRankColor = (rank) => {
    const colors = {
      "Master": "text-red-600",
      "Candidate Master": "text-purple-600",
      "Expert": "text-blue-600",
      "Specialist": "text-cyan-600",
      "Pupil": "text-green-600",
      "Newbie": "text-gray-600"
    };
    return colors[rank] || "text-gray-600";
  };

  return (
    <div className="w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Users</h1>
        <p className="text-gray-600">Manage and view registered users on the platform</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search user..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="w-5 h-5 absolute right-3 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Add User
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Export List
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("username")}
                >
                  <div className="flex items-center">
                    User
                    {sortBy === "username" && (
                      <span className="ml-1">
                        {sortDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("rank")}
                >
                  <div className="flex items-center">
                    Rank
                    {sortBy === "rank" && (
                      <span className="ml-1">
                        {sortDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("solved")}
                >
                  <div className="flex items-center">
                    Solved
                    {sortBy === "solved" && (
                      <span className="ml-1">
                        {sortDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("rating")}
                >
                  <div className="flex items-center">
                    Rating
                    {sortBy === "rating" && (
                      <span className="ml-1">
                        {sortDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("lastActive")}
                >
                  <div className="flex items-center">
                    Last Active
                    {sortBy === "lastActive" && (
                      <span className="ml-1">
                        {sortDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.fullName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRankColor(user.rank)} bg-opacity-10`}>
                      {user.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.solved}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{user.rating}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 border rounded bg-gray-100">Previous</button>
          <button className="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
          <button className="px-3 py-1 border rounded">2</button>
          <button className="px-3 py-1 border rounded">3</button>
          <button className="px-3 py-1 border rounded bg-gray-100">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Users;