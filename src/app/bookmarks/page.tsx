"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark as BookmarkIcon, BookOpen, Calculator } from "lucide-react";
import { useStore } from "@/store/useStore";
import { syllabusData } from "@/data/syllabus";
import { pyqData } from "@/data/pyqs";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useStore();

  // Get bookmarked items details
  const bookmarkedConcepts = bookmarks
    .filter((b) => b.type === "concept")
    .map((bookmark) => {
      const unit = syllabusData.find((u) => u.id === bookmark.unit);
      const concept = unit?.concepts.find((c) => c.id === bookmark.itemId);
      return concept ? { ...concept, bookmarkId: bookmark.id, timestamp: bookmark.timestamp } : null;
    })
    .filter(Boolean);

  const bookmarkedFormulas = bookmarks
    .filter((b) => b.type === "formula")
    .map((bookmark) => {
      const unit = syllabusData.find((u) => u.id === bookmark.unit);
      const concept = unit?.concepts.find((c) => c.id === bookmark.itemId);
      return concept ? { ...concept, bookmarkId: bookmark.id, timestamp: bookmark.timestamp } : null;
    })
    .filter(Boolean);

  const bookmarkedPYQs = bookmarks
    .filter((b) => b.type === "pyq")
    .map((bookmark) => {
      const pyq = pyqData.find((p) => p.id === bookmark.itemId);
      return pyq ? { ...pyq, bookmarkId: bookmark.id, timestamp: bookmark.timestamp } : null;
    })
    .filter(Boolean);

  const handleRemoveBookmark = (bookmarkId: string) => {
    removeBookmark(bookmarkId);
  };

  const allBookmarks = [
    ...bookmarkedConcepts.map((b: any) => ({ ...b, type: "concept" as const })),
    ...bookmarkedFormulas.map((b: any) => ({ ...b, type: "formula" as const })),
    ...bookmarkedPYQs.map((b: any) => ({ ...b, type: "pyq" as const })),
  ].sort((a, b) => (b as any).timestamp - (a as any).timestamp);

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
          <BookmarkIcon className="w-8 h-8" />
          Bookmarks
        </h1>

        {allBookmarks.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <BookmarkIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h2 className="text-2xl font-bold mb-2">No bookmarks yet</h2>
            <p className="opacity-70">Save important concepts, formulas, and PYQs for quick access.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {allBookmarks.map((item: any, index) => (
              <div
                key={item.bookmarkId}
                className="glass-card p-5 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {item.type === "concept" && (
                        <>
                          <BookOpen className="w-4 h-4 opacity-70" />
                          <span className="px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">Concept</span>
                        </>
                      )}
                      {item.type === "formula" && (
                        <>
                          <Calculator className="w-4 h-4 opacity-70" />
                          <span className="px-2 py-0.5 rounded-full bg-ocean/20 text-ocean text-xs">Formula</span>
                        </>
                      )}
                      {item.type === "pyq" && (
                        <>
                          <Calculator className="w-4 h-4 opacity-70" />
                          <span className="px-2 py-0.5 rounded-full bg-peach/20 text-peach text-xs">PYQ</span>
                        </>
                      )}
                      <span className="text-xs opacity-50">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    {item.type === "pyq" ? (
                      <>
                        <h3 className="text-lg font-semibold mb-2">{item.topic}</h3>
                        <p className="opacity-70 text-sm line-clamp-2 mb-3">{item.question}</p>
                        <Link
                          href={`/solver#${item.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-colors text-sm"
                        >
                          View Solution
                        </Link>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="opacity-70 text-sm line-clamp-2 mb-3">{item.description}</p>
                        {item.formula && (
                          <code className="block mb-3 p-2 rounded bg-black/5 text-sm">{item.formula}</code>
                        )}
                        <Link
                          href={`/learn#${item.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-colors text-sm"
                        >
                          View Details
                        </Link>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemoveBookmark(item.bookmarkId)}
                    className="p-2 rounded-full hover:bg-red/20 text-red/70 hover:text-red transition-colors ml-4"
                    aria-label="Remove bookmark"
                  >
                    <BookmarkIcon className="w-5 h-5 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
