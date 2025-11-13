import { searchArtist, getArtistAlbums, getAlbumTracks, DeezerTrack } from '@/lib/deezer';

// Mock fetch globally
global.fetch = jest.fn();

describe('Deezer API Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchArtist', () => {
    it('returns artist data when artist is found', async () => {
      const mockArtistData = {
        data: [
          {
            id: 245438,
            name: 'Fally Ipupa',
            picture: 'https://example.com/fally.jpg',
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockArtistData,
      });

      const result = await searchArtist('Fally Ipupa');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.deezer.com/search/artist')
      );
      expect(result).toEqual(mockArtistData.data[0]);
      expect(result.name).toBe('Fally Ipupa');
    });

    it('throws error when artist is not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await expect(searchArtist('NonexistentArtist')).rejects.toThrow(
        'Artist "NonexistentArtist" not found on Deezer'
      );
    });

    it('throws error when API request fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(searchArtist('Fally Ipupa')).rejects.toThrow('Deezer API error: 500');
    });
  });

  describe('getArtistAlbums', () => {
    it('returns artist albums', async () => {
      const mockAlbumsData = {
        data: [
          { id: 1, title: 'Album 1' },
          { id: 2, title: 'Album 2' },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlbumsData,
      });

      const result = await getArtistAlbums(245438);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.deezer.com/artist/245438/albums'
      );
      expect(result).toEqual(mockAlbumsData.data);
      expect(result).toHaveLength(2);
    });

    it('returns empty array when API fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getArtistAlbums(999999)).rejects.toThrow('Deezer API error: 404');
    });
  });

  describe('getAlbumTracks', () => {
    it('returns album tracks with count', async () => {
      const mockAlbumData = {
        tracks: {
          data: [
            { id: 1, title: 'Track 1', duration: 180 },
            { id: 2, title: 'Track 2', duration: 200 },
          ],
        },
        nb_tracks: 2,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlbumData,
      });

      const result = await getAlbumTracks(123);

      expect(result.tracks).toHaveLength(2);
      expect(result.trackCount).toBe(2);
    });

    it('returns empty array when no tracks found', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tracks: {}, nb_tracks: 0 }),
      });

      const result = await getAlbumTracks(123);

      expect(result.tracks).toEqual([]);
      expect(result.trackCount).toBe(0);
    });
  });
});
