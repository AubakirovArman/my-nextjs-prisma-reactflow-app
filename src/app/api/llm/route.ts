import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, memory, config = {} } = await req.json();
    const {
      model = 'gpt-3.5-turbo',
      apiKey = process.env.OPENAI_API_KEY,
      temperature = 0.7,
      mode = 'chat',
      output_format = 'text',
      ...rest
    } = config;

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 400 });
    }

    let body: Record<string, unknown>;

    if (mode === 'chat') {
      const messages: Array<{ role: string; content: string }> = [];
      if (Array.isArray(memory)) {
        for (const m of memory) {
          if (m && typeof m === 'object' && 'role' in m && 'content' in m) {
            messages.push({ role: m.role, content: m.content });
          }
        }
      }
      if (prompt && typeof prompt === 'object' && Array.isArray(prompt.messages)) {
        messages.push(...prompt.messages);
      } else if (typeof prompt === 'string') {
        messages.push({ role: 'user', content: prompt });
      }
      body = { model, messages, temperature, ...rest };
    } else {
      const p = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);
      body = { model, prompt: p, temperature, ...rest };
    }

    const apiUrl = `https://api.openai.com/v1/${mode === 'chat' ? 'chat/completions' : 'completions'}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: json.error?.message || 'LLM error', raw_output: json }, { status: response.status });
    }

    const text = mode === 'chat' ? json.choices?.[0]?.message?.content : json.choices?.[0]?.text;

    if (output_format === 'json') {
      try {
        return NextResponse.json({ response: JSON.parse(text), raw_output: json });
      } catch {
        return NextResponse.json({ response: text, raw_output: json });
      }
    }

    return NextResponse.json({ response: text, raw_output: json });
  } catch (e) {
    console.error('LLM API error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
