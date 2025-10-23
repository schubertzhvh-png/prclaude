#!/usr/bin/env node

/**
 * Derek Rodriguez - PURE VALUE Mind Map
 * Growth opportunities and honest assessment WITHOUT pitching our services
 * Just showing him what HE needs to improve and HOW
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

async function createSticky(accessToken, boardId, content, x, y, color, width = 280) {
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
  console.log('🎯 Derek Rodriguez - Growth Opportunity Map\n');
  console.log('Pure value analysis - showing opportunities & improvements\n');
  console.log('='.repeat(60) + '\n');

  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const boardId = process.env.MIRO_BOARD_ID;

  if (!accessToken || !boardId) {
    console.error('❌ Error: Set MIRO_ACCESS_TOKEN and MIRO_BOARD_ID in .env\n');
    process.exit(1);
  }

  console.log(`📋 Board: ${boardId}\n`);

  try {
    let count = 0;
    const total = 35;

    const centerX = 0;
    const centerY = 0;
    const colSpacing = 450;
    const rowSpacing = 320;

    // ============= CENTRAL NODE =============
    console.log(`[${++count}/${total}] 📍 Central node...`);
    await createSticky(accessToken, boardId,
      '<b style="font-size:18px">Derek Rodriguez</b><br><b>Growth Opportunity Analysis</b><br><br>Agency Growth Expert | Alpha Ascension<br><br>Honest assessment of current position<br>& opportunities for growth',
      centerX, centerY, 'blue', 380
    );
    await sleep(400);

    // ============= CURRENT STATE - STRENGTHS (Top Left) =============
    console.log(`[${++count}/${total}] ✅ Current Strengths...`);
    await createSticky(accessToken, boardId,
      '<b>✅ CURRENT STRENGTHS</b><br><br><b>What\'s Working:</b><br>• Good niche (agencies need help)<br>• Strong brand name (Alpha Ascension)<br>• Infrastructure exists (lead magnet)<br>• Multi-platform presence<br>• Understanding of market<br><br><b>Leverage These!</b>',
      centerX - colSpacing * 1.8, centerY - rowSpacing * 1.5, 'light_green', 320
    );
    await sleep(400);

    // ============= CURRENT STATE - WEAKNESSES (Top Right) =============
    console.log(`[${++count}/${total}] ⚠️ Areas to Improve...`);
    await createSticky(accessToken, boardId,
      '<b>⚠️ AREAS TO IMPROVE</b><br><br><b>Current Metrics:</b><br>• Instagram: 4,500 (small for niche)<br>• Engagement: 0.97% (below 2-3% avg)<br>• YouTube: 1,100 subs<br>• Email: ~500 (need 3K+ for launches)<br><br><b>The Gap:</b><br>Bio says "scale to 6-7 figures"<br>but metrics don\'t support authority yet',
      centerX + colSpacing * 1.8, centerY - rowSpacing * 1.5, 'red', 320
    );
    await sleep(400);

    // ============= POSITIONING ISSUES (Left Top) =============
    console.log(`[${++count}/${total}] 🎯 Positioning Analysis...`);
    await createSticky(accessToken, boardId,
      '<b>🎯 POSITIONING ISSUES</b><br><br><b>Current Bio:</b><br>"Some Would Say I Scale Businesses"<br><br><b>Problems:</b><br>❌ "Some Would Say" = not confident<br>❌ "Scale Businesses" = too vague<br>❌ No specific transformation<br>❌ Generic "Business Consultant"<br><br><b>Missing:</b><br>• Social proof (where are results?)<br>• Signature framework<br>• Case studies visible',
      centerX - colSpacing * 1.8, centerY - rowSpacing * 0.3, 'orange', 320
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Positioning Fix...`);
    await createSticky(accessToken, boardId,
      '<b>💡 HOW TO FIX POSITIONING</b><br><br><b>Better Bio Example:</b><br>"I Help Agency Owners Scale to $1M+<br>While Working 20 Hours/Week"<br><br><b>Why Better:</b><br>✅ Specific outcome ($1M+)<br>✅ Specific benefit (20 hrs/week)<br>✅ Confident tone<br>✅ Clear value prop<br><br><b>Action: Update bio this week!</b>',
      centerX - colSpacing * 2.5, centerY - rowSpacing * 0.3, 'light_green', 300
    );
    await sleep(400);

    // ============= CONTENT ISSUES (Left Middle) =============
    console.log(`[${++count}/${total}] 📱 Content Analysis...`);
    await createSticky(accessToken, boardId,
      '<b>📱 CONTENT ANALYSIS</b><br><br><b>Current Mix:</b><br>• Lifestyle content<br>• Motivation<br>• Some business advice<br><br><b>Problem:</b><br>Too scattered - followers confused<br>"Is he influencer or expert?"<br><br><b>Result:</b><br>0.97% engagement (should be 2-3%)<br>Content doesn\'t build authority',
      centerX - colSpacing * 1.8, centerY + rowSpacing * 0.5, 'orange', 320
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Content Fix...`);
    await createSticky(accessToken, boardId,
      '<b>💡 CONTENT STRATEGY FIX</b><br><br><b>New 70/20/10 Rule:</b><br>• 70% Educational (agency tips, systems)<br>• 20% Authority (frameworks, insights)<br>• 10% Personal (strategic only)<br><br><b>Instagram:</b><br>5-7 Reels/week (pure value)<br><br><b>YouTube:</b><br>1-2 videos/week (10-20 min)<br>SEO: "how to scale agency"',
      centerX - colSpacing * 2.5, centerY + rowSpacing * 0.5, 'light_green', 300
    );
    await sleep(400);

    // ============= AUDIENCE SIZE ISSUE (Right Top) =============
    console.log(`[${++count}/${total}] 📊 Audience Gap...`);
    await createSticky(accessToken, boardId,
      '<b>📊 AUDIENCE SIZE GAP</b><br><br><b>Current:</b><br>4,500 Instagram + 1,100 YouTube<br>= 5,600 total reach<br><br><b>Problem for High-Ticket:</b><br>Need 15K-25K for successful launch<br><br><b>Reality Check:</b><br>Can\'t sell $5K+ program to 4.5K<br>with 0.97% engagement<br><br>Math: 4,500 × 0.97% × 30% = ~13 buyers',
      centerX + colSpacing * 1.8, centerY - rowSpacing * 0.3, 'orange', 320
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Growth Tactics...`);
    await createSticky(accessToken, boardId,
      '<b>💡 HOW TO GROW AUDIENCE</b><br><br><b>Tactics That Work:</b><br>• Collaborations (5-10 partners)<br>   +1K-5K per collab<br>• Podcast interviews (15-20)<br>   +200-500 per interview<br>• LinkedIn presence (agencies are there!)<br>• Consistent valuable content<br>• Lead magnets in every video<br><br><b>Timeline:</b> 6-9 months to 15K',
      centerX + colSpacing * 2.5, centerY - rowSpacing * 0.3, 'light_green', 300
    );
    await sleep(400);

    // ============= EMAIL LIST ISSUE (Right Middle) =============
    console.log(`[${++count}/${total}] 📧 Email List Gap...`);
    await createSticky(accessToken, boardId,
      '<b>📧 EMAIL LIST CRITICAL GAP</b><br><br><b>Current:</b> ~500 subscribers<br><b>Needed:</b> 3,000-5,000 minimum<br><br><b>Why Critical:</b><br>Email list = launch success<br>Industry benchmark:<br>• 3K list = 50-100 buyers<br>• 500 list = 8-15 buyers (not enough!)<br><br><b>You can\'t launch without list!</b>',
      centerX + colSpacing * 1.8, centerY + rowSpacing * 0.5, 'red', 320
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → List Building...`);
    await createSticky(accessToken, boardId,
      '<b>💡 HOW TO BUILD EMAIL LIST</b><br><br><b>Lead Magnets:</b><br>• "Agency Systems Audit" (PDF)<br>• "Profitable Agency Calculator"<br>• "$1M Agency Roadmap"<br><br><b>Placement:</b><br>• YouTube video descriptions<br>• Instagram bio link<br>• LinkedIn posts<br><br><b>Goal:</b> 100-200 new emails/week',
      centerX + colSpacing * 2.5, centerY + rowSpacing * 0.5, 'light_green', 300
    );
    await sleep(400);

    // ============= SOCIAL PROOF ISSUE (Bottom Left) =============
    console.log(`[${++count}/${total}] 🏆 Social Proof Gap...`);
    await createSticky(accessToken, boardId,
      '<b>🏆 SOCIAL PROOF MISSING</b><br><br><b>Current:</b><br>No visible case studies<br>No testimonials on profile<br>No client results shown<br><br><b>Problem:</b><br>How do people know you deliver?<br>"Helped agencies scale" - where\'s proof?<br><br><b>Without proof = no trust<br>No trust = no sales</b>',
      centerX - colSpacing * 1.8, centerY + rowSpacing * 1.5, 'orange', 320
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Build Proof...`);
    await createSticky(accessToken, boardId,
      '<b>💡 HOW TO BUILD SOCIAL PROOF</b><br><br><b>Actions:</b><br>• Interview 5 past clients<br>• Get video testimonials (60-90 sec)<br>• Document before/after metrics<br>• Create case study posts<br>• Add to Instagram highlights<br><br><b>Format:</b><br>"Helped [Client] go from [Before]<br>to [After] in [Timeframe]"',
      centerX - colSpacing * 2.5, centerY + rowSpacing * 1.5, 'light_green', 300
    );
    await sleep(400);

    // ============= MONETIZATION OPPORTUNITIES (Center Bottom) =============
    console.log(`[${++count}/${total}] 💰 Monetization Opportunities...`);
    await createSticky(accessToken, boardId,
      '<b>💰 MONETIZATION OPPORTUNITIES</b><br><br><b>Current:</b> Free training only<br><b>Missing:</b> Product ladder<br><br><b>Market Research:</b><br>Competitors charge:<br>• Karl Sakas: $10K+ consulting<br>• Parakeeto: $1K-$10K programs<br>• GYDA: $5K-$15K masterminds<br><br><b>You\'re leaving money on table!</b>',
      centerX, centerY + rowSpacing * 1.8, 'light_yellow', 340
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Product Ladder...`);
    await createSticky(accessToken, boardId,
      '<b>💡 POTENTIAL PRODUCT LADDER</b><br><br><b>Low-Ticket ($47-$97):</b><br>Agency templates, checklists, SOPs<br>Entry point for cold audience<br><br><b>Mid-Ticket ($497-$1,997):</b><br>Self-paced course + community<br>For warm audience<br><br><b>High-Ticket ($3K-$10K):</b><br>Group coaching or mastermind<br>For hot, qualified leads<br><br><b>When ready (not now!)</b>',
      centerX - colSpacing * 0.8, centerY + rowSpacing * 1.8, 'light_green', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Timing Reality...`);
    await createSticky(accessToken, boardId,
      '<b>⏰ TIMING REALITY CHECK</b><br><br><b>Can you launch high-ticket NOW?</b><br>❌ NO - here\'s why:<br><br>• Audience too small (4.5K vs 15K needed)<br>• Email list tiny (500 vs 3K needed)<br>• No visible social proof<br>• Low engagement = weak trust<br><br><b>Build foundation first!</b><br>Then launch successfully',
      centerX + colSpacing * 0.8, centerY + rowSpacing * 1.8, 'red', 300
    );
    await sleep(400);

    // ============= PLATFORM-SPECIFIC INSIGHTS (Top Center) =============
    console.log(`[${++count}/${total}] 📱 Instagram Insights...`);
    await createSticky(accessToken, boardId,
      '<b>📱 INSTAGRAM OPPORTUNITIES</b><br><br><b>Current Performance:</b><br>• 9 Reels, avg 1,743 views (38% reach - OK)<br>• But 0.97% ER on posts (LOW)<br><br><b>What This Means:</b><br>Reels get views but don\'t convert<br>to engaged followers<br><br><b>Fix:</b><br>End every Reel with strong CTA<br>"Follow for agency tips"',
      centerX - colSpacing * 0.6, centerY - rowSpacing * 2, 'violet', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}] 📺 YouTube Insights...`);
    await createSticky(accessToken, boardId,
      '<b>📺 YOUTUBE UNTAPPED POTENTIAL</b><br><br><b>Current:</b> 1,100 subs<br><b>Opportunity:</b> HUGE!<br><br><b>Why:</b><br>• Agency owners search YouTube<br>• Long-form = authority building<br>• SEO brings passive traffic<br><br><b>Keywords to Target:</b><br>"how to scale agency"<br>"agency profit margins"<br>"agency systems"',
      centerX, centerY - rowSpacing * 2, 'red', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}] 💼 LinkedIn Critical...`);
    await createSticky(accessToken, boardId,
      '<b>💼 LINKEDIN = CRITICAL MISS</b><br><br><b>Problem:</b><br>You\'re not on LinkedIn!<br><br><b>But:</b><br>Agency owners are B2B professionals<br>They\'re on LinkedIn, not just IG!<br><br><b>Opportunity:</b><br>Less competition than Instagram<br>Higher intent audience<br>Direct access to decision-makers<br><br><b>Start LinkedIn NOW!</b>',
      centerX + colSpacing * 0.6, centerY - rowSpacing * 2, 'blue', 300
    );
    await sleep(400);

    // ============= COMPETITIVE INSIGHTS (Far Right) =============
    console.log(`[${++count}/${total}] 🎯 Market Position...`);
    await createSticky(accessToken, boardId,
      '<b>🎯 YOUR MARKET POSITION</b><br><br><b>Good News:</b><br>• Right niche (agencies have money)<br>• Market is growing<br>• Demand for help is high<br><br><b>Challenge:</b><br>• Saturated space (many coaches)<br>• Need clear differentiation<br><br><b>Your Edge:</b><br>Focus on "freedom" not just revenue<br>"Scale to $1M working 20 hrs/week"',
      centerX + colSpacing * 2.8, centerY, 'cyan', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Differentiation...`);
    await createSticky(accessToken, boardId,
      '<b>💡 HOW TO DIFFERENTIATE</b><br><br><b>Create Signature Framework:</b><br>Don\'t just teach "agency growth"<br>Have YOUR method<br><br><b>Example:</b><br>"The ASCEND Framework"<br>A - Audit<br>S - Systemize<br>C - Create team<br>E - Eliminate bottlenecks<br>N - Nurture clients<br>D - Duplicate success<br><br><b>Make it YOURS!</b>',
      centerX + colSpacing * 3.5, centerY, 'light_green', 300
    );
    await sleep(400);

    // ============= QUICK WINS (Far Left) =============
    console.log(`[${++count}/${total}] ⚡ Immediate Actions...`);
    await createSticky(accessToken, boardId,
      '<b style="font-size:16px">⚡ START THIS WEEK</b><br>Quick Wins - High Impact, Low Effort<br><br>1️⃣ Fix Instagram bio (15 min)<br><br>2️⃣ Create signature framework (1-2 days)<br><br>3️⃣ Reach out to 3 past clients<br>   for testimonials (1 hour)<br><br>4️⃣ Add lead magnet to YouTube<br>   descriptions (1 hour)',
      centerX - colSpacing * 2.8, centerY, 'yellow', 320
    );
    await sleep(400);

    // ============= GROWTH ROADMAP (Bottom Center) =============
    console.log(`[${++count}/${total}] 🗺️ Growth Roadmap...`);
    await createSticky(accessToken, boardId,
      '<b style="font-size:16px">🗺️ REALISTIC GROWTH PATH</b><br><br><b>Months 1-3:</b> Fix Foundation<br>• Positioning, content, social proof<br><br><b>Months 4-6:</b> Grow Audience<br>• 4.5K → 10K-12K followers<br>• 500 → 2K email list<br><br><b>Months 7-9:</b> First Product<br>• Low-ticket ($47-$97)<br>• Test market fit<br><br><b>Months 10-12:</b> Scale Up<br>• Launch mid/high-ticket<br>• If foundation is strong',
      centerX, centerY + rowSpacing * 2.8, 'light_blue', 360
    );
    await sleep(400);

    // ============= HONEST ASSESSMENT (Bottom Right) =============
    console.log(`[${++count}/${total}] 💬 Bottom Line...`);
    await createSticky(accessToken, boardId,
      '<b>💬 HONEST BOTTOM LINE</b><br><br><b>Current Situation:</b><br>You have good foundation but<br>metrics don\'t support high-ticket yet<br><br><b>The Gap:</b><br>Positioning says "6-7 figures"<br>Reality shows "building stage"<br><br><b>Good News:</b><br>This is FIXABLE in 6-9 months!<br><br><b>Focus on fundamentals first,<br>monetization will follow</b>',
      centerX + colSpacing * 1.5, centerY + rowSpacing * 2.8, 'gray', 340
    );
    await sleep(400);

    // ============= KEY INSIGHTS (Bottom Far Left) =============
    console.log(`[${++count}/${total}] 💡 Key Insights...`);
    await createSticky(accessToken, boardId,
      '<b>💡 KEY INSIGHTS</b><br><br>1️⃣ You\'re in the right niche<br>   (agencies need help)<br><br>2️⃣ You\'re in the right stage<br>   (building → launching)<br><br>3️⃣ You need more proof<br>   (testimonials, case studies)<br><br>4️⃣ You need bigger audience<br>   (3x current size minimum)<br><br>5️⃣ Timing is everything<br>   (don\'t rush to launch)',
      centerX - colSpacing * 2.8, centerY + rowSpacing * 1.5, 'light_yellow', 300
    );
    await sleep(400);

    // ============= WHAT'S WORKING (Bottom Far Right) =============
    console.log(`[${++count}/${total}] ✅ What\'s Working...`);
    await createSticky(accessToken, boardId,
      '<b>✅ WHAT\'S ALREADY WORKING</b><br><br>• Lead magnet infrastructure ✅<br>• Multi-platform presence ✅<br>• Reels getting decent reach ✅<br>• Consistent posting ✅<br>• Good niche selection ✅<br><br><b>Don\'t change these!</b><br>Just need to optimize and scale<br>what\'s already working',
      centerX + colSpacing * 2.8, centerY + rowSpacing * 1.5, 'light_green', 300
    );
    await sleep(400);

    // ============= BENCHMARK DATA (Top Far Left) =============
    console.log(`[${++count}/${total}] 📊 Industry Benchmarks...`);
    await createSticky(accessToken, boardId,
      '<b>📊 INDUSTRY BENCHMARKS</b><br>Agency Growth Niche<br><br><b>Engagement Rates:</b><br>• Low: <1.5% (you: 0.97%)<br>• Average: 2-3%<br>• Good: 3-5%<br><br><b>Audience for High-Ticket:</b><br>• Minimum: 10K-15K<br>• Comfortable: 25K-50K<br>• You: 4.5K (too early)<br><br><b>Email List Conversion:</b><br>• 1-2% buy $5K+ offer',
      centerX - colSpacing * 3.5, centerY - rowSpacing, 'cyan', 300
    );
    await sleep(400);

    // ============= PRICING RESEARCH (Top Far Right) =============
    console.log(`[${++count}/${total}] 💲 Pricing Research...`);
    await createSticky(accessToken, boardId,
      '<b>💲 WHAT MARKET PAYS</b><br>Agency Growth Space<br><br><b>Low-Ticket:</b><br>Templates, guides: $27-$97<br><br><b>Mid-Ticket:</b><br>Courses: $497-$1,997<br><br><b>High-Ticket:</b><br>Group coaching: $3K-$10K<br>Mastermind: $10K-$25K<br>1-on-1: $15K-$50K+<br><br><b>You can command these prices<br>WHEN you have the proof!</b>',
      centerX + colSpacing * 3.5, centerY - rowSpacing, 'light_yellow', 300
    );
    await sleep(400);

    // ============= OPPORTUNITY SUMMARY (Top Center) =============
    console.log(`[${++count}/${total}] 🎯 Biggest Opportunities...`);
    await createSticky(accessToken, boardId,
      '<b style="font-size:16px">🎯 TOP 5 OPPORTUNITIES</b><br><br>1️⃣ <b>LinkedIn Presence</b><br>   Untapped! Agency owners are there<br><br>2️⃣ <b>Social Proof</b><br>   Get 5-10 video testimonials ASAP<br><br>3️⃣ <b>Email List</b><br>   Build to 3K before launching<br><br>4️⃣ <b>Content Focus</b><br>   70% education vs lifestyle<br><br>5️⃣ <b>Signature Framework</b><br>   Own YOUR method',
      centerX, centerY - rowSpacing * 2.8, 'orange', 360
    );
    await sleep(400);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`\n🎉 Complete! Growth opportunity map created!\n`);
    console.log(`📊 Created ${count} insights\n`);
    console.log(`🔗 View: https://miro.com/app/board/${boardId}/\n`);
    console.log(`💡 This is PURE VALUE - honest assessment of where he is`);
    console.log(`   and what HE needs to do to grow\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
