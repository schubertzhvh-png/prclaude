require('dotenv').config();

// Miro API Configuration
const MIRO_ACCESS_TOKEN = process.env.MIRO_ACCESS_TOKEN;
const MIRO_BOARD_ID = process.env.MIRO_BOARD_ID;

// Rate limiting delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to make API requests
async function makeRequest(method, endpoint, accessToken, body = null) {
  const url = `https://api.miro.com${endpoint}`;

  const options = {
    method: method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return await response.json();
}

// Create sticky note
async function createSticky(accessToken, boardId, content, x, y, color, width = 300) {
  return makeRequest('POST', `/v2/boards/${boardId}/sticky_notes`, accessToken, {
    data: {
      content: content,
      shape: 'square'
    },
    style: {
      fillColor: color
    },
    position: { x, y },
    geometry: { width }
  });
}

// Create connector between two items
async function createConnector(accessToken, boardId, startItemId, endItemId, color = 'gray') {
  return makeRequest('POST', `/v2/boards/${boardId}/connectors`, accessToken, {
    startItem: { id: startItemId },
    endItem: { id: endItemId },
    style: {
      strokeColor: color,
      strokeWidth: '2'
    }
  });
}

// Main function to create the comprehensive 5-year strategy mind map
async function create5YearStrategy() {
  console.log('🚀 Creating Derek Rodriguez - 5-Year Growth Strategy Mind Map...\n');

  const createdItems = [];

  // Layout configuration
  const centerX = 0;
  const centerY = 0;
  const sectionSpacing = 800;
  const itemSpacing = 380;
  const verticalSpacing = 320;

  try {
    // ===== CENTRAL NODE =====
    console.log('Creating central node...');
    const central = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<p style="text-align:center;"><b style="font-size:24px;">🎯 DEREK RODRIGUEZ</b><br><br>' +
      '<b style="font-size:18px;">5-Year Growth Blueprint</b><br><br>' +
      '<span style="font-size:14px;">From 4.5K followers to Market Leader<br>' +
      'Complete Strategic Roadmap 2025-2030</span></p>',
      centerX,
      centerY,
      'dark_blue',
      500
    );
    createdItems.push(central);
    await delay(400);

    // ===== CURRENT STATE OVERVIEW =====
    console.log('Creating current state analysis...');
    const currentState = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:16px;">📊 STARTING POINT (Now)</b><br><br>' +
      '<b>Current Metrics:</b><br>' +
      '• Instagram: 4,500 followers<br>' +
      '• Engagement: 0.97% (posts), 1.79% (Reels)<br>' +
      '• YouTube: 1,100 subscribers<br>' +
      '• Email List: ~500 subscribers<br>' +
      '• Revenue: Minimal (lead magnet only)<br><br>' +
      '<b style="color:#DC2626;">Critical Gaps:</b><br>' +
      '• Audience too small for high-ticket<br>' +
      '• Weak positioning ("Some Would Say...")<br>' +
      '• No signature framework<br>' +
      '• Content lacks focus (lifestyle heavy)<br>' +
      '• No visible social proof<br><br>' +
      '<b>The Reality:</b> Not ready for launch yet.<br>' +
      'Need 6+ months foundation building first.',
      centerX - sectionSpacing * 1.2,
      centerY,
      'red',
      380
    );
    createdItems.push(currentState);
    await delay(400);

    // ===== YEAR 1: MONTHS 1-6 - FOUNDATION =====
    console.log('Creating Year 1 Phase 1 (Foundation)...');
    const year1phase1 = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<p style="text-align:center;"><b style="font-size:18px;">📅 YEAR 1: Months 1-6</b><br>' +
      '<b style="font-size:16px;">FOUNDATION PHASE</b></p><br>' +
      '<b>Goal:</b> Build audience, positioning & credibility<br><br>' +
      '<b>Key Actions:</b><br>' +
      '1️⃣ <b>Positioning Overhaul (Weeks 1-2)</b><br>' +
      '   • New bio: "I Help Agency Owners Scale to $1M+<br>' +
      '     While Working 20 Hrs/Week"<br>' +
      '   • Create signature framework (e.g. "A.S.C.E.N.D.")<br>' +
      '   • Document 5 detailed case studies<br>' +
      '   • Get video testimonials<br><br>' +
      '2️⃣ <b>Content Strategy Pivot (Months 2-4)</b><br>' +
      '   • NEW MIX: 70% educational, 20% authority,<br>' +
      '     10% personal (currently reversed!)<br>' +
      '   • Instagram: 3-5 posts + 5-7 Reels/week<br>' +
      '   • YouTube: 1-2 long-form videos/week<br>' +
      '   • LinkedIn: 3-5 posts/week (NEW platform!)<br>' +
      '   • Focus: Agency systems, scaling frameworks<br><br>' +
      '3️⃣ <b>Audience Building (Months 3-6)</b><br>' +
      '   • Collaborations: Partner with 5-10 experts<br>' +
      '   • Podcasts: Appear on 15-20 shows<br>' +
      '   • Lead magnets: Upgrade offer stack<br>' +
      '   • Paid ads: Test $500-$1K/month (Month 4+)<br><br>' +
      '<b style="color:#FCD34D;">Metrics to Hit:</b><br>' +
      '✓ Instagram: 4.5K → 12K-15K<br>' +
      '✓ YouTube: 1.1K → 3K-5K<br>' +
      '✓ Email List: 500 → 2K-3K<br>' +
      '✓ Engagement: 0.97% → 2-3%<br><br>' +
      '<b>Investment:</b> $500-$1K/month (tools + ads)<br>' +
      '<b>Revenue:</b> $0-$3K/month<br>' +
      '<b>Time:</b> 20-30 hrs/week',
      centerX + sectionSpacing * 0.2,
      centerY - verticalSpacing * 1.8,
      'light_blue',
      420
    );
    createdItems.push(year1phase1);
    await delay(400);

    // ===== YEAR 1: MONTHS 7-9 - FIRST MONETIZATION =====
    console.log('Creating Year 1 Phase 2 (First Monetization)...');
    const year1phase2 = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<p style="text-align:center;"><b style="font-size:18px;">📅 YEAR 1: Months 7-9</b><br>' +
      '<b style="font-size:16px;">FIRST MONETIZATION</b></p><br>' +
      '<b>Goal:</b> Launch low-ticket offer, generate $5K-$15K<br><br>' +
      '<b>Product Options:</b><br>' +
      '📦 <b>Option A: "Agency Systems Toolkit"</b><br>' +
      '   • Price: $97<br>' +
      '   • Format: Digital templates pack<br>' +
      '   • Includes: 15+ SOP templates, calculators,<br>' +
      '     onboarding systems, hiring scripts<br><br>' +
      '📦 <b>Option B: "30-Day Agency Scale Challenge"</b><br>' +
      '   • Price: $47-$97<br>' +
      '   • Format: Daily emails + action items<br>' +
      '   • Includes: Private Facebook group,<br>' +
      '     weekly Q&A calls<br><br>' +
      '<b>Launch Strategy:</b><br>' +
      '• Week 1-2: Create product<br>' +
      '• Week 3: Pre-launch (build waitlist)<br>' +
      '• Week 4: 7-day launch<br>' +
      '• Use: Webinar or 5-day challenge<br><br>' +
      '<b style="color:#FCD34D;">Expected Results:</b><br>' +
      '✓ 50-100 sales<br>' +
      '✓ Revenue: $5K-$10K total<br>' +
      '✓ 10-20 testimonials collected<br>' +
      '✓ Email list: 3K-5K subscribers<br><br>' +
      '<b>Why This Matters:</b><br>' +
      '• Proves you can sell<br>' +
      '• Gets customer testimonials<br>' +
      '• Validates positioning<br>' +
      '• Creates passive income base<br><br>' +
      '<b>Investment:</b> $1K-$2K<br>' +
      '<b>Revenue:</b> $5K-$15K total + $2K-$5K/mo passive',
      centerX + sectionSpacing * 0.85,
      centerY - verticalSpacing * 1.8,
      'light_blue',
      420
    );
    createdItems.push(year1phase2);
    await delay(400);

    // ===== YEAR 1: MONTHS 10-12 - HIGH-TICKET PREP =====
    console.log('Creating Year 1 Phase 3 (High-Ticket Prep)...');
    const year1phase3 = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<p style="text-align:center;"><b style="font-size:18px;">📅 YEAR 1: Months 10-12</b><br>' +
      '<b style="font-size:16px;">HIGH-TICKET PREP & BETA</b></p><br>' +
      '<b>Goal:</b> Design & launch beta high-ticket program<br><br>' +
      '<b>Program Design:</b><br>' +
      '🎓 <b>"Agency Ascension Mastermind"</b><br>' +
      '   • Format: 12-week group coaching<br>' +
      '   • Weekly 90-min group calls<br>' +
      '   • Private community (Circle/Slack)<br>' +
      '   • Self-paced course modules<br>' +
      '   • Template library access<br>' +
      '   • Optional: 1 private 1-on-1 call<br><br>' +
      '<b>Beta Pricing:</b><br>' +
      '   • Beta: $3K-$4K (early bird 50% off)<br>' +
      '   • Future: $6K-$8K full price<br><br>' +
      '<b>Ideal Client:</b><br>' +
      '   • Agency doing $250K-$1M/year<br>' +
      '   • Owner working 50+ hours/week<br>' +
      '   • Wants to scale without burnout<br>' +
      '   • Ready to invest in systems<br><br>' +
      '<b>12-Week Curriculum:</b><br>' +
      '1. Agency Audit & Baseline<br>' +
      '2. Profit Optimization<br>' +
      '3. Service Packaging & Pricing<br>' +
      '4. Lead Generation Systems<br>' +
      '5. Sales Process Optimization<br>' +
      '6. Client Onboarding Automation<br>' +
      '7. Team Structure & Delegation<br>' +
      '8. Hiring & Training Systems<br>' +
      '9. SOPs & Process Documentation<br>' +
      '10. CEO Mindset & Time Management<br>' +
      '11. Scale Plan & 90-Day Roadmap<br>' +
      '12. Implementation & Accountability<br><br>' +
      '<b style="color:#FCD34D;">Beta Launch Results:</b><br>' +
      '✓ Target: 5-10 beta clients<br>' +
      '✓ Revenue: $17K-$35K<br>' +
      '✓ Purpose: Get testimonials & refine<br><br>' +
      '<b>Investment:</b> $2K-$3K<br>' +
      '<b>Revenue:</b> $17K-$35K',
      centerX + sectionSpacing * 1.5,
      centerY - verticalSpacing * 1.8,
      'light_blue',
      420
    );
    createdItems.push(year1phase3);
    await delay(400);

    // ===== YEAR 1: MONTHS 13-18 - SCALE =====
    console.log('Creating Year 1 Phase 4 (Scale)...');
    const year1phase4 = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<p style="text-align:center;"><b style="font-size:18px;">📅 YEAR 1: Months 13-18</b><br>' +
      '<b style="font-size:16px;">SCALE & OPTIMIZE</b></p><br>' +
      '<b>Goal:</b> 2-3 full-price launches, scale revenue<br><br>' +
      '<b>Month 13-15: Deliver Beta + Refine</b><br>' +
      '• Deliver 12-week program to beta cohort<br>' +
      '• Collect feedback weekly<br>' +
      '• Document transformations & results<br>' +
      '• Get video testimonials (critical!)<br>' +
      '• Create 5-10 detailed case studies<br>' +
      '• Build waitlist for next cohort<br><br>' +
      '<b>Month 16: Launch #1 (Full Price)</b><br>' +
      '💰 <b>Pricing:</b> $6K-$7K<br>' +
      '🎯 <b>Target:</b> 10-15 clients<br>' +
      '📈 <b>Revenue:</b> $60K-$105K<br><br>' +
      '<b>Launch Strategy:</b><br>' +
      '• 5-day free challenge (value bomb)<br>' +
      '• Webinar with pitch<br>' +
      '• 7-10 day cart open<br>' +
      '• Application funnel → sales calls<br>' +
      '• Email sequence: 10-14 emails<br>' +
      '• Use beta testimonials heavily<br><br>' +
      '<b>Month 18: Launch #2 (Increased Price)</b><br>' +
      '💰 <b>Pricing:</b> $7K-$8K (raised after proof)<br>' +
      '🎯 <b>Target:</b> 15-20 clients<br>' +
      '📈 <b>Revenue:</b> $105K-$160K<br><br>' +
      '<b style="color:#FCD34D;">Year 1 Total (18 Months):</b><br>' +
      '✓ Low-ticket passive: $60K-$120K<br>' +
      '✓ High-ticket launches: $165K-$265K<br>' +
      '✓ <b style="font-size:16px;">TOTAL: $225K-$385K</b><br><br>' +
      '<b>Key Achievements:</b><br>' +
      '• 30-45 clients served<br>' +
      '• 20+ video testimonials<br>' +
      '• 10+ detailed case studies<br>' +
      '• Audience: 25K+ social, 10K+ email<br>' +
      '• Positioned as authority',
      centerX + sectionSpacing * 2.15,
      centerY - verticalSpacing * 1.8,
      'light_blue',
      420
    );
    createdItems.push(year1phase4);
    await delay(400);

    // ===== YEAR 2: Q1-Q2 =====
    console.log('Creating Year 2 Phase 1...');
    const year2phase1 = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<p style="text-align:center;"><b style="font-size:18px;">📅 YEAR 2: Months 19-24</b><br>' +
      '<b style="font-size:16px;">SCALE & DIVERSIFY</b></p><br>' +
      '<b>Goal:</b> Multiple revenue streams, $400K-$700K year<br><br>' +
      '<b>Revenue Stream #1: Group Coaching</b><br>' +
      '• 2-3 launches per year<br>' +
      '• Price: $8K-$10K (increased)<br>' +
      '• Target: 15-20 per launch<br>' +
      '• Revenue: $240K-$600K/year<br><br>' +
      '<b>Revenue Stream #2: Mastermind (NEW)</b><br>' +
      '💎 <b>"Elite Agency Mastermind"</b><br>' +
      '   • Format: 6-month intimate group (10-15 max)<br>' +
      '   • Price: $15K-$20K<br>' +
      '   • Includes: Bi-weekly calls, private community,<br>' +
      '     direct access, in-person retreat<br>' +
      '   • Ideal for: $1M+ agencies<br>' +
      '   • Revenue: $150K-$300K/cohort<br><br>' +
      '<b>Revenue Stream #3: Evergreen Course</b><br>' +
      '📚 <b>"Agency Scale Blueprint"</b><br>' +
      '   • Price: $997-$1,497<br>' +
      '   • Self-paced online course<br>' +
      '   • Always available (no launch needed)<br>' +
      '   • Revenue: $50K-$150K/year passive<br><br>' +
      '<b>Revenue Stream #4: Templates/Resources</b><br>' +
      '   • Low-ticket ($47-$197)<br>' +
      '   • Revenue: $20K-$50K/year passive<br><br>' +
      '<b style="color:#FCD34D;">Year 2 Total:</b><br>' +
      '✓ Group Coaching: $240K-$600K<br>' +
      '✓ Mastermind: $150K-$300K<br>' +
      '✓ Evergreen: $50K-$150K<br>' +
      '✓ Low-ticket: $20K-$50K<br>' +
      '✓ <b style="font-size:16px;">TOTAL: $460K-$1.1M</b><br><br>' +
      '<b>Team Expansion:</b><br>' +
      '• Launch Manager ($3K-$5K/month)<br>' +
      '• Content Strategist ($2K-$3K/month)<br>' +
      '• Community Manager ($2K-$3K/month)<br>' +
      '• Video Editor ($1K-$2K/month)',
      centerX + sectionSpacing * 0.2,
      centerY + verticalSpacing * 0.8,
      'green',
      420
    );
    createdItems.push(year2phase1);
    await delay(400);

    // ===== YEAR 3: MARKET LEADERSHIP =====
    console.log('Creating Year 3 strategy...');
    const year3 = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<p style="text-align:center;"><b style="font-size:18px;">📅 YEAR 3: Months 25-36</b><br>' +
      '<b style="font-size:16px;">MARKET LEADERSHIP</b></p><br>' +
      '<b>Goal:</b> Become THE authority, $750K-$2M+ year<br><br>' +
      '<b>Revenue Stream #1: Elite Mastermind</b><br>' +
      '💎 <b>Premium Tier</b><br>' +
      '   • Price: $25K-$35K/year<br>' +
      '   • Cohort: 15-25 members<br>' +
      '   • 2 cohorts/year<br>' +
      '   • Revenue: $375K-$875K<br><br>' +
      '<b>Revenue Stream #2: Done-With-You</b><br>' +
      '🤝 <b>"Agency Transformation Package"</b><br>' +
      '   • 6-month intensive consulting<br>' +
      '   • Price: $50K-$100K<br>' +
      '   • Capacity: 5-10 clients/year<br>' +
      '   • Revenue: $250K-$1M<br><br>' +
      '<b>Revenue Stream #3: Speaking & Workshops</b><br>' +
      '🎤 <b>Industry Events</b><br>' +
      '   • Keynote speaking: $10K-$25K/event<br>' +
      '   • Corporate workshops: $15K-$50K/day<br>' +
      '   • 10-20 events/year<br>' +
      '   • Revenue: $100K-$500K<br><br>' +
      '<b>Revenue Stream #4: Book Launch</b><br>' +
      '📖 <b>"The Agency Freedom Method"</b><br>' +
      '   • Traditional or self-published<br>' +
      '   • Direct revenue: $50K-$200K<br>' +
      '   • Indirect (authority): Priceless<br>' +
      '   • Lead generation machine<br><br>' +
      '<b>Revenue Stream #5: Existing Products</b><br>' +
      '   • Group program: $200K-$400K<br>' +
      '   • Evergreen course: $150K-$300K<br>' +
      '   • Templates/resources: $30K-$80K<br><br>' +
      '<b style="color:#FCD34D;">Year 3 Total:</b><br>' +
      '✓ Elite Mastermind: $375K-$875K<br>' +
      '✓ Done-With-You: $250K-$1M<br>' +
      '✓ Speaking: $100K-$500K<br>' +
      '✓ Book: $50K-$200K<br>' +
      '✓ Other products: $380K-$780K<br>' +
      '✓ <b style="font-size:16px;">TOTAL: $1.15M-$3.35M</b><br><br>' +
      '<b>Authority Building:</b><br>' +
      '• Book published and bestseller campaign<br>' +
      '• Regular podcast guest (50+ episodes)<br>' +
      '• Own podcast launch<br>' +
      '• Major media features (Forbes, Entrepreneur)<br>' +
      '• Industry awards and recognition',
      centerX + sectionSpacing * 0.85,
      centerY + verticalSpacing * 0.8,
      'violet',
      420
    );
    createdItems.push(year3);
    await delay(400);

    // ===== YEAR 4-5: SCALE TO EMPIRE =====
    console.log('Creating Year 4-5 strategy...');
    const year45 = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<p style="text-align:center;"><b style="font-size:18px;">📅 YEAR 4-5: Months 37-60</b><br>' +
      '<b style="font-size:16px;">SCALE TO EMPIRE</b></p><br>' +
      '<b>Goal:</b> $2M-$5M+ business, multiple ventures<br><br>' +
      '<b>Primary Business Evolution:</b><br>' +
      '🏢 <b>"Alpha Ascension Company"</b><br>' +
      '   • Full team (10-20 people)<br>' +
      '   • Multiple coaches/consultants<br>' +
      '   • Certification program (train others)<br>' +
      '   • Software tools (SaaS products)<br>' +
      '   • Events/conferences<br><br>' +
      '<b>Revenue Streams (Year 4-5):</b><br>' +
      '1. <b>Mastermind & Coaching:</b> $800K-$1.5M<br>' +
      '2. <b>Done-With-You/DFY:</b> $500K-$1.5M<br>' +
      '3. <b>Certification Program:</b> $300K-$800K<br>' +
      '   • Train other coaches to use your method<br>' +
      '   • License your framework<br>' +
      '   • Price: $10K-$25K per coach<br>' +
      '4. <b>Software/Tools:</b> $200K-$800K<br>' +
      '   • Agency management platform<br>' +
      '   • Profitability calculator tool<br>' +
      '   • SOP library subscription<br>' +
      '5. <b>Live Events:</b> $300K-$1M<br>' +
      '   • Annual conference (500+ attendees)<br>' +
      '   • Quarterly workshops<br>' +
      '   • VIP experiences<br>' +
      '6. <b>Speaking & Media:</b> $200K-$500K<br>' +
      '7. <b>Book Royalties & Products:</b> $100K-$300K<br>' +
      '8. <b>Passive Income:</b> $200K-$500K<br><br>' +
      '<b style="color:#FCD34D;">Year 4-5 Annual Total:</b><br>' +
      '✓ <b style="font-size:18px;">$2.6M-$6.9M per year</b><br><br>' +
      '<b>Strategic Options (Year 5+):</b><br>' +
      '📊 <b>Option A: Private Equity/Acquisition</b><br>' +
      '   • Business valuation: $10M-$30M+<br>' +
      '   • Partial or full exit<br>' +
      '   • Roll into larger education company<br><br>' +
      '📊 <b>Option B: Build & Scale</b><br>' +
      '   • Scale to $10M-$20M annually<br>' +
      '   • Become market leader<br>' +
      '   • Multiple brands/companies<br><br>' +
      '📊 <b>Option C: Lifestyle Business</b><br>' +
      '   • Maintain $3M-$5M/year<br>' +
      '   • Work 10-15 hours/week<br>' +
      '   • Full freedom & impact<br><br>' +
      '<b>Team Structure:</b><br>' +
      '• CEO (Derek) - Vision & Strategy<br>' +
      '• COO - Operations<br>' +
      '• Head of Content<br>' +
      '• Head of Sales<br>' +
      '• 3-5 Coaches/Consultants<br>' +
      '• Community Manager<br>' +
      '• Tech/Product Manager<br>' +
      '• Marketing Team (3-5)<br>' +
      '• Admin/Support (2-3)',
      centerX + sectionSpacing * 1.5,
      centerY + verticalSpacing * 0.8,
      'yellow',
      420
    );
    createdItems.push(year45);
    await delay(400);

    // ===== KEY SUCCESS FACTORS =====
    console.log('Creating key success factors...');
    const successFactors = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:16px;">🎯 KEY SUCCESS FACTORS</b><br><br>' +
      '<b>What Makes This Plan Work:</b><br><br>' +
      '1️⃣ <b>Foundation First</b><br>' +
      '   Don\'t rush monetization. Build audience,<br>' +
      '   positioning, and credibility first (6 months).<br><br>' +
      '2️⃣ <b>Content Consistency</b><br>' +
      '   70% educational content, every single week.<br>' +
      '   No breaks, no excuses. This builds trust.<br><br>' +
      '3️⃣ <b>Signature Framework</b><br>' +
      '   YOUR unique method that only YOU teach.<br>' +
      '   This is what people pay premium for.<br><br>' +
      '4️⃣ <b>Social Proof</b><br>' +
      '   Document EVERY transformation. Get video<br>' +
      '   testimonials. Case studies are GOLD.<br><br>' +
      '5️⃣ <b>Platform Diversification</b><br>' +
      '   Instagram + YouTube + LinkedIn = more reach.<br>' +
      '   Don\'t put all eggs in one basket.<br><br>' +
      '6️⃣ <b>Email List Priority</b><br>' +
      '   You don\'t own social media followers.<br>' +
      '   Email list is YOUR asset. Build it aggressively.<br><br>' +
      '7️⃣ <b>Pricing Confidence</b><br>' +
      '   Start at $3K-$4K beta. Scale to $25K-$50K.<br>' +
      '   Your expertise is worth premium pricing.<br><br>' +
      '8️⃣ <b>Launch Strategy</b><br>' +
      '   Use proven formulas: 5-day challenge +<br>' +
      '   webinar + application + sales calls.<br><br>' +
      '9️⃣ <b>Community Building</b><br>' +
      '   Create tight-knit community. Alumni become<br>' +
      '   your best marketers and referral source.<br><br>' +
      '🔟 <b>Patience & Persistence</b><br>' +
      '   This is a 5-year plan. Trust the process.<br>' +
      '   Don\'t give up after 3 months.',
      centerX - sectionSpacing * 1.2,
      centerY + verticalSpacing * 0.8,
      'gray',
      380
    );
    createdItems.push(successFactors);
    await delay(400);

    // ===== PLATFORM STRATEGIES (Detailed) =====
    console.log('Creating platform strategies...');
    const platformStrategies = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:16px;">📱 PLATFORM STRATEGIES</b><br><br>' +
      '<b style="color:#E1306C;">INSTAGRAM Strategy:</b><br>' +
      '• <b>Current issue:</b> 0.97% engagement (too low!)<br>' +
      '• <b>Fix:</b> 70/20/10 content mix (edu/authority/personal)<br>' +
      '• <b>Reels:</b> 5-7 per week, hook-first format<br>' +
      '• <b>Posts:</b> 3-5 per week, carousel preferred<br>' +
      '• <b>Stories:</b> Daily, engage with polls/Q&A<br>' +
      '• <b>Target:</b> 2-3% engagement minimum<br>' +
      '• <b>Growth tactics:</b> Collaborate, comment on<br>' +
      '  20-30 target accounts daily, use trending audio<br><br>' +
      '<b style="color:#FF0000;">YOUTUBE Strategy:</b><br>' +
      '• <b>Current issue:</b> Only 1.1K subs (too small)<br>' +
      '• <b>SEO Focus:</b> "how to scale agency",<br>' +
      '  "agency systems", "agency profit margins"<br>' +
      '• <b>Upload:</b> 1-2 long-form (10-20 min) per week<br>' +
      '• <b>Shorts:</b> Repurpose Reels (3-5 per week)<br>' +
      '• <b>Thumbnails:</b> Face + emotion + bold text<br>' +
      '• <b>Structure:</b> Hook (0-15s) → value (3-15min)<br>' +
      '  → CTA (last 30s)<br>' +
      '• <b>Playlists:</b> Organize by topic (increases watch time)<br><br>' +
      '<b style="color:#0A66C2;">LINKEDIN Strategy (CRITICAL!):</b><br>' +
      '• <b>Why:</b> Agency owners are on LinkedIn!<br>' +
      '  Higher intent than Instagram.<br>' +
      '• <b>Posts:</b> 3-5 per week (carousels + text posts)<br>' +
      '• <b>Content:</b> Case studies, insights, tactical tips<br>' +
      '• <b>Engagement:</b> Comment on 10-20 posts daily<br>' +
      '• <b>DM Strategy:</b> Connect with 10-20 agency<br>' +
      '  owners weekly, offer free value (not sales pitch)<br>' +
      '• <b>Profile:</b> Optimize headline, about section,<br>' +
      '  featured case studies<br><br>' +
      '<b>📧 EMAIL Strategy:</b><br>' +
      '• <b>Weekly newsletter:</b> "Agency Insider"<br>' +
      '• <b>Content:</b> Systems, frameworks, case studies<br>' +
      '• <b>Lead magnets:</b> Multiple options (toolkit,<br>' +
      '  calculator, roadmap, audit)<br>' +
      '• <b>Sequences:</b> Welcome series (7 emails),<br>' +
      '  launch sequence (10-14 emails)<br>' +
      '• <b>Goal:</b> 30-40% open rate, 3-5% click rate',
      centerX - sectionSpacing * 1.2,
      centerY - verticalSpacing * 1.8,
      'light_gray',
      400
    );
    createdItems.push(platformStrategies);
    await delay(400);

    // ===== PRICING EVOLUTION =====
    console.log('Creating pricing evolution...');
    const pricingEvolution = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:16px;">💰 PRICING EVOLUTION</b><br><br>' +
      '<b>How YOUR Prices Will Grow:</b><br><br>' +
      '<b>Year 1:</b><br>' +
      '• Low-ticket: $47-$97 (templates/challenges)<br>' +
      '• Beta high-ticket: $3K-$4K (12-week program)<br>' +
      '• Full-price: $6K-$8K (after beta proof)<br><br>' +
      '<b>Year 2:</b><br>' +
      '• Group coaching: $8K-$10K<br>' +
      '• Mastermind: $15K-$20K (6 months)<br>' +
      '• Evergreen course: $997-$1,497<br><br>' +
      '<b>Year 3:</b><br>' +
      '• Elite mastermind: $25K-$35K (annual)<br>' +
      '• Done-with-you: $50K-$100K (6 months)<br>' +
      '• Speaking: $10K-$25K per event<br>' +
      '• Workshops: $15K-$50K per day<br><br>' +
      '<b>Year 4-5:</b><br>' +
      '• Premium mastermind: $35K-$50K annual<br>' +
      '• Done-for-you: $100K-$250K<br>' +
      '• Certification: $10K-$25K per coach<br>' +
      '• Retainer consulting: $10K-$25K/month<br><br>' +
      '<b style="color:#FCD34D;">Why Prices Increase:</b><br>' +
      '✓ More social proof (testimonials)<br>' +
      '✓ More case studies (proven results)<br>' +
      '✓ Bigger audience (demand increases)<br>' +
      '✓ Stronger positioning (authority)<br>' +
      '✓ Better results (refined methodology)<br>' +
      '✓ Book published (credibility boost)<br>' +
      '✓ Media features (visibility)<br><br>' +
      '<b>Competitive Benchmark:</b><br>' +
      '• Karl Sakas: $10K-$50K (consulting)<br>' +
      '• GYDA: $5K-$25K (mastermind)<br>' +
      '• Parakeeto: $1K-$10K (courses/consulting)<br><br>' +
      'You\'ll be competitive by Year 2,<br>' +
      'premium by Year 3, elite by Year 4-5.',
      centerX + sectionSpacing * 2.15,
      centerY + verticalSpacing * 0.8,
      'yellow',
      400
    );
    createdItems.push(pricingEvolution);
    await delay(400);

    // ===== RISKS & MITIGATION =====
    console.log('Creating risks and mitigation...');
    const risks = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:16px;">⚠️ RISKS & HOW TO HANDLE THEM</b><br><br>' +
      '<b>Risk #1: Audience Growth Stalls</b><br>' +
      '🔧 <b>Fix:</b><br>' +
      '   • Paid ads ($1K-$3K/month backup)<br>' +
      '   • Aggressive collaborations (10+ partners)<br>' +
      '   • Platform diversification (LinkedIn!)<br>' +
      '   • Hire content VA if needed<br><br>' +
      '<b>Risk #2: Launch Flops (Low Sales)</b><br>' +
      '🔧 <b>Fix:</b><br>' +
      '   • Lower price temporarily<br>' +
      '   • Extend sales period<br>' +
      '   • Personal outreach to best 20 prospects<br>' +
      '   • Offer payment plans (3-6 months)<br>' +
      '   • Run second smaller launch<br><br>' +
      '<b>Risk #3: Content Doesn\'t Resonate</b><br>' +
      '🔧 <b>Fix:</b><br>' +
      '   • Survey audience monthly (ask what they want)<br>' +
      '   • Track metrics weekly (engagement, reach)<br>' +
      '   • Test different formats (long vs short)<br>' +
      '   • Pivot content themes quickly<br>' +
      '   • Study what competitors do well<br><br>' +
      '<b>Risk #4: Imposter Syndrome</b><br>' +
      '🔧 <b>Fix:</b><br>' +
      '   • Document your wins (journal successes)<br>' +
      '   • Collect testimonials (proof you help people)<br>' +
      '   • Join mastermind (support from peers)<br>' +
      '   • Remember: You don\'t need to be #1 expert,<br>' +
      '     just 2 steps ahead of your clients<br><br>' +
      '<b>Risk #5: Burnout</b><br>' +
      '🔧 <b>Fix:</b><br>' +
      '   • Batch content (film 5 videos in one day)<br>' +
      '   • Hire help early (VA, editor)<br>' +
      '   • Take 1 week off every quarter<br>' +
      '   • Don\'t oversell capacity (max clients)<br>' +
      '   • Remember: This is 5-year plan, not sprint<br><br>' +
      '<b>Risk #6: Market Saturation</b><br>' +
      '🔧 <b>Fix:</b><br>' +
      '   • Strong differentiation (unique framework)<br>' +
      '   • Niche down further if needed<br>' +
      '   • Focus on specific agency type (creative agencies)<br>' +
      '   • Build personal brand (people buy from YOU)',
      centerX - sectionSpacing * 0.6,
      centerY + verticalSpacing * 2.2,
      'red',
      420
    );
    createdItems.push(risks);
    await delay(400);

    // ===== METRICS TO TRACK =====
    console.log('Creating metrics tracking...');
    const metrics = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:16px;">📊 METRICS TO TRACK WEEKLY</b><br><br>' +
      '<b style="color:#3B82F6;">Audience Metrics:</b><br>' +
      '• Instagram followers (goal: 4.5K → 50K+ in 5 years)<br>' +
      '• Instagram engagement rate (goal: 2-4%)<br>' +
      '• YouTube subscribers (goal: 1.1K → 25K+)<br>' +
      '• Email list size (goal: 500 → 50K+)<br>' +
      '• Email open rate (goal: 30-40%)<br>' +
      '• LinkedIn followers (goal: 0 → 25K+)<br><br>' +
      '<b style="color:#10B981;">Content Metrics:</b><br>' +
      '• Posts published per week (goal: 15-20 total)<br>' +
      '• Reels views average (goal: 10K+ per Reel)<br>' +
      '• YouTube watch time (goal: 4K+ hours/year)<br>' +
      '• Best performing content themes<br>' +
      '• Worst performing (stop doing these)<br><br>' +
      '<b style="color:#8B5CF6;">Business Metrics:</b><br>' +
      '• Monthly revenue (track growth)<br>' +
      '• Revenue per product/service<br>' +
      '• Launch conversion rates (goal: 3-5%)<br>' +
      '• Email sequence conversion (goal: 2-3%)<br>' +
      '• Sales call booking rate (goal: 20-30%)<br>' +
      '• Sales call close rate (goal: 30-50%)<br>' +
      '• Customer lifetime value<br>' +
      '• Testimonials collected (goal: 50+ by year 3)<br><br>' +
      '<b style="color:#F59E0B;">Leading Indicators:</b><br>' +
      '• DMs received per week (interest level)<br>' +
      '• Webinar/challenge registrations<br>' +
      '• Discovery call bookings<br>' +
      '• Collaborations completed<br>' +
      '• Podcast interviews done<br><br>' +
      '<b>Tools to Use:</b><br>' +
      '• Google Sheet dashboard (track everything)<br>' +
      '• Instagram Insights<br>' +
      '• YouTube Analytics<br>' +
      '• ConvertKit/ActiveCampaign (email stats)<br>' +
      '• Stripe dashboard (revenue)<br><br>' +
      '<b>Review Schedule:</b><br>' +
      '• Daily: Quick check (15 min)<br>' +
      '• Weekly: Deep dive (1 hour)<br>' +
      '• Monthly: Strategic review (2 hours)<br>' +
      '• Quarterly: Major assessment (4 hours)',
      centerX + sectionSpacing * 0.5,
      centerY + verticalSpacing * 2.2,
      'light_blue',
      420
    );
    createdItems.push(metrics);
    await delay(400);

    // ===== IMMEDIATE ACTION ITEMS =====
    console.log('Creating immediate action items...');
    const actionItems = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:16px;">✅ START THIS WEEK (Priority Actions)</b><br><br>' +
      '<b style="color:#DC2626;">Week 1 Action Items:</b><br><br>' +
      '1️⃣ <b>Update Instagram Bio (TODAY - 10 min)</b><br>' +
      '   From: "Some Would Say I Scale Businesses"<br>' +
      '   To: "I Help Agency Owners Scale to $1M+ While<br>' +
      '   Working 20 Hrs/Week | 50+ Agencies Scaled"<br><br>' +
      '2️⃣ <b>Create Signature Framework (2-3 days)</b><br>' +
      '   • 3-5 step system (e.g. "A.S.C.E.N.D. Method")<br>' +
      '   • Create visual diagram in Canva<br>' +
      '   • Use this in ALL future content<br><br>' +
      '3️⃣ <b>Film 5 Educational Reels (1 day batch)</b><br>' +
      '   • Agency scaling tips (no lifestyle stuff!)<br>' +
      '   • Hook-first format (grab attention in 3 sec)<br>' +
      '   • Schedule for next week<br><br>' +
      '4️⃣ <b>Plan 30-Day Content Calendar (2 hours)</b><br>' +
      '   • 70% educational, 20% authority, 10% personal<br>' +
      '   • Write out topics for each day<br>' +
      '   • Mix: agency systems, frameworks, tips<br><br>' +
      '5️⃣ <b>Set Up LinkedIn Profile (2 hours)</b><br>' +
      '   • Optimize headline and about section<br>' +
      '   • Add featured section (case studies, lead magnet)<br>' +
      '   • Plan first 5 posts<br><br>' +
      '6️⃣ <b>Document 3 Case Studies (3-4 hours)</b><br>' +
      '   • Interview past clients<br>' +
      '   • Get before/after numbers<br>' +
      '   • Request video testimonials<br>' +
      '   • Create mini case study posts<br><br>' +
      '7️⃣ <b>Audit Current Lead Magnet (1 hour)</b><br>' +
      '   • Check how many signups last 30 days<br>' +
      '   • Review conversion rate<br>' +
      '   • Plan improvements or new magnets<br><br>' +
      '8️⃣ <b>List 10 Potential Collaborators (1 hour)</b><br>' +
      '   • Find complementary experts<br>' +
      '   • Similar audience size or bigger<br>' +
      '   • Prepare personalized outreach<br><br>' +
      '<b style="color:#FCD34D;">Total Time: 10-15 hours</b><br>' +
      'This is YOUR foundation week. Don\'t skip this!',
      centerX + sectionSpacing * 1.5,
      centerY + verticalSpacing * 2.2,
      'yellow',
      400
    );
    createdItems.push(actionItems);
    await delay(400);

    // ===== THE HONEST TRUTH =====
    console.log('Creating honest truth section...');
    const honestTruth = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:16px;">💬 THE HONEST TRUTH</b><br><br>' +
      '<b>Derek, here\'s what YOU need to understand:</b><br><br>' +
      '<b style="color:#DC2626;">Current Reality:</b><br>' +
      '• Your bio says you "scale businesses to 6-7 figures"<br>' +
      '• But your audience is 4.5K with 0.97% engagement<br>' +
      '• This is a CREDIBILITY GAP<br>' +
      '• Clients will notice this disconnect<br><br>' +
      '<b style="color:#10B981;">The Good News:</b><br>' +
      '✓ You have infrastructure (lead magnet, systems)<br>' +
      '✓ You understand agencies (your niche)<br>' +
      '✓ You\'re creating content (just needs focus)<br>' +
      '✓ Alpha Ascension is strong brand name<br>' +
      '✓ You\'re willing to put in the work<br><br>' +
      '<b>The Path Forward:</b><br>' +
      'This is NOT a "launch in 30 days" situation.<br>' +
      'This is a "build foundation properly, then scale"<br>' +
      'situation. Here\'s what will happen:<br><br>' +
      '<b>If you invest 6 months building RIGHT:</b><br>' +
      '✓ 15K+ engaged followers<br>' +
      '✓ Signature framework people recognize<br>' +
      '✓ 5-10 video testimonials<br>' +
      '✓ 3K+ email list<br>' +
      '✓ Positioned to do $100K+ launches<br>' +
      '✓ $225K-$385K in 18 months<br>' +
      '✓ $1M+ by year 3<br><br>' +
      '<b style="color:#DC2626;">If you rush launch now:</b><br>' +
      '✗ Launch to crickets (maybe 5-10 sales)<br>' +
      '✗ Damage credibility ("he can\'t even fill his own<br>' +
      '   program, how will he help me?")<br>' +
      '✗ Waste time and energy<br>' +
      '✗ Still need to rebuild foundation anyway<br>' +
      '✗ Delayed by 6+ months total<br><br>' +
      '<b style="font-size:15px;">Recommendation:</b><br>' +
      'PLAY THE LONG GAME. Build properly.<br>' +
      'Launch when ready.<br><br>' +
      'In 18 months: $250K-$400K/year sustainable.<br>' +
      'In 5 years: $2M-$5M+ with freedom.<br><br>' +
      '<b>That\'s worth 6 months of foundation work.</b>',
      centerX - sectionSpacing * 1.2,
      centerY + verticalSpacing * 3.8,
      'red',
      420
    );
    createdItems.push(honestTruth);
    await delay(400);

    // ===== REVENUE PROJECTION CHART =====
    console.log('Creating revenue projection...');
    const revenueProjection = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:16px;">📈 5-YEAR REVENUE PROJECTION</b><br><br>' +
      '<b>Conservative to Optimistic Range:</b><br><br>' +
      '<b style="color:#3B82F6;">Year 1 (18 months):</b><br>' +
      '💰 Low: $225K<br>' +
      '💰 Mid: $305K<br>' +
      '💰 High: $385K<br>' +
      '📊 Sources: Low-ticket passive + 2-3 high-ticket launches<br><br>' +
      '<b style="color:#10B981;">Year 2:</b><br>' +
      '💰 Low: $460K<br>' +
      '💰 Mid: $780K<br>' +
      '💰 High: $1.1M<br>' +
      '📊 Sources: Group coaching (2-3 launches),<br>' +
      '   Mastermind, Evergreen course, Low-ticket passive<br><br>' +
      '<b style="color:#8B5CF6;">Year 3:</b><br>' +
      '💰 Low: $1.15M<br>' +
      '💰 Mid: $2.25M<br>' +
      '💰 High: $3.35M<br>' +
      '📊 Sources: Elite mastermind, Done-with-you,<br>' +
      '   Speaking, Book, Existing products<br><br>' +
      '<b style="color:#F59E0B;">Year 4:</b><br>' +
      '💰 Low: $2M<br>' +
      '💰 Mid: $3.5M<br>' +
      '💰 High: $5M<br>' +
      '📊 Sources: Certification, Software/SaaS,<br>' +
      '   Live events, Multiple programs<br><br>' +
      '<b style="color:#EF4444;">Year 5:</b><br>' +
      '💰 Low: $2.6M<br>' +
      '💰 Mid: $4.75M<br>' +
      '💰 High: $6.9M<br>' +
      '📊 Sources: Full company (10-20 team),<br>' +
      '   Multiple revenue streams, Market leadership<br><br>' +
      '<b style="color:#FCD34D;">5-Year Total:</b><br>' +
      '💰 Conservative: $6.43M<br>' +
      '💰 Realistic: $11.585M<br>' +
      '💰 Optimistic: $16.74M<br><br>' +
      '<b>Key Assumptions:</b><br>' +
      '• You follow the plan consistently<br>' +
      '• You don\'t give up after 3-6 months<br>' +
      '• You prioritize content & audience building<br>' +
      '• You deliver great results (testimonials)<br>' +
      '• You hire help when needed<br>' +
      '• You increase prices as proof grows',
      centerX + sectionSpacing * 0.5,
      centerY + verticalSpacing * 3.8,
      'yellow',
      420
    );
    createdItems.push(revenueProjection);
    await delay(400);

    // ===== YOUR NEXT 12 MONTHS DETAILED =====
    console.log('Creating detailed 12-month roadmap...');
    const next12months = await createSticky(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:16px;">🗓️ YOUR NEXT 12 MONTHS (Detailed)</b><br><br>' +
      '<b>Month 1-2: Foundation & Positioning</b><br>' +
      '• Update all bios and profiles<br>' +
      '• Create signature framework + visual<br>' +
      '• Document 5 case studies + get testimonials<br>' +
      '• Start LinkedIn (profile + first posts)<br>' +
      '• Content pivot: 70% educational<br>' +
      '• Post 3-5 IG posts + 5-7 Reels/week<br><br>' +
      '<b>Month 3-4: Audience Building</b><br>' +
      '• Continue content (consistency is KEY)<br>' +
      '• Reach out to 5-10 collaborators<br>' +
      '• Apply to 10-15 podcasts<br>' +
      '• Upgrade lead magnets (toolkit, calculator)<br>' +
      '• Start paid ads ($500-$1K/month test)<br>' +
      '• Weekly newsletter launch<br><br>' +
      '<b>Month 5-6: Scale Content & Community</b><br>' +
      '• Execute collaborations (guest posts, Lives)<br>' +
      '• Podcast interviews (aim for 5-10 done)<br>' +
      '• Increase paid ads ($1K-$2K/month)<br>' +
      '• Build email nurture sequences<br>' +
      '• Check metrics: Should be at 10K+ social,<br>' +
      '  1.5K-2K email by now<br><br>' +
      '<b>Month 7: Low-Ticket Launch</b><br>' +
      '• Create $97 product (toolkit or challenge)<br>' +
      '• Week 1-2: Build product<br>' +
      '• Week 3: Pre-launch (waitlist)<br>' +
      '• Week 4: Launch week (7 days)<br>' +
      '• Goal: 50-100 sales = $5K-$10K<br>' +
      '• Collect testimonials immediately<br><br>' +
      '<b>Month 8-9: Optimize & Continue Building</b><br>' +
      '• Make low-ticket evergreen (ongoing sales)<br>' +
      '• Continue audience building (goal: 15K social)<br>' +
      '• More collaborations and podcasts<br>' +
      '• Email list should be 3K-5K by now<br>' +
      '• Start planning high-ticket program<br><br>' +
      '<b>Month 10-11: High-Ticket Program Design</b><br>' +
      '• Design 12-week curriculum<br>' +
      '• Create landing page + sales funnel<br>' +
      '• Write email launch sequence<br>' +
      '• Create application form + call script<br>' +
      '• Pre-sell to warm audience<br><br>' +
      '<b>Month 12: Beta Launch</b><br>' +
      '• Week 1: Announcement + applications open<br>' +
      '• Week 2-3: Sales calls (personal outreach)<br>' +
      '• Week 4: Close applications + onboard<br>' +
      '• Goal: 5-10 clients at $3K-$4K<br>' +
      '• Revenue: $17K-$35K<br><br>' +
      '<b style="color:#FCD34D;">12-Month Checkpoints:</b><br>' +
      '✓ Social following: 15K-20K total<br>' +
      '✓ Email list: 3K-5K engaged<br>' +
      '✓ Revenue generated: $25K-$50K<br>' +
      '✓ Testimonials: 15-30 video/written<br>' +
      '✓ Case studies: 5-10 detailed<br>' +
      '✓ Signature framework: Widely recognized<br>' +
      '✓ Positioning: Clear authority in agency space',
      centerX + sectionSpacing * 1.8,
      centerY + verticalSpacing * 3.8,
      'light_blue',
      440
    );
    createdItems.push(next12months);
    await delay(400);

    console.log('\n✅ Mind map created successfully!');
    console.log(`📍 Total elements created: ${createdItems.length}`);
    console.log(`🔗 View your board at: https://miro.com/app/board/${MIRO_BOARD_ID}/`);

  } catch (error) {
    console.error('❌ Error creating mind map:', error.message);
    process.exit(1);
  }
}

// Run the main function
create5YearStrategy();
