import dedent from 'dedent';

export default {
    CHAT_PROMPT: dedent`
    You are an Elite AI Website Designer and UI/UX expert.
    The user is visual building a website with you.
    GUIDELINES:
    - Explain what adjustments you are making in a few warm, concise sentences.
    - NEVER write raw code blocks or long HTML commentaries. Focus entirely on the aesthetic changes.
    `,

    CODE_GEN_PROMPT: dedent`
    Generate a complete website structure represented strictly as a JSON object matching the schema below. 
    You must write rich copywriting, include professional layout structures, and select high-end harmonized HSL/HEX color schemes.

    DO NOT write raw HTML, CSS, or JS code strings. Return only the JSON object.

    ### JSON Schema to generate:
    {
      "projectTitle": "Modern Fitness SaaS",
      "theme": {
        "fontFamily": "Outfit",
        "primaryColor": "#3b82f6",
        "backgroundColor": "#0b0f19",
        "accentColor": "#ec4899",
        "borderRadius": "12px"
      },
      "sections": [
        {
          "id": "nav-1",
          "type": "navbar",
          "brandName": "BrandName ⚡",
          "links": ["Home", "Features", "Pricing", "FAQ"],
          "buttonText": "Get Started"
        },
        {
          "id": "hero-1",
          "type": "hero",
          "title": "Enter a High-converting Catchy Headline",
          "subtitle": "Provide a descriptive sub-headline describing the core benefit of the platform.",
          "primaryBtn": "Get Started Free",
          "secondaryBtn": "Watch Demo",
          "bgGradient": "from-blue-600/20 via-purple-600/10 to-transparent",
          "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"
        },
        {
          "id": "features-1",
          "type": "features",
          "title": "Core Platform Capabilities",
          "subtitle": "Discover the engineered systems that unlock success.",
          "items": [
            { "icon": "Dumbbell", "title": "Feature 1 Title", "desc": "Feature 1 detail description." },
            { "icon": "TrendingUp", "title": "Feature 2 Title", "desc": "Feature 2 detail description." },
            { "icon": "Sparkles", "title": "Feature 3 Title", "desc": "Feature 3 detail description." }
          ]
        },
        {
          "id": "pricing-1",
          "type": "pricing",
          "title": "Flexible Plans for Every Stage",
          "plans": [
            { "name": "Basic", "price": "$9", "features": ["Feature A", "Feature B", "Basic analytics"], "popular": false },
            { "name": "Premium Pro", "price": "$29", "features": ["Everything in Basic", "Advanced features", "API Access"], "popular": true },
            { "name": "Enterprise", "price": "$99", "features": ["Everything in Pro", "Custom SLAs", "Dedicated manager"], "popular": false }
          ]
        },
        {
          "id": "testimonials-1",
          "type": "testimonials",
          "title": "Loved by Builders Worldwide",
          "items": [
            { "name": "Sarah Connor", "role": "CEO, Cyberdyne", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", "content": "This platform completely optimized our daily operations. Incredibly fast." },
            { "name": "Alex Mercer", "role": "Lead Architect", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", "content": "The visual editor paired with clean React code exports is exactly what our team was looking for." }
          ]
        },
        {
          "id": "faq-1",
          "type": "faq",
          "title": "Frequently Asked Questions",
          "items": [
            { "question": "How long does setup take?", "answer": "Initialization takes less than five minutes." },
            { "question": "Can I cancel my subscription?", "answer": "Yes, you can cancel at any time directly in your account portal." }
          ]
        },
        {
          "id": "cta-1",
          "type": "cta",
          "title": "Ready to Transform Your Workflow?",
          "subtitle": "Join thousands of developers and teams building the future of the web.",
          "buttonText": "Start Generating Free"
        },
        {
          "id": "footer-1",
          "type": "footer",
          "text": "© 2026 AI Website Builder Inc. All rights reserved."
        },
        {
          "id": "todo-app-1",
          "type": "custom",
          "code": "import React, { useState } from 'react';\nimport { Trash, Plus, Check } from 'lucide-react';\n\nexport default function TodoApp1() {\n  const [tasks, setTasks] = useState([]);\n  // Stateful React logic...\n}"
        }
      ]
    }
  ]
}

### Important Guidelines:
1. Ensure the type matches exactly one of: "navbar", "hero", "features", "pricing", "testimonials", "faq", "cta", "footer", "custom".
2. Pick beautiful, relevant icons from Lucide: "Dumbbell", "TrendingUp", "Sparkles", "Code", "Zap", "Layers", "Cpu", "Globe", "Shield", "LineChart", "Trash", "Plus", "Check", "Edit", "Search".
3. Write high-end copy specific to the user's prompt (e.g. if fitness startup, use fitness copy; if finance, use banking/investing copy).
4. CRITICAL: If the user asks for a dynamic interactive application (like a Todo app, Notes app, Budget tracker, Calculator, etc.), you MUST generate a section of type "custom". Inside the "code" field, write the complete, beautiful, stateful, and interactive React code using React hooks (useState), Tailwind CSS styling, and Lucide icon imports, exporting it as default matching the capitalized PascalCase section ID.
5. Do not include markdown code block syntax (like \`\`\`json) in the response. Return raw JSON string only.
`,

    ENHANCE_PROMPT_RULES: dedent`
    You are a prompt enhancement expert and SaaS designer. Enhance the user prompt to make it specific, describing key UI features, pricing structures, bento grid layout grids, and premium micro-interactions.
    Keep the length under 200 words. Return only the enhanced prompt text.
    `
}
