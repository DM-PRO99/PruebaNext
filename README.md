# HelpDeskPro - Ticket Management System

Complete support ticket management system developed with Next.js, TypeScript, MongoDB, and Mongoose. Allows clients to create support tickets and agents to manage them efficiently.

## 📋 Overview

HelpDeskPro is an internal web application that digitizes and optimizes support ticket management, solving problems such as:
- Lack of centralized ticket registry
- Lost emails or delayed responses
- Absence of clear tracking of each ticket's status
- Lack of prioritization and reminders for agents
- Inability to measure response times and global statuses

## 🚀 Technologies Used

- **Frontend:**
  - Next.js 16.0.8 (App Router)
  - React 19.2.1
  - TypeScript 5
  - Tailwind CSS 4
  - Context API for state management

- **Backend:**
  - Next.js API Routes
  - MongoDB with Mongoose
  - JWT for authentication
  - bcryptjs for password hashing

- **Services:**
  - Axios for HTTP requests
  - Nodemailer for email sending
  - node-cron for scheduled tasks

## ✨ Main Features

### 3.1 Ticket Management
- ✅ Create new tickets from the client panel
- ✅ Edit/update status, priority, and assigned agent from the agent panel
- ✅ Close tickets by changing their status to "closed"
- ✅ List tickets with filters:
  - Clients: only their own tickets
  - Agents: all tickets with filters by status and priority
- ✅ Controlled and typed forms in TypeScript

### 3.2 Authentication and Roles
- ✅ Login module with credential validation
- ✅ Two roles: `client` and `agent`
- ✅ Automatic redirection based on role after login
- ✅ Role-based route protection
- ✅ Context API for authentication state management

### 3.3 Comments and Responses
- ✅ Comment system per ticket
- ✅ Clients can add comments to their tickets
- ✅ Agents can respond to tickets with comments
- ✅ Chronological display of comments

### 3.4 Reusable UI Components
- ✅ **Button**: Variants (primary, secondary, danger, outline) and sizes (sm, md, lg)
- ✅ **Badge**: For statuses and priorities with differentiated colors
- ✅ **Card**: To display ticket summaries with integrated badges and buttons

### 3.5 API and Services
- ✅ Mongoose models: User, Ticket, Comment
- ✅ Complete API Routes:
  - `/api/auth/login` - Authentication
  - `/api/auth/register` - User registration
  - `/api/auth/me` - Get current user
  - `/api/tickets` - Ticket CRUD
  - `/api/tickets/[id]` - Specific ticket operations
  - `/api/comments` - Comment management
- ✅ Typed Axios services for API consumption
- ✅ Agent dashboard with statistics and filters

### 3.6 Email Notifications
- ✅ Automatic email sending when:
  - A ticket is created (to the client)
  - An agent responds to a ticket (to the client)
  - A ticket is closed (to the client)

### 3.7 Cron Jobs
- ✅ Endpoint `/api/cron/reminders` to detect unanswered tickets
- ✅ Sends reminders to agents about pending tickets (24+ hours without update)

### 3.8 Error Handling and Validations
- ✅ Try/catch in Axios services and API routes
- ✅ Clear error and success messages to users
- ✅ Validations:
  - Title and description required
  - Do not allow creating tickets without authentication
  - Role respect in each operation

## 📦 Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- Email account for sending emails (Gmail, SendGrid, etc.)

## 🔧 Installation and Configuration

### 1. Clone the Repository

```bash
git clone https://github.com/DM-PRO99/PruebaNext.git
cd PruebaNext/pruebanext
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/helpdeskpro
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/helpdeskpro

# JWT Secret (change in production)
JWT_SECRET=your-super-secure-jwt-secret-change-in-production

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=HelpDeskPro <noreply@helpdeskpro.com>

# Cron Secret (to protect cron endpoint)
CRON_SECRET=your-cron-secret
```

**Note for Gmail:**
- You need to generate an "App Password" in your Google account
- Go to: Google Account → Security → 2-Step Verification → App passwords

### 4. Initialize Database

**⚠️ IMPORTANT:** MongoDB automatically creates the database when the first write operation is performed. You don't need to create the database manually.

**Steps:**
1. Make sure MongoDB is running (local or Atlas)
2. The `helpdeskpro` database will be created automatically when:
   - You register the first user
   - You create the first ticket
   - Or you execute any write operation

**To create test users:**
```bash
# Option 1: Use the initialization script
npm run init-users

# Option 2: Use the registration API (see next section)
# Option 3: Use MongoDB Compass or mongo shell
```

### 5. Run the Project

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 👥 Create Test Users

You can create test users using the registration API or directly in MongoDB:

### Option 1: Using the API (from Postman or curl)

```bash
# Create client
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "email": "client@test.com",
    "password": "123456",
    "role": "client"
  }'

# Create agent
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Agent",
    "email": "agent@test.com",
    "password": "123456",
    "role": "agent"
  }'
```

### Option 2: Initialization Script

Create a `scripts/init-users.ts` file (optional):

```typescript
// Run with: npx ts-node scripts/init-users.ts
```

## 🎯 Usage Flow

### For Clients:

1. **Login**: Access with client credentials
2. **Create Ticket**: From the dashboard, click "Create New Ticket"
3. **View Tickets**: List of all their tickets with status and priority
4. **View Detail**: Click "View Detail" to see and add comments
5. **Receive Notifications**: Automatic emails when the agent responds or closes the ticket

### For Agents:

1. **Login**: Access with agent credentials
2. **Dashboard**: View statistics and all tickets
3. **Filter**: Use filters by status and priority
4. **Manage Tickets**: 
   - View ticket detail
   - Change status (open → in progress → resolved → closed)
   - Change priority
   - Respond with comments
5. **Reminders**: Receive automatic emails about unanswered tickets

## 📁 Project Structure

```
pruebanext/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Authentication routes
│   │   │   ├── tickets/        # Ticket routes
│   │   │   ├── comments/       # Comment routes
│   │   │   └── cron/          # Cron jobs
│   │   ├── client/            # Client panel
│   │   │   ├── dashboard/
│   │   │   └── tickets/[id]/
│   │   ├── agent/             # Agent panel
│   │   │   ├── dashboard/
│   │   │   └── tickets/[id]/
│   │   ├── login/             # Login page
│   │   ├── layout.tsx         # Main layout with AuthProvider
│   │   └── page.tsx           # Main page (redirection)
│   ├── components/
│   │   ├── ui/                # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Card.tsx
│   │   └── CreateTicketModal.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/
│   │   ├── mongodb.ts         # MongoDB connection
│   │   ├── auth.ts            # Authentication utilities
│   │   └── email.ts           # Email service
│   ├── models/
│   │   ├── User.ts            # User model
│   │   ├── Ticket.ts          # Ticket model
│   │   └── Comment.ts         # Comment model
│   ├── services/
│   │   └── api.ts              # Axios services
│   └── types/
│       └── index.ts           # TypeScript types
├── .env.local                  # Environment variables (do not commit)
├── .env.local.example          # Environment variables example
├── package.json
└── README.md
```

## 🔐 Security

- Passwords hashed with bcryptjs
- JWT authentication with 7-day expiration
- Role-based route protection
- Server-side data validation
- Input sanitization

## 📧 Email Configuration

The system sends automatic emails on these events:
- **Ticket creation**: To the client who created the ticket
- **Agent response**: To the client when an agent comments
- **Ticket closure**: To the client when the ticket is closed
- **Reminders**: To agents about unanswered tickets (cron job)

## ⏰ Cron Jobs

The `/api/cron/reminders` endpoint must be called periodically (hourly or daily) by an external cron service such as:
- Vercel Cron
- cron-job.org
- GitHub Actions
- Own server with node-cron

**Example Vercel configuration:**

```json
{
  "crons": [{
    "path": "/api/cron/reminders",
    "schedule": "0 * * * *"
  }]
}
```

## 🧪 Testing

To test the system:

1. Create a client user and an agent user
2. Log in as client and create a ticket
3. Log in as agent and manage the ticket
4. Verify that notification emails are received

## 🐛 Troubleshooting

### MongoDB connection error
- Verify that MongoDB is running
- Verify the URI in `.env.local`
- For MongoDB Atlas, verify the IP whitelist

### Email sending error
- Verify email credentials in `.env.local`
- For Gmail, use App Password, not the normal password
- Verify that port 587 is not blocked

### Authentication error
- Verify that JWT_SECRET is configured
- Clear browser localStorage
- Verify that the token has not expired

## 📸 Screenshots

### Main Flow:

1. **Login**: Login page
2. **Client Dashboard**: List of client tickets with option to create new ones
3. **Create Ticket**: Modal to create new ticket with title, description and priority
4. **Client Ticket Detail**: Detailed view with comments and option to add more
5. **Agent Dashboard**: Statistics, filters and list of all tickets
6. **Agent Manage Ticket**: Detailed view with options to change status, priority and respond

## 📝 Coder Information

- **Name**: Diego Alejandro Mena Ciceri
- **Clan**: Gosling
- **Email**: diegomena903@gmail.com
- **ID Number**: 1109290022

## 📄 License

This project was developed as a performance test.

## 🙏 Acknowledgments

- Next.js for the framework
- MongoDB for the database
- Tailwind CSS for the styles

---

**Developed with Next.js and TypeScript**
