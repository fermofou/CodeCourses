import { useState } from "react";
import Navbar from "@/components/navbar";
import Leftbar from "./leftbar";
import Problems from "./problems";
import Users from "./users";
import Settings from "./settings";
import CalendarTab from "./calendar";

const General = () => {
  return (
    <>

    </>
  )
}


export default function AdminPage() {
  const [menuOption, setMenuOption] = useState("General");
  return (
    <div className="flex h-screen min-h-screen flex-col">
      <Navbar />
      <div className="w-full h-full mx-auto flex justify-start text-center">
        <Leftbar menuOption={menuOption} setMenuOption={setMenuOption}/>
        <div className="flex w-full h-full justify-center p-4">
          { menuOption == "General" && <General /> }
          { menuOption == "Calendario" && <CalendarTab /> }
          { menuOption == "Problemas" && <Problems /> }
          { menuOption == "Usuarios" && <Users /> }
          { menuOption == "Configuración" && <Settings /> }
        </div>
      </div>
    </div>
  );
}
