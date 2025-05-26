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
    <aside className="w-64 border-r p-4">
      <div className="space-y-8">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Rewards</h2>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left hover:bg-gray-100 ${
                  activeView === item.id
                    ? "bg-gray-100 font-medium text-black"
                    : "text-black"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
