import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { customname: string } }) {
  let payload = null;
  try {
    payload = await req.json();
  } catch {
    // ignore
  }

  console.log('Webhook', params.customname, payload);

  // Здесь можно добавить логику запуска схемы

  return NextResponse.json({ ok: true });
}
