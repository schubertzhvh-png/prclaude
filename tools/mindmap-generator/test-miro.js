#!/usr/bin/env node

/**
 * Test Miro API - Create simple sticky note
 * Minimal test to verify token works
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
        console.log('Status:', res.statusCode);
        console.log('Response:', data);

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
      const jsonData = JSON.stringify(postData);
      console.log('Sending:', jsonData);
      req.write(jsonData);
    }

    req.end();
  });
}

async function testStickyNote() {
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const boardId = process.env.MIRO_BOARD_ID;

  if (!accessToken || !boardId) {
    console.error('Error: Set MIRO_ACCESS_TOKEN and MIRO_BOARD_ID in .env');
    process.exit(1);
  }

  console.log('🧪 Testing Miro API...\n');
  console.log('Token:', accessToken.substring(0, 20) + '...');
  console.log('Board:', boardId);
  console.log('\n📝 Creating test sticky note...\n');

  try {
    const result = await makeRequest(
      'POST',
      `/v2/boards/${boardId}/sticky_notes`,
      accessToken,
      {
        data: {
          content: '<p>Test from API!</p>',
          shape: 'square'
        },
        style: {
          fillColor: 'light_yellow'
        },
        position: {
          x: 0,
          y: 0
        }
      }
    );

    console.log('\n✅ Success! Sticky note created:\n', JSON.stringify(result, null, 2));
    console.log('\n🔗 View board: https://miro.com/app/board/' + boardId + '/');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nDebug info:');
    console.error('- Check token has boards:write permission');
    console.error('- Verify board ID is correct');
    console.error('- Try visiting: https://miro.com/app/settings/user-profile/apps');
  }
}

testStickyNote();
