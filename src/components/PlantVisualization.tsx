import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface PlantVisualizationProps {
  growth: number; // 0-100
  mood: "sad" | "neutral" | "happy";
  streak: number;
  className?: string;
}

export const PlantVisualization = ({ growth, mood, streak, className }: PlantVisualizationProps) => {
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    setAnimationClass("animate-pulse");
    const timer = setTimeout(() => setAnimationClass(""), 1000);
    return () => clearTimeout(timer);
  }, [growth, mood]);

  const stemHeight = Math.max(20, (growth / 100) * 200);
  const leafCount = Math.floor(growth / 20) + 1;
  const branchCount = Math.floor(growth / 30);
  
  const moodColors = {
    sad: { stem: "#8B7355", leaves: "#9CAF88", pot: "#A0522D" },
    neutral: { stem: "#6B8E23", leaves: "#90EE90", pot: "#8B4513" },
    happy: { stem: "#228B22", leaves: "#32CD32", pot: "#8B4513" }
  };

  const colors = moodColors[mood];

  const generateLeaves = () => {
    const leaves = [];
    for (let i = 0; i < leafCount; i++) {
      const angle = (i * 60) + (streak * 10);
      const radius = 15 + (i * 5);
      const x = 50 + Math.cos((angle * Math.PI) / 180) * radius;
      const y = 80 - (i * 20) - (stemHeight * 0.3);
      
      leaves.push(
        <ellipse
          key={`leaf-${i}`}
          cx={x}
          cy={y}
          rx={8 + streak}
          ry={12 + streak * 0.5}
          fill={colors.leaves}
          transform={`rotate(${angle} ${x} ${y})`}
          className="drop-shadow-sm"
        />
      );
    }
    return leaves;
  };

  const generateBranches = () => {
    const branches = [];
    for (let i = 0; i < branchCount; i++) {
      const startY = 80 - (i * 30);
      const angle = i % 2 === 0 ? -30 : 30;
      const endX = 50 + Math.cos((angle * Math.PI) / 180) * 20;
      const endY = startY - 15;
      
      branches.push(
        <line
          key={`branch-${i}`}
          x1={50}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={colors.stem}
          strokeWidth={2}
          className="drop-shadow-sm"
        />
      );
    }
    return branches;
  };

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <div className={cn("relative", animationClass)}>
        <svg 
          width="300" 
          height="350" 
          viewBox="0 0 100 100" 
          className="drop-shadow-lg"
        >
          {/* Background circle for glow effect */}
          <circle
            cx={50}
            cy={50}
            r={45}
            fill="url(#plantGlow)"
            opacity={0.1}
          />
          
          {/* Gradient definitions */}
          <defs>
            <radialGradient id="plantGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colors.leaves} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="potGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.pot} />
              <stop offset="100%" stopColor="#654321" />
            </linearGradient>
          </defs>
          
          {/* Soil */}
          <ellipse cx={50} cy={85} rx={18} ry={4} fill="#4A4A4A" />
          
          {/* Pot */}
          <path
            d="M 32 85 Q 32 92 50 92 Q 68 92 68 85 L 65 75 L 35 75 Z"
            fill="url(#potGradient)"
            className="drop-shadow-md"
          />
          <ellipse cx={50} cy={75} rx={17} ry={3} fill={colors.pot} />
          
          {/* Main stem */}
          <line
            x1={50}
            y1={85}
            x2={50}
            y2={85 - stemHeight * 0.5}
            stroke={colors.stem}
            strokeWidth={3}
            className="drop-shadow-sm"
          />
          
          {/* Branches */}
          {generateBranches()}
          
          {/* Leaves */}
          {generateLeaves()}
          
          {/* Flower (appears at high growth) */}
          {growth > 70 && (
            <g>
              <circle cx={50} cy={20} r={6} fill="#FFB6C1" className="drop-shadow-sm" />
              <circle cx={50} cy={20} r={3} fill="#FF69B4" />
            </g>
          )}
        </svg>
      </div>
      
      {/* Growth info */}
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold text-foreground">{growth}%</div>
        <div className="text-sm text-muted-foreground">Growth Level</div>
        {streak > 0 && (
          <div className="text-xs text-primary font-medium">
            🔥 {streak} day streak!
          </div>
        )}
      </div>
    </div>
  );
};