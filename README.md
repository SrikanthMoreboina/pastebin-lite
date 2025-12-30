# Pastebin-Lite — Secret Message Share

A minimal, secure, and beautiful "Pastebin"-like app where users can create text pastes (secret messages) and share them via unique links. Pastes can optionally self-destruct after a set number of views or after a time limit.

**Live Demo**: https://pastebin-lite-ebon.vercel.app/

## Features
- Create secret messages with any text
- Generate short, shareable links
- Optional **view limit** (e.g., readable only once)
- Optional **time expiry** (TTL in seconds)
- If both limits are set, the message disappears as soon as either is reached
- Clean, premium dark UI with glassmorphism design
- Safe rendering — no script execution (XSS protected)
- Simple unified expiry message: "This message has expired"
- Full support for automated testing (deterministic time via `x-test-now-ms`)

## Tech Stack
- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Persistence**: Upstash Redis (serverless Redis via Vercel Marketplace)
- **Deployment**: Vercel
- **Icons**: Lucide React

## Project Setup & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
