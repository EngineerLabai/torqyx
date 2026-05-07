# Database Configuration Guide

## Current Status
✅ Migration file created and ready at: `prisma/migrations/add_ai_explain_feedback/migration.sql`
✅ Environment configuration (partial completion)

## Step 1: Choose & Configure Your Database

### Option A: Supabase (☆ Recommended - Easiest)
```bash
# 1. Visit https://supabase.com → Sign up (free tier available)
# 2. Create new PostgreSQL project
# 3. Copy Connection String from Project Settings > Database
# 4. Replace DATABASE_URL in .env.local with your Supabase URL
# 5. Run migration (see Step 2)
```

### Option B: Railway.app (Easy)
```bash
# 1. Visit https://railway.app → Sign up (free tier)
# 2. New Project → PostgreSQL
# 3. Copy POSTGRESQLConnection URL from variables
# 4. Update DATABASE_URL in .env.local
# 5. Run migration (see Step 2)
```

### Option C: Local PostgreSQL (Windows)
```bash
# 1. Download from: https://www.postgresql.org/download/windows/
# 2. Install and remember your password
# 3. Open pgAdmin or command prompt
# 4. Create database: createdb aiengineerslab
# 5. Build connection string: postgresql://postgres:YOUR_PASSWORD@localhost:5432/aiengineerslab
# 6. Update DATABASE_URL in .env.local
# 7. Run migration (see Step 2)
```

### Option D: Docker PostgreSQL
```bash
# Requires Docker Desktop installed
docker run --name ailab-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=aiengineerslab \
  -p 5432:5432 \
  -d postgres

# Then DATABASE_URL in .env.local:
# postgresql://postgres:password@localhost:5432/aiengineerslab
```

## Step 2: Update .env.local

After choosing your database, update the DATABASE_URL:

```env
DATABASE_URL="your-database-url-here"
OPENAI_API_KEY="sk-your-api-key-here"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Step 3: Apply the Migration

```bash
# Test database connection
npx prisma db validate

# Apply migration to create AiExplainFeedback table
npx prisma migrate deploy

# (Optional) View database in UI
npx prisma studio
```

## Step 4: Verify Setup

```bash
# Check that migration was applied
npx prisma db execute --stdin < prisma/migrations/add_ai_explain_feedback/migration.sql

# Or verify with Prisma Studio
npx prisma studio  # Open at http://localhost:5555
```

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correct
- Verify database server is running
- Test connection: `psql "your-connection-string"`

### "Migration already applied"
- This is normal if running multiple times
- Prisma tracks applied migrations automatically

### "Permission denied"
- Check database user has proper permissions
- For Supabase/Railway: ensure connection string is correct

## Next Steps After Migration

1. Get OpenAI API key: https://platform.openai.com/api/keys
2. Update `OPENAI_API_KEY` in .env.local
3. Run development server: `npm run dev`
4. Test the "Explain Result" feature on any calculation tool

## Files Modified
- `.env.local` - Environment variables configured
- `prisma/schema.prisma` - AiExplainFeedback model added
- `prisma/migrations/add_ai_explain_feedback/migration.sql` - Ready to apply
