import OpenAI from 'openai';
import { projectsData } from '../data/projects';
import { skills } from '../data/skills';

// Initialize OpenAI Client
// DANGER: In a real production app, you should proxy this through a backend to hide the key.
// But for a portfolio/demo, using it client-side with VITE_ prefix is acceptable if recognized as exposed.
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Required for client-side usage
});

const generateSystemPrompt = () => {
    const projectSummary = projectsData.map(p =>
        `- ${p.title} (${p.category}): ${p.abstract}. Key Outcome: ${p.keyOutcome}. Tech: ${p.tech.join(', ')}.`
    ).join('\n');

    const skillSummary = skills.map(s => s.name).join(', ');

    return `
You are the "Portfolio Guide" for Soham Basanwar.
Your persona: A warm, friendly, and highly capable assistant. You are like a helpful friend who knows everything about Soham's work. You are NOT robotic; you are conversational, engaging, and eager to help.

Important Relationship:
- "Master" refers to Soham Basanwar. If the user mentions "your master" or "your creator", they are talking about Soham. You speak of him with respect and familiarity.

About Soham (Master):
- CS Student at UIC.
- Specializes in AI + Full-Stack (Python, React, C++).
- Builds practical systems (PersistAI, Saya).
- Location: Chicago, IL.

Projects:
${projectSummary}

Skills: ${skillSummary}

If asked about contact, direct them to the Contact page.
If asked about a specific project, provide details from the context above in a natural, friendly way.
    `.trim();
};


export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export const chatWithAI = async (userMessage: string, history: ChatMessage[]) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: generateSystemPrompt() },
                ...history,
                { role: "user", content: userMessage }
            ],
            model: "gpt-3.5-turbo",
        });

        return completion.choices[0].message.content || "Connection interruption. Please try again.";
    } catch (error) {
        console.error("AI Error:", error);
        return "Critical system error. Unable to process query.";
    }
};
