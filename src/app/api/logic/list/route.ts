import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const flows = await prisma.flow.findMany({
    select: { id: true, name: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(flows);
}
