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
      <h2 className="text-lg font-semibold">Rewards</h2>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
            activeView === item.id
              ? "bg-gray-100 font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
