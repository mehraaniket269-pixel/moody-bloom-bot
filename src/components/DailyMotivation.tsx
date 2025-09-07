import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Smile, RefreshCw } from "lucide-react";

interface DailyMotivationProps {
  mood: "sad" | "neutral" | "happy";
}

export const DailyMotivation = ({ mood }: DailyMotivationProps) => {
  const [currentJoke, setCurrentJoke] = useState("");
  const [currentThought, setCurrentThought] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");

  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything! 😄",
    "What do you call a fake noodle? An impasta! 🍝",
    "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
    "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks! 🦕",
    "Why don't eggs tell jokes? They'd crack each other up! 🥚",
    "What's the best thing about Switzerland? I don't know, but the flag is a big plus! 🇨🇭",
    "Why did the math book look so sad? Because it was full of problems! 📚",
    "What do you call a bear with no teeth? A gummy bear! 🐻",
    "Why don't skeletons fight each other? They don't have the guts! 💀",
    "What do you call a sleeping bull? A bulldozer! 🐂"
  ];

  const thoughts = {
    sad: [
      "Every storm runs out of rain. You're stronger than you know. 💙",
      "It's okay to not be okay sometimes. Tomorrow is a new day. 🌅",
      "You've survived 100% of your worst days so far. That's a pretty good track record. 💪",
      "Healing isn't linear, and that's perfectly okay. Take it one step at a time. 🌱",
      "Your feelings are valid. Be gentle with yourself today. 🤗"
    ],
    neutral: [
      "Small steps are still progress. You're moving forward. 🚶‍♀️",
      "Today is a blank canvas. What will you create? 🎨",
      "Progress, not perfection. Every day is a chance to grow. 📈",
      "You don't have to be extraordinary to be worthy of love and respect. ✨",
      "Sometimes the most productive thing you can do is rest. 😌"
    ],
    happy: [
      "Your happiness is contagious! Keep spreading those good vibes. ☀️",
      "You're blooming beautifully. Keep shining your light! 🌟",
      "Celebrate the small wins - they add up to big victories! 🎉",
      "Your positive energy is making the world a brighter place. 🌈",
      "You're proof that good things do happen. Keep being amazing! 🦋"
    ]
  };

  const generateDaily = () => {
    const today = new Date().toDateString();
    
    if (lastUpdate !== today) {
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      const moodThoughts = thoughts[mood];
      const randomThought = moodThoughts[Math.floor(Math.random() * moodThoughts.length)];
      
      setCurrentJoke(randomJoke);
      setCurrentThought(randomThought);
      setLastUpdate(today);
    }
  };

  useEffect(() => {
    generateDaily();
  }, [mood]);

  const refreshContent = () => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    const moodThoughts = thoughts[mood];
    const randomThought = moodThoughts[Math.floor(Math.random() * moodThoughts.length)];
    
    setCurrentJoke(randomJoke);
    setCurrentThought(randomThought);
  };

  return (
    <div className="space-y-4">
      {/* Daily Joke */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-yellow-800">
            <Smile className="w-5 h-5" />
            Today's Joke
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-900 mb-3">{currentJoke}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshContent}
            className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Joke
          </Button>
        </CardContent>
      </Card>

      {/* Daily Thought */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
            <Lightbulb className="w-5 h-5" />
            Daily Motivation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-900 mb-3">{currentThought}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshContent}
            className="text-blue-800 border-blue-300 hover:bg-blue-100"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Thought
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};