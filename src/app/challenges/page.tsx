import { FaStar, FaCheck, FaTrophy } from "react-icons/fa"
import { FaFileCode, FaShareFromSquare } from "react-icons/fa6";
import { Link } from "react-router-dom"
import { Table } from "antd"
import { SignedIn, UserButton } from "@clerk/clerk-react"
import { Trophy,  Coins } from "lucide-react"
import type { ColumnsType } from 'antd/es/table'
import { Tag as AntdTag } from 'antd'
import DuoImage from "./DuoMissing.png"
import Navbar from "@/components/navbar";

interface ProblemsTableType {
  key: number;
  status: boolean;
  name: string;
  points: number;
  difficulty: number;
  tags: string[];
}

interface ProblemOverviewType {
  name: string;
  points: number;
  difficulty: number;
  description: string;
}

const dataSource = Array.from<ProblemsTableType>({ length: 80 }).map<ProblemsTableType>((_, i) => ({
  key: i,
  status: (i % 6) < 3,
  name: `Problema ${i + 1}`,
  points: 20 + (i % 10),
  difficulty: (i % 5) + 1,
  tags: ['nice', 'developer', 'tag'],
}));

const columns: ColumnsType<ProblemsTableType> = [
  {
    title: 'Estatus',
    dataIndex: 'status',
    key: 'status',
    render: (_, { status }) => (
      <>
      { status && (
        <DifficultyTag completed={status} />
      )}
      </>
    )
  }, 
  {
    title: 'Problema',
    dataIndex: 'name',
    key: 'name',
    render: (_, { name, status }) => (
      <Link 
        to="/challenge"
        className="hover:underline"
        style={{ color: status ? "#2CBA5A" : "black"}} 
      >
          {name}
      </Link> 
    )
  },
  {
    title: 'Puntos',
    dataIndex: 'points',
    key: 'points',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_: unknown, { tags }: ProblemsTableType) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'tag') {
            color = 'volcano';
          }
          return (
            <AntdTag color={color} key={tag}> {tag} </AntdTag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Dificultad',
    dataIndex: 'difficulty',
    key: 'difficulty',
    render: (_, { difficulty }) => (
      <div className="flex items-center gap-2">
        {
          Array.from({ length: difficulty }).map((_, i) => (
            <FaStar key={i} />  )) 
        }
      </div>
    )
  },
];

const dailyChallenge: ProblemOverviewType = {
  name: "¡Duo ha desaparecido!",
  points: 30,
  difficulty: 3,
  description: "Duo ha desaparecido, pero ha dejado un rastro de su paso. Ayúdanos a encontrarlo reconstryendo el camino que ha seguido."
}

const ChallengeButton = ({ color, completed } : {color : string, completed : boolean, children? : any}) => {
  return (
    <div
      style={{ borderColor: completed ? "gray" : color}}
      className={`rounded-full border-[5px] min-w-[5.5rem] min-h-[5.5rem] flex justify-center items-center`}>
      <div
      style={{ backgroundColor: completed ? "gray" : color}}
      className={`min-w-[4.2rem] min-h-[4.2rem] rounded-full flex justify-center items-center font-bold`} 
      >
        <FaStar size={40} color="white"/>
      </div> 
    </div>
  );
};
const DifficultyTag = ({ completed } : {completed : boolean }) => {
  // Difficulty is a number between 1 and 5
  return (
      <div
      style={{backgroundColor: !completed ? "gray" : "#2DBB5C  "}}
      className={`min-w-[1.4rem] min-h-[1.4rem] max-w-[1.4rem] max-h-[1.4rem] rounded-full flex justify-center items-center font-bold`} 
      >
        {completed && (
          <FaCheck size={13} color="white"/>
        )}
        {!completed && (
          <FaStar size={13} color="white"/>
        )}
      </div> 
  );
};

const Gym = () => {
  return (
    <div className="flex flex-col min-w-[40rem] flex-grow gap-4" >
      <span className="text-xl font-bold">Todos los problemas</span>
      <Table<ProblemsTableType> pagination={{pageSize: 8, showSizeChanger: false}} dataSource={dataSource} columns={columns} />
    </div>
  )
}

const DailyChallenge = () => {
  return (
      <div className="relative flex flex-row gap-4 border-2 rounded-lg p-4 min-w-[30rem] flex-grow justify-center items-center pb-7">
        <div className="absolute bottom-0 left-0 bg-white text-xs px-2 py-1 ">
          Desafío Diario
        </div>
        <div className="flex flex-col gap-3 items-center">
          <span className="text-xl font-bold">{dailyChallenge.name}</span>
          <p className="w-[20rem] text-justify">
        {dailyChallenge.description}
          </p>
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
        <img src={DuoImage} alt="imageDuo" className="w-[120px]"/> 
      </div>
  )
}
const Mission = ({ icon, name, progress, color }: { icon: any, name: string, progress: number, color?: string }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-grow">
        <div className="font-medium">{name}</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="h-2.5 rounded-full" style={{ width: `${progress}%`, backgroundColor: color || 'blue' }}></div>
        </div>
      </div>
    </div>
  );
};

const DailyMissions = () => {
  const dailyMissions = [
    { icon: <FaCheck />, name: "Inicia sesión", progress: 100, color: "#4CAF50" },
    { icon: <FaFileCode />, name: "Resuelve un problema", progress: 100, color: "#2196F3" },
    { icon: <FaShareFromSquare />, name: "Comparte dos problemas", progress: 50, color: "#FF9800" },
  ];

  return (
    <div className="relative flex flex-col gap-4 border-2 rounded-lg p-4 min-w-[22rem] flex-grow justify-center pb-7">
      <div className="absolute bottom-0 left-0 bg-white text-xs px-2 py-1 ">
        Misiones Diarias 
      </div>
      {dailyMissions.map((mission, index) => (
        <Mission key={index} icon={mission.icon} name={mission.name} progress={mission.progress} color={mission.color} />
      ))}
    </div>
  );
};

const WeeklyMissions = () => {
  const weeklyMissions = [
    { icon: <FaCheck />, name: "Inicia sesión 5 días", progress: 80, color: "#F44336" },
    { icon: <FaFileCode />, name: "Resuelve 5 problemas", progress: 50, color: "#3F51B5" },
    { icon: <FaTrophy />, name: "Gana un torneo", progress: 100, color: "#FED91C" },
  ];

  return (
    <div className="relative flex flex-col gap-4 border-2 rounded-lg p-4 min-w-[22rem] max-w-[45rem] flex-grow justify-center pb-7">
      <div className="absolute bottom-0 left-0 bg-white text-xs px-2 py-1 ">
        Misiones Semanales 
      </div>
      {weeklyMissions.map((mission, index) => (
        <Mission key={index} icon={mission.icon} name={mission.name} progress={mission.progress} color={mission.color} />
      ))}
    </div>
  );
};

export default function ChallengesPage() {
  return (
    <div className="flex w-full h-screen flex-col justify-start"> 
      <Navbar/>
      <div className="flex flex-col h-full w-full justify-start gap-8 overflow-auto p-6">
        <div className="flex gap-4 flex-wrap justify-center">
          <DailyChallenge />
          <DailyMissions />  
          <WeeklyMissions />  
        </div>
        <Gym />
      </div>

    </div>
  );
}
