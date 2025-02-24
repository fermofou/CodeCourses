import { FaStar, FaCheck } from "react-icons/fa"
import { Link } from "react-router-dom"
import { Table, Tag } from "antd" 
import { SignedIn, UserButton } from "@clerk/clerk-react"
import { Trophy,  Coins } from "lucide-react"
import type { TableProps } from 'antd';

interface ProblemsTableType {
  key: number;
  status: boolean;
  name: string;
  points: number;
  difficulty: number;
  tags: string[];
}

const dataSource = Array.from<ProblemsTableType>({ length: 46 }).map<ProblemsTableType>((_, i) => ({
  key: i,
  status: (i % 6) < 3,
  name: `Problema ${i + 1}`,
  points: 20 + (i % 10),
  difficulty: (i % 5) + 1,
  tags: ['nice', 'developer'],
}));

const columns: TableProps<ProblemsTableType>['columns'] = [
  {
    title: 'Estatus',
    dataIndex: 'status',
    key: 'status',
    render: (_, { status }) => (
      <DifficultyTag completed={status} />
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
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
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
            <FaStar />  )) 
        }
      </div>
    )
  },

];

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

const WeeklyChallenge = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <span className="text-xl font-bold">Desafío Semanal</span>
      <div className="flex flex-row gap-5 flex-wrap justify-center align-center">
      </div>
    </div>
  )
}

const Gym = () => {
  return (
    <>
      <span className="text-xl font-bold">Todos los problemas</span>
      <Table<ProblemsTableType> pagination={{pageSize: 5}} dataSource={dataSource} columns={columns} />
    </>
  )
}

export default function ChallengesPage() {
  return (
    <div className="flex w-full h-screen flex-col justify-start"> 
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
        <div className="container flex h-14 items-center justify-between">
          {/* Logo section */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 border border-black rounded-md">
                <div className="flex items-center">
                  <span className="text-[#6D6C71] text-lg font-bold leading-none">T</span>
                  <span className="text-[#ED2831] text-lg font-bold leading-none">M</span>
                </div>
              </div>
            </Link>
            <div className="h-4 w-px bg-border" />
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="/challenges" className="text-black transition-colors hover:text-primary">
              Retos de Programación
            </Link>
            <Link to="#leaderboard" className="text-black transition-colors hover:text-primary">
              Tabla de Posiciones
            </Link>
            <Link to="#rewards" className="text-black transition-colors hover:text-primary">
              Recompensas
            </Link>
          </nav>
          
          {/* User Section */}
          <SignedIn>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">2,500 MC</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Nivel 12</span>
                </div>
              </div>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full ring-2 ring-primary/10 hover:ring-primary/30 transition-all",
                    userButtonTrigger: "ring-0 outline-0"
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      </header>

      <div className="flex flex-col w-full h-full items-center justify-center gap-4">
        <Gym />
      </div>

    </div>
  );
}
