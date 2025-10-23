#!/usr/bin/env node

/**
 * Miro Integration - SIMPLIFIED VERSION
 * Uses ONLY sticky notes (most reliable API)
 */

require('dotenv').config();
const https = require('https');

function makeRequest(method, path, accessToken, postData = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.miro.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
}

async function createStickyNote(accessToken, boardId, content, x, y, color, width = 300) {
  return makeRequest('POST', `/v2/boards/${boardId}/sticky_notes`, accessToken, {
    data: { content: `<p>${content}</p>`, shape: 'square' },
    style: { fillColor: color },
    position: { x, y },
    geometry: { width }
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚀 Miro Strategy Board Generator (Simple)\n');
  console.log('='.repeat(50) + '\n');

  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const boardId = process.env.MIRO_BOARD_ID;

  if (!accessToken || !boardId) {
    console.error('❌ Error: Create .env file with:\n');
    console.error('MIRO_ACCESS_TOKEN=your_token');
    console.error('MIRO_BOARD_ID=your_board_id\n');
    process.exit(1);
  }

  console.log(`📋 Board: ${boardId}\n`);

  try {
    // Layout
    const spacing = 400;

    // Central node
    console.log('📍 Creating central sticky...');
    await createStickyNote(
      accessToken, boardId,
      '<b>Derek Rodriguez</b><br>18-Month Growth Strategy',
      0, 0, 'blue', 350
    );
    console.log('✅ Done\n');
    await sleep(500);

    // Phase 1
    console.log('📍 Creating Phase 1...');
    await createStickyNote(
      accessToken, boardId,
      '<b>📅 PHASE 1: Foundation</b><br>(Months 1-6)<br><br>🎯 Fix Positioning<br>📱 Content Pivot<br>📈 Grow to 15K',
      -spacing * 1.5, -300, 'light_blue', 300
    );
    console.log('✅ Done\n');
    await sleep(500);

    // Phase 2
    console.log('📍 Creating Phase 2...');
    await createStickyNote(
      accessToken, boardId,
      '<b>💰 PHASE 2: First Monetization</b><br>(Months 7-9)<br><br>Low-Ticket: $97<br>50-100 sales<br>Revenue: $5K-$15K',
      0, -360, 'light_green', 300
    );
    console.log('✅ Done\n');
    await sleep(500);

    // Phase 3
    console.log('📍 Creating Phase 3...');
    await createStickyNote(
      accessToken, boardId,
      '<b>🚀 PHASE 3: Beta High-Ticket</b><br>(Months 10-12)<br><br>Beta: $3K-$4K<br>5-10 clients<br>Revenue: $17K-$35K',
      spacing * 1.5, -300, 'violet', 300
    );
    console.log('✅ Done\n');
    await sleep(500);

    // Phase 4
    console.log('📍 Creating Phase 4...');
    await createStickyNote(
      accessToken, boardId,
      '<b>📈 PHASE 4: Scale</b><br>(Months 13-18)<br><br>Launch #1: $60K-$105K<br>Launch #2: $105K-$160K<br><b>Total: $225K-$385K</b>',
      spacing * 1.8, 0, 'yellow', 300
    );
    console.log('✅ Done\n');
    await sleep(500);

    // Quick Wins
    console.log('📍 Creating Quick Wins...');
    await createStickyNote(
      accessToken, boardId,
      '<b>⚡ Quick Wins (Week 1)</b><br><br>✅ Update Instagram bio<br>✅ Create framework<br>✅ Add email capture<br>✅ Launch LinkedIn',
      -spacing * 1.5, 300, 'red', 300
    );
    console.log('✅ Done\n');
    await sleep(500);

    // Current State
    console.log('📍 Creating Current State...');
    await createStickyNote(
      accessToken, boardId,
      '<b>📊 Current State</b><br><br>4.5K Instagram (0.97% ER)<br>1.1K YouTube<br>~500 Email List<br><br>⚠️ Not ready for high-ticket',
      0, 360, 'gray', 300
    );
    console.log('✅ Done\n');
    await sleep(500);

    // Revenue Projection
    console.log('📍 Creating Revenue Projection...');
    await createStickyNote(
      accessToken, boardId,
      '<b>💵 18-Month Revenue</b><br><br>Months 1-6: $0-$3K<br>Months 7-9: $11K-$30K<br>Months 10-12: $23K-$50K<br>Months 13-18: $195K-$325K<br><br><b>✅ TOTAL: $225K-$385K</b>',
      spacing * 1.5, 300, 'light_yellow', 300
    );
    console.log('✅ Done\n');

    console.log('🎉 Strategy board successfully created!\n');
    console.log(`🔗 View: https://miro.com/app/board/${boardId}/\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPossible issues:');
    console.error('- Token needs "boards:write" permission');
    console.error('- Board ID might be wrong');
    console.error('- Network/firewall blocking api.miro.com');
    console.error('\nGet new token: https://miro.com/app/settings/user-profile/apps\n');
    process.exit(1);
  }
}

main();
