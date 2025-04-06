import { useState } from "react";
import { ChevronDown, ChevronRight, Bell, MessageSquare, Settings, Users, Folder, Home, Calendar, Box } from "lucide-react";

const menuItems = [
  { name: "General", icon: <Home size={20} /> },
  { name: "Calendario", icon: <Calendar size={20} /> },
  {
    name: "Problemas",
    icon: <Folder size={20} />, 
    hasSubmenu: true,
    submenu: ["Administrar", "Crear"]
  },
  { name: "Notificaciones", icon: <Bell size={20} /> },
  { name: "Chat", icon: <MessageSquare size={20} />, badge: 8 },
  { name: "Settings", icon: <Settings size={20} /> }
];

export default function Leftbar() {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (name : any) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="w-64 h-full bg-white shadow-md p-4 flex flex-col">
      <div className="mt-4">
        {menuItems.map((item) => (
          <div key={item.name}>
            <div
              className="flex items-center justify-between w-full py-2 px-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => item.hasSubmenu && toggleMenu(item.name)}
            >
              <div className="flex items-center space-x-2">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.hasSubmenu && (openMenus[item.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              {item.badge && (
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            {item.hasSubmenu && openMenus[item.name] && (
              <div className="ml-6">
                {item.submenu.map((sub) => (
                  <div key={sub} className="py-1 px-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                    {sub}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
