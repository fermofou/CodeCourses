import { AlertTriangle } from 'lucide-react';
import underConstruction from '../assets/underContruction.png';

export const DevelopmentBanner = () => {
  return (
    <div className="w-full bg-yellow-400/20 dark:bg-yellow-400/10 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
        <span className="text-yellow-800 dark:text-yellow-600 font-medium">This site is under development</span>
      </div>
      <img
        src={underConstruction}
        alt="Under Construction"
        className="h-8 w-auto"
      />
    </div>
  );
}; 