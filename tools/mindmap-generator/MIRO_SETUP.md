# Miro API Setup Guide 🎨

Complete guide to set up Miro API integration for automatic mind map generation.

---

## 📋 Prerequisites

- Miro account (Free or paid)
- Node.js installed
- Terminal/command line access

---

## 🔑 Step 1: Get Miro Access Token

### Option A: Quick Setup (Personal Use)

1. **Go to Miro Developer Portal**
   - Visit: https://miro.com/app/settings/user-profile/apps
   - Or: Miro → Settings → Your apps → Create new app

2. **Create New App**
   - Click "Create new app"
   - App name: "Growth Strategy Mind Map Generator"
   - Description: "Automatically creates growth strategy mind maps"
   - Click "Create"

3. **Get Access Token**
   - In your app settings, find "Access tokens" section
   - Click "Generate access token"
   - **Copy the token immediately** (you won't see it again!)
   - Save it securely

4. **Grant Permissions**
   - Ensure these scopes are enabled:
     - ✅ `boards:read`
     - ✅ `boards:write`
     - If not enabled, go to "Permissions" tab and enable them

### Option B: OAuth 2.0 Setup (For Teams/Production)

If you need to share this with team members or use in production:

1. **Create OAuth App**
   - Go to https://miro.com/app/settings/user-profile/apps
   - Create new app
   - Select "OAuth 2.0" authorization type

2. **Configure OAuth Settings**
   - Redirect URI: Your app's callback URL
   - Scopes: `boards:read`, `boards:write`

3. **Implement OAuth Flow**
   - See: https://developers.miro.com/docs/getting-started-with-oauth
   - This is more complex but allows team-wide use

**For this tutorial, we'll use Option A (Personal Access Token)**

---

## 🛠️ Step 2: Set Up Environment

### On Mac/Linux:

```bash
# Add to your ~/.bashrc or ~/.zshrc for permanent setup
export MIRO_ACCESS_TOKEN="your_access_token_here"

# Or just for current session:
export MIRO_ACCESS_TOKEN="your_access_token_here"
```

### On Windows (Command Prompt):

```cmd
set MIRO_ACCESS_TOKEN=your_access_token_here
```

### On Windows (PowerShell):

```powershell
$env:MIRO_ACCESS_TOKEN="your_access_token_here"
```

### Using .env File (Recommended):

1. **Create `.env` file** in `tools/mindmap-generator/`:

```bash
MIRO_ACCESS_TOKEN=your_access_token_here
MIRO_BOARD_ID=optional_existing_board_id
```

2. **Install dotenv** (if not already):

```bash
npm install dotenv
```

3. **Load in script**:

```javascript
require('dotenv').config();
const accessToken = process.env.MIRO_ACCESS_TOKEN;
```

---

## 🚀 Step 3: Run the Generator

### Create New Board with Mind Map:

```bash
cd tools/mindmap-generator
node miro-integration.js
```

This will:
- Create a new Miro board
- Generate the complete mind map
- Output the board URL

### Use Existing Board:

If you want to add mind map to an existing board:

1. **Get Board ID** from Miro board URL:
   ```
   https://miro.com/app/board/uXjVKME_rQw=/
                                  ^^^^^^^^^^^^^^ <- This is your Board ID
   ```

2. **Set Board ID**:
   ```bash
   export MIRO_BOARD_ID="uXjVKME_rQw="
   node miro-integration.js
   ```

---

## 🎯 Usage Examples

### Generate Derek's Mind Map:

```bash
# Set your token
export MIRO_ACCESS_TOKEN="your_token"

# Run generator
node miro-integration.js
```

**Output:**
```
🚀 Miro Mind Map Generator
==================================================

📋 Creating new Miro board...
✅ Board created: uXjVKME_rQw=
🔗 View board: https://miro.com/app/board/uXjVKME_rQw=/

🎨 Creating mind map in Miro...

📍 Creating central node...
✅ Central node created: 3458764580424242890

📍 Creating Phase 1: Foundation...
✅ Phase 1 created

📍 Creating Phase 2: First Monetization...
✅ Phase 2 created

[...]

🎉 Mind map successfully created in Miro!

✅ Done! View your mind map at: https://miro.com/app/board/uXjVKME_rQw=/
```

### Programmatic Usage:

```javascript
const { createStrategyMindMap } = require('./miro-integration');

const accessToken = 'your_token';
const boardId = 'your_board_id';

const strategy = {
  name: 'Client Name',
  company: 'Company Name',
  niche: 'Niche'
};

createStrategyMindMap(accessToken, boardId, strategy)
  .then(() => console.log('Mind map created!'))
  .catch(err => console.error('Error:', err));
```

---

## ⚠️ Troubleshooting

### Error: "MIRO_ACCESS_TOKEN not set"

**Solution:**
```bash
export MIRO_ACCESS_TOKEN="your_token_here"
```

### Error: "401 Unauthorized"

**Causes:**
- Token expired (tokens last 1 hour for OAuth, indefinite for personal tokens)
- Invalid token
- Token doesn't have required permissions

**Solution:**
1. Generate new access token from Miro
2. Check permissions include `boards:read` and `boards:write`
3. Update your environment variable

### Error: "403 Forbidden"

**Causes:**
- Board permissions don't allow editing
- Team restrictions

**Solution:**
1. Check you're the board owner or have edit permissions
2. Try creating a new board instead of using existing one

### Error: "Mind map API experimental - limitations"

**Note:** Miro's Mind Map API is currently experimental. This means:
- May have rate limits
- API structure might change
- Some features might be limited

**Solution:**
- Use with reasonable frequency
- Have fallback to HTML mind map generation
- Check Miro's developer docs for updates

### Error: "Network timeout"

**Solution:**
- Check internet connection
- Check Miro API status: https://status.miro.com/
- Try again after a few minutes

---

## 🔒 Security Best Practices

### DO:
✅ Store access token in environment variables or `.env` file
✅ Add `.env` to `.gitignore`
✅ Use separate tokens for dev/production
✅ Rotate tokens periodically
✅ Limit token permissions to only what's needed

### DON'T:
❌ Commit tokens to git repositories
❌ Share tokens publicly
❌ Use production tokens in development
❌ Store tokens in plain text files
❌ Give tokens more permissions than needed

### Example `.gitignore`:

```
.env
.env.local
.env.*.local
*.key
*.pem
```

---

## 📊 API Rate Limits

Miro API has rate limits to prevent abuse:

- **Free plan**: 10 requests per second
- **Team plan**: 100 requests per second
- **Enterprise**: Custom limits

**Best practices:**
- Batch operations when possible
- Add delays between requests if creating many nodes
- Cache results when appropriate

---

## 🎨 Customization

### Change Colors:

Edit `colors` object in `miro-integration.js`:

```javascript
const colors = {
  foundation: '#667eea',    // Purple
  monetization: '#43e97b',  // Green
  positioning: '#f093fb',   // Pink
  content: '#4facfe',       // Blue
  quickWins: '#feca57',     // Yellow
  roadmap: '#764ba2'        // Dark Purple
};
```

### Add More Nodes:

```javascript
await createMindMapChildNode(
  accessToken,
  boardId,
  parentNodeId,
  'Your text here\n- Bullet point 1\n- Bullet point 2',
  '#colorCode'
);
```

### Change Layout:

Miro auto-layouts mind maps, but you can adjust node positions:

```javascript
const postData = {
  data: { content: text },
  position: {
    x: 100,  // Adjust X position
    y: 200   // Adjust Y position
  },
  style: { fillColor: color }
};
```

---

## 📚 Additional Resources

### Official Documentation:
- **Miro REST API**: https://developers.miro.com/reference/api-reference
- **Mind Map API**: https://developers.miro.com/docs/mind-maps
- **OAuth 2.0 Guide**: https://developers.miro.com/docs/getting-started-with-oauth
- **Quickstart Tutorial**: https://developers.miro.com/docs/rest-api-build-your-first-hello-world-app

### Community:
- **Miro Developer Forum**: https://community.miro.com/developer-platform-and-apis-57
- **API Status**: https://status.miro.com/

### Support:
- **Developer Support**: developers@miro.com
- **Documentation Feedback**: docs-feedback@miro.com

---

## 🔄 Workflow Integration

### Full Workflow:

```bash
# 1. Analyze client
# (Gather data: Instagram, YouTube, etc.)

# 2. Generate strategy
node generate-derek-mindmap.js

# 3. Create HTML mind map (local)
# → output/derek-rodriguez-mindmap.html

# 4. Push to Miro (shareable)
export MIRO_ACCESS_TOKEN="your_token"
node miro-integration.js

# 5. Share Miro link with client
# → https://miro.com/app/board/YOUR_BOARD_ID/
```

### Automation:

Create a combined script that does everything:

```javascript
// generate-and-push.js
const { generateMarkdownMindMap, generateHTMLMindMap } = require('./generate-derek-mindmap');
const { createBoard, createStrategyMindMap } = require('./miro-integration');

async function fullWorkflow() {
  // 1. Generate markdown
  const markdown = generateMarkdownMindMap();

  // 2. Generate HTML
  const html = generateHTMLMindMap(markdown, 'Derek Rodriguez');

  // 3. Push to Miro
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const board = await createBoard(accessToken, 'Derek Rodriguez Strategy', '18-month roadmap');
  await createStrategyMindMap(accessToken, board.id, strategy);

  console.log(`✅ All done! Miro board: ${board.viewLink}`);
}

fullWorkflow();
```

---

## ✅ Quick Reference

### Generate HTML Mind Map (Local):
```bash
node generate-derek-mindmap.js
# Output: output/derek-rodriguez-mindmap.html
```

### Push to Miro:
```bash
export MIRO_ACCESS_TOKEN="your_token"
node miro-integration.js
# Output: Miro board URL
```

### Both:
```bash
node generate-derek-mindmap.js && node miro-integration.js
```

---

## 💡 Tips & Tricks

1. **Test with Existing Board First**
   - Create a test board manually in Miro
   - Use `MIRO_BOARD_ID` env var to test without creating new boards

2. **Use Personal Token for Development**
   - Faster setup than OAuth
   - Fine for personal/team use

3. **HTML Fallback**
   - Always generate HTML version first
   - Use as backup if Miro API has issues

4. **Color Coding**
   - Use consistent colors across HTML and Miro
   - Makes strategy easy to scan

5. **Iterate Fast**
   - Test on small mind maps first
   - Add complexity gradually

---

## 🎉 You're Ready!

You now have automatic mind map generation both locally (HTML) and in Miro (collaborative).

**Next steps:**
1. Get your Miro access token
2. Run `node miro-integration.js`
3. Share the Miro board link with clients
4. Impress everyone with automated strategy visualization! 🚀

---

**Questions?** Check the troubleshooting section or Miro's developer docs.
