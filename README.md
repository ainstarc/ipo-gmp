# IPO GMP Dashboard

A modern, responsive dashboard for IPO Grey Market Premium (GMP) and performance data, built with Next.js and deployed as a static site to GitHub Pages. Data is sourced from [investorgain.com](https://www.investorgain.com/report/live-ipo-gmp/331/all/).

## Features

- Tabbed interface for All GMP, Mainboard, SME, Current Market GMP, and IPO Performance
- Data sourced and updated from investorgain.com
- Modern, desktop-style table layout (forced for all screen sizes)
- **Color-coded GMP and performance values** with a color scale for GMP %:

| Level | GMP % Range | Hex Code  | Color Name           | Comment                     |
| ----- | ----------- | --------- | -------------------- | --------------------------- |
| 1     | ≤ -5%       | `#8B0000` | Dark Red             | Strongly negative sentiment |
| 2     | -5% to 0%   | `#D73027` | Light Firebrick      | Mildly negative             |
| 3     | 0% to 5%    | `#FDAE61` | Orange               | Flat / lukewarm             |
| 4     | 5% to 15%   | `#FEE08B` | Light Yellow         | Mild interest               |
| 5     | 15% to 25%  | `#D9EF8B` | Yellow-Green         | Decent interest             |
| 6     | 25% to 35%  | `#91CF60` | Lime Green           | Good demand                 |
| 7     | 35% to 45%  | `#1A9850` | Medium Green         | Strong demand               |
| 8     | > 45%       | `#006837` | Deep Green (Tealish) | Very strong / hot demand    |

- Fire rating, date formatting, and word wrapping
- Fully responsive and mobile-friendly UI
- Light and dark themes with floating toggle (system preference + persistence)
- Static export for reliable GitHub Pages deployment (with subdirectory support)

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
     "url": "https://github.com/ainstarc/ipo-gmp.git"
   }
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```

The site will be available at `https://ainstarc.github.io/ipo-gmp/`.

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

---

## License

This project is licensed under the [MIT License](./LICENSE).
