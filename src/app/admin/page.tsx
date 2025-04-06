import { useState } from "react";
import Navbar from "@/components/navbar";
import Leftbar from "./leftbar";

import { Select } from 'antd';

interface Problem {
  id: number;
  title: string;
  url: string;
}

const onChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
  console.log('search:', value);
};

export default function AdminPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemUrl, setProblemUrl] = useState("");

  const addProblem = () => {
    if (!problemUrl.trim()) return;

    const id = Date.now();
    const title = problemUrl.split("/").pop() || "Unknown Problem";

    setProblems([...problems, { id, title, url: problemUrl }]);
    setProblemUrl("");
  };

  const removeProblem = (id: number) => {
    setProblems(problems.filter((problem) => problem.id !== id));
  };

  const platformOptions = [
    { value: "cses", label: "CSES" },
    { value: "codeforces", label: "Codeforces" },
    { value: "hackerank", label: "Hackerank" },
    { value: "leetcode", label: "Leetcode" },
  ];

  return (
    <div className="flex h-screen min-h-screen flex-col">
      <Navbar />
      <div className="w-full h-full mx-auto flex justify-start text-center">
        <Leftbar />
        <div className="flex w-full h-full justify-center align-middle">
          <h1 className="text-xl font-bold mb-4">Administrador de Problemas</h1>
        </div>
      </div>
    </div>
  );
}
