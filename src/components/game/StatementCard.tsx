"use client";

import { cn, vibrate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChoiceLetter } from "@/types";
import { Check, X, Sparkles } from "lucide-react";

interface StatementCardProps {
  letter: ChoiceLetter;
  text: string;
  isSelected?: boolean;
  isRevealed?: boolean;
  isLie?: boolean;
  isCorrectGuess?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  delay?: number;
}

const cardColors = {
  A: {
    bg: "bg-gradient-to-br from-[#FFECD2] to-[#FCB69F]",
    border: "border-[#FFB088]",
    selected: "ring-4 ring-[#FF9A8B] ring-offset-2",
  },
  B: {
    bg: "bg-gradient-to-br from-[#E8E0F0] to-[#C4B5DC]",
    border: "border-[#B8A9C9]",
    selected: "ring-4 ring-[#9D8AB4] ring-offset-2",
  },
  C: {
    bg: "bg-gradient-to-br from-[#D4EDDA] to-[#A8E6CF]",
    border: "border-[#7DDBA3]",
    selected: "ring-4 ring-[#5DC48C] ring-offset-2",
  },
};

export function StatementCard({
  letter,
  text,
  isSelected = false,
  isRevealed = false,
  isLie = false,
  isCorrectGuess = false,
  onClick,
  disabled = false,
  delay = 0,
}: StatementCardProps) {
  const colors = cardColors[letter];

  const handleClick = () => {
    if (!disabled && onClick) {
      vibrate(10);
      onClick();
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        delay: delay * 0.1 
      }}
      whileHover={disabled ? {} : { scale: 1.02, y: -4 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "relative w-full p-5 rounded-2xl border-2 text-left transition-all duration-200",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-primary-light)]",
        colors.bg,
        colors.border,
        isSelected && !isRevealed && colors.selected,
        disabled && !isRevealed && "opacity-60 cursor-not-allowed",
        !disabled && !isRevealed && "cursor-pointer hover:shadow-lg",
        isRevealed && isLie && "ring-4 ring-[var(--warning)] ring-offset-2 bg-gradient-to-br from-[var(--warning-light)] to-[var(--warning)]",
        isRevealed && !isLie && "opacity-75"
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          "text-sm font-bold text-white shadow-md",
          isRevealed && isLie ? "bg-[var(--warning)]" : "bg-white/40 text-[var(--text-primary)]"
        )}>
          {letter}
        </span>
        <p className={cn(
          "flex-1 text-base leading-relaxed font-medium",
          isRevealed && isLie ? "text-white" : "text-[var(--text-primary)]"
        )}>
          {text}
        </p>
      </div>

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className={cn(
              "absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
              isLie ? "bg-[var(--warning)]" : "bg-[var(--success)]"
            )}
          >
            {isLie ? (
              <X className="w-5 h-5 text-white" strokeWidth={3} />
            ) : (
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            )}
          </motion.div>
        )}

        {isSelected && !isRevealed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-6 h-6 text-[var(--accent-primary)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {isRevealed && isLie && isCorrectGuess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--success)] text-white text-xs font-bold rounded-full shadow-lg"
        >
          You caught the lie!
        </motion.div>
      )}

      {isRevealed && isLie && !isCorrectGuess && isSelected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-[var(--text-secondary)] text-xs font-bold rounded-full shadow-lg border"
        >
          This was the lie!
        </motion.div>
      )}
    </motion.button>
  );
}
