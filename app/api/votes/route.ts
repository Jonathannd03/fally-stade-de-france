import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all votes with counts grouped by song
export async function GET() {
  try {
    const { data: votes, error } = await supabase
      .from('votes')
      .select('song_id');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch votes' },
        { status: 500 }
      );
    }

    // Count votes per song
    const voteCounts: Record<string, number> = {};

    votes?.forEach((vote) => {
      voteCounts[vote.song_id] = (voteCounts[vote.song_id] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      data: voteCounts,
    });
  } catch (error) {
    console.error('Error in GET /api/votes:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST a new vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { songId, userId } = body;

    if (!songId || !userId) {
      return NextResponse.json(
        { success: false, error: 'songId and userId are required' },
        { status: 400 }
      );
    }

    // Insert vote (will fail if user already voted for this song due to UNIQUE constraint)
    const { data, error } = await supabase
      .from('votes')
      .insert([{ song_id: songId, user_id: userId }])
      .select();

    if (error) {
      // Check if it's a duplicate vote error
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'You have already voted for this song' },
          { status: 409 }
        );
      }

      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to cast vote' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.error('Error in POST /api/votes:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a vote
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get('songId');
    const userId = searchParams.get('userId');

    if (!songId || !userId) {
      return NextResponse.json(
        { success: false, error: 'songId and userId are required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('song_id', songId)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to remove vote' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Vote removed successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/votes:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
