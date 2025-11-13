import { GET, POST, DELETE } from '@/app/api/votes/route';
import { NextRequest } from 'next/server';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('Votes API', () => {
  describe('GET /api/votes', () => {
    it('returns aggregated vote counts', async () => {
      const mockVotes = [
        { song_id: 'song1' },
        { song_id: 'song1' },
        { song_id: 'song2' },
      ];

      const { supabase } = require('@/lib/supabase');
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: mockVotes,
          error: null,
        }),
      });

      const response = await GET();
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data).toEqual({
        song1: 2,
        song2: 1,
      });
    });

    it('handles database errors gracefully', async () => {
      const { supabase } = require('@/lib/supabase');
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });

  describe('POST /api/votes', () => {
    it('successfully creates a new vote', async () => {
      const { supabase } = require('@/lib/supabase');
      const mockInsert = jest.fn().mockResolvedValue({
        data: { id: '1', song_id: 'song1', user_id: 'user1' },
        error: null,
      });

      supabase.from.mockReturnValue({
        insert: mockInsert,
      });

      const request = new NextRequest('http://localhost:3000/api/votes', {
        method: 'POST',
        body: JSON.stringify({
          songId: 'song1',
          userId: 'user1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(mockInsert).toHaveBeenCalledWith({
        song_id: 'song1',
        user_id: 'user1',
      });
    });

    it('returns 400 when missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/votes', {
        method: 'POST',
        body: JSON.stringify({
          songId: 'song1',
          // missing userId
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('DELETE /api/votes', () => {
    it('successfully deletes a vote', async () => {
      const { supabase } = require('@/lib/supabase');
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      supabase.from.mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      const request = new NextRequest(
        'http://localhost:3000/api/votes?songId=song1&userId=user1',
        {
          method: 'DELETE',
        }
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(data.success).toBe(true);
    });

    it('returns 400 when missing query parameters', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/votes?songId=song1',
        // missing userId
        {
          method: 'DELETE',
        }
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });
});
