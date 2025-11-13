import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseServer } from '../../../../lib/supabase-server';
import { sendAdminCreatedEmail } from '../../../../lib/email';

// Secret key to protect this endpoint (set in environment variables)
const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY || 'setup-secret-key-change-me';

// POST - Create a new admin user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, email, full_name, setup_key } = body;

    // Validate setup key to prevent unauthorized access
    if (setup_key !== ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid setup key' },
        { status: 401 }
      );
    }

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const { data: existingUser } = await supabaseServer
      .from('admin_users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert the new admin user
    const { data: newUser, error } = await supabaseServer
      .from('admin_users')
      .insert({
        username,
        password_hash,
        email: email || null,
        full_name: full_name || null,
        is_active: true,
      })
      .select('id, username, email, full_name, is_active, created_at')
      .single();

    if (error) {
      console.error('Error creating admin user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create admin user' },
        { status: 500 }
      );
    }

    // Send email notification (don't wait for it to complete)
    sendAdminCreatedEmail({
      username: newUser.username,
      email: newUser.email,
      full_name: newUser.full_name,
      created_at: newUser.created_at,
    }).catch((err) => console.error('Failed to send email notification:', err));

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Error in admin user creation:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}

// GET - List all admin users (without password hashes)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const setup_key = searchParams.get('setup_key');

    // Validate setup key
    if (setup_key !== ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid setup key' },
        { status: 401 }
      );
    }

    const { data: users, error } = await supabaseServer
      .from('admin_users')
      .select('id, username, email, full_name, is_active, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin users:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch admin users' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error in fetching admin users:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}
