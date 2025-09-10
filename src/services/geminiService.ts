import { GoogleGenerativeAI } from '@google/generative-ai';
import { cloudConfig, validateCloudConfig } from '../config/cloudConfig';

// Initialize Gemini AI with cloud configuration
const genAI = new GoogleGenerativeAI(cloudConfig.gemini.apiKey || 'demo-key');

// Validate configuration on service initialization
const isConfigValid = validateCloudConfig();

export class GeminiService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: cloudConfig.gemini.model,
      generationConfig: {
        temperature: cloudConfig.gemini.temperature,
        maxOutputTokens: cloudConfig.gemini.maxTokens
      }
    });
    
    if (!isConfigValid) {
      console.warn('PlantPal: Running in demo mode - AI features may be limited');
    }
  }

  async generatePlantResponse(
    userMessage: string,
    mood: "sad" | "neutral" | "happy",
    growth: number,
    streak: number,
    plantName: string
  ): Promise<string> {
    const moodContext = {
      sad: "feeling down and needs comfort and encouragement",
      neutral: "in a balanced state and appreciates gentle guidance",
      happy: "feeling great and ready for positive energy"
    };

    const growthStage = growth < 30 ? "seedling" : growth < 60 ? "young plant" : "mature plant";
    
    const prompt = `You are ${plantName}, a wise and caring plant companion who has been growing alongside your human friend. You have a warm, nurturing personality and speak with gentle wisdom.

Your current state:
- Growth level: ${growth}/100 (${growthStage})
- Your friend is ${moodContext[mood]}
- Daily streak: ${streak} days
- You've been companions for a while now

Your friend just said: "${userMessage}"

Respond as ${plantName} with:
- Empathy and understanding for their current mood
- Plant-inspired wisdom and metaphors
- Encouragement related to growth and resilience
- Personal connection (reference your shared journey)
- Keep responses warm, concise (2-3 sentences), and authentic
- Use nature metaphors and growth analogies
- Be supportive but not overly cheerful if they're sad

Remember: You're not just an AI, you're their plant companion who has been growing with them. Speak from the heart with plant wisdom.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Fallback responses based on mood
      const fallbacks = {
        sad: `I can feel your sadness, dear friend. Even in the darkest soil, seeds find the strength to reach for light. Let's grow through this together, one day at a time. 🌱`,
        neutral: `Thank you for sharing with me! Like a plant finding its rhythm between seasons, balance is beautiful. I'm here growing alongside you, appreciating this peaceful moment. 🍃`,
        happy: `Your joy fills me with such bright energy! When you're happy, I feel like I'm dancing in the warmest sunlight. Let's celebrate this beautiful moment of growth together! 🌻`
      };
      
      return fallbacks[mood];
    }
  }

  async generateDailyJoke(): Promise<string> {
    const prompt = `Generate a short, wholesome, plant-themed joke that would make someone smile. Keep it light, punny, and nature-related. Just return the joke, nothing else.`;
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      const jokes = [
        "Why don't plants ever get stressed? Because they know how to stay rooted! 🌱",
        "What did the big flower say to the little flower? Hi, bud! 🌸",
        "Why did the gardener plant light bulbs? They wanted to grow a power plant! 💡",
        "What do you call a grumpy gardener? A snap dragon! 🐉",
        "Why don't trees ever feel lonely? Because they always stick together! 🌳"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }
  }

  async generateDailyThought(): Promise<string> {
    const prompt = `Generate an inspiring, motivational thought about personal growth, resilience, or mental health. Use nature metaphors and keep it uplifting and meaningful. 1-2 sentences max.`;
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      const thoughts = [
        "Just like trees grow stronger against the wind, you become more resilient with each challenge you face. 🌲",
        "Every small step forward is like a seed sprouting - progress that may seem invisible but is happening beneath the surface. 🌱",
        "Remember, even the mightiest oak was once an acorn that held its ground. Your potential is limitless. 🌰",
        "Like flowers that bloom in their own season, your growth happens at exactly the right pace for you. 🌺",
        "In nature, there's beauty in every stage of growth - embrace where you are in your journey today. 🍃"
      ];
      return thoughts[Math.floor(Math.random() * thoughts.length)];
    }
  }

  async generateGrowthTip(): Promise<string> {
    const prompt = `Generate a practical, actionable tip for mental health and personal growth. Make it simple, doable, and inspiring. Use plant/nature analogies. Keep it to 1-2 sentences.`;
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      const tips = [
        "Like plants need both sunshine and rain, give yourself permission to feel all emotions - they're all part of your growth. ☀️🌧️",
        "Just as plants turn toward the light, try starting each day by focusing on one thing you're grateful for. 🌅",
        "Plants thrive with consistent care, not perfection - aim for small, daily acts of self-kindness rather than grand gestures. 💚",
        "Like roots that grow stronger in rich soil, nourish your mind with positive influences and supportive relationships. 🌿",
        "Even plants need pruning to grow better - it's okay to let go of habits or thoughts that no longer serve you. ✂️"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
  }
}

export const geminiService = new GeminiService();