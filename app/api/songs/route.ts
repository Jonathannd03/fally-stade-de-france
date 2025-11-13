import { NextResponse } from 'next/server';
import { getAllFallyIpupaSongs } from '@/lib/deezer';

export async function GET() {
  try {
    const songs = await getAllFallyIpupaSongs();

    return NextResponse.json({
      success: true,
      data: songs,
      count: songs.length,
    });
  } catch (error) {
    console.error('Error in /api/songs:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch songs from Deezer',
      },
      { status: 500 }
    );
  }
}
