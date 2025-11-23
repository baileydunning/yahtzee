import React from 'react';
import { Progress } from './ui/progress';

interface AchievementProgressBarProps {
  progress: number;
  target: number;
  label?: string;
}

export const AchievementProgressBar: React.FC<AchievementProgressBarProps> = ({ progress, target, label }) => {
  const percent = Math.min(100, Math.round((progress / target) * 100));
  return (
    <div className="w-full">
      {label && <div className="mb-1 text-xs text-muted-foreground">{label}</div>}
      <Progress value={percent} className="h-2" />
      <div className="flex justify-between text-xs mt-1 text-muted-foreground">
        <span>{progress.toLocaleString()} / {target.toLocaleString()}</span>
        <span>{percent}%</span>
      </div>
    </div>
  );
};
