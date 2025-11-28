import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Game from "./pages/Game";
import HighScoresPage from "./pages/HighScores";
import StatsPage from "./pages/Stats";
import AchievementsPage from "./pages/Achievements";
import PuzzleList from "./pages/PuzzleList";
import PuzzleGame from "./pages/PuzzleGame";
import NotFound from "./pages/NotFound";
import { DiceSkinProvider } from "./contexts/DiceSkinContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DiceSkinProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/game" element={<Game />} />
            <Route path="/puzzles" element={<PuzzleList />} />
            <Route path="/puzzle/:puzzleId" element={<PuzzleGame />} />
            <Route path="/high-scores" element={<HighScoresPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DiceSkinProvider>
  </QueryClientProvider>
);

export default App;
