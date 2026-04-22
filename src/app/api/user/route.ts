import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/user?userId=xxx - Get user data
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    console.log('GET /api/user - userId:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    let user = await User.findOne({ userId });
    
    // Create user if doesn't exist
    if (!user) {
      console.log('User not found for userId:', userId);
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
    
    console.log('User found:', user.userId);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT /api/user - Update user data
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId, ...updateData } = body;
    
    console.log('PUT /api/user - userId:', userId);
    console.log('Update data keys:', Object.keys(updateData));
    console.log('Concept progress keys:', Object.keys(updateData.conceptProgress || {}));
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const user = await User.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    
    console.log('User updated successfully:', user?.userId);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
