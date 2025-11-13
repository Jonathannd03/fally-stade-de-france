import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Log a page view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pagePath, visitorId, sessionId } = body;

    if (!pagePath || !visitorId) {
      return NextResponse.json(
        { success: false, error: 'pagePath and visitorId are required' },
        { status: 400 }
      );
    }

    // Get user agent and referrer from headers
    const userAgent = request.headers.get('user-agent') || null;
    const referrer = request.headers.get('referer') || null;

    // Insert page view
    const { error } = await supabase
      .from('page_views')
      .insert([{
        page_path: pagePath,
        visitor_id: visitorId,
        session_id: sessionId || null,
        user_agent: userAgent,
        referrer: referrer,
      }]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to log page view' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Page view logged successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/page-views:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
