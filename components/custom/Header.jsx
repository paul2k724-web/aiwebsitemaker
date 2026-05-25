"use client";

import React from 'react';
import { Code, Sparkles, Save } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { useParams } from 'next/navigation';

function Header() {
    const params = useParams();
    const isWorkspace = !!params?.id;
    const { project, setProject, saveProjectLocal } = useEditor();

    const handleTitleChange = (e) => {
        setProject(prev => ({
            ...prev,
            projectTitle: e.target.value
        }));
    };

    return (
        <header className="border-b border-fuchsia-950/20 bg-[#07030e]/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-600 p-2 rounded-lg shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                            <Code className="h-5 w-5 text-white animate-pulse" />
                        </div>
                        {isWorkspace ? (
                            <div className="flex items-center gap-3">
                                <input 
                                    type="text"
                                    value={project.projectTitle}
                                    onChange={handleTitleChange}
                                    className="bg-transparent border-b border-transparent hover:border-fuchsia-900/40 focus:border-rose-400 text-lg font-bold text-white outline-none px-1 py-0.5 w-60 transition-all font-sans"
                                    title="Click to rename website"
                                />
                                <div className="hidden md:flex items-center space-x-2 text-[10px] uppercase font-mono tracking-widest text-amber-200/80 bg-amber-500/5 px-3 py-1 rounded-full border border-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.03)]">
                                    <span>Built by Abraham Paul Sanhith</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                <h1 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400 tracking-tight font-sans">
                                    AI Powered Website Builder
                                </h1>
                                <div className="text-[9px] uppercase font-mono tracking-widest text-amber-200/90 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-fuchsia-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.08)] font-semibold">
                                    Built by Abraham Paul Sanhith
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions and Status */}
                    <div className="flex items-center gap-4">
                        {isWorkspace && (
                            <button
                                onClick={() => saveProjectLocal()}
                                className="flex items-center gap-1.5 text-xs font-bold bg-[#140e21] hover:bg-[#1f1632] border border-fuchsia-900/30 hover:border-fuchsia-800/40 text-amber-100/90 px-4.5 py-2.5 rounded-full transition-all duration-200 active:scale-95 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.05)]"
                            >
                                <Save className="h-3.5 w-3.5 text-rose-400" />
                                <span>Save Project</span>
                            </button>
                        )}
                        <div className="flex items-center space-x-2 bg-fuchsia-500/10 text-fuchsia-300 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-fuchsia-500/20 shrink-0 shadow-[0_0_15px_rgba(217,70,239,0.08)]">
                            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                            <span>AI Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;