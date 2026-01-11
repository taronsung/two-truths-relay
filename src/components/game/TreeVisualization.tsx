"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NodeWithChildren, ChoiceLetter } from "@/types";
import { User, ChevronRight } from "lucide-react";

interface TreeVisualizationProps {
  data: NodeWithChildren;
  currentNodeId?: string;
  onNodeClick?: (nodeId: string) => void;
  compact?: boolean;
}

const choiceColors = {
  A: "bg-gradient-to-br from-[#FFECD2] to-[#FCB69F] border-[#FFB088]",
  B: "bg-gradient-to-br from-[#E8E0F0] to-[#C4B5DC] border-[#B8A9C9]",
  C: "bg-gradient-to-br from-[#D4EDDA] to-[#A8E6CF] border-[#7DDBA3]",
};

function TreeNode({
  node,
  depth = 0,
  currentNodeId,
  onNodeClick,
  compact,
}: {
  node: NodeWithChildren;
  depth?: number;
  currentNodeId?: string;
  onNodeClick?: (nodeId: string) => void;
  compact?: boolean;
}) {
  const isCurrent = node.id === currentNodeId;
  const hasChildren = node.children.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: depth * 0.1 }}
      className={cn("relative", depth > 0 && "ml-6 mt-3")}
    >
      {depth > 0 && (
        <div className="absolute left-[-24px] top-0 h-full">
          <div className="absolute left-0 top-4 w-6 h-0.5 bg-gradient-to-r from-[var(--border-medium)] to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--border-medium)] to-transparent" />
        </div>
      )}

      <motion.button
        onClick={() => onNodeClick?.(node.id)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all",
          "text-left w-full max-w-xs",
          node.parentGuessChoice 
            ? choiceColors[node.parentGuessChoice]
            : "bg-gradient-to-br from-[var(--bg-secondary)] to-white border-[var(--border-medium)]",
          isCurrent && "ring-4 ring-[var(--accent-primary)] ring-offset-2",
          !isCurrent && "hover:shadow-md"
        )}
      >
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0",
            isCurrent 
              ? "bg-[var(--accent-primary)] text-white" 
              : "bg-white/60"
          )}
        >
          {node.creatorAvatar || <User className="w-5 h-5 text-[var(--text-secondary)]" />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-[var(--text-primary)] truncate">
            {node.creatorName || "Anonymous"}
          </p>
          {!compact && (
            <p className="text-xs text-[var(--text-muted)]">
              {node.guessCount} guess{node.guessCount !== 1 ? "es" : ""} • {node.children.length} branch{node.children.length !== 1 ? "es" : ""}
            </p>
          )}
        </div>

        {hasChildren && (
          <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
        )}

        {isCurrent && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent-primary)] rounded-full flex items-center justify-center"
          >
            <span className="text-[8px] text-white font-bold">YOU</span>
          </motion.div>
        )}

        {node.parentGuessChoice && (
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-[var(--border-medium)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)]">
            {node.parentGuessChoice}
          </div>
        )}
      </motion.button>

      {hasChildren && (
        <div className="space-y-2">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              currentNodeId={currentNodeId}
              onNodeClick={onNodeClick}
              compact={compact}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function TreeVisualization({
  data,
  currentNodeId,
  onNodeClick,
  compact = false,
}: TreeVisualizationProps) {
  return (
    <div className="overflow-x-auto py-4">
      <div className="min-w-fit">
        <TreeNode
          node={data}
          currentNodeId={currentNodeId}
          onNodeClick={onNodeClick}
          compact={compact}
        />
      </div>
    </div>
  );
}

export function MiniTree({ branchCount = 1 }: { branchCount?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center"
    >
      <svg
        width="120"
        height="80"
        viewBox="0 0 120 80"
        fill="none"
        className="drop-shadow-lg"
      >
        <motion.circle
          cx="60"
          cy="15"
          r="12"
          fill="url(#rootGradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        />

        {branchCount >= 1 && (
          <>
            <motion.path
              d="M60 27 L40 55"
              stroke="url(#branchGradientA)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            <motion.circle
              cx="40"
              cy="65"
              r="10"
              fill="url(#nodeGradientA)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
            />
          </>
        )}

        {branchCount >= 2 && (
          <>
            <motion.path
              d="M60 27 L80 55"
              stroke="url(#branchGradientB)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
            <motion.circle
              cx="80"
              cy="65"
              r="10"
              fill="url(#nodeGradientB)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
            />
          </>
        )}

        {branchCount >= 3 && (
          <>
            <motion.path
              d="M60 27 L60 55"
              stroke="url(#branchGradientC)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
            <motion.circle
              cx="60"
              cy="65"
              r="10"
              fill="url(#nodeGradientC)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
            />
          </>
        )}

        <defs>
          <linearGradient id="rootGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9A8B" />
            <stop offset="100%" stopColor="#FF7B6A" />
          </linearGradient>
          <linearGradient id="nodeGradientA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFECD2" />
            <stop offset="100%" stopColor="#FCB69F" />
          </linearGradient>
          <linearGradient id="nodeGradientB" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8E0F0" />
            <stop offset="100%" stopColor="#C4B5DC" />
          </linearGradient>
          <linearGradient id="nodeGradientC" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4EDDA" />
            <stop offset="100%" stopColor="#A8E6CF" />
          </linearGradient>
          <linearGradient id="branchGradientA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9A8B" />
            <stop offset="100%" stopColor="#FFB088" />
          </linearGradient>
          <linearGradient id="branchGradientB" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9A8B" />
            <stop offset="100%" stopColor="#B8A9C9" />
          </linearGradient>
          <linearGradient id="branchGradientC" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9A8B" />
            <stop offset="100%" stopColor="#7DDBA3" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
