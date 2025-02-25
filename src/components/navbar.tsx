import { Link } from "react-router-dom"
import { SignedIn, UserButton } from "@clerk/clerk-react"
import { Coins, Trophy } from "lucide-react"

const Navbar = () => {
  return (
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
      <nav className=" items-center space-x-8 text-sm font-medium">
        <Link to="/challenges" className="text-black transition-colors hover:text-primary">
          Retos de Programación
        </Link>
        <Link to="/leaderboard" className="text-black transition-colors hover:text-primary">
          Tabla de Posiciones
        </Link>
        <Link to="/rewards" className="text-black transition-colors hover:text-primary">
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
  )
}

export default Navbar;