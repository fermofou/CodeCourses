"use client";

interface LeftBarProps {
  activeView: "items" | "purchases" | "favorites";
  onViewChange: (view: "items" | "purchases" | "favorites") => void;
}

export default function LeftBar({ activeView, onViewChange }: LeftBarProps) {
  const navItems = [
    { id: "items" as const, label: "Items" },
    { id: "purchases" as const, label: "My purchases" },
    // { id: "favorites" as const, label: "My favorites" },
  ];

  return (
    <nav className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Rewards</h2>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
            activeView === item.id
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
