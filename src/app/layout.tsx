import { DevelopmentBanner } from "@/components/DevelopmentBanner";
import { ThemeProvider } from "@/components/theme-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col">
        <DevelopmentBanner />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
} 