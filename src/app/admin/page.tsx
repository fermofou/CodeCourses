import { useState } from "react";
import Navbar from "@/components/navbar";
import Leftbar from "./leftbar";
import Problems from "./problems";
import Users from "./users";
import Medals from "./medals";
import Settings from "./settings";
import AdminDashboard from "./dashboard";

export default function AdminPage() {
  const [menuOption, setMenuOption] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Leftbar menuOption={menuOption} setMenuOption={setMenuOption} />
        <div className="flex-1 p-8">
          {menuOption === "Dashboard" && <AdminDashboard />}
          {menuOption === "Problems" && <Problems />}
          {menuOption === "Users" && <Users />}
          {menuOption === "Medals" && <Medals />}
          {menuOption === "Settings" && <Settings />}
        </div>
      </div>
    </div>
  );
}
