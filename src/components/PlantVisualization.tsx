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
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setAnimationClass("animate-fade-in");
    const timer = setTimeout(() => setAnimationClass(""), 800);
    return () => clearTimeout(timer);
  }, [growth, mood]);

  // Calculate plant characteristics based on growth and mood
  const stemHeight = Math.max(20, (growth / 100) * 120);
  const leafCount = Math.floor(growth / 15) + 2;
  const flowerCount = growth > 60 ? Math.floor((growth - 60) / 20) + 1 : 0;
  
  const moodColors = {
    sad: { 
      stem: "#8B7355", 
      leaves: "#7F9B6B", 
      pot: "#A0522D",
      soil: "#8B6F47",
      accent: "#9CAF88"
    },
    neutral: { 
      stem: "#6B8E23", 
      leaves: "#90EE90", 
      pot: "#CD853F",
      soil: "#8B7355",
      accent: "#ADDD8E"
    },
    happy: { 
      stem: "#228B22", 
      leaves: "#32CD32", 
      pot: "#DAA520",
      soil: "#8B7355",
      accent: "#90EE90"
    }
  };

  const colors = moodColors[mood];

  const generateLeaves = () => {
    const leaves = [];
    for (let i = 0; i < leafCount; i++) {
      const levelHeight = (i + 1) * (stemHeight / (leafCount + 1));
      const side = i % 2 === 0 ? -1 : 1;
      const baseX = 50;
      const leafX = baseX + side * (15 + Math.sin(i) * 5);
      const leafY = 85 - levelHeight + Math.cos(i) * 3;
      const leafSize = 8 + (growth / 100) * 6 + streak * 0.5;
      const rotation = side * (30 + Math.sin(i * 2) * 15);
      
      // Main leaf
      leaves.push(
        <g key={`leaf-${i}`} className={isHovered ? "animate-pulse" : ""}>
          <ellipse
            cx={leafX}
            cy={leafY}
            rx={leafSize}
            ry={leafSize * 1.5}
            fill={colors.leaves}
            transform={`rotate(${rotation} ${leafX} ${leafY})`}
            className="drop-shadow-sm transition-all duration-500"
            style={{
              filter: `brightness(${isHovered ? 1.2 : 1}) saturate(${mood === 'happy' ? 1.3 : 1})`
            }}
          />
          {/* Leaf vein */}
          <line
            x1={leafX}
            y1={leafY - leafSize}
            x2={leafX}
            y2={leafY + leafSize}
            stroke={colors.stem}
            strokeWidth={0.5}
            transform={`rotate(${rotation} ${leafX} ${leafY})`}
            opacity={0.6}
          />
        </g>
      );
    }
    return leaves;
  };

  const generateFlowers = () => {
    if (flowerCount === 0) return [];
    
    const flowers = [];
    for (let i = 0; i < flowerCount; i++) {
      const flowerX = 50 + (i % 2 === 0 ? -8 : 8) + Math.sin(i) * 3;
      const flowerY = 25 + i * 8;
      
      flowers.push(
        <g key={`flower-${i}`} className={isHovered ? "animate-pulse" : ""}>
          {/* Flower petals */}
          {[0, 72, 144, 216, 288].map((angle, petal) => (
            <ellipse
              key={petal}
              cx={flowerX + Math.cos((angle * Math.PI) / 180) * 3}
              cy={flowerY + Math.sin((angle * Math.PI) / 180) * 3}
              rx={2.5}
              ry={4}
              fill="#FFB6C1"
              transform={`rotate(${angle} ${flowerX} ${flowerY})`}
              className="drop-shadow-sm"
            />
          ))}
          {/* Flower center */}
          <circle cx={flowerX} cy={flowerY} r={2} fill="#FFD700" className="drop-shadow-sm" />
        </g>
      );
    }
    return flowers;
  };

  const generateRoots = () => {
    const roots = [];
    for (let i = 0; i < 3; i++) {
      const rootX = 50 + (i - 1) * 8;
      const rootLength = 8 + (growth / 100) * 6;
      
      roots.push(
        <path
          key={`root-${i}`}
          d={`M ${rootX} 85 Q ${rootX + (i - 1) * 3} ${85 + rootLength / 2} ${rootX + (i - 1) * 5} ${85 + rootLength}`}
          stroke={colors.stem}
          strokeWidth={1.5}
          fill="none"
          opacity={0.4}
        />
      );
    }
    return roots;
  };

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <div 
        className={cn("relative cursor-pointer transition-transform duration-300", animationClass)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        <svg 
          width="280" 
          height="320" 
          viewBox="0 0 100 100" 
          className="drop-shadow-xl"
        >
          {/* Background glow */}
          <circle
            cx={50}
            cy={50}
            r={40}
            fill="url(#plantGlow)"
            opacity={isHovered ? 0.2 : 0.1}
            className="transition-opacity duration-500"
          />
          
          {/* Gradient definitions */}
          <defs>
            <radialGradient id="plantGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colors.accent} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="potGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.pot} />
              <stop offset="30%" stopColor={colors.pot} />
              <stop offset="100%" stopColor="#654321" />
            </linearGradient>
            <linearGradient id="soilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.soil} />
              <stop offset="100%" stopColor="#5D4E37" />
            </linearGradient>
          </defs>
          
          {/* Underground roots */}
          <g opacity={isHovered ? 0.6 : 0}>
            {generateRoots()}
          </g>
          
          {/* Soil surface */}
          <ellipse cx={50} cy={85} rx={20} ry={2} fill="url(#soilGradient)" />
          
          {/* Pot with realistic shading */}
          <path
            d="M 30 85 Q 30 94 50 94 Q 70 94 70 85 L 67 73 L 33 73 Z"
            fill="url(#potGradient)"
            className="drop-shadow-lg"
          />
          {/* Pot rim */}
          <ellipse cx={50} cy={73} rx={18.5} ry={2.5} fill={colors.pot} />
          {/* Pot highlight */}
          <ellipse cx={45} cy={79} rx={3} ry={8} fill="rgba(255,255,255,0.1)" />
          
          {/* Main stem with natural curve */}
          <path
            d={`M 50 85 Q ${48 + Math.sin(growth * 0.1) * 2} ${85 - stemHeight * 0.3} Q ${52 + Math.sin(growth * 0.15) * 1.5} ${85 - stemHeight * 0.7} 50 ${85 - stemHeight}`}
            stroke={colors.stem}
            strokeWidth={3 + (growth / 100) * 2}
            fill="none"
            className="drop-shadow-sm"
          />
          
          {/* Leaves */}
          {generateLeaves()}
          
          {/* Flowers */}
          {generateFlowers()}
          
          {/* Small details - dewdrops if happy */}
          {mood === 'happy' && (
            <g className={isHovered ? "animate-pulse" : ""}>
              <circle cx={58} cy={65} r={0.8} fill="rgba(135,206,235,0.8)" className="animate-pulse" />
              <circle cx={42} cy={55} r={0.6} fill="rgba(135,206,235,0.8)" className="animate-pulse" />
            </g>
          )}
        </svg>
      </div>
      
      {/* Growth info with updated styling */}
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold text-foreground">{growth}%</div>
        <div className="text-sm text-muted-foreground">Growth Level</div>
        {streak > 0 && (
          <div className="bg-gradient-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
            🔥 {streak} day streak!
          </div>
        )}
      </div>
    </div>
  );
};