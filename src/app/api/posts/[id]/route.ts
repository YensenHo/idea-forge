import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const post = await db.get(`
    SELECT p.*,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
    FROM posts p WHERE p.id = ?
  `, id) as any;
  if (!post) return NextResponse.json({ error: '帖子不存在' }, { status: 404 });
  const comments = await db.all(
    'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC',
    id
  );
  return NextResponse.json({ ...post, comments });
}
