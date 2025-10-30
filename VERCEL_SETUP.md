# Vercel Environment Variables Setup

## IMPORTANT: Add these environment variables to your Vercel project

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your project: portfolio-rajivkumar
3. Go to Settings → Environment Variables
4. Add these variables:

### Required Environment Variables:

**Variable Name:** `GMAIL_USER`
**Value:** `kumarrajiv12945@gmail.com`
**Environment:** Production, Preview, Development (check all)

**Variable Name:** `GMAIL_APP_PASSWORD`  
**Value:** `hkipzphrtqwlwngk`
**Environment:** Production, Preview, Development (check all)

**Variable Name:** `NODE_ENV`
**Value:** `production`
**Environment:** Production only

### After adding variables:
1. Click "Save" for each variable
2. Go to Deployments tab
3. Click "Redeploy" on your latest deployment
4. Select "Use existing Build Cache" and click "Redeploy"

## Security Note:
- Never commit .env files to git
- These variables are safely stored in Vercel's secure environment
- Your Gmail App Password is encrypted and not visible to others

## Testing:
After redeployment, your contact form should work on the live site!