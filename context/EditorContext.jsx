"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { compileProject } from '@/lib/templateCompiler';
import Lookup from '@/data/Lookup';

const EditorContext = createContext(null);

export function EditorProvider({ children }) {
    const [project, setProject] = useState(() => {
        // Fallback default structure
        return {
            projectTitle: "My Landing Page",
            theme: {
                fontFamily: "Outfit",
                primaryColor: "#3b82f6",
                backgroundColor: "#0b0f19",
                accentColor: "#ec4899",
                borderRadius: "12px"
            },
            sections: Lookup.DEFAULT_SECTIONS || []
        };
    });

    const [files, setFiles] = useState({});
    const [activeSectionId, setActiveSectionId] = useState(null);
    const [deviceMode, setDeviceMode] = useState("desktop");
    const [zoom, setZoom] = useState(100);
    const [savedProjects, setSavedProjects] = useState([]);

    // Compile active JSON tree into Sandpack files
    const triggerCompile = useCallback((proj) => {
        try {
            const compiled = compileProject(proj);
            // Merge with standard Sandpack configuration files (index.html, tailwind, etc)
            const fullFilesSet = {
                ...Lookup.DEFAULT_FILE,
                ...compiled
            };
            setFiles(fullFilesSet);
        } catch (e) {
            console.error("Compilation error in EditorProvider:", e);
        }
    }, []);

    // Load initial project compiled files on mount
    useEffect(() => {
        triggerCompile(project);
    }, [project, triggerCompile]);

    // Load local saved projects on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("ai_builder_projects");
            if (stored) {
                try {
                    setSavedProjects(JSON.parse(stored));
                } catch (e) {
                    console.error("Error reading saved projects:", e);
                }
            }
        }
    }, []);

    // Core updater: updates active JSON layout structure and re-compiles React code in memory
    const updateProjectJSON = useCallback((updatedProject) => {
        setProject(prev => {
            const next = typeof updatedProject === 'function' ? updatedProject(prev) : updatedProject;
            // Compile immediately to ensure UI parity
            triggerCompile(next);
            return next;
        });
    }, [triggerCompile]);

    // Save project locally
    const saveProjectLocal = useCallback((title = null) => {
        if (typeof window === "undefined") return;
        const currentTitle = title || project.projectTitle || "Untitled Website";
        
        setProject(prev => {
            const next = { ...prev, projectTitle: currentTitle };
            const stored = localStorage.getItem("ai_builder_projects");
            let list = [];
            if (stored) {
                try { list = JSON.parse(stored); } catch (e) {}
            }
            
            // Upsert based on title or ID
            const existingIdx = list.findIndex(p => p.projectTitle === currentTitle);
            const entry = {
                projectTitle: currentTitle,
                theme: next.theme,
                sections: next.sections,
                updatedAt: new Date().toISOString()
            };
            
            if (existingIdx >= 0) {
                list[existingIdx] = entry;
            } else {
                list.push(entry);
            }
            
            localStorage.setItem("ai_builder_projects", JSON.stringify(list));
            setSavedProjects(list);
            return next;
        });
    }, [project]);

    // Load project locally
    const loadProjectLocal = useCallback((proj) => {
        setProject(proj);
        setActiveSectionId(null);
    }, []);

    // Delete project locally
    const deleteProjectLocal = useCallback((title) => {
        if (typeof window === "undefined") return;
        const stored = localStorage.getItem("ai_builder_projects");
        if (stored) {
            try {
                let list = JSON.parse(stored);
                list = list.filter(p => p.projectTitle !== title);
                localStorage.setItem("ai_builder_projects", JSON.stringify(list));
                setSavedProjects(list);
            } catch (e) {}
        }
    }, []);

    return (
        <EditorContext.Provider value={{
            project,
            files,
            activeSectionId,
            deviceMode,
            zoom,
            savedProjects,
            setProject: updateProjectJSON,
            setActiveSectionId,
            setDeviceMode,
            setZoom,
            saveProjectLocal,
            loadProjectLocal,
            deleteProjectLocal
        }}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditor must be used within an EditorProvider");
    }
    return context;
}
