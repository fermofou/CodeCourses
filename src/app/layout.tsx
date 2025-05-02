import { DevelopmentBanner } from "@/components/DevelopmentBanner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DevelopmentBanner />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 