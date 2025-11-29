import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { PUZZLES, getDifficultyColor, getDifficultyOrder } from '@/config/puzzles';
import { puzzleService } from '@/services/puzzleService';
import { Puzzle, PuzzleFilterMode, PuzzleSortOption } from '@/types/puzzle';
import {
  Puzzle as PuzzleIcon,
  CheckCircle,
  Play,
  Filter,
  ArrowUpDown,
  ChevronRight,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const PuzzleList = () => {
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState<PuzzleFilterMode>('all');
  const [sortBy, setSortBy] = useState<PuzzleSortOption>('difficulty');
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);
  const [completionFilter, setCompletionFilter] = useState<'all' | 'unsolved' | 'completed'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard' | 'expert'>('all');

  const progress = puzzleService.getAllProgress();

  const filteredAndSortedPuzzles = useMemo(() => {
    let filtered = PUZZLES;

    // Filter by mode
    if (filterMode !== 'all') {
      filtered = filtered.filter((p) => p.gameMode === filterMode);
    }

    // Filter by difficulty
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((p) => p.difficulty === difficultyFilter);
    }

    // Filter by completion status
    if (completionFilter !== 'all') {
      filtered = filtered.filter((p) => {
        const isCompleted = progress[p.id]?.isCompleted;
        if (completionFilter === 'completed') return !!isCompleted;
        if (completionFilter === 'unsolved') return !isCompleted;
        return true;
      });
    }

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'difficulty') {
        return getDifficultyOrder(a.difficulty) - getDifficultyOrder(b.difficulty);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [filterMode, difficultyFilter, sortBy, completionFilter, progress]);

  const stats = useMemo(() => {
    const classicPuzzles = PUZZLES.filter((p) => p.gameMode === 'classic');
    const rainbowPuzzles = PUZZLES.filter((p) => p.gameMode === 'rainbow');

    return {
      total: PUZZLES.length,
      completed: Object.values(progress).filter((p) => p.isCompleted).length,
      classicTotal: classicPuzzles.length,
      classicCompleted: classicPuzzles.filter(
        (p) => progress[p.id]?.isCompleted
      ).length,
      rainbowTotal: rainbowPuzzles.length,
      rainbowCompleted: rainbowPuzzles.filter(
        (p) => progress[p.id]?.isCompleted
      ).length,
    };
  }, [progress]);

  const handlePlayPuzzle = (puzzle: Puzzle) => {
    navigate(`/puzzle/${puzzle.id}`);
  };

  const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString() : '—';

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto p-4 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <Home className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <PuzzleIcon className="w-7 h-7" />
              Puzzle Mode
            </h1>
            <p className="text-muted-foreground text-sm">
              Test your skills with unique challenges
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <Card className="p-4 mb-6 bg-accent/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.completed}/{stats.total}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.classicCompleted}/{stats.classicTotal}
              </p>
              <p className="text-xs text-muted-foreground">Classic</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.rainbowCompleted}/{stats.rainbowTotal}
              </p>
              <p className="text-xs text-muted-foreground">Rainbow</p>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          {/* Mode filter */}
          <Select
            value={filterMode}
            onValueChange={(v) => setFilterMode(v as PuzzleFilterMode)}
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modes</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="rainbow">Rainbow</SelectItem>
            </SelectContent>
          </Select>

          {/* Difficulty filter */}
          <Select
            value={difficultyFilter}
            onValueChange={(v) =>
              setDifficultyFilter(v as 'all' | 'easy' | 'medium' | 'hard' | 'expert')
            }
          >
            <SelectTrigger className="w-[160px]">
              <PuzzleIcon className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>

          {/* Completion status filter */}
          <Select
            value={completionFilter}
            onValueChange={(v) =>
              setCompletionFilter(v as 'all' | 'unsolved' | 'completed')
            }
          >
            <SelectTrigger className="w-[170px]">
              <CheckCircle className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All puzzles</SelectItem>
              <SelectItem value="completed">Solved</SelectItem>
              <SelectItem value="unsolved">Unsolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Puzzle List */}
        <div className="space-y-3">
          {filteredAndSortedPuzzles.map((puzzle) => {
            const puzzleProgress = progress[puzzle.id];
            const isCompleted = puzzleProgress?.isCompleted;

            return (
              <Card
                key={puzzle.id}
                className={cn(
                  'p-4 cursor-pointer transition-all hover:shadow-md',
                  isCompleted && 'border-green-200 bg-green-50/30'
                )}
                onClick={() => setSelectedPuzzle(puzzle)}
              >
                <div className="flex items-center gap-4">
                  {/* Completion indicator */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                      isCompleted ? 'bg-green-100' : 'bg-muted'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <PuzzleIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {puzzle.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          getDifficultyColor(puzzle.difficulty)
                        )}
                      >
                        {puzzle.difficulty}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          puzzle.gameMode === 'classic'
                            ? 'bg-gray-50 text-gray-700 border-gray-200'
                            : 'bg-gradient-to-r from-red-50 via-yellow-50 to-blue-50 text-gray-700 border-purple-200'
                        )}
                      >
                        {puzzle.gameMode === 'classic' ? 'Classic' : 'Rainbow'}
                      </Badge>
                      {typeof puzzleProgress?.bestScore === 'number' && (
                        <span className="text-xs text-muted-foreground">
                          Best: {puzzleProgress.bestScore}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Puzzle Details Sheet */}
      <Sheet
        open={!!selectedPuzzle}
        onOpenChange={(open) => {
          if (!open) setSelectedPuzzle(null);
        }}
      >
        <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
          {selectedPuzzle &&
            (() => {
              const selectedProgress = progress[selectedPuzzle.id];
              const isCompleted = !!selectedProgress?.isCompleted;

              const hasInitialDice =
                selectedPuzzle.initialDice &&
                selectedPuzzle.initialDice.length > 0;
              const hasInitialColors =
                selectedPuzzle.initialColors &&
                selectedPuzzle.initialColors.length > 0;

              return (
                <div className="max-w-lg mx-auto h-full flex flex-col">
                  <SheetHeader className="text-left mb-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          getDifficultyColor(selectedPuzzle.difficulty)
                        )}
                      >
                        {selectedPuzzle.difficulty}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          selectedPuzzle.gameMode === 'classic'
                            ? 'bg-gray-50 text-gray-700 border-gray-200'
                            : 'bg-gradient-to-r from-red-50 via-yellow-50 to-blue-50 text-gray-700 border-purple-200'
                        )}
                      >
                        {selectedPuzzle.gameMode === 'classic'
                          ? 'Classic Mode'
                          : '🌈 Rainbow Mode'}
                      </Badge>
                      {isCompleted && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <SheetTitle className="text-2xl">
                      {selectedPuzzle.title}
                    </SheetTitle>
                    <SheetDescription className="text-sm mt-1">
                      {selectedPuzzle.description}
                    </SheetDescription>

                    {selectedPuzzle.tags && selectedPuzzle.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {selectedPuzzle.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px] uppercase tracking-wide"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </SheetHeader>

                  <div className="space-y-4 overflow-y-auto pb-4">
                    {/* Objective */}
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                        Objective
                      </h4>
                      <p className="text-sm text-foreground mb-2">
                        {selectedPuzzle.objective.description}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Type:{' '}
                        <span className="font-mono">
                          {selectedPuzzle.objective.type}
                        </span>
                        {typeof selectedPuzzle.objective.value !== 'undefined' && (
                          <>
                            {' · '}Target:{' '}
                            <span className="font-mono">
                              {Array.isArray(selectedPuzzle.objective.value)
                                ? selectedPuzzle.objective.value.join(', ')
                                : selectedPuzzle.objective.value}
                            </span>
                          </>
                        )}
                      </p>
                    </Card>

                    {/* Setup / Starting State */}
                    <Card className="p-4">
                      <h4 className="font-semibold text-foreground mb-3">
                        Starting setup
                      </h4>

                      {!hasInitialDice && !hasInitialColors && (
                        <p className="text-sm text-muted-foreground">
                          Standard start: roll from scratch.
                        </p>
                      )}

                      {(hasInitialDice || hasInitialColors) && (
                        <div className="space-y-3 text-sm">
                          {hasInitialDice && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Initial dice
                              </p>
                              <div className="flex gap-1">
                                {selectedPuzzle.initialDice!.map((die, i) => (
                                  <div
                                    key={i}
                                    className="w-8 h-8 rounded-md border flex items-center justify-center text-sm font-semibold bg-background"
                                  >
                                    {die}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedPuzzle.gameMode === 'rainbow' &&
                            hasInitialColors && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Initial colors
                                </p>
                                <div className="flex gap-1">
                                  {selectedPuzzle.initialColors!.map(
                                    (color, i) => (
                                      <div
                                        key={i}
                                        className="px-2 py-1 rounded-full text-[11px] border bg-background capitalize"
                                      >
                                        {color}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </Card>

                    {/* Progress */}
                    <Card className="p-4 bg-muted/40">
                      <h4 className="font-semibold text-foreground mb-2">
                        Your progress
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Status
                          </p>
                          <p className="font-semibold">
                            {isCompleted ? 'Completed' : 'Not completed'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Best score
                          </p>
                          <p className="font-semibold">
                            {typeof selectedProgress?.bestScore === 'number'
                              ? selectedProgress.bestScore
                              : '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Attempts
                          </p>
                          <p className="font-semibold">
                            {selectedProgress?.attempts ?? 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Last completed
                          </p>
                          <p className="font-semibold">
                            {selectedProgress?.completedAt
                              ? formatDate(selectedProgress.completedAt)
                              : '—'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Play Button */}
                  <div className="mt-auto pt-2">
                    <Button
                      size="lg"
                      className="w-full h-14 text-lg"
                      onClick={() => handlePlayPuzzle(selectedPuzzle)}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      {isCompleted ? 'Replay Puzzle' : 'Play Puzzle'}
                    </Button>
                  </div>
                </div>
              );
            })()}
        </SheetContent>
      </Sheet>

      <Navigation />
    </div>
  );
};

export default PuzzleList;
