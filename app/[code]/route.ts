import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = Promise<{ code: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { code } = await params;

    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Update click count and last clicked time
    await prisma.link.update({
      where: { code },
      data: {
        clicks: { increment: 1 },
        lastClicked: new Date(),
      },
    });

    // Perform 302 redirect
    return NextResponse.redirect(link.targetUrl, { status: 302 });
  } catch (error) {
    console.error('Error redirecting:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
