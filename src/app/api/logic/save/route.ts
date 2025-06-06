import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, nodes, edges } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    }

    const webhookNode = Array.isArray(nodes)
      ? nodes.find((n: any) => n.type === 'webhookTriggerNode' && n.data?.customName)
      : undefined;

    const flow = await prisma.flow.create({
      data: {
        name,
        nodes,
        edges,
        webhookName: webhookNode?.data?.customName,
      },
    });

    return NextResponse.json({ id: flow.id });
  } catch (error) {
    console.error('Save flow error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
