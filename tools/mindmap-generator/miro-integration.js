#!/usr/bin/env node

/**
 * Miro API Integration for Growth Strategy Mind Maps
 * Automatically creates mind maps in Miro boards via REST API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Miro API Configuration
const MIRO_API_BASE = 'https://api.miro.com/v2';

/**
 * Make HTTP request to Miro API
 */
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
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
  const options = {
    hostname: 'api.miro.com',
    path: '/v2/boards',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

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

  return makeRequest(options, postData);
}

/**
 * Create mind map central node
 */
async function createMindMapCentralNode(accessToken, boardId, text) {
  const options = {
    hostname: 'api.miro.com',
    path: `/v2/boards/${boardId}/mindmap_nodes`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  const postData = {
    data: {
      content: text
    },
    position: {
      x: 0,
      y: 0
    },
    style: {
      fillColor: '#667eea',
      textAlign: 'center'
    }
  };

  return makeRequest(options, postData);
}

/**
 * Create child mind map node
 */
async function createMindMapChildNode(accessToken, boardId, parentId, text, color = '#764ba2') {
  const options = {
    hostname: 'api.miro.com',
    path: `/v2/boards/${boardId}/mindmap_nodes`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  const postData = {
    data: {
      content: text
    },
    parent: {
      id: parentId
    },
    style: {
      fillColor: color,
      textAlign: 'left'
    }
  };

  return makeRequest(options, postData);
}

/**
 * Convert our strategy structure to Miro mind map
 */
async function createStrategyMindMap(accessToken, boardId, strategy) {
  console.log('🎨 Creating mind map in Miro...\n');

  try {
    // Create central node
    console.log('📍 Creating central node...');
    const centralNode = await createMindMapCentralNode(
      accessToken,
      boardId,
      `${strategy.name}\nGrowth Strategy`
    );
    console.log(`✅ Central node created: ${centralNode.id}\n`);

    const colors = {
      foundation: '#667eea',
      monetization: '#43e97b',
      positioning: '#f093fb',
      content: '#4facfe',
      quickWins: '#feca57',
      roadmap: '#764ba2'
    };

    // Create Phase 1: Foundation
    console.log('📍 Creating Phase 1: Foundation...');
    const phase1Node = await createMindMapChildNode(
      accessToken,
      boardId,
      centralNode.id,
      '📅 PHASE 1: Foundation (Months 1-6)',
      colors.foundation
    );

    await createMindMapChildNode(
      accessToken,
      boardId,
      phase1Node.id,
      '🎯 Positioning Overhaul\n- Fix weak bio\n- Create signature framework\n- Document case studies',
      colors.foundation
    );

    await createMindMapChildNode(
      accessToken,
      boardId,
      phase1Node.id,
      '📱 Content Strategy Pivot\n- 70% Educational\n- 20% Authority\n- 10% Personal',
      colors.foundation
    );

    await createMindMapChildNode(
      accessToken,
      boardId,
      phase1Node.id,
      '📈 Audience Growth\n- 4.5K → 15K social\n- 500 → 3K email list\n- Collaborations & podcasts',
      colors.foundation
    );
    console.log('✅ Phase 1 created\n');

    // Create Phase 2: First Monetization
    console.log('📍 Creating Phase 2: First Monetization...');
    const phase2Node = await createMindMapChildNode(
      accessToken,
      boardId,
      centralNode.id,
      '💰 PHASE 2: First Monetization (Months 7-9)',
      colors.monetization
    );

    await createMindMapChildNode(
      accessToken,
      boardId,
      phase2Node.id,
      'Low-Ticket Offer: $97\n- Agency Systems Toolkit\n- 50-100 sales\n- $5K-$15K revenue',
      colors.monetization
    );
    console.log('✅ Phase 2 created\n');

    // Create Phase 3: Beta High-Ticket
    console.log('📍 Creating Phase 3: Beta Launch...');
    const phase3Node = await createMindMapChildNode(
      accessToken,
      boardId,
      centralNode.id,
      '🚀 PHASE 3: Beta High-Ticket (Months 10-12)',
      colors.positioning
    );

    await createMindMapChildNode(
      accessToken,
      boardId,
      phase3Node.id,
      'Beta Program: $3K-$4K\n- 12-week group coaching\n- 5-10 clients\n- $17K-$35K revenue',
      colors.positioning
    );
    console.log('✅ Phase 3 created\n');

    // Create Phase 4: Scale
    console.log('📍 Creating Phase 4: Scale...');
    const phase4Node = await createMindMapChildNode(
      accessToken,
      boardId,
      centralNode.id,
      '📈 PHASE 4: Scale (Months 13-18)',
      colors.content
    );

    await createMindMapChildNode(
      accessToken,
      boardId,
      phase4Node.id,
      'Launch #1: $6K-$7K\n- 10-15 clients\n- $60K-$105K',
      colors.content
    );

    await createMindMapChildNode(
      accessToken,
      boardId,
      phase4Node.id,
      'Launch #2: $7K-$8K\n- 15-20 clients\n- $105K-$160K',
      colors.content
    );
    console.log('✅ Phase 4 created\n');

    // Create Quick Wins branch
    console.log('📍 Creating Quick Wins...');
    const quickWinsNode = await createMindMapChildNode(
      accessToken,
      boardId,
      centralNode.id,
      '⚡ Quick Wins (0-3 Months)',
      colors.quickWins
    );

    await createMindMapChildNode(
      accessToken,
      boardId,
      quickWinsNode.id,
      '1. Update Instagram bio (15 min)\n2. Create signature framework (1 day)\n3. Add email capture to YouTube (1 hr)\n4. Launch LinkedIn (2-3 hrs)',
      colors.quickWins
    );
    console.log('✅ Quick Wins created\n');

    // Create 18-Month Revenue Projection
    console.log('📍 Creating Revenue Projection...');
    const revenueNode = await createMindMapChildNode(
      accessToken,
      boardId,
      centralNode.id,
      '💵 18-Month Revenue Projection',
      colors.roadmap
    );

    await createMindMapChildNode(
      accessToken,
      boardId,
      revenueNode.id,
      'Months 1-6: $0-$3K\nMonths 7-9: $11K-$30K\nMonths 10-12: $23K-$50K\nMonths 13-18: $195K-$325K\n\nTOTAL: $225K-$385K',
      colors.roadmap
    );
    console.log('✅ Revenue Projection created\n');

    console.log('🎉 Mind map successfully created in Miro!\n');
    return centralNode;

  } catch (error) {
    console.error('❌ Error creating mind map:', error.message);
    throw error;
  }
}

/**
 * Main function - Create board and mind map
 */
async function main() {
  console.log('🚀 Miro Mind Map Generator\n');
  console.log('=' . repeat(50) + '\n');

  // Check for access token
  const accessToken = process.env.MIRO_ACCESS_TOKEN;

  if (!accessToken) {
    console.error('❌ Error: MIRO_ACCESS_TOKEN environment variable not set\n');
    console.log('Please follow these steps:\n');
    console.log('1. Go to https://miro.com/app/settings/user-profile/apps');
    console.log('2. Create a new app or use existing');
    console.log('3. Copy your access token');
    console.log('4. Set environment variable:');
    console.log('   export MIRO_ACCESS_TOKEN="your_token_here"\n');
    console.log('For detailed instructions, see MIRO_SETUP.md\n');
    process.exit(1);
  }

  // Load Derek's strategy
  const derekStrategy = {
    name: 'Derek Rodriguez',
    company: 'Alpha Ascension',
    niche: 'Agency Growth Expert'
  };

  try {
    // Option 1: Use existing board
    const boardId = process.env.MIRO_BOARD_ID;

    if (boardId) {
      console.log(`📋 Using existing board: ${boardId}\n`);
      await createStrategyMindMap(accessToken, boardId, derekStrategy);
      console.log(`\n✅ Done! View your mind map at: https://miro.com/app/board/${boardId}/\n`);
    } else {
      // Option 2: Create new board
      console.log('📋 Creating new Miro board...\n');
      const board = await createBoard(
        accessToken,
        `${derekStrategy.name} - Growth Strategy`,
        'Comprehensive 18-month growth roadmap and strategy'
      );
      console.log(`✅ Board created: ${board.id}\n`);
      console.log(`🔗 View board: ${board.viewLink}\n`);

      await createStrategyMindMap(accessToken, board.id, derekStrategy);
      console.log(`\n✅ Done! View your mind map at: ${board.viewLink}\n`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('- Check your MIRO_ACCESS_TOKEN is valid');
    console.error('- Ensure you have permissions to create boards');
    console.error('- Mind map API is experimental - may have limitations');
    console.error('- Check Miro API status: https://status.miro.com/\n');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  createBoard,
  createMindMapCentralNode,
  createMindMapChildNode,
  createStrategyMindMap
};
