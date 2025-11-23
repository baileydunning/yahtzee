import { cn } from '@/lib/utils';
import { DiceColor } from '@/types/game';

interface DieProps {
  value: number;
  color: DiceColor | 'neutral';
  isHeld: boolean;
  isRolling: boolean;
  onToggleHold: () => void;
  disabled?: boolean;
}

export const Die = ({ value, color, isHeld, isRolling, onToggleHold, disabled }: DieProps) => {
  const getColorClasses = () => {
    if (color === 'neutral') {
      return 'bg-white border-2 border-gray-300';
    }
    
    const colorMap = {
      red: 'bg-dice-red border-dice-red',
      blue: 'bg-dice-blue border-dice-blue',
      green: 'bg-dice-green border-dice-green',
      yellow: 'bg-dice-yellow border-dice-yellow',
      purple: 'bg-dice-purple border-dice-purple',
    };
    
    return `${colorMap[color]} border-2`;
  };

  const getPipColor = () => {
    if (color === 'neutral') return 'bg-gray-800';
    // Use white pips for all colored dice
    return 'bg-white';
  };

  const getDotPositions = (num: number) => {
    const positions: string[] = [];
    
    switch (num) {
      case 1:
        positions.push('center');
        break;
      case 2:
        positions.push('top-left', 'bottom-right');
        break;
      case 3:
        positions.push('top-left', 'center', 'bottom-right');
        break;
      case 4:
        positions.push('top-left', 'top-right', 'bottom-left', 'bottom-right');
        break;
      case 5:
        positions.push('top-left', 'top-right', 'center', 'bottom-left', 'bottom-right');
        break;
      case 6:
        positions.push('top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right');
        break;
    }
    
    return positions;
  };

  const renderDot = (position: string) => {
    const dotClass = 'w-2.5 h-2.5 md:w-3 md:h-3 rounded-full';
    
    const positionClasses = {
      'top-left': 'top-2.5 left-2.5',
      'top-right': 'top-2.5 right-2.5',
      'middle-left': 'top-1/2 -translate-y-1/2 left-2.5',
      'middle-right': 'top-1/2 -translate-y-1/2 right-2.5',
      'bottom-left': 'bottom-2.5 left-2.5',
      'bottom-right': 'bottom-2.5 right-2.5',
      'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    };

    return (
      <div
        key={position}
        className={cn(
          dotClass, 
          getPipColor(), 
          'absolute',
          positionClasses[position as keyof typeof positionClasses],
          isRolling && 'opacity-0'
        )}
      />
    );
  };

  return (
    <button
      onClick={onToggleHold}
      disabled={disabled || !value}
      className={cn(
        'relative w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-md transition-all duration-200',
        getColorClasses(),
        isHeld && 'ring-4 ring-gray-900 ring-offset-2 ring-offset-background scale-95',
        isRolling && 'animate-[spin_0.3s_ease-in-out]',
        !disabled && value && 'hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {value > 0 && getDotPositions(value).map(renderDot)}
      
      {isHeld && (
        <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
          HOLD
        </div>
      )}
    </button>
  );
};
