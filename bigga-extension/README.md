# 🎯 BIGGA v2.0 - Axiome Memecoin Analyzer

Browser extension for analyzing memecoin tweets on Axiome and highlighting promising tokens based on historian statistics.

---

## 🚀 Features

### ✅ Automatic Data Collection (24/7)
- Monitors Axiome for new tokens
- Scrapes Twitter profiles WITHOUT API (uses Nitter)
- Collects historian data:
  - Username
  - Follower count
  - Tweet content
  - Token mentions (ticker/name)

### 🎨 Color Highlighting
- Customizable color rules based on Market Cap thresholds
- Highlights token cards, names, and tickers
- Visual badges with historian stats

### ⭐ WhiteList
- Favorite historians always highlighted
- Custom color for whitelist (default: green)

### 📊 Statistics Dashboard
- TOP-10 historians by average Market Cap
- Token history for each historian
- Export data to JSON

---

## 📁 Project Structure

```
bigga-extension/
├── manifest.json              # Extension manifest (Manifest V3)
├── background.js              # Service Worker (scraping, database)
├── content/
│   ├── content.js            # Content script for Axiome
│   └── content.css           # Highlighting styles
├── popup/
│   ├── popup.html            # Settings UI
│   ├── popup.js              # Settings logic
│   └── popup.css             # Popup styles
├── scraper/
│   └── twitter-scraper.js    # Twitter scraper (NO API)
├── storage/
│   └── database.js           # IndexedDB manager
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🛠️ Installation

### Method 1: Load Unpacked (Development)

1. **Clone or download** this repository

2. **Open Chrome Extensions page:**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

3. **Load the extension:**
   - Click "Load unpacked"
   - Select the `bigga-extension` folder

4. **Pin the extension:**
   - Click the puzzle icon in Chrome toolbar
   - Pin BIGGA v2.0

5. **Visit Axiome:**
   - Go to `https://axiome.io`
   - Extension will start analyzing tokens automatically

### Method 2: Install from .crx (Production)

1. Download `bigga-v2.0.crx`
2. Drag and drop into `chrome://extensions/`
3. Click "Add Extension"

---

## 🎮 Usage

### 1. Browse Axiome

Simply visit https://axiome.io and browse tokens. The extension will:
- Automatically detect token cards
- Scrape Twitter data for historians
- Highlight cards based on your settings
- Show historian badges with stats

### 2. Configure Settings

Click the extension icon to open settings:

#### 🎨 **Colors Tab**

Set highlighting rules based on historian's **Last 3 Tokens Average Market Cap**:

Example:
```
Market Cap ≥ $10,000 → Yellow
Market Cap ≥ $15,000 → Blue
Market Cap ≥ $20,000 → Red
```

- Click **"+ Add Rule"** to add more thresholds
- Use color picker to choose colors
- Click **"Save Colors"** to apply

#### ⭐ **WhiteList Tab**

Add favorite historians that will ALWAYS be highlighted:

1. Enter username (e.g., `@cryptoking`)
2. Click **"+ Add"**
3. Choose WhiteList color (default: green)
4. Click **"Save WhiteList"**

#### 📊 **Stats Tab**

View top performing historians:
- Ranked by average Market Cap
- See follower count, token count, averages
- Click **"🔄 Refresh"** to update
- Click **"📥 Export Data"** to download JSON

---

## 📊 How It Works

### Data Collection Flow

```
1. User visits Axiome
   ↓
2. Content script detects token cards
   ↓
3. Extracts Twitter link from card
   ↓
4. Sends to background worker
   ↓
5. Background scrapes Twitter via Nitter
   ↓
6. Saves to IndexedDB:
   - Historian username
   - Follower count
   - Token data (address, name, ticker)
   - Max Market Cap
   ↓
7. Calculates averages:
   - Average MC (all tokens)
   - Last 3 tokens average
   ↓
8. Content script applies highlighting
   ↓
9. Shows historian badge on card
```

### Twitter Scraping (Without API)

The extension uses **Nitter** (Twitter frontend alternative) to scrape data without authentication:

- **Profile data**: Follower count from Nitter
- **Tweet content**: Check if ticker/name mentioned
- **Rate limiting**: 2 seconds between requests
- **Fallback**: Direct Twitter scraping if Nitter fails

### Highlighting Logic

```javascript
// Priority order:
1. WhiteList → Custom color (green by default)
2. Last 3 Tokens Avg ≥ Threshold → Rule color
3. No match → No highlighting
```

---

## 🎨 Customization

### Adjust Selectors for Axiome

If Axiome changes their HTML structure, edit `content/content.js`:

```javascript
// Line ~120: Update token card selectors
function findTokenCards() {
  const selectors = [
    '[data-token-card]',     // Add Axiome's actual selector
    '.token-card',
    '.your-custom-class'
  ];
  // ...
}

// Line ~70: Update data extraction
function extractTokenData(card) {
  // Update these selectors:
  const nameElement = card.querySelector('.token-name');
  const tickerElement = card.querySelector('.token-ticker');
  // ...
}
```

### Change Scraping Delays

Edit `scraper/twitter-scraper.js`:

```javascript
// Line 6: Adjust delay between requests
this.minDelay = 2000; // 2 seconds (change if needed)
```

### Modify Badge Style

Edit `content/content.css`:

```css
.bigga-historian-badge {
  background: rgba(0, 0, 0, 0.9); /* Change background */
  border: 1px solid rgba(255, 255, 255, 0.1); /* Change border */
  /* ... */
}
```

---

## 🗄️ Database Schema

### IndexedDB Stores:

**1. Historians**
```javascript
{
  username: "string",
  followers: number,
  tokens: [
    {
      coinAddress: "string",
      coinName: "string",
      coinTicker: "string",
      tweetUrl: "string",
      maxMarketCap: number,
      timestamp: "ISO date"
    }
  ],
  averageMarketCap: number,
  last3TokensAvg: number,
  lastUpdated: "ISO date"
}
```

**2. Tokens**
```javascript
{
  coinAddress: "string",
  historianUsername: "string",
  coinName: "string",
  coinTicker: "string",
  tweetUrl: "string",
  maxMarketCap: number,
  timestamp: "ISO date"
}
```

**3. Cache**
```javascript
{
  key: "string",
  data: any,
  expiry: timestamp,
  createdAt: timestamp
}
```

---

## ⚠️ Important Notes

### Rate Limiting
- **2 seconds minimum** between Twitter requests
- Respects Nitter's rate limits
- Uses caching to avoid duplicate requests

### Privacy
- All data stored **locally** in browser (IndexedDB)
- No external servers
- No user tracking

### Twitter ToS
- This extension scrapes public Twitter data
- Uses Nitter (Twitter frontend alternative)
- **Use responsibly** and at your own risk
- Consider rate limits to avoid IP bans

### Axiome Structure
- Selectors may need updates if Axiome changes their UI
- Check browser console for errors
- Report issues if cards not detected

---

## 🐛 Troubleshooting

### Extension not loading?
1. Check `chrome://extensions/` for errors
2. Ensure "Developer mode" is enabled
3. Reload extension

### Cards not highlighted?
1. Open browser console (F12)
2. Look for BIGGA logs: `🎯 BIGGA v2.0 loaded`
3. Check if cards are detected: `🔍 Found X token cards`
4. Verify selectors match Axiome's HTML structure

### Twitter scraping fails?
1. Check network tab for blocked requests
2. Nitter might be down → Extension will fallback
3. Try clearing cache: Right-click extension → Options → Refresh

### Database errors?
1. Open DevTools → Application → IndexedDB
2. Check if "BiggaDB" exists
3. Delete database and reload extension to recreate

---

## 📈 Roadmap

### v2.1 (Planned)
- [ ] Market Cap tracking from Axiome
- [ ] Auto-update max MC for tokens
- [ ] Charts in statistics

### v2.2 (Planned)
- [ ] Multiple WhiteList colors
- [ ] Historian notes
- [ ] Export to CSV

### v3.0 (Future)
- [ ] Multi-platform support (other DEX frontends)
- [ ] AI-powered token analysis
- [ ] Telegram notifications

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License - do whatever you want with this code!

---

## 🚀 Quick Start Checklist

- [ ] Install extension in Chrome
- [ ] Pin to toolbar
- [ ] Visit https://axiome.io
- [ ] Open extension settings
- [ ] Configure color rules
- [ ] Add favorite historians to WhiteList
- [ ] Start flipping memecoins! 🎯

---

**Made with 🚀 for memecoin flippers**

*Disclaimer: This tool is for research purposes. Always DYOR before investing.*
