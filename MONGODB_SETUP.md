# MongoDB Setup Instructions

## Quick Setup (5 minutes)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (Free tier is sufficient)

### 2. Create a Cluster
1. Click "Build a Database"
2. Choose "M0" (Free tier) - 512MB storage
3. Select your region (choose closest to you)
4. Click "Create"
5. Wait for cluster to be created (2-3 minutes)

### 3. Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Username: `simmaster` (or your choice)
4. Password: Generate a strong password (save this!)
5. Click "Create"

### 4. Whitelist IP Address
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 5. Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

### 6. Add to .env.local
Create a file named `.env.local` in your project root with:

```
MONGODB_URI=mongodb+srv://simmaster:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/simmaster?retryWrites=true&w=majority
```

Replace:
- `YOUR_PASSWORD` with the password you created in step 3
- `cluster0.xxxxx` with your actual cluster name from step 5

### 7. Restart Development Server
```bash
npm run dev
```

## Troubleshooting

### Connection Timeout
- Check your IP is whitelisted (step 4)
- Verify the password is correct
- Ensure cluster status is "Available"

### Authentication Failed
- Double-check username and password in .env.local
- Make sure you created a database user (step 3)

### Data Not Saving
- Check browser console for errors
- Verify MongoDB cluster is running
- Check Network tab for API call failures

## Data Stored in MongoDB

The following user data is stored in MongoDB:
- Bookmarks (concepts, PYQs, formulas)
- Mistakes (incorrect answers)
- Exam state (questions, answers, timing)
- Practice progress (correct/total counts)
- Concept progress (learned, practiced, photos, video watched)
- UI preferences (dark mode, search query)

## Switching Back to localStorage

If you want to switch back to localStorage (no MongoDB required):
1. Remove `MongoSyncProvider` from `src/app/layout.tsx`
2. Re-enable `persist` middleware in `src/store/useStore.ts`
3. Delete MongoDB-related files
