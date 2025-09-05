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
  const stemHeight = Math.max(15, (growth / 100) * 35);
  const leafCount = Math.max(2, Math.floor(growth / 20) + 1);
  const flowerCount = growth > 70 ? Math.floor((growth - 60) / 25) + 1 : 0;
  
  const moodColors = {
    sad: { 
      stem: "#6B4423", 
      leaves: "#7A8471", 
      pot: "#8B4513",
      soil: "#654321",
      accent: "#9CAF88"
    },
    neutral: { 
      stem: "#5D4E37", 
      leaves: "#228B22", 
      pot: "#CD853F",
      soil: "#8B7355",
      accent: "#90EE90"
    },
    happy: { 
      stem: "#4A5D23", 
      leaves: "#32CD32", 
      pot: "#DAA520",
      soil: "#8B7355",
      accent: "#ADFF2F"
    }
  };

  const colors = moodColors[mood];

  const generateLeaves = () => {
    const leaves = [];
    for (let i = 0; i < leafCount; i++) {
      const levelHeight = (i + 1) * (stemHeight / (leafCount + 2));
      const side = i % 2 === 0 ? -1 : 1;
      const baseX = 50;
      const leafX = baseX + side * (8 + Math.sin(i * 0.5) * 2);
      const leafY = 83 - levelHeight;
      const leafSize = 4 + (growth / 100) * 3 + streak * 0.3;
      const rotation = side * (20 + Math.sin(i * 1.5) * 10);
      
      // Main leaf
      leaves.push(
        <g key={`leaf-${i}`} className={isHovered ? "animate-pulse" : ""}>
          <ellipse
            cx={leafX}
            cy={leafY}
            rx={leafSize}
            ry={leafSize * 1.8}
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
            y1={leafY - leafSize * 1.2}
            x2={leafX}
            y2={leafY + leafSize * 1.2}
            stroke={colors.stem}
            strokeWidth={0.3}
            transform={`rotate(${rotation} ${leafX} ${leafY})`}
            opacity={0.7}
          />
          {/* Leaf connection to stem */}
          <line
            x1={50}
            y1={leafY}
            x2={leafX - side * 2}
            y2={leafY}
            stroke={colors.stem}
            strokeWidth={1}
            opacity={0.8}
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
      const flowerX = 50 + (i % 2 === 0 ? -3 : 3);
      const flowerY = 55 - stemHeight + i * 5;
      
      flowers.push(
        <g key={`flower-${i}`} className={isHovered ? "animate-pulse" : ""}>
          {/* Flower petals */}
          {[0, 72, 144, 216, 288].map((angle, petal) => (
            <ellipse
              key={petal}
              cx={flowerX + Math.cos((angle * Math.PI) / 180) * 1.5}
              cy={flowerY + Math.sin((angle * Math.PI) / 180) * 1.5}
              rx={1.5}
              ry={2.5}
              fill="#FFB6C1"
              transform={`rotate(${angle} ${flowerX} ${flowerY})`}
              className="drop-shadow-sm"
            />
          ))}
          {/* Flower center */}
          <circle cx={flowerX} cy={flowerY} r={1} fill="#FFD700" className="drop-shadow-sm" />
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
          width="300" 
          height="320" 
          viewBox="0 0 100 90" 
          className="drop-shadow-xl"
        >
          {/* Background glow */}
          <circle
            cx={50}
            cy={45}
            r={35}
            fill="url(#plantGlow)"
            opacity={isHovered ? 0.15 : 0.08}
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
          <g opacity={isHovered ? 0.4 : 0}>
            {generateRoots()}
          </g>
          
          {/* Soil surface */}
          <ellipse cx={50} cy={83} rx={16} ry={1.5} fill="url(#soilGradient)" />
          
          {/* Pot with realistic shading */}
          <path
            d="M 34 83 Q 34 88 50 88 Q 66 88 66 83 L 64 75 L 36 75 Z"
            fill="url(#potGradient)"
            className="drop-shadow-lg"
          />
          {/* Pot rim */}
          <ellipse cx={50} cy={75} rx={15} ry={2} fill={colors.pot} />
          {/* Pot highlight */}
          <ellipse cx={47} cy={79} rx={2} ry={5} fill="rgba(255,255,255,0.15)" />
          
          {/* Main stem with natural curve */}
          <path
            d={`M 50 83 Q ${49 + Math.sin(growth * 0.1)} ${83 - stemHeight * 0.4} Q ${51 + Math.sin(growth * 0.15) * 0.8} ${83 - stemHeight * 0.8} 50 ${83 - stemHeight}`}
            stroke={colors.stem}
            strokeWidth={2.5 + (growth / 100) * 1}
            fill="none"
            className="drop-shadow-sm"
            strokeLinecap="round"
          />
          
          {/* Leaves */}
          {generateLeaves()}
          
          {/* Flowers */}
          {generateFlowers()}
          
          {/* Small details - dewdrops if happy */}
          {mood === 'happy' && (
            <g className={isHovered ? "animate-pulse" : ""}>
              <circle cx={55} cy={70} r={0.6} fill="rgba(135,206,235,0.8)" className="animate-pulse" />
              <circle cx={45} cy={65} r={0.4} fill="rgba(135,206,235,0.8)" className="animate-pulse" />
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