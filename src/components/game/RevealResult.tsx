"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PartyPopper, Frown, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevealResultProps {
  isCorrect: boolean;
  onContinue: () => void;
  creatorName?: string;
}

const confettiColors = ["#FF9A8B", "#B8A9C9", "#7DDBA3", "#FFD700", "#FF69B4", "#87CEEB"];

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: confettiColors[i % confettiColors.length],
            left: `${Math.random() * 100}%`,
          }}
          initial={{ y: -20, opacity: 1, scale: 0 }}
          animate={{
            y: "100vh",
            opacity: [1, 1, 0],
            scale: [0, 1, 0.5],
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function RevealResult({ isCorrect, onContinue, creatorName }: RevealResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center text-center py-8"
    >
      {isCorrect && <Confetti />}

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl",
          isCorrect 
            ? "bg-gradient-to-br from-[var(--success)] to-[#5DC48C]" 
            : "bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-primary-hover)]"
        )}
      >
        {isCorrect ? (
          <PartyPopper className="w-12 h-12 text-white" />
        ) : (
          <Frown className="w-12 h-12 text-white" />
        )}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold mb-3"
      >
        {isCorrect ? (
          <span className="gradient-text">Nice catch! 🎉</span>
        ) : (
          <span className="text-[var(--text-primary)]">Fooled you! 😜</span>
        )}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-[var(--text-secondary)] mb-8 max-w-xs"
      >
        {isCorrect ? (
          <>You spotted {creatorName ? `${creatorName}'s` : "the"} lie! You&apos;re a natural detective.</>
        ) : (
          <>{creatorName || "They"} got you this time! Better luck on the next one.</>
        )}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <Button 
          variant="primary" 
          size="lg" 
          onClick={onContinue}
          className="group"
        >
          <Sparkles className="w-5 h-5" />
          <span>Now it&apos;s your turn!</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Button>

        <p className="text-sm text-[var(--text-muted)]">
          Add your own 2 truths + 1 lie to keep the relay going
        </p>
      </motion.div>
    </motion.div>
  );
}
