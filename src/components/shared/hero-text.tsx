"use client";

import { useEffect, useState } from "react";

const words = [
  "Government Jobs",
  "Scholarships",
  "Admissions",
  "Exam Updates",
  "Universities",
];

export function HeroText() {
  const [displayText, setDisplayText] =
    useState(words[0]);

  const [wordIndex, setWordIndex] =
    useState(0);

  const [isDeleting, setIsDeleting] =
    useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const nextText = currentWord.slice(
          0,
          displayText.length + 1,
        );

        setDisplayText(nextText);

        if (nextText === currentWord) {
          setTimeout(() => {
            setIsDeleting(true);
          }, 1600);
        }
      } else {
        /* IMPORTANT:
           stop at 1 character
           NEVER EMPTY STRING
        */

        const nextText = currentWord.slice(
          0,
          Math.max(displayText.length - 1, 1),
        );

        setDisplayText(nextText);

        if (nextText.length === 1) {
          setIsDeleting(false);

          setWordIndex(
            (prev) =>
              (prev + 1) % words.length,
          );

          setDisplayText(
            words[
              (wordIndex + 1) % words.length
            ].slice(0, 1),
          );
        }
      }
    }, isDeleting ? 45 : 95);

    return () => clearTimeout(timeout);
  }, [
    displayText,
    isDeleting,
    wordIndex,
  ]);

  return (
    <span
      className="
        inline-block
        min-w-[340px]
        font-mono
        text-3xl
        font-bold
        text-red-500
        sm:text-5xl
      "
    >
      {displayText}
    </span>
  );
}
