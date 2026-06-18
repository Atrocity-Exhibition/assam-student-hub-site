import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRelativeTime(dateInput: string | Date | null): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  
  const diffMs = now.getTime() - date.getTime();
  
  // If the date is in the future (more than 5 minutes), format as absolute date.
  // This guards against clock drift while preventing future-dated items from showing as "Just now".
  if (diffMs < -300000) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  // Same calendar day check
  const isToday = date.getDate() === now.getDate() &&
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear();

  // Yesterday calendar day check
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.getDate() === yesterday.getDate() &&
                      date.getMonth() === yesterday.getMonth() &&
                      date.getFullYear() === yesterday.getFullYear();

  if (diffMins < 60) {
    if (diffMins <= 1) return "Just now";
    return `${diffMins} minutes ago`;
  } else if (diffHours < 24 && isToday) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (isToday) {
    return "Today";
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

export function extractSalary(
  title: string,
  description?: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any> | null
): string | null {
  if (metadata) {
    if (typeof metadata.salary === "string" && metadata.salary.trim()) {
      return metadata.salary.trim();
    }
    if (typeof metadata.salary_range === "string" && metadata.salary_range.trim()) {
      return metadata.salary_range.trim();
    }
    if (typeof metadata.pay_scale === "string" && metadata.pay_scale.trim()) {
      return metadata.pay_scale.trim();
    }
  }

  const combined = `${title} ${description || ""}`;
  
  const regexes = [
    // Rs. 15,000 - Rs. 50,000 or similar
    { pattern: /(?:Rs\.?|INR)\s*(\d{1,3}(?:,\d{3})*(?:\/[-–—])?)\s*[-–—]\s*(?:Rs\.?|INR)?\s*(\d{1,3}(?:,\d{3})*(?:\/[-–—])?)/i, type: "range" },
    // Pay scale with range
    { pattern: /(?:Scale of Pay|Pay Scale|Salary|Stipend|Pay|Scale)\s*(?:of|is|:)?\s*(?:Rs\.?|INR)?\s*(\d{1,3}(?:,\d{3})*(?:\/[-–—])?)\s*[-–—]\s*(?:Rs\.?|INR)?\s*(\d{1,3}(?:,\d{3})*(?:\/[-–—])?)/i, type: "range" },
    // 15k - 35k range
    { pattern: /\b(\d{1,3})\s*[kK]\s*[-–—]\s*(\d{1,3})\s*[kK]\b/, type: "range-k" },
    // Rs. 30,000 pm
    { pattern: /(?:Rs\.?|INR)\s*(\d{1,3}(?:,\d{3})*(?:\/[-–—])?)\s*(?:per month|pm|p\.m\.)/i, type: "single" },
    // Stipend/Salary of 10000
    { pattern: /(?:Stipend|Salary|Pay|Honorarium|Consolidated Pay)\s*(?:of|is|:)?\s*(?:Rs\.?|INR)?\s*(\d{1,3}(?:,\d{3})*(?:\/[-–—])?)\s*(?:per month|pm|p\.m\.|p\/m|\/-)?/i, type: "single" },
    // 25k pm / 25K single
    { pattern: /\b(\d{1,3})\s*[kK]\s*(?:pm|p\.m\.|per month)?\b/i, type: "single-k" },
    // Rs. 30,000
    { pattern: /(?:Rs\.?|INR)\s*(\d{1,3}(?:,\d{3})*(?:\/[-–—])?)/i, type: "single" }
  ];

  for (const item of regexes) {
    const match = combined.match(item.pattern);
    if (match) {
      if (item.type === "range") {
        return `₹${match[1].replace(/\/[-–—]/, "")} - ₹${match[2].replace(/\/[-–—]/, "")}`;
      } else if (item.type === "range-k") {
        return `₹${match[1]}K - ₹${match[2]}K`;
      } else if (item.type === "single-k") {
        return `₹${match[1]}K`;
      } else {
        return `₹${match[1].replace(/\/[-–—]/, "")}`;
      }
    }
  }

  return null;
}

export function cleanDescription(desc?: string | null): string {
  if (!desc) return "";
  
  // 1. Remove Markdown headers (e.g. ### Overview)
  let cleaned = desc.replace(/^#+\s+/gm, "");
  
  // 2. Remove Bold / Italic / Strikethrough markers (e.g. **text**, *text*, ~~text~~)
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, "$1");
  cleaned = cleaned.replace(/\*([^*]+)\*/g, "$1");
  cleaned = cleaned.replace(/~~([^~]+)~~/g, "$1");
  
  // 3. Remove list indicators (e.g. - item, * item, or 1. item) at start of lines
  cleaned = cleaned.replace(/^[\s\t]*[-*+]\s+/gm, "");
  cleaned = cleaned.replace(/^[\s\t]*\d+\.\s+/gm, "");
  
  // 4. Remove Markdown links [text](url) -> keep text only
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  
  // 5. Replace double newlines / multiple spaces with a single space to make a clean snippet
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  
  return cleaned;
}