# Quick Start Guide 🚀

Get up and running with Growth Strategy Mind Map Generator in 5 minutes!

---

## 🎯 What You'll Get

Two ways to create mind maps:

1. **HTML Mind Map** (Local, interactive)
   - Opens in browser
   - Zoom, pan, expand/collapse
   - Perfect for personal use

2. **Miro Mind Map** (Cloud, collaborative) 🔥
   - Automatically created in Miro
   - Share link with clients
   - Edit together in real-time
   - Professional presentation

---

## ⚡ Option 1: HTML Mind Map (Easiest)

### Step 1: Generate

```bash
cd tools/mindmap-generator
node generate-derek-mindmap.js
```

### Step 2: View

Open in browser:
```bash
open output/derek-rodriguez-mindmap.html
# or just double-click the file
```

**Done!** 🎉 You have an interactive mind map.

---

## 🔥 Option 2: Miro Mind Map (Best for Clients)

### Step 1: Get Miro Token (2 minutes)

1. Go to: https://miro.com/app/settings/user-profile/apps
2. Click "Create new app"
3. Name: "Mind Map Generator"
4. Click "Create"
5. Copy your access token
6. **Save it!** (You won't see it again)

### Step 2: Setup Environment (30 seconds)

```bash
cd tools/mindmap-generator

# Create .env file
cp .env.example .env

# Edit .env and add your token
# Replace "your_miro_access_token_here" with your actual token
```

Your `.env` should look like:
```
MIRO_ACCESS_TOKEN=your_actual_token_goes_here
```

### Step 3: Generate (10 seconds)

```bash
node miro-integration.js
```

**Output:**
```
🚀 Miro Mind Map Generator
📋 Creating new Miro board...
✅ Board created!
🎨 Creating mind map in Miro...
✅ Done! View at: https://miro.com/app/board/YOUR_BOARD_ID/
```

### Step 4: Share with Client

Copy the Miro link and send to your client!

**Done!** 🎉 You have a shareable, collaborative mind map in Miro.

---

## 🎨 Full Workflow (Both Options)

### For Each New Client:

```bash
cd tools/mindmap-generator

# 1. Generate HTML (local backup)
node generate-derek-mindmap.js

# 2. Generate Miro (for client sharing)
node miro-integration.js

# 3. You now have:
# - output/derek-rodriguez-mindmap.html (local)
# - Miro board link (shareable)
```

**Time:** ~30 seconds per client

---

## 📋 Complete Example (Derek Rodriguez)

### Analysis Data You Have:

```
Client: Derek Rodriguez
Instagram: 4.5K followers, 0.97% engagement
YouTube: 1.1K subscribers
Email: ~500
Current offers: Free training only
```

### What You Generate:

1. **Executive Summary** (10 pages)
   - Current state analysis
   - Critical gaps
   - 18-month roadmap
   - Revenue projections

2. **HTML Mind Map** (Interactive)
   - All strategy phases
   - Action items with timelines
   - Quick wins highlighted

3. **Miro Mind Map** (Shareable)
   - Same content as HTML
   - Client can view/comment
   - Professional presentation

### How to Present to Client:

**Option A: Show HTML Mind Map on Screen**
```bash
open output/derek-rodriguez-mindmap.html
# Share screen on Zoom/Meet
# Click through the strategy
```

**Option B: Send Miro Link**
```
Email: "Hey Derek, I created a complete growth strategy for you.
Check it out here: [Miro Link]

This shows your current position, critical gaps, and a realistic
18-month roadmap to $225K-$385K revenue.

Let's discuss on our next call!"
```

**Option C: Send Executive Summary + Miro**
```
Attach: derek-executive-summary.pdf
Link: Miro board
Message: "Here's your complete analysis (PDF) and interactive
strategy map (Miro). Review before our call!"
```

---

## 🛠️ Customization

### Change Client Data:

Edit `generate-derek-mindmap.js`:

```javascript
const derekAnalysis = {
  name: "Client Name",
  company: "Company Name",
  currentState: {
    instagram: { followers: "10K", engagement: "2.5%" },
    youtube: { subscribers: "5K" },
    // ... customize
  }
};
```

### Change Colors:

Edit `miro-integration.js`:

```javascript
const colors = {
  foundation: '#667eea',    // Purple
  monetization: '#43e97b',  // Green - change this!
  positioning: '#f093fb',   // Pink
  content: '#4facfe',       // Blue
  quickWins: '#feca57',     // Yellow
  roadmap: '#764ba2'        // Dark Purple
};
```

---

## ⚠️ Troubleshooting

### "MIRO_ACCESS_TOKEN not set"

**Fix:**
```bash
# Make sure .env file exists
cp .env.example .env

# Edit .env and add your token
nano .env  # or use any text editor
```

### Miro board not opening?

**Check:**
1. Token is valid (not expired)
2. Internet connection working
3. Miro.com is accessible

### HTML mind map looks weird?

**Fix:**
- Use modern browser (Chrome, Firefox, Safari, Edge)
- Enable JavaScript
- Try refreshing the page

---

## 💡 Tips & Tricks

### 1. Use Existing Miro Board

Instead of creating new board each time:

```bash
# Get board ID from URL: https://miro.com/app/board/ABC123/
export MIRO_BOARD_ID="ABC123"
node miro-integration.js
```

This adds mind map to existing board.

### 2. Batch Generate Multiple Clients

Create a script:

```bash
#!/bin/bash
# generate-all.sh

clients=("derek" "sarah" "john")

for client in "${clients[@]}"; do
  echo "Generating for $client..."
  node generate-${client}-mindmap.js
  node miro-integration.js
  echo "Done with $client!"
done
```

### 3. Add Your Branding

Edit HTML template in `generate-mindmap.js`:

```javascript
.header {
  background: linear-gradient(135deg, #YOUR_COLOR_1, #YOUR_COLOR_2);
}
```

### 4. Export to PDF

From HTML:

1. Open HTML in browser
2. Right-click → Print
3. Destination: "Save as PDF"
4. Done!

---

## 📚 Next Steps

Once you're comfortable:

1. **Read Full Docs:**
   - `README.md` - Complete feature list
   - `MIRO_SETUP.md` - Detailed Miro setup guide
   - `derek-analysis.md` - Example full analysis

2. **Customize Templates:**
   - Modify mind map structure
   - Change colors and branding
   - Add your own frameworks

3. **Automate More:**
   - Create templates for different niches
   - Build client intake forms
   - Set up automated delivery

---

## ✅ Checklist

Before delivering to client:

- [ ] Generated HTML mind map
- [ ] Created Miro board
- [ ] Tested Miro link (opens correctly)
- [ ] Reviewed all strategy content
- [ ] Checked for typos/errors
- [ ] Prepared executive summary
- [ ] Ready to present!

---

## 🎯 Summary

**To generate mind maps for Derek Rodriguez:**

```bash
# Quick version (HTML only)
node generate-derek-mindmap.js
open output/derek-rodriguez-mindmap.html

# Full version (HTML + Miro)
node generate-derek-mindmap.js
node miro-integration.js

# That's it! 🎉
```

**Time investment:**
- First setup: 5 minutes
- Each new client after: 30 seconds

**Value delivered:**
- Professional strategy visualization
- Interactive, shareable mind map
- Complete analysis document
- Impressed clients! 🚀

---

**Questions?** Check `MIRO_SETUP.md` for detailed troubleshooting.

**Ready to impress your clients?** Generate your first mind map now! 🔥
