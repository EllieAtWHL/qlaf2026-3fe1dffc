import { motion } from 'framer-motion';
import { Check, X, MapPin, Briefcase, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BaseGameCardProps {
  children: React.ReactNode;
  revealed?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
};

export interface RevealGameCardProps extends BaseGameCardProps {
  icon?: React.ReactNode;
  iconAnimation?: boolean;
  borderColor?: string;
  backgroundColor?: string;
}

export interface ImageGameCardProps extends BaseGameCardProps {
  imageUrl: string;
  imageAlt: string;
  revealed?: boolean;
  number?: number;
  text?: string;
  'data-testid'?: string;
}

export interface TextGameCardProps extends BaseGameCardProps {
  text: string;
  revealed?: boolean;
  fontSize?: 'text-md' | 'text-lg' | 'text-2xl' | 'text-3xl';
  fontWeight?: 'font-medium' | 'font-bold';
  'data-testid'?: string;
}

// Base game card with glass effect and animations
export const GameCard = ({ 
  children, 
  revealed = false, 
  onClick, 
  className = '', 
  style,
  'data-testid': dataTestId
}: BaseGameCardProps) => {
  return (
    <motion.div
      key={children?.toString()}
      initial={{ opacity: 1, scale: 1 }}
      animate={{ 
        opacity: 1,
        scale: revealed ? [1, 0.8, 1] : 1,
        rotateY: revealed ? [0, 90, 0] : 0
      }}
      transition={{ 
        duration: 0.6, 
        ease: "easeInOut"
      }}
      onClick={onClick}
      className={cn(
        "aspect-video glass-card rounded-lg p-2 md:p-3 flex flex-col items-center justify-center relative max-h-[28vh] md:max-h-[30vh] transition-colors duration-300 cursor-pointer",
        className
      )}
      style={style}
      data-testid={dataTestId}
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: revealed ? [1, 0, 0, 1] : 1
        }}
        transition={{ 
          duration: 0.8, 
          ease: "easeInOut",
          times: revealed ? [0, 0.3, 0.7, 1] : undefined
        }}
        className="w-full h-full flex flex-col items-center justify-center"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Revealable game card with icon and status
export const RevealGameCard = ({ 
  children, 
  revealed = false, 
  onClick, 
  className = '', 
  icon,
  iconAnimation = true,
  borderColor = 'rgb(59 130 246 / 0.5)',
  backgroundColor = 'bg-green-500/20 text-green-400 border-green-500/30',
  style,
  'data-testid': dataTestId
}: RevealGameCardProps) => {
  return (
    <GameCard
      revealed={revealed}
      onClick={onClick}
      className={cn(
        revealed
          ? backgroundColor
          : 'bg-primary text-primary-foreground',
        className
      )}
      style={{
        borderColor: revealed ? borderColor : 'transparent',
        transitionDelay: revealed ? '0.6s' : '0s',
        ...style
      }}
      data-testid={dataTestId}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-2 md:p-3">
        {iconAnimation && revealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: revealed ? 1 : 0
            }}
            transition={{ 
              duration: 0.2, 
              delay: revealed ? 0.6 : 0
            }}
            className="flex items-center gap-1 mb-2"
          >
            {icon}
          </motion.div>
        )}
        
        {children}
      </div>
    </GameCard>
  );
};

// Game card with image content
export const ImageGameCard = ({ 
  children, 
  imageUrl, 
  imageAlt, 
  revealed = false, 
  onClick, 
  className = '', 
  number,
  text,
  'data-testid': dataTestId
}: ImageGameCardProps) => {
  return (
    <GameCard
      revealed={revealed}
      onClick={onClick}
      className={className}
      data-testid={dataTestId}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-2 md:p-3">
        {!revealed && (
          <div className="absolute top-1 right-1 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center z-10">
            <span className="font-display text-xs md:text-sm font-bold text-primary-foreground">
              {number}
            </span>
          </div>
        )}
        
        {children}
        
        {revealed && (
          <>
            <motion.div 
              className="absolute inset-0 w-full h-full rounded overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <img 
                src={imageUrl} 
                alt={imageAlt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </motion.div>
            
            {/* Text overlay with background for legibility */}
            {text && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm rounded-b-lg p-2 md:p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.2 }}
              >
                <p className="font-body text-sm md:text-base text-white text-center font-medium leading-tight">
                  {text}
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </GameCard>
  );
};

// Game card with text content
export const TextGameCard = ({ 
  children, 
  text, 
  revealed = false, 
  onClick, 
  className = '', 
  fontSize = 'text-md',
  fontWeight = 'font-medium',
  'data-testid': dataTestId
}: TextGameCardProps) => {
  return (
    <GameCard
      revealed={revealed}
      onClick={onClick}
      className={className}
      data-testid={dataTestId}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-2 md:p-3">
        {children}
        
        {!revealed && (
          <div className={cn(
            "text-md md:text-base font-medium text-center text-primary-foreground",
            fontSize === 'text-lg' && "text-lg",
            fontSize === 'text-2xl' && "text-2xl", 
            fontSize === 'text-3xl' && "text-3xl",
            fontWeight === 'font-bold' && "font-bold"
          )}>
            {text}
          </div>
        )}
      </div>
    </GameCard>
  );
};
