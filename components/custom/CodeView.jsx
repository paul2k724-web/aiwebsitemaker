"use client";

import React, { useState, useEffect, useCallback, useContext, memo } from 'react';
import dynamic from 'next/dynamic';
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import { useEditor } from '@/context/EditorContext';
import { MessagesContext } from '@/context/MessagesContext';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { Loader2Icon, Download, Monitor, Smartphone, Tablet, ZoomIn, ZoomOut, Sparkles, Layers, Sliders, Code, Eye } from 'lucide-react';
import JSZip from 'jszip';
import StyleSidebar from '@/components/canvas/StyleSidebar';
import ChatView from './ChatView';

const SandpackProvider = dynamic(() => import("@codesandbox/sandpack-react").then(mod => mod.SandpackProvider), { ssr: false });
const SandpackLayout = dynamic(() => import("@codesandbox/sandpack-react").then(mod => mod.SandpackLayout), { ssr: false });
const SandpackCodeEditor = dynamic(() => import("@codesandbox/sandpack-react").then(mod => mod.SandpackCodeEditor), { ssr: false });
const SandpackPreview = dynamic(() => import("@codesandbox/sandpack-react").then(mod => mod.SandpackPreview), { ssr: false });
const SandpackFileExplorer = dynamic(() => import("@codesandbox/sandpack-react").then(mod => mod.SandpackFileExplorer), { ssr: false });

function CodeView() {
    const { id } = useParams();
    const {
        project,
        files,
        activeSectionId,
        setActiveSectionId,
        deviceMode,
        setDeviceMode,
        zoom,
        setZoom,
        setProject
    } = useEditor();

    const { messages } = useContext(MessagesContext);
    const UpdateFiles = useMutation(api.workspace.UpdateFiles);
    const convex = useConvex();

    const [activeTab, setActiveTab] = useState('preview');
    const [leftTab, setLeftTab] = useState('chat');
    const [loading, setLoading] = useState(false);

    // Load initial layout data from Convex database on mount
    const GetFiles = useCallback(async () => {
        try {
            const result = await convex.query(api.workspace.GetWorkspace, {
                workspaceId: id
            });
            if (result?.fileData) {
                setProject(result.fileData);
            }
        } catch (e) {
            console.error("Error loading project files from Convex:", e);
        }
    }, [id, convex, setProject]);

    useEffect(() => {
        id && GetFiles();
    }, [id, GetFiles]);

    // Handle AI structured JSON generation stream
    const GenerateAiCode = useCallback(async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
        
        try {
            const response = await fetch('/api/gen-ai-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: PROMPT }),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let finalData = null;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.done && data.final) {
                                finalData = data.final;
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }

            if (finalData && finalData.sections) {
                // Update local visual canvas project state (triggers reactive re-compiling)
                setProject(finalData);

                // Save update to Convex database
                await UpdateFiles({
                    workspaceId: id,
                    files: finalData
                });
            }
        } catch (error) {
            console.error('Error generating AI website:', error);
        } finally {
            setLoading(false);
        }
    }, [messages, id, UpdateFiles, setProject]);

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role === 'user') {
                GenerateAiCode();
            }
        }
    }, [messages, GenerateAiCode]);

    // Sync download ZIP compilation
    const downloadFiles = useCallback(async () => {
        setLoading(true);
        try {
            const zip = new JSZip();
            
            // Add each generated file in the memory dictionary to ZIP
            Object.entries(files).forEach(([filename, content]) => {
                let fileContent;
                if (typeof content === 'string') {
                    fileContent = content;
                } else if (content && typeof content === 'object') {
                    if (content.code) {
                        fileContent = content.code;
                    } else {
                        fileContent = JSON.stringify(content, null, 2);
                    }
                }

                if (fileContent) {
                    const cleanFileName = filename.startsWith('/') ? filename.slice(1) : filename;
                    zip.file(cleanFileName, fileContent);
                }
            });

            // Add package.json with the required dependencies
            const packageJson = {
                name: "generated-ai-project",
                version: "1.0.0",
                private: true,
                dependencies: Lookup.DEPENDANCY,
                scripts: {
                    "dev": "vite",
                    "build": "vite build",
                    "preview": "vite preview"
                }
            };
            zip.file("package.json", JSON.stringify(packageJson, null, 2));

            const blob = await zip.generateAsync({ type: "blob" });
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project.projectTitle.toLowerCase().replace(/\s+/g, '-')}-project.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading files:', error);
        } finally {
            setLoading(false);
        }
    }, [files, project.projectTitle]);

    // Responsive width helper for preview frame
    const getDeviceWidth = () => {
        switch (deviceMode) {
            case 'mobile': return '390px';
            case 'tablet': return '768px';
            default: return '100%';
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full bg-transparent">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between p-4 bg-[#141414] border border-gray-800 rounded-xl shadow-lg gap-4">
                {/* Visual / Code Tab Switcher */}
                <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-full border border-gray-800 shrink-0">
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full transition-all duration-200 ${
                            activeTab === 'preview' 
                                ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.25)]' 
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Preview</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full transition-all duration-200 ${
                            activeTab === 'code' 
                                ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.25)]' 
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <Code className="h-3.5 w-3.5" />
                        <span>Code IDE</span>
                    </button>
                </div>

                {/* Device responsive preview modes switcher */}
                {activeTab === 'preview' && (
                    <div className="flex items-center gap-1 bg-black/60 p-1.5 rounded-full border border-gray-800 shrink-0">
                        {[
                            { mode: 'desktop', icon: Monitor, label: 'Desktop' },
                            { mode: 'tablet', icon: Tablet, label: 'Tablet' },
                            { mode: 'mobile', icon: Smartphone, label: 'Mobile' }
                        ].map(dev => {
                            const Icon = dev.icon;
                            return (
                                <button
                                    key={dev.mode}
                                    onClick={() => setDeviceMode(dev.mode)}
                                    className={`p-2 rounded-full transition-all ${
                                        deviceMode === dev.mode 
                                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' 
                                            : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                    title={dev.label}
                                >
                                    <Icon className="h-4 w-4" />
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Zoom scaling controls */}
                {activeTab === 'preview' && (
                    <div className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-full border border-gray-800 shrink-0">
                        <button 
                            onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                            className="text-gray-400 hover:text-gray-200 active:scale-90 transition-transform"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </button>
                        <span className="text-[11px] font-mono text-gray-400 w-10 text-center">{zoom}%</span>
                        <button 
                            onClick={() => setZoom(prev => Math.min(150, prev + 10))}
                            className="text-gray-400 hover:text-gray-200 active:scale-90 transition-transform"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Export/Download zip actions */}
                <button
                    onClick={downloadFiles}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-rose-500 to-violet-600 hover:from-amber-500 hover:via-rose-600 hover:to-violet-750 text-white font-extrabold text-xs px-5 py-2.5 rounded-full shadow-lg shadow-rose-500/20 active:scale-95 transition-all duration-200 disabled:opacity-75"
                >
                    <Download className="h-4 w-4" />
                    <span>Download Project ZIP</span>
                </button>
            </div>

            {/* Main Interactive Grid Layout */}
            <div className="flex-1 flex gap-6 items-stretch min-h-0">
                {/* Left Panel: Conversational AI + Outline Tabbed Panel */}
                <div className="w-96 bg-[#141414] border border-gray-800 rounded-xl p-4 flex flex-col gap-4 shadow-lg shrink-0">
                    {/* Tab Switcher Headers */}
                    <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-lg border border-gray-800/80">
                        <button
                            onClick={() => setLeftTab('chat')}
                            className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold py-2.5 rounded-md transition-all ${
                                leftTab === 'chat'
                                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.05)]'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>AI Chat Designer</span>
                        </button>
                        <button
                            onClick={() => setLeftTab('outline')}
                            className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold py-2.5 rounded-md transition-all ${
                                leftTab === 'outline'
                                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.05)]'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <Layers className="h-3.5 w-3.5" />
                            <span>Outline Navigator</span>
                        </button>
                    </div>

                    {/* Tab Body */}
                    <div className="flex-1 min-h-0 flex flex-col">
                        {leftTab === 'chat' ? (
                            <div className="flex-1 min-h-0">
                                <ChatView />
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
                                {project?.sections?.map((sec, idx) => (
                                    <button
                                        key={sec.id}
                                        onClick={() => setActiveSectionId(sec.id)}
                                        className={`w-full p-3.5 text-left border flex items-center justify-between rounded-lg transition-all duration-200 group ${
                                            activeSectionId === sec.id
                                                ? 'bg-violet-600/10 border-violet-500/40 text-violet-400'
                                                : 'bg-black/20 border-zinc-900 text-gray-400 hover:bg-zinc-900/30 hover:border-zinc-800 hover:text-gray-200'
                                        }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-mono uppercase text-zinc-500">
                                                Section {idx + 1}
                                            </span>
                                            <span className="text-xs font-bold font-sans">
                                                {sec.type.charAt(0).toUpperCase() + sec.type.slice(1)}
                                            </span>
                                        </div>
                                        <Sliders className={`h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                                            activeSectionId === sec.id ? 'opacity-100 text-violet-400' : 'text-gray-500'
                                        }`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Center Canvas / IDE Pane */}
                <div className="flex-1 bg-[#141414] border border-gray-800 rounded-xl relative overflow-hidden shadow-lg">
                    <SandpackProvider
                        files={files}
                        template="react"
                        theme="dark"
                        customSetup={{
                            dependencies: {
                                ...Lookup.DEPENDANCY
                            },
                            entry: '/index.js'
                        }}
                        options={{
                            externalResources: ['https://cdn.tailwindcss.com'],
                            bundlerTimeoutSecs: 120,
                            recompileMode: "immediate",
                            recompileDelay: 300
                        }}
                    >
                        <div className="absolute inset-0 flex flex-col">
                            {activeTab === 'code' ? (
                                <div className="flex-1 flex w-full min-h-0">
                                    <SandpackFileExplorer style={{ height: '100%', background: '#141414', borderRight: '1px solid #262626' }} />
                                    <SandpackCodeEditor
                                        style={{ height: '100%', background: '#141414' }}
                                        showTabs
                                        showLineNumbers
                                        showInlineErrors
                                        wrapContent
                                    />
                                </div>
                            ) : (
                                <div className="flex-1 w-full flex items-center justify-center bg-black/40 overflow-auto p-6 scrollbar-hide">
                                    <div 
                                        className="transition-all duration-300 shadow-2xl relative bg-[#0b0f19] border border-gray-800 rounded-2xl overflow-hidden"
                                        style={{
                                            width: getDeviceWidth(),
                                            height: '100%',
                                            transform: `scale(${zoom / 100})`,
                                            transformOrigin: 'center center'
                                        }}
                                    >
                                        <SandpackPreview
                                            style={{ height: '100%', width: '100%', background: 'transparent' }}
                                            showNavigator={false}
                                            showOpenInCodeSandbox={false}
                                            showRefreshButton={false}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </SandpackProvider>
                </div>

                {/* Right Panel: Style controls sidebar */}
                <StyleSidebar />
            </div>

            {/* Spinner Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
                    <Loader2Icon className="animate-spin h-10 w-10 text-rose-400" />
                    <h3 className="text-white font-bold text-lg">Compiling Standalone ZIP...</h3>
                    <p className="text-zinc-400 font-mono text-xs">Assembling clean React & Tailwind files.</p>
                </div>
            )}
        </div>
    );
}

export default CodeView;