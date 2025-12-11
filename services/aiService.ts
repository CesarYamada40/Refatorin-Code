
import { GoogleGenAI, Type } from '@google/genai';
import { Language, Action, CodeAnalysisResult, RefactorSuggestion, AiSettings } from '../types';

// Schemas for Gemini API
const standardResponseSchema = {
    type: Type.OBJECT,
    properties: {
        code: {
            type: Type.STRING,
            description: 'The processed, corrected, or refactored code. It should be returned as a single string, including all necessary formatting like newlines and indentation.'
        },
        explanation: {
            type: Type.STRING,
            description: 'A detailed explanation of the changes made, the analysis performed, or the documentation added. This should be in clear, human-readable text.'
        },
        detectedLanguage: {
            type: Type.STRING,
            description: 'The primary programming language(s) detected in the code, e.g., "JavaScript", "Python, HTML". This field is especially important in auto-detect mode.'
        },
    },
    required: ['code', 'explanation'],
};

const refactorSuggestionSchema = {
  type: Type.OBJECT,
  properties: {
    description: { type: Type.STRING },
    reasoning: { type: Type.STRING },
    originalCode: { type: Type.STRING },
    refactoredCode: { type: Type.STRING },
  },
  required: ['description', 'reasoning', 'originalCode', 'refactoredCode'],
};

const refactorResponseSchema = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      items: refactorSuggestionSchema,
      description: "An array of refactoring suggestions."
    },
  },
  required: ['suggestions'],
};


const processWithGemini = async (code: string, language: Language, action: Action, apiKey: string): Promise<CodeAnalysisResult | RefactorSuggestion[]> => {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-pro-preview';
    const isRefactor = action.id === 'auto_refactor';
    const isAutoDetect = language.id === 'auto';

    const config = {
        responseMimeType: "application/json",
        responseSchema: isRefactor ? refactorResponseSchema : standardResponseSchema,
        temperature: 0.3,
    };
    
    const languageInstruction = isAutoDetect
      ? "Auto-Detect (The code may contain one or more languages. Identify the language(s) before proceeding)."
      : language.name;

    const fullPrompt = `
You are an expert programmer and code analyst. Your task is to process the following code snippet.

**Language:** ${languageInstruction}
**Action to Perform:** ${action.name}
**Instructions:** ${action.prompt.replace('{language}', language.name)}

**Code to Process:**
\`\`\`
${code}
\`\`\`

Provide your response strictly in the required JSON format. If the language is set to auto-detect, you must populate the 'detectedLanguage' field in your response.
`;

    const response = await ai.models.generateContent({
        model: model,
        contents: fullPrompt,
        config: config,
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the AI.");
    }

    const parsedResponse = JSON.parse(jsonText);

    if (isRefactor) {
        if (!parsedResponse.suggestions || !Array.isArray(parsedResponse.suggestions)) {
            throw new Error("AI response did not contain a 'suggestions' array.");
        }
        // Note: The refactor response does not currently include detectedLanguage.
        // The explanation for each suggestion should ideally mention context if needed.
        return parsedResponse.suggestions as RefactorSuggestion[];
    } else {
        if (typeof parsedResponse.code !== 'string' || typeof parsedResponse.explanation !== 'string') {
            throw new Error("AI response did not match the required format for a standard action.");
        }
        return parsedResponse as CodeAnalysisResult;
    }
}

// Main service function that acts as a router
export const processCode = async (code: string, language: Language, action: Action, settings: AiSettings): Promise<CodeAnalysisResult | RefactorSuggestion[]> => {
    try {
        switch (settings.provider) {
            case 'gemini':
                return await processWithGemini(code, language, action, settings.apiKey);
            case 'openai':
                // Placeholder for OpenAI integration
                throw new Error("OpenAI (ChatGPT) integration is not yet implemented.");
            default:
                throw new Error(`Unsupported AI provider: ${settings.provider}`);
        }
    } catch (error) {
        console.error(`Error processing code with ${settings.provider}:`, error);

        if (error instanceof SyntaxError) {
            return Promise.reject(new Error("Failed to parse the AI's response. The response was not valid JSON."));
        }
        if (error instanceof Error && error.message.includes('429')) {
            return Promise.reject(new Error("API rate limit exceeded. Please wait a moment and try again."));
        }
        // Re-throw other errors to be caught by the UI
        throw error;
    }
};
