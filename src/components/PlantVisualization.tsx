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
  const [breathingAnimation, setBreathingAnimation] = useState(false);

  useEffect(() => {
    setAnimationClass("animate-fade-in");
    const timer = setTimeout(() => setAnimationClass(""), 800);
    return () => clearTimeout(timer);
  }, [growth, mood]);

  // Breathing animation for living effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathingAnimation(prev => !prev);
    }, 3000 + Math.random() * 2000); // Random breathing pattern
    return () => clearInterval(interval);
  }, []);

  // Calculate plant characteristics based on growth, mood, and streak
  const baseStemHeight = Math.max(20, (growth / 100) * 40);
  const stemHeight = baseStemHeight + (streak * 2); // Streak bonus
  const leafCount = Math.max(3, Math.floor(growth / 15) + Math.floor(streak / 2));
  const flowerCount = growth > 60 ? Math.floor((growth - 50) / 20) + Math.floor(streak / 3) : 0;
  const hasButterfly = mood === "happy" && streak > 5;
  
  const moodColors = {
    sad: { 
      stem: "#6B4423", 
      leaves: "#7A8471", 
      pot: "#8B4513",
      soil: "#654321",
      accent: "#9CAF88",
      glow: "#8B9A8B"
    },
    neutral: { 
      stem: "#5D4E37", 
      leaves: "#32A852", 
      pot: "#CD853F",
      soil: "#8B7355",
      accent: "#90EE90",
      glow: "#A8D8A8"
    },
    happy: { 
      stem: "#4A5D23", 
      leaves: "#32CD32", 
      pot: "#DAA520",
      soil: "#8B7355",
      accent: "#ADFF2F",
      glow: "#ADFF2F"
    }
  };

  const colors = moodColors[mood];

  const generateLeaves = () => {
    const leaves = [];
    for (let i = 0; i < leafCount; i++) {
      const levelHeight = (i + 1) * (stemHeight / (leafCount + 1.5));
      const side = i % 2 === 0 ? -1 : 1;
      const baseX = 50;
      const leafX = baseX + side * (6 + Math.sin(i * 0.8) * 2 + (streak * 0.5));
      const leafY = 75 - levelHeight;
      const leafSize = 3 + (growth / 100) * 2.5 + (streak * 0.2);
      const rotation = side * (15 + Math.sin(i * 1.2) * 8);
      const breathingOffset = breathingAnimation ? Math.sin(i * 0.5) * 0.3 : 0;
      
      // Enhanced leaf with natural shape
      leaves.push(
        <g key={`leaf-${i}`} 
           className={isHovered ? "animate-pulse" : ""}
           style={{
             transform: `translate(${breathingOffset}px, ${breathingOffset * 0.5}px)`,
             transition: 'transform 2s ease-in-out'
           }}>
          {/* Leaf shadow for depth */}
          <ellipse
            cx={leafX + 0.5}
            cy={leafY + 0.5}
            rx={leafSize}
            ry={leafSize * 1.6}
            fill="rgba(0,0,0,0.1)"
            transform={`rotate(${rotation} ${leafX + 0.5} ${leafY + 0.5})`}
          />
          {/* Main leaf with natural texture */}
          <ellipse
            cx={leafX}
            cy={leafY}
            rx={leafSize}
            ry={leafSize * 1.6}
            fill={colors.leaves}
            transform={`rotate(${rotation} ${leafX} ${leafY})`}
            className="drop-shadow-sm transition-all duration-700"
            style={{
              filter: `brightness(${isHovered ? 1.2 : 1 + (mood === 'happy' ? 0.1 : 0)}) saturate(${mood === 'happy' ? 1.4 : mood === 'sad' ? 0.8 : 1})`
            }}
          />
          {/* Leaf highlight */}
          <ellipse
            cx={leafX - side * 0.8}
            cy={leafY - 0.5}
            rx={leafSize * 0.3}
            ry={leafSize * 0.8}
            fill="rgba(255,255,255,0.2)"
            transform={`rotate(${rotation} ${leafX} ${leafY})`}
          />
          {/* Enhanced leaf veins */}
          <line
            x1={leafX}
            y1={leafY - leafSize * 1.2}
            x2={leafX}
            y2={leafY + leafSize * 1.2}
            stroke={colors.stem}
            strokeWidth={0.4}
            transform={`rotate(${rotation} ${leafX} ${leafY})`}
            opacity={0.6}
          />
          {/* Side veins */}
          <line
            x1={leafX - side * leafSize * 0.4}
            y1={leafY - leafSize * 0.4}
            x2={leafX}
            y2={leafY}
            stroke={colors.stem}
            strokeWidth={0.2}
            transform={`rotate(${rotation} ${leafX} ${leafY})`}
            opacity={0.4}
          />
          <line
            x1={leafX - side * leafSize * 0.4}
            y1={leafY + leafSize * 0.4}
            x2={leafX}
            y2={leafY}
            stroke={colors.stem}
            strokeWidth={0.2}
            transform={`rotate(${rotation} ${leafX} ${leafY})`}
            opacity={0.4}
          />
          {/* Leaf connection to stem */}
          <line
            x1={50}
            y1={leafY}
            x2={leafX - side * 1.5}
            y2={leafY}
            stroke={colors.stem}
            strokeWidth={1.2}
            opacity={0.7}
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
      const flowerX = 50 + (i % 2 === 0 ? -4 : 4) + Math.sin(i * 2) * 2;
      const flowerY = 45 - (stemHeight * 0.8) + i * 4;
      const flowerSize = 1.2 + (streak * 0.1);
      const breathingScale = breathingAnimation ? 1.05 : 1;
      
      flowers.push(
        <g key={`flower-${i}`} 
           className={isHovered ? "animate-pulse" : ""}
           style={{
             transform: `scale(${breathingScale})`,
             transformOrigin: `${flowerX}px ${flowerY}px`,
             transition: 'transform 2s ease-in-out'
           }}>
          {/* Flower shadow */}
          <circle cx={flowerX + 0.3} cy={flowerY + 0.3} r={flowerSize * 2} fill="rgba(0,0,0,0.1)" />
          
          {/* Flower petals with gradient */}
          {[0, 60, 120, 180, 240, 300].map((angle, petal) => (
            <ellipse
              key={petal}
              cx={flowerX + Math.cos((angle * Math.PI) / 180) * flowerSize}
              cy={flowerY + Math.sin((angle * Math.PI) / 180) * flowerSize}
              rx={flowerSize}
              ry={flowerSize * 1.8}
              fill={mood === 'happy' ? "#FF69B4" : mood === 'neutral' ? "#FFB6C1" : "#DDA0DD"}
              transform={`rotate(${angle} ${flowerX} ${flowerY})`}
              className="drop-shadow-sm"
              style={{
                filter: `brightness(${isHovered ? 1.2 : 1}) saturate(${mood === 'happy' ? 1.3 : 1})`
              }}
            />
          ))}
          
          {/* Flower center with detail */}
          <circle cx={flowerX} cy={flowerY} r={flowerSize * 0.8} fill="#FFD700" className="drop-shadow-sm" />
          <circle cx={flowerX} cy={flowerY} r={flowerSize * 0.4} fill="#FFA500" />
          
          {/* Tiny pollen dots */}
          {mood === 'happy' && [0, 1, 2].map(dot => (
            <circle
              key={dot}
              cx={flowerX + Math.cos(dot * 2) * 0.3}
              cy={flowerY + Math.sin(dot * 2) * 0.3}
              r={0.1}
              fill="#FFFF99"
              className="animate-pulse"
            />
          ))}
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
          {/* Living energy aura */}
          <circle
            cx={50}
            cy={45}
            r={40}
            fill="url(#plantGlow)"
            opacity={mood === 'happy' ? 0.2 : mood === 'neutral' ? 0.12 : 0.06}
            className="transition-opacity duration-1000"
            style={{
              transform: breathingAnimation ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 3s ease-in-out, opacity 1s ease-in-out'
            }}
          />
          
          {/* Mood-based energy rings */}
          {mood === 'happy' && (
            <>
              <circle cx={50} cy={45} r={35} fill="none" stroke={colors.glow} strokeWidth="0.5" opacity="0.3" className="animate-pulse" />
              <circle cx={50} cy={45} r={30} fill="none" stroke={colors.accent} strokeWidth="0.3" opacity="0.2" className="animate-pulse" style={{animationDelay: '1s'}} />
            </>
          )}
          
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
          
          {/* Main stem with living movement */}
          <path
            d={`M 50 75 Q ${49 + Math.sin(growth * 0.1) + (breathingAnimation ? 0.3 : 0)} ${75 - stemHeight * 0.3} Q ${51 + Math.sin(growth * 0.15) * 0.8 + (breathingAnimation ? -0.3 : 0)} ${75 - stemHeight * 0.7} 50 ${75 - stemHeight}`}
            stroke={colors.stem}
            strokeWidth={2.2 + (growth / 100) * 1.5 + (streak * 0.1)}
            fill="none"
            className="drop-shadow-sm transition-all duration-1000"
            strokeLinecap="round"
            style={{
              filter: `brightness(${mood === 'happy' ? 1.1 : mood === 'sad' ? 0.9 : 1})`
            }}
          />
          
          {/* Stem texture lines */}
          <path
            d={`M 49.5 75 Q ${48.8 + Math.sin(growth * 0.1)} ${75 - stemHeight * 0.3} Q ${50.2 + Math.sin(growth * 0.15) * 0.8} ${75 - stemHeight * 0.7} 49.5 ${75 - stemHeight}`}
            stroke={colors.stem}
            strokeWidth={0.3}
            fill="none"
            opacity={0.6}
            strokeLinecap="round"
          />
          
          {/* Leaves */}
          {generateLeaves()}
          
          {/* Flowers */}
          {generateFlowers()}
          
          {/* Living details */}
          {mood === 'happy' && (
            <g className="transition-opacity duration-1000">
              {/* Dewdrops */}
              <circle cx={55} cy={60} r={0.6} fill="rgba(135,206,250,0.9)" className="animate-pulse" />
              <circle cx={45} cy={55} r={0.4} fill="rgba(135,206,250,0.8)" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <circle cx={52} cy={50} r={0.3} fill="rgba(135,206,250,0.7)" className="animate-pulse" style={{animationDelay: '1s'}} />
              
              {/* Sparkles around plant */}
              <circle cx={38} cy={50} r={0.3} fill="#FFD700" className="animate-pulse" style={{animationDelay: '2s'}} />
              <circle cx={62} cy={45} r={0.2} fill="#FFD700" className="animate-pulse" style={{animationDelay: '1.5s'}} />
            </g>
          )}
          
          {/* Butterfly friend for high streaks */}
          {hasButterfly && (
            <g className="animate-pulse">
              <ellipse cx={65} cy={35} rx={1.5} ry={0.8} fill="#FF69B4" transform="rotate(15 65 35)" />
              <ellipse cx={67} cy={35} rx={1.2} ry={0.6} fill="#FFB6C1" transform="rotate(15 67 35)" />
              <circle cx={66} cy={35} r={0.2} fill="#8B4513" />
            </g>
          )}
          
          {/* Breathing particles for living effect */}
          {breathingAnimation && (
            <g className="transition-opacity duration-2000">
              <circle cx={50} cy={30} r={0.5} fill={colors.accent} opacity="0.4" />
              <circle cx={52} cy={25} r={0.3} fill={colors.accent} opacity="0.3" />
              <circle cx={48} cy={28} r={0.4} fill={colors.accent} opacity="0.2" />
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