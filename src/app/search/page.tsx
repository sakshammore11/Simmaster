"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, BookOpen, Calculator } from "lucide-react";
import { syllabusData } from "@/data/syllabus";
import { pyqData } from "@/data/pyqs";
import { useStore } from "@/store/useStore";

export default function SearchPage() {
  const { searchQuery, setSearchQuery } = useStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };

  // Search concepts
  const matchedConcepts = syllabusData.flatMap((unit) =>
    unit.concepts.filter(
      (concept) =>
        concept.title.toLowerCase().includes(localQuery.toLowerCase()) ||
        concept.description.toLowerCase().includes(localQuery.toLowerCase())
    )
  );

  // Search PYQs
  const matchedPYQs = pyqData.filter(
    (pyq) =>
      pyq.topic.toLowerCase().includes(localQuery.toLowerCase()) ||
      pyq.question.toLowerCase().includes(localQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 opacity-70 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <Search className="w-8 h-8" />
          Search Results
        </h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
            <input
              type="text"
              placeholder="Search topics, formulas, PYQs..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl glass border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-orange/50 transition-all text-lg"
            />
          </div>
        </form>

        {!localQuery && (
          <div className="glass-card p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg opacity-70">Enter a search term to find concepts, formulas, and PYQs.</p>
          </div>
        )}

        {localQuery && matchedConcepts.length === 0 && matchedPYQs.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-lg opacity-70">No results found for "{localQuery}"</p>
            <p className="opacity-50 mt-2">Try different keywords or check your spelling.</p>
          </div>
        )}

        {matchedConcepts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Concepts ({matchedConcepts.length})
            </h2>
            <div className="grid gap-4">
              {matchedConcepts.map((concept, index) => (
                <Link
                  key={concept.id}
                  href={`/learn#${concept.id}`}
                  className="glass-card p-5 hover:scale-[1.02] transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">
                      Unit {concept.id.split("-")[0]}
                    </span>
                    {concept.pyqTag && (
                      <span className="px-2 py-0.5 rounded-full bg-ocean/20 text-ocean text-xs">PYQ</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{concept.title}</h3>
                  <p className="opacity-70 text-sm line-clamp-2">{concept.description}</p>
                  {concept.formula && (
                    <code className="block mt-3 p-2 rounded bg-black/5 text-sm">{concept.formula}</code>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {matchedPYQs.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              PYQs ({matchedPYQs.length})
            </h2>
            <div className="grid gap-4">
              {matchedPYQs.map((pyq, index) => (
                <Link
                  key={pyq.id}
                  href={`/solver#${pyq.id}`}
                  className="glass-card p-5 hover:scale-[1.02] transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">
                      Unit {pyq.unit}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-ocean/20 text-ocean text-xs">
                      {pyq.marks} Marks
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-peach/20 text-peach text-xs">
                      {pyq.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{pyq.topic}</h3>
                  <p className="opacity-70 text-sm line-clamp-2">{pyq.question}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
