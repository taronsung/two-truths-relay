# 🌸 Two Truths Relay

**A viral social bluff game where you spot the lie, add yours, and watch the relay tree grow!**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/taronsung/two-truths-relay)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/taronsung/two-truths-relay)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/taronsung/two-truths-relay)

---

## What is Two Truths Relay?

Two Truths Relay transforms the classic party game into a **viral, chain-reaction social experience**:

1. Someone sends you 3 statements - 2 are true, 1 is a lie
2. You guess which one is the lie
3. You add YOUR own 2 truths + 1 lie
4. Share with friends to continue the relay
5. Watch the tree grow as friends branch off from each other!

**Fun even with just 2-3 people, but becomes MORE fun as the tree grows!**

---

## Features

- **Instant Fun** - Playable within 30 seconds of opening a link
- **Beautiful Design** - Cozy pastel colors, smooth animations, delightful interactions
- **Natural Virality** - Must share to continue = built-in growth loop
- **Tree Visualization** - See how the relay spreads through your network
- **Mobile-First** - Works great on any device
- **No Login Required** - Just open and play

---

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Supabase-Ready** - Database schema included

---

## Quick Start

### One-Click Deploy

Click any deploy button above to launch your own instance in seconds!

### Local Development

```bash
# Clone the repo
git clone https://github.com/taronsung/two-truths-relay.git
cd two-truths-relay

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the magic!

---

## How to Play

### Starting a Relay
1. Go to `/start`
2. Write your 2 truths and 1 lie
3. Share the link with friends

### Joining a Relay
1. Open the link you received
2. Read the 3 statements
3. Tap the one you think is the lie
4. See if you were right!
5. Add your own 2 truths + 1 lie
6. Share with more friends

---

## The Viral Loop

```
You receive link → Guess the lie → Create your own → Share → Friends repeat
                                                        ↓
                              The tree grows with every new participant!
```

---

## Screenshots

| Home | Guess | Reveal | Create |
|------|-------|--------|--------|
| Landing with tree animation | Pick which is the lie | Confetti on correct guess | Add your own statements |

---

## Database Setup (Optional)

For persistent data, set up Supabase:

1. Create a Supabase project
2. Run the SQL from `src/lib/db/schema.sql`
3. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

---

## Contributing

PRs welcome! This project is open source and we'd love your help making it even better.

---

## License

MIT License - feel free to use this for your own projects!

---

**Made with love for fun social games**

Try it now: [Deploy your own instance!](https://vercel.com/new/clone?repository-url=https://github.com/taronsung/two-truths-relay)
