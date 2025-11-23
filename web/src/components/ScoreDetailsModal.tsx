import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { HighScore } from '@/types/game';
import { classicScoringEngine } from '@/services/scoringEngine';
import { rainbowScoringEngine } from '@/services/rainbowScoringEngine';
import { Calendar, User, Trophy } from 'lucide-react';

interface ScoreDetailsModalProps {
  score: HighScore | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScoreDetailsModal = ({ score, open, onOpenChange }: ScoreDetailsModalProps) => {
  if (!score) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render Classic Mode scorecard
  const renderScorecard = () => {
    if (!score.scorecard) return null;
    
    const scores = score.scorecard;
    const upperTotal = classicScoringEngine.calculateUpperSection(scores);
    const bonus = classicScoringEngine.calculateUpperBonus(upperTotal);
    const lowerTotal = classicScoringEngine.calculateLowerSection(scores);
    const grandTotal = classicScoringEngine.calculateGrandTotal(scores);

    return (
      <div className="space-y-4">
        {/* Upper Section */}
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Upper Section</h3>
          <div className="space-y-1">
            <ScoreRow label="Aces" value={scores.aces} />
            <ScoreRow label="Twos" value={scores.twos} />
            <ScoreRow label="Threes" value={scores.threes} />
            <ScoreRow label="Fours" value={scores.fours} />
            <ScoreRow label="Fives" value={scores.fives} />
            <ScoreRow label="Sixes" value={scores.sixes} />
            <div className="border-t pt-1 mt-2">
              <ScoreRow label="Upper Total" value={upperTotal} bold />
              <ScoreRow label="Bonus (63+)" value={bonus} bold />
            </div>
          </div>
        </div>

        {/* Lower Section */}
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Lower Section</h3>
          <div className="space-y-1">
            <ScoreRow label="3 of a Kind" value={scores.threeOfKind} />
            <ScoreRow label="4 of a Kind" value={scores.fourOfKind} />
            <ScoreRow label="Full House" value={scores.fullHouse} />
            <ScoreRow label="Small Straight" value={scores.smallStraight} />
            <ScoreRow label="Large Straight" value={scores.largeStraight} />
            <ScoreRow label="Yahtzee" value={scores.yahtzee} />
            <ScoreRow label="Chance" value={scores.chance} />
            {scores.bonusYahtzees > 0 && (
              <ScoreRow label="Bonus Yahtzees" value={scores.bonusYahtzees * 100} special />
            )}
            <div className="border-t pt-1 mt-2">
              <ScoreRow label="Lower Total" value={lowerTotal} bold />
            </div>
          </div>
        </div>

        {/* Color Bonuses */}
        {score.mode === 'rainbow' && 'allRed' in scores && (() => {
          const colorBonus = rainbowScoringEngine.calculateColorBonus(scores);
          return (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Color Bonuses</h3>
              <div className="space-y-1">
                <ScoreRow label="All Red" value={scores.allRed} />
                <ScoreRow label="All Blue" value={scores.allBlue} />
                <ScoreRow label="All Green" value={scores.allGreen} />
                <ScoreRow label="All Yellow" value={scores.allYellow} />
                <ScoreRow label="All Purple" value={scores.allPurple} />
                <ScoreRow label="Three-Color Mix" value={scores.threeColorMix} />
                <ScoreRow label="Four-Color Mix" value={scores.fourColorMix} />
                <ScoreRow label="Rainbow Bonus" value={scores.rainbowBonus} />
                <div className="border-t pt-1 mt-2">
                  <ScoreRow label="Color Bonus Total" value={colorBonus} bold />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Grand Total */}
        <div className="border-t pt-2">
          <ScoreRow label="Grand Total" value={grandTotal} highlight />
        </div>
      </div>
    );
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Score Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Info */}
          <Card className="p-4 bg-muted/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">{score.score}</span>
                <span className="text-sm px-2 py-1 bg-background rounded">
                  {score.mode === 'classic' ? 'Classic' : 'Rainbow'} Mode
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                {score.playerNames.join(', ')}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {formatDate(score.date)}
              </div>
              {score.note && (
                <p className="text-sm text-muted-foreground italic mt-2">{score.note}</p>
              )}
            </div>
          </Card>

          {/* Scorecard */}
          {renderScorecard()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper component for score rows
interface ScoreRowProps {
  label: string;
  value: number | null;
  bold?: boolean;
  highlight?: boolean;
  special?: boolean;
}

const ScoreRow = ({ label, value, bold, highlight, special }: ScoreRowProps) => {
  const displayValue = value === null ? '-' : value;
  
  return (
    <div className={`flex justify-between items-center py-1 px-2 rounded ${
      highlight ? 'bg-primary/10 font-bold text-lg' : 
      bold ? 'font-semibold' : ''
    } ${special ? 'text-primary' : ''}`}>
      <span className="text-sm">{label}</span>
      <span className={highlight ? 'text-lg' : 'text-sm'}>{displayValue}</span>
    </div>
  );
};
