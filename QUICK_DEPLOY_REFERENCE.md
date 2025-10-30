# ⚡ Quick Deploy Reference

## 🚀 Most Important Commands

### Initial Setup (One-time)
```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# 3. Create database
sudo -u postgres psql
CREATE DATABASE nvti_kanda;
CREATE USER nvti_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nvti_kanda TO nvti_admin;
\q

# 4. Clone/upload your code
cd /var/www
git clone https://github.com/yourusername/nvti-kanda.git
cd nvti-kanda

# 5. Install dependencies
npm install

# 6. Create .env file
nano .env
# Add DATABASE_URL and other variables (see DEPLOYMENT_GUIDE.md)

# 7. Initialize database
npm run db:push

# 8. Install PM2
sudo npm install -g pm2

# 9. Start application
pm2 start server/index.ts --name nvti-kanda --interpreter tsx
pm2 startup
pm2 save

# 10. Install Nginx
sudo apt install nginx

# 11. Configure Nginx
sudo nano /etc/nginx/sites-available/nvti-kanda
# (see DEPLOYMENT_GUIDE.md for config)
sudo ln -s /etc/nginx/sites-available/nvti-kanda /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 12. Get SSL certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔄 Regular Operations

### Deploy Updates
```bash
cd /var/www/nvti-kanda
git pull origin main
npm install
npm run db:push
npm run build
pm2 restart nvti-kanda
```

### View Logs
```bash
pm2 logs nvti-kanda
pm2 logs nvti-kanda --lines 100
```

### Restart Application
```bash
pm2 restart nvti-kanda
```

### Stop Application
```bash
pm2 stop nvti-kanda
```

### Check Status
```bash
pm2 status
systemctl status nginx
systemctl status postgresql
```

---

## 🔐 Environment Variables (.env)

```env
DATABASE_URL=postgresql://nvti_admin:password@localhost:5432/nvti_kanda
PGHOST=localhost
PGPORT=5432
PGUSER=nvti_admin
PGPASSWORD=your_password
PGDATABASE=nvti_kanda
NODE_ENV=production
SESSION_SECRET=generate_random_32_chars
PORT=5000
```

---

## 🐛 Quick Troubleshooting

### App won't start
```bash
pm2 logs nvti-kanda
pm2 restart nvti-kanda
```

### Database issues
```bash
sudo systemctl status postgresql
psql -U nvti_admin -d nvti_kanda -h localhost -W
```

### Nginx issues
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

### Check what's using port 5000
```bash
sudo lsof -i :5000
```

---

## 📊 Monitoring

```bash
pm2 monit              # Real-time dashboard
pm2 status             # Quick status
htop                   # Server resources
df -h                  # Disk space
free -h                # Memory usage
```

---

## 💾 Database Backup

```bash
# Backup
pg_dump -U nvti_admin nvti_kanda > backup_$(date +%Y%m%d).sql

# Restore
psql -U nvti_admin nvti_kanda < backup_20241030.sql
```

---

## 🔥 Emergency Restart

```bash
pm2 restart nvti-kanda
sudo systemctl restart nginx
sudo systemctl restart postgresql
```

---

## ✅ Post-Deploy Checklist

- [ ] Application running: `pm2 status`
- [ ] Nginx running: `systemctl status nginx`
- [ ] Database accessible: `psql -U nvti_admin -d nvti_kanda`
- [ ] Website loads: Visit `https://your-domain.com`
- [ ] Can login: `/dashboard/login`
- [ ] Can create post with image
- [ ] SSL working (https://)
- [ ] PM2 starts on boot: `pm2 startup`

---

## 🌐 Server Providers

**Recommended for beginners:**
- **DigitalOcean** ($6/month droplet)
- **Linode** ($10/month)
- **Vultr** ($6/month)

All have one-click Ubuntu setup!

---

## 📁 Important Paths

```
Application: /var/www/nvti-kanda
Nginx config: /etc/nginx/sites-available/nvti-kanda
Nginx logs: /var/log/nginx/
PM2 logs: ~/.pm2/logs/
.env file: /var/www/nvti-kanda/.env
```

---

## 🔑 Default Login

**URL:** `https://your-domain.com/dashboard/login`
- Username: `admin`
- Password: `admin123`

⚠️ **CHANGE IMMEDIATELY IN PRODUCTION!**

---

## 💡 Pro Tips

1. **Always backup before updates:**
   ```bash
   pg_dump -U nvti_admin nvti_kanda > backup.sql
   ```

2. **Test locally first:**
   ```bash
   git pull
   npm install
   npm run build
   # Test, then deploy
   ```

3. **Monitor logs during deploy:**
   ```bash
   pm2 logs nvti-kanda --lines 50 -f
   ```

4. **Keep PM2 updated:**
   ```bash
   npm install pm2@latest -g
   pm2 update
   ```

---

## 🆘 Getting Stuck?

1. Check PM2 logs: `pm2 logs nvti-kanda`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Test database: `psql -U nvti_admin -d nvti_kanda`
4. Restart everything: `pm2 restart all && sudo systemctl restart nginx`

**Full guide:** See `DEPLOYMENT_GUIDE.md`
