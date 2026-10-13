# EXACT STEP BY STEP (DETAILED) - Raj Enterprises Live Deployment

## STEP 1: MongoDB Atlas (Database) - 5 minutes

1. Go to https://www.mongodb.com/atlas and sign in/signup
2. Create a FREE cluster (M0 Sandbox). Choose any region closest to India (Mumbai/Hyderabad/Singapore recommended) -> Create
3. Wait for cluster to be ready (1-3 min)
4. Go to "Database Access" (left sidebar) -> "Add New Database User"
   - Authentication Method: Password
   - Username: e.g. rajadmin
   - Password: generate a STRONG password (save this)
   - Database User Privileges: Read and Write to any Database
   - Add User
5. Go to "Network Access" (left sidebar) -> "Add IP Address"
   - Access List Entry: 0.0.0.0/0 (for quick deployment; can restrict later)
   - Comment: Render+Vercel
   - Confirm
6. Go to "Database" -> "Connect" -> "Drivers"
   - Choose Driver: Node.js, Version: latest
   - Copy connection string: mongodb+srv://rajadmin:<password>@<cluster>.mongodb.net/raj-enterprises?retryWrites=true&w=majority
   - REPLACE <password> with your generated password
   - SAVE this string (will use in Render)

## STEP 2: Get a strong JWT secret (1 min)

Open any terminal/online generator or use this command locally:
node -e "require('crypto').randomBytes(48).toString('hex')" 

Copy the 96-char hex string. Save it (use in Render as JWT_SECRET)

## STEP 3: Deploy Backend on Render (5-10 min)

1. Go to https://render.com and login/signup (can use GitHub)
2. Click "New +" -> "Web Service"
3. Connect to GitHub -> authorize if needed
4. Select repository: Tanushka-08/Raj-Enterprises
5. Branch: main
6. Under "Root Directory" - LEAVE EMPTY (repo root) OR set to 'backend' depending on UI. 
   - Our repo root has vercel.json etc; Render will use render.yaml if detected, but easier: 
   - If you leave root empty: Build Command = cd backend && npm install; Start Command = node backend/server.js
   - If you set Root Directory = backend: Build Command = npm install; Start Command = node server.js
7. Plan: Free (default)
8. Scroll to "Environment Variables" -> Add each:

   | Key | Value |
   |---|---|
   | NODE_ENV | production |
   | PORT | 5000 |
   | MONGODB_URI | mongodb+srv://rajadmin:YOUR_PASSWORD@yourcluster.mongodb.net/raj-enterprises?retryWrites=true&w=majority |
   | JWT_SECRET | (paste 96-char hex from step 2) |
   | CLIENT_URL | https://your-vercel-app.vercel.app,http://localhost:5173 |
   | ADMIN_USERNAME | admin (or change to stronger) |
   | ADMIN_PASSWORD | set a STRONG password (min 8 chars) |
   | ADMIN_EMAIL | aquarajenterprises@gmail.com |

   NOTE: Leave CLIENT_URL as-is for now; we'll update after Step 4 gives Vercel URL.

9. Click "Create Web Service". Render will build and start. Takes 2-5 min.
10. When done, copy the URL: e.g. https://raj-enterprises-backend.onrender.com

## STEP 4: Seed Database (ONCE) from your LOCAL machine (2 min)

This creates demo products, AMC plans and admin user in Atlas. DO NOT run on Render.

Open terminal in project root on YOUR laptop:

cd D:\laptop\Projects\Raj Enterprises\backend
="development"; ="WIPE_AND_RESEED"; ="mongodb+srv://rajadmin:YOUR_PASSWORD@yourcluster.mongodb.net/raj-enterprises?retryWrites=true&w=majority"
node seed.js

Or in cmd:
set NODE_ENV=development
set SEED_CONFIRM=WIPE_AND_RESEED
set MONGODB_URI=mongodb+srv://rajadmin:YOUR_PASSWORD@yourcluster.mongodb.net/raj-enterprises?retryWrites=true&w=majority
npm run seed

Expected: "MongoDB connected...", "Existing data cleared", "Admin created", "AMC Plans created", "Products created", "Database seeded successfully"

If it connects OK, data is live.

## STEP 5: Test Backend Health (1 min)

Open browser or use curl:
https://<your-render-backend>/api/health

Should return: {"status":"ok","db":"connected","uptime":...,"timestamp":...}

If db shows "disconnected", check MONGODB_URI and Network Access (0.0.0.0/0).

## STEP 6: Deploy Frontend on Vercel (2-5 min)

1. Go to https://vercel.com/new and login/signup
2. "Import Git Repository" -> Select Tanushka-08/Raj-Enterprises -> Import
3. Configure Project:
   - Framework Preset: Other
   - Root Directory: ./ (leave as is)
   - Build Command: cd frontend && npm install && npm run build  (vercel.json also sets this; either is fine)
   - Output Directory: frontend/dist
   - Install Command: npm install --prefix frontend (optional if buildCommand handles)
4. "Environment Variables" -> Add:
   | Key | Value |
   |---|---|
   | VITE_API_URL | https://<your-render-backend>/api |
5. Click "Deploy"
6. When done, copy Frontend URL: e.g. https://raj-enterprises.vercel.app

## STEP 7: Update CORS on Render (1 min)

Now frontend URL exists. Go back to Render -> Web Service (your backend) -> "Environment" tab.
Edit CLIENT_URL to include your Vercel URL:
CLIENT_URL=https://your-actual-vercel-url.vercel.app,http://localhost:5173

Click "Save Changes" -> Render will auto-redeploy backend (or click "Manual Deploy" -> "Deploy latest commit")

Wait for redeploy to finish (1-2 min).

## STEP 8: End-to-End Testing (5 min) - MUST DO

Open your Vercel frontend URL and test these:

1. Home page loads fine
2. Products -> should show seeded products (grid, filters, search)
3. Product Detail -> opens, shows variants if any
4. Enquiry -> Contact/Enquiry form submit -> success message
5. Book Service -> fill form, submit -> success (gets ticket ID)
6. Track Service -> use ticket ID/mobile -> shows status
7. AMC Plans -> visible
8. Reviews (public) -> can submit (needs approval via admin)
9. Admin Login -> go to /admin/login
   - Username: admin (or what you set)
   - Password: what you set in Render
   -> should login to dashboard
10. Admin Dashboard tests:
   - Dashboard stats load
   - Products: Add/Edit/Delete (if needed)
   - Enquiries: view/update status
   - Service Requests: assign/update status
   - Customers: list/add/edit
   - AMC: list/manage
   - Reviews: approve/reject/delete

All must work without console errors.

## TROUBLESHOOTING (Quick Fixes)

- CORS error in browser console: means Vercel URL not in CLIENT_URL -> fix Render env + redeploy
- 401 on admin: wrong username/password or token issue; check Render env
- DB disconnected on /api/health: Atlas URI wrong or IP not allowed
- Products empty: forgot to seed against Atlas OR seeded to wrong DB
- Render free tier sleeps after inactivity (normal) - first load after sleep takes ~30s (will be fast after)
- Vercel build fails: check vercel.json/build command; our setup matches

## SECURITY NOTES

- Use strong unique passwords (admin + Atlas user)
- JWT_SECRET = 48+ random bytes (96 hex) - never reuse
- Restrict Atlas Network Access to Vercel/Render IPs later for extra security (optional now)
- .env files never committed (we only have .example files)

## FINAL RESULT

After all steps done, you'll have:
- Frontend: https://your-app.vercel.app (fast, HTTPS)
- Backend: https://your-backend.onrender.com (HTTPS, API)
- DB: MongoDB Atlas (secure)

ALL existing features preserved. App is production-ready.

