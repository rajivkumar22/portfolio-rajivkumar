# Fix Vercel Email Issue - Environment Variables Setup

## Problem
Your portfolio email works locally but not on Vercel because environment variables are missing.

## Solution - Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Find your portfolio project: `portfolio-rajivkumar`
3. Click on your project

### Step 2: Add Environment Variables
1. Go to **Settings** tab
2. Click **Environment Variables** in the left sidebar
3. Add these variables one by one:

#### Variable 1:
- **Name:** `GMAIL_USER`
- **Value:** `kumarrajiv12945@gmail.com`
- **Environment:** Production, Preview, Development (select all)

#### Variable 2:
- **Name:** `GMAIL_APP_PASSWORD`
- **Value:** `hkipzphrtqwlwngk`
- **Environment:** Production, Preview, Development (select all)

#### Variable 3:
- **Name:** `CONTACT_EMAIL`
- **Value:** `kumarrajiv12945@gmail.com`
- **Environment:** Production, Preview, Development (select all)

### Step 3: Redeploy
1. After adding all variables, go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. OR just push any small change to GitHub (Vercel will auto-deploy)

### Step 4: Test
Visit your live portfolio and test the contact form. Emails should now be delivered to kumarrajiv12945@gmail.com

## Why This Happens
- Local development reads from `.env` file
- Vercel production needs variables set in dashboard
- Without these variables, email system falls back to logging mode

## Quick Test
After setting up, you can test by:
1. Going to your live portfolio
2. Filling out the contact form
3. Checking your Gmail inbox for the message