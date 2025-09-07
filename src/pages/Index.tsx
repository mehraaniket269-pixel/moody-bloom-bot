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
    <div className="h-screen bg-gradient-background flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <header className="border-b border-border bg-card/95 backdrop-blur-sm z-50 flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
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
              <Badge variant="outline" className="text-green-600 border-green-300">
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

      {/* Main Content - Flex container without overflow */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Plant & Mood (Fixed, no scroll) */}
        <div className="w-80 bg-card/50 backdrop-blur-sm border-r border-border flex-shrink-0">
          <div className="h-full flex flex-col p-6">
            
            {/* Plant Visualization - Fixed position */}
            <div className="text-center mb-6">
              <PlantVisualization
                growth={growth}
                mood={currentMood}
                streak={streak}
              />
            </div>
            
            {/* Mood Tracker - Fixed position */}
            <div className="flex-shrink-0">
              <MoodTracker
                currentMood={currentMood}
                growth={growth}
                chatCount={chatCount}
                streak={streak}
                onMoodSelect={handleMoodSelect}
                onGrowPlant={handleGrowPlant}
              />
            </div>
          </div>
        </div>

        {/* Right Main Area - Tabbed Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            
            {/* Tab Headers - Fixed */}
            <div className="border-b border-border bg-card/30 backdrop-blur-sm px-6 py-4 flex-shrink-0">
              <TabsList className="grid w-full max-w-md grid-cols-3">
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
            </div>

            {/* Tab Content - Scrollable only for specific content */}
            <div className="flex-1 overflow-hidden">
              
              {/* Chat Tab - Only this scrolls */}
              <TabsContent value="chat" className="h-full m-0 p-6">
                <div className="h-full">
                  <ChatInterface
                    mood={currentMood}
                    growth={growth}
                    streak={streak}
                    plantName={plantName}
                  />
                </div>
              </TabsContent>

              {/* Daily Motivation Tab - Controlled scroll */}
              <TabsContent value="motivation" className="h-full m-0 overflow-auto">
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      Daily Motivation & Care
                    </h2>
                    
                    <DailyMotivation mood={currentMood} />
                    
                    <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <h3 className="text-lg font-semibold mb-4 text-green-800">Personal Growth Tips</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                        <div className="space-y-3">
                          <p>🌱 <strong>Consistency is key:</strong> Regular check-ins help both you and your plant thrive.</p>
                          <p>🌞 <strong>Celebrate small wins:</strong> Every positive moment contributes to growth.</p>
                          <p>🌧️ <strong>Weather the storms:</strong> Difficult days are part of the journey.</p>
                        </div>
                        <div className="space-y-3">
                          <p>💚 <strong>Be patient:</strong> Growth takes time, both for plants and people.</p>
                          <p>🦋 <strong>Find your rhythm:</strong> Listen to your needs and honor your feelings.</p>
                          <p>✨ <strong>You matter:</strong> Your wellbeing is important and worth nurturing.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Insights Tab - Controlled scroll */}
              <TabsContent value="insights" className="h-full m-0 overflow-auto">
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      Your Growth Journey
                    </h2>
                    
                    <StatsPanel insights={insights} />
                    
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Growth Analysis */}
                      <div className="p-6 bg-gradient-card rounded-lg border border-border">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Growth Analysis
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                            <span className="text-muted-foreground">📊 Current Growth</span>
                            <span className="font-semibold text-foreground">{growth}%</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                            <span className="text-muted-foreground">🔥 Happy Streak</span>
                            <span className="font-semibold text-foreground">{streak} days</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                            <span className="text-muted-foreground">💬 Chat Sessions</span>
                            <span className="font-semibold text-foreground">{chatCount}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Next Milestones */}
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                        <h3 className="text-lg font-semibold text-purple-800 mb-4">
                          Next Milestone
                        </h3>
                        <div className="text-center">
                          <div className="text-3xl mb-2">
                            {growth < 25 ? "🌱" : growth < 50 ? "🌿" : growth < 75 ? "🌸" : "🌺"}
                          </div>
                          <p className="text-purple-700 font-medium">
                            {growth < 25 ? "25% - First Bloom" : 
                             growth < 50 ? "50% - Steady Growth" : 
                             growth < 75 ? "75% - Beautiful Flowers" : 
                             "100% - Full Bloom Achieved!"}
                          </p>
                          <div className="w-full bg-purple-200 rounded-full h-2 mt-3">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${growth}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
