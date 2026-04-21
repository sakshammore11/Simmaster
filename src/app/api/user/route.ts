import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/user?userId=xxx - Get user data
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    
    let user = await User.findOne({ userId });
    
    // Create user if doesn't exist
    if (!user) {
      user = await User.create({
        userId,
        bookmarks: [],
        mistakes: [],
        examState: {
          isActive: false,
          questions: [],
          currentQuestion: 0,
          answers: {},
          startTime: 0,
          timeLimit: 60,
        },
        practiceProgress: {},
        conceptProgress: {},
        darkMode: false,
        searchQuery: '',
      });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}

// PUT /api/user - Update user data
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId, ...updateData } = body;
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    
    const user = await User.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 });
  }
}
