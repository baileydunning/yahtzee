import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { gameService } from '@/services/gameService';
import { HighScore } from '@/types/game';
import { Trophy, Calendar, User } from 'lucide-react';
import { ScoreDetailsModal } from '@/components/ScoreDetailsModal';
import { Spinner } from '@/components/ui/spinner';

const HighScoresPage = () => {
  const [selectedScore, setSelectedScore] = useState<HighScore | null>(null);
  const [scores, setScores] = useState<HighScore[]>([]);
  const [modeFilter, setModeFilter] = useState<'classic' | 'rainbow' | 'all' | 'recent'>('all');
  const [lastGameScore, setLastGameScore] = useState<HighScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      const allScores = await gameService.getHighScores();
      setScores(allScores);
      setLoading(false);
    };
    fetchScores();
    // Load last game score from localStorage
    const lastScoreRaw = localStorage.getItem('yahtzee_last_game_score');
    if (lastScoreRaw) {
      try {
        setLastGameScore(JSON.parse(lastScoreRaw));
      } catch {}
    }
  }, []);

const getSortedScores = () => {
  if (modeFilter === 'recent') {
    // Only sort by date descending
    return [...scores].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  let filtered = scores;
  if (modeFilter !== 'all') {
    filtered = scores.filter(s => s.mode === modeFilter);
  }
  return [...filtered].sort((a, b) => b.score - a.score);
};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const sortedScores = getSortedScores();

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto p-2 pt-4 sm:p-4 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">High Scores</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size={64} />
            <span className="text-muted-foreground text-lg">Loading scores…</span>
          </div>
        ) : (
          <>
            {scores.length > 0 && (
              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-2">
                <Button
                  onClick={() => setModeFilter('all')}
                  variant={modeFilter === 'all' ? "default" : "outline"}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  All Modes
                </Button>
                <Button
                  onClick={() => setModeFilter('classic')}
                  variant={modeFilter === 'classic' ? "default" : "outline"}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Classic Only
                </Button>
                <Button
                  onClick={() => setModeFilter('rainbow')}
                  variant={modeFilter === 'rainbow' ? "default" : "outline"}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Rainbow Only
                </Button>
                <Button
                  onClick={() => setModeFilter('recent')}
                  variant={modeFilter === 'recent' ? "default" : "outline"}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Most Recent
                </Button>
              </div>
            )}

            {sortedScores.length === 0 ? (
              <Card className="p-12 text-center">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No High Scores</h2>
                <p className="text-muted-foreground">
                  {(() => {
                    if (modeFilter === 'all') return 'Finish a game to see your scores here!';
                    if (modeFilter === 'classic') return 'No scores for Classic mode yet.';
                    if (modeFilter === 'rainbow') return 'No scores for Rainbow mode yet.';
                    if (modeFilter === 'recent') return 'No recent scores yet.';
                    return 'No scores yet.';
                  })()}
                </p>
              </Card>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {sortedScores.slice(0, 10).map((score, index) => (
                      <Card
                        key={score.id}
                        className={`p-2 sm:p-4 hover:shadow-md transition-shadow ${score.scorecard ? 'cursor-pointer' : ''} w-full`}
                        onClick={() => score.scorecard && setSelectedScore(score)}
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold ${
                                index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-bold text-base sm:text-xl text-foreground">{score.score}</div>
                                <div className="text-xs sm:text-sm text-muted-foreground">
                                  {score.mode === 'classic' ? 'Classic' : 'Rainbow'} Mode
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground ml-8 sm:ml-11">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {(score.playerNames || []).join(', ')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(score.date)}
                              </div>
                            </div>
                            {score.note && (
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 ml-8 sm:ml-11">{score.note}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                ))}
                <ScoreDetailsModal
                  score={selectedScore}
                  open={!!selectedScore}
                  onOpenChange={open => setSelectedScore(open ? selectedScore : null)}
                />
              </div>
            )}
          </>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default HighScoresPage;
