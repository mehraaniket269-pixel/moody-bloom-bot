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

    // Calculate growth increment based on mood
    const growthIncrement = data.currentMood === "happy" ? 8 : 
                           data.currentMood === "neutral" ? 5 : 3;

    // Calculate new streak
    let newStreak = data.streak;
    if (data.lastInteraction !== today) {
      // Check if yesterday was a happy day
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const recentLogs = data.moodLogs.filter(log => 
        new Date(log.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      
      if (score >= 60) {
        // Happy mood, continue or start streak
        const yesterdayLog = recentLogs.find(log => log.date === yesterdayStr);
        if (yesterdayLog && yesterdayLog.moodScore >= 60) {
          newStreak = data.streak + 1;
        } else if (data.lastInteraction === yesterdayStr) {
          newStreak = data.streak + 1;
        } else {
          newStreak = 1; // Start new streak
        }
      } else {
        newStreak = 0; // Break streak
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

    return {
      growthIncrement,
      newStreak,
      message: data.currentMood === "happy" ? 
        "Your happiness makes me grow so strong! 🌱✨" :
        data.currentMood === "neutral" ?
        "Thank you for taking care of me today! 🌿" :
        "I'm here for you, even on tough days. We'll grow together. 💚"
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