import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const stats = db.getStats();
  const users = db.getAllUsers();
  const pages = db.getAllPages();

  return NextResponse.json({
    stats,
    users,
    pages,
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const body = await req.json();
  const { action, pageId, wishId, status } = body;

  if (action === 'toggle_page_status' && pageId) {
    const page = db.getPageById(pageId);
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    const newStatus = status || (page.status === 'published' ? 'draft' : 'published');
    const updated = db.updatePage(pageId, { status: newStatus });
    return NextResponse.json({ page: updated });
  }

  if (action === 'delete_page' && pageId) {
    const success = db.deletePage(pageId);
    return NextResponse.json({ success });
  }

  if (action === 'delete_wish' && pageId && wishId) {
    const success = db.deleteWish(pageId, wishId);
    return NextResponse.json({ success });
  }

  return NextResponse.json({ error: 'Unknown admin action' }, { status: 400 });
}
