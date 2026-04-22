// Helper functions for API calls to MongoDB

const API_BASE = '/api/user';
const LOCAL_STORAGE_KEY = 'simmaster-data-backup';

// Get or generate user ID
export function getUserId(): string {
  if (typeof window === 'undefined') return 'default';
  
  let userId = localStorage.getItem('simmaster-user-id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('simmaster-user-id', userId);
  }
  return userId;
}

// Save data to localStorage as backup
export function saveToLocalStorage(data: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Load data from localStorage backup
export function loadFromLocalStorage(): any {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

// Fetch user data from MongoDB
export async function fetchUserData(userId: string) {
  try {
    const response = await fetch(`${API_BASE}?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// Update user data in MongoDB
export async function updateUserData(userId: string, data: any) {
  try {
    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...data }),
    });
    if (!response.ok) {
      throw new Error('Failed to update user data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
}
