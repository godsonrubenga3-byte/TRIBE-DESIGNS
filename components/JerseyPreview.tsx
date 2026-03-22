import React from 'react';

type TextSize = 'S' | 'M' | 'L';

export interface JerseyPreviewProps {
  mode: 'athletic' | 'printout';
  viewSide: 'front' | 'back';
  torsoColor: string;
  sleeveColor: string;
  collarColor: string;
  collarType?: 'v-neck' | 'crew' | 'polo';
  accentColor: string;
  showMap: boolean;
  name: string;
  number: string;
  nameSize: TextSize;
  numberSize: TextSize;
  athleticFontFamily: string;
  printText: string;
  uploadedImage: string | null;
  frontImage?: string;
  backImage?: string;
}

const JerseyPreview: React.FC<JerseyPreviewProps> = ({
  viewSide,
  torsoColor,
  collarColor,
  name,
  number,
  nameSize,
  numberSize,
  athleticFontFamily,
  frontImage,
  backImage,
}) => {
  
  // Detect mode for logic consistency
  const isLightMode = torsoColor === '#ffffff' || torsoColor.toLowerCase() === 'white';

  // Fallbacks using provided Supabase links
  const defaultFront = frontImage || (isLightMode 
    ? 'https://hsctgucjbzbxmzcgpgga.supabase.co/storage/v1/object/public/assets/light-front.png'
    : 'https://hsctgucjbzbxmzcgpgga.supabase.co/storage/v1/object/public/assets/dark-front.png');
    
  const defaultBack = backImage || (isLightMode 
    ? 'https://hsctgucjbzbxmzcgpgga.supabase.co/storage/v1/object/public/assets/light-back.png'
    : 'https://hsctgucjbzbxmzcgpgga.supabase.co/storage/v1/object/public/assets/dark-back.png');
  
  const currentImage = viewSide === 'front' ? defaultFront : defaultBack;

  // Professional font sizing logic
  const getFontSize = (base: string, size: TextSize) => {
    const scale = size === 'S' ? 0.7 : size === 'M' ? 1 : 1.3;
    return `calc(${base} * ${scale})`;
  };

  return (
    <div className="relative w-full max-w-[400px] aspect-[2/3] transition-all duration-500 transform flex justify-center items-center rounded-[2rem] overflow-hidden shadow-2xl bg-zinc-900/10">
      
      {/* 1. THE PHOTO (Base Layer) */}
      {currentImage ? (
        <img 
            src={currentImage} 
            className="absolute inset-0 w-full h-full object-contain animate-in fade-in duration-700" 
            alt="Jersey Base" 
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-400 font-black uppercase tracking-widest text-[10px]">
            Loading Base Canvas...
        </div>
      )}

      {/* 2. THE CUSTOM OVERLAYS */}
      <div className="absolute inset-0 w-full h-full pointer-events-none flex flex-col items-center">
        
        {viewSide === 'back' && (
            <div className="w-full h-full relative flex flex-col items-center pt-[12%]">
                {/* NUMBER AND NAME - Name on Top, Number Below - Lowered by 40% more */}
                <div className="mt-40 flex flex-col items-center w-full">
                    {/* NAME WITH WRAPPING LOGIC */}
                    {name && (
                        <div className="flex flex-col items-center w-full mb-8">
                            {name.length > 7 && name.includes(' ') ? (
                                <>
                                    <h2 
                                        className="font-black tracking-[0.12em] uppercase text-center w-full truncate leading-none" 
                                        style={{ 
                                            color: collarColor, 
                                            fontFamily: athleticFontFamily, 
                                            fontSize: getFontSize('1.0rem', nameSize) 
                                        }}
                                    >
                                        {name.split(' ')[0]}
                                    </h2>
                                    <h2 
                                        className="font-black tracking-[0.12em] uppercase mt-1 text-center w-full truncate leading-none" 
                                        style={{ 
                                            color: collarColor, 
                                            fontFamily: athleticFontFamily, 
                                            fontSize: getFontSize('1.0rem', nameSize) 
                                        }}
                                    >
                                        {name.split(' ').slice(1).join(' ')}
                                    </h2>
                                </>
                            ) : (
                                <h2 
                                    className="font-black tracking-[0.12em] uppercase text-center w-full truncate leading-none" 
                                    style={{ 
                                        color: collarColor, 
                                        fontFamily: athleticFontFamily, 
                                        fontSize: getFontSize('1.1rem', nameSize) 
                                    }}
                                >
                                    {name}
                                </h2>
                            )}
                        </div>
                    )}

                    {/* NUMBER BELOW NAME */}
                    <span 
                        className="font-black tracking-tighter leading-none drop-shadow-lg filter brightness-110" 
                        style={{ 
                            color: collarColor, 
                            fontFamily: athleticFontFamily, 
                            fontSize: getFontSize('3.5rem', numberSize),
                            textShadow: '0 2px 5px rgba(0,0,0,0.3)'
                        }}
                    >
                        {number}
                    </span>
                </div>

            </div>
        )}
      </div>

      {/* Lighting & Depth Simulation Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/5 mix-blend-overlay pointer-events-none" />
      
      {/* Floor Shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/30 blur-2xl rounded-full" />
    </div>
  );
};

export default JerseyPreview;
