import { JSX, useState } from "react";
import { Settings, Users, Folder, Award, Home, CodeXml } from "lucide-react";

interface MenuItem {
  name: string;
  icon: JSX.Element;
  badge?: string; // Opcional, en caso de que quieras agregar un badge en el futuro
}

const menuItems: MenuItem[] = [
  // { name: "General", icon: <Home size={20} /> },
  { name: "Problems", icon: <CodeXml size={20} /> },
  { name: "Users", icon: <Users size={20} /> },
  { name: "Medals", icon: <Award size={20} /> },
  { name: "Settings", icon: <Settings size={20} /> }
];

interface LeftbarProps {
  setMenuOption: React.Dispatch<React.SetStateAction<string>>;
  menuOption: string;
}

export default function Leftbar({ setMenuOption, menuOption }: LeftbarProps) {
  return (
    <div className="w-64 h-full bg-white shadow-md p-4 flex flex-col">
      <div className="mt-4">
        {menuItems.map((item) => (
          <div key={item.name} onClick={() => setMenuOption(item.name)} className="cursor-pointer">
            <div
              className={`flex items-center justify-between w-full py-2 px-2 rounded-md ${menuOption === item.name
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <div className="flex items-center space-x-2">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
