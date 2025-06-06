import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ customname: string }> }) {
  const { customname } = await params;
  let payload = null;
  try {
    payload = await req.json();
  } catch {
    // ignore
  }

  console.log('Webhook', customname, payload);

  const flow = await prisma.flow.findFirst({ where: { webhookName: customname } });

  if (!flow) {
    return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
  }

  // Здесь можно добавить логику запуска схемы с использованием flow.nodes и flow.edges

  return NextResponse.json({ ok: true, flowId: flow.id });
}
