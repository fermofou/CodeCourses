import { JSX, useState } from "react";
import {
  Settings,
  Users,
  Folder,
  Award,
  Home,
  CodeXml,
  LayoutDashboard,
  Target,
  Trophy,
  ShoppingCart,
} from "lucide-react";

interface MenuItem {
  name: string;
  icon: JSX.Element;
  badge?: string; // Opcional, en caso de que quieras agregar un badge en el futuro
}

const menuItems: MenuItem[] = [
  // { name: "General", icon: <Home size={20} /> },
  { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Problems", icon: <Target className="w-5 h-5" /> },
  { name: "Users", icon: <Users className="w-5 h-5" /> },
  { name: "Medals", icon: <Trophy className="w-5 h-5" /> },
  { name: "Claims", icon: <ShoppingCart className="w-5 h-5" /> },
];

interface LeftbarProps {
  setMenuOption: React.Dispatch<React.SetStateAction<string>>;
  menuOption: string;
}

export default function Leftbar({ setMenuOption, menuOption }: LeftbarProps) {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 p-4">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setMenuOption(item.name)}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              menuOption === item.name
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
