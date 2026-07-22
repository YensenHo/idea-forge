import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const { app_url } = await request.json();
  const post = await db.get('SELECT * FROM posts WHERE id = ?', id) as any;
  if (!post) return NextResponse.json({ error: '帖子不存在' }, { status: 404 });
  if (!post.claimed_by) return NextResponse.json({ error: '该需求还未被认领' }, { status: 400 });
  if (post.delivered_at) return NextResponse.json({ error: '已交付' }, { status: 409 });
  await db.run(
    "UPDATE posts SET app_url = ?, delivered_at = datetime('now') WHERE id = ?",
    app_url?.trim() || post.app_url || '', id
  );
  return NextResponse.json({ success: true });
}
