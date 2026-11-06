"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Terminal,
  FileCode2,
  Sparkles,
  Search,
} from "lucide-react";
import { codeSnippets } from "@/data/codeSnippets";

export const CodeArenaSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(codeSnippets[0].id);
  const [copied, setCopied] = useState(false);

  const filteredSnippets = codeSnippets.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeSnippet =
    codeSnippets.find((s) => s.id === selectedSnippetId) || codeSnippets[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = activeSnippet.code.split("\n");

  return (
    <section id="code-arena" className="py-24 border-b border-[#222222] bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#2B2B2B] text-xs font-mono text-[#CCCCCC] mb-3">
              <Terminal className="w-3.5 h-3.5 text-[#AAAAAA]" />
              Source Code & Script Arena
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Production Apex & SOQL Viewer
            </h2>
            <p className="text-[#888888] text-sm sm:text-base mt-2 max-w-2xl">
              Inspect verified code from our workspace — from foundational primitives and collections to 
              partial-success DML and the Customer Complaint Management Capstone architecture.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#141414] border border-[#262626] text-emerald-400">
              Verified in Salesforce Org
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-center">
          {/* Category Tabs */}
          <div className="md:col-span-8 flex items-center gap-2 overflow-x-auto pb-1">
            {["All", "Apex Practice", "SOQL Queries", "Capstone Architecture"].map(
              (category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    const firstMatch = codeSnippets.find(
                      (s) => category === "All" || s.category === category
                    );
                    if (firstMatch) setSelectedSnippetId(firstMatch.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-white text-black font-semibold"
                      : "bg-[#141414] text-[#888888] hover:text-white border border-[#242424]"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>

          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scripts, tags, methods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121212] border border-[#262626] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#555555]"
            />
          </div>
        </div>

        {/* Main 2-Column Code Viewer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Script Directory Selector */}
          <div className="lg:col-span-4 space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredSnippets.map((snippet) => {
              const isSelected = snippet.id === activeSnippet.id;
              return (
                <button
                  key={snippet.id}
                  onClick={() => setSelectedSnippetId(snippet.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-[#222222] to-[#161616] border-[#4A4A4A] text-white"
                      : "bg-[#121212] hover:bg-[#1A1A1A] border-[#222222] text-[#888888]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className={isSelected ? "text-white font-semibold" : "text-[#888888]"}>
                      {snippet.category}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1C1C1C] text-[#AAAAAA] font-mono">
                      {snippet.language.toUpperCase()}
                    </span>
                  </div>
                  <div className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-[#CCCCCC]"}`}>
                    {snippet.title}
                  </div>
                  <div className="text-[11px] text-[#666666] truncate mt-0.5 font-mono">
                    {snippet.filename}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {snippet.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#181818] text-[#888888]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Code Viewer & Takeaways */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Syntax Box Window */}
            <div className="rounded-2xl border border-[#262626] bg-[#0D0D0D] overflow-hidden shadow-2xl">
              
              {/* Window Header */}
              <div className="p-4 bg-[#141414] border-b border-[#222222] flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#333333]" />
                    <div className="w-3 h-3 rounded-full bg-[#444444]" />
                    <div className="w-3 h-3 rounded-full bg-[#555555]" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#CCCCCC]">
                    <FileCode2 className="w-4 h-4 text-white" />
                    <span className="font-semibold text-white">{activeSnippet.filename}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2C2C2C] text-xs font-mono text-white border border-[#333333] transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#888888]" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Content with Line Numbers */}
              <div className="p-4 overflow-x-auto max-h-[460px] font-mono text-xs leading-relaxed bg-[#0A0A0A]">
                <table className="w-full border-collapse">
                  <tbody>
                    {codeLines.map((line, idx) => (
                      <tr key={idx} className="hover:bg-[#141414]">
                        <td className="w-10 pr-4 text-right select-none text-[#444444] font-mono text-[11px] align-top py-0.5">
                          {idx + 1}
                        </td>
                        <td className="whitespace-pre py-0.5 text-[#E0E0E0]">
                          {line.startsWith("//") ? (
                            <span className="text-[#666666] italic">{line}</span>
                          ) : (
                            <span>
                              {line
                                .replace(/\b(public|private|static|class|trigger|on|void|return|new|if|else|switch|when|insert|update|delete|Database|SELECT|FROM|WHERE|ORDER BY|LIMIT|GROUP BY|COUNT|AVG|MAX|Date|String|Integer|Decimal|Boolean|Id|List|Set|Map|Case|Account|Contact)\b/g, "«KW»$1«/KW»")
                                .split(/«\/?KW»/)
                                .map((chunk, cIdx) => {
                                  const isKw = [
                                    "public", "private", "static", "class", "trigger", "on", "void", "return", "new",
                                    "if", "else", "switch", "when", "insert", "update", "delete", "Database",
                                    "SELECT", "FROM", "WHERE", "ORDER BY", "LIMIT", "GROUP BY", "COUNT", "AVG", "MAX",
                                    "Date", "String", "Integer", "Decimal", "Boolean", "Id", "List", "Set", "Map", "Case", "Account", "Contact"
                                  ].includes(chunk);
                                  return (
                                    <span
                                      key={cIdx}
                                      className={
                                        isKw
                                          ? "text-white font-bold"
                                          : chunk.startsWith("'") || chunk.endsWith("'")
                                          ? "text-emerald-400"
                                          : "text-[#D0D0D0]"
                                      }
                                    >
                                      {chunk}
                                    </span>
                                  );
                                })}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Key Developer Takeaways Card */}
            <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#222222] text-amber-400 flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  Key Developer Takeaway
                </h4>
                <p className="text-xs text-[#AAAAAA] mt-1 leading-relaxed">
                  {activeSnippet.takeaway}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
