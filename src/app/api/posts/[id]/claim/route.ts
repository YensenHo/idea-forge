import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const { builder_name, app_url } = await request.json();
  const post = await db.get('SELECT * FROM posts WHERE id = ?', id) as any;
  if (!post) return NextResponse.json({ error: '帖子不存在' }, { status: 404 });
  if (post.claimed_by) return NextResponse.json({ error: '该需求已被认领' }, { status: 409 });
  await db.run(
    "UPDATE posts SET claimed_by = ?, app_url = ?, claim_created_at = datetime('now') WHERE id = ?",
    builder_name?.trim() || '匿名开发者', app_url?.trim() || '', id
  );
  return NextResponse.json({ success: true });
}
