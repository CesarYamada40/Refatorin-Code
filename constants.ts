
import { Language, Action } from './types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { id: 'auto', name: 'Auto-Detect' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'csharp', name: 'C#' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'sql', name: 'SQL' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
];

export const ACTIONS: Action[] = [
  {
    id: 'fix',
    name: 'Fix Code',
    description: 'Find and fix bugs, errors, and syntax issues.',
    prompt: 'Analyze the following {language} code for errors, bugs, and anti-patterns. Provide a corrected version of the code. In your explanation, detail the specific changes you made and why they were necessary.',
    processingText: 'Fixing your code...'
  },
  {
    id: 'improve',
    name: 'Improve Code',
    description: 'Refactor for readability, performance, and best practices.',
    prompt: 'Refactor the following {language} code to improve readability, performance, and maintainability. Apply modern best practices and add comments where necessary to clarify complex logic. Explain the key improvements you made.',
    processingText: 'Improving your code...'
  },
    {
    id: 'economical',
    name: 'Economical Optimization',
    description: 'Find critical improvements with a focus on minimal token usage.',
    prompt: `Analyze the following {language} code with a primary goal of being economical and efficient. Identify only the most critical, high-impact improvements. Your response must be as concise as possible to minimize token usage. In your explanation, be brief and to the point.`,
    processingText: 'Economically optimizing...'
  },
  {
    id: 'analyze',
    name: 'Analyze Quality',
    description: 'Get a detailed report on code quality and potential issues.',
    prompt: `Analyze the following {language} code and provide a detailed code quality report. Do not provide the code back. Your analysis should cover:
1.  **Bugs & Potential Errors**: Identify any logical errors or potential runtime issues.
2.  **Performance**: Point out any performance bottlenecks or inefficient code.
3.  **Readability & Style**: Comment on code style, naming conventions, and overall readability.
4.  **Security**: Highlight any potential security vulnerabilities.
5.  **Suggestions**: Provide a summary of actionable suggestions for improvement.
Format the explanation as a clear, structured report. For the code block, simply return the original code provided.`,
    processingText: 'Analyzing code quality...'
  },
  {
    id: 'add_docs',
    name: 'Add Documentation',
    description: 'Generate comments and documentation for the code.',
    prompt: 'Generate comprehensive documentation for the following {language} code. Add inline comments for complex parts and a detailed docblock/header comment for the overall functionality, parameters, and return values. Explain the documentation style you used.',
    processingText: 'Generating documentation...'
  },
  {
    id: 'auto_refactor',
    name: 'Auto-Refactor',
    description: 'Automatically identify and suggest specific, line-by-line refactoring improvements.',
    prompt: `Analyze the following {language} code to identify specific, atomic refactoring opportunities such as extracting methods, renaming variables for clarity, simplifying loops or conditionals, and removing redundant code.
For each opportunity, provide a JSON object with the following keys:
- "description": A brief, one-sentence summary of the refactoring (e.g., "Extract logic into a new function 'calculatePrice'").
- "reasoning": A short explanation of why this refactoring improves the code (e.g., "Improves readability and reusability").
- "originalCode": The exact, complete block of code that should be replaced. This must be a contiguous block from the source.
- "refactoredCode": The new code that will replace the original block.`,
    processingText: 'Finding refactoring opportunities...'
  }
];
