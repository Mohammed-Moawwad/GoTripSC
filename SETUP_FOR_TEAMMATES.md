# 🚀 GoTrip Project Setup Guide for Teammates

## Prerequisites

- Node.js v22.x or higher
- Git

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Mohammed-Moawwad/GoTripSC.git
cd GoTripSC
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Your .env File

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and replace `ASK_MOHAMMED_FOR_PASSWORD` with the actual Railway database password.

**Ask Mohammed (@Mohammed-Moawwad) for the password via Discord/WhatsApp!**

Your `.env` should look like this:

```env
DB_HOST=nozomi.proxy.rlwy.net
DB_USER=root
DB_PASSWORD=the-password-mohammed-gives-you
DB_NAME=railway
DB_PORT=59884
```

### 4. Start the Server

```bash
npm start
```

You should see:

```
✅ MySQL Database connected successfully!
🚀 GoTrip Server is running!
📍 URL: http://localhost:3000
```

### 5. Open in Browser

Open `http://localhost:3000` in your browser to test the application.

---

## 🗄️ Database Access

We're using **Railway Cloud Database** so everyone connects to the same database automatically!

### View Database (Optional)

If you want to view/edit the database directly:

1. Download [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) or [DBeaver](https://dbeaver.io/download/)
2. Create new connection with the Railway credentials
3. You can now run SQL queries and view tables

---

## 🔧 Troubleshooting

### "Cannot connect to database"

- Make sure you have the correct password in `.env`
- Check your internet connection (database is in the cloud)
- Ask Mohammed if the Railway credentials have changed

### "Port 3000 is already in use"

Change the PORT in `.env` to something else (e.g., 3001)

### "Module not found"

Run `npm install` again

---

## 📁 Project Structure

```
GoTripSC/
├── backend/           # Backend API code
│   ├── controllers/   # Business logic
│   ├── routes/        # API endpoints
│   └── config/        # Database config
├── HomePage/          # Landing pages
├── Services/          # Service pages (Hotels, Flights, Buses)
├── Admin/             # Admin dashboard
├── User/              # User dashboard
├── Login/             # Authentication pages
└── server.js          # Main server file
```

---

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test locally
4. Push and create a Pull Request

---

## 📞 Need Help?

Contact Mohammed (@Mohammed-Moawwad) on Discord/WhatsApp
