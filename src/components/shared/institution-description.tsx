"use client";

import { useState } from "react";

type Props = {
  description: string;
};

export function InstitutionDescription({ description }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 280;

  if (!description) return null;

  if (description.length <= maxLength) {
    return (
      <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted whitespace-pre-line">
        {description}
      </p>
    );
  }

  const displayedText = isExpanded
    ? description
    : `${description.slice(0, maxLength).trim()}...`;

  return (
    <div className="mt-6">
      <p className="text-base sm:text-lg leading-relaxed text-muted whitespace-pre-line transition-all duration-300">
        {displayedText}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2.5 text-sm font-bold text-brand hover:opacity-90 transition-opacity duration-200 focus:outline-none hover:underline"
      >
        {isExpanded ? "Show Less" : "Read More"}
      </button>
    </div>
  );
}
