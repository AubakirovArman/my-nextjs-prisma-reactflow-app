import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Node {
  id: string;
  type: string;
  data?: Record<string, unknown>;
}

interface Edge {
  source: string;
  target: string;
}

async function executeFlow(nodes: Node[], edges: Edge[], payload: unknown) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const getOutgoers = (nodeId: string) =>
    edges
      .filter((e) => e.source === nodeId)
      .map((e) => nodeMap.get(e.target))
      .filter(Boolean) as Node[];

  const getInDegree = (nodeId: string) =>
    edges.filter((e) => e.target === nodeId).length;

  async function processNode(node: Node, data: unknown): Promise<void> {
    let output = data;
    switch (node.type) {
      case 'startNode':
        output = { message: 'Flow started' };
        break;
      case 'webhookTriggerNode':
        output = payload;
        break;
      case 'inputTextNode':
        output = {
          incomingData: data,
          inputValue: (node.data?.value as string | undefined) || '',
          combined: `${data ? (typeof data === 'object' ? JSON.stringify(data) : data) + ' + ' : ''}${(node.data?.value as string | undefined) || ''}`,
        };
        break;
      case 'alertNode':
        console.log('AlertNode:', data);
        return;
      case 'displayNode':
        console.log('DisplayNode:', data);
        break;
      case 'jsonProcessorNode':
        try {
          const path = (node.data?.dataPath as string | undefined) || (node.data?.path as string | undefined) || '';
          const parts = path
            .split(/[.\[\]]/)
            .filter((p: string) => p);
          let result: unknown = data;
          for (const part of parts) {
            if (result == null) break;
            const idx = Number(part);
            if (!Number.isNaN(idx)) {
              result = Array.isArray(result) ? result[idx] : undefined;
            } else if (typeof result === 'object') {
              result = (result as Record<string, unknown>)[part];
            } else {
              result = undefined;
            }
          }
          output = result;
        } catch (err) {
          console.error('JsonProcessorNode error:', err);
        }
        break;
      case 'telegramNode':
        try {
          const text = typeof data === 'string' ? data : JSON.stringify(data);
          const url =
            'https://api.telegram.org/bot1434601883:AAFDS330oYhld1GttIMLh49gBDnetCezU2A/sendMessage?chat_id=854186602&text=' +
            encodeURIComponent(text);
          await fetch(url, { method: 'POST' });
        } catch (err) {
          console.error('TelegramNode error:', err);
        }
        break;
      default:
        console.warn('Unknown node type:', node.type);
        break;
    }

    const nextNodes = getOutgoers(node.id);
    if (nextNodes.length > 0) {
      // Берем только первый выход для простоты
      await processNode(nextNodes[0], output);
    }
  }

  let startNodes = nodes.filter((n) => n.type === 'webhookTriggerNode');
  if (startNodes.length === 0) {
    startNodes = nodes.filter((n) => getInDegree(n.id) === 0);
  }
  for (const n of startNodes) {
    await processNode(n, payload);
  }
}

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

  await executeFlow(flow.nodes as Node[], flow.edges as Edge[], payload);

  return NextResponse.json({ ok: true, flowId: flow.id });
}
