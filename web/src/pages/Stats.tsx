import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Target,
  Zap,
  Trophy,
  Puzzle as PuzzleIcon,
  Star,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

import { achievementService } from '@/services/achievementService';
import { puzzleService } from '@/services/puzzleService';
import { ACHIEVEMENTS } from '@/config/achievements';
import { PUZZLES } from '@/config/puzzles';
import type { AllTimeStats } from '@/types/achievements';

// ---------------- CORE STATS COMPONENT ----------------

const Stats = () => {
  // Load all-time stats once from the service (which already merges defaults)
  const [allTimeStats] = useState<AllTimeStats>(() =>
    achievementService.getAllTimeStats()
  );

  // Convenience aliases from allTimeStats (no extra services for scores)
  const classicScores = allTimeStats.classicHighScores || [];
  const rainbowScores = allTimeStats.rainbowHighScores || [];

  const classicBest = allTimeStats.bestClassicScore || 0;
  const rainbowBest = allTimeStats.bestRainbowScore || 0;
  const classicAverage = allTimeStats.classicAverage || 0;
  const rainbowAverage = allTimeStats.rainbowAverage || 0;

  // ---------- Puzzles + Achievements for Challenges tab ----------

  const puzzleStats = puzzleService.getStats();
  const allPuzzleProgress = puzzleService.getAllProgress();
  const achievementProgress = achievementService.getAchievementProgress();

  const unlockedAchievements = ACHIEVEMENTS.filter(
    (a) => achievementProgress[a.id]?.unlocked
  );

  const completedPuzzleEntries = Object.entries(allPuzzleProgress).filter(
    ([, progress]) => progress.isCompleted
  );

  // ---------- Score distributions ----------

  const buildHistogram = (
    scores: number[],
    buckets: { label: string; min: number; max: number | null }[],
  ) => {
    return buckets.map(bucket => {
      const count = scores.filter(score => {
        const aboveMin = score >= bucket.min;
        const belowMax = bucket.max === null ? true : score <= bucket.max;
        return aboveMin && belowMax;
      }).length;
      return { label: bucket.label, count };
    });
  };

  // Classic: up to 400+
  const classicBuckets = [
    { label: '<100', min: 0, max: 99 },
    { label: '100–149', min: 100, max: 149 },
    { label: '150–199', min: 150, max: 199 },
    { label: '200–249', min: 200, max: 249 },
    { label: '250–299', min: 250, max: 299 },
    { label: '300–349', min: 300, max: 349 },
    { label: '350–399', min: 350, max: 399 },
    { label: '400+', min: 400, max: null },
  ];

  // Rainbow: up to 600+
  const rainbowBuckets = [
    { label: '<200', min: 0, max: 199 },
    { label: '200–249', min: 200, max: 249 },
    { label: '250–299', min: 250, max: 299 },
    { label: '300–349', min: 300, max: 349 },
    { label: '350–399', min: 350, max: 399 },
    { label: '400–449', min: 400, max: 449 },
    { label: '450–499', min: 450, max: 499 },
    { label: '500–549', min: 500, max: 549 },
    { label: '550–599', min: 550, max: 599 },
    { label: '600+', min: 600, max: null },
  ];

  const classicScoreDist = buildHistogram(classicScores, classicBuckets);
  const rainbowScoreDist = buildHistogram(rainbowScores, rainbowBuckets);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subtext,
  }: {
    icon: any;
    label: string;
    value: React.ReactNode;
    subtext?: string;
  }) => (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtext && (
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
          )}
        </div>
      </div>
    </Card>
  );

  const formatDateShort = (value?: string | null) =>
    value ? new Date(value).toLocaleDateString() : '—';

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto p-4 pt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Player Stats
          </h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="classic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classic">Classic</TabsTrigger>
            <TabsTrigger value="rainbow">Rainbow</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>

          {/* ---------------- CLASSIC ---------------- */}
          <TabsContent value="classic" className="space-y-4">
            <div className="grid gap-4">
              <StatCard
                icon={Target}
                label="Games Completed"
                value={allTimeStats.classicGamesCompleted || 0}
              />

              <StatCard
                icon={TrendingUp}
                label="Best Score"
                value={classicBest}
                subtext={
                  classicBest >= 300
                    ? 'Legendary!'
                    : classicBest >= 250
                    ? 'Excellent!'
                    : classicBest > 0
                    ? 'Keep going!'
                    : undefined
                }
              />

              <StatCard
                icon={BarChart3}
                label="Average Score"
                value={classicAverage}
              />

              <StatCard
                icon={Zap}
                label="Total Yahtzees"
                value={allTimeStats.totalYahtzeesInClassic || 0}
                subtext="Lifetime Classic Yahtzees"
              />
            </div>

            {/* Detailed Classic Stats */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Detailed Statistics
              </h3>
              <div className="space-y-3">
                <Item
                  label="Total Classic Games"
                  value={allTimeStats.classicGamesCompleted}
                />
                <Item
                  label="Best Classic Score"
                  value={allTimeStats.bestClassicScore || classicBest}
                />
                <Item
                  label="Upper Bonuses Earned"
                  value={allTimeStats.upperBonusesEarned}
                />
                <Item
                  label="3-of-a-Kind 20+ Scores"
                  value={allTimeStats.threeOfKind20Plus}
                />
                <Item
                  label="4-of-a-Kind 25+ Scores"
                  value={allTimeStats.fourOfKind25Plus}
                />
                <Item
                  label="Both Straights in Game"
                  value={allTimeStats.straightShooterGames}
                />
                <Item
                  label="Games with 275+ Score"
                  value={allTimeStats.classic275PlusGames}
                />
              </div>
            </Card>

            {/* Score Distribution (Classic) */}
            {classicScores.length > 0 && (
              <ScoreDistributionCard
                title="Score Distribution"
                data={classicScoreDist}
              />
            )}
          </TabsContent>

          {/* ---------------- RAINBOW ---------------- */}
          <TabsContent value="rainbow" className="space-y-4">
            <div className="grid gap-4">
              <StatCard
                icon={Target}
                label="Games Completed"
                value={allTimeStats.rainbowGamesCompleted || 0}
              />

              <StatCard
                icon={TrendingUp}
                label="Best Score"
                value={rainbowBest}
                subtext={
                  rainbowBest >= 500
                    ? 'Rainbow Master!'
                    : rainbowBest >= 400
                    ? 'Colorful!'
                    : rainbowBest > 0
                    ? 'Keep rolling!'
                    : undefined
                }
              />

              <StatCard
                icon={BarChart3}
                label="Average Score"
                value={rainbowAverage}
              />

              <StatCard
                icon={Zap}
                label="Total Yahtzees"
                value={allTimeStats.totalYahtzeesInRainbow || 0}
                subtext="Lifetime rainbow yahtzees"
              />
            </div>

            {/* Detailed Rainbow Stats */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Detailed Statistics
              </h3>
              <div className="space-y-3">
                <Item
                  label="Total Rainbow Games"
                  value={allTimeStats.rainbowGamesCompleted}
                />
                <Item
                  label="Best Rainbow Score"
                  value={allTimeStats.bestRainbowScore || rainbowBest}
                />
                <Item
                  label="Games with 400+ Score"
                  value={allTimeStats.rainbow400PlusGames}
                />
                <Item
                  label="Average per Game"
                  value={rainbowAverage}
                />
              </div>
            </Card>

            {/* Score Distribution (Rainbow) */}
            {rainbowScores.length > 0 && (
              <ScoreDistributionCard
                title="Score Distribution"
                data={rainbowScoreDist}
              />
            )}
          </TabsContent>

          {/* ---------------- CHALLENGES (Puzzles + Unlocked Achievements) ---------------- */}
          <TabsContent value="challenges" className="space-y-4">
            <div className="grid gap-4">
              <StatCard
                icon={PuzzleIcon}
                label="Puzzles Completed"
                value={`${puzzleStats.completed}/${PUZZLES.length}`}
                subtext={
                  puzzleStats.total > 0
                    ? `${PUZZLES.length - puzzleStats.completed} remaining`
                    : undefined
                }
              />

              <StatCard
                icon={Trophy}
                label="Achievements Unlocked"
                value={`${unlockedAchievements.length}/${ACHIEVEMENTS.length}`}
                subtext={
                  ACHIEVEMENTS.length > 0
                    ? `${Math.round(
                        (unlockedAchievements.length / ACHIEVEMENTS.length) * 100
                      )}% complete`
                    : undefined
                }
              />
            </div>

            {/* Recent Puzzle Completions (only completed puzzles) */}
            {completedPuzzleEntries.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <PuzzleIcon className="w-4 h-4" />
                  Recent Puzzles
                </h3>
                <div className="space-y-2">
                  {completedPuzzleEntries
                    .sort((a, b) => {
                      const dateA = a[1].completedAt
                        ? new Date(a[1].completedAt!).getTime()
                        : 0;
                      const dateB = b[1].completedAt
                        ? new Date(b[1].completedAt!).getTime()
                        : 0;
                      return dateB - dateA;
                    })
                    .slice(0, 5)
                    .map(([puzzleId, progress]) => {
                      const puzzle = PUZZLES.find(p => p.id === puzzleId);
                      if (!puzzle) return null;
                      return (
                        <div
                          key={puzzleId}
                          className="flex justify-between items-center py-2 px-3 rounded-md bg-muted/30"
                        >
                          <div className="mr-3">
                            <p className="text-sm font-medium text-foreground">
                              {puzzle.title}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {puzzle.difficulty} • {puzzle.gameMode}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-foreground">
                              {progress.bestScore ?? '—'}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {progress.attempts} attempt
                              {progress.attempts !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card>
            )}

            {/* Unlocked Achievements only */}
            {unlockedAchievements.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Unlocked Achievements
                </h3>
                <div className="space-y-2">
                  {unlockedAchievements.map(achievement => (
                    <AchievementRow
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </div>
              </Card>
            )}

            {unlockedAchievements.length === 0 &&
              completedPuzzleEntries.length === 0 && (
                <Card className="p-6">
                  <p className="text-sm text-muted-foreground text-center">
                    No challenges completed yet. Play games, solve puzzles, and
                    unlock achievements to fill this page!
                  </p>
                </Card>
              )}
          </TabsContent>
        </Tabs>

        {/* ---------------- OVERALL ---------------- */}
        <Card className="p-6 mt-4 bg-primary/5">
          <h3 className="font-semibold text-foreground mb-4">
            Overall Statistics
          </h3>

          <div className="grid grid-cols-4 gap-4 mb-2">
            <TotalStat
              label="Total Games"
              value={allTimeStats.totalGames}
            />
            <TotalStat
              label="Total Yahtzees"
              value={
                allTimeStats.totalYahtzeesInClassic +
                allTimeStats.totalYahtzeesInRainbow
              }
            />
            <TotalStat
              label="Daily Streak"
              value={allTimeStats.streak}
            />
            <TotalStat
              label="Last Game"
              value={formatDateShort(allTimeStats.lastGameDate)}
            />
          </div>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

/* ---------------- SMALL SUBCOMPONENTS ---------------- */

const Item = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-muted-foreground">{label}</span>
    <Badge variant="secondary">{value == null ? 0 : value}</Badge>
  </div>
);

const TotalStat = ({ label, value }: { label: string; value: any }) => (
  <div className="text-center">
    <p className="text-2xl md:text-3xl font-bold text-foreground">
      {value == null ? 0 : value}
    </p>
    <p className="text-xs text-muted-foreground mt-1">{label}</p>
  </div>
);

const ScoreDistributionCard = ({
  title,
  data,
}: {
  title: string;
  data: { label: string; count: number }[];
}) => (
  <Card className="p-6">
    <h3 className="font-semibold text-foreground mb-4">{title}</h3>

    {data.every(d => d.count === 0) ? (
      <p className="text-sm text-muted-foreground">
        Not enough data yet. Play more games to build your distribution!
      </p>
    ) : (
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <Bar
              dataKey="count"
              fill="var(--primary)"
              radius={[6, 6, 0, 0]}
              animationDuration={700}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </Card>
);

const AchievementRow = ({
  achievement,
}: {
  achievement: (typeof ACHIEVEMENTS)[0];
}) => (
  <div className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
    <div className="text-lg">
      {/* icon can be a ReactNode or string depending on your ACHIEVEMENTS config */}
      {achievement.icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate">
        {achievement.title}
      </p>
      <p className="text-xs text-muted-foreground truncate">
        {achievement.description}
      </p>
    </div>
  </div>
);

// ---------------- WRAPPER WITH CLEAR BUTTON ----------------

const StatsWithClear = () => {
  const navigate = useNavigate();
  return (
    <>
      <Stats />
      <div className="flex justify-center mt-8 mb-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium shadow"
          onClick={() => {
            if (
              globalThis.confirm(
                'Are you sure you want to clear all stats, puzzles, and achievements? This cannot be undone.',
              )
            ) {
              localStorage.removeItem('yahtzee_all_time_stats');
              localStorage.removeItem('yahtzee_achievement_progress');
              localStorage.removeItem('yahtzee_high_scores');
              localStorage.removeItem('yahtzee_puzzle_progress');
              navigate('/');
            }
          }}
        >
          Clear Stats
        </button>
      </div>
    </>
  );
};

export default StatsWithClear;
