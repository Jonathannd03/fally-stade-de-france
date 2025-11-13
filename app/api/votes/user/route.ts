import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET votes for a specific user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const { data: votes, error } = await supabase
      .from('votes')
      .select('song_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user votes' },
        { status: 500 }
      );
    }

    // Return array of song IDs the user has voted for
    const votedSongIds = votes?.map((vote) => vote.song_id) || [];

    return NextResponse.json({
      success: true,
      data: votedSongIds,
    });
  } catch (error) {
    console.error('Error in GET /api/votes/user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
