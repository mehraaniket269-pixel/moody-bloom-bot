import { useState, useEffect } from "react";

interface MoodLog {
  date: string;
  mood: "sad" | "neutral" | "happy";
  moodScore: number;
}

interface PlantData {
  growth: number;
  chatCount: number;
  streak: number;
  currentMood: "sad" | "neutral" | "happy";
  moodLogs: MoodLog[];
  plantName: string;
  lastInteraction: string;
}

const STORAGE_KEY = "plant-companion-data";

const initialData: PlantData = {
  growth: 26,
  chatCount: 7,
  streak: 0,
  currentMood: "neutral",
  moodLogs: [],
  plantName: "Little Sprout",
  lastInteraction: new Date().toISOString().split('T')[0]
};

export const usePlantData = () => {
  const [data, setData] = useState<PlantData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...initialData, ...JSON.parse(stored) } : initialData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateMood = (mood: "sad" | "neutral" | "happy") => {
    setData(prev => ({
      ...prev,
      currentMood: mood
    }));
  };

  const growPlant = () => {
    const today = new Date().toISOString().split('T')[0];
    const moodScores = { sad: 25, neutral: 50, happy: 85 };
    const score = moodScores[data.currentMood];

    // Enhanced growth calculation based on mood and consistency
    const basegrowthIncrement = data.currentMood === "happy" ? 8 : 
                               data.currentMood === "neutral" ? 5 : 3;
    
    // Bonus growth for streaks
    const streakBonus = Math.min(data.streak * 0.5, 5);
    const growthIncrement = basegrowthIncrement + streakBonus;

    // Enhanced streak calculation
    let newStreak = data.streak;
    if (data.lastInteraction !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // Check consecutive days of positive mood
      if (score >= 60) { // Happy or very positive neutral
        if (data.lastInteraction === yesterdayStr && data.streak >= 0) {
          newStreak = data.streak + 1;
        } else {
          // Check if we skipped only one day
          const dayBeforeYesterday = new Date();
          dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
          const dayBeforeYesterdayStr = dayBeforeYesterday.toISOString().split('T')[0];
          
          if (data.lastInteraction === dayBeforeYesterdayStr) {
            newStreak = 1; // Restart streak with grace period
          } else {
            newStreak = 1; // Start new streak
          }
        }
      } else if (score >= 45) { // Neutral - maintain streak but don't grow it
        // Don't break streak for neutral days, but don't increase it either
        if (data.lastInteraction === yesterdayStr) {
          newStreak = data.streak;
        } else {
          newStreak = Math.max(0, data.streak - 1);
        }
      } else {
        // Sad days reduce streak more gradually
        newStreak = Math.max(0, data.streak - 2);
      }
    }

    // Add mood log
    const newMoodLog: MoodLog = {
      date: today,
      mood: data.currentMood,
      moodScore: score
    };

    setData(prev => ({
      ...prev,
      growth: Math.min(100, prev.growth + growthIncrement),
      chatCount: prev.chatCount + 1,
      streak: newStreak,
      moodLogs: [...prev.moodLogs.filter(log => log.date !== today), newMoodLog],
      lastInteraction: today
    }));

    // Enhanced motivational messages
    const getPlantMessage = () => {
      if (data.currentMood === "happy") {
        if (newStreak > 5) return "WOW! Your happiness streak is making me bloom like never before! 🌸✨";
        if (newStreak > 2) return "Your consistent happiness is helping me grow so beautifully! 🌱💖";
        return "Your joy fills me with life! I can feel myself growing stronger! 🌟";
      } else if (data.currentMood === "neutral") {
        if (newStreak > 3) return "Your steady care means everything to me. We're thriving together! 🌿";
        return "Thank you for nurturing me today. Every bit of care helps me grow! 🌱";
      } else {
        if (data.streak > 0) return "Even on tough days, our bond keeps me strong. We'll weather this together. 💚🌧️";
        return "I'm here with you through the storms. Together we'll find sunlight again. 🌱💙";
      }
    };

    return {
      growthIncrement,
      newStreak,
      message: getPlantMessage(),
      streakBonus: streakBonus > 0 ? `+${streakBonus.toFixed(1)} streak bonus!` : null
    };
  };

  const getMoodHistory = (days: number = 30) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return data.moodLogs
      .filter(log => new Date(log.date) >= cutoff)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getInsights = () => {
    const recentLogs = getMoodHistory(7);
    const happyDays = recentLogs.filter(log => log.mood === "happy").length;
    const averageMood = recentLogs.length > 0 ? 
      recentLogs.reduce((sum, log) => sum + log.moodScore, 0) / recentLogs.length : 50;

    return {
      weeklyHappyDays: happyDays,
      averageWeeklyMood: averageMood,
      totalInteractions: data.chatCount,
      currentStreak: data.streak,
      growthLevel: data.growth
    };
  };

  return {
    ...data,
    updateMood,
    growPlant,
    getMoodHistory,
    getInsights
  };
};