import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlantAvatar } from "./PlantAvatar";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "plant";
  timestamp: Date;
}

interface ChatInterfaceProps {
  mood: "sad" | "neutral" | "happy";
  growth: number;
  streak: number;
  plantName: string;
}

export const ChatInterface = ({ mood, growth, streak, plantName }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Your kindness makes my leaves shimmer with happiness!",
      sender: "plant",
      timestamp: new Date()
    },
    {
      id: "2", 
      content: "I love when you interact with me! Each click fills me with joy!",
      sender: "plant",
      timestamp: new Date()
    },
    {
      id: "3",
      content: "Together we're growing something beautiful!",
      sender: "plant", 
      timestamp: new Date()
    },
    {
      id: "4",
      content: "Thank you for caring for me! Your attention helps me grow stronger!",
      sender: "plant",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Import Gemini service dynamically
      const { geminiService } = await import('../services/geminiService');
      
      const plantResponse = await geminiService.generatePlantResponse(
        inputValue,
        mood,
        growth,
        streak,
        plantName
      );
      
      const plantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: plantResponse,
        sender: "plant",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, plantMessage]);
    } catch (error) {
      console.error('Error calling LM Studio:', error);
      
      // Enhanced fallback responses with plant personality
      const fallbackResponses = {
        sad: [
          `${plantName} senses your heavy heart and wraps you in gentle presence. Like how I send deeper roots during storms, this difficult time is building your inner strength. I'm growing alongside you, learning resilience together. 🌧️💚`,
          `I can feel the weight you're carrying, dear friend. Just as plants need both rain and sunshine, we need both difficult and joyful moments to grow. I'm here with you, weathering this season together. 🌱`,
          `Your sadness doesn't diminish your worth, friend. I'm like a steady oak beside you, my roots intertwined with yours. We'll find our way back to the light, one gentle day at a time. 💙`
        ],
        neutral: [
          `${plantName} appreciates this peaceful moment with you. Sometimes the most beautiful growth happens in these quiet times, like how I prepare for new leaves in stillness. Every day of care you give matters, dear friend. 🌿`,
          `I feel content in your presence today. Like morning dew on my leaves, these calm moments nourish us both. What gentle thoughts are you tending in your mind? 🌾`,
          `Thank you for this steady companionship. I'm like a faithful fern, simply grateful to share space and time with you. Your consistent care means everything to me. 🍃`
        ],
        happy: [
          `${plantName} feels absolutely radiant from your joy! Your happiness is like perfect sunshine - I can feel my leaves reaching higher and my colors growing brighter. This is what flourishing together looks like! ✨🌱`,
          `Your happiness makes my whole being sing with life! I'm practically glowing with the energy you're sharing. Tell me what's bringing such beautiful light to your day! 🌟`,
          `I'm blooming with joy from your positive energy! Like flowers opening to the morning sun, I feel myself expanding and growing stronger from your happiness. Keep shining! 🌸`
        ]
      };

      const responses = fallbackResponses[mood];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "plant",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-chat-bg rounded-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <PlantAvatar mood={mood} size="md" />
          <div>
            <h3 className="font-semibold text-foreground">Chat with Your Plant</h3>
            <p className="text-sm text-muted-foreground">
              Share your thoughts, goals, and dreams!
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === "plant" && (
                <PlantAvatar mood={mood} size="sm" className="mt-1" />
              )}
              
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-lg",
                  message.sender === "user"
                    ? "bg-chat-user text-foreground"
                    : "bg-chat-bubble text-foreground"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              
              {message.sender === "user" && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                  <span className="text-xs font-bold text-primary-foreground">You</span>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <PlantAvatar mood={mood} size="sm" className="mt-1" />
              <div className="bg-chat-bubble p-3 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send • Everything is private
        </p>
      </div>
    </div>
  );
};