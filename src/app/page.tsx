"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { MiniTree } from "@/components/game/TreeVisualization";
import { ArrowRight, Sparkles, Users, TreePine, Heart } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-primary-hover)] shadow-xl shadow-[var(--accent-primary)]/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-3"
          >
            <span className="gradient-text">Two Truths</span>
            <br />
            <span className="text-[var(--text-primary)]">Relay</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-[var(--text-secondary)] mb-8"
          >
            Spot the lie, add yours, and watch the relay tree grow through your friends!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <MiniTree branchCount={3} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <Link href="/start">
              <Button variant="primary" size="lg" className="w-full group">
                <Sparkles className="w-5 h-5" />
                Start a new relay
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link href="/demo">
              <Button variant="ghost" size="md" className="w-full">
                Try a demo first
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto"
        >
          {[
            { icon: Users, label: "2-8 friends", color: "var(--accent-primary)" },
            { icon: TreePine, label: "Grows forever", color: "var(--success)" },
            { icon: Heart, label: "Pure fun", color: "var(--accent-secondary)" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/50 border border-[var(--border-soft)]"
            >
              <item.icon className="w-6 h-6" style={{ color: item.color }} />
              <span className="text-xs font-medium text-[var(--text-secondary)]">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="py-6 text-center text-sm text-[var(--text-muted)]">
        <p>Made with love for fun social games</p>
      </footer>
    </div>
  );
}
