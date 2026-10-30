import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shared server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const isGeminiConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY');

let ai: GoogleGenAI | null = null;
if (isGeminiConfigured) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '100kb' }));

  // System status endpoint
  app.get('/api/status', (_req: Request, res: Response) => {
    const currentKey = process.env.GEMINI_API_KEY;
    const isConfigured = Boolean(currentKey && currentKey.trim() !== '' && currentKey !== 'MY_GEMINI_API_KEY');
    res.json({
      status: 'operational',
      hasGeminiApiKey: isConfigured,
      timestamp: new Date().toISOString(),
    });
  });

  // AI Tutor endpoint for socratic hints and explanations
  app.post('/api/tutor/hint', async (req: Request, res: Response): Promise<void> => {
    // 1. Sanitize & validate request parameters
    const topicRaw = typeof req.body?.topic === 'string' ? req.body.topic.trim().slice(0, 60) : 'General DSA';
    const problemTitleRaw = typeof req.body?.problemTitle === 'string' ? req.body.problemTitle.trim().slice(0, 120) : 'Challenge';
    const questionTextRaw = typeof req.body?.questionText === 'string' ? req.body.questionText.trim().slice(0, 1000) : '';
    const userCodeOrAnswerRaw = typeof req.body?.userCodeOrAnswer === 'string' ? req.body.userCodeOrAnswer.trim().slice(0, 2000) : '';
    
    // Clamp hint level to integer between 1 and 3
    const parsedLevel = parseInt(String(req.body?.currentHintLevel), 10);
    const hintLevel = !isNaN(parsedLevel) && parsedLevel >= 1 && parsedLevel <= 3 ? parsedLevel : 1;

    // 2. High-quality curated Socratic hint fallback
    const fallbackHints: Record<string, string[]> = {
      'arrays': [
        'Hint 1: Think about the 0-indexed nature of contiguous memory blocks and how pointers can avoid extra passes.',
        'Hint 2: Can you use a two-pointer approach (start and end) or track maximum seen so far in a single pass?',
        'Hint 3: Consider the time-space tradeoff: could a hash map or in-place swap reduce O(N^2) to O(N)?'
      ],
      'searching': [
        'Hint 1: Is the input sorted? If sorted, Binary Search divides your search space in half at each step (O(log N)).',
        'Hint 2: Pay close attention to integer overflow: use `mid = low + Math.floor((high - low) / 2)`.',
        'Hint 3: Double check your loop condition: `low <= high` ensures the final single element is tested.'
      ],
      'sorting': [
        'Hint 1: In Bubble Sort, the heaviest unsorted element bubbles to its final position after every outer pass.',
        'Hint 2: In Selection Sort, we search for the absolute minimum element in the remaining unsorted subarray and swap once per pass.',
        'Hint 3: In Insertion Sort, each element is placed into its proper sorted position among previously scanned elements, making it adaptive for nearly-sorted data.'
      ],
      'stacks': [
        'Hint 1: Stacks follow LIFO (Last-In, First-Out). Elements are both inserted and removed exclusively from the Top.',
        'Hint 2: Before calling `pop()` or `peek()`, always verify `!isEmpty()` to prevent stack underflow errors.',
        'Hint 3: Notice how matching parenthesis or undo operations naturally map to pushing opens and popping matching closes.'
      ],
      'queues': [
        'Hint 1: Queues follow FIFO (First-In, First-Out). Elements enter at the Rear (enqueue) and exit from the Front (dequeue).',
        'Hint 2: In circular array implementations, increment indices using modulo: `next = (index + 1) % capacity`.',
        'Hint 3: Think of queue applications: BFS graph traversal, printer queues, and CPU task scheduling.'
      ],
      'linked-lists': [
        'Hint 1: Unlike arrays, Linked List nodes are scattered in memory and linked via `next` pointers. Accessing index k takes O(k).',
        'Hint 2: Always save `temp = current.next` before overwriting pointers to avoid disconnecting the rest of the list.',
        'Hint 3: Creating a dummy head node (`dummy.next = head`) greatly simplifies edge cases when inserting or deleting the head.'
      ],
      'linked lists': [
        'Hint 1: Unlike arrays, Linked List nodes are scattered in memory and linked via `next` pointers. Accessing index k takes O(k).',
        'Hint 2: Always save `temp = current.next` before overwriting pointers to avoid disconnecting the rest of the list.',
        'Hint 3: Creating a dummy head node (`dummy.next = head`) greatly simplifies edge cases when inserting or deleting the head.'
      ]
    };

    const key = topicRaw.toLowerCase();
    const hintsList = fallbackHints[key] || fallbackHints[key.replace(/[-_]/g, ' ')] || [
      'Hint 1: Examine the problem constraints, input sizes, and whether intermediate states can be cached.',
      'Hint 2: Try stepping through a small concrete 3-element example on paper.',
      'Hint 3: Identify invariant conditions that must hold true after each loop iteration.'
    ];
    const curatedHint = hintsList[hintLevel - 1] || hintsList[0];

    // 3. Resolve API key dynamically
    const currentApiKey = process.env.GEMINI_API_KEY;
    const hasValidKey = Boolean(currentApiKey && currentApiKey.trim() !== '' && currentApiKey !== 'MY_GEMINI_API_KEY');

    if (!hasValidKey) {
      res.json({
        hint: curatedHint,
        source: 'curated-tutor',
        note: 'AI Tutor is operating in offline curated mode. To activate dynamic Gemini responses, configure a GEMINI_API_KEY in Secrets.'
      });
      return;
    }

    try {
      const activeAi = new GoogleGenAI({
        apiKey: currentApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `You are Code League's friendly, pedagogical DSA Tutor for college engineering students.
The student is working on the following problem:
Topic: ${topicRaw}
Problem: ${problemTitleRaw}
Question: ${questionTextRaw || 'Not specified'}
Student's current input/thought: ${userCodeOrAnswerRaw || 'No answer submitted yet'}
Hint Level requested: ${hintLevel} (1 = subtle guidance, 2 = conceptual push, 3 = algorithmic step).

Rules:
1. Provide a concise Socratic hint (max 3-4 sentences).
2. DO NOT reveal the direct final answer or full code. Guide them to discover the logic themselves.
3. Be encouraging, clear, and focus on the intuition (invariants, time complexity, pointer logic).`;

      const apiPromise = activeAi.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an encouraging, expert Computer Science Professor teaching Data Structures and Algorithms to undergraduates.',
          temperature: 0.7,
        },
      });

      // 6-second timeout race to prevent stalled client requests in restricted environments
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call timed out')), 6000)
      );

      const response = await Promise.race([apiPromise, timeoutPromise]);

      res.json({
        hint: response.text || curatedHint,
        source: 'gemini-3.8-flash',
      });
    } catch (error: any) {
      console.warn('Gemini API call failed or timed out, falling back to curated hint:', error?.message || error);
      res.json({
        hint: curatedHint,
        source: 'fallback',
        note: 'AI Tutor is operating in curated fallback mode.',
      });
    }
  });

  // Serve static files in production or delegate to Vite in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Code League] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Code League] Fatal server startup error:', err);
  process.exit(1);
});
