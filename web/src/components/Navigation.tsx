import { Home, Trophy, Award, BarChart3 } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

export const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50 md:relative md:border-0 md:shadow-none md:bg-transparent">
      <div className="flex justify-around md:justify-center md:gap-2 py-3 px-2">
        <NavLink
          to="/"
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors hover:bg-accent text-muted-foreground"
          activeClassName="!bg-primary !text-primary-foreground"
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Game</span>
        </NavLink>
        
        <NavLink
          to="/high-scores"
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors hover:bg-accent text-muted-foreground"
          activeClassName="!bg-primary !text-primary-foreground"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-xs font-medium">Scores</span>
        </NavLink>
        
        <NavLink
          to="/stats"
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors hover:bg-accent text-muted-foreground"
          activeClassName="!bg-primary !text-primary-foreground"
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs font-medium">Stats</span>
        </NavLink>
        
        <NavLink
          to="/achievements"
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors hover:bg-accent text-muted-foreground"
          activeClassName="!bg-primary !text-primary-foreground"
        >
          <Award className="w-5 h-5" />
          <span className="text-xs font-medium">Achievements</span>
        </NavLink>
      </div>
    </nav>
  );
};
