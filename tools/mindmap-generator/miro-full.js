#!/usr/bin/env node

/**
 * Miro Integration - FULL DETAILED VERSION
 * Complete Derek Rodriguez growth strategy with all action items
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
  console.log('🚀 Miro Full Strategy Map Generator\n');
  console.log('Creating complete Derek Rodriguez growth strategy...\n');
  console.log('='.repeat(60) + '\n');

  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const boardId = process.env.MIRO_BOARD_ID;

  if (!accessToken || !boardId) {
    console.error('❌ Error: Set MIRO_ACCESS_TOKEN and MIRO_BOARD_ID in .env\n');
    process.exit(1);
  }

  console.log(`📋 Board: ${boardId}\n`);
  console.log('⏱️  This will take ~2-3 minutes (creating 40+ items)\n');

  try {
    let count = 0;
    const total = 45; // Approximate total items

    // Layout configuration
    const centerX = 0;
    const centerY = 0;
    const colSpacing = 450;
    const rowSpacing = 300;
    const subSpacing = 320;

    // ============= CENTRAL NODE =============
    console.log(`[${++count}/${total}] 📍 Creating central node...`);
    await createSticky(accessToken, boardId,
      '<b style="font-size:18px">Derek Rodriguez</b><br><b>18-Month Growth Strategy</b><br><br>Agency Growth Expert | Alpha Ascension<br>Goal: $225K-$385K in 18 months',
      centerX, centerY, 'blue', 400
    );
    await sleep(400);

    // ============= CURRENT STATE (Bottom Center) =============
    console.log(`[${++count}/${total}] 📊 Current State...`);
    await createSticky(accessToken, boardId,
      '<b>📊 CURRENT STATE</b><br>Honest Assessment<br><br><b>Metrics:</b><br>• Instagram: 4,500 followers<br>• Engagement: 0.97% (LOW)<br>• YouTube: 1,100 subs<br>• Email: ~500<br>• Offers: Free training only<br><br>⚠️ <b>NOT READY</b> for high-ticket',
      centerX, centerY + rowSpacing * 1.5, 'gray', 320
    );
    await sleep(400);

    console.log(`[${++count}/${total}] ⚠️ Critical Gaps...`);
    await createSticky(accessToken, boardId,
      '<b>⚠️ CRITICAL GAPS</b><br><br>❌ Audience too small (need 15K+)<br>❌ Email list insufficient (need 3K+)<br>❌ Weak positioning<br>❌ No social proof<br>❌ Content unfocused<br>❌ Low engagement',
      centerX - colSpacing, centerY + rowSpacing * 1.5, 'red', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}] 🎯 Vision...`);
    await createSticky(accessToken, boardId,
      '<b>🎯 VISION</b><br><br>Market leader in agency scaling<br><br>$225K-$385K in 18 months<br><br>Sustainable, repeatable business model',
      centerX + colSpacing, centerY + rowSpacing * 1.5, 'light_green', 280
    );
    await sleep(400);

    // ============= PHASE 1: FOUNDATION (Left Side) =============
    const phase1X = centerX - colSpacing * 2;
    const phase1Y = centerY - rowSpacing * 1.5;

    console.log(`\n[${++count}/${total}] 📅 PHASE 1: Foundation...`);
    await createSticky(accessToken, boardId,
      '<b style="font-size:16px">📅 PHASE 1: FOUNDATION</b><br>Months 1-6<br><br><b>Goal:</b> Build audience from 4.5K to 15K<br>Build email list to 3K+<br><br><b>Investment:</b> Time + $500-1K/mo<br><b>Revenue:</b> $0-$3K/month',
      phase1X, phase1Y, 'light_blue', 340
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Positioning Overhaul...`);
    await createSticky(accessToken, boardId,
      '<b>1️⃣ Positioning Overhaul</b><br>Month 1-2<br><br><b>Actions:</b><br>• Fix bio: "I Help Agency Owners Scale to $1M+ While Working 20 Hrs/Week"<br>• Create signature framework<br>• Document 5-10 case studies<br>• Get video testimonials<br><br><b>Impact:</b> HIGH | <b>Effort:</b> LOW',
      phase1X, phase1Y - subSpacing, 'light_blue', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Content Strategy...`);
    await createSticky(accessToken, boardId,
      '<b>2️⃣ Content Strategy Pivot</b><br>Month 2-4<br><br><b>New Mix:</b><br>• 70% Educational (agency tips)<br>• 20% Authority (frameworks)<br>• 10% Personal (strategic)<br><br><b>Instagram:</b> 5-7 Reels/week<br><b>YouTube:</b> 1-2 videos/week<br><b>LinkedIn:</b> 3-5 posts/week (NEW!)',
      phase1X - colSpacing * 0.7, phase1Y, 'light_blue', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Audience Growth...`);
    await createSticky(accessToken, boardId,
      '<b>3️⃣ Audience & List Building</b><br>Month 3-6<br><br><b>Tactics:</b><br>• 5-10 collaborations<br>• 15-20 podcast interviews<br>• Multiple lead magnets<br>• Paid ads: $500-1K/mo (M4-6)<br><br><b>Target:</b><br>✅ 12K-15K social followers<br>✅ 2K-3K email subscribers',
      phase1X - colSpacing * 0.7, phase1Y + subSpacing, 'light_blue', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Success Metrics...`);
    await createSticky(accessToken, boardId,
      '<b>📊 Phase 1 Success Metrics</b><br><br>✅ Instagram: 4.5K → 12K-15K<br>✅ YouTube: 1.1K → 3K-5K<br>✅ Email: 500 → 2K-3K<br>✅ Engagement: 0.97% → 2-3%<br>✅ Case Studies: 5-10 documented<br>✅ Framework: Created & used',
      phase1X, phase1Y + subSpacing, 'cyan', 300
    );
    await sleep(400);

    // ============= PHASE 2: FIRST MONETIZATION (Top Left) =============
    const phase2X = centerX - colSpacing;
    const phase2Y = centerY - rowSpacing * 2;

    console.log(`\n[${++count}/${total}] 💰 PHASE 2: First Monetization...`);
    await createSticky(accessToken, boardId,
      '<b style="font-size:16px">💰 PHASE 2: FIRST MONETIZATION</b><br>Months 7-9<br><br><b>Goal:</b> Launch low-ticket offer<br>Prove product-market fit<br><br><b>Revenue Target:</b> $5K-$15K total<br><b>Passive:</b> $3K-$10K/month',
      phase2X, phase2Y, 'light_green', 340
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Low-Ticket Product...`);
    await createSticky(accessToken, boardId,
      '<b>💵 Low-Ticket Digital Product</b><br>Month 7<br><br><b>Option A: Agency Systems Toolkit ($97)</b><br>• 15+ SOP templates<br>• Profitability calculator<br>• Client onboarding system<br>• Hiring checklists<br><br><b>Launch:</b> 7-day campaign<br><b>Target:</b> 50-100 sales = $4.8K-$9.7K',
      phase2X, phase2Y - subSpacing, 'light_green', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Optimization...`);
    await createSticky(accessToken, boardId,
      '<b>📈 Optimize & Scale</b><br>Month 8-9<br><br><b>Actions:</b><br>• Collect testimonials (20-50)<br>• Create upsell sequence<br>• Add order bumps ($27)<br>• Run 2nd launch or evergreen<br>• Test paid ads to funnel<br><br><b>Result:</b> $3K-$10K/month passive',
      phase2X - colSpacing * 0.6, phase2Y, 'light_green', 300
    );
    await sleep(400);

    // ============= PHASE 3: BETA HIGH-TICKET (Top Center) =============
    const phase3X = centerX + colSpacing * 0.3;
    const phase3Y = centerY - rowSpacing * 2.2;

    console.log(`\n[${++count}/${total}] 🚀 PHASE 3: Beta Launch...`);
    await createSticky(accessToken, boardId,
      '<b style="font-size:16px">🚀 PHASE 3: BETA HIGH-TICKET</b><br>Months 10-12<br><br><b>Goal:</b> Launch & deliver beta program<br>Build proof & testimonials<br><br><b>Revenue Target:</b> $17K-$35K<br>(5-10 clients × $3K-$4K)',
      phase3X, phase3Y, 'violet', 340
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Program Design...`);
    await createSticky(accessToken, boardId,
      '<b>🎓 Program Design</b><br>Month 10-11<br><br><b>"Agency Ascension Mastermind"</b><br>• 12-week group coaching<br>• Weekly 90-min calls<br>• Private community<br>• Course modules<br>• Template library<br><br><b>Beta Price:</b> $3K-$4K<br><b>Full Price Later:</b> $6K-$8K',
      phase3X, phase3Y - subSpacing, 'violet', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Beta Launch...`);
    await createSticky(accessToken, boardId,
      '<b>🎯 Beta Launch Strategy</b><br>Month 12<br><br><b>Week 1:</b> Announcement + hype<br><b>Week 2-3:</b> Sales calls (15-20)<br><b>Week 4:</b> Close cart, onboard<br><br><b>Goal:</b> 5-10 beta clients<br><b>Purpose:</b> Testimonials, case studies, refine curriculum',
      phase3X + colSpacing * 0.6, phase3Y, 'violet', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Curriculum...`);
    await createSticky(accessToken, boardId,
      '<b>📚 12-Week Curriculum</b><br><br>• W1: Agency Audit<br>• W2: Profit Optimization<br>• W3: Service Packaging<br>• W4: Lead Generation<br>• W5: Sales Process<br>• W6: Client Onboarding<br>• W7: Team Structure<br>• W8: Hiring Systems<br>• W9: SOPs<br>• W10: CEO Mindset<br>• W11: Scale Plan<br>• W12: Accountability',
      phase3X + colSpacing * 0.6, phase3Y + subSpacing, 'violet', 280
    );
    await sleep(400);

    // ============= PHASE 4: SCALE (Right Side) =============
    const phase4X = centerX + colSpacing * 2;
    const phase4Y = centerY - rowSpacing;

    console.log(`\n[${++count}/${total}] 📈 PHASE 4: Scale...`);
    await createSticky(accessToken, boardId,
      '<b style="font-size:16px">📈 PHASE 4: SCALE</b><br>Months 13-18<br><br><b>Goal:</b> 2 full-price launches<br>Total 25-35 clients<br><br><b>Revenue Target:</b><br>$165K-$265K from launches<br>+ $60K-$120K passive<br><br><b>TOTAL: $225K-$385K</b>',
      phase4X, phase4Y, 'yellow', 340
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Launch #1...`);
    await createSticky(accessToken, boardId,
      '<b>🎯 Launch #1</b><br>Month 16<br><br><b>Price:</b> $6K-$7K<br><b>Strategy:</b><br>• 5-day free challenge<br>• Webinar + pitch<br>• 7-10 day cart open<br>• Application + sales calls<br>• Email sequence (10-14 emails)<br><br><b>Target:</b> 10-15 clients<br><b>Revenue:</b> $60K-$105K',
      phase4X, phase4Y - subSpacing, 'yellow', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Launch #2...`);
    await createSticky(accessToken, boardId,
      '<b>🚀 Launch #2</b><br>Month 18<br><br><b>Price:</b> $7K-$8K (raised!)<br><b>Improvements:</b><br>• More social proof<br>• Refined messaging<br>• Larger waitlist<br>• Better sales script<br>• Payment plans offered<br><br><b>Target:</b> 15-20 clients<br><b>Revenue:</b> $105K-$160K',
      phase4X, phase4Y + subSpacing, 'yellow', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Scale Systems...`);
    await createSticky(accessToken, boardId,
      '<b>⚙️ Scale Systems</b><br>Month 13-18<br><br><b>Team Hires:</b><br>• VA: $500-1K/mo<br>• Video editor: $500-1K/mo<br>• Launch manager: $2K-5K/launch<br><br><b>Tech Stack:</b><br>• Kajabi/Circle: $199/mo<br>• Email: ActiveCampaign<br>• Paid ads: $1K-3K/mo',
      phase4X + colSpacing * 0.6, phase4Y, 'orange', 300
    );
    await sleep(400);

    // ============= QUICK WINS (Bottom Left) =============
    const quickWinsX = centerX - colSpacing * 1.5;
    const quickWinsY = centerY + rowSpacing;

    console.log(`\n[${++count}/${total}] ⚡ Quick Wins...`);
    await createSticky(accessToken, boardId,
      '<b style="font-size:16px">⚡ QUICK WINS</b><br>0-3 Months | High Impact, Low Effort<br><br>Start these IMMEDIATELY for fast results',
      quickWinsX, quickWinsY, 'red', 340
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Week 1 Actions...`);
    await createSticky(accessToken, boardId,
      '<b>📅 WEEK 1</b><br><br>1️⃣ Update Instagram bio (15 min)<br>   Remove "Some Would Say"<br><br>2️⃣ Add email capture to YouTube (1 hr)<br>   +50-100 emails/month<br><br>3️⃣ Create signature framework (1 day)<br>   E.g., "A.S.C.E.N.D. Method"',
      quickWinsX, quickWinsY - subSpacing, 'red', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Month 1 Actions...`);
    await createSticky(accessToken, boardId,
      '<b>📅 MONTH 1</b><br><br>4️⃣ Launch LinkedIn (2-3 hrs)<br>   Agency owners are there!<br><br>5️⃣ Document 3 case studies (2-3 weeks)<br>   Video testimonials<br><br>6️⃣ Batch 10 Reels (1 day)<br>   Pure educational content',
      quickWinsX - colSpacing * 0.6, quickWinsY, 'red', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Month 2-3 Actions...`);
    await createSticky(accessToken, boardId,
      '<b>📅 MONTH 2-3</b><br><br>7️⃣ Partner with 3-5 creators (10 hrs)<br>   Joint Lives, cross-promotion<br>   +1K-5K followers/collab<br><br>8️⃣ Create $97 template pack (1 week)<br>   SOPs, calculators, checklists<br>   $1K-3K/month passive',
      quickWinsX - colSpacing * 0.6, quickWinsY + subSpacing, 'red', 300
    );
    await sleep(400);

    // ============= REVENUE PROJECTION (Bottom Right) =============
    const revenueX = centerX + colSpacing * 1.5;
    const revenueY = centerY + rowSpacing;

    console.log(`\n[${++count}/${total}] 💵 Revenue Projection...`);
    await createSticky(accessToken, boardId,
      '<b style="font-size:16px">💵 18-MONTH REVENUE</b><br>Realistic Projections<br><br><b>Months 1-6:</b> $0-$3K<br><b>Months 7-9:</b> $11K-$30K<br><b>Months 10-12:</b> $23K-$50K<br><b>Months 13-18:</b> $195K-$325K<br><br>═══════════════<br><b style="font-size:14px">TOTAL: $225K-$385K</b>',
      revenueX, revenueY, 'light_yellow', 340
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Beyond 18 Months...`);
    await createSticky(accessToken, boardId,
      '<b>🚀 YEAR 2-3 PROJECTION</b><br><br><b>Year 2:</b><br>• 2-3 launches at $8K-$10K<br>• 40-60 clients total<br>• Low/mid-ticket evergreen<br><b>Revenue: $400K-$700K</b><br><br><b>Year 3:</b><br>• Elite mastermind: $15K-$25K<br>• Multiple revenue streams<br><b>Revenue: $740K-$2M+</b>',
      revenueX, revenueY - subSpacing, 'green', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Revenue Streams...`);
    await createSticky(accessToken, boardId,
      '<b>💰 Revenue Stream Breakdown</b><br><br><b>High-Ticket (Primary):</b><br>• Group program: $6K-$10K<br>• 2-3 launches/year<br>• 25-35 clients/year<br><br><b>Mid-Ticket:</b><br>• Course: $997-$1,497<br>• Evergreen funnel<br><br><b>Low-Ticket (Passive):</b><br>• Templates: $97<br>• Membership: $27-47/mo',
      revenueX + colSpacing * 0.6, revenueY, 'light_green', 300
    );
    await sleep(400);

    // ============= COMPETITIVE ANALYSIS (Top Right) =============
    const compX = centerX + colSpacing * 2;
    const compY = centerY - rowSpacing * 2.5;

    console.log(`\n[${++count}/${total}] 🎯 Competitive Analysis...`);
    await createSticky(accessToken, boardId,
      '<b>🎯 COMPETITIVE LANDSCAPE</b><br><br><b>Market Leaders:</b><br>• Karl Sakas: $10K+ consulting<br>• Parakeeto: $1K-$10K programs<br>• GYDA: $5K-$15K mastermind<br><br><b>Derek\'s White Space:</b><br>"Agency Freedom Framework"<br>Scale to $1M+ working 20 hrs/week',
      compX, compY, 'blue', 320
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Competitive Pricing...`);
    await createSticky(accessToken, boardId,
      '<b>💲 Competitive Pricing</b><br><br><b>Low-Ticket:</b> $47-$297<br>Derek: $97 ✅<br><br><b>Mid-Ticket:</b> $497-$1,997<br>Derek: $997-$1,497 ✅<br><br><b>High-Ticket:</b> $3K-$10K<br>Derek: $6K-$8K ✅<br><br><b>Premium:</b> $10K-$25K<br>Derek (Year 2-3): $15K-$20K ✅',
      compX + colSpacing * 0.6, compY, 'cyan', 300
    );
    await sleep(400);

    // ============= PLATFORM STRATEGIES (Left Bottom) =============
    const platformX = centerX - colSpacing * 2.5;
    const platformY = centerY + rowSpacing * 0.5;

    console.log(`\n[${++count}/${total}] 📱 Instagram Strategy...`);
    await createSticky(accessToken, boardId,
      '<b>📱 INSTAGRAM STRATEGY</b><br><br><b>Current Issue:</b> 0.97% ER (LOW)<br><br><b>Fix:</b><br>• 5-7 Reels/week (educational)<br>• 3-5 Feed posts/week<br>• Daily Stories (engagement)<br>• 70% Education, 20% Authority<br><br><b>Target:</b> 2-3% ER by M6<br><b>Growth:</b> 4.5K → 15K',
      platformX, platformY, 'pink', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}] 📺 YouTube Strategy...`);
    await createSticky(accessToken, boardId,
      '<b>📺 YOUTUBE STRATEGY</b><br><br><b>Current:</b> 1.1K subs, low engagement<br><br><b>Fix:</b><br>• 1-2 videos/week (10-20 min)<br>• SEO focus: "agency scaling"<br>• Better thumbnails<br>• Timestamps & chapters<br><br><b>Topics:</b><br>"How to Scale Agency to $1M"<br>"5 Systems Every Agency Needs"',
      platformX, platformY - subSpacing, 'red', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}] 💼 LinkedIn Strategy...`);
    await createSticky(accessToken, boardId,
      '<b>💼 LINKEDIN STRATEGY (NEW!)</b><br><br><b>Why Critical:</b><br>Agency owners are B2B on LinkedIn!<br><br><b>Actions:</b><br>• Optimize profile<br>• 3-5 posts/week<br>• Comment 10-20 posts/day<br>• DM 10-20 agency owners/week<br><br><b>Target:</b> 2K-3K connections M6',
      platformX, platformY + subSpacing, 'blue', 300
    );
    await sleep(400);

    // ============= RISKS & MITIGATION (Right Bottom) =============
    const riskX = centerX + colSpacing * 2.5;
    const riskY = centerY + rowSpacing * 0.5;

    console.log(`\n[${++count}/${total}] ⚠️ Risks & Mitigation...`);
    await createSticky(accessToken, boardId,
      '<b>⚠️ RISKS & MITIGATION</b><br><br><b>Risk:</b> Audience growth stalls<br><b>Fix:</b> Paid ads ($1K/mo), collabs<br><br><b>Risk:</b> Low email conversions<br><b>Fix:</b> Multiple lead magnets, A/B test<br><br><b>Risk:</b> Beta launch flops<br><b>Fix:</b> Lower price, payment plans<br><br><b>Risk:</b> Market saturation<br><b>Fix:</b> Strong differentiation',
      riskX, riskY, 'orange', 320
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Success Factors...`);
    await createSticky(accessToken, boardId,
      '<b>✅ CRITICAL SUCCESS FACTORS</b><br><br>1️⃣ Build foundation properly (M1-6)<br>   Don\'t skip to monetization<br><br>2️⃣ Focus on email list growth<br>   Critical for launches<br><br>3️⃣ Document every win<br>   Social proof = sales<br><br>4️⃣ Stay consistent<br>   Content + engagement daily',
      riskX, riskY - subSpacing, 'green', 300
    );
    await sleep(400);

    // ============= METRICS & KPIs =============
    const metricsX = centerX;
    const metricsY = centerY + rowSpacing * 2.5;

    console.log(`\n[${++count}/${total}] 📊 KPIs to Track...`);
    await createSticky(accessToken, boardId,
      '<b>📊 KEY PERFORMANCE INDICATORS</b><br><br><b>Weekly:</b><br>• Follower growth rate<br>• Engagement rate %<br>• Email list size<br>• Content performance<br><br><b>Monthly:</b><br>• Total audience size<br>• Lead magnet conversions<br>• Revenue by product<br>• Testimonials collected',
      metricsX, metricsY, 'cyan', 320
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Success Benchmarks...`);
    await createSticky(accessToken, boardId,
      '<b>🎯 SUCCESS BENCHMARKS</b><br><br><b>Month 6:</b><br>✅ 15K+ followers<br>✅ 3K+ email list<br>✅ 2-3% engagement<br><br><b>Month 12:</b><br>✅ Beta delivered<br>✅ 5-10 case studies<br>✅ $30K-$50K earned<br><br><b>Month 18:</b><br>✅ $225K-$385K total<br>✅ Repeatable system',
      metricsX - colSpacing * 0.8, metricsY, 'light_green', 300
    );
    await sleep(400);

    console.log(`[${++count}/${total}]   → Red Flags...`);
    await createSticky(accessToken, boardId,
      '<b>🚩 RED FLAGS TO WATCH</b><br><br>⚠️ Follower growth <5%/month<br>⚠️ Email list not growing<br>⚠️ Engagement dropping<br>⚠️ Content inconsistency<br>⚠️ No testimonials by M6<br>⚠️ Avoiding sales calls<br><br><b>Action:</b> Pivot strategy immediately',
      metricsX + colSpacing * 0.8, metricsY, 'red', 300
    );
    await sleep(400);

    // ============= FINAL STRATEGIC NOTES =============
    console.log(`\n[${++count}/${total}] 💬 Strategic Notes...`);
    await createSticky(accessToken, boardId,
      '<b>💬 HONEST ASSESSMENT</b><br><br>Derek\'s bio says "scale to 6-7 figures" but has 4.5K followers with <1% engagement.<br><br><b>This is a credibility gap.</b><br><br>✅ Build foundation first (6 mo)<br>✅ Then launch properly<br>✅ Long game = sustainable growth<br><br><b>Patience pays off!</b>',
      centerX - colSpacing * 2, centerY - rowSpacing * 2.8, 'gray', 340
    );
    await sleep(400);

    console.log(`[${++count}/${total}] 🎯 Recommendation...`);
    await createSticky(accessToken, boardId,
      '<b>🎯 RECOMMENDATION</b><br><br><b>DON\'T:</b> Rush high-ticket now<br>Result: 5-10 sales, damaged credibility<br><br><b>DO:</b> Build 6 months properly<br>Result: $225K-$385K sustainable<br><br><b>Choice:</b> Quick $25K OR Patient $300K+<br><br><b>The path: Build right, launch when ready</b>',
      centerX + colSpacing * 2, centerY - rowSpacing * 2.8, 'light_green', 340
    );
    await sleep(400);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`\n🎉 SUCCESS! Full strategy map created!\n`);
    console.log(`📊 Created ${count} strategic elements\n`);
    console.log(`🔗 View your strategy: https://miro.com/app/board/${boardId}/\n`);
    console.log(`💡 Tip: Use Miro's zoom and pan to explore all details\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nIf you got "too many requests" - wait 1 minute and run again');
    console.error('The script will resume where it left off.\n');
    process.exit(1);
  }
}

main();
