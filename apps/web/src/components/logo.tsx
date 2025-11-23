export function Logo({ size = "large" }: { size?: "small" | "medium" | "large" }) {
  const sizeClasses = {
    small: "text-lg md:text-xl",
    medium: "text-2xl md:text-4xl",
    large: "text-4xl md:text-5xl lg:text-6xl"
  };

  const paddingClasses = {
    small: "px-2 py-1",
    medium: "px-3 py-2 md:px-4 md:py-3",
    large: "px-4 py-2 md:px-6 md:py-4"
  };

  return (
    <div className="inline-block text-center leading-none">
      <div className="inline-flex flex-wrap justify-center gap-0.5">
        {/* WOMAN */}
        <span className={`${sizeClasses[size]} ${paddingClasses[size]} font-extrabold tracking-tight border-3 border-black bg-yellow text-purple-950 inline-block transition-all hover:scale-105 hover:rotate-[-2deg] cursor-pointer`}>W</span>
        <span className={`${sizeClasses[size]} ${paddingClasses[size]} font-extrabold tracking-tight border-3 border-yellow bg-purple-950 text-yellow inline-block transition-all hover:scale-105 hover:rotate-[-2deg] cursor-pointer`}>O</span>
        <span className={`${sizeClasses[size]} ${paddingClasses[size]} font-extrabold tracking-tight border-3 border-black bg-forestGreen text-yellow inline-block transition-all hover:scale-105 hover:rotate-[-2deg] cursor-pointer`}>M</span>
        <span className={`${sizeClasses[size]} ${paddingClasses[size]} font-extrabold tracking-tight border-3 border-black bg-yellow text-purple-950 inline-block transition-all hover:scale-105 hover:rotate-[-2deg] cursor-pointer`}>A</span>
        <span className={`${sizeClasses[size]} ${paddingClasses[size]} font-extrabold tracking-tight border-3 border-black bg-forestGreen text-yellow inline-block transition-all hover:scale-105 hover:rotate-[-2deg] cursor-pointer`}>N</span>
        
        {/* Line break */}
        <div className="w-full h-2" />
        
        {/* SPLAIN */}
        <span className={`${sizeClasses[size]} ${paddingClasses[size]} font-extrabold tracking-tight border-3 border-yellow bg-purple-950 text-yellow inline-block transition-all hover:scale-105 hover:rotate-[-2deg] cursor-pointer`}>S</span>
        <span className={`${sizeClasses[size]} ${paddingClasses[size]} font-extrabold tracking-tight border-3 border-black bg-forestGreen text-yellow inline-block transition-all hover:scale-105 hover:rotate-[-2deg] cursor-pointer`}>P</span>
        <span className={`${sizeClasses[size]} ${paddingClasses[size]} font-extrabold tracking-tight border-3 border-black bg-yellow text-purple-950 inline-block transition-all hover:scale-105 hover:rotate-[-2deg] cursor-pointer`}>L</span>
        <span className={`${sizeClasses[size]} ${paddingClasses[size]} font-extrabold tracking-tight border-3 border-black bg-forestGreen text-yellow inline-block transition-all hover:scale-105 hover:rotate-[-2deg] cursor-pointer`}>AI</span>
        <span className={`${sizeClasses[size]} ${paddingClasses[size]} font-extrabold tracking-tight border-3 border-yellow bg-purple-950 text-yellow inline-block transition-all hover:scale-105 hover:rotate-[-2deg] cursor-pointer`}>N</span>
      </div>
    </div>
  );
}

