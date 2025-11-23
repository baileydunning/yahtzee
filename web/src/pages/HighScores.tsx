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
  const [modeFilter, setModeFilter] = useState<'classic' | 'rainbow' | 'all'>('all');
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
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">High Scores</h1>
          </div>
          {lastGameScore && (
            <Card
              className={`p-3 flex flex-col items-end min-w-[180px] bg-muted ${lastGameScore.scorecard ? 'cursor-pointer' : ''}`}
              onClick={() => lastGameScore.scorecard && setSelectedScore(lastGameScore)}
            >
              <div className="text-md text-muted-foreground mb-1">Last Game</div>
              <div className="font-bold text-lg text-foreground">{lastGameScore.score}</div>
              <div className="text-xs text-muted-foreground">{lastGameScore.mode === 'classic' ? 'Classic' : 'Rainbow'} Mode</div>
              <div className="text-xs text-muted-foreground">{(lastGameScore.playerNames || []).join(', ')}
              </div>
              <div className="text-xs text-muted-foreground">{formatDate(lastGameScore.date)}</div>
            </Card>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size={64} />
            <span className="text-muted-foreground text-lg">Loading scores…</span>
          </div>
        ) : (
          <>
            {scores.length > 0 && (
              <div className="mb-6 flex gap-2">
                <Button
                  onClick={() => setModeFilter('all')}
                  variant={modeFilter === 'all' ? "default" : "outline"}
                  size="sm"
                >
                  All Modes
                </Button>
                <Button
                  onClick={() => setModeFilter('classic')}
                  variant={modeFilter === 'classic' ? "default" : "outline"}
                  size="sm"
                >
                  Classic Only
                </Button>
                <Button
                  onClick={() => setModeFilter('rainbow')}
                  variant={modeFilter === 'rainbow' ? "default" : "outline"}
                  size="sm"
                >
                  Rainbow Only
                </Button>
              </div>
            )}

            {sortedScores.length === 0 ? (
              <Card className="p-12 text-center">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No High Scores</h2>
                <p className="text-muted-foreground">
                  {modeFilter === 'all'
                    ? 'Finish a game to see your scores here!'
                    : `No scores for ${modeFilter === 'classic' ? 'Classic' : 'Rainbow'} mode yet.`}
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {sortedScores.slice(0, 10).map((score, index) => (
                      <Card
                        key={score.id}
                        className={`p-4 hover:shadow-md transition-shadow ${score.scorecard ? 'cursor-pointer' : ''}`}
                        onClick={() => score.scorecard && setSelectedScore(score)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-bold text-xl text-foreground">{score.score}</div>
                                <div className="text-sm text-muted-foreground">
                                  {score.mode === 'classic' ? 'Classic' : 'Rainbow'} Mode
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground ml-11">
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
                              <p className="text-sm text-muted-foreground mt-2 ml-11">{score.note}</p>
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
