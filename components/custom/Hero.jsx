"use client"
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import { ArrowRight, Link, Sparkles, Send, Wand2, Loader2, Code } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

function Hero() {
    const [userInput, setUserInput] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);
    const { messages, setMessages } = useContext(MessagesContext);
    const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
    const router = useRouter();
    const { savedProjects, loadProjectLocal, deleteProjectLocal } = useEditor();

    const onGenerate = async (input) => {
        const msg = {
            role: 'user',
            content: input
        }
        setMessages([msg]);
        const workspaceID = await CreateWorkspace({
            messages: [msg]
        });
        router.push('/workspace/' + workspaceID);
    }

    const enhancePrompt = async () => {
        if (!userInput) return;
        
        setIsEnhancing(true);
        try {
            const response = await fetch('/api/enhance-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userInput }),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let enhancedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.chunk) {
                                enhancedText += data.chunk;
                                setUserInput(enhancedText);
                            }
                            if (data.done && data.enhancedPrompt) {
                                setUserInput(data.enhancedPrompt);
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error enhancing prompt:', error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const onSuggestionClick = (suggestion) => {
        setUserInput(suggestion);
    };

    return (
        <div className="min-h-screen bg-[#06030b] relative overflow-hidden flex flex-col justify-between">
            {/* Animated premium background grids and glows */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#6b21a808_1px,transparent_1px),linear-gradient(to_bottom,#6b21a808_1px,transparent_1px)] bg-[size:16px_28px] pointer-events-none">
                {/* Master background radial gradients */}
                <div className="absolute left-1/2 top-0 h-[600px] w-[1200px] -translate-x-1/2 bg-[radial-gradient(circle_500px_at_50%_150px,#7c3aed0f,transparent)]" />
                <div className="absolute left-[20%] top-[10%] h-[400px] w-[400px] bg-[radial-gradient(circle_300px_at_center,#f43f5e05,transparent)]" />
                <div className="absolute right-[20%] top-[15%] h-[400px] w-[400px] bg-[radial-gradient(circle_300px_at_center,#eab30803,transparent)]" />
            </div>

            <div className="container mx-auto px-6 py-20 relative z-10 flex-1 flex flex-col items-center">
                <div className="flex flex-col items-center justify-center space-y-14 w-full max-w-5xl">
                    {/* Hero Header */}
                    <div className="text-center space-y-6 max-w-4xl">
                        <div className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-fuchsia-500/10 rounded-full px-6 py-2.5 mb-6 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.08)]">
                            <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                            <span className="bg-gradient-to-r from-amber-200 via-rose-300 to-fuchsia-300 bg-clip-text text-transparent text-xs font-extrabold tracking-widest uppercase">
                                NEXT-GEN AI DEVELOPMENT
                            </span>
                        </div>
                        
                        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] font-sans">
                            <span className="text-white">Design the </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-violet-400">
                                Ultimate
                            </span>
                            <br className="hidden md:inline" />
                            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent font-serif italic font-medium ml-1">
                                Web Experience
                            </span>
                        </h2>
                        
                        <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
                            Instantly draft, edit, and compile gorgeous responsive React applications using next-generation AI pipelines.
                        </p>
                    </div>

                    {/* Description Textarea Box */}
                    <div className="w-full max-w-3xl bg-[#0f0a1c]/40 backdrop-blur-2xl rounded-2xl border border-fuchsia-950/40 shadow-[0_20px_50px_rgba(124,58,237,0.1)] p-2">
                        <div className="bg-[#07030e]/80 p-5 rounded-xl border border-fuchsia-950/20">
                            <div className="flex gap-4">
                                <textarea
                                    placeholder="DESCRIBE YOUR VISION..."
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    className="w-full bg-transparent border-0 rounded-lg p-3 text-zinc-100 placeholder-zinc-600 focus:ring-0 outline-none font-mono text-base h-36 resize-none transition-all duration-300"
                                    disabled={isEnhancing}
                                />
                                <div className="flex flex-col gap-2.5">
                                    {userInput && (
                                        <>
                                            <button
                                                onClick={enhancePrompt}
                                                disabled={isEnhancing}
                                                className={`flex items-center justify-center bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-500 hover:to-rose-600 text-white rounded-xl p-3.5 transition-all duration-200 shadow-[0_0_15px_rgba(245,158,11,0.2)] ${isEnhancing ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                                                title="Enhance with AI"
                                            >
                                                {isEnhancing ? (
                                                    <Loader2 className="h-6 w-6 animate-spin" />
                                                ) : (
                                                    <Wand2 className="h-6 w-6" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => onGenerate(userInput)}
                                                disabled={isEnhancing}
                                                className={`flex items-center justify-center bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white rounded-xl p-3.5 transition-all duration-200 shadow-[0_0_15px_rgba(244,63,94,0.2)] ${isEnhancing ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                                                title="Generate Website"
                                            >
                                                <Send className="h-6 w-6" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end mt-2 pt-2 border-t border-fuchsia-950/10">
                                <Link className="h-5 w-5 text-rose-400/60 hover:text-rose-400 transition-colors duration-200 cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Premium Live Showcase Mockup */}
                    <div className="w-full max-w-4xl mt-4">
                        <div className="relative rounded-2xl border border-fuchsia-950/30 bg-[#0f0a1c]/30 p-2 backdrop-blur-md shadow-[0_25px_60px_-15px_rgba(124,58,237,0.15)] group overflow-hidden">
                            {/* Decorative blur elements */}
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
                            
                            {/* Mockup Toolbar */}
                            <div className="flex items-center justify-between px-4 py-2.5 bg-[#07030e]/95 border-b border-fuchsia-950/20 rounded-t-xl">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                </div>
                                <div className="text-[10px] font-mono text-zinc-500 select-none bg-[#140e21] px-5 py-1 rounded-full border border-fuchsia-950/20">
                                    AI-Powered Designer — Built by Abraham Paul Sanhith
                                </div>
                                <div className="w-16" />
                            </div>
                            
                            {/* Mockup Image Frame */}
                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-b-xl bg-[#090513] border border-fuchsia-950/10">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src="/premium-builder-mockup.png" 
                                    alt="AI Website Builder Preview Mockup" 
                                    className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-[1.01]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#06030b] via-transparent to-transparent opacity-30" />
                                
                                {/* Floating Overlay Badge */}
                                <div className="absolute bottom-5 right-5 flex items-center gap-2 bg-[#07030e]/90 border border-amber-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)] px-4 py-2 rounded-xl backdrop-blur-md">
                                    <div className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                                    <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-amber-200">
                                        PRO CANVAS ACTIVE
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Suggestions Grid */}
                    <div className="w-full max-w-4xl pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Lookup?.SUGGSTIONS.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSuggestionClick(suggestion)}
                                    className="group relative p-5 bg-[#0f0a1c]/20 hover:bg-[#0f0a1c]/60 border border-fuchsia-950/30 rounded-xl text-left transition-all duration-300 hover:border-rose-500/30 hover:shadow-[0_0_20px_rgba(244,63,94,0.08)]"
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_50%,#f43f5e05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                                    <span className="text-zinc-400 group-hover:text-rose-200 font-sans text-sm font-medium tracking-wide transition-colors duration-300">
                                        {suggestion}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full max-w-4xl border-t border-fuchsia-950/20 my-6" />

                    {/* Interactive Features Showcase with New Images */}
                    <div className="w-full max-w-4xl space-y-12 py-6">
                        {/* Intro Header */}
                        <div className="text-center space-y-3">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400 tracking-tight font-sans">
                                State-of-the-Art Design Systems
                            </h3>
                            <p className="text-zinc-500 text-sm max-w-xl mx-auto font-sans">
                                Unlock ultimate creative control with bespoke, visual AI features tailored for next-generation web performance.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Feature 1: Style customizer slider mockup */}
                            <div className="group relative rounded-2xl border border-fuchsia-950/20 bg-[#0f0a1c]/20 p-5 backdrop-blur-md hover:border-rose-500/20 hover:shadow-[0_15px_40px_rgba(244,63,94,0.06)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
                                <div className="space-y-4">
                                    {/* Image container */}
                                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#090513] border border-fuchsia-950/15">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src="/customizer-controls.png" 
                                            alt="Visual Layout Editor Sliders" 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300 font-extrabold">
                                            Visual Customizer
                                        </span>
                                        <h4 className="text-lg font-bold text-white group-hover:text-rose-200 transition-colors duration-300">
                                            Interactive Canvas Control
                                        </h4>
                                        <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                                            Tweak margins, paddings, typography, and borders in real-time. Instantly see design updates applied across the active DOM nodes.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2: Responsive glassmorphic devices mockup */}
                            <div className="group relative rounded-2xl border border-fuchsia-950/20 bg-[#0f0a1c]/20 p-5 backdrop-blur-md hover:border-violet-500/20 hover:shadow-[0_15px_40px_rgba(124,58,237,0.06)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
                                <div className="space-y-4">
                                    {/* Image container */}
                                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#090513] border border-fuchsia-950/15">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src="/responsive-devices.png" 
                                            alt="Multi Device Previews" 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-violet-300 font-extrabold">
                                            Device Previews
                                        </span>
                                        <h4 className="text-lg font-bold text-white group-hover:text-violet-200 transition-colors duration-300">
                                            Multi-Device Adaptability
                                        </h4>
                                        <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                                            Instantly preview and verify layouts on interactive Desktop, Tablet, and Mobile canvas models prior to compiling.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full max-w-4xl border-t border-fuchsia-950/20 my-6" />

                    {/* Recent Projects Dashboard */}
                    {savedProjects && savedProjects.length > 0 && (
                        <div className="w-full max-w-4xl space-y-6 pt-12 border-t border-fuchsia-950/20">
                            <h3 className="text-lg font-bold font-sans text-zinc-200 tracking-tight flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-rose-400" />
                                <span>Your Recent Projects</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {savedProjects.map((projectItem, idx) => (
                                    <div 
                                        key={idx}
                                        className="p-6 bg-[#0f0a1c]/10 border border-fuchsia-950/30 rounded-2xl flex flex-col justify-between hover:border-rose-500/20 hover:shadow-[0_0_20px_rgba(244,63,94,0.08)] transition-all duration-300 group"
                                    >
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-white text-base group-hover:text-rose-300 transition-colors duration-200">
                                                {projectItem.projectTitle}
                                            </h4>
                                            <p className="text-xs text-zinc-500 font-mono">
                                                Sections: {projectItem.sections?.length || 0}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-6">
                                            <button 
                                                onClick={() => {
                                                    loadProjectLocal(projectItem);
                                                    router.push('/workspace/recent');
                                                }}
                                                className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
                                            >
                                                Resume Editing →
                                            </button>
                                            <button 
                                                onClick={() => deleteProjectLocal(projectItem.projectTitle)}
                                                className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
                                                title="Delete Project"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Footer with Abraham Paul Sanhith Branding */}
            <footer className="w-full border-t border-fuchsia-950/20 bg-[#040208]/90 backdrop-blur-md py-12 mt-20 relative z-10">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-600 p-1.5 rounded-lg">
                            <Code className="h-4.5 w-4.5 text-white" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-wider font-sans">AI WEBSITE BUILDER</span>
                    </div>
                    
                    <div className="text-center font-mono text-xs text-zinc-400">
                        Designed & Built with ⚡ by <span className="bg-gradient-to-r from-amber-200 via-rose-300 to-violet-400 bg-clip-text text-transparent font-extrabold">Abraham Paul Sanhith</span>
                    </div>
                    
                    <div className="text-[10px] font-mono text-zinc-600">
                        &copy; {new Date().getFullYear()} AI Website Builder. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Hero;