"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StatementCard } from "./StatementCard";
import { RevealResult } from "./RevealResult";
import { CreateSetForm } from "./CreateSetForm";
import { ShareCard } from "./ShareCard";
import { MiniTree } from "./TreeVisualization";
import { Button } from "@/components/ui/Button";
import { ChoiceLetter, GamePhase, Node } from "@/types";
import { getChoiceIndex, vibrate } from "@/lib/utils";
import { TreePine, Sparkles } from "lucide-react";

interface GameFlowProps {
  node: Node;
  chainSlug: string;
  creatorName?: string;
  branchCount?: number;
  onSubmitGuess?: (choice: ChoiceLetter) => Promise<void>;
  onSubmitNode?: (data: {
    statements: [string, string, string];
    lieChoice: ChoiceLetter;
    creatorName: string;
    creatorAvatar: string;
  }) => Promise<{ nodeId: string }>;
}

export function GameFlow({
  node,
  chainSlug,
  creatorName,
  branchCount = 1,
  onSubmitGuess,
  onSubmitNode,
}: GameFlowProps) {
  const [phase, setPhase] = useState<GamePhase>("guess");
  const [selectedChoice, setSelectedChoice] = useState<ChoiceLetter | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newNodeId, setNewNodeId] = useState<string | null>(null);
  const [newCreatorName, setNewCreatorName] = useState("");
  const [newCreatorAvatar, setNewCreatorAvatar] = useState("");

  const statements = [
    { text: node.statementA, letter: "A" as ChoiceLetter },
    { text: node.statementB, letter: "B" as ChoiceLetter },
    { text: node.statementC, letter: "C" as ChoiceLetter },
  ];

  const handleSelectChoice = useCallback((choice: ChoiceLetter) => {
    if (phase !== "guess" || isLoading) return;
    vibrate(10);
    setSelectedChoice(choice);
  }, [phase, isLoading]);

  const handleConfirmGuess = useCallback(async () => {
    if (!selectedChoice || phase !== "guess") return;

    setIsLoading(true);
    vibrate([10, 50, 10]);

    try {
      if (onSubmitGuess) {
        await onSubmitGuess(selectedChoice);
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      const correct = selectedChoice === node.lieChoice;
      setIsCorrect(correct);
      setPhase("reveal");

      vibrate(correct ? [50, 100, 50, 100, 50] : [100, 50, 100]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChoice, phase, node.lieChoice, onSubmitGuess]);

  const handleContinueToCreate = useCallback(() => {
    setPhase("create");
  }, []);

  const handleSubmitNode = useCallback(async (data: {
    statements: [string, string, string];
    lieChoice: ChoiceLetter;
    creatorName: string;
    creatorAvatar: string;
  }) => {
    setIsLoading(true);

    try {
      let nodeId = "new-node-" + Date.now();

      if (onSubmitNode) {
        const result = await onSubmitNode(data);
        nodeId = result.nodeId;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setNewNodeId(nodeId);
      setNewCreatorName(data.creatorName);
      setNewCreatorAvatar(data.creatorAvatar);
      setPhase("share");

      vibrate([50, 100, 50, 100, 100, 50]);
    } finally {
      setIsLoading(false);
    }
  }, [onSubmitNode]);

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {phase === "guess" && (
          <motion.div
            key="guess"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-md mb-4"
              >
                <TreePine className="w-4 h-4 text-[var(--success)]" />
                <span className="text-sm font-medium">{branchCount} branch{branchCount !== 1 ? "es" : ""} and growing</span>
              </motion.div>

              <MiniTree branchCount={Math.min(branchCount, 3)} />

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mt-4 mb-2"
              >
                {creatorName ? `${creatorName}'s` : "Someone's"} 2 truths + 1 lie
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[var(--text-secondary)]"
              >
                Can you spot the lie? 🔍
              </motion.p>
            </div>

            <div className="space-y-3">
              {statements.map((statement, index) => (
                <StatementCard
                  key={statement.letter}
                  letter={statement.letter}
                  text={statement.text}
                  isSelected={selectedChoice === statement.letter}
                  onClick={() => handleSelectChoice(statement.letter)}
                  delay={index}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!selectedChoice}
                isLoading={isLoading}
                onClick={handleConfirmGuess}
              >
                <Sparkles className="w-5 h-5" />
                {selectedChoice ? `This is the lie!` : "Pick one to guess"}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {phase === "reveal" && isCorrect !== null && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="space-y-4 mb-8">
              {statements.map((statement, index) => (
                <StatementCard
                  key={statement.letter}
                  letter={statement.letter}
                  text={statement.text}
                  isSelected={selectedChoice === statement.letter}
                  isRevealed
                  isLie={statement.letter === node.lieChoice}
                  isCorrectGuess={selectedChoice === node.lieChoice}
                  disabled
                  delay={index}
                />
              ))}
            </div>

            <RevealResult
              isCorrect={isCorrect}
              creatorName={creatorName}
              onContinue={handleContinueToCreate}
            />
          </motion.div>
        )}

        {phase === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <CreateSetForm
              onSubmit={handleSubmitNode}
              isLoading={isLoading}
            />
          </motion.div>
        )}

        {phase === "share" && newNodeId && (
          <motion.div
            key="share"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <ShareCard
              chainSlug={chainSlug}
              nodeId={newNodeId}
              creatorName={newCreatorName}
              creatorAvatar={newCreatorAvatar}
              branchCount={branchCount + 1}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
