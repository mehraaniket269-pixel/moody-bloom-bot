import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlantVisualization } from "@/components/PlantVisualization";
import { ChatInterface } from "@/components/ChatInterface";
import { MoodTracker } from "@/components/MoodTracker";
import { StatsPanel } from "@/components/StatsPanel";
import { DailyMotivation } from "@/components/DailyMotivation";
import { usePlantData } from "@/hooks/usePlantData";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, BarChart3, Sprout, Github } from "lucide-react";

const Index = () => {
  const {
    growth,
    chatCount,
    streak,
    currentMood,
    plantName,
    updateMood,
    growPlant,
    getInsights
  } = usePlantData();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("chat");

  const handleMoodSelect = (mood: "sad" | "neutral" | "happy") => {
    updateMood(mood);
    toast({
      title: "Mood Updated",
      description: `You're feeling ${mood} today. Your plant understands! 🌱`
    });
  };

  const handleGrowPlant = () => {
    const result = growPlant();
    toast({
      title: "Plant Growth! 🌱",
      description: result.message + (result.streakBonus ? ` ${result.streakBonus}` : ""),
    });
  };

  const insights = getInsights();

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Plant Companion</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:flex">
                🌱 {plantName}
              </Badge>
              <Badge variant="outline">
                LM Studio Ready
              </Badge>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          
          {/* Left Panel - Plant & Mood Tracker */}
          <div className="lg:col-span-1 space-y-6">
            <div className="text-center">
              <PlantVisualization
                growth={growth}
                mood={currentMood}
                streak={streak}
              />
            </div>
            
            <MoodTracker
              currentMood={currentMood}
              growth={growth}
              chatCount={chatCount}
              streak={streak}
              onMoodSelect={handleMoodSelect}
              onGrowPlant={handleGrowPlant}
            />
          </div>

          {/* Right Panel - Tabs for Chat & Insights */}
          <div className="lg:col-span-2 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat
                  {chatCount > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {chatCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="motivation" className="flex items-center gap-2">
                  <Sprout className="w-4 h-4" />
                  Daily Boost
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
                <ChatInterface
                  mood={currentMood}
                  growth={growth}
                  streak={streak}
                  plantName={plantName}
                />
              </TabsContent>

              <TabsContent value="motivation" className="flex-1 space-y-6 mt-0 overflow-auto">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Daily Motivation & Care
                  </h2>
                  
                  <DailyMotivation mood={currentMood} />
                  
                  <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold mb-4 text-green-800">Personal Growth Tips</h3>
                    <div className="space-y-3 text-sm text-green-700">
                      <p>🌱 <strong>Consistency is key:</strong> Regular check-ins help both you and your plant thrive.</p>
                      <p>🌞 <strong>Celebrate small wins:</strong> Every positive moment contributes to growth.</p>
                      <p>🌧️ <strong>Weather the storms:</strong> Difficult days are part of the journey.</p>
                      <p>💚 <strong>Be patient:</strong> Growth takes time, both for plants and people.</p>
                      <p>🦋 <strong>Find your rhythm:</strong> Listen to your needs and honor your feelings.</p>
                      <p>✨ <strong>You matter:</strong> Your wellbeing is important and worth nurturing.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="flex-1 space-y-6 mt-0 overflow-auto">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Your Growth Journey
                  </h2>
                  
                  <StatsPanel insights={insights} />
                  
                  <div className="mt-8 p-6 bg-gradient-card rounded-lg border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Growth Analysis
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>📊 <strong className="text-foreground">Current Growth:</strong> {growth}% - Your plant reflects your journey</p>
                      <p>🔥 <strong className="text-foreground">Happy Streak:</strong> {streak} days - Consistency builds strength</p>
                      <p>💬 <strong className="text-foreground">Chat Sessions:</strong> {chatCount} - Every conversation matters</p>
                      <p>🎯 <strong className="text-foreground">Next Milestone:</strong> {growth < 25 ? "25% - First bloom" : growth < 50 ? "50% - Steady growth" : growth < 75 ? "75% - Beautiful flowers" : "100% - Full bloom!"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
