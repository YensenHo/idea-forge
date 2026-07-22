import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const { content, author_name } = await request.json();
  if (!content?.trim()) return NextResponse.json({ error: '评论不能为空' }, { status: 400 });
  await db.run(
    'INSERT INTO comments (post_id, content, author_name) VALUES (?, ?, ?)',
    id, content.trim(), author_name?.trim() || '匿名用户'
  );
  return NextResponse.json({ success: true }, { status: 201 });
}
