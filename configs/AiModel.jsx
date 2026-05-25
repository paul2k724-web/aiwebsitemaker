import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const CodeGenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

const EnhancePromptConfig = {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1000,
    responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
    generationConfig,
    history: [],
});

export const GenAiCode = model.startChat({
    generationConfig: CodeGenerationConfig,
    history: [
        {
            role: "user",
            parts: [
                {
                    text: "Create a modern landing page for a SaaS fitness platform in JSON format"
                }
            ]
        },
        {
            role: "model",
            parts: [
                {
                    text: JSON.stringify({
                        projectTitle: "React Fitness Builder",
                        theme: {
                            fontFamily: "Outfit",
                            primaryColor: "#3b82f6",
                            backgroundColor: "#0b0f19",
                            accentColor: "#ec4899",
                            borderRadius: "12px"
                        },
                        sections: [
                            {
                                id: "nav-1",
                                type: "navbar",
                                brandName: "FitSphere ⚡",
                                links: ["Home", "Features", "Pricing", "FAQ"],
                                buttonText: "Start Now"
                            },
                            {
                                id: "hero-1",
                                type: "hero",
                                title: "Re-engineer Your Athletic Potential",
                                subtitle: "AI-driven training routines, metrics trackers, and adaptive macros built to elevate your health journey.",
                                primaryBtn: "Get Started Free",
                                secondaryBtn: "Explore Dashboard",
                                bgGradient: "from-blue-600/20 via-purple-600/10 to-transparent",
                                imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"
                            },
                            {
                                id: "features-1",
                                type: "features",
                                title: "Built for Performance",
                                subtitle: "Track, refine, and advance with tools designed for high performance.",
                                items: [
                                    { icon: "Dumbbell", title: "Custom Programs", desc: "Workouts tailored entirely around your body metrics." },
                                    { icon: "TrendingUp", title: "Biometric Sync", desc: "Sync with your wearables to monitor heart rate and recovery." }
                                ]
                            },
                            {
                                id: "pricing-1",
                                type: "pricing",
                                title: "Sleek pricing plans",
                                plans: [
                                    { name: "Pro Plan", price: "$19", features: ["Full custom programs", "Wearable sync"], popular: true }
                                ]
                            },
                            {
                                id: "footer-1",
                                type: "footer",
                                text: "© 2026 FitSphere. Built for results."
                            }
                        ]
                    })
                }
            ]
        }
    ]
});

export const enhancePromptSession = model.startChat({
    generationConfig: EnhancePromptConfig,
    history: [],
});
