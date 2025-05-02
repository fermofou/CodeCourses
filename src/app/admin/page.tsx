import { useState } from "react";
import Navbar from "@/components/navbar";
import Leftbar from "./leftbar";
import Problems from "./problems";
import Users from "./users";
import Medals from "./medals";
import Settings from "./settings";

const General = () => {
  return (
    <>

    </>
  )
}


export default function AdminPage() {
  const [menuOption, setMenuOption] = useState("Problems");
  return (
    <div className="flex h-screen min-h-screen flex-col">
      <Navbar />
      <div className="w-full h-full mx-auto flex justify-start text-center">
        <Leftbar menuOption={menuOption} setMenuOption={setMenuOption} />
        <div className="flex w-full h-full justify-center p-4">
          {/*
         
          { menuOption == "General" && <General /> }
         */}
          {menuOption == "Problems" && <Problems />}
          {menuOption == "Users" && <Users />}
          {menuOption == "Medals" && <Medals />}
          {menuOption == "Settings" && <Settings />}
        </div>
      </div>
    </div>
  );
}
