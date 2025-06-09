import { FaStar, FaCheck, FaTrophy, FaTimes } from "react-icons/fa";
import { FaFileCode, FaShareFromSquare } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "antd";
import { Trophy, Coins } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { Tag as AntdTag } from "antd";
import DailyChallengeImage from "@/assets/DailyChallenge.png";
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
}

interface ProblemOverviewType {
  id: number;
  title: string;
  difficulty: number;
  solved: boolean | null;
  timeLimit: number;
  memoryLimit: number;
  question: string;
}

const columns: ColumnsType<ProblemsTableType> = [
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    className: "flex justify-center items-center dark:text-gray-100",
    render: (_, { status }) => <>{<CompletedMar completed={status} />}</>,
  },
  {
    title: "Problem",
    dataIndex: "name",
    key: "name",
    className: "dark:text-gray-100",
    render: (_, { name, status, key }) => (
      <Link
        to={`/challenge?${key}`}
        className="hover:underline dark:text-gray-100"
        style={{ color: status ? "#2CBA5A" : "inherit" }}
      >
        {key}. {name}
      </Link>
    ),
  },
  {
    title: "Points",
    dataIndex: "points",
    key: "points",
    className: "dark:text-gray-100",
    render: (_, { points, status }) => (
      <div style={{ color: status ? "#2CBA5A" : "inherit" }} className="dark:text-gray-100">{points} MC</div>
    ),
  },

  {
    title: "Difficulty",
    dataIndex: "difficulty",
    key: "difficulty",
    className: "dark:text-gray-100",

    // Difficulty filter
    filters: Array.from({ length: 5 }, (_, i) => ({
      value: i + 1,
      text: (
        <span className="inline-block">
          {Array.from({ length: i + 1 }).map((_, j) => (
            <FaStar key={j} className="inline mr-0.5" />
          ))}
        </span>
      ),
    })),

    onFilter: (value, record) => record.difficulty === value,

    render: (_, { difficulty }) => (
      <div className="flex items-center gap-1">
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
      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">All problems</span>
      <div className="dark:bg-gray-800 rounded-lg overflow-hidden [&_.ant-table-thead_.ant-table-cell]:dark:bg-gray-800 [&_.ant-table-thead_.ant-table-cell]:dark:text-gray-100 [&_.ant-table-thead_.ant-table-cell]:dark:border-gray-700 [&_.ant-pagination-item]:dark:bg-gray-800 [&_.ant-pagination-item]:dark:border-gray-700 [&_.ant-pagination-item]:dark:text-gray-100 [&_.ant-pagination-item-active]:dark:bg-primary [&_.ant-pagination-item-active]:dark:border-primary [&_.ant-pagination-item-active]:dark:text-white [&_.ant-pagination-item:hover]:dark:border-primary [&_.ant-pagination-item:hover]:dark:text-primary [&_.ant-table-tbody>tr:hover>td]:dark:bg-gray-700 [&_.ant-table-tbody>tr:hover>td]:dark:border-gray-600">
        <Table<ProblemsTableType>
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            className: "dark:bg-gray-800 dark:text-gray-100",
            itemRender: (page, type, originalElement) => {
              if (type === 'prev' || type === 'next') {
                return <span className="dark:text-gray-100">{originalElement}</span>;
              }
              return originalElement;
            }
          }}
          dataSource={problems}
          columns={columns}
          className="dark:bg-gray-800 dark:text-gray-100"
          rootClassName="dark:bg-gray-800"
          rowClassName="dark:bg-gray-800 dark:text-gray-100"
          headerRowClassName="dark:bg-gray-800 dark:text-gray-100"
          bodyRowClassName="dark:bg-gray-800 dark:text-gray-100"
          cellClassName="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          headerCellClassName="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
        />
      </div>
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
      <div className="relative flex flex-row gap-6 border-2 rounded-lg p-6 min-w-[30rem] flex-grow justify-between items-center pb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="animate-pulse flex flex-col gap-4 items-start w-full">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="flex gap-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
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
      className="relative flex flex-row gap-6 border-2 rounded-lg p-6 min-w-[30rem] flex-grow justify-between items-center pb-8 cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 dark:border-gray-700"
      onClick={onClick}
    >
      <div className="flex flex-col gap-4 items-start">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Daily Challenge
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: challenge.difficulty }).map((_, i) => (
              <FaStar key={i} className="text-yellow-400" />
            ))}
          </div>
        </div>
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{challenge.title}</span>
        <p className="w-[24rem] text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{challenge.question}</p>
        <div className="flex flex-row gap-6">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full shadow-sm">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-gray-900 dark:text-gray-100">{challenge.difficulty * 20} MC</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full shadow-sm">
            <FaFileCode className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-gray-100">Arrays</span>
          </div>
        </div>
      </div>
      <img
        src={DailyChallengeImage}
        alt="Daily Challenge"
        className="w-[180px] h-[180px] object-contain dark:brightness-150 dark:contrast-125"
      />
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
