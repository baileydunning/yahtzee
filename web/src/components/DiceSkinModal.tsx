import { useState } from 'react';
import { useDiceSkins } from '@/hooks/use-dice-skins';
import { DiceSkin, DiceSkinId } from '@/types/diceSkins';
import { cn } from '@/lib/utils';
import { Lock, Check, Sparkles, Snowflake, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SkinPreviewTileProps {
  skin: DiceSkin;
  isSelected: boolean;
  isLocked: boolean;
  onSelect: () => void;
}

const SkinPreviewTile = ({ skin, isSelected, isLocked, onSelect }: SkinPreviewTileProps) => {
  // Render preview pips (showing a 5 configuration)
  const renderPreviewPips = () => {
    const pipPositions = [
      'top-1 left-1',
      'top-1 right-1',
      'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'bottom-1 left-1',
      'bottom-1 right-1',
    ];

    return pipPositions.map((pos, i) => (
      <div 
        key={i} 
        className={cn(
          'absolute w-1.5 h-1.5 rounded-full',
          skin.id === 'pixel' && 'rounded-none',
          skin.classes.pips
        )} 
        style={pos.includes('translate') ? {} : undefined}
      >
        <div className={cn('absolute', pos.replace('top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', ''))} />
      </div>
    ));
  };

  return (
    <button
      onClick={onSelect}
      disabled={isLocked}
      className={cn(
        'relative p-3 rounded-xl border-2 transition-all duration-200',
        'hover:scale-[1.02] active:scale-[0.98]',
        isSelected 
          ? 'border-primary bg-primary/10 ring-2 ring-primary ring-offset-2' 
          : 'border-border hover:border-primary/50',
        isLocked && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Preview dice */}
        <div
          className={cn(
            'relative w-10 h-10 rounded-lg flex items-center justify-center',
            skin.previewClass || skin.classes.die,
            skin.classes.shadow
          )}
        >
          {/* 5-pip layout */}
          <div className={cn('absolute w-1.5 h-1.5 rounded-full top-1.5 left-1.5', skin.id === 'pixel' && 'rounded-none', skin.classes.pips)} />
          <div className={cn('absolute w-1.5 h-1.5 rounded-full top-1.5 right-1.5', skin.id === 'pixel' && 'rounded-none', skin.classes.pips)} />
          <div className={cn('absolute w-1.5 h-1.5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', skin.id === 'pixel' && 'rounded-none', skin.classes.pips)} />
          <div className={cn('absolute w-1.5 h-1.5 rounded-full bottom-1.5 left-1.5', skin.id === 'pixel' && 'rounded-none', skin.classes.pips)} />
          <div className={cn('absolute w-1.5 h-1.5 rounded-full bottom-1.5 right-1.5', skin.id === 'pixel' && 'rounded-none', skin.classes.pips)} />
        </div>
        
        <div className="text-center">
          <div className="font-medium text-xs leading-tight">{skin.name}</div>
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}

      {/* Locked indicator */}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-xl">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      {/* Holiday badge */}
      {skin.isHoliday && !isLocked && (
        <Snowflake className="absolute top-1 left-1 w-3 h-3 text-blue-500" />
      )}
    </button>
  );
};

interface DiceSkinModalProps {
  trigger?: React.ReactNode;
}

export const DiceSkinModal = ({ trigger }: DiceSkinModalProps) => {
  const [open, setOpen] = useState(false);
  const { allSkins, selectedSkinId, changeSkin, isUnlocked, holidaySkins, regularSkins } = useDiceSkins();

  const handleSelect = (skinId: DiceSkinId) => {
    if (changeSkin(skinId)) {
      // Optionally close on select
      // setOpen(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Palette className="w-4 h-4" />
      <span className="hidden sm:inline">Skins</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Dice Skins
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Regular Skins */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Aesthetic & Thematic
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {regularSkins.map((skin) => (
                  <SkinPreviewTile
                    key={skin.id}
                    skin={skin}
                    isSelected={selectedSkinId === skin.id}
                    isLocked={!isUnlocked(skin.id)}
                    onSelect={() => handleSelect(skin.id)}
                  />
                ))}
              </div>
            </div>

            {/* Holiday Skins */}
            {holidaySkins.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                  <Snowflake className="w-4 h-4" />
                  Holiday & Seasonal
                  <Badge variant="secondary" className="text-xs">Special</Badge>
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {holidaySkins.map((skin) => (
                    <SkinPreviewTile
                      key={skin.id}
                      skin={skin}
                      isSelected={selectedSkinId === skin.id}
                      isLocked={!isUnlocked(skin.id)}
                      onSelect={() => handleSelect(skin.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
