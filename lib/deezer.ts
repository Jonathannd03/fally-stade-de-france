const DEEZER_API_BASE = 'https://api.deezer.com';

export type DeezerTrack = {
  id: string;
  name: string;
  albumName: string;
  albumImage: string;
  previewUrl: string;
  deezerUrl: string;
  duration: number;
};

// In-memory cache
let cachedSongs: DeezerTrack[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function searchArtist(artistName: string) {
  const response = await fetch(
    `${DEEZER_API_BASE}/search/artist?q=${encodeURIComponent(artistName)}`
  );

  if (!response.ok) {
    throw new Error(`Deezer API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.data || data.data.length === 0) {
    throw new Error(`Artist "${artistName}" not found on Deezer`);
  }

  return data.data[0];
}

export async function getArtistAlbums(artistId: number) {
  const response = await fetch(`${DEEZER_API_BASE}/artist/${artistId}/albums`);

  if (!response.ok) {
    throw new Error(`Deezer API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data || [];
}

export async function getAlbumTracks(albumId: number) {
  const response = await fetch(`${DEEZER_API_BASE}/album/${albumId}`);

  if (!response.ok) {
    throw new Error(`Deezer API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    tracks: data.tracks?.data || [],
    trackCount: data.nb_tracks || 0,
  };
}

export async function searchFeaturingTracks(artistName: string) {
  try {
    // Search for tracks featuring the artist
    const response = await fetch(
      `${DEEZER_API_BASE}/search/track?q=${encodeURIComponent(artistName)}&limit=500`
    );

    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching for featuring tracks:', error);
    return [];
  }
}

export async function getAllFallyIpupaSongs(): Promise<DeezerTrack[]> {
  // Check cache first
  if (cachedSongs && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_TTL) {
    console.log(`Returning ${cachedSongs.length} songs from cache`);
    return cachedSongs;
  }

  try {
    const startTime = Date.now();

    // Search for Fally Ipupa
    const artist = await searchArtist('Fally Ipupa');

    // Get all albums
    const albums = await getArtistAlbums(artist.id);

    // Fetch all album tracks in parallel for better performance
    // Filter to only include albums with more than 10 tracks (excludes singles, EPs, etc.)
    const albumPromises = albums.map(async (album: any) => {
      try {
        const albumDetails = await getAlbumTracks(album.id);

        // Only process albums with more than 10 tracks
        if (albumDetails.trackCount <= 10) {
          return [];
        }

        return albumDetails.tracks.map((track: any) => ({
          id: String(track.id),
          name: track.title,
          albumName: album.title,
          albumImage: album.cover_xl || album.cover_big || album.cover_medium || album.cover,
          previewUrl: track.preview,
          deezerUrl: track.link,
          duration: track.duration * 1000,
        }));
      } catch (error) {
        console.error(`Error fetching tracks for album ${album.title}:`, error);
        return [];
      }
    });

    const allSongsArrays = await Promise.all(albumPromises);
    const allSongs = allSongsArrays.flat();

    // Get featuring tracks
    const featuringTracks = await searchFeaturingTracks('Fally Ipupa');

    // Create a Set of track IDs from Fally's own albums to avoid duplicates
    const fallyTrackIds = new Set(allSongs.map(song => song.id));

    // Filter featuring tracks to only include those where Fally is NOT the main artist
    const featuringSongs = featuringTracks
      .filter((track: any) => {
        // Exclude if this track is already in Fally's albums
        if (fallyTrackIds.has(String(track.id))) {
          return false;
        }

        // Exclude if Fally Ipupa is the main artist
        if (track.artist && track.artist.name && track.artist.name.toLowerCase().includes('fally ipupa')) {
          return false;
        }

        // Only include if "feat" or "featuring" is in the title (indicating a collaboration)
        const title = track.title.toLowerCase();
        return title.includes('feat') || title.includes('featuring') || title.includes('ft.');
      })
      .map((track: any) => ({
        id: String(track.id),
        name: track.title,
        albumName: 'Featurings', // Special album name for all featurings
        albumImage: track.album?.cover_xl || track.album?.cover_big || track.album?.cover_medium || track.album?.cover || '/images/fally-ipupa.png',
        previewUrl: track.preview,
        deezerUrl: track.link,
        duration: track.duration * 1000,
      }));

    // Combine all songs (Fally's albums + Featurings)
    const combinedSongs = [...allSongs, ...featuringSongs];

    const elapsed = Date.now() - startTime;
    console.log(`Total songs found: ${combinedSongs.length} (${allSongs.length} from albums + ${featuringSongs.length} featurings) (fetched in ${elapsed}ms)`);

    // Update cache
    cachedSongs = combinedSongs;
    cacheTimestamp = Date.now();

    return combinedSongs;
  } catch (error) {
    console.error('Error fetching Fally Ipupa songs from Deezer:', error);
    throw error;
  }
}
