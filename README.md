# IPO GMP Dashboard

A Next.js static dashboard for IPO Grey Market Premium (GMP) and performance data, scraped from [investorgain.com](https://www.investorgain.com/report/live-ipo-gmp/331/all/).

## Features

- Tabbed interface for All GMP, Mainboard, SME, Current Market GMP, and IPO Performance
- Data sourced and updated from investorgain.com
- Responsive, modern UI

## Development

```bash
npm install
npm run dev
```

## Deployment

This project uses static export and can be deployed to GitHub Pages.

1. Install `gh-pages` if not already:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Set your repository in `package.json`:
   ```json
   "repository": {
     "type": "git",
     "url": "https://github.com/<your-username>/ipo-gmp.git"
   }
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```

The site will be available at `https://<your-username>.github.io/ipo-gmp/`.

---

### Data Sources

- [All GMP](https://www.investorgain.com/report/live-ipo-gmp/331/all/)
- [Mainboard GMP](https://www.investorgain.com/report/live-ipo-gmp/331/ipo/)
- [SME GMP](https://www.investorgain.com/report/live-ipo-gmp/331/sme/)
- [Current Market GMP](https://www.investorgain.com/report/live-ipo-gmp/331/current/)
- [All IPO Performance](https://www.investorgain.com/report/ipo-gmp-performance/377/)
- [Mainline IPO Performance](https://www.investorgain.com/report/ipo-gmp-performance-tracker/377/ipo/)
- [SME IPO Performance](https://www.investorgain.com/report/ipo-gmp-performance-tracker/377/sme/)

Data is scraped and updated from the above sources.
