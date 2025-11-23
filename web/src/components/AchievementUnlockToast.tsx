import { Achievement } from '@/types/achievements';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface AchievementUnlockToastProps {
  achievement: Achievement;
}

export const AchievementUnlockToast = ({ achievement }: AchievementUnlockToastProps) => {
  return (
    <Card className="p-4 border-2 border-primary bg-background shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <Trophy className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{achievement.icon}</span>
            <h3 className="font-bold text-foreground text-sm">Achievement Unlocked!</h3>
          </div>
          <p className="font-semibold text-foreground">{achievement.title}</p>
          <p className="text-xs text-muted-foreground">{achievement.description}</p>
        </div>
      </div>
    </Card>
  );
};
