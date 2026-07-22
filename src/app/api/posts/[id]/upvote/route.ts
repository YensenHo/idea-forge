import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  await db.run('UPDATE posts SET upvotes = upvotes + 1 WHERE id = ?', id);
  const post = await db.get('SELECT upvotes FROM posts WHERE id = ?', id) as any;
  return NextResponse.json({ upvotes: post?.upvotes || 0 });
}
