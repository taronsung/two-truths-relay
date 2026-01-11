"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn, getRandomEmoji } from "@/lib/utils";
import { ChoiceLetter } from "@/types";
import { Send, Shuffle, Lightbulb, Check } from "lucide-react";

interface CreateSetFormProps {
  onSubmit: (data: {
    statements: [string, string, string];
    lieChoice: ChoiceLetter;
    creatorName: string;
    creatorAvatar: string;
  }) => void;
  isLoading?: boolean;
}

const prompts = [
  "I once met a celebrity",
  "I can speak 3 languages",
  "I've never broken a bone",
  "I've been skydiving",
  "I can cook a 5-course meal",
  "I've traveled to 10+ countries",
  "I once won a competition",
  "I have a hidden talent",
  "I'm afraid of butterflies",
  "I've never had a pet",
];

const letterColors = {
  A: "from-[#FFECD2] to-[#FCB69F] border-[#FFB088] focus:ring-[#FF9A8B]",
  B: "from-[#E8E0F0] to-[#C4B5DC] border-[#B8A9C9] focus:ring-[#9D8AB4]",
  C: "from-[#D4EDDA] to-[#A8E6CF] border-[#7DDBA3] focus:ring-[#5DC48C]",
};

export function CreateSetForm({ onSubmit, isLoading = false }: CreateSetFormProps) {
  const [statements, setStatements] = useState<[string, string, string]>(["", "", ""]);
  const [lieChoice, setLieChoice] = useState<ChoiceLetter>("C");
  const [creatorName, setCreatorName] = useState("");
  const [creatorAvatar, setCreatorAvatar] = useState(getRandomEmoji());
  const [showTip, setShowTip] = useState(false);

  const isValid = statements.every((s) => s.trim().length >= 5);

  const getRandomPrompt = () => {
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const fillRandomPrompt = (index: number) => {
    const newStatements = [...statements] as [string, string, string];
    newStatements[index] = getRandomPrompt();
    setStatements(newStatements);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit({
        statements,
        lieChoice,
        creatorName: creatorName.trim() || "Anonymous",
        creatorAvatar,
      });
    }
  };

  const letters: ChoiceLetter[] = ["A", "B", "C"];

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold mb-2">Your turn! ✨</h2>
        <p className="text-[var(--text-secondary)]">
          Write 2 truths and 1 lie about yourself
        </p>
      </motion.div>

      <div className="space-y-4">
        {letters.map((letter, index) => (
          <motion.div
            key={letter}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold",
                  lieChoice === letter
                    ? "bg-[var(--warning)] text-white"
                    : "bg-white/60 text-[var(--text-primary)] border border-[var(--border-medium)]"
                )}
              >
                {letter}
              </span>
              <button
                type="button"
                onClick={() => setLieChoice(letter)}
                className={cn(
                  "text-xs px-2 py-1 rounded-full transition-all",
                  lieChoice === letter
                    ? "bg-[var(--warning)] text-white"
                    : "bg-white/50 text-[var(--text-secondary)] hover:bg-[var(--warning-light)]"
                )}
              >
                {lieChoice === letter ? "This is my lie" : "Mark as lie"}
              </button>
              <button
                type="button"
                onClick={() => fillRandomPrompt(index)}
                className="ml-auto text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                title="Get random idea"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={statements[index]}
              onChange={(e) => {
                const newStatements = [...statements] as [string, string, string];
                newStatements[index] = e.target.value;
                setStatements(newStatements);
              }}
              placeholder={
                lieChoice === letter
                  ? "Write a convincing lie..."
                  : "Write something true about yourself..."
              }
              maxLength={150}
              rows={2}
              className={cn(
                "w-full px-4 py-3 rounded-xl border-2 bg-gradient-to-br resize-none",
                "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                "transition-all duration-200",
                letterColors[letter]
              )}
            />
            <span className="absolute bottom-2 right-3 text-xs text-[var(--text-muted)]">
              {statements[index].length}/150
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-[var(--border-soft)]"
      >
        <button
          type="button"
          onClick={() => setCreatorAvatar(getRandomEmoji())}
          className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        >
          {creatorAvatar}
        </button>
        <input
          type="text"
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={20}
          className="flex-1 px-4 py-2 rounded-xl bg-white/70 border border-[var(--border-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary-light)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
      </motion.div>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-[var(--card-lavender)] rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-[var(--accent-secondary)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[var(--text-primary)] mb-1">Pro tip:</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Make your lie believable! Mix in real details to make it harder to spot.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setShowTip(!showTip)}
        className="text-sm text-[var(--accent-secondary)] hover:underline flex items-center gap-1 mx-auto"
      >
        <Lightbulb className="w-4 h-4" />
        {showTip ? "Hide tip" : "Need a tip?"}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!isValid}
          isLoading={isLoading}
        >
          {isValid ? (
            <>
              <Check className="w-5 h-5" />
              Lock it in!
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Fill all three statements
            </>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}
