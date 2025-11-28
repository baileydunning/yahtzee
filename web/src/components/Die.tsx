import { cn } from '@/lib/utils';
import { DiceColor } from '@/types/game';
import { useDiceSkinContext } from '@/contexts/DiceSkinContext';

interface DieProps {
  value: number;
  color: DiceColor | 'neutral';
  isHeld: boolean;
  isRolling: boolean;
  onToggleHold: () => void;
  disabled?: boolean;
}

// Rainbow mode color classes for dice backgrounds
const RAINBOW_COLOR_CLASSES: Record<DiceColor, string> = {
  red: 'bg-dice-red border-dice-red',
  blue: 'bg-dice-blue border-dice-blue',
  green: 'bg-dice-green border-dice-green',
  yellow: 'bg-dice-yellow border-dice-yellow',
  purple: 'bg-dice-purple border-dice-purple',
};

export const Die = ({ value, color, isHeld, isRolling, onToggleHold, disabled }: DieProps) => {
  const { currentSkin } = useDiceSkinContext();

  // Get background classes - merge skin with rainbow mode colors
  const getBackgroundClasses = () => {
    // In Rainbow mode with colored dice, use rainbow colors
    if (color !== 'neutral') {
      return RAINBOW_COLOR_CLASSES[color] + ' border-2';
    }
    // Otherwise use the skin's die class
    return currentSkin.classes.die;
  };

  // Get pip color - white for rainbow mode colored dice, otherwise from skin
  const getPipClasses = () => {
    if (color !== 'neutral') {
      return 'bg-white';
    }
    return currentSkin.classes.pips;
  };

  // Get pip shape class
  const getPipShapeClass = () => {
    return currentSkin.id === 'pixel' ? 'rounded-none' : 'rounded-full';
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
    const dotClass = cn(
      'w-2.5 h-2.5 md:w-3 md:h-3',
      getPipShapeClass(),
      getPipClasses()
    );
    
    const positionClasses = {
      'top-left': 'top-2.5 left-2.5',
      'top-right': 'top-2.5 right-2.5',
      'middle-left': 'top-1/2 -translate-y-1/2 left-2.5',
      'middle-right': 'top-1/2 -translate-y-1/2 right-2.5',
      'bottom-left': 'bottom-2.5 left-2.5',
      'bottom-right': 'bottom-2.5 right-2.5',
      'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    };

    // Add glow effect for neon-style skins
    const glowStyle: React.CSSProperties = {};
    if (currentSkin.id === 'neon-glow' || currentSkin.id === 'alien' || currentSkin.id === 'lava-core') {
      const glowColors: Record<string, string> = {
        'neon-glow': 'rgba(34, 211, 238, 0.8)',
        'circuit-board': 'rgba(163, 230, 53, 0.6)',
        'alien': 'rgba(74, 222, 128, 0.6)',
        'lava-core': 'rgba(249, 115, 22, 0.6)',
      };
      glowStyle.boxShadow = `0 0 8px ${glowColors[currentSkin.id] || 'transparent'}`;
    }

    return (
      <div
        key={position}
        className={cn(
          dotClass, 
          'absolute',
          positionClasses[position as keyof typeof positionClasses],
          isRolling && 'opacity-0'
        )}
        style={glowStyle}
      />
    );
  };

  // Get held badge styling based on skin
  const getHeldBadgeClasses = () => {
    const skinBadgeStyles: Record<string, string> = {
      'neon-glow': 'bg-cyan-400 text-gray-900',
      'pixel': 'bg-yellow-300 text-indigo-900',
      'holographic': 'bg-purple-400 text-white',
      'lava-core': 'bg-orange-500 text-gray-900',
      'alien': 'bg-green-400 text-gray-900',
      'circuit-board': 'bg-lime-400 text-gray-900',
    };
    return skinBadgeStyles[currentSkin.id] || 'bg-gray-900 text-white';
  };

  return (
    <button
      onClick={onToggleHold}
      disabled={disabled || !value}
      className={cn(
        'relative w-16 h-16 md:w-20 md:h-20 rounded-xl transition-all duration-200',
        getBackgroundClasses(),
        currentSkin.classes.shadow,
        isHeld && currentSkin.classes.held,
        isRolling && 'animate-[spin_0.3s_ease-in-out]',
        !disabled && value && currentSkin.classes.hovered,
        !disabled && value && 'cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {value > 0 && getDotPositions(value).map(renderDot)}
      
      {isHeld && (
        <div className={cn(
          "absolute -top-2 -right-2 text-xs font-bold px-2 py-0.5 rounded-full shadow-md",
          getHeldBadgeClasses()
        )}>
          HOLD
        </div>
      )}
    </button>
  );
};
