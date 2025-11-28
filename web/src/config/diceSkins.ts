import { DiceSkin, DiceSkinId } from '@/types/diceSkins';

// Complete Dice Skin Registry
export const DICE_SKINS: Record<DiceSkinId, DiceSkin> = {
    // === CLASSIC ===
    classic: {
        id: 'classic',
        name: 'Classic',
        description: 'Clean, traditional dice',
        classes: {
            die: 'bg-white border-2 border-gray-300 shadow-md transition-transform transition-shadow duration-150',
            pips: 'bg-gray-900',
            held: 'ring-4 ring-gray-900 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-lg hover:scale-105',
            shadow: 'shadow-md',
        },
        previewClass: 'bg-white border-2 border-gray-300 shadow-sm',
    },

    // === AESTHETIC SKINS ===

    'bubblegum-pink': {
        id: 'bubblegum-pink',
        name: 'Bubblegum',
        description: 'Soft pastel candy pink',
        classes: {
            die: 'bg-gradient-to-br from-pink-200 via-pink-300 to-rose-300 border-2 border-pink-200 shadow-md shadow-pink-200/60 transition-transform transition-shadow duration-150',
            pips: 'bg-rose-700',
            held: 'ring-4 ring-rose-500 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-lg hover:shadow-pink-300/70 hover:scale-105',
            shadow: 'shadow-md shadow-pink-200/60',
        },
        previewClass: 'bg-gradient-to-br from-pink-200 via-pink-300 to-rose-300 border border-pink-200 shadow-sm',
    },

    holographic: {
        id: 'holographic',
        name: 'Holographic',
        description: 'Shifting iridescent shine',
        classes: {
            die: 'bg-gradient-to-br from-cyan-200 via-purple-300 via-pink-200 to-amber-200 border-2 border-white/70 bg-[length:220%_220%] animate-[gradient-shift_3s_ease_infinite] shadow-lg shadow-purple-300/40 transition-transform transition-shadow duration-150',
            pips: 'bg-slate-800/90',
            held: 'ring-4 ring-purple-400 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-[0_0_24px_rgba(192,132,252,0.7)] hover:scale-105',
            shadow: 'shadow-lg shadow-purple-300/40',
        },
        previewClass: 'bg-gradient-to-br from-cyan-200 via-purple-300 to-pink-200 border border-white/70 shadow-sm',
    },

    'neon-glow': {
        id: 'neon-glow',
        name: 'Neon Glow',
        description: 'Cyberpunk teal glow',
        classes: {
            die: 'bg-slate-950 border-2 border-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.55)] transition-transform transition-shadow duration-150',
            pips: 'bg-cyan-300',
            held: 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-background scale-95 shadow-[0_0_24px_rgba(34,211,238,0.9)]',
            hovered: 'hover:shadow-[0_0_22px_rgba(34,211,238,0.75)] hover:scale-105',
            shadow: 'shadow-[0_0_14px_rgba(34,211,238,0.55)]',
        },
        previewClass: 'bg-slate-950 border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]',
    },

    pixel: {
        id: 'pixel',
        name: 'Pixel Dice',
        description: 'Chunky 8-bit retro style',
        classes: {
            die: 'bg-indigo-600 border-[4px] border-indigo-950 shadow-[4px_4px_0_0_rgba(30,27,75,1)] transition-transform transition-shadow duration-150',
            pips: 'bg-amber-200',
            held: 'ring-4 ring-amber-300 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:bg-indigo-500 hover:scale-105 hover:shadow-[6px_6px_0_0_rgba(30,27,75,1)]',
            shadow: 'shadow-[4px_4px_0_0_rgba(30,27,75,1)]',
        },
        previewClass: 'bg-indigo-600 border-[4px] border-indigo-950 shadow-[3px_3px_0_0_rgba(30,27,75,1)]',
    },

    metal: {
        id: 'metal',
        name: 'Metal Dice',
        description: 'Cool brushed steel',
        classes: {
            die: 'bg-gradient-to-br from-zinc-300 via-zinc-100 to-zinc-500 border-2 border-zinc-600 shadow-lg transition-transform transition-shadow duration-150',
            pips: 'bg-zinc-900',
            held: 'ring-4 ring-zinc-600 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-xl hover:scale-105',
            shadow: 'shadow-lg',
        },
        previewClass: 'bg-gradient-to-br from-zinc-300 via-zinc-100 to-zinc-500 border border-zinc-500 shadow-sm',
    },

    wooden: {
        id: 'wooden',
        name: 'Wooden Dice',
        description: 'Warm carved wood',
        classes: {
            die: 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 border-2 border-amber-900 shadow-md transition-transform transition-shadow duration-150',
            pips: 'bg-stone-900',
            held: 'ring-4 ring-amber-950 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-lg hover:scale-105',
            shadow: 'shadow-md',
        },
        previewClass: 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 border border-amber-900 shadow-sm',
    },

    // === THEMATIC SKINS ===
    dungeon: {
        id: 'dungeon',
        name: 'Dungeon',
        description: 'Weathered stone from deep dungeons',
        classes: {
            die: 'bg-gradient-to-br from-stone-600 via-stone-700 to-stone-900 border-2 border-stone-950 shadow-lg shadow-stone-950/60 transition-transform transition-shadow duration-150',
            pips: 'bg-amber-300',
            held: 'ring-4 ring-amber-500 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105',
            shadow: 'shadow-lg shadow-stone-950/60',
        },
        previewClass: 'bg-gradient-to-br from-stone-600 to-stone-900 border border-stone-950 shadow-sm',
    },

    'leafy-forest': {
        id: 'leafy-forest',
        name: 'Leafy Forest',
        description: 'Bright forest canopy',
        classes: {
            die: 'bg-gradient-to-br from-emerald-400 via-green-500 to-lime-500 border-2 border-emerald-800 shadow-md shadow-emerald-900/35 transition-transform transition-shadow duration-150',
            pips: 'bg-amber-900',
            held: 'ring-4 ring-emerald-900 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-lg hover:shadow-green-400/45 hover:scale-105',
            shadow: 'shadow-md shadow-emerald-900/35',
        },
        previewClass: 'bg-gradient-to-br from-emerald-400 via-green-500 to-lime-500 border border-emerald-800 shadow-sm',
    },

    'lava-core': {
        id: 'lava-core',
        name: 'Lava Core',
        description: 'Dark rock with molten cracks',
        classes: {
            die: 'bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 border-2 border-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.5)] transition-transform transition-shadow duration-150',
            pips: 'bg-orange-400',
            held: 'ring-4 ring-orange-500 ring-offset-2 ring-offset-background scale-95 shadow-[0_0_24px_rgba(249,115,22,0.8)]',
            hovered: 'hover:shadow-[0_0_26px_rgba(249,115,22,0.8)] hover:scale-105',
            shadow: 'shadow-[0_0_15px_rgba(234,88,12,0.5)]',
        },
        previewClass: 'bg-gradient-to-br from-slate-950 via-red-950 to-orange-600 border border-orange-500 shadow-sm',
    },

    sky: {
        id: 'sky',
        name: 'Sky Dice',
        description: 'Clear daytime sky',
        classes: {
            die: 'bg-gradient-to-b from-sky-200 via-sky-300 to-sky-500 border-2 border-sky-300 shadow-md shadow-sky-400/35 transition-transform transition-shadow duration-150',
            pips: 'bg-white',
            held: 'ring-4 ring-sky-600 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-lg hover:shadow-sky-300/60 hover:scale-105',
            shadow: 'shadow-md shadow-sky-400/35',
        },
        previewClass: 'bg-gradient-to-b from-sky-200 via-sky-300 to-sky-500 border border-sky-300 shadow-sm',
    },

    alien: {
        id: 'alien',
        name: 'Alien Dice',
        description: 'Toxic extraterrestrial glow',
        classes: {
            die: 'bg-gradient-to-br from-green-950 via-emerald-900 to-lime-900 border-2 border-lime-400 shadow-[0_0_13px_rgba(74,222,128,0.5)] transition-transform transition-shadow duration-150',
            pips: 'bg-lime-300',
            held: 'ring-4 ring-lime-400 ring-offset-2 ring-offset-background scale-95 shadow-[0_0_24px_rgba(74,222,128,0.8)]',
            hovered: 'hover:shadow-[0_0_22px_rgba(74,222,128,0.75)] hover:scale-105',
            shadow: 'shadow-[0_0_13px_rgba(74,222,128,0.5)]',
        },
        previewClass: 'bg-gradient-to-br from-green-950 via-emerald-900 to-lime-900 border border-lime-400 shadow-sm',
    },

    // === HOLIDAY SKINS ===
    halloween: {
        id: 'halloween',
        name: 'Halloween',
        description: 'Pumpkin orange & spooky contrast',
        classes: {
            die: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800 border-2 border-slate-950 shadow-lg shadow-orange-900/45 transition-transform transition-shadow duration-150',
            pips: 'bg-slate-950',
            held: 'ring-4 ring-purple-700 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-xl hover:shadow-orange-500/65 hover:scale-105',
            shadow: 'shadow-lg shadow-orange-900/45',
        },
        previewClass: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800 border border-slate-950 shadow-sm',
        isHoliday: true,
    },

    christmas: {
        id: 'christmas',
        name: 'Christmas',
        description: 'Classic red & evergreen holiday colors',
        classes: {
            die: 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 border-2 border-green-500 shadow-lg shadow-red-900/50 transition-transform transition-shadow duration-150',
            pips: 'bg-white',
            held: 'ring-4 ring-green-500 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-xl hover:shadow-green-400/60 hover:scale-105',
            shadow: 'shadow-lg shadow-red-900/50',
        },
        previewClass: 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 border border-green-500 shadow-sm',
        isHoliday: true,
    },

    hanukkah: {
        id: 'hanukkah',
        name: 'Hanukkah',
        description: 'Blue & silver festival of lights',
        classes: {
            die: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 border-2 border-slate-200 shadow-lg shadow-blue-900/40 transition-transform transition-shadow duration-150',
            pips: 'bg-slate-100',
            held: 'ring-4 ring-slate-300 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-xl hover:shadow-blue-300/60 hover:scale-105',
            shadow: 'shadow-lg shadow-blue-900/40',
        },
        previewClass: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 border border-slate-200 shadow-sm',
        isHoliday: true,
    },

    newyear: {
        id: 'newyear',
        name: "New Year's",
        description: 'Midnight black & sparkling gold',
        classes: {
            die: 'bg-gradient-to-br from-black via-slate-900 to-black border-2 border-yellow-400 shadow-lg shadow-yellow-900/40 transition-transform transition-shadow duration-150',
            pips: 'bg-yellow-300',
            held: 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-xl hover:shadow-yellow-300/70 hover:scale-105',
            shadow: 'shadow-lg shadow-yellow-900/40',
        },
        previewClass: 'bg-gradient-to-br from-black via-slate-900 to-black border border-yellow-400 shadow-sm',
        isHoliday: true,
    },

        valentine: {
        id: 'valentine',
        name: "Valentine's",
        description: 'Romantic reds & passionate pinks',
        classes: {
            die: 'bg-gradient-to-br from-rose-600 via-pink-600 to-red-600 border-2 border-rose-200 shadow-md shadow-rose-500/60 transition-transform transition-shadow duration-150',
            pips: 'bg-white',
            held: 'ring-4 ring-red-500 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-lg hover:shadow-rose-400/80 hover:scale-105',
            shadow: 'shadow-md shadow-rose-500/60',
        },
        previewClass: 'bg-gradient-to-br from-rose-600 via-pink-600 to-red-600 border border-rose-200 shadow-sm',
        isHoliday: true,
    },

    stpatrick: {
        id: 'stpatrick',
        name: "St. Patrick's",
        description: 'Emerald clover & lucky gold',
        classes: {
            die: 'bg-gradient-to-br from-green-500 via-emerald-600 to-green-800 border-2 border-emerald-300 shadow-lg shadow-green-900/40 transition-transform transition-shadow duration-150',
            pips: 'bg-yellow-200',
            held: 'ring-4 ring-emerald-500 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-xl hover:shadow-emerald-300/60 hover:scale-105',
            shadow: 'shadow-lg shadow-green-900/40',
        },
        previewClass: 'bg-gradient-to-br from-green-500 via-emerald-600 to-green-800 border border-emerald-300 shadow-sm',
        isHoliday: true,
    },

    easter: {
        id: 'easter',
        name: 'Easter',
        description: 'Soft pastel spring palette',
        classes: {
            die: 'bg-gradient-to-br from-pink-200 via-yellow-200 to-green-200 border-2 border-pink-300 shadow-md shadow-pink-200/50 transition-transform transition-shadow duration-150',
            pips: 'bg-purple-500',
            held: 'ring-4 ring-purple-400 ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-lg hover:shadow-purple-300/60 hover:scale-105',
            shadow: 'shadow-md shadow-pink-200/50',
        },
        previewClass: 'bg-gradient-to-br from-pink-200 via-yellow-200 to-green-200 border border-pink-300 shadow-sm',
        isHoliday: true,
    },

    pride: {
        id: 'pride',
        name: 'Pride',
        description: 'Ultra-vibrant full-spectrum rainbow',
        classes: {
            die: 'bg-[conic-gradient(at_center,_#ef4444,_#f97316,_#facc15,_#22c55e,_#06b6d4,_#3b82f6,_#6366f1,_#a855f7,_#ef4444)] border-2 border-white/80 shadow-lg transition-transform transition-shadow duration-150',
            pips: 'bg-white',
            held: 'ring-4 ring-white ring-offset-2 ring-offset-background scale-95',
            hovered: 'hover:shadow-[0_0_24px_rgba(147,51,234,0.85)] hover:scale-105',
            shadow: 'shadow-lg',
        },
        previewClass:
            'bg-[conic-gradient(at_center,_#ef4444,_#f97316,_#facc15,_#22c55e,_#06b6d4,_#3b82f6,_#6366f1,_#a855f7,_#ef4444)] border border-white/80 shadow-sm',
        isHoliday: true,
    },
};

// Helper functions
export const getAllSkins = (): DiceSkin[] => Object.values(DICE_SKINS);

export const getSkin = (id: DiceSkinId): DiceSkin => {
    return DICE_SKINS[id] || DICE_SKINS.classic;
};

export const getHolidaySkins = (): DiceSkin[] => {
    return getAllSkins().filter((skin) => skin.isHoliday);
};

export const getRegularSkins = (): DiceSkin[] => {
    return getAllSkins().filter((skin) => !skin.isHoliday);
};

export const DEFAULT_SKIN_ID: DiceSkinId = 'classic';
export const DICE_SKIN_STORAGE_KEY = 'yahtzee-dice-skin';
