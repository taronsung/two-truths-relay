"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { GameFlow } from "@/components/game/GameFlow";
import { Node, ChoiceLetter } from "@/types";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

interface PlayPageProps {
  params: Promise<{ slug: string; nodeId: string }>;
}

export default function PlayPage({ params }: PlayPageProps) {
  const { slug, nodeId } = use(params);
  const [node, setNode] = useState<Node | null>(null);
  const [branchCount, setBranchCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNode() {
      try {
        const response = await fetch(`/api/nodes/${nodeId}?chain=${slug}`);
        if (!response.ok) {
          throw new Error("Node not found");
        }
        const data = await response.json();
        
        setNode({
          id: nodeId,
          chainId: slug,
          parentNodeId: null,
          parentGuessChoice: null,
          creatorDeviceId: "",
          creatorName: data.node.creatorName,
          creatorAvatar: data.node.creatorAvatar,
          statementA: data.node.statementA,
          statementB: data.node.statementB,
          statementC: data.node.statementC,
          lieChoice: data.node.lieChoice || "A",
          createdAt: new Date(data.node.createdAt),
          status: "active",
        });
        setBranchCount(data.branchCount || 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }

    fetchNode();
  }, [slug, nodeId]);

  const getDeviceId = () => {
    if (typeof window === "undefined") return "";
    let deviceId = localStorage.getItem("ttr_device_id");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("ttr_device_id", deviceId);
    }
    return deviceId;
  };

  const handleSubmitGuess = async (choice: ChoiceLetter) => {
    const deviceId = getDeviceId();
    await fetch(`/api/nodes/${nodeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chainSlug: slug,
        deviceId,
        choice,
      }),
    });
  };

  const handleSubmitNode = async (data: {
    statements: [string, string, string];
    lieChoice: ChoiceLetter;
    creatorName: string;
    creatorAvatar: string;
  }) => {
    const deviceId = getDeviceId();
    const response = await fetch("/api/nodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chainSlug: slug,
        parentNodeId: nodeId,
        parentGuessChoice: data.lieChoice,
        deviceId,
        ...data,
      }),
    });

    const result = await response.json();
    return { nodeId: result.node.id };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
          <p className="text-[var(--text-secondary)]">Loading relay...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !node) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold mb-2">Relay not found</h1>
          <p className="text-[var(--text-secondary)] mb-6">
            This relay may have been removed or the link is invalid.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Start a new relay
          </Link>
        </motion.div>
      </div>
    );
  }

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
          <span className="text-sm font-medium">Two Truths Relay</span>
        </Link>
      </motion.div>

      <GameFlow
        node={node}
        chainSlug={slug}
        creatorName={node.creatorName || undefined}
        branchCount={branchCount}
        onSubmitGuess={handleSubmitGuess}
        onSubmitNode={handleSubmitNode}
      />
    </div>
  );
}
