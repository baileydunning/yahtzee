import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { achievementEngine } from '@/services/achievementEngine';
import { Trophy, Lock } from 'lucide-react';

const Achievements = () => {
  const achievementsWithProgress = achievementEngine.getAllAchievementsWithProgress();

  // Group achievements by category
  const rainbowAchievements = achievementsWithProgress.filter(a => a.category === 'rainbow');
  const classicAchievements = achievementsWithProgress.filter(a => a.category === 'classic');

  // Calculate stats
  const totalAchievements = achievementsWithProgress.length;
  const unlockedCount = achievementsWithProgress.filter(a => a.progress.unlocked).length;
  const completionPercentage = totalAchievements === 0
    ? 0
    : Math.round((unlockedCount / totalAchievements) * 100);

  type AchievementWithProgress = (typeof achievementsWithProgress)[number];

  const renderAchievementCard = (achievement: AchievementWithProgress) => {
    const isUnlocked = achievement.progress.unlocked;
    const hasProgress = achievement.target && achievement.target > 0;
    const progressValue = hasProgress
      ? (achievement.progress.progress / achievement.target!) * 100
      : 0;

    return (
      <Card
        key={achievement.id}
        className={`p-4 transition-all ${
          isUnlocked
            ? 'bg-accent border-primary/30'
            : 'bg-card border-border opacity-60'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
              isUnlocked ? 'bg-primary/10' : 'bg-muted'
            }`}
          >
            {isUnlocked ? achievement.icon : <Lock className="w-5 h-5 text-muted-foreground" />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-foreground">{achievement.title}</h3>
              {isUnlocked && (
                <Trophy className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {achievement.description}
            </p>

            {/* Progress bar for incremental achievements */}
            {hasProgress && !isUnlocked && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>
                    {achievement.progress.progress} / {achievement.target}
                  </span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
            )}

            {/* Unlock date */}
            {isUnlocked && achievement.progress.unlockedAt && (
              <p className="text-xs text-muted-foreground mt-2">
                Unlocked{' '}
                {new Date(achievement.progress.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto p-4 pt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Achievements
          </h1>
        </div>

        {/* Overall Progress */}
        <Card className="p-6 mb-6 bg-primary/5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Overall Progress
              </h2>
              <p className="text-sm text-muted-foreground">
                {unlockedCount} of {totalAchievements} achievements unlocked
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {completionPercentage}%
            </Badge>
          </div>
          <Progress value={completionPercentage} className="h-3" />
        </Card>

        {/* Achievement Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="rainbow">Rainbow</TabsTrigger>
            <TabsTrigger value="classic">Classic</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {achievementsWithProgress.map(renderAchievementCard)}
          </TabsContent>

          <TabsContent value="rainbow" className="space-y-3">
            {rainbowAchievements.length > 0 ? (
              rainbowAchievements.map(renderAchievementCard)
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No Rainbow achievements yet
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="classic" className="space-y-3">
            {classicAchievements.length > 0 ? (
              classicAchievements.map(renderAchievementCard)
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No Classic achievements yet
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
      {/* Clear Achievements Button */}
      <div className="flex justify-center mt-8 mb-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium shadow"
          onClick={() => {
            if (globalThis.confirm('Are you sure you want to clear all achievement progress? This cannot be undone.')) {
              localStorage.removeItem('yahtzee_achievement_progress');
              globalThis.location.href = '/';
            }
          }}
        >
          Clear Achievements
        </button>
      </div>
    </div>
  );
};

export default Achievements;
