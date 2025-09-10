import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Smile, RefreshCw, TrendingUp } from "lucide-react";

interface DailyMotivationProps {
  mood: "sad" | "neutral" | "happy";
}

export const DailyMotivation = ({ mood }: DailyMotivationProps) => {
  const [dailyJoke, setDailyJoke] = useState("Loading your daily dose of plant humor... 🌱");
  const [dailyThought, setDailyThought] = useState("Loading today's inspiration... 🌲");
  const [growthTip, setGrowthTip] = useState("Loading your growth tip... ☀️🌧️");
  const [isLoading, setIsLoading] = useState(false);

  const refreshContent = async () => {
    setIsLoading(true);
    try {
      // Import Gemini service dynamically
      const { geminiService } = await import('../services/geminiService');
      
      const [newJoke, newThought, newTip] = await Promise.all([
        geminiService.generateDailyJoke(),
        geminiService.generateDailyThought(),
        geminiService.generateGrowthTip()
      ]);
      
      setDailyJoke(newJoke);
      setDailyThought(newThought);
      setGrowthTip(newTip);
    } catch (error) {
      console.error('Error refreshing content:', error);
      // Keep existing content if refresh fails
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial content
  useEffect(() => {
    refreshContent();
  }, []);

  return (
    <div className="space-y-6">
      {/* Daily Joke */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-foreground">
            <Smile className="w-5 h-5 text-primary" />
            Daily Laugh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground mb-4">{dailyJoke}</p>
        </CardContent>
      </Card>

      {/* Daily Thought */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-foreground">
            <Lightbulb className="w-5 h-5 text-primary" />
            Daily Inspiration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground mb-4">{dailyThought}</p>
        </CardContent>
      </Card>

      {/* Growth Tip */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-foreground">
            <TrendingUp className="w-5 h-5 text-primary" />
            Growth Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground mb-4">{growthTip}</p>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <Card className="bg-gradient-card border-border">
        <CardContent className="pt-6">
          <Button 
            onClick={refreshContent}
            variant="outline" 
            size="sm"
            className="w-full"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Daily Content'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};