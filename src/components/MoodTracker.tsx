import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MoodTrackerProps {
  currentMood: "sad" | "neutral" | "happy";
  growth: number;
  chatCount: number;
  streak: number;
  onMoodSelect: (mood: "sad" | "neutral" | "happy") => void;
  onGrowPlant: () => void;
}

export const MoodTracker = ({
  currentMood,
  growth,
  chatCount,
  streak,
  onMoodSelect,
  onGrowPlant
}: MoodTrackerProps) => {
  const moodEmojis = {
    sad: "😢",
    neutral: "😐", 
    happy: "😊"
  };

  const moodLabels = {
    sad: "Sad",
    neutral: "Neutral",
    happy: "Happy"
  };

  const moodDescriptions = {
    sad: "A bit down, but growing...",
    neutral: "Curious about you! 🌱", 
    happy: "Thriving and flourishing!"
  };

  return (
    <div className="space-y-6">
      {/* Plant Status Card */}
      <Card className="p-6 bg-gradient-card border-border">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Little Sprout</h1>
          <p className="text-muted-foreground">
            {moodDescriptions[currentMood]} {moodEmojis[currentMood]} 🌱
          </p>
          
          {/* Growth Progress */}
          <div className="space-y-2">
            <Progress value={growth} className="h-3" />
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-secondary/20 rounded-lg p-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Growth</div>
                <div className="text-2xl font-bold text-primary">{growth}%</div>
              </div>
            </div>
            <div className="bg-secondary/20 rounded-lg p-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Chats</div>
                <div className="text-2xl font-bold text-primary">{chatCount}</div>
              </div>
            </div>
          </div>

          {/* Streak Display */}
          {streak > 0 && (
            <div className="bg-gradient-primary text-primary-foreground rounded-lg p-3">
              <div className="text-center">
                <div className="text-sm opacity-90">Happy Streak</div>
                <div className="text-xl font-bold">🔥 {streak} days</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Mood Selection */}
      <Card className="p-6 bg-gradient-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          How are you feeling today?
        </h3>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(["sad", "neutral", "happy"] as const).map((mood) => (
            <Button
              key={mood}
              variant={currentMood === mood ? "default" : "outline"}
              className={cn(
                "flex flex-col h-20 space-y-2",
                currentMood === mood && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
              onClick={() => onMoodSelect(mood)}
            >
              <span className="text-2xl">{moodEmojis[mood]}</span>
              <span className="text-sm">{moodLabels[mood]}</span>
            </Button>
          ))}
        </div>

        <Button 
          onClick={onGrowPlant}
          className="w-full bg-gradient-primary hover:bg-gradient-primary/90"
          size="lg"
        >
          Grow my plant 🌿
        </Button>
      </Card>

      {/* Today's Inspiration */}
      <Card className="p-6 bg-gradient-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Daily Inspiration
        </h3>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-primary mb-1">Today's Thought:</div>
            <p className="text-sm text-muted-foreground italic">
              "Every small step forward is still progress. You're growing stronger each day, just like me! 🌱"
            </p>
          </div>
          <div>
            <div className="text-sm font-medium text-primary mb-1">Plant Wisdom:</div>
            <p className="text-sm text-muted-foreground italic">
              "Plants don't worry about growing fast. They focus on growing strong. Take your time. 🌿"
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};