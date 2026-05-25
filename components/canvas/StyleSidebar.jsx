"use client";

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { ArrowUp, ArrowDown, Trash2, Sliders, Type, Palette, Layout, Settings } from 'lucide-react';

function StyleSidebar() {
    const { 
        project, 
        setProject, 
        activeSectionId, 
        setActiveSectionId 
    } = useEditor();

    const sections = project?.sections || [];
    const activeSection = sections.find(s => s.id === activeSectionId);

    // Update specific property inside the active section
    const updateSectionProp = (propKey, value) => {
        if (!activeSectionId) return;
        setProject(prev => {
            const nextSections = prev.sections.map(sec => {
                if (sec.id === activeSectionId) {
                    return { ...sec, [propKey]: value };
                }
                return sec;
            });
            return { ...prev, sections: nextSections };
        });
    };

    // Update global theme variables
    const updateThemeProp = (themeKey, value) => {
        setProject(prev => ({
            ...prev,
            theme: {
                ...prev.theme,
                [themeKey]: value
            }
        }));
    };

    // Move section UP in the rendering tree
    const moveSectionUp = () => {
        const idx = sections.findIndex(s => s.id === activeSectionId);
        if (idx <= 0) return; // Already at top or not found
        setProject(prev => {
            const nextSections = [...prev.sections];
            const temp = nextSections[idx];
            nextSections[idx] = nextSections[idx - 1];
            nextSections[idx - 1] = temp;
            return { ...prev, sections: nextSections };
        });
    };

    // Move section DOWN in the rendering tree
    const moveSectionDown = () => {
        const idx = sections.findIndex(s => s.id === activeSectionId);
        if (idx === -1 || idx >= sections.length - 1) return; // Already at bottom
        setProject(prev => {
            const nextSections = [...prev.sections];
            const temp = nextSections[idx];
            nextSections[idx] = nextSections[idx + 1];
            nextSections[idx + 1] = temp;
            return { ...prev, sections: nextSections };
        });
    };

    // Delete section completely
    const deleteSection = () => {
        setProject(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== activeSectionId)
        }));
        setActiveSectionId(null);
    };

    return (
        <div className="w-80 h-[80vh] flex flex-col bg-[#141414] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 bg-[#181818] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-blue-400" />
                    <span className="font-bold text-sm text-gray-200 uppercase tracking-wider">
                        {activeSection ? `${activeSection.type} customizer` : "Global Styles"}
                    </span>
                </div>
                {activeSection && (
                    <button 
                        onClick={() => setActiveSectionId(null)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-mono"
                    >
                        Back to Theme
                    </button>
                )}
            </div>

            {/* Content pane */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
                {activeSection ? (
                    // Section-specific Visual Editors
                    <div className="space-y-6">
                        {/* Section Arrangement Control */}
                        <div className="space-y-3">
                            <label className="text-xs font-mono text-gray-400 uppercase">Arrange Section</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button 
                                    onClick={moveSectionUp}
                                    className="flex items-center justify-center gap-1.5 p-2.5 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-xs font-medium rounded-lg text-gray-300 hover:text-white transition-all"
                                    title="Move Section Up"
                                >
                                    <ArrowUp className="h-3.5 w-3.5" />
                                    <span>Up</span>
                                </button>
                                <button 
                                    onClick={moveSectionDown}
                                    className="flex items-center justify-center gap-1.5 p-2.5 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-xs font-medium rounded-lg text-gray-300 hover:text-white transition-all"
                                    title="Move Section Down"
                                >
                                    <ArrowDown className="h-3.5 w-3.5" />
                                    <span>Down</span>
                                </button>
                                <button 
                                    onClick={deleteSection}
                                    className="flex items-center justify-center gap-1.5 p-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-xs font-medium rounded-lg text-red-400 hover:text-red-300 transition-all"
                                    title="Delete Section"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>

                        {/* Title Customize */}
                        {activeSection.title !== undefined && (
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400 uppercase">Title Headline</label>
                                <textarea 
                                    value={activeSection.title}
                                    onChange={(e) => updateSectionProp('title', e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-lg p-3 text-sm text-white font-sans outline-none resize-none h-24 transition-colors"
                                />
                            </div>
                        )}

                        {/* Subtitle Customize */}
                        {activeSection.subtitle !== undefined && (
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400 uppercase">Subtitle Description</label>
                                <textarea 
                                    value={activeSection.subtitle}
                                    onChange={(e) => updateSectionProp('subtitle', e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-lg p-3 text-sm text-white font-sans outline-none resize-none h-28 transition-colors"
                                />
                            </div>
                        )}

                        {/* Brand Name Customize (Navbar) */}
                        {activeSection.brandName !== undefined && (
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400 uppercase">Brand Name</label>
                                <input 
                                    type="text"
                                    value={activeSection.brandName}
                                    onChange={(e) => updateSectionProp('brandName', e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-lg p-2.5 text-sm text-white outline-none font-sans"
                                />
                            </div>
                        )}

                        {/* Action buttons Text */}
                        {activeSection.buttonText !== undefined && (
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400 uppercase">Button Text</label>
                                <input 
                                    type="text"
                                    value={activeSection.buttonText}
                                    onChange={(e) => updateSectionProp('buttonText', e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-lg p-2.5 text-sm text-white outline-none font-sans"
                                />
                            </div>
                        )}

                        {/* Primary Button (Hero) */}
                        {activeSection.primaryBtn !== undefined && (
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400 uppercase">Primary Button</label>
                                <input 
                                    type="text"
                                    value={activeSection.primaryBtn}
                                    onChange={(e) => updateSectionProp('primaryBtn', e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-lg p-2.5 text-sm text-white outline-none font-sans"
                                />
                            </div>
                        )}

                        {/* Secondary Button (Hero) */}
                        {activeSection.secondaryBtn !== undefined && (
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400 uppercase">Secondary Button</label>
                                <input 
                                    type="text"
                                    value={activeSection.secondaryBtn}
                                    onChange={(e) => updateSectionProp('secondaryBtn', e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-lg p-2.5 text-sm text-white outline-none font-sans"
                                />
                            </div>
                        )}

                        {/* Image URL Customize (Hero) */}
                        {activeSection.imageUrl !== undefined && (
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400 uppercase">Mockup Image URL</label>
                                <input 
                                    type="text"
                                    value={activeSection.imageUrl}
                                    onChange={(e) => updateSectionProp('imageUrl', e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-lg p-2.5 text-sm text-white outline-none font-mono text-xs"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    // Global Theme Customize Controls
                    <div className="space-y-6">
                        {/* Global Theme Typography */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Type className="h-4 w-4 text-blue-400" />
                                <label className="text-xs font-bold font-sans uppercase">Typography Font</label>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {["Outfit", "Inter", "Playfair", "Space Grotesk"].map(font => (
                                    <button 
                                        key={font}
                                        onClick={() => updateThemeProp('fontFamily', font)}
                                        className={`p-2 bg-gray-950 border text-xs font-medium rounded-lg hover:border-gray-600 transition-all ${
                                            (project?.theme?.fontFamily || "Outfit") === font 
                                                ? 'border-blue-500 text-blue-400 shadow-sm' 
                                                : 'border-gray-800 text-gray-400'
                                        }`}
                                    >
                                        {font}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theme Primary Palette */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Palette className="h-4 w-4 text-emerald-400" />
                                <label className="text-xs font-bold font-sans uppercase">Accent Color</label>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {[
                                    { hex: "#3b82f6", label: "Blue" },
                                    { hex: "#10b981", label: "Emerald" },
                                    { hex: "#ec4899", label: "Pink" },
                                    { hex: "#f59e0b", label: "Amber" },
                                    { hex: "#8b5cf6", label: "Purple" }
                                ].map(color => (
                                    <button 
                                        key={color.hex}
                                        onClick={() => updateThemeProp('primaryColor', color.hex)}
                                        className="h-8 w-full rounded-md border border-gray-800 relative transition-transform hover:scale-110 active:scale-95"
                                        style={{ backgroundColor: color.hex }}
                                        title={color.label}
                                    >
                                        {(project?.theme?.primaryColor || "#3b82f6") === color.hex && (
                                            <div className="absolute inset-0 border-2 border-white rounded-md scale-90" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theme Background Colors */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Layout className="h-4 w-4 text-purple-400" />
                                <label className="text-xs font-bold font-sans uppercase">Background Canvas</label>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { hex: "#0b0f19", name: "Royal Navy" },
                                    { hex: "#070708", name: "Deep Charcoal" },
                                    { hex: "#0e1111", name: "Obsidian" },
                                    { hex: "#022c22", name: "Deep Forest" }
                                ].map(bg => (
                                    <button 
                                        key={bg.hex}
                                        onClick={() => updateThemeProp('backgroundColor', bg.hex)}
                                        className={`p-2 bg-gray-950 border text-xs font-medium rounded-lg text-left hover:border-gray-600 transition-all flex items-center gap-2 ${
                                            (project?.theme?.backgroundColor || "#0b0f19") === bg.hex 
                                                ? 'border-blue-500 text-blue-400' 
                                                : 'border-gray-800 text-gray-400'
                                        }`}
                                    >
                                        <div className="h-3 w-3 rounded-full border border-gray-700 shrink-0" style={{ backgroundColor: bg.hex }} />
                                        <span className="truncate">{bg.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theme Border Radius Slider */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Settings className="h-4 w-4 text-amber-400" />
                                <label className="text-xs font-bold font-sans uppercase">Border Radius</label>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="24" 
                                value={parseInt(project?.theme?.borderRadius || "12")}
                                onChange={(e) => updateThemeProp('borderRadius', `${e.target.value}px`)}
                                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                                <span>Sharp (0px)</span>
                                <span>{(project?.theme?.borderRadius || "12px")}</span>
                                <span>Soft (24px)</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tip Banner Footer */}
            <div className="p-3.5 border-t border-gray-800 bg-[#121212] text-[11px] text-gray-500 text-center font-sans">
                💡 Clicking any section in the live preview opens its customize fields!
            </div>
        </div>
    );
}

export default StyleSidebar;
