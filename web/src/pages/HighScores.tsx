import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { gameService } from '@/services/gameService';
import { HighScore } from '@/types/game';
import { Trophy, Trash2, Calendar, User } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const HighScoresPage = () => {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [sortByRecent, setSortByRecent] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = () => {
    const allScores = gameService.getHighScores();
    setScores(allScores);
  };

  const getSortedScores = () => {
    if (sortByRecent) {
      return [...scores].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    return [...scores].sort((a, b) => b.score - a.score);
  };

  const handleDelete = (id: string) => {
    gameService.deleteHighScore(id);
    loadScores();
    setDeleteId(null);
    toast({
      title: "Score deleted",
      description: "High score has been removed",
    });
  };

  const handleClearAll = () => {
    gameService.clearHighScores();
    loadScores();
    setShowClearDialog(false);
    toast({
      title: "All scores cleared",
      description: "High scores have been reset",
    });
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
          {scores.length > 0 && (
            <Button 
              onClick={() => setShowClearDialog(true)}
              variant="outline"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {scores.length > 0 && (
          <div className="mb-6 flex gap-2">
            <Button
              onClick={() => setSortByRecent(false)}
              variant={!sortByRecent ? "default" : "outline"}
              size="sm"
            >
              Highest Score
            </Button>
            <Button
              onClick={() => setSortByRecent(true)}
              variant={sortByRecent ? "default" : "outline"}
              size="sm"
            >
              Most Recent
            </Button>
          </div>
        )}

        {scores.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No High Scores Yet</h2>
            <p className="text-muted-foreground">
              Finish a game to see your scores here!
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedScores.map((score, index) => (
              <Card key={score.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 && !sortByRecent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
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
                        {score.playerNames.join(', ')}
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
                  
                  <Button
                    onClick={() => setDeleteId(score.id)}
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Navigation />

      {/* Delete Single Score Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Score?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this score from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Scores?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all high scores. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HighScoresPage;
