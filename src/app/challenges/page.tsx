import { FaStar, FaCheck, FaTrophy, FaTimes } from "react-icons/fa";
import { FaFileCode, FaShareFromSquare } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "antd";
import { Trophy, Coins } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { Tag as AntdTag } from "antd";
import DailyChallengeImage from "./DailyChallenge.png";
import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";
import { SignedIn, useUser } from "@clerk/clerk-react";

interface ProblemsTableType {
  key: number;
  status: boolean;
  name: string;
  points: number;
  difficulty: number;
  tags: string[];
}

interface ApiProblemType {
  problem_id: number;
  title: string;
  difficulty: number;
  solved: boolean | null;
  tags?: string[];
  // Points might be added later
}

interface ProblemOverviewType {
  id: number;
  title: string;
  difficulty: number;
  solved: boolean | null;
  timeLimit: number;
  memoryLimit: number;
  question: string;
  inputs: string[];
  outputs: string[];
}

const columns: ColumnsType<ProblemsTableType> = [
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    className: "flex justify-center items-center",
    render: (_, { status }) => <>{<CompletedMar completed={status} />}</>,
  },
  {
    title: "Problem",
    dataIndex: "name",
    key: "name",
    render: (_, { name, status, key }) => (
      <Link
        to={`/challenge?${key}`}
        className="hover:underline"
        style={{ color: status ? "#2CBA5A" : "black" }}
      >
        {key}. {name}
      </Link>
    ),
  },
  {
    title: "Points",
    dataIndex: "points",
    key: "points",
    render: (_, { points, status }) => (
      <div style={{ color: status ? "#2CBA5A" : "black" }}>{points} MC</div>
    ),
  },
  {
    title: "Difficulty",
    dataIndex: "difficulty",
    key: "difficulty",
    // Difficulty filter
    filters: [
      { text: "Easy", value: 1 },
      { text: "Medium", value: 2 },
      { text: "Hard", value: 3 },
    ],
    onFilter: (value, record) => record.difficulty === value,
    render: (_, { difficulty }) => (
      <div className="flex items-center gap-2">
        {Array.from({ length: difficulty }).map((_, i) => (
          <FaStar key={i} />
        ))}
      </div>
    ),
  },
];

const ChallengeButton = ({
  color,
  completed,
}: {
  color: string;
  completed: boolean;
  children?: any;
}) => {
  return (
    <div
      style={{ borderColor: completed ? "gray" : color }}
      className={`rounded-full border-[5px] min-w-[5.5rem] min-h-[5.5rem] flex justify-center items-center`}
    >
      <div
        style={{ backgroundColor: completed ? "gray" : color }}
        className={`min-w-[4.2rem] min-h-[4.2rem] rounded-full flex justify-center items-center font-bold`}
      >
        <FaStar size={40} color="white" />
      </div>
    </div>
  );
};

const CompletedMar = ({ completed }: { completed: boolean | null }) => {
  let bgColor = "gray";
  //console.log(completed);

  if (completed == true) {
    bgColor = "#2DBB5C";
  } else if (completed === null) {
    bgColor = "gray";
  } else if (completed === false) {
    bgColor = "red";
  }
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={`min-w-[1.4rem] min-h-[1.4rem] max-w-[1.4rem] max-h-[1.4rem] rounded-full flex justify-center items-center font-bold`}
    >
      {completed && <FaCheck size={13} color="white" />}
      {completed == null && <FaStar size={13} color="white" />}
      {completed == false && <FaTimes size={13} color="white" />}
    </div>
  );
};

const Gym = ({ problems }: { problems: ProblemsTableType[] }) => {
  return (
    <div className="flex flex-col min-w-[40rem] flex-grow gap-4">
      <span className="text-xl font-bold">All problems</span>
      <Table<ProblemsTableType>
        pagination={{ pageSize: 10, showSizeChanger: false }}
        dataSource={problems}
        columns={columns}
      />
    </div>
  );
};

const DailyChallenge = ({ onClick }: { onClick?: () => void }) => {
  const [challenge, setChallenge] = useState<ProblemOverviewType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyChallenge = async () => {
      try {
        const response = await fetch(`api/challenge?probID=1`);
        const data = await response.json();
        setChallenge(data);
      } catch (error) {
        console.error("Error fetching daily challenge:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyChallenge();
  }, []);

  if (loading) {
    return (
      <div className="relative flex flex-row gap-6 border-2 rounded-lg p-6 min-w-[30rem] flex-grow justify-between items-center pb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="animate-pulse flex flex-col gap-4 items-start w-full">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="flex gap-4">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

  return (
    <div
      className="relative flex flex-row gap-6 border-2 rounded-lg p-6 min-w-[30rem] flex-grow justify-between items-center pb-8 cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white"
      onClick={onClick}
    >
      <div className="flex flex-col gap-4 items-start">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Daily Challenge
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: challenge.difficulty }).map((_, i) => (
              <FaStar key={i} className="text-yellow-400" />
            ))}
          </div>
        </div>
        <span className="text-2xl font-bold text-gray-800">{challenge.title}</span>
        <p className="w-[24rem] text-gray-600 text-sm leading-relaxed">{challenge.question}</p>
        <div className="flex flex-row gap-6">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full shadow-sm">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-gray-700">{challenge.difficulty * 20} MC</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full shadow-sm">
            <FaFileCode className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-gray-700">Arrays</span>
          </div>
        </div>
      </div>
      <img src={DailyChallengeImage} alt="Daily Challenge" className="w-[180px] h-[180px] object-contain" />
    </div>
  );
};

const Mission = ({
  icon,
  name,
  progress,
  color,
}: {
  icon: any;
  name: string;
  progress: number;
  color?: string;
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-grow">
        <div className="font-medium">{name}</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full"
            style={{ width: `${progress}%`, backgroundColor: color || "blue" }}
          ></div>
        </div>
      </div>
    </div>
  );
};


export default function ChallengesPage() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<ProblemsTableType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!user) return null;

  useEffect(() => {
    setLoading(true);
    fetch(`api/problems?userId=${user.id}`)
      .then((response) => response.json())
      .then((data: ApiProblemType[]) => {
        // Map the API data to match our table structure
        const formattedProblems = data.map((problem) => {
          // no se, 20 puntos * dificultad del 1 al 5?
          const points = problem.difficulty * 20;

          return {
            key: problem.problem_id,
            status: problem.solved, // Convert null to false
            name: problem.title,
            points: points,
            difficulty: problem.difficulty,
            tags: problem.tags || ["coding"], // Default tag if not provided
          };
        });

        setProblems(formattedProblems);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching problems:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex w-full h-screen flex-col justify-start">
      <Navbar />
      <div className="flex flex-col h-full w-full justify-start gap-8 overflow-auto p-6">
        <div className="flex gap-4 flex-wrap justify-center">
          <DailyChallenge
            onClick={() => {
              navigate("/challenge?1");
            }}
          />
        </div>
        <Gym problems={problems} />
      </div>
    </div>
  );
}