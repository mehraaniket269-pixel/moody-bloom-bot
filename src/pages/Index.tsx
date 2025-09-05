import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlantVisualization } from "@/components/PlantVisualization";
import { ChatInterface } from "@/components/ChatInterface";
import { MoodTracker } from "@/components/MoodTracker";
import { StatsPanel } from "@/components/StatsPanel";
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
      title: "Plant Growing! 🌿",
      description: result.message
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
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat
                  {chatCount > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {chatCount}
                    </Badge>
                  )}
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

              <TabsContent value="insights" className="flex-1 space-y-6 mt-0">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Your Growth Journey
                  </h2>
                  
                  <StatsPanel insights={insights} />
                  
                  <div className="mt-8 p-6 bg-gradient-card rounded-lg border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Personal Growth Tips
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">Daily Check-ins:</strong> Regular mood tracking helps identify patterns and triggers in your emotional well-being.
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">Growth Mindset:</strong> Like plants, personal growth takes time. Celebrate small victories and be patient with yourself.
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">Consistency Wins:</strong> Your {streak}-day streak shows that small, consistent actions lead to meaningful change.
                        </p>
                      </div>
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
