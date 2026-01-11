"use client";

import { GameFlow } from "@/components/game/GameFlow";
import { Node, ChoiceLetter } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const demoNode: Node = {
  id: "demo-node-1",
  chainId: "demo-chain",
  parentNodeId: null,
  parentGuessChoice: null,
  creatorDeviceId: "demo",
  creatorName: "Sarah",
  creatorAvatar: "🌸",
  statementA: "I've visited 15 different countries in the past 3 years",
  statementB: "I once accidentally called my teacher 'Mom' in high school",
  statementC: "I can solve a Rubik's cube in under 2 minutes",
  lieChoice: "A",
  createdAt: new Date(),
  status: "active",
};

export default function DemoPage() {
  const handleSubmitGuess = async (choice: ChoiceLetter) => {
    console.log("Demo guess:", choice);
  };

  const handleSubmitNode = async (data: {
    statements: [string, string, string];
    lieChoice: ChoiceLetter;
    creatorName: string;
    creatorAvatar: string;
  }) => {
    console.log("Demo node:", data);
    return { nodeId: "demo-new-node-" + Date.now() };
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-md mx-auto mb-6"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to home</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mb-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--card-lavender)] rounded-full text-sm font-medium text-[var(--accent-secondary)]">
          <span className="animate-pulse">Demo Mode</span>
        </div>
      </motion.div>

      <GameFlow
        node={demoNode}
        chainSlug="demo"
        creatorName={demoNode.creatorName || undefined}
        branchCount={3}
        onSubmitGuess={handleSubmitGuess}
        onSubmitNode={handleSubmitNode}
      />
    </div>
  );
}
