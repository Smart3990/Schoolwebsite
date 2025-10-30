# 🚀 Deploy NVTI Kanda to External Server

This guide explains how to deploy your NVTI Kanda website to **any external server** without Replit dependencies.

---

## 📋 Prerequisites

Your external server needs:
- **Node.js 18+** (or 20+)
- **PostgreSQL 14+** database
- **Ubuntu/Debian Linux** (or similar)
- **2GB RAM minimum** (4GB recommended)
- **Root or sudo access**

---

## 📥 Step 1: Export Your Code from Replit

### Option A: Download as ZIP
1. In Replit, click the **three dots menu** (⋮) in the file tree
2. Select **"Download as ZIP"**
3. Extract on your local machine

### Option B: Use Git (Recommended)
```bash
# On Replit, initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub/GitLab
git remote add origin https://github.com/yourusername/nvti-kanda.git
git push -u origin main

# Then clone on your server
git clone https://github.com/yourusername/nvti-kanda.git
cd nvti-kanda
```

---

## 🖥️ Step 2: Set Up Your Server

### 2.1 Install Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### 2.2 Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2.3 Create Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE nvti_kanda;
CREATE USER nvti_admin WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE nvti_kanda TO nvti_admin;
\q
```

---

## 🔧 Step 3: Configure the Application

### 3.1 Navigate to Project Directory

```bash
cd /var/www/nvti-kanda  # or wherever you placed it
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Create Environment File

Create a `.env` file in the project root:

```bash
nano .env
```

Add these environment variables:

```env
# Database Configuration
DATABASE_URL=postgresql://nvti_admin:your_secure_password_here@localhost:5432/nvti_kanda
PGHOST=localhost
PGPORT=5432
PGUSER=nvti_admin
PGPASSWORD=your_secure_password_here
PGDATABASE=nvti_kanda

# Node Environment
NODE_ENV=production

# Session Secret (generate a random string)
SESSION_SECRET=your_random_session_secret_here_make_it_long_and_random

# Server Port
PORT=5000
```

**Generate a secure session secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.4 Initialize Database Schema

```bash
npm run db:push
```

This creates all necessary tables (users, posts, settings, media).

---

## 🏗️ Step 4: Build for Production

```bash
# Build the frontend
npm run build

# This creates optimized production files
```

---

## ▶️ Step 5: Run the Application

### Option A: Direct Run (Testing)

```bash
NODE_ENV=production node server/index.ts
```

Visit: `http://your-server-ip:5000`

### Option B: PM2 (Recommended for Production)

PM2 keeps your app running, restarts on crashes, and starts on server boot.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
pm2 start server/index.ts --name nvti-kanda --interpreter tsx

# Configure to start on boot
pm2 startup
pm2 save

# View logs
pm2 logs nvti-kanda

# Other useful commands
pm2 status              # Check status
pm2 restart nvti-kanda  # Restart app
pm2 stop nvti-kanda     # Stop app
```

---

## 🌐 Step 6: Set Up Nginx (Reverse Proxy)

This allows you to use port 80/443 and add SSL.

### 6.1 Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 6.2 Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/nvti-kanda
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Increase body size for image uploads
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6.3 Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/nvti-kanda /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

---

## 🔒 Step 7: Add SSL (HTTPS)

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts, it will automatically configure nginx
```

**Your site is now available at:** `https://your-domain.com`

---

## 🔐 Step 8: Set Up Admin Account

### Option 1: Use Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql -d nvti_kanda

# Create admin user (password is hashed version of 'admin123')
INSERT INTO users (username, password) 
VALUES ('admin', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890');

\q
```

### Option 2: Use Application API

After the app is running, you can register via the login page or create directly in the database.

---

## 📁 File Structure on Server

```
/var/www/nvti-kanda/
├── server/              # Backend code
├── client/              # Frontend source
├── dist/                # Built frontend (after npm run build)
├── shared/              # Shared types/schemas
├── node_modules/        # Dependencies
├── .env                 # Environment variables
├── package.json
└── drizzle.config.ts
```

---

## 🔄 Updating Your Application

When you make changes:

```bash
# Pull latest code
cd /var/www/nvti-kanda
git pull origin main

# Install any new dependencies
npm install

# Update database schema if needed
npm run db:push

# Rebuild frontend
npm run build

# Restart application
pm2 restart nvti-kanda
```

---

## 🛡️ Security Checklist

✅ **Database:**
- [ ] Use strong database password
- [ ] Don't expose PostgreSQL port (5432) to internet
- [ ] Regular backups

✅ **Application:**
- [ ] Set strong SESSION_SECRET in .env
- [ ] Use NODE_ENV=production
- [ ] Change default admin password
- [ ] Keep dependencies updated: `npm audit`

✅ **Server:**
- [ ] Enable firewall (UFW)
- [ ] Use SSH keys, disable password login
- [ ] Keep Ubuntu/packages updated
- [ ] Use SSL/HTTPS

✅ **Nginx:**
- [ ] Rate limiting for login endpoints
- [ ] Hide nginx version
- [ ] Security headers

---

## 🐳 Optional: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "server/index.ts"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://nvti_admin:password@db:5432/nvti_kanda
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=nvti_kanda
      - POSTGRES_USER=nvti_admin
      - POSTGRES_PASSWORD=your_password_here
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose up -d
```

---

## 🔧 Troubleshooting

### App Won't Start
```bash
# Check logs
pm2 logs nvti-kanda

# Check if port 5000 is in use
sudo lsof -i :5000

# Verify database connection
psql -U nvti_admin -d nvti_kanda -h localhost
```

### Database Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U nvti_admin -d nvti_kanda -h localhost -W
```

### Nginx Issues
```bash
# Check nginx status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t
```

### Images Not Uploading
- Check `client_max_body_size` in nginx config
- Verify disk space: `df -h`
- Check application logs

---

## 📊 Monitoring

```bash
# View PM2 dashboard
pm2 monit

# View application logs
pm2 logs nvti-kanda --lines 100

# Server resources
htop

# Database connections
sudo -u postgres psql -d nvti_kanda -c "SELECT * FROM pg_stat_activity;"
```

---

## 🎯 Production Checklist

Before going live:

- [ ] Database backed up
- [ ] SSL certificate installed
- [ ] Admin password changed from default
- [ ] All environment variables set correctly
- [ ] PM2 configured to start on boot
- [ ] Nginx configured with proper domain
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] Application running without errors
- [ ] Test all features (login, post creation, image upload)

---

## 🌍 Domain Configuration

Point your domain to your server:

1. **In your domain registrar (Namecheap, GoDaddy, etc.):**
   - Create an **A Record** pointing to your server IP
   - Example: `nvti-kanda.com` → `123.45.67.89`

2. **Wait for DNS propagation** (can take 1-48 hours)

3. **Test:** `ping your-domain.com`

---

## 💰 Estimated Server Costs

**VPS Options:**
- **DigitalOcean Droplet:** $6-12/month (2GB RAM)
- **Linode:** $10/month (2GB RAM)
- **AWS Lightsail:** $5-10/month
- **Vultr:** $6/month
- **Hetzner:** $5/month (Europe)

**Domain:** ~$12/year

**SSL:** Free (Let's Encrypt)

**Total:** ~$10-15/month

---

## ✅ Summary

Your NVTI Kanda application is now:
- ✅ Running on your own server
- ✅ Using your own PostgreSQL database
- ✅ Accessible via your domain with HTTPS
- ✅ Completely independent of Replit
- ✅ Production-ready and scalable

**Login:** `https://your-domain.com/dashboard/login`
- Username: `admin`
- Password: `admin123` (change immediately!)

---

## 📞 Need Help?

Common hosting providers with good tutorials:
- **DigitalOcean:** Excellent documentation
- **Linode:** Great support
- **AWS:** Most features but complex
- **Vultr:** Simple and cheap

All support Node.js, PostgreSQL, and nginx!
