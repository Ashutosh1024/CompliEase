import { getDb } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';

const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

const SYSTEM_PROMPT = `You are CompliEase AI — an expert AI assistant specializing in Indian business compliance, taxation, government schemes, and regulatory requirements.

You help Indian small business owners (MSMEs) with:
- GST registration, filing, and rates (GSTR-1, GSTR-3B, GSTR-9)
- Udyam/MSME registration and benefits
- Income Tax (ITR filing, TDS, advance tax)
- Shop & Establishment Act, Trade License, FSSAI
- Government schemes: PMEGP, Mudra Loan, CGTMSE, PLI, Stand-Up India
- Compliance deadlines and penalties
- PAN, TAN, Import Export Code (IEC)
- ESI, PF, Professional Tax

Rules:
- Always give accurate, specific answers for India
- Mention actual penalty amounts and deadlines when relevant
- Suggest next steps the user can take
- Keep responses clear and structured
- If the user's business context is provided, tailor your answer to their specific situation
- Use ₹ for rupees, proper Indian date formats

Respond in a friendly, professional tone. Use markdown for structured answers.`;

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { message, history = [], businessContext } = body;

    if (!message?.trim())
      return Response.json({ error: 'message is required' }, { status: 400 });

    // Build context message if profile exists
    let contextNote = '';
    if (businessContext) {
      contextNote = `\n\n[User's business context: Business: "${businessContext.businessName}", Industry: ${businessContext.industryCategory}, State: ${businessContext.state}, Structure: ${businessContext.businessStructure}, Turnover: ${businessContext.annualTurnover || 'not specified'}, GST: ${businessContext.gstNumber ? 'Registered' : 'Not registered'}, Udyam: ${businessContext.udyamNumber ? 'Registered' : 'Not registered'}]`;
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT + contextNote },
      // Include recent chat history (last 6 messages for context)
      ...history.slice(-6).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[chat Groq error]', err);
      return Response.json({ error: 'AI service temporarily unavailable' }, { status: 502 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply)
      return Response.json({ error: 'No response from AI' }, { status: 502 });

    // Save to chat history in MongoDB
    const db = await getDb();
    await db.collection('chats').insertOne({
      userId: user.userId,
      userMessage: message,
      aiResponse: reply,
      createdAt: new Date(),
    });

    return Response.json({ reply });

  } catch (err) {
    console.error('[chat]', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
