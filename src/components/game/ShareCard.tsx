"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Copy, Share2, Check, MessageCircle, TreePine, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShareCardProps {
  chainSlug: string;
  nodeId: string;
  creatorName: string;
  creatorAvatar: string;
  branchCount?: number;
  onExploreTree?: () => void;
}

export function ShareCard({
  chainSlug,
  nodeId,
  creatorName,
  creatorAvatar,
  branchCount = 1,
  onExploreTree,
}: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/play/${chainSlug}/${nodeId}`;

  const shareText = `Two truths + a lie about me—pick the lie, then add yours! Let's grow the relay tree 🌳✨`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Two Truths Relay",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--success)] to-[#5DC48C] flex items-center justify-center shadow-xl"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">You&apos;re in the relay! 🎉</h2>
        <p className="text-[var(--text-secondary)]">
          Now share with friends to grow your branch
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative p-6 rounded-3xl bg-gradient-to-br from-[var(--card-peach)] via-white to-[var(--card-lavender)] border-2 border-white/50 shadow-xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--success)]" />

        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[var(--accent-primary-light)] rounded-full opacity-50 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[var(--accent-secondary)] rounded-full opacity-30 blur-2xl" />

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">{creatorAvatar}</span>
            <span className="text-lg font-semibold text-[var(--text-primary)]">
              {creatorName}
            </span>
          </div>

          <p className="text-[var(--text-secondary)] mb-4">
            just added their 2 truths + 1 lie!
          </p>

          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full">
              <TreePine className="w-4 h-4 text-[var(--success)]" />
              <span className="font-medium">{branchCount} branch{branchCount !== 1 ? "es" : ""}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full">
              <MessageCircle className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="font-medium">Can you spot the lie?</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 right-3 text-xs text-[var(--text-muted)] font-medium">
          twotruthsrelay.com
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleShare}
        >
          <Share2 className="w-5 h-5" />
          Share the relay
        </Button>

        <Button
          variant="ghost"
          size="md"
          className="w-full"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-[var(--success)]" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy link
            </>
          )}
        </Button>
      </motion.div>

      {onExploreTree && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={onExploreTree}
            className="text-[var(--accent-secondary)] hover:underline flex items-center gap-2 mx-auto"
          >
            <TreePine className="w-4 h-4" />
            Explore the full tree
          </button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className={cn(
          "p-4 rounded-2xl bg-[var(--card-mint)] border border-[var(--success)]/20",
          "text-center"
        )}
      >
        <p className="text-sm text-[var(--text-primary)]">
          <span className="font-semibold">Pro tip:</span> Send to 2-3 friends to see your branch grow! 🌱
        </p>
      </motion.div>
    </motion.div>
  );
}
