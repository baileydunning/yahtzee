import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Puzzle, PuzzleProgress } from '@/types/puzzle';
import { CheckCircle, XCircle, RotateCcw, ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PuzzleResultModalProps {
  open: boolean;
  puzzle: Puzzle;
  score: number;
  success: boolean;
  progress: PuzzleProgress | null;
  onRetry: () => void;
  onNextPuzzle: () => void;
  onBackToList: () => void;
  hasNextPuzzle: boolean;
}

export const PuzzleResultModal = ({
  open,
  puzzle,
  score,
  success,
  progress,
  onRetry,
  onNextPuzzle,
  onBackToList,
  hasNextPuzzle,
}: PuzzleResultModalProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className={cn(
            'mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center',
            success ? 'bg-green-100' : 'bg-red-100'
          )}>
            {success ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600" />
            )}
          </div>
          <DialogTitle className="text-center text-2xl">
            {success ? 'Puzzle Complete!' : 'Not Quite...'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {puzzle.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Score display */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Your Score</p>
            <p className="text-4xl font-bold text-foreground">{score}</p>
          </div>

          {/* Objective reminder */}
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground mb-1">Objective</p>
            <p className="text-sm font-medium text-foreground">
              {puzzle.objective.description}
            </p>
          </div>

          {/* Mode badge */}
          <div className="flex justify-center">
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              puzzle.gameMode === 'classic' 
                ? 'bg-gray-100 text-gray-800' 
                : 'bg-gradient-to-r from-red-100 via-yellow-100 to-blue-100 text-gray-800'
            )}>
              {puzzle.gameMode === 'classic' ? 'Classic Mode' : '🌈 Rainbow Mode'}
            </span>
          </div>

          {/* Stats */}
          {progress && (
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Best Score</p>
                <p className="text-lg font-semibold text-foreground">
                  {progress.bestScore || score}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Attempts</p>
                <p className="text-lg font-semibold text-foreground">
                  {progress.attempts}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button onClick={onRetry} variant="outline" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button onClick={onBackToList} variant="ghost" className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Back to Puzzle List
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
