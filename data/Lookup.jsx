export default {
    SUGGSTIONS: ['Create Todo App', 'Create a Budget Track App', 'Create a Login and Signup page',
    "Develop a Task Management App",
    "Create a Fully Responsive Blog Platform",
    "Design a Minimalistic Note-Taking App",
    "Develop a Customizable Landing Page",
    "Develop a Recipe Sharing Platform",
    "Create a Fitness Tracking App",
    "Develop a Personal Finance Management Tool",
    "Create a Language Learning App",
    "Build a Virtual Event Platform",
    "Create a Music Streaming Service"
  ],

    DEFAULT_FILE: {
        '/public/index.html':
        {
            code: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
              <div id="root"></div>
            </body>
            </html>`
        },
        '/App.css': {
            code: `@tailwind base;
            @tailwind components;
            @tailwind utilities;`
        },
        '/tailwind.config.js': {
            code: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
        },
        '/postcss.config.js': {
            code: `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;`
        },
        '/index.js': {
            code: `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`
        },
        '/App.js': {
            code: `import React from 'react';

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-sans p-6 text-center">
      <div className="space-y-4 max-w-md">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <h1 className="text-2xl font-bold">Assembling Project Files...</h1>
        <p className="text-gray-400 text-sm">AI is writing and compiling the codebase tree. Your preview will update automatically once complete.</p>
      </div>
    </div>
  );
}

export default App;`
        }
    },

    DEPENDANCY: {
            "@google/generative-ai": "^0.21.0",
            "@heroicons/react": "^1.0.6",
    "@headlessui/react": "^1.7.17",
    "autoprefixer": "^10.0.0",
    "firebase": "^11.1.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "latest",
    "postcss": "^8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^5.0.0",
    "react-router-dom": "latest",
    "react-toastify": "^10.0.0",
    "tailwind-merge": "^2.4.0",
    "tailwindcss": "^3.4.1",
    "tailwindcss-animate": "^1.0.7",
    "uuid4": "^2.0.3",
    "uuidv4": "^6.2.13",
    "uuid": "^11.1.0",
    "@mui/material": "^6.4.6"
        },
    DEFAULT_SECTIONS: [
        {
            id: "nav-1",
            type: "navbar",
            brandName: "ApexSaaS ⚡",
            links: ["Home", "Features", "Pricing", "FAQ"],
            buttonText: "Start Building"
        },
        {
            id: "hero-1",
            type: "hero",
            title: "Build the Future of No-Code Websites",
            subtitle: "The ultimate AI-driven builder to design, customize, and compile gorgeous responsive React websites in seconds.",
            primaryBtn: "Claim Free Trial",
            secondaryBtn: "Read Guide",
            bgGradient: "from-blue-600/20 via-purple-600/10 to-transparent",
            imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80"
        },
        {
            id: "features-1",
            type: "features",
            title: "Designed to Accelerate Output",
            subtitle: "Everything you need to launch a beautiful online destination in minutes.",
            items: [
                { icon: "Zap", title: "Lightning Generations", desc: "Instantly create structured layout schemas from prompts." },
                { icon: "Layers", title: "Visual Editing Sidebars", desc: "Adjust paddings, border radius, fonts, and copywriting in real-time." },
                { icon: "Code", title: "Developer Exports", desc: "View the synchronized hot-reloaded React code and export the project as a ZIP." }
            ]
        },
        {
            id: "pricing-1",
            type: "pricing",
            title: "Simple, Honest Pricing",
            plans: [
                { name: "Creator Plan", price: "$0", features: ["1 Active project", "Visual canvas editor", "Vite React exports"], popular: false },
                { name: "Elite Pro", price: "$19", features: ["Everything in Creator", "Infinite projects", "One-click ZIP downloads", "Priority Support"], popular: true },
                { name: "Enterprise Premium", price: "$49", features: ["Everything in Pro", "Custom domain linking", "Team shared dashboard"], popular: false }
            ]
        },
        {
            id: "footer-1",
            type: "footer",
            text: "© 2026 ApexSaaS Inc. Empowering developers worldwide."
        }
    ]
}