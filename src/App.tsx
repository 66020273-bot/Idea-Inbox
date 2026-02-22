import { useState, useEffect, useRef } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Plus, 
  Send, 
  Inbox, 
  Trash2, 
  Archive, 
  CheckCircle2, 
  Loader2,
  FileText,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import JSZip from "jszip";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Note {
  id: number;
  content: string;
  title?: string;
  tags: string[];
  created_at: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [view, setView] = useState<"capture" | "inbox">("capture");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (view === "capture") {
      textareaRef.current?.focus();
    } else {
      fetchNotes();
    }
  }, [view]);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  };

  const handleSend = async () => {
    if (!content.trim() || isSending) return;
    setIsSending(true);

    try {
      // 1. Process with Gemini for title and tags
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Process this fleeting note for an Obsidian vault. 
        Generate a concise title (no extension) and relevant tags.
        Note: ${content}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "tags"]
          }
        }
      });

      const { title, tags } = JSON.parse(response.text || "{}");

      // 2. Save to backend
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, title, tags })
      });

      setContent("");
      textareaRef.current?.focus();
    } catch (err) {
      console.error("Failed to send note", err);
    } finally {
      setIsSending(false);
    }
  };

  const deleteNote = async (id: number) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setNotes(notes.filter(n => n.id !== id));
  };

  const exportAsZip = async () => {
    if (notes.length === 0) return;
    setIsExporting(true);
    const zip = new JSZip();

    notes.forEach(note => {
      const filename = `${note.title || `note-${note.id}`}.md`;
      const frontmatter = `---
title: ${note.title || ""}
tags: [${note.tags.join(", ")}]
created: ${note.created_at}
---

${note.content}`;
      zip.file(filename, frontmatter);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `idea-inbox-export-${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const clearInbox = async () => {
    if (!confirm("Are you sure you want to clear the entire inbox?")) return;
    await fetch("/api/notes", { method: "DELETE" });
    setNotes([]);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-zinc-900 font-sans selection:bg-emerald-100">
      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-6 py-4 flex justify-around items-center z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
        <button 
          onClick={() => setView("capture")}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            view === "capture" ? "text-emerald-600" : "text-zinc-400"
          )}
        >
          <Plus size={24} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Capture</span>
        </button>
        <button 
          onClick={() => setView("inbox")}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            view === "inbox" ? "text-emerald-600" : "text-zinc-400"
          )}
        >
          <div className="relative">
            <Inbox size={24} />
            {notes.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {notes.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider">Inbox</span>
        </button>
      </nav>

      <main className="max-w-2xl mx-auto p-6 pb-32 md:pt-24">
        <AnimatePresence mode="wait">
          {view === "capture" ? (
            <motion.div
              key="capture"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <header>
                <h1 className="text-3xl font-light tracking-tight text-zinc-400">
                  What's on your <span className="text-zinc-900 font-medium">mind?</span>
                </h1>
              </header>

              <div className="relative group">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start typing your fleeting thought..."
                  className="w-full h-[60vh] bg-transparent text-xl leading-relaxed resize-none focus:outline-none placeholder:text-zinc-300"
                />
                
                <div className="absolute bottom-4 right-0 flex items-center gap-4">
                  <AnimatePresence>
                    {content.trim() && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={handleSend}
                        disabled={isSending}
                        className="bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="inbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-medium tracking-tight">Inbox</h1>
                  <p className="text-zinc-400 text-sm">{notes.length} items waiting for vault</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={exportAsZip}
                    disabled={notes.length === 0 || isExporting}
                    className="p-2 text-zinc-500 hover:text-emerald-600 transition-colors disabled:opacity-30"
                    title="Export all as ZIP"
                  >
                    {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Archive size={20} />}
                  </button>
                  <button 
                    onClick={clearInbox}
                    disabled={notes.length === 0}
                    className="p-2 text-zinc-500 hover:text-red-600 transition-colors disabled:opacity-30"
                    title="Clear Inbox"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </header>

              <div className="space-y-4">
                {notes.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="inline-flex p-4 bg-zinc-100 rounded-full text-zinc-300">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-zinc-400">Your inbox is clear.</p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <motion.div
                      layout
                      key={note.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-emerald-500" />
                            <h3 className="font-medium text-sm text-zinc-800">{note.title || "Untitled Note"}</h3>
                          </div>
                          <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed">
                            {note.content}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {note.tags.map(tag => (
                              <span key={tag} className="text-[10px] font-mono bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-md">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-zinc-300 hover:text-red-500 transition-all"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
