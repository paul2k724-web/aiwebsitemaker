import { model } from "@/configs/AiModel";
import Prompt from "@/data/Prompt";
import { getPremiumFallbackTemplate } from "@/lib/fallbackTemplates";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        // Try to parse the stringified message history sent by the frontend
        let contents = [];
        try {
            const lastBracketIdx = prompt.lastIndexOf(']');
            if (lastBracketIdx !== -1) {
                const jsonStr = prompt.slice(0, lastBracketIdx + 1);
                const parsedMessages = JSON.parse(jsonStr);
                
                // Map the array to Gemini SDK role-content schema in alternating order
                parsedMessages.forEach((m, idx) => {
                    let text = m.content || "Generating layout structure...";
                    if (idx === 0) {
                        // Seed system prompt instructions inside the first user message!
                        text = `${Prompt.CODE_GEN_PROMPT}\n\nThis is your system instruction. Conform strictly to this JSON schema for all responses. Now respond to this user prompt: ${text}`;
                    }
                    contents.push({
                        role: m.role === 'user' ? 'user' : 'model',
                        parts: [{ text: text }]
                    });
                });
            }
        } catch (e) {
            contents = [];
        }

        // If parsing fails or is empty, seed with the raw prompt combined with prompt rules
        if (contents.length === 0) {
            contents = [
                {
                    role: 'user',
                    parts: [{ text: `${Prompt.CODE_GEN_PROMPT}\n\nConform strictly to this JSON schema for all responses. Now respond to this user prompt: ${prompt}` }]
                }
            ];
        }

        // Execute stateless generation stream enforcing application/json output
        const result = await model.generateContentStream({
            contents: contents,
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
                responseMimeType: "application/json"
            }
        });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    let fullText = '';
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        fullText += chunkText;
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({chunk: chunkText})}\n\n`));
                    }
                    // Send final complete response parsed as JSON
                    try {
                        const parsedData = JSON.parse(fullText);
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({final: parsedData, done: true})}\n\n`));
                    } catch (e) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({error: 'Invalid JSON response', done: true})}\n\n`));
                    }
                    controller.close();
                } catch (e) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({error: e.message || 'Code generation failed'})}\n\n`));
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch(e) {
        console.warn("Gemini Code API rate limit reached, triggering premium pre-compiled fallbacks:", e.message);
        
        try {
            const fallbackJSON = getPremiumFallbackTemplate(prompt);
            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                start(controller) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({chunk: ""})}\n\n`));
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({final: fallbackJSON, done: true})}\n\n`));
                    controller.close();
                }
            });
            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
        } catch(fallbackErr) {
            return new Response(JSON.stringify({error: e.message || 'Code generation failed'}), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }
}