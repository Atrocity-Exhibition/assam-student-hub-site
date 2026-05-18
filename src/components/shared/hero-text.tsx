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
  const [wordIndex, setWordIndex] =
    useState(0);

  const [displayText, setDisplayText] =
    useState("");

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
          }, 2500);
        }
      } else {
        const nextText = currentWord.slice(
          0,
          displayText.length - 1,
        );

        setDisplayText(nextText);

        if (nextText === "") {
          setIsDeleting(false);

          setWordIndex(
            (prev) =>
              (prev + 1) % words.length,
          );
        }
      }
    }, isDeleting ? 60 : 120);

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
        min-w-[320px]
        font-mono
        font-bold
        text-red-500
      "
   >
     {displayText}
   </span>
  );

}