import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, config = {} } = await req.json();
    const {
      base_url = "http://localhost:11434",
      model_name = "llama2",
      temperature = 0.7,
      format,
      metadata,
      tags,
      stop_tokens,
      system,
      template,
      ...rest
    } = config;

    const options: Record<string, unknown> = {
      temperature,
      format,
      metadata,
      system,
      template,
      ...rest,
    };
    if (tags) options.tags = tags;
    if (stop_tokens) options.stop = stop_tokens;
    for (const key of Object.keys(options)) {
      if (options[key] === undefined || options[key] === null)
        delete options[key];
    }

    const body = {
      model: model_name,
      prompt: typeof prompt === "string" ? prompt : JSON.stringify(prompt),
      stream: false,
      options,
    };

    const apiUrl = `${base_url.replace(/\/$/, "")}/api/generate`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    interface OllamaResponse {
      response?: unknown;
      error?: unknown;
      message?: { content?: unknown };
      [key: string]: unknown;
    }
    let data: OllamaResponse;
    try {
      data = JSON.parse(text.split("\n").filter(Boolean).pop() || text);
    } catch {
      data = { response: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Ollama error", raw_output: data },
        { status: response.status },
      );
    }

    return NextResponse.json({
      response: data.response ?? data.message?.content ?? data,
      raw_output: data,
    });
  } catch (e) {
    console.error("Ollama API error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
