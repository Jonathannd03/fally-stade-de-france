import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Fetch all votes with timestamps
    const { data: allVotes, error: votesError } = await supabase
      .from('votes')
      .select('*')
      .order('created_at', { ascending: false });

    if (votesError) throw votesError;

    // Calculate analytics
    const totalVotes = allVotes?.length || 0;

    // Unique voters
    const uniqueVoters = new Set(allVotes?.map((v) => v.user_id) || []).size;

    // Vote counts per song
    const voteCounts: Record<string, number> = {};
    const songVoteDetails: Record<string, any[]> = {};

    allVotes?.forEach((vote) => {
      voteCounts[vote.song_id] = (voteCounts[vote.song_id] || 0) + 1;
      if (!songVoteDetails[vote.song_id]) {
        songVoteDetails[vote.song_id] = [];
      }
      songVoteDetails[vote.song_id].push({
        userId: vote.user_id,
        timestamp: vote.created_at,
      });
    });

    // Votes per user
    const votesPerUser: Record<string, number> = {};
    allVotes?.forEach((vote) => {
      votesPerUser[vote.user_id] = (votesPerUser[vote.user_id] || 0) + 1;
    });

    // Calculate user vote distribution
    const voteDistribution = Object.values(votesPerUser).reduce((acc, count) => {
      acc[count] = (acc[count] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Get votes per day for the last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const votesPerDay: Record<string, number> = {};
    allVotes?.forEach((vote) => {
      const voteDate = new Date(vote.created_at);
      if (voteDate >= thirtyDaysAgo) {
        const dateKey = voteDate.toISOString().split('T')[0];
        votesPerDay[dateKey] = (votesPerDay[dateKey] || 0) + 1;
      }
    });

    // Sort songs by votes
    const topSongs = Object.entries(voteCounts)
      .map(([songId, votes]) => ({
        songId,
        votes,
        voteDetails: songVoteDetails[songId],
      }))
      .sort((a, b) => b.votes - a.votes);

    // Recent activity (last 50 votes)
    const recentActivity = allVotes?.slice(0, 50).map((vote) => ({
      songId: vote.song_id,
      userId: vote.user_id,
      timestamp: vote.created_at,
    })) || [];

    // Calculate average votes per song
    const totalSongsWithVotes = Object.keys(voteCounts).length;
    const avgVotesPerSong = totalSongsWithVotes > 0 ? totalVotes / totalSongsWithVotes : 0;

    // Find most active voters
    const topVoters = Object.entries(votesPerUser)
      .map(([userId, votes]) => ({ userId, votes }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 10);

    // Calculate votes in last 24 hours
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const votesLast24h = allVotes?.filter((vote) =>
      new Date(vote.created_at) >= twentyFourHoursAgo
    ).length || 0;

    // Calculate votes in last 7 days
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const votesLast7Days = allVotes?.filter((vote) =>
      new Date(vote.created_at) >= sevenDaysAgo
    ).length || 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalVotes,
          uniqueVoters,
          totalSongsWithVotes,
          avgVotesPerSong,
          votesLast24h,
          votesLast7Days,
        },
        topSongs,
        voteCounts,
        votesPerDay,
        voteDistribution,
        topVoters,
        recentActivity,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
