#!/usr/bin/env node

/**
 * Miro API Integration for Growth Strategy Mind Maps
 * Uses sticky notes and shapes (stable API) instead of experimental mind map nodes
 */

require('dotenv').config();
const https = require('https');

// Miro API Configuration
const MIRO_API_BASE = 'https://api.miro.com/v2';

/**
 * Make HTTP request to Miro API
 */
function makeRequest(method, path, accessToken, postData = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.miro.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (data) {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(parsed)}`));
            }
          } else {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({});
            } else {
              reject(new Error(`API Error ${res.statusCode}: No response data`));
            }
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (postData) {
      req.write(JSON.stringify(postData));
    }

    req.end();
  });
}

/**
 * Create a new Miro board
 */
async function createBoard(accessToken, name, description) {
  const postData = {
    name: name,
    description: description,
    policy: {
      permissionsPolicy: {
        collaborationToolsStartAccess: 'all_editors',
        copyAccess: 'anyone',
        sharingAccess: 'team_members_with_editing_rights'
      },
      sharingPolicy: {
        access: 'private',
        teamAccess: 'edit'
      }
    }
  };

  return makeRequest('POST', '/v2/boards', accessToken, postData);
}

/**
 * Create sticky note (works with stable API)
 */
async function createStickyNote(accessToken, boardId, content, x, y, color = 'light_yellow', width = 250) {
  const postData = {
    data: {
      content: content,
      shape: 'square'
    },
    style: {
      fillColor: color,
      textAlign: 'center',
      textAlignVertical: 'middle'
    },
    position: {
      x: x,
      y: y
    },
    geometry: {
      width: width
    }
  };

  return makeRequest('POST', `/v2/boards/${boardId}/sticky_notes`, accessToken, postData);
}

/**
 * Create shape (for connectors/structure)
 */
async function createShape(accessToken, boardId, content, x, y, color = '#667eea', width = 300) {
  const postData = {
    data: {
      content: content,
      shape: 'round_rectangle'
    },
    style: {
      fillColor: color,
      fontFamily: 'arial',
      fontSize: 14,
      textAlign: 'center',
      borderColor: '#1a1a1a',
      borderWidth: 2,
      color: '#ffffff'
    },
    position: {
      x: x,
      y: y
    },
    geometry: {
      width: width,
      height: 100
    }
  };

  return makeRequest('POST', `/v2/boards/${boardId}/shapes`, accessToken, postData);
}

/**
 * Create connector between items
 */
async function createConnector(accessToken, boardId, startItemId, endItemId, color = '#1a1a1a') {
  const postData = {
    startItem: {
      id: startItemId
    },
    endItem: {
      id: endItemId
    },
    style: {
      strokeColor: color,
      strokeWidth: 2
    },
    shape: 'curved'
  };

  return makeRequest('POST', `/v2/boards/${boardId}/connectors`, accessToken, postData);
}

/**
 * Convert our strategy structure to Miro board using sticky notes and shapes
 */
async function createStrategyBoard(accessToken, boardId, strategy) {
  console.log('🎨 Creating growth strategy board in Miro...\n');

  try {
    // Layout configuration
    const startX = 0;
    const startY = 0;
    const horizontalSpacing = 450;
    const verticalSpacing = 300;

    // Color scheme
    const colors = {
      central: '#667eea',
      foundation: '#4facfe',
      monetization: '#43e97b',
      beta: '#f093fb',
      scale: '#feca57',
      quickWins: '#ff6b6b',
      revenue: '#764ba2'
    };

    // Create central node (Main title)
    console.log('📍 Creating central node...');
    const centralNode = await createShape(
      accessToken,
      boardId,
      `${strategy.name}\n18-Month Growth Strategy`,
      startX,
      startY,
      colors.central,
      400
    );
    console.log(`✅ Central node created: ${centralNode.id}\n`);

    await sleep(300); // Rate limit protection

    // Create Phase 1: Foundation (Top Left)
    console.log('📍 Creating Phase 1: Foundation...');
    const phase1X = startX - horizontalSpacing * 1.5;
    const phase1Y = startY - verticalSpacing;

    const phase1 = await createStickyNote(
      accessToken,
      boardId,
      '📅 PHASE 1: Foundation\n(Months 1-6)\n\n🎯 Fix Positioning\n📱 Content Pivot\n📈 Grow to 15K',
      phase1X,
      phase1Y,
      'light_blue',
      300
    );
    await createConnector(accessToken, boardId, centralNode.id, phase1.id, colors.foundation);
    console.log('✅ Phase 1 created\n');

    await sleep(300);

    // Create Phase 2: First Monetization (Top)
    console.log('📍 Creating Phase 2: First Monetization...');
    const phase2X = startX;
    const phase2Y = startY - verticalSpacing * 1.2;

    const phase2 = await createStickyNote(
      accessToken,
      boardId,
      '💰 PHASE 2: First Monetization\n(Months 7-9)\n\nLow-Ticket: $97\n50-100 sales\nRevenue: $5K-$15K',
      phase2X,
      phase2Y,
      'light_green',
      300
    );
    await createConnector(accessToken, boardId, centralNode.id, phase2.id, colors.monetization);
    console.log('✅ Phase 2 created\n');

    await sleep(300);

    // Create Phase 3: Beta Launch (Top Right)
    console.log('📍 Creating Phase 3: Beta Launch...');
    const phase3X = startX + horizontalSpacing * 1.5;
    const phase3Y = startY - verticalSpacing;

    const phase3 = await createStickyNote(
      accessToken,
      boardId,
      '🚀 PHASE 3: Beta High-Ticket\n(Months 10-12)\n\nBeta: $3K-$4K\n5-10 clients\nRevenue: $17K-$35K',
      phase3X,
      phase3Y,
      'violet',
      300
    );
    await createConnector(accessToken, boardId, centralNode.id, phase3.id, colors.beta);
    console.log('✅ Phase 3 created\n');

    await sleep(300);

    // Create Phase 4: Scale (Right)
    console.log('📍 Creating Phase 4: Scale...');
    const phase4X = startX + horizontalSpacing * 1.8;
    const phase4Y = startY;

    const phase4 = await createStickyNote(
      accessToken,
      boardId,
      '📈 PHASE 4: Scale\n(Months 13-18)\n\nLaunch #1: $60K-$105K\nLaunch #2: $105K-$160K\nTotal: $225K-$385K',
      phase4X,
      phase4Y,
      'yellow',
      300
    );
    await createConnector(accessToken, boardId, centralNode.id, phase4.id, colors.scale);
    console.log('✅ Phase 4 created\n');

    await sleep(300);

    // Create Quick Wins (Bottom Left)
    console.log('📍 Creating Quick Wins...');
    const quickWinsX = startX - horizontalSpacing * 1.5;
    const quickWinsY = startY + verticalSpacing;

    const quickWins = await createStickyNote(
      accessToken,
      boardId,
      '⚡ Quick Wins (Week 1)\n\n✅ Update Instagram bio\n✅ Create framework\n✅ Add email capture\n✅ Launch LinkedIn',
      quickWinsX,
      quickWinsY,
      'red',
      300
    );
    await createConnector(accessToken, boardId, centralNode.id, quickWins.id, colors.quickWins);
    console.log('✅ Quick Wins created\n');

    await sleep(300);

    // Create Current State (Bottom)
    console.log('📍 Creating Current State...');
    const currentX = startX;
    const currentY = startY + verticalSpacing * 1.2;

    const current = await createStickyNote(
      accessToken,
      boardId,
      '📊 Current State\n\n4.5K Instagram (0.97% ER)\n1.1K YouTube\n~500 Email List\n\n⚠️ Not ready for high-ticket',
      currentX,
      currentY,
      'gray',
      300
    );
    await createConnector(accessToken, boardId, centralNode.id, current.id, '#1a1a1a');
    console.log('✅ Current State created\n');

    await sleep(300);

    // Create Revenue Projection (Bottom Right)
    console.log('📍 Creating Revenue Projection...');
    const revenueX = startX + horizontalSpacing * 1.5;
    const revenueY = startY + verticalSpacing;

    const revenue = await createStickyNote(
      accessToken,
      boardId,
      '💵 18-Month Revenue\n\nMonths 1-6: $0-$3K\nMonths 7-9: $11K-$30K\nMonths 10-12: $23K-$50K\nMonths 13-18: $195K-$325K\n\n✅ TOTAL: $225K-$385K',
      revenueX,
      revenueY,
      'light_yellow',
      300
    );
    await createConnector(accessToken, boardId, centralNode.id, revenue.id, colors.revenue);
    console.log('✅ Revenue Projection created\n');

    console.log('🎉 Strategy board successfully created in Miro!\n');
    return centralNode;

  } catch (error) {
    console.error('❌ Error creating strategy board:', error.message);
    throw error;
  }
}

/**
 * Sleep helper for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Miro Growth Strategy Board Generator\n');
  console.log('='.repeat(50) + '\n');

  // Check for access token
  const accessToken = process.env.MIRO_ACCESS_TOKEN;

  if (!accessToken) {
    console.error('❌ Error: MIRO_ACCESS_TOKEN not set\n');
    console.log('Setup instructions:\n');
    console.log('1. Create .env file:');
    console.log('   cp .env.example .env\n');
    console.log('2. Add your token to .env:');
    console.log('   MIRO_ACCESS_TOKEN=your_token_here\n');
    console.log('3. Get token from:');
    console.log('   https://miro.com/app/settings/user-profile/apps\n');
    console.log('For details: cat MIRO_SETUP.md\n');
    process.exit(1);
  }

  // Load strategy
  const strategy = {
    name: 'Derek Rodriguez',
    company: 'Alpha Ascension'
  };

  try {
    // Check if using existing board
    const boardId = process.env.MIRO_BOARD_ID;

    if (boardId) {
      console.log(`📋 Using existing board: ${boardId}\n`);
      await createStrategyBoard(accessToken, boardId, strategy);
      console.log(`\n✅ Done! View your strategy at: https://miro.com/app/board/${boardId}/\n`);
    } else {
      // Create new board
      console.log('📋 Creating new Miro board...\n');
      const board = await createBoard(
        accessToken,
        `${strategy.name} - Growth Strategy`,
        'Comprehensive 18-month growth roadmap'
      );
      console.log(`✅ Board created: ${board.id}\n`);
      console.log(`🔗 View board: ${board.viewLink}\n`);

      await sleep(500); // Let board initialize

      await createStrategyBoard(accessToken, board.id, strategy);
      console.log(`\n✅ Done! View your strategy at: ${board.viewLink}\n`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('- Verify MIRO_ACCESS_TOKEN is correct');
    console.error('- Check you have edit permissions on the board');
    console.error('- Try creating a new board (remove MIRO_BOARD_ID from .env)');
    console.error('- Check Miro API status: https://status.miro.com/');
    console.error('- Rate limit: wait 1 minute and try again\n');
    process.exit(1);
  }
}

// Run
if (require.main === module) {
  main();
}

module.exports = {
  createBoard,
  createStickyNote,
  createShape,
  createConnector,
  createStrategyBoard
};
