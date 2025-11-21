import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'up' | 'left' | 'right' | 'scale';
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  durationMs?: number;
  delayMs?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  style,
  variant = 'up',
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  durationMs = 1400,
  delayMs,
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold, rootMargin, triggerOnce });

  const hidden =
    variant === 'left'
      ? 'opacity-0 -translate-x-8'
      : variant === 'right'
      ? 'opacity-0 translate-x-8'
      : variant === 'scale'
      ? 'opacity-0 scale-95'
      : 'opacity-0 translate-y-8';

  const visible =
    variant === 'left' || variant === 'right'
      ? 'opacity-100 translate-x-0'
      : variant === 'scale'
      ? 'opacity-100 scale-100'
      : 'opacity-100 translate-y-0';

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${
        isVisible ? visible : hidden
      } ${className}`}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionDelay: delayMs !== undefined ? `${delayMs}ms` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
