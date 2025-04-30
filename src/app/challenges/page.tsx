import { FaStar, FaCheck, FaTrophy, FaTimes } from "react-icons/fa";
import { FaFileCode, FaShareFromSquare } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "antd";
import { Trophy, Coins } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { Tag as AntdTag } from "antd";
import DuoImage from "./DuoMissing.png";
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
  name: string;
  points: number;
  difficulty: number;
  description: string;
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
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_: unknown, { tags }: ProblemsTableType) => (
      <>
        {tags &&
          tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "tag") {
              color = "volcano";
            }
            return (
              <AntdTag color={color} key={tag}>
                {tag}
              </AntdTag>
            );
          })}
      </>
    ),
  },
  {
    title: "Difficulty",
    dataIndex: "difficulty",
    key: "difficulty",
    render: (_, { difficulty }) => (
      <div className="flex items-center gap-2">
        {Array.from({ length: difficulty }).map((_, i) => (
          <FaStar key={i} />
        ))}
      </div>
    ),
  },
];

const dailyChallenge: ProblemOverviewType = {
  id: 0,
  name: "Duo has disappeared!",
  points: 30,
  difficulty: 3,
  description:
    "Duo ha desaparecido, pero ha dejado un rastro de su paso. Ayúdanos a encontrarlo reconstryendo el camino que ha seguido.",
};

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
  return (
    <div
      className="relative flex flex-row gap-4 border-2 rounded-lg p-4 min-w-[30rem] flex-grow justify-center items-center pb-7 cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute bottom-0 left-0 bg-white text-xs px-2 py-1 ">
        Daily Challenge
      </div>
      <div className="flex flex-col gap-3 items-center">
        <span className="text-xl font-bold">{dailyChallenge.name}</span>
        <p className="w-[20rem] text-justify">{dailyChallenge.description}</p>
        <div className="flex flex-row gap-8">
          <div className="flex items-center gap-2">
            {Array.from({ length: dailyChallenge.difficulty }).map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="font-medium">{dailyChallenge.points} MC</span>
          </div>
        </div>
      </div>
      <img src={DuoImage} alt="imageDuo" className="w-[120px]" />
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

const DailyMissions = () => {
  const dailyMissions = [
    {
      icon: <FaCheck />,
      name: "Inicia sesión",
      progress: 100,
      color: "#4CAF50",
    },
    {
      icon: <FaFileCode />,
      name: "Resuelve un problema",
      progress: 100,
      color: "#2196F3",
    },
    {
      icon: <FaShareFromSquare />,
      name: "Comparte dos problemas",
      progress: 50,
      color: "#FF9800",
    },
  ];

  return (
    <div className="relative flex flex-col gap-4 border-2 rounded-lg p-4 min-w-[22rem] flex-grow justify-center pb-7">
      <div className="absolute bottom-0 left-0 bg-white text-xs px-2 py-1 ">
        Misiones Diarias
      </div>
      {dailyMissions.map((mission, index) => (
        <Mission
          key={index}
          icon={mission.icon}
          name={mission.name}
          progress={mission.progress}
          color={mission.color}
        />
      ))}
    </div>
  );
};

const WeeklyMissions = () => {
  const weeklyMissions = [
    {
      icon: <FaCheck />,
      name: "Inicia sesión 5 días",
      progress: 80,
      color: "#F44336",
    },
    {
      icon: <FaFileCode />,
      name: "Resuelve 5 problemas",
      progress: 50,
      color: "#3F51B5",
    },
    {
      icon: <FaTrophy />,
      name: "Gana un torneo",
      progress: 100,
      color: "#FED91C",
    },
  ];

  return (
    <div className="relative flex flex-col gap-4 border-2 rounded-lg p-4 min-w-[22rem] max-w-[45rem] flex-grow justify-center pb-7">
      <div className="absolute bottom-0 left-0 bg-white text-xs px-2 py-1 ">
        Misiones Semanales
      </div>
      {weeklyMissions.map((mission, index) => (
        <Mission
          key={index}
          icon={mission.icon}
          name={mission.name}
          progress={mission.progress}
          color={mission.color}
        />
      ))}
    </div>
  );
};

export default function ChallengesPage() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<ProblemsTableType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    // Handle loading state
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
              navigate("/challenge");
            }}
          />
          <DailyMissions />
          <WeeklyMissions />
        </div>
        <Gym problems={problems} />
      </div>
    </div>
  );
}
