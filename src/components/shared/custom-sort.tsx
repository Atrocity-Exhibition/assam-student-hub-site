"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSortProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export function CustomSort({ options, value, onChange }: CustomSortProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Find the label of the currently selected option
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard accessibility
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block w-full sm:w-48 text-left z-20">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex h-12 w-full items-center justify-between gap-2 rounded-2xl border border-border bg-card/45 px-4 text-sm text-foreground outline-none transition-all duration-200 hover:border-zinc-400 dark:hover:border-zinc-700 cursor-pointer focus-visible:border-brand-border focus-visible:ring-2 focus-visible:ring-brand/15 dark:focus-visible:ring-brand/20 select-none"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 opacity-70" />
        </motion.div>
      </button>

      {/* Options List */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            aria-activedescendant={value}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 mt-1 max-h-60 overflow-auto rounded-2xl border border-border bg-card/90 backdrop-blur-lg p-1.5 shadow-lg outline-none"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`relative flex h-10 w-full items-center rounded-xl px-3 text-sm cursor-pointer select-none transition-colors duration-150
                    ${
                      isSelected
                        ? "bg-brand/15 text-brand font-semibold dark:bg-brand/20"
                        : "text-foreground/90 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }
                  `}
                >
                  <span className="truncate">{option.label}</span>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
