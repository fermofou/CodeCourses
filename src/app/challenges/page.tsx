import { FaStar } from "react-icons/fa"
import { Link } from "react-router-dom"
import { Table, Tag } from "antd" 
import { SignedIn, UserButton } from "@clerk/clerk-react"
import { Trophy,  Coins } from "lucide-react"
import type { TableProps } from 'antd';

interface ProblemsTableType {
  key: number;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const dataSource = Array.from<ProblemsTableType>({ length: 46 }).map<ProblemsTableType>((_, i) => ({
  key: i,
  name: `Problema ${i + 1}`,
  age: 20 + (i % 10),
  address: `Calle ${i + 1}`,
  tags: ['nice', 'developer'],
}));

const columns: TableProps<ProblemsTableType>['columns'] = [
  {
    title: 'Nombre del problema',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Dificultad',
    key: 'difficulty',
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

const WeeklyChallenge = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <span className="text-xl font-bold">Desafío Semanal</span>
      <div className="flex flex-row gap-5 flex-wrap justify-center align-center">
        <ChallengeButton color="#77FF76" completed={false}/>
        <ChallengeButton color="#AAAAFF" completed={false}/>
        <ChallengeButton color="#FC88FF" completed={false}/>
        <ChallengeButton color="#FDBB55" completed={false}/>
        <ChallengeButton color="#FB3333" completed={false}/>
      </div>
    </div>
  )
}

const Gym = () => {
  return (
    <Table<ProblemsTableType> pagination={{pageSize: 5}} dataSource={dataSource} columns={columns} />
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
        <WeeklyChallenge />
        <Gym />
      </div>

    </div>
  );
}
