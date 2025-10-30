# 🚀 Deploy NVTI Kanda to Render (5 Minutes!)

## Why Render?
- ✅ **Zero code changes needed** - Your app works as-is
- ✅ **Free PostgreSQL database** included
- ✅ **Free SSL certificate** automatic
- ✅ **Auto-deploy from GitHub** on every push
- ✅ **FREE tier** for testing (or $7/month production)

---

## 📋 Prerequisites

1. **GitHub account** (free)
2. **Render account** - Sign up at https://render.com (free)

---

## 🎯 Step-by-Step Deployment

### Step 1: Push Code to GitHub

If not already on GitHub:

```bash
# In Replit Shell or locally
git init
git add .
git commit -m "Initial commit"

# Create new repo on GitHub, then:
git remote add origin https://github.com/yourusername/nvti-kanda.git
git push -u origin main
```

---

### Step 2: Create Render Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign in with GitHub

---

### Step 3: Create PostgreSQL Database

1. Click **"New +"** → **"PostgreSQL"**
2. Settings:
   - **Name:** `nvti-kanda-db`
   - **Database:** `nvti_kanda`
   - **User:** `nvti_admin` (auto-generated)
   - **Region:** Choose closest to your users
   - **Plan:** **Free** (or Starter for production)
3. Click **"Create Database"**
4. **Copy the "Internal Database URL"** (you'll need this)

---

### Step 4: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your **GitHub repository**
3. Settings:
   - **Name:** `nvti-kanda`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** (leave blank)
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run db:push`
   - **Start Command:** `npm start`
   - **Plan:** **Free** (or Starter $7/month)

---

### Step 5: Add Environment Variables

In the **Environment** tab, add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | (Paste Internal Database URL from Step 3) |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | (Generate random string - see below) |

**Generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Step 6: Deploy!

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repo
   - Install dependencies
   - Run database migrations
   - Start your app
3. **Wait 2-3 minutes** for first deploy

---

### Step 7: Access Your Site

Your site will be live at:
```
https://nvti-kanda.onrender.com
```

**Login:**
- URL: `https://nvti-kanda.onrender.com/dashboard/login`
- Username: `admin`
- Password: `admin123`

---

## 🔧 Configuration Files Needed

### 1. Update `package.json`

Make sure you have a `start` script:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "start": "NODE_ENV=production node server/index.ts",
    "db:push": "drizzle-kit push"
  }
}
```

### 2. Create `render.yaml` (Optional - for Infrastructure as Code)

```yaml
services:
  - type: web
    name: nvti-kanda
    runtime: node
    buildCommand: npm install && npm run db:push
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: nvti-kanda-db
          property: connectionString
      - key: SESSION_SECRET
        generateValue: true

databases:
  - name: nvti-kanda-db
    databaseName: nvti_kanda
    plan: free
```

---

## 🔄 Auto-Deploy Updates

**Every time you push to GitHub:**

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render automatically:
1. Detects the push
2. Rebuilds your app
3. Runs migrations
4. Deploys new version
5. Zero downtime!

---

## 💰 Pricing

### Free Tier
- ✅ Web service spins down after 15 min inactivity
- ✅ Database: 90 days, then expires
- ✅ Perfect for testing/demo
- ✅ 750 hours/month

### Starter Tier ($7/month per service)
- ✅ Always running (no spin down)
- ✅ Better performance
- ✅ Custom domains
- ✅ Database: $7/month (1GB storage)

**Total for production:** ~$14/month (web + database)

---

## 🌐 Add Custom Domain

1. Go to your service → **Settings**
2. Click **"Add Custom Domain"**
3. Enter your domain: `nvti-kanda.com`
4. Add DNS records (Render provides them):
   ```
   Type: CNAME
   Name: www
   Value: nvti-kanda.onrender.com
   ```
5. SSL automatically provisioned ✅

---

## 📊 Monitoring

### View Logs
1. Dashboard → Your service
2. Click **"Logs"** tab
3. Real-time logs appear

### Check Health
- Render auto-monitors your app
- Email notifications on failures
- Built-in health checks

---

## 🐛 Troubleshooting

### Build Failed
**Check logs:**
1. Dashboard → Service → Events
2. Look for error messages
3. Common issues:
   - Missing `npm start` script
   - Wrong Node version
   - Database connection error

### App Won't Start
**Check:**
- `DATABASE_URL` is set correctly
- `SESSION_SECRET` is set
- Port is correct (Render uses `PORT` env var automatically)

### Database Connection Error
**Fix:**
- Use **Internal Database URL** (not External)
- Format: `postgresql://user:pass@hostname/database`
- Check database is created and running

---

## ✨ Benefits Over Other Platforms

| Feature | Render | Netlify | Heroku |
|---------|--------|---------|--------|
| **Express Support** | ✅ Native | ❌ Serverless only | ✅ Native |
| **PostgreSQL** | ✅ Built-in | ❌ External only | ✅ Add-on |
| **Free Tier** | ✅ Yes | ✅ Static only | ❌ Removed |
| **Auto Deploy** | ✅ Yes | ✅ Yes | ✅ Yes |
| **SSL** | ✅ Free | ✅ Free | ✅ Free |
| **Code Changes** | ✅ None needed | ❌ Major refactor | ✅ None needed |

---

## 🎯 Quick Comparison

### Render (Recommended ⭐)
```
Difficulty: ⭐ Easy
Time: 5 minutes
Cost: FREE or $14/month
Code changes: ZERO
```

### Netlify
```
Difficulty: ⭐⭐⭐⭐⭐ Very Hard
Time: 10-20 hours
Cost: $25-50/month
Code changes: COMPLETE REWRITE
```

### VPS (DigitalOcean)
```
Difficulty: ⭐⭐⭐ Medium
Time: 1-2 hours
Cost: $6-12/month
Code changes: ZERO
```

---

## 🚀 Summary

1. **Push code to GitHub** (5 min)
2. **Create Render account** (2 min)
3. **Create database** (1 min)
4. **Create web service** (2 min)
5. **Add environment variables** (2 min)
6. **Deploy!** (automatic)

**Total time:** ~12 minutes

Your NVTI Kanda site is now live with:
- ✅ Production database
- ✅ Auto-scaling
- ✅ Free SSL
- ✅ Auto-deployments
- ✅ Professional hosting

**Live at:** `https://nvti-kanda.onrender.com`

🎉 **Done!**
