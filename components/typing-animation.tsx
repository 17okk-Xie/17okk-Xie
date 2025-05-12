"use client";

import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";

export interface TypingAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  words: string[];
  className?: string;
  cursorClassName?: string;
  delay?: number;
  speed?: number;
  repeat?: boolean;
  cursor?: boolean;
  onComplete?: () => void;
}

export const TypingAnimation = ({
  words = [""],
  className,
  cursorClassName,
  delay = 1000,
  speed = 50,
  repeat = true,
  cursor = true,
  onComplete,
  ...props
}: TypingAnimationProps) => {
  const [text, setText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Get the current word based on the current index
      const currentWord = words[currentIndex];

      if (isTyping) {
        // Add the next character of the current word
        setText(currentWord.substring(0, text.length + 1));

        // If we've typed the whole word, start deleting after the delay
        if (text === currentWord) {
          setIsTyping(false);
          setIsDeleting(false);
          setTimeout(() => {
            setIsDeleting(true);
          }, delay);
        }
      } else if (isDeleting) {
        // Remove the last character of the current word
        setText(currentWord.substring(0, text.length - 1));

        // If we've deleted the whole word, start typing the next word
        if (text === "") {
          setIsDeleting(false);
          setIsTyping(true);
          setCurrentIndex((currentIndex + 1) % words.length);

          // Check if we've completed a cycle and should stop
          if (currentIndex === words.length - 1 && !repeat) {
            setIsComplete(true);
            onComplete?.();
          }
        }
      }
    }, isDeleting ? speed / 2 : speed);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(timeout);
  }, [
    text,
    currentIndex,
    isTyping,
    isDeleting,
    isComplete,
    words,
    delay,
    speed,
    repeat,
    onComplete,
  ]);

  return (
    <div className={cn("inline-flex", className)} {...props}>
      <span>{text}</span>
      {cursor && (
        <span
          className={cn(
            "ml-1 inline-block h-full w-[2px] animate-blink bg-current",
            cursorClassName
          )}
        />
      )}
    </div>
  );
}; 