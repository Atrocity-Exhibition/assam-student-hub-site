"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, RotateCcw, Building2, Calendar, ShieldCheck, GraduationCap, Banknote, Briefcase } from "lucide-react";
import { useState } from "react";

type Institution = {
  id: number;
  name: string;
  slug: string;
};

type Props = {
  institutions: Institution[];
};

export function NoticesFilterPanel({ institutions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const isJobsPage = pathname === "/jobs";
  
  // Read current parameters
  const currentSource = searchParams.get("source") || "";
  const currentInstitution = searchParams.get("institution") || "";
  const currentDate = searchParams.get("date") || "";
  const currentExperience = searchParams.get("experience") || "";
  const currentSalary = searchParams.get("salary") || "";
  const currentEducation = searchParams.get("education") || "";

  const hasActiveFilters =
    currentSource !== "" ||
    currentInstitution !== "" ||
    currentDate !== "" ||
    (isJobsPage && (currentExperience !== "" || currentSalary !== "" || currentEducation !== ""));
  
  // Initialize panel open state if any filter is active
  const [isOpen, setIsOpen] = useState(hasActiveFilters);

  // Helper to push new parameters
  const updateFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    // Always reset page to 1 when filters change
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("source");
    params.delete("institution");
    params.delete("date");
    params.delete("experience");
    params.delete("salary");
    params.delete("education");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-4 transition-all duration-300">
      {/* Trigger Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm ${
            isOpen || hasActiveFilters
              ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
              : "border-border bg-card/45 text-muted hover:border-zinc-400 dark:hover:border-zinc-700 hover:text-foreground"
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-rose-500 transition-colors duration-200 cursor-pointer bg-transparent border-0 p-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Expandable Filter Grid */}
      {isOpen && (
        <div className="mt-4 flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-border bg-card/30 p-4 sm:p-5 backdrop-blur-sm shadow-sm transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Source Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Source Type
              </label>
              <div className="relative">
                <select
                  value={currentSource}
                  onChange={(e) => updateFilter("source", e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-border bg-zinc-50/20 dark:bg-zinc-950/25 px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-brand-border cursor-pointer shadow-inner pr-8"
                >
                  <option value="">All Sources</option>
                  <option value="official">Official Sources Only</option>
                  <option value="aggregator">Aggregators Only</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l border-t border-muted h-1.5 w-1.5 rotate-[135deg]" />
              </div>
            </div>

            {/* 2. Institution Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Institution
              </label>
              <div className="relative">
                <select
                  value={currentInstitution}
                  onChange={(e) => updateFilter("institution", e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-border bg-zinc-50/20 dark:bg-zinc-950/25 px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-brand-border cursor-pointer shadow-inner pr-8"
                >
                  <option value="">All Institutions</option>
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.slug}>
                      {inst.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l border-t border-muted h-1.5 w-1.5 rotate-[135deg]" />
              </div>
            </div>

            {/* 3. Date Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Date Posted
              </label>
              <div className="relative">
                <select
                  value={currentDate}
                  onChange={(e) => updateFilter("date", e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-border bg-zinc-50/20 dark:bg-zinc-950/25 px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-brand-border cursor-pointer shadow-inner pr-8"
                >
                  <option value="">Any Time</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l border-t border-muted h-1.5 w-1.5 rotate-[135deg]" />
              </div>
            </div>
          </div>

          {/* Job Specific Filters (Education, Salary, Experience) */}
          {isJobsPage && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-4">
              {/* 4. Education Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Education Level
                </label>
                <div className="relative">
                  <select
                    value={currentEducation}
                    onChange={(e) => updateFilter("education", e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-border bg-zinc-50/20 dark:bg-zinc-950/25 px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-brand-border cursor-pointer shadow-inner pr-8"
                  >
                    <option value="">All Education Levels</option>
                    <option value="10th_12th">10th / 12th Pass</option>
                    <option value="diploma_iti">Diploma / ITI</option>
                    <option value="graduate">Graduate / Degree</option>
                    <option value="postgraduate">Post Graduate (PG)</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l border-t border-muted h-1.5 w-1.5 rotate-[135deg]" />
                </div>
              </div>

              {/* 5. Salary Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Banknote className="h-3.5 w-3.5" />
                  Salary Range
                </label>
                <div className="relative">
                  <select
                    value={currentSalary}
                    onChange={(e) => updateFilter("salary", e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-border bg-zinc-50/20 dark:bg-zinc-950/25 px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-brand-border cursor-pointer shadow-inner pr-8"
                  >
                    <option value="">All Salaries</option>
                    <option value="below_15k">Below ₹15,000</option>
                    <option value="15k_30k">₹15,000 - ₹30,000</option>
                    <option value="30k_50k">₹30,000 - ₹50,000</option>
                    <option value="above_50k">Above ₹50,000</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l border-t border-muted h-1.5 w-1.5 rotate-[135deg]" />
                </div>
              </div>

              {/* 6. Experience Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  Experience Level
                </label>
                <div className="relative">
                  <select
                    value={currentExperience}
                    onChange={(e) => updateFilter("experience", e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-border bg-zinc-50/20 dark:bg-zinc-950/25 px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-brand-border cursor-pointer shadow-inner pr-8"
                  >
                    <option value="">All Experiences</option>
                    <option value="fresher">Fresher / Entry Level</option>
                    <option value="1_3_years">1 - 3 Years Experience</option>
                    <option value="3_5_years">3 - 5 Years Experience</option>
                    <option value="5_plus_years">5+ Years Experience</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l border-t border-muted h-1.5 w-1.5 rotate-[135deg]" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
