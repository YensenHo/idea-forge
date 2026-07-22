import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hotScore } from '@/lib/ranking';
import { analyzeIdea } from '@/lib/ai';

export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'hot';
  const tag = searchParams.get('tag') || '';
  const search = searchParams.get('search') || '';

  let query = `
    SELECT p.*,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
    FROM posts p WHERE 1=1
  `;
  const params: unknown[] = [];

  if (tag) {
    query += ` AND p.tags LIKE ?`;
    params.push(`%"${tag}"%`);
  }
  if (search) {
    query += ` AND (p.title LIKE ? OR p.description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY p.created_at DESC`;

  const posts = await db.all(query, ...params) as any[];
  if (sort === 'hot') posts.sort((a, b) => hotScore(b) - hotScore(a));
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = await request.json();
  const { content, bounty } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const raw = content.trim();
  const ai = await analyzeIdea(raw);

  let title: string;
  let description: string;
  let target_user = '';
  let pain_points = '';
  let tags = '[]';

  if (ai) {
    title = ai.title;
    description = ai.description;
    target_user = ai.target_user;
    pain_points = ai.pain_points;
    tags = JSON.stringify(ai.tags);
  } else {
    const firstLine = raw.split('\n')[0].slice(0, 120);
    title = firstLine.length < raw.length ? firstLine : raw.slice(0, 80);
    description = raw;
  }

  const bountyAmount = Math.max(0, Number(bounty) || 0);

  const result = await db.run(
    'INSERT INTO posts (title, description, target_user, pain_points, tags, bounty) VALUES (?, ?, ?, ?, ?, ?)',
    title, description, target_user, pain_points, tags, bountyAmount
  );

  return NextResponse.json({
    id: result.lastInsertRowid,
    analyzed: !!ai,
  }, { status: 201 });
}
