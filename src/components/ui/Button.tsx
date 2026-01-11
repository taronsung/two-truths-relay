"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = `
      relative inline-flex items-center justify-center gap-2
      font-semibold rounded-full
      transition-colors duration-200
      focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-primary-light)]
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variants = {
      primary: `
        bg-[var(--accent-primary)] text-white
        hover:bg-[var(--accent-primary-hover)]
        active:scale-[0.98]
        shadow-lg shadow-[var(--accent-primary)]/20
      `,
      secondary: `
        bg-[var(--accent-secondary)] text-white
        hover:bg-[var(--accent-secondary-hover)]
        active:scale-[0.98]
      `,
      ghost: `
        bg-transparent text-[var(--text-primary)]
        hover:bg-[var(--bg-tertiary)]
        active:scale-[0.98]
      `,
      success: `
        bg-[var(--success)] text-white
        hover:opacity-90
        active:scale-[0.98]
      `,
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {isLoading ? (
          <motion.span
            className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
