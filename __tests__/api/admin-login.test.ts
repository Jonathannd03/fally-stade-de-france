import { POST } from '@/app/api/admin/login/route';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

// Mock bcryptjs
jest.mock('bcryptjs');

// Mock Supabase
jest.mock('@/lib/supabase-server', () => ({
  supabaseServer: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

describe('Admin Login API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully authenticates valid credentials', async () => {
    const mockAdmin = {
      id: '1',
      username: 'admin',
      password_hash: 'hashedpassword',
      email: 'admin@example.com',
      full_name: 'Admin User',
      is_active: true,
    };

    const { supabaseServer } = require('@/lib/supabase-server');
    supabaseServer.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockAdmin,
        error: null,
      }),
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const request = new NextRequest('http://localhost:3000/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'admin',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user).toEqual({
      id: mockAdmin.id,
      username: mockAdmin.username,
      email: mockAdmin.email,
      full_name: mockAdmin.full_name,
    });
    expect(data.user.password_hash).toBeUndefined();
  });

  it('rejects invalid username', async () => {
    const { supabaseServer } = require('@/lib/supabase-server');
    supabaseServer.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'nonexistent',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid username or password');
  });

  it('rejects invalid password', async () => {
    const mockAdmin = {
      id: '1',
      username: 'admin',
      password_hash: 'hashedpassword',
      is_active: true,
    };

    const { supabaseServer } = require('@/lib/supabase-server');
    supabaseServer.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockAdmin,
        error: null,
      }),
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const request = new NextRequest('http://localhost:3000/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'admin',
        password: 'wrongpassword',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid username or password');
  });

  it('rejects inactive admin user', async () => {
    const mockAdmin = {
      id: '1',
      username: 'admin',
      password_hash: 'hashedpassword',
      is_active: false,
    };

    const { supabaseServer } = require('@/lib/supabase-server');
    supabaseServer.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockAdmin,
        error: null,
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'admin',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('returns 400 when missing credentials', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'admin',
        // missing password
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Username and password are required');
  });
});
