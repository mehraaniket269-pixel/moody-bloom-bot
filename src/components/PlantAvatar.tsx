import { cn } from "@/lib/utils";

interface PlantAvatarProps {
  size?: "sm" | "md" | "lg";
  mood?: "sad" | "neutral" | "happy";
  className?: string;
}

export const PlantAvatar = ({ size = "md", mood = "neutral", className }: PlantAvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const moodColors = {
    sad: "bg-plant-sad",
    neutral: "bg-plant-neutral", 
    happy: "bg-plant-happy"
  };

  return (
    <div className={cn(
      "rounded-full flex items-center justify-center",
      sizeClasses[size],
      moodColors[mood],
      className
    )}>
      <svg 
        viewBox="0 0 24 24" 
        className="w-2/3 h-2/3 fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C10.343 2 9 3.343 9 5c0 .5.133.967.357 1.375C7.04 7.135 6 9.135 6 11.5V20a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8.5c0-2.365-1.04-4.365-3.357-5.125C14.867 5.967 15 5.5 15 5c0-1.657-1.343-3-3-3z"/>
        <circle cx="9" cy="4" r="1.5"/>
        <circle cx="15" cy="4" r="1.5"/>
        <path d="M7 3c0-.552.448-1 1-1s1 .448 1 1-.448 1-1 1-1-.448-1-1z"/>
        <path d="M15 3c0-.552.448-1 1-1s1 .448 1 1-.448 1-1 1-1-.448-1-1z"/>
      </svg>
    </div>
  );
};