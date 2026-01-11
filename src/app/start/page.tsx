"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreateSetForm } from "@/components/game/CreateSetForm";
import { ShareCard } from "@/components/game/ShareCard";
import { ChoiceLetter } from "@/types";
import Link from "next/link";
import { ArrowLeft, Sparkles, TreePine } from "lucide-react";
import { generateSlug } from "@/lib/utils";

export default function StartPage() {
  const [phase, setPhase] = useState<"create" | "share">("create");
  const [chainSlug] = useState(() => generateSlug(8));
  const [nodeId, setNodeId] = useState<string | null>(null);
  const [creatorName, setCreatorName] = useState("");
  const [creatorAvatar, setCreatorAvatar] = useState("");

  const handleSubmit = async (data: {
    statements: [string, string, string];
    lieChoice: ChoiceLetter;
    creatorName: string;
    creatorAvatar: string;
  }) => {
    const newNodeId = "node-" + Date.now();
    setNodeId(newNodeId);
    setCreatorName(data.creatorName);
    setCreatorAvatar(data.creatorAvatar);
    setPhase("share");

    console.log("Creating relay:", {
      chainSlug,
      nodeId: newNodeId,
      ...data,
    });
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

      {phase === "create" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--success)] to-[#5DC48C] shadow-lg mb-4"
            >
              <TreePine className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold mb-2">
              <span className="gradient-text">Plant your relay tree!</span>
            </h1>
            <p className="text-[var(--text-secondary)]">
              You&apos;ll be the root - friends will branch off from you
            </p>
          </div>

          <CreateSetForm onSubmit={handleSubmit} />
        </motion.div>
      )}

      {phase === "share" && nodeId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <ShareCard
            chainSlug={chainSlug}
            nodeId={nodeId}
            creatorName={creatorName}
            creatorAvatar={creatorAvatar}
            branchCount={1}
          />
        </motion.div>
      )}
    </div>
  );
}
