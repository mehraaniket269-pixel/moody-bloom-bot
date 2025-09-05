import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar, MessageCircle, Flame } from "lucide-react";

interface StatsPanelProps {
  insights: {
    weeklyHappyDays: number;
    averageWeeklyMood: number;
    totalInteractions: number;
    currentStreak: number;
    growthLevel: number;
  };
}

export const StatsPanel = ({ insights }: StatsPanelProps) => {
  const getMoodDescription = (score: number) => {
    if (score >= 70) return "Thriving";
    if (score >= 50) return "Growing";
    return "Nurturing";
  };

  const stats = [
    {
      icon: TrendingUp,
      label: "Growth Level",
      value: `${insights.growthLevel}%`,
      description: "Your plant's current size",
      color: "text-plant-healthy"
    },
    {
      icon: Calendar,
      label: "Weekly Mood",
      value: getMoodDescription(insights.averageWeeklyMood),
      description: `${insights.weeklyHappyDays}/7 happy days`,
      color: "text-primary"
    },
    {
      icon: MessageCircle,
      label: "Total Chats",
      value: insights.totalInteractions.toString(),
      description: "Conversations with your plant",
      color: "text-accent"
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${insights.currentStreak} days`,
      description: "Happy days in a row",
      color: "text-growth-high"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="p-4 bg-gradient-card border-border">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-secondary/20 ${stat.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground opacity-75">
                  {stat.description}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};