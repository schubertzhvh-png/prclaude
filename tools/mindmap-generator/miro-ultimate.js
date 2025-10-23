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

// Color mapping: name to HEX (shapes API requires HEX format)
const COLORS = {
  'dark_blue': '#1E3A8A',
  'red': '#DC2626',
  'orange': '#F97316',
  'light_blue': '#3B82F6',
  'cyan': '#06B6D4',
  'light_green': '#86EFAC',
  'green': '#10B981',
  'blue': '#2563EB',
  'violet': '#8B5CF6',
  'yellow': '#FCD34D',
  'pink': '#EC4899',
  'gray': '#6B7280'
};

// Create shape (instead of sticky note)
async function createShape(accessToken, boardId, content, x, y, colorName, width = 300, height = 200) {
  const hexColor = COLORS[colorName] || '#3B82F6'; // default to light_blue if color not found

  return makeRequest('POST', `/v2/boards/${boardId}/shapes`, accessToken, {
    data: {
      content: content,
      shape: 'round_rectangle'
    },
    style: {
      fillColor: hexColor,
      borderColor: hexColor,
      borderWidth: '2',
      fontFamily: 'arial',
      fontSize: '14',
      textAlign: 'left',
      textAlignVertical: 'top'
    },
    position: { x, y },
    geometry: { width, height }
  });
}

// Main function to create the ultimate detailed mind map
async function createUltimateMindMap() {
  console.log('🚀 Creating Derek Rodriguez - ULTIMATE 5-Year Strategy (50+ Sections)...\n');

  const createdItems = [];

  // Layout configuration - tighter spacing for more sections
  const centerX = 0;
  const centerY = 0;
  const colSpacing = 420;
  const rowSpacing = 280;

  try {
    // ===== CENTRAL NODE =====
    console.log('Creating central node...');
    const central = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<p style="text-align:center;"><b style="font-size:28px;">🎯 DEREK RODRIGUEZ</b></p>' +
      '<p style="text-align:center;"><b style="font-size:20px;">Complete 5-Year Growth Blueprint</b></p>' +
      '<p style="text-align:center;"><b style="font-size:16px;">From 4.5K Followers to Multi-Million Dollar Empire</b></p>' +
      '<p style="text-align:center;">Strategic Roadmap 2025-2030</p>',
      centerX,
      centerY,
      'dark_blue',
      480,
      160
    );
    createdItems.push(central);
    await delay(350);

    // ===== CURRENT STATE - SECTION 1: INSTAGRAM METRICS =====
    console.log('Creating Instagram metrics...');
    const instagramMetrics = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📸 INSTAGRAM CURRENT STATE</b><br><br>' +
      '<b>Account:</b> @derek__rod<br>' +
      '<b>Followers:</b> 4,500<br><br>' +
      '<b>Reels Performance:</b><br>' +
      '• Total Reels: 9<br>' +
      '• Max views: 3,268<br>' +
      '• Average views: 1,743<br>' +
      '• Reach rate: 38.7% (decent)<br>' +
      '• Engagement: 1.79%<br>' +
      '• <span style="color:#DC2626;">❌ Below 2-3% industry avg</span><br><br>' +
      '<b>Posts Performance:</b><br>' +
      '• Average likes: 24 (0.53% rate)<br>' +
      '• Average comments: 4<br>' +
      '• Engagement: 0.97%<br>' +
      '• <span style="color:#DC2626;">❌ POOR - need 1.5-3%</span><br><br>' +
      '<b>Content Mix Issue:</b><br>' +
      '• Too much lifestyle content<br>' +
      '• Not enough educational value<br>' +
      '• Diluted authority positioning',
      centerX - colSpacing * 2.8,
      centerY - rowSpacing * 2.2,
      'red',
      340,
      380
    );
    createdItems.push(instagramMetrics);
    await delay(350);

    // ===== CURRENT STATE - SECTION 2: YOUTUBE & EMAIL =====
    console.log('Creating YouTube & Email metrics...');
    const youtubeEmail = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">🎥 YOUTUBE & EMAIL STATUS</b><br><br>' +
      '<b>YouTube Channel:</b><br>' +
      '• Subscribers: 1,100<br>' +
      '• <span style="color:#DC2626;">❌ Too small for monetization</span><br>' +
      '• Engagement: Low-Medium<br>' +
      '• Content: Mixed (education + lifestyle)<br>' +
      '• CTA: Free training link<br><br>' +
      '<b>Email List:</b><br>' +
      '• Current size: ~500 (estimated)<br>' +
      '• <span style="color:#DC2626;">❌ Need 3K-5K for high-ticket launch</span><br>' +
      '• Lead magnet: Free training<br>' +
      '• Conversion unknown<br><br>' +
      '<b>The Math:</b><br>' +
      'For $50K launch, you need:<br>' +
      '• Email list: 3K-5K minimum<br>' +
      '• Conversion: 2-3% (industry avg)<br>' +
      '• At $5K offer: 10-15 sales needed<br>' +
      '• Current 500 list → 1-2 sales MAX<br><br>' +
      '<b style="color:#F59E0B;">Gap: Need 6x larger audience!</b>',
      centerX - colSpacing * 2.8,
      centerY - rowSpacing * 0.6,
      'red',
      340,
      400
    );
    createdItems.push(youtubeEmail);
    await delay(350);

    // ===== CURRENT STATE - SECTION 3: POSITIONING PROBLEMS =====
    console.log('Creating positioning analysis...');
    const positioning = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">🎯 POSITIONING ISSUES</b><br><br>' +
      '<b>Current Bio:</b><br>' +
      '"Some Would Say I Scale Businesses"<br><br>' +
      '<b style="color:#DC2626;">Problems:</b><br>' +
      '1. <b>"Some Would Say"</b> = not confident<br>' +
      '   • Sounds uncertain, vague<br>' +
      '   • No authority in the language<br><br>' +
      '2. <b>"Scale Businesses"</b> = too broad<br>' +
      '   • Could mean anything<br>' +
      '   • Not specific to agencies<br>' +
      '   • No differentiation<br><br>' +
      '3. <b>No proof visible</b><br>' +
      '   • Where are case studies?<br>' +
      '   • Where are results?<br>' +
      '   • Where are testimonials?<br><br>' +
      '4. <b>Generic title:</b> "Business Consultant"<br>' +
      '   • Overused, no differentiation<br>' +
      '   • Doesn\'t stand out<br><br>' +
      '<b style="color:#10B981;">What YOU Need:</b><br>' +
      '✓ Confident, specific positioning<br>' +
      '✓ Signature framework people recognize<br>' +
      '✓ Visible social proof<br>' +
      '✓ Clear niche (agency owners)',
      centerX - colSpacing * 2.8,
      centerY + rowSpacing * 1.2,
      'orange',
      340,
      440
    );
    createdItems.push(positioning);
    await delay(350);

    // ===== CURRENT STATE - SECTION 4: CONTENT STRATEGY ISSUES =====
    console.log('Creating content strategy issues...');
    const contentIssues = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📝 CONTENT STRATEGY PROBLEMS</b><br><br>' +
      '<b>Current Mix (WRONG):</b><br>' +
      '• 50% Lifestyle (too much!)<br>' +
      '• 30% Motivation<br>' +
      '• 20% Business advice<br><br>' +
      '<b style="color:#DC2626;">Why This Fails:</b><br>' +
      '1. <b>Confused audience</b><br>' +
      '   • Are you influencer or expert?<br>' +
      '   • Can\'t tell what you do<br><br>' +
      '2. <b>Low value density</b><br>' +
      '   • Not enough tactical content<br>' +
      '   • Generic advice doesn\'t convert<br><br>' +
      '3. <b>No signature framework</b><br>' +
      '   • Nothing unique to YOU<br>' +
      '   • Anyone could post this<br><br>' +
      '4. <b>Lifestyle overdose</b><br>' +
      '   • Gym pics don\'t sell programs<br>' +
      '   • Coffee shots don\'t build authority<br><br>' +
      '<b style="color:#10B981;">RIGHT Mix Should Be:</b><br>' +
      '• 70% Educational/Tactical<br>' +
      '• 20% Authority/Thought Leadership<br>' +
      '• 10% Personal/Behind-Scenes<br><br>' +
      '<b>What This Means:</b><br>' +
      '7 out of 10 posts = pure agency value<br>' +
      '2 out of 10 posts = hot takes, frameworks<br>' +
      '1 out of 10 posts = lifestyle/personal',
      centerX - colSpacing * 2.8,
      centerY + rowSpacing * 3.2,
      'orange',
      340,
      480
    );
    createdItems.push(contentIssues);
    await delay(350);

    // ===== YEAR 1 - MONTH 1: POSITIONING OVERHAUL =====
    console.log('Creating Month 1 strategy...');
    const month1 = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 1: POSITIONING OVERHAUL</b><br><br>' +
      '<b>Goal:</b> Fix positioning & create framework<br><br>' +
      '<b>Week 1: Bio Transformation</b><br>' +
      'FROM: "Some Would Say I Scale Businesses"<br>' +
      'TO: "I Help Agency Owners Scale to $1M+<br>' +
      'While Working 20 Hrs/Week | 50+ Agencies Scaled"<br><br>' +
      '<b>Why This Works:</b><br>' +
      '✓ Specific niche (agency owners)<br>' +
      '✓ Clear benefit ($1M+ revenue)<br>' +
      '✓ Lifestyle angle (20 hrs/week)<br>' +
      '✓ Social proof (50+ agencies)<br>' +
      '✓ Confident tone<br><br>' +
      '<b>Week 2-3: Signature Framework</b><br>' +
      'Create YOUR unique method, example:<br><br>' +
      '<b>"The A.S.C.E.N.D. Framework"</b><br>' +
      '• <b>A</b>udit current operations<br>' +
      '• <b>S</b>ystemize core processes<br>' +
      '• <b>C</b>reate team infrastructure<br>' +
      '• <b>E</b>liminate bottlenecks<br>' +
      '• <b>N</b>urture client relationships<br>' +
      '• <b>D</b>uplicate success<br><br>' +
      'Create visual diagram in Canva<br>' +
      'Use in EVERY piece of content',
      centerX - colSpacing * 1.6,
      centerY - rowSpacing * 2.2,
      'light_blue',
      340,
      450
    );
    createdItems.push(month1);
    await delay(350);

    // ===== YEAR 1 - MONTH 1 CONTINUED: CASE STUDIES =====
    console.log('Creating Month 1 case studies task...');
    const month1CaseStudies = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 1: CASE STUDIES</b><br><br>' +
      '<b>Week 3-4: Document Success Stories</b><br><br>' +
      '<b>Action Plan:</b><br>' +
      '1. <b>Identify 5 past clients</b><br>' +
      '   • Best results you\'ve delivered<br>' +
      '   • Different industries/niches<br>' +
      '   • Willing to testimonial<br><br>' +
      '2. <b>Interview each client (30-60 min)</b><br>' +
      '   Questions to ask:<br>' +
      '   • What was their situation before?<br>' +
      '   • What specific results did they get?<br>' +
      '   • What was the transformation?<br>' +
      '   • Would they recommend you?<br><br>' +
      '3. <b>Get metrics (critical!):</b><br>' +
      '   • Revenue: $X → $Y<br>' +
      '   • Time working: X hrs → Y hrs<br>' +
      '   • Team size: X → Y people<br>' +
      '   • Clients: X → Y clients<br><br>' +
      '4. <b>Record video testimonials</b><br>' +
      '   • 2-3 minute videos<br>' +
      '   • Use Zoom (easy)<br>' +
      '   • Edit into 30-60 sec clips<br><br>' +
      '5. <b>Create case study posts</b><br>' +
      '   • Before/After format<br>' +
      '   • Include screenshots<br>' +
      '   • Post on all platforms<br><br>' +
      '<b>Target: 5 detailed case studies by end of month</b>',
      centerX - colSpacing * 1.6,
      centerY - rowSpacing * 0.4,
      'light_blue',
      340,
      460
    );
    createdItems.push(month1CaseStudies);
    await delay(350);

    // ===== YEAR 1 - MONTH 2: CONTENT PIVOT =====
    console.log('Creating Month 2 strategy...');
    const month2 = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 2: CONTENT PIVOT</b><br><br>' +
      '<b>Goal:</b> Shift to 70% educational content<br><br>' +
      '<b>Instagram Schedule (Weekly):</b><br><br>' +
      '<b>FEED POSTS (3-5 per week):</b><br>' +
      '• Monday: Framework breakdown<br>' +
      '  (Use your signature framework)<br>' +
      '• Wednesday: Case study highlight<br>' +
      '  (From your 5 you documented)<br>' +
      '• Friday: Tactical tip/system<br>' +
      '  (Specific, actionable advice)<br><br>' +
      '<b>REELS (5-7 per week):</b><br>' +
      '• Agency scaling tips (30-60 sec)<br>' +
      '• Myth-busting common beliefs<br>' +
      '• Client results screenshots<br>' +
      '• Framework visual explanations<br>' +
      '• "How to" tutorials<br><br>' +
      '<b>Reel Formula:</b><br>' +
      '1. HOOK (0-3 sec): Grab attention<br>' +
      '   "If your agency isn\'t at $1M yet..."<br>' +
      '2. VALUE (3-45 sec): Teach 1 thing clearly<br>' +
      '3. CTA (last 5 sec): "Follow for more"<br><br>' +
      '<b>STORIES (Daily):</b><br>' +
      '• Poll: "What\'s your biggest challenge?"<br>' +
      '• Q&A: Answer DMs publicly<br>' +
      '• Behind-scenes: Show client work<br>' +
      '• Promote lead magnet 3-5x/week',
      centerX - colSpacing * 1.6,
      centerY + rowSpacing * 1.8,
      'light_blue',
      340,
      480
    );
    createdItems.push(month2);
    await delay(350);

    // ===== YEAR 1 - MONTH 2: YOUTUBE START =====
    console.log('Creating Month 2 YouTube strategy...');
    const month2YouTube = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 2: YOUTUBE STRATEGY</b><br><br>' +
      '<b>Goal:</b> 1-2 long-form videos per week<br><br>' +
      '<b>Video Topics (SEO-Driven):</b><br>' +
      '1. "How to Scale Your Agency to $1M<br>' +
      '   Without Burnout"<br>' +
      '2. "5 Systems Every $500K Agency Needs"<br>' +
      '3. "Agency Profit Margins: The Truth"<br>' +
      '4. "How to Remove Yourself from<br>' +
      '   Agency Operations"<br>' +
      '5. "Agency Pricing: What to Charge"<br><br>' +
      '<b>Video Structure (10-20 min):</b><br>' +
      '• 0-15 sec: HOOK (state the benefit)<br>' +
      '  "In this video I\'ll show you the exact<br>' +
      '   5 systems that helped 50+ agencies..."<br>' +
      '• 15-30 sec: PREVIEW (what they\'ll learn)<br>' +
      '• 3-15 min: VALUE (deliver content)<br>' +
      '• Last 30 sec: CTA (lead magnet)<br><br>' +
      '<b>Thumbnail Formula:</b><br>' +
      '• Your face + emotion (surprised, excited)<br>' +
      '• Bold text: 3-5 words MAX<br>' +
      '• High contrast colors<br>' +
      '• Consistent branding<br><br>' +
      '<b>SEO Keywords to Target:</b><br>' +
      '• "how to scale agency"<br>' +
      '• "agency systems"<br>' +
      '• "agency profit margins"<br>' +
      '• "remove yourself from agency"',
      centerX - colSpacing * 1.6,
      centerY + rowSpacing * 4.0,
      'light_blue',
      340,
      460
    );
    createdItems.push(month2YouTube);
    await delay(350);

    // ===== YEAR 1 - MONTH 3: LINKEDIN LAUNCH =====
    console.log('Creating Month 3 LinkedIn strategy...');
    const month3LinkedIn = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 3: LINKEDIN LAUNCH</b><br><br>' +
      '<b>Why LinkedIn is CRITICAL:</b><br>' +
      '• Agency owners are on LinkedIn!<br>' +
      '• B2B decision-makers<br>' +
      '• Higher intent than Instagram<br>' +
      '• Less competition (most ignore it)<br><br>' +
      '<b>Profile Optimization:</b><br>' +
      '<b>Headline:</b> (max impact)<br>' +
      '"I Help Agency Owners Scale to $1M+<br>' +
      'While Working 20 Hrs/Week | 50+ Agencies<br>' +
      'Scaled | Free Training Below 👇"<br><br>' +
      '<b>About Section:</b> (story-driven)<br>' +
      'Start with client pain point:<br>' +
      '"Most agency owners I meet are working<br>' +
      '60+ hours a week, drowning in operations,<br>' +
      'and their business runs only when they\'re<br>' +
      'there. I help them scale to $1M+ while<br>' +
      'working 20 hours a week..."<br><br>' +
      '<b>Featured Section:</b><br>' +
      '• Case study carousel posts<br>' +
      '• Lead magnet link<br>' +
      '• Free training<br>' +
      '• Testimonial compilation<br><br>' +
      '<b>Content Strategy (3-5 posts/week):</b><br>' +
      '• Monday: Weekly insight<br>' +
      '• Wednesday: Case study/transformation<br>' +
      '• Friday: Tactical tip or framework',
      centerX - colSpacing * 0.4,
      centerY - rowSpacing * 2.2,
      'cyan',
      340,
      460
    );
    createdItems.push(month3LinkedIn);
    await delay(350);

    // ===== YEAR 1 - MONTH 3: ENGAGEMENT TACTICS =====
    console.log('Creating Month 3 engagement tactics...');
    const month3Engagement = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 3: ENGAGEMENT TACTICS</b><br><br>' +
      '<b>Goal:</b> Boost engagement from 0.97% to 2%+<br><br>' +
      '<b>Daily Engagement Routine (60 min/day):</b><br><br>' +
      '<b>Morning (30 min):</b><br>' +
      '1. Reply to ALL DMs (within 24 hours)<br>' +
      '2. Reply to ALL comments on your posts<br>' +
      '3. Comment on 10 target accounts<br>' +
      '   (agency owners with 5K-50K followers)<br><br>' +
      '<b>Afternoon (30 min):</b><br>' +
      '4. Comment on 10 more target accounts<br>' +
      '5. Engage with Stories (reply to 20+ stories)<br>' +
      '6. Share valuable DMs (with permission)<br><br>' +
      '<b>Comment Strategy:</b><br>' +
      '❌ Don\'t: "Great post!" (generic)<br>' +
      '✅ Do: Add value to the conversation<br>' +
      'Example: "This is spot on. I\'ve found<br>' +
      'that agencies also struggle with X.<br>' +
      'In my experience, Y works well..."<br><br>' +
      '<b>Target Accounts to Engage With:</b><br>' +
      '• Agency owners (your ideal clients)<br>' +
      '• Business coaches (collaboration potential)<br>' +
      '• Marketing experts (partnership)<br>' +
      '• SaaS founders (similar audience)<br><br>' +
      '<b>Weekly Q&A Sessions:</b><br>' +
      '• Every Friday: Instagram Story Q&A<br>' +
      '• "Ask me anything about scaling agencies"<br>' +
      '• Answer 10-20 questions<br>' +
      '• Repurpose answers into Reels',
      centerX - colSpacing * 0.4,
      centerY - rowSpacing * 0.3,
      'cyan',
      340,
      480
    );
    createdItems.push(month3Engagement);
    await delay(350);

    // ===== YEAR 1 - MONTH 4: COLLABORATIONS =====
    console.log('Creating Month 4 collaborations strategy...');
    const month4Collabs = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 4: COLLABORATIONS</b><br><br>' +
      '<b>Goal:</b> Partner with 5-10 complementary experts<br><br>' +
      '<b>Who to Target:</b><br>' +
      '1. <b>Business coaches</b> (similar audience)<br>' +
      '2. <b>Marketing experts</b> (complementary)<br>' +
      '3. <b>SaaS founders</b> (agency tools)<br>' +
      '4. <b>Sales coaches</b> (helps agencies)<br>' +
      '5. <b>Productivity experts</b> (time management)<br><br>' +
      '<b>Collaboration Types:</b><br><br>' +
      '<b>Type 1: Instagram Live</b><br>' +
      '• 30-60 min conversation<br>' +
      '• Topic: "How to [solve problem]"<br>' +
      '• Cross-promote to both audiences<br>' +
      '• Expected: 200-500 new followers<br><br>' +
      '<b>Type 2: Guest Post Swap</b><br>' +
      '• You write for their audience<br>' +
      '• They write for yours<br>' +
      '• Include bio + link<br><br>' +
      '<b>Type 3: Joint Lead Magnet</b><br>' +
      '• Create free resource together<br>' +
      '• Both promote to audiences<br>' +
      '• Split email list growth<br><br>' +
      '<b>Outreach Template:</b><br>' +
      '"Hey [Name], I love your content on [topic].<br>' +
      'I help agency owners [your value prop]<br>' +
      'and think our audiences overlap. Would<br>' +
      'you be interested in doing an IG Live<br>' +
      'together on [specific topic]?"',
      centerX - colSpacing * 0.4,
      centerY + rowSpacing * 2.0,
      'light_green',
      340,
      480
    );
    createdItems.push(month4Collabs);
    await delay(350);

    // ===== YEAR 1 - MONTH 4: PODCAST STRATEGY =====
    console.log('Creating Month 4 podcast strategy...');
    const month4Podcasts = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 4: PODCAST CIRCUIT</b><br><br>' +
      '<b>Goal:</b> Get booked on 15-20 podcasts in 6 months<br><br>' +
      '<b>Target Podcast Types:</b><br>' +
      '1. Business/entrepreneurship podcasts<br>' +
      '2. Agency-specific podcasts<br>' +
      '3. Marketing podcasts<br>' +
      '4. Productivity/systems podcasts<br><br>' +
      '<b>Finding Podcasts:</b><br>' +
      '• Search iTunes: "agency podcast"<br>' +
      '• PodcastGuests.com<br>' +
      '• Podmatch.com<br>' +
      '• LinkedIn: Search "podcast host"<br><br>' +
      '<b>Pitch Template:</b><br>' +
      'Subject: "Guest idea: Agency scaling systems"<br><br>' +
      'Hi [Host Name],<br><br>' +
      'I\'m Derek Rodriguez, and I help agency<br>' +
      'owners scale to $1M+ while working 20 hrs/week.<br>' +
      'I\'ve helped 50+ agencies systemize their<br>' +
      'operations and remove themselves from<br>' +
      'day-to-day tasks.<br><br>' +
      'I\'d love to share on your show:<br>' +
      '• The 5 systems every agency needs<br>' +
      '• How to delegate without losing control<br>' +
      '• Agency profit margin optimization<br><br>' +
      'Would this fit your audience?<br><br>' +
      '<b>Prepare Signature Stories:</b><br>' +
      '• Your origin story (3 min)<br>' +
      '• Best transformation story (5 min)<br>' +
      '• Your signature framework (7 min)<br>' +
      '• 3-5 tactical tips (10 min)',
      centerX - colSpacing * 0.4,
      centerY + rowSpacing * 4.2,
      'light_green',
      340,
      460
    );
    createdItems.push(month4Podcasts);
    await delay(350);

    // ===== YEAR 1 - MONTH 5: LEAD MAGNET UPGRADE =====
    console.log('Creating Month 5 lead magnet strategy...');
    const month5LeadMagnet = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 5: LEAD MAGNET UPGRADE</b><br><br>' +
      '<b>Goal:</b> Create irresistible lead magnets<br><br>' +
      '<b>Current:</b> Free training (good start)<br>' +
      '<b>Add These 3 New Magnets:</b><br><br>' +
      '<b>Magnet #1: "Agency Systems Audit"</b><br>' +
      '• Format: PDF checklist (5-7 pages)<br>' +
      '• Content: 50-point audit<br>' +
      '  - Operations systems<br>' +
      '  - Sales systems<br>' +
      '  - Delivery systems<br>' +
      '  - Team systems<br>' +
      '  - Financial systems<br>' +
      '• Value: Shows exactly what\'s missing<br>' +
      '• Time to create: 4-6 hours<br><br>' +
      '<b>Magnet #2: "Profitable Agency Calculator"</b><br>' +
      '• Format: Google Sheet (interactive)<br>' +
      '• Input: Revenue, costs, hours worked<br>' +
      '• Output: Profit margins, hourly rate,<br>' +
      '  what to optimize<br>' +
      '• Value: Instant insights<br>' +
      '• Time to create: 3-4 hours<br><br>' +
      '<b>Magnet #3: "$1M Agency Roadmap"</b><br>' +
      '• Format: Visual PDF (10-12 pages)<br>' +
      '• Content: Month-by-month plan<br>' +
      '  from $0 to $1M<br>' +
      '• Include: Milestones, metrics, actions<br>' +
      '• Value: Clear path forward<br>' +
      '• Time to create: 8-10 hours<br><br>' +
      '<b>Promotion Strategy:</b><br>' +
      '• Mention in every Reel CTA<br>' +
      '• Link in bio rotation<br>' +
      '• YouTube video descriptions',
      centerX + colSpacing * 0.8,
      centerY - rowSpacing * 2.2,
      'green',
      340,
      480
    );
    createdItems.push(month5LeadMagnet);
    await delay(350);

    // ===== YEAR 1 - MONTH 5-6: PAID ADS TEST =====
    console.log('Creating Month 5-6 paid ads strategy...');
    const month56PaidAds = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 5-6: PAID ADS TEST</b><br><br>' +
      '<b>Goal:</b> Test $500-$1K/month, target $2-$5 per lead<br><br>' +
      '<b>Budget Allocation:</b><br>' +
      '• Month 5: $500 (testing)<br>' +
      '• Month 6: $1,000 (scaling winners)<br><br>' +
      '<b>Campaign Strategy:</b><br><br>' +
      '<b>Campaign 1: Lead Magnet ($300/mo)</b><br>' +
      '• Objective: Lead generation<br>' +
      '• Audience: Agency owners, 30-50 years<br>' +
      '  Interests: Business coaching, marketing<br>' +
      '• Creative: Carousel showing audit results<br>' +
      '• Landing page: Simple opt-in<br>' +
      '• Goal: $3 per lead = 100 leads/month<br><br>' +
      '<b>Campaign 2: Video Views ($200/mo)</b><br>' +
      '• Objective: Video views<br>' +
      '• Audience: Lookalike of email list<br>' +
      '• Creative: Best-performing Reel<br>' +
      '• Retarget viewers with lead magnet<br><br>' +
      '<b>Campaign 3: Engagement ($200/mo)</b><br>' +
      '• Objective: Page followers<br>' +
      '• Audience: Agency owners<br>' +
      '• Creative: Testimonial + case study<br>' +
      '• Goal: $1-$2 per follower<br><br>' +
      '<b>What to Track:</b><br>' +
      '• Cost per lead (goal: $2-$5)<br>' +
      '• Lead quality (do they open emails?)<br>' +
      '• Landing page conversion rate<br>' +
      '• Return on ad spend<br><br>' +
      '<b>If ads work: Scale to $2K-$3K/month Month 7+</b>',
      centerX + colSpacing * 0.8,
      centerY - rowSpacing * 0.2,
      'green',
      340,
      480
    );
    createdItems.push(month56PaidAds);
    await delay(350);

    // ===== MONTH 6 CHECKPOINT =====
    console.log('Creating Month 6 checkpoint...');
    const month6Checkpoint = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">✅ MONTH 6: CHECKPOINT</b><br><br>' +
      '<b>By end of Month 6, you should have:</b><br><br>' +
      '<b style="color:#10B981;">Audience Metrics:</b><br>' +
      '✓ Instagram: 12K-15K followers<br>' +
      '✓ YouTube: 3K-5K subscribers<br>' +
      '✓ LinkedIn: 2K-3K connections<br>' +
      '✓ Email List: 2K-3K subscribers<br>' +
      '✓ Engagement: 2-3% (up from 0.97%)<br><br>' +
      '<b style="color:#10B981;">Content Metrics:</b><br>' +
      '✓ 100+ Instagram posts published<br>' +
      '✓ 120+ Reels created<br>' +
      '✓ 20-30 YouTube videos<br>' +
      '✓ 60+ LinkedIn posts<br>' +
      '✓ Consistent 70/20/10 mix<br><br>' +
      '<b style="color:#10B981;">Authority Building:</b><br>' +
      '✓ Signature framework created & known<br>' +
      '✓ 5-10 detailed case studies<br>' +
      '✓ 10+ video testimonials<br>' +
      '✓ 5-10 podcast appearances<br>' +
      '✓ 3-5 collaborations completed<br><br>' +
      '<b style="color:#10B981;">Infrastructure:</b><br>' +
      '✓ 3-4 lead magnets created<br>' +
      '✓ Email sequences set up<br>' +
      '✓ Landing pages live<br>' +
      '✓ Paid ads tested & optimized<br><br>' +
      '<b style="color:#F59E0B;">If you\'re NOT at these numbers:</b><br>' +
      '⚠️ Don\'t launch yet! Keep building.<br>' +
      '⚠️ Extend foundation phase 2-3 months.<br>' +
      '⚠️ Focus on what\'s working, double down.',
      centerX + colSpacing * 0.8,
      centerY + rowSpacing * 2.2,
      'yellow',
      340,
      480
    );
    createdItems.push(month6Checkpoint);
    await delay(350);

    // ===== MONTH 7: LOW-TICKET PRODUCT CREATION =====
    console.log('Creating Month 7 product creation...');
    const month7Product = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 7: LOW-TICKET PRODUCT</b><br><br>' +
      '<b>Goal:</b> Create & launch $97 product<br><br>' +
      '<b>Product Option A: "Agency Systems Toolkit"</b><br>' +
      '• Price: $97<br>' +
      '• Format: Digital download (ZIP file)<br><br>' +
      '<b>What\'s Included:</b><br>' +
      '1. 15+ SOP Templates (Google Docs)<br>' +
      '   • Client onboarding SOP<br>' +
      '   • Project delivery SOP<br>' +
      '   • Sales process SOP<br>' +
      '   • Team hiring SOP<br>' +
      '   • Financial review SOP<br><br>' +
      '2. Agency Profitability Calculator (Sheets)<br>' +
      '   • Revenue & expense tracker<br>' +
      '   • Profit margin calculator<br>' +
      '   • Hourly rate calculator<br><br>' +
      '3. Client Onboarding System<br>' +
      '   • Onboarding checklist<br>' +
      '   • Welcome email templates<br>' +
      '   • Kickoff call script<br>' +
      '   • Questionnaire template<br><br>' +
      '4. Team Delegation Framework<br>' +
      '   • Task delegation matrix<br>' +
      '   • Role clarity worksheet<br>' +
      '   • Meeting agenda templates<br><br>' +
      '5. Hiring Resources<br>' +
      '   • Job description templates (5 roles)<br>' +
      '   • Interview question bank<br>' +
      '   • Skills assessment tests<br>' +
      '   • Offer letter template<br><br>' +
      '<b>Time to Create:</b> 2 weeks (40-60 hours)<br>' +
      '<b>Delivery:</b> Gumroad or Stan Store',
      centerX + colSpacing * 0.8,
      centerY + rowSpacing * 4.4,
      'light_green',
      340,
      480
    );
    createdItems.push(month7Product);
    await delay(350);

    // ===== MONTH 7: LAUNCH STRATEGY =====
    console.log('Creating Month 7 launch strategy...');
    const month7Launch = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 7: LAUNCH STRATEGY</b><br><br>' +
      '<b>7-Day Launch Timeline:</b><br><br>' +
      '<b>Day 1 (Monday): The Problem</b><br>' +
      '• Email 1: "Why most agencies stay stuck"<br>' +
      '• Social: Problem-focused post<br>' +
      '• Stories: Poll about biggest challenges<br><br>' +
      '<b>Day 2 (Tuesday): The Solution</b><br>' +
      '• Email 2: "The systems that changed<br>' +
      '  everything for our clients"<br>' +
      '• Social: Framework/system preview<br><br>' +
      '<b>Day 3 (Wednesday): Product Reveal</b><br>' +
      '• Email 3: "Introducing Agency Systems Toolkit"<br>' +
      '• Social: Product announcement + benefits<br>' +
      '• Stories: Behind-scenes of creation<br><br>' +
      '<b>Day 4 (Thursday): Social Proof</b><br>' +
      '• Email 4: "Here\'s what agency owners say"<br>' +
      '• Social: Testimonials carousel<br>' +
      '• Stories: Video testimonials<br><br>' +
      '<b>Day 5 (Friday): Overcome Objections</b><br>' +
      '• Email 5: "Is this right for you?"<br>' +
      '• Social: FAQ post<br><br>' +
      '<b>Day 6 (Saturday): Urgency</b><br>' +
      '• Email 6: "24 hours left + bonuses"<br>' +
      '• Social: Countdown + bonus reveal<br><br>' +
      '<b>Day 7 (Sunday): Final Push</b><br>' +
      '• Email 7: "Cart closes tonight at midnight"<br>' +
      '• Social: Final reminder<br>' +
      '• Stories: Countdown timer<br><br>' +
      '<b>Expected Results:</b><br>' +
      '• Email list: 2.5K subscribers<br>' +
      '• Conversion: 2% = 50 sales<br>' +
      '• Revenue: 50 × $97 = $4,850',
      centerX + colSpacing * 2.0,
      centerY - rowSpacing * 2.2,
      'light_green',
      340,
      480
    );
    createdItems.push(month7Launch);
    await delay(350);

    // Continue with more months... Let me create many more sections

    // ===== MONTH 8-9: OPTIMIZE & TESTIMONIALS =====
    console.log('Creating Month 8-9 optimization...');
    const month89Optimize = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 8-9: OPTIMIZE</b><br><br>' +
      '<b>Goal:</b> Make low-ticket evergreen, collect proof<br><br>' +
      '<b>Week 1-2: Collect Testimonials</b><br>' +
      '• Email all 50 buyers: "How\'s it going?"<br>' +
      '• Ask for specific wins/results<br>' +
      '• Request video testimonials (offer $25 gift card)<br>' +
      '• Target: 10-20 testimonials<br><br>' +
      '<b>Week 3-4: Make Product Evergreen</b><br>' +
      '• Set up automated email funnel<br>' +
      '• Day 1: Welcome + problem<br>' +
      '• Day 3: Solution + product intro<br>' +
      '• Day 5: Testimonials<br>' +
      '• Day 7: Offer product<br>' +
      '• Add product mentions to all content<br><br>' +
      '<b>Month 8-9 Activities:</b><br>' +
      '• Continue audience building<br>' +
      '• Keep content consistency (critical!)<br>' +
      '• More collaborations (5-10 more)<br>' +
      '• More podcasts (10-15 more appearances)<br>' +
      '• Scale paid ads ($2K-$3K/month)<br><br>' +
      '<b>Metrics to Hit by End of Month 9:</b><br>' +
      '✓ Instagram: 18K-20K<br>' +
      '✓ YouTube: 5K-7K<br>' +
      '✓ Email: 4K-5K<br>' +
      '✓ Low-ticket passive: $2K-$3K/month<br><br>' +
      '<b style="color:#F59E0B;">Don\'t stop building audience!</b><br>' +
      'You need 15K+ social, 5K+ email for<br>' +
      'successful high-ticket launch in Month 12.',
      centerX + colSpacing * 2.0,
      centerY - rowSpacing * 0.2,
      'green',
      340,
      460
    );
    createdItems.push(month89Optimize);
    await delay(350);

    // ===== MONTH 10-11: HIGH-TICKET PROGRAM DESIGN =====
    console.log('Creating Month 10-11 program design...');
    const month1011Program = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 10-11: PROGRAM DESIGN</b><br><br>' +
      '<b>Create: "Agency Ascension Mastermind"</b><br><br>' +
      '<b>Format:</b><br>' +
      '• 12-week group coaching program<br>' +
      '• Weekly 90-min group calls (Zoom)<br>' +
      '• Private community (Circle or Slack)<br>' +
      '• Self-paced course modules<br>' +
      '• Template library & resources<br>' +
      '• 1 private 1-on-1 call (optional)<br><br>' +
      '<b>Beta Pricing:</b> $3K-$4K<br>' +
      '<b>Future Pricing:</b> $6K-$8K<br><br>' +
      '<b>Ideal Client Profile:</b><br>' +
      '• Agency doing $250K-$1M/year<br>' +
      '• Owner working 50+ hours/week<br>' +
      '• Wants to scale without burnout<br>' +
      '• Has team (3-10 people)<br>' +
      '• Ready to invest $3K-$5K<br>' +
      '• Coachable, action-taker<br><br>' +
      '<b>Week 1-4: Design Curriculum</b><br>' +
      '• Map out 12-week journey<br>' +
      '• Create week-by-week outline<br>' +
      '• Identify key transformations<br>' +
      '• Design worksheets & templates<br><br>' +
      '<b>Week 5-8: Build Course Content</b><br>' +
      '• Record first 4 modules (4-8 hours)<br>' +
      '• Create slide decks<br>' +
      '• Build template library<br>' +
      '• Set up community platform<br><br>' +
      '<b>You DON\'T need all 12 weeks done!<br>' +
      'Build first 4 weeks, create rest during delivery.</b>',
      centerX + colSpacing * 2.0,
      centerY + rowSpacing * 2.2,
      'blue',
      340,
      480
    );
    createdItems.push(month1011Program);
    await delay(350);

    // ===== 12-WEEK CURRICULUM BREAKDOWN =====
    console.log('Creating 12-week curriculum...');
    const curriculum = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📚 12-WEEK CURRICULUM</b><br><br>' +
      '<b>Week 1: Agency Audit & Baseline</b><br>' +
      '• Full business audit (operations, profit, time)<br>' +
      '• Identify bottlenecks & inefficiencies<br>' +
      '• Set 90-day goals<br><br>' +
      '<b>Week 2: Profit Optimization</b><br>' +
      '• Analyze profit margins by service<br>' +
      '• Cut unprofitable offerings<br>' +
      '• Increase prices strategically<br><br>' +
      '<b>Week 3: Service Packaging & Pricing</b><br>' +
      '• Package services for clarity<br>' +
      '• Value-based pricing strategies<br>' +
      '• Create tiered offerings<br><br>' +
      '<b>Week 4: Lead Generation Systems</b><br>' +
      '• Inbound vs outbound strategies<br>' +
      '• Content marketing setup<br>' +
      '• Referral program design<br><br>' +
      '<b>Week 5: Sales Process Optimization</b><br>' +
      '• Discovery call scripts<br>' +
      '• Proposal templates<br>' +
      '• Close rate improvement<br><br>' +
      '<b>Week 6: Client Onboarding Automation</b><br>' +
      '• Onboarding checklist & timeline<br>' +
      '• Automated welcome sequences<br>' +
      '• Kickoff call frameworks<br><br>' +
      '<b>Week 7: Team Structure & Delegation</b><br>' +
      '• Org chart design<br>' +
      '• Role clarity worksheets<br>' +
      '• Delegation frameworks<br><br>' +
      '<b>Week 8: Hiring & Training Systems</b><br>' +
      '• Hiring process (attract, assess, hire)<br>' +
      '• Training SOPs<br>' +
      '• Performance management',
      centerX + colSpacing * 3.2,
      centerY - rowSpacing * 2.2,
      'blue',
      340,
      480
    );
    createdItems.push(curriculum);
    await delay(350);

    // ===== MONTH 12: BETA LAUNCH =====
    console.log('Creating Month 12 beta launch...');
    const month12Beta = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 MONTH 12: BETA LAUNCH</b><br><br>' +
      '<b>Goal:</b> 5-10 beta clients at $3K-$4K<br><br>' +
      '<b>Week 1: Announcement</b><br>' +
      '• Email blast to full list (5K+ people)<br>' +
      '• Social announcement across platforms<br>' +
      '• "I\'m accepting 10 beta clients for my<br>' +
      '  new 12-week Agency Ascension program"<br>' +
      '• Share curriculum overview<br>' +
      '• Open applications<br><br>' +
      '<b>Application Funnel:</b><br>' +
      '1. Landing page with details<br>' +
      '2. Application form (10-15 questions)<br>' +
      '   • Current revenue?<br>' +
      '   • Biggest challenge?<br>' +
      '   • Why you want to join?<br>' +
      '   • Ready to invest $3.5K?<br>' +
      '3. Auto-schedule sales call<br><br>' +
      '<b>Week 2-3: Sales Calls</b><br>' +
      '• Aim for 20-30 applications<br>' +
      '• Book 15-20 calls<br>' +
      '• Close rate goal: 40-50%<br>' +
      '• That\'s 6-10 clients<br><br>' +
      '<b>Sales Call Script (45-60 min):</b><br>' +
      '1. Rapport (5 min)<br>' +
      '2. Discover pain points (15 min)<br>' +
      '3. Present solution (15 min)<br>' +
      '4. Handle objections (10 min)<br>' +
      '5. Close (5 min)<br><br>' +
      '<b>Week 4: Onboard & Start</b><br>' +
      '• Send welcome packet<br>' +
      '• Get everyone in community<br>' +
      '• First group call',
      centerX + colSpacing * 3.2,
      centerY - rowSpacing * 0.1,
      'blue',
      340,
      480
    );
    createdItems.push(month12Beta);
    await delay(350);

    // ===== YEAR 2: REVENUE STREAMS =====
    console.log('Creating Year 2 revenue streams...');
    const year2Streams = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 YEAR 2: REVENUE STREAMS</b><br><br>' +
      '<b>Goal:</b> $460K-$1.1M from multiple sources<br><br>' +
      '<b>Stream #1: Group Coaching</b><br>' +
      '• 2-3 launches per year<br>' +
      '• Price: $6K-$10K (raised after beta)<br>' +
      '• 15-20 clients per launch<br>' +
      '• Revenue: $180K-$600K/year<br><br>' +
      '<b>Stream #2: Elite Mastermind (NEW)</b><br>' +
      '• 6-month intimate program<br>' +
      '• 10-15 members max<br>' +
      '• Price: $15K-$20K<br>' +
      '• 2 cohorts/year<br>' +
      '• Revenue: $150K-$300K/year<br><br>' +
      '<b>Stream #3: Evergreen Course</b><br>' +
      '• "Agency Scale Blueprint"<br>' +
      '• Price: $997-$1,497<br>' +
      '• Self-paced, always available<br>' +
      '• Sales: 50-100/year<br>' +
      '• Revenue: $50K-$150K/year<br><br>' +
      '<b>Stream #4: Low-Ticket Products</b><br>' +
      '• Templates, toolkits, mini-courses<br>' +
      '• Price: $47-$197<br>' +
      '• Revenue: $20K-$50K/year passive<br><br>' +
      '<b>Team Needed:</b><br>' +
      '• Launch Manager ($3K-$5K/month)<br>' +
      '• Content Strategist ($2K-$3K/month)<br>' +
      '• Community Manager ($2K-$3K/month)<br>' +
      '• Video Editor ($1K-$2K/month)',
      centerX + colSpacing * 3.2,
      centerY + rowSpacing * 2.2,
      'green',
      340,
      480
    );
    createdItems.push(year2Streams);
    await delay(350);

    // ===== YEAR 3: MARKET LEADERSHIP =====
    console.log('Creating Year 3 leadership strategy...');
    const year3Leadership = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 YEAR 3: MARKET LEADERSHIP</b><br><br>' +
      '<b>Goal:</b> Become THE authority ($1M-$3M+)<br><br>' +
      '<b>New Revenue Stream: Done-With-You</b><br>' +
      '💎 <b>"Agency Transformation Package"</b><br>' +
      '• 6-month intensive consulting<br>' +
      '• Weekly 1-on-1 calls<br>' +
      '• Direct implementation support<br>' +
      '• Price: $50K-$100K<br>' +
      '• Capacity: 5-10 clients/year<br>' +
      '• Revenue: $250K-$1M<br><br>' +
      '<b>Speaking & Workshops</b><br>' +
      '🎤 <b>Industry Events:</b><br>' +
      '• Keynote speaking: $10K-$25K/event<br>' +
      '• Corporate workshops: $15K-$50K/day<br>' +
      '• 10-20 events/year<br>' +
      '• Revenue: $100K-$500K<br><br>' +
      '<b>Book Launch</b><br>' +
      '📖 <b>"The Agency Freedom Method"</b><br>' +
      '• Traditional or self-published<br>' +
      '• Direct revenue: $50K-$200K<br>' +
      '• Indirect value: MASSIVE authority boost<br>' +
      '• Lead generation machine<br>' +
      '• Opens doors to speaking gigs<br><br>' +
      '<b>Total Year 3 Revenue:</b><br>' +
      '• Elite Mastermind: $375K-$875K<br>' +
      '• Done-With-You: $250K-$1M<br>' +
      '• Speaking: $100K-$500K<br>' +
      '• Book: $50K-$200K<br>' +
      '• Other products: $380K-$780K<br>' +
      '• <b>TOTAL: $1.15M-$3.35M</b>',
      centerX + colSpacing * 3.2,
      centerY + rowSpacing * 4.4,
      'violet',
      340,
      480
    );
    createdItems.push(year3Leadership);
    await delay(350);

    // ===== INSTAGRAM DETAILED STRATEGY =====
    console.log('Creating Instagram strategy...');
    const igStrategy = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📸 INSTAGRAM: DETAILED TACTICS</b><br><br>' +
      '<b style="color:#E1306C;">Current Problem: 0.97% Engagement</b><br><br>' +
      '<b>REELS Strategy (5-7 per week):</b><br>' +
      '1. <b>Hook Formula (first 3 seconds):</b><br>' +
      '   • Question: "Want to scale to $1M?"<br>' +
      '   • Bold statement: "Most agencies fail because..."<br>' +
      '   • Pattern interrupt: "Stop doing this!"<br><br>' +
      '2. <b>Value Delivery (next 30-45 sec):</b><br>' +
      '   • Teach ONE thing clearly<br>' +
      '   • Use text on screen (80% watch without sound)<br>' +
      '   • Keep it simple, actionable<br><br>' +
      '3. <b>CTA (last 5-10 sec):</b><br>' +
      '   • "Follow for more agency tips"<br>' +
      '   • "Save this for later"<br>' +
      '   • "Comment \'SYSTEMS\' for free guide"<br><br>' +
      '<b>Topics That Work:</b><br>' +
      '• "5 systems every $1M agency has"<br>' +
      '• "How to delegate without losing control"<br>' +
      '• "Agency profit margins explained"<br>' +
      '• "Remove yourself from operations"<br>' +
      '• "Pricing: what to charge"<br><br>' +
      '<b>Audio Strategy:</b><br>' +
      '• Use trending audio (first 3-5 seconds)<br>' +
      '• Switch to voiceover for teaching<br>' +
      '• Increases reach via algorithm<br><br>' +
      '<b>Posting Time:</b><br>' +
      '• Best: Mon/Wed/Fri 11am, Tue/Thu 2pm EST',
      centerX - colSpacing * 2.8,
      centerY + rowSpacing * 5.2,
      'pink',
      340,
      460
    );
    createdItems.push(igStrategy);
    await delay(350);

    // ===== YOUTUBE DETAILED STRATEGY =====
    console.log('Creating YouTube strategy...');
    const ytStrategy = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">🎥 YOUTUBE: DETAILED TACTICS</b><br><br>' +
      '<b style="color:#FF0000;">Current Problem: Only 1.1K subs</b><br><br>' +
      '<b>Video Formula (10-20 min):</b><br>' +
      '1. <b>HOOK (0-15 sec):</b><br>' +
      '   "In this video, I\'ll show you the 5 systems<br>' +
      '   that helped 50+ agencies scale to $1M..."<br><br>' +
      '2. <b>PREVIEW (15-30 sec):</b><br>' +
      '   "By the end, you\'ll know exactly how to..."<br><br>' +
      '3. <b>INTRO (30-60 sec):</b><br>' +
      '   Quick intro, who you are, what you do<br><br>' +
      '4. <b>CONTENT (8-18 min):</b><br>' +
      '   Deliver the promised value<br>' +
      '   Break into clear sections<br>' +
      '   Use B-roll, screen recordings<br><br>' +
      '5. <b>RECAP (1-2 min):</b><br>' +
      '   Summarize key points<br><br>' +
      '6. <b>CTA (last 30 sec):</b><br>' +
      '   "Download free Agency Systems Audit below"<br><br>' +
      '<b>Thumbnail Winning Formula:</b><br>' +
      '• YOUR face (close-up, emotion)<br>' +
      '• Bold text: "5 Systems" or "Remove Yourself"<br>' +
      '• High contrast (bright vs dark)<br>' +
      '• Consistent color scheme (brand)<br>' +
      '• Test 3 variants, keep winner<br><br>' +
      '<b>SEO Optimization:</b><br>' +
      '• Title: Include keyword + benefit + proof<br>' +
      '• Description: First 150 chars = crucial<br>' +
      '• Tags: Mix of broad + specific<br>' +
      '• Thumbnail file name: keyword-rich',
      centerX - colSpacing * 1.6,
      centerY + rowSpacing * 5.2,
      'red',
      340,
      460
    );
    createdItems.push(ytStrategy);
    await delay(350);

    // ===== LINKEDIN DETAILED STRATEGY =====
    console.log('Creating LinkedIn detailed strategy...');
    const linkedinDetailed = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">💼 LINKEDIN: DETAILED TACTICS</b><br><br>' +
      '<b>Why Critical: Agency owners are HERE!</b><br><br>' +
      '<b>Post Types That Work:</b><br><br>' +
      '<b>Type 1: Story Post (Personal narrative)</b><br>' +
      '• Hook: Start with a story<br>' +
      '• "3 years ago, I was working 80 hrs/week..."<br>' +
      '• Lesson learned<br>' +
      '• Call to action<br>' +
      '• Length: 1,300-1,500 characters<br><br>' +
      '<b>Type 2: Carousel Post (Educational)</b><br>' +
      '• 5-10 slides<br>' +
      '• Teach a framework or process<br>' +
      '• Include case study examples<br>' +
      '• Download as PDF in comments<br><br>' +
      '<b>Type 3: Hot Take (Thought leadership)</b><br>' +
      '• Controversial opinion<br>' +
      '• "Most agency coaches are wrong about..."<br>' +
      '• Back it up with logic/data<br>' +
      '• Invites debate = engagement<br><br>' +
      '<b>Type 4: Case Study Post</b><br>' +
      '• Before/After format<br>' +
      '• Specific metrics<br>' +
      '• What you did<br>' +
      '• Results achieved<br><br>' +
      '<b>Engagement Strategy:</b><br>' +
      '• First hour is CRITICAL<br>' +
      '• Reply to ALL comments immediately<br>' +
      '• Tag relevant people (thought leaders)<br>' +
      '• Engage with 10-20 posts before posting<br><br>' +
      '<b>DM Outreach (10-20/week):</b><br>' +
      '• Personalized connection requests<br>' +
      '• Offer value, not pitch<br>' +
      '• "Saw your post about X, loved it..."',
      centerX - colSpacing * 0.4,
      centerY + rowSpacing * 5.2,
      'cyan',
      340,
      480
    );
    createdItems.push(linkedinDetailed);
    await delay(350);

    // ===== EMAIL MARKETING STRATEGY =====
    console.log('Creating email strategy...');
    const emailStrategy = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📧 EMAIL: DETAILED STRATEGY</b><br><br>' +
      '<b>Weekly Newsletter: "Agency Insider"</b><br><br>' +
      '<b>Send: Every Tuesday 10am EST</b><br><br>' +
      '<b>Structure:</b><br>' +
      '1. <b>Opening (2-3 sentences):</b><br>' +
      '   Personal story or observation<br><br>' +
      '2. <b>Main Content (400-600 words):</b><br>' +
      '   • One main teaching point<br>' +
      '   • Agency system or strategy<br>' +
      '   • Actionable steps<br><br>' +
      '3. <b>Case Study Snippet:</b><br>' +
      '   Quick win from a client<br><br>' +
      '4. <b>CTA:</b><br>' +
      '   Link to lead magnet or product<br><br>' +
      '<b>Subject Line Formula:</b><br>' +
      '• Curiosity: "The system that changed everything"<br>' +
      '• Benefit: "How to 2x profit margins"<br>' +
      '• Personal: "I made this mistake..."<br>' +
      '• Question: "Working 60+ hours?"<br><br>' +
      '<b>Welcome Sequence (7 emails):</b><br>' +
      '• Email 1: Welcome + deliver lead magnet<br>' +
      '• Email 2: Your story (build connection)<br>' +
      '• Email 3: Framework introduction<br>' +
      '• Email 4: Case study #1<br>' +
      '• Email 5: Common mistakes<br>' +
      '• Email 6: Case study #2<br>' +
      '• Email 7: Soft pitch (low-ticket or call)<br><br>' +
      '<b>Goals:</b><br>' +
      '• Open rate: 30-40%<br>' +
      '• Click rate: 3-5%<br>' +
      '• Unsubscribe: <1%',
      centerX + colSpacing * 0.8,
      centerY + rowSpacing * 5.6,
      'yellow',
      340,
      480
    );
    createdItems.push(emailStrategy);
    await delay(350);

    // ===== PRICING STRATEGY =====
    console.log('Creating pricing strategy...');
    const pricingStrategy = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">💰 PRICING STRATEGY & EVOLUTION</b><br><br>' +
      '<b>How YOUR Prices Will Grow Over 5 Years:</b><br><br>' +
      '<b>Year 1: Build Foundation</b><br>' +
      '• Low-ticket: $47-$97<br>' +
      '• Beta high-ticket: $3K-$4K<br>' +
      '• Full-price: $6K-$8K<br><br>' +
      '<b>Year 2: Establish Authority</b><br>' +
      '• Group coaching: $8K-$10K<br>' +
      '• Mastermind: $15K-$20K (6 months)<br>' +
      '• Evergreen: $997-$1,497<br><br>' +
      '<b>Year 3: Premium Positioning</b><br>' +
      '• Elite mastermind: $25K-$35K (annual)<br>' +
      '• Done-with-you: $50K-$100K<br>' +
      '• Speaking: $10K-$25K per event<br>' +
      '• Workshops: $15K-$50K per day<br><br>' +
      '<b>Year 4-5: Market Leader</b><br>' +
      '• Premium mastermind: $35K-$50K annual<br>' +
      '• Done-for-you: $100K-$250K<br>' +
      '• Certification: $10K-$25K per coach<br>' +
      '• Retainer: $10K-$25K/month<br><br>' +
      '<b>Why Prices Increase:</b><br>' +
      '✓ More social proof<br>' +
      '✓ More case studies<br>' +
      '✓ Bigger audience (demand)<br>' +
      '✓ Stronger authority<br>' +
      '✓ Better results<br>' +
      '✓ Book published<br>' +
      '✓ Media features<br><br>' +
      '<b>Psychology:</b><br>' +
      'Higher prices = higher perceived value<br>' +
      'Better clients = better results<br>' +
      'Better results = higher prices (cycle)',
      centerX + colSpacing * 2.0,
      centerY + rowSpacing * 5.6,
      'yellow',
      340,
      480
    );
    createdItems.push(pricingStrategy);
    await delay(350);

    // ===== METRICS TRACKING =====
    console.log('Creating metrics tracking...');
    const metricsTracking = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📊 METRICS TO TRACK (Weekly)</b><br><br>' +
      '<b style="color:#3B82F6;">Audience Metrics:</b><br>' +
      '• IG followers (goal: 4.5K → 50K+ in 5 years)<br>' +
      '• IG engagement rate (goal: 2-4%)<br>' +
      '• YT subscribers (goal: 1.1K → 25K+)<br>' +
      '• Email list (goal: 500 → 50K+)<br>' +
      '• Email open rate (goal: 30-40%)<br>' +
      '• LinkedIn followers (goal: 0 → 25K+)<br><br>' +
      '<b style="color:#10B981;">Content Metrics:</b><br>' +
      '• Posts per week (goal: 15-20 total)<br>' +
      '• Reels avg views (goal: 10K+ per Reel)<br>' +
      '• YT watch time (goal: 4K+ hours/year)<br>' +
      '• Best content themes<br>' +
      '• Worst performers (stop these)<br><br>' +
      '<b style="color:#8B5CF6;">Business Metrics:</b><br>' +
      '• Monthly revenue (track growth)<br>' +
      '• Revenue per product<br>' +
      '• Launch conversion (goal: 3-5%)<br>' +
      '• Email conversion (goal: 2-3%)<br>' +
      '• Sales call booking (goal: 20-30%)<br>' +
      '• Sales close rate (goal: 30-50%)<br>' +
      '• Customer LTV<br>' +
      '• Testimonials (goal: 50+ by Y3)<br><br>' +
      '<b style="color:#F59E0B;">Leading Indicators:</b><br>' +
      '• DMs per week<br>' +
      '• Webinar registrations<br>' +
      '• Discovery calls booked<br>' +
      '• Collaborations done<br>' +
      '• Podcasts completed',
      centerX + colSpacing * 3.2,
      centerY + rowSpacing * 5.6,
      'light_blue',
      340,
      460
    );
    createdItems.push(metricsTracking);
    await delay(350);

    // ===== RISKS & MITIGATION =====
    console.log('Creating risks and mitigation...');
    const risksDetailed = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">⚠️ RISKS & HOW TO HANDLE</b><br><br>' +
      '<b>Risk #1: Audience Growth Stalls</b><br>' +
      '🔧 <b>Solutions:</b><br>' +
      '• Paid ads ($1K-$3K/mo backup)<br>' +
      '• 10+ collaborations<br>' +
      '• Platform diversify (LinkedIn!)<br>' +
      '• Hire content VA<br>' +
      '• Try new content formats<br><br>' +
      '<b>Risk #2: Launch Flops</b><br>' +
      '🔧 <b>Solutions:</b><br>' +
      '• Lower price temporarily<br>' +
      '• Extend sales period<br>' +
      '• Personal outreach to 20 best prospects<br>' +
      '• Payment plans (3-6 mo)<br>' +
      '• Run second launch<br><br>' +
      '<b>Risk #3: Content Doesn\'t Resonate</b><br>' +
      '🔧 <b>Solutions:</b><br>' +
      '• Survey monthly<br>' +
      '• Track metrics weekly<br>' +
      '• Test formats<br>' +
      '• Pivot quickly<br>' +
      '• Study competitors<br><br>' +
      '<b>Risk #4: Imposter Syndrome</b><br>' +
      '🔧 <b>Solutions:</b><br>' +
      '• Document wins<br>' +
      '• Collect testimonials<br>' +
      '• Join mastermind<br>' +
      '• You\'re 2 steps ahead<br><br>' +
      '<b>Risk #5: Burnout</b><br>' +
      '🔧 <b>Solutions:</b><br>' +
      '• Batch content<br>' +
      '• Hire early<br>' +
      '• Week off quarterly<br>' +
      '• Max capacity limits<br>' +
      '• 5-year marathon mindset',
      centerX - colSpacing * 2.8,
      centerY + rowSpacing * 6.8,
      'red',
      340,
      460
    );
    createdItems.push(risksDetailed);
    await delay(350);

    // ===== TECH STACK =====
    console.log('Creating tech stack...');
    const techStack = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">🛠️ TECH STACK & TOOLS</b><br><br>' +
      '<b>Essential Phase (Months 1-6):</b><br>' +
      '• ConvertKit: $29/mo (email)<br>' +
      '• Carrd: $19/year (landing pages)<br>' +
      '• Calendly: $10/mo (scheduling)<br>' +
      '• Canva Pro: $13/mo (design)<br>' +
      '• CapCut: Free (video editing)<br>' +
      '• <b>Total: $51/month</b><br><br>' +
      '<b>Growth Phase (Months 7-12):</b><br>' +
      '• Add Circle: $89/mo (community+course)<br>' +
      '• OR Kajabi: $199/mo (all-in-one)<br>' +
      '• OR Skool: $99/mo (community+payment)<br>' +
      '• Descript: $24/mo (video editing)<br>' +
      '• Stripe: 2.9% per transaction<br>' +
      '• <b>Total: $200-$300/month</b><br><br>' +
      '<b>Scale Phase (Months 13-18):</b><br>' +
      '• Facebook Ads Manager: Free<br>' +
      '• Ad budget: $1K-$3K/month<br>' +
      '• Google Analytics: Free<br>' +
      '• Hotjar: $39/mo (heatmaps)<br>' +
      '• Zapier: $30/mo (automation)<br>' +
      '• <b>Total: $300-$500/mo + ad spend</b><br><br>' +
      '<b>Team Phase (Year 2+):</b><br>' +
      '• Add project management (Asana: Free)<br>' +
      '• CRM upgrade (HubSpot or Pipedrive)<br>' +
      '• Team communication (Slack: Free)<br>' +
      '• Video hosting (Vimeo: $20/mo)<br><br>' +
      '<b>Don\'t over-invest in tools early!<br>' +
      'Start simple, add as you scale.</b>',
      centerX - colSpacing * 1.6,
      centerY + rowSpacing * 6.8,
      'gray',
      340,
      460
    );
    createdItems.push(techStack);
    await delay(350);

    // ===== TEAM BUILDING =====
    console.log('Creating team building strategy...');
    const teamBuilding = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">👥 TEAM BUILDING ROADMAP</b><br><br>' +
      '<b>DIY Phase (Months 1-6):</b><br>' +
      '• You do EVERYTHING<br>' +
      '• Learn the business<br>' +
      '• Understand audience<br>' +
      '• Time: 20-30 hrs/week<br><br>' +
      '<b>First Hires (Months 7-12):</b><br>' +
      '1. <b>VA ($500-$1K/mo, 10-20 hrs/week)</b><br>' +
      '   Tasks:<br>' +
      '   • Schedule content<br>' +
      '   • Reply to DMs (with guidance)<br>' +
      '   • Admin tasks<br>' +
      '   • Email management<br><br>' +
      '2. <b>Video Editor ($500-$1K/mo)</b><br>' +
      '   Tasks:<br>' +
      '   • Edit YouTube videos<br>' +
      '   • Create Reels/Shorts<br>' +
      '   • Make thumbnails<br>' +
      '   • 5-10 videos/month<br><br>' +
      '<b>Scale Team (Year 2):</b><br>' +
      '3. <b>Launch Manager ($2K-$5K per launch)</b><br>' +
      '   • Email sequences<br>' +
      '   • Sales call booking<br>' +
      '   • Launch coordination<br><br>' +
      '4. <b>Content Strategist ($1K-$2K/mo)</b><br>' +
      '   • Plan calendar<br>' +
      '   • Write captions<br>' +
      '   • Repurpose content<br><br>' +
      '<b>Year 3+ Team:</b><br>' +
      '5. Community Manager<br>' +
      '6. Head of Sales<br>' +
      '7. Operations Manager<br>' +
      '8. Additional coaches',
      centerX - colSpacing * 0.4,
      centerY + rowSpacing * 6.8,
      'gray',
      340,
      460
    );
    createdItems.push(teamBuilding);
    await delay(350);

    // ===== IMMEDIATE ACTION THIS WEEK =====
    console.log('Creating immediate actions...');
    const immediateActions = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">✅ DO THIS WEEK (Start Now!)</b><br><br>' +
      '<b style="color:#DC2626;">PRIORITY ACTIONS:</b><br><br>' +
      '<b>1. Update Bio (10 min - DO NOW)</b><br>' +
      'Change from:<br>' +
      '"Some Would Say I Scale Businesses"<br><br>' +
      'Change to:<br>' +
      '"I Help Agency Owners Scale to $1M+<br>' +
      'While Working 20 Hrs/Week | 50+<br>' +
      'Agencies Scaled | Free Training 👇"<br><br>' +
      '<b>2. Create Framework (2-3 days)</b><br>' +
      '• Think of YOUR unique 3-5 step system<br>' +
      '• Make it an acronym (memorable)<br>' +
      '• Create visual in Canva<br>' +
      '• Example: A.S.C.E.N.D. Method<br><br>' +
      '<b>3. Film 5 Reels (1 day batch)</b><br>' +
      '• Pure educational (NO lifestyle)<br>' +
      '• Hook-first (3 sec to grab)<br>' +
      '• One clear teaching per Reel<br>' +
      '• Schedule for next week<br><br>' +
      '<b>4. Content Calendar (2 hours)</b><br>' +
      '• Plan 30 days of posts<br>' +
      '• 70% educational topics<br>' +
      '• Write in Google Sheet<br><br>' +
      '<b>5. LinkedIn Setup (2 hours)</b><br>' +
      '• Optimize profile<br>' +
      '• Write about section<br>' +
      '• Plan first 5 posts<br><br>' +
      '<b>6. Document 1 Case Study (3 hours)</b><br>' +
      '• Pick your best client result<br>' +
      '• Get their story & metrics<br>' +
      '• Create post about it<br><br>' +
      '<b>Total: 10-15 hours this week.<br>' +
      'THIS is your foundation!</b>',
      centerX + colSpacing * 0.8,
      centerY + rowSpacing * 6.8,
      'yellow',
      340,
      480
    );
    createdItems.push(immediateActions);
    await delay(350);

    // ===== REVENUE PROJECTION CHART =====
    console.log('Creating revenue projections...');
    const revenueChart = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📈 5-YEAR REVENUE FORECAST</b><br><br>' +
      '<b>Year 1 (18 months):</b><br>' +
      '💰 Conservative: $225K<br>' +
      '💰 Realistic: $305K<br>' +
      '💰 Optimistic: $385K<br>' +
      'Sources: Low-ticket + high-ticket launches<br><br>' +
      '<b>Year 2:</b><br>' +
      '💰 Conservative: $460K<br>' +
      '💰 Realistic: $780K<br>' +
      '💰 Optimistic: $1.1M<br>' +
      'Sources: Group + Mastermind + Evergreen<br><br>' +
      '<b>Year 3:</b><br>' +
      '💰 Conservative: $1.15M<br>' +
      '💰 Realistic: $2.25M<br>' +
      '💰 Optimistic: $3.35M<br>' +
      'Sources: Elite + Done-with-you + Speaking<br><br>' +
      '<b>Year 4:</b><br>' +
      '💰 Conservative: $2M<br>' +
      '💰 Realistic: $3.5M<br>' +
      '💰 Optimistic: $5M<br>' +
      'Sources: Certification + SaaS + Events<br><br>' +
      '<b>Year 5:</b><br>' +
      '💰 Conservative: $2.6M<br>' +
      '💰 Realistic: $4.75M<br>' +
      '💰 Optimistic: $6.9M<br>' +
      'Sources: Full company, market leadership<br><br>' +
      '<b style="color:#FCD34D;">5-Year Cumulative:</b><br>' +
      '💰 Conservative: $6.43M<br>' +
      '💰 Realistic: $11.585M<br>' +
      '💰 Optimistic: $16.74M<br><br>' +
      '<b>These are REALISTIC projections<br>' +
      'if you follow the plan consistently.</b>',
      centerX + colSpacing * 2.0,
      centerY + rowSpacing * 6.8,
      'yellow',
      340,
      480
    );
    createdItems.push(revenueChart);
    await delay(350);

    // ===== HONEST TRUTH =====
    console.log('Creating honest truth section...');
    const honestTruth = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">💬 THE HONEST TRUTH</b><br><br>' +
      '<b>Derek, here\'s what YOU need to hear:</b><br><br>' +
      '<b style="color:#DC2626;">Current Reality Check:</b><br>' +
      '• Your bio says "scale to 6-7 figures"<br>' +
      '• But you have 4.5K followers<br>' +
      '• And 0.97% engagement<br>' +
      '• This is a CREDIBILITY GAP<br>' +
      '• Smart clients will notice<br><br>' +
      '<b style="color:#10B981;">The Good News:</b><br>' +
      '✓ You have infrastructure<br>' +
      '✓ You understand agencies<br>' +
      '✓ You create content<br>' +
      '✓ Strong brand name<br>' +
      '✓ Willing to work<br><br>' +
      '<b>Two Paths Forward:</b><br><br>' +
      '<b style="color:#10B981;">Path A: Build Right (6 months)</b><br>' +
      '✓ 15K+ engaged followers<br>' +
      '✓ Recognized framework<br>' +
      '✓ 10+ video testimonials<br>' +
      '✓ 3K+ email list<br>' +
      '✓ $100K+ launches possible<br>' +
      '✓ $225K-$385K in 18 months<br>' +
      '✓ $1M+ by year 3<br><br>' +
      '<b style="color:#DC2626;">Path B: Rush It (Don\'t!)</b><br>' +
      '✗ Launch to crickets<br>' +
      '✗ Maybe 5-10 sales<br>' +
      '✗ Damage credibility<br>' +
      '✗ Still rebuild anyway<br>' +
      '✗ Delayed 6+ months total<br><br>' +
      '<b style="font-size:15px;">PLAY THE LONG GAME.</b><br>' +
      '6 months foundation = 5 years success.<br><br>' +
      '<b>In 5 years: $2M-$6.9M with freedom.<br>' +
      'That\'s worth 6 months of work.</b>',
      centerX + colSpacing * 3.2,
      centerY + rowSpacing * 7.0,
      'red',
      340,
      500
    );
    createdItems.push(honestTruth);
    await delay(350);

    // ===== COMPETITIVE ANALYSIS DETAILED =====
    console.log('Creating competitive analysis...');
    const competitive = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">🏆 COMPETITIVE ANALYSIS</b><br><br>' +
      '<b>Direct Competitors in Agency Coaching:</b><br><br>' +
      '<b>1. Karl Sakas</b><br>' +
      '• Positioning: "Agency Management Expert"<br>' +
      '• Audience: 10K+ email, established authority<br>' +
      '• Offers: Consulting $10K-$50K<br>' +
      '• Strength: Deep expertise, book author<br>' +
      '• Weakness: Higher price point, less accessible<br><br>' +
      '<b>2. Parakeeto (Marcel Petitpas)</b><br>' +
      '• Positioning: "Agency Profitability Expert"<br>' +
      '• Audience: Medium, focused community<br>' +
      '• Offers: $997-$10K courses/consulting<br>' +
      '• Strength: Data-driven, specific niche<br>' +
      '• Weakness: Very narrow focus (just profit)<br><br>' +
      '<b>3. GYDA (Grow Your Digital Agency)</b><br>' +
      '• Positioning: "Agency Growth Collective"<br>' +
      '• Audience: Large, multiple coaches<br>' +
      '• Offers: $5K-$25K mastermind<br>' +
      '• Strength: Community, multiple experts<br>' +
      '• Weakness: Less personal, generalist<br><br>' +
      '<b>YOUR Opportunity:</b><br>' +
      '• Focus on FREEDOM (scale while working less)<br>' +
      '• Younger, more relatable to millennials<br>' +
      '• Systems-first approach (not just sales)<br>' +
      '• Mid-premium pricing ($6K-$20K sweet spot)',
      centerX - colSpacing * 2.8,
      centerY + rowSpacing * 8.4,
      'orange',
      340,
      460
    );
    createdItems.push(competitive);
    await delay(350);

    // ===== SALES FUNNEL BREAKDOWN =====
    console.log('Creating sales funnel...');
    const salesFunnel = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">🎯 SALES FUNNEL BREAKDOWN</b><br><br>' +
      '<b>Complete Funnel (5 Stages):</b><br><br>' +
      '<b>Stage 1: AWARENESS</b><br>' +
      '• Traffic sources: Instagram, YouTube, LinkedIn<br>' +
      '• Goal: Get them to know you exist<br>' +
      '• Content: Educational Reels, YouTube videos<br>' +
      '• Metric: Reach, impressions, views<br><br>' +
      '<b>Stage 2: INTEREST</b><br>' +
      '• Hook: Lead magnet (audit, calculator, roadmap)<br>' +
      '• Goal: Capture email address<br>' +
      '• Landing page with clear value prop<br>' +
      '• Metric: Opt-in rate (30-40% goal)<br><br>' +
      '<b>Stage 3: CONSIDERATION</b><br>' +
      '• Email sequence: 7-email welcome series<br>' +
      '• Weekly newsletter: Build trust & authority<br>' +
      '• Goal: Warm them up to your offers<br>' +
      '• Metric: Email open rate (30-40%)<br><br>' +
      '<b>Stage 4: INTENT</b><br>' +
      '• Webinar or 5-day challenge<br>' +
      '• Application for high-ticket program<br>' +
      '• Goal: Book sales calls<br>' +
      '• Metric: Application rate (5-10% of attendees)<br><br>' +
      '<b>Stage 5: PURCHASE</b><br>' +
      '• Sales call (45-60 min)<br>' +
      '• Close with urgency & scarcity<br>' +
      '• Goal: Convert to client<br>' +
      '• Metric: Close rate (30-50%)<br><br>' +
      '<b>Conversion Math:</b><br>' +
      '1,000 followers → 100 leads → 10 calls → 4 clients',
      centerX - colSpacing * 1.6,
      centerY + rowSpacing * 8.4,
      'blue',
      340,
      480
    );
    createdItems.push(salesFunnel);
    await delay(350);

    // ===== CONTENT BATCHING STRATEGY =====
    console.log('Creating content batching strategy...');
    const contentBatching = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">⚡ CONTENT BATCHING STRATEGY</b><br><br>' +
      '<b>Why Batch: Save 10-15 hours per week!</b><br><br>' +
      '<b>Monthly Batching Schedule:</b><br><br>' +
      '<b>Week 1 (Planning Day - 3 hours):</b><br>' +
      '• Plan content calendar for month<br>' +
      '• Research trending topics<br>' +
      '• Outline 30 days of content<br>' +
      '• Write captions for all posts<br><br>' +
      '<b>Week 2 (Filming Day - 6 hours):</b><br>' +
      '• Film 20-30 Reels in one session<br>' +
      '• Film 4-8 YouTube videos<br>' +
      '• Batch same outfit, location, setup<br>' +
      '• Use different hooks/topics<br><br>' +
      '<b>Week 3 (Editing Day - 4 hours):</b><br>' +
      '• Edit all Reels (15-20 min each)<br>' +
      '• Edit YouTube videos (or outsource)<br>' +
      '• Create thumbnails (batch in Canva)<br><br>' +
      '<b>Week 4 (Scheduling Day - 2 hours):</b><br>' +
      '• Schedule all Instagram posts<br>' +
      '• Schedule Reels for optimal times<br>' +
      '• Upload YouTube videos<br>' +
      '• Schedule LinkedIn posts<br><br>' +
      '<b>Tools for Batching:</b><br>' +
      '• Later or Planoly (IG scheduling)<br>' +
      '• TubeBuddy (YouTube scheduling)<br>' +
      '• Buffer (LinkedIn scheduling)<br><br>' +
      '<b>Result:</b> 15 hours batching vs 30 hours daily<br>' +
      'Saves 15 hours/month = 180 hours/year!',
      centerX - colSpacing * 0.4,
      centerY + rowSpacing * 8.4,
      'green',
      340,
      480
    );
    createdItems.push(contentBatching);
    await delay(350);

    // ===== 12-MONTH LAUNCH CALENDAR =====
    console.log('Creating launch calendar...');
    const launchCalendar = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 12-MONTH LAUNCH CALENDAR</b><br><br>' +
      '<b>Strategic Launch Timing:</b><br><br>' +
      '<b>Q1 (Jan-Mar):</b><br>' +
      '• January: Launch low-ticket ($97 product)<br>' +
      '  - New Year motivation high<br>' +
      '  - People ready to invest in growth<br>' +
      '• February: Nurture & grow audience<br>' +
      '• March: Prepare high-ticket offer<br><br>' +
      '<b>Q2 (Apr-Jun):</b><br>' +
      '• April: Beta high-ticket launch ($3K-$4K)<br>' +
      '  - Tax refunds = buying power<br>' +
      '• May: Deliver beta program<br>' +
      '• June: Collect testimonials<br><br>' +
      '<b>Q3 (Jul-Sep):</b><br>' +
      '• July: Quiet month (vacations)<br>' +
      '  - Build waitlist<br>' +
      '• August: Prep for fall launch<br>' +
      '• September: MAJOR launch #1 ($6K-$8K)<br>' +
      '  - Back-to-business mindset<br><br>' +
      '<b>Q4 (Oct-Dec):</b><br>' +
      '• October: Deliver program cohort<br>' +
      '• November: Black Friday sale (low-ticket)<br>' +
      '• December: Launch #2 or close year<br><br>' +
      '<b>Best Launch Months:</b><br>' +
      '1. January (New Year energy)<br>' +
      '2. September (back to business)<br>' +
      '3. April (tax refund season)<br><br>' +
      '<b>Worst Launch Months:</b><br>' +
      '• July (vacations)<br>' +
      '• December (holidays)',
      centerX + colSpacing * 0.8,
      centerY + rowSpacing * 8.4,
      'light_blue',
      340,
      480
    );
    createdItems.push(launchCalendar);
    await delay(350);

    // ===== SALES CALL SCRIPT =====
    console.log('Creating sales call script...');
    const salesScript = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📞 SALES CALL SCRIPT (45-60 min)</b><br><br>' +
      '<b>Part 1: RAPPORT (5 min)</b><br>' +
      '"Hey [Name]! Great to connect. How\'s your day going?"<br>' +
      '• Small talk, build connection<br>' +
      '• Set agenda: "I\'ve got 45 min, let\'s dive in"<br><br>' +
      '<b>Part 2: DISCOVERY (15-20 min)</b><br>' +
      'Ask these questions:<br>' +
      '1. "Tell me about your agency - what do you do?"<br>' +
      '2. "What\'s your current revenue? Goal revenue?"<br>' +
      '3. "How many hours/week are you working?"<br>' +
      '4. "What\'s your biggest challenge right now?"<br>' +
      '5. "What have you tried to solve this?"<br>' +
      '6. "What happens if nothing changes?"<br>' +
      '7. "What would success look like in 12 months?"<br><br>' +
      '<b>Part 3: PRESENT SOLUTION (15 min)</b><br>' +
      '"Based on what you shared, here\'s how I can help..."<br>' +
      '• Explain 12-week program<br>' +
      '• Show curriculum (tailored to their pain)<br>' +
      '• Share 2-3 relevant case studies<br>' +
      '• Paint the transformation picture<br><br>' +
      '<b>Part 4: HANDLE OBJECTIONS (10 min)</b><br>' +
      'Common objections:<br>' +
      '• "I need to think about it"<br>' +
      '  → "What specifically do you need to think about?"<br>' +
      '• "It\'s too expensive"<br>' +
      '  → "What\'s the cost of NOT solving this?"<br>' +
      '• "I need to talk to my partner"<br>' +
      '  → "Let\'s get them on a call now"<br><br>' +
      '<b>Part 5: CLOSE (5 min)</b><br>' +
      '"Are you ready to get started?"<br>' +
      '• If yes: Payment link, onboarding<br>' +
      '• If no: "What\'s holding you back?"',
      centerX + colSpacing * 2.0,
      centerY + rowSpacing * 8.4,
      'violet',
      340,
      480
    );
    createdItems.push(salesScript);
    await delay(350);

    // ===== COMMUNITY BUILDING =====
    console.log('Creating community building strategy...');
    const community = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">👥 COMMUNITY BUILDING STRATEGY</b><br><br>' +
      '<b>Why Community Matters:</b><br>' +
      '• Higher retention (2x)<br>' +
      '• More referrals (3x)<br>' +
      '• Better results (students help each other)<br>' +
      '• Competitive moat<br><br>' +
      '<b>Platform Choice:</b><br>' +
      '• Circle: $89/mo (best all-in-one)<br>' +
      '• Skool: $99/mo (gamification)<br>' +
      '• Slack: Free (but chaotic)<br>' +
      '• Facebook: Free (but algorithm issues)<br><br>' +
      '<b>Community Structure:</b><br>' +
      '1. <b>Welcome Channel</b><br>' +
      '   • New member intros<br>' +
      '   • Getting started guide<br>' +
      '2. <b>Wins Channel</b><br>' +
      '   • Celebrate successes<br>' +
      '   • Build momentum<br>' +
      '3. <b>Questions Channel</b><br>' +
      '   • Get help from peers<br>' +
      '   • You answer 1-2/day<br>' +
      '4. <b>Accountability Channel</b><br>' +
      '   • Weekly check-ins<br>' +
      '   • Goal setting<br>' +
      '5. <b>Resources Library</b><br>' +
      '   • Templates, SOPs, guides<br><br>' +
      '<b>Engagement Tactics:</b><br>' +
      '• Weekly Q&A calls (live)<br>' +
      '• Monthly challenges<br>' +
      '• Peer accountability partners<br>' +
      '• Leaderboards (gamification)<br>' +
      '• Exclusive content drops<br><br>' +
      '<b>Moderation:</b><br>' +
      '• You (first 50 members)<br>' +
      '• Community manager (after 100+)',
      centerX + colSpacing * 3.2,
      centerY + rowSpacing * 8.4,
      'cyan',
      340,
      480
    );
    createdItems.push(community);
    await delay(350);

    // ===== REFERRAL PROGRAM =====
    console.log('Creating referral program...');
    const referral = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">🎁 REFERRAL PROGRAM DESIGN</b><br><br>' +
      '<b>Why Referrals Work:</b><br>' +
      '• 5x cheaper than ads<br>' +
      '• 3x higher close rate<br>' +
      '• Pre-qualified leads<br>' +
      '• Trust already built<br><br>' +
      '<b>Referral Structure (3 Tiers):</b><br><br>' +
      '<b>Tier 1: Customer Referrals</b><br>' +
      '• Current clients refer friends<br>' +
      '• Reward: $500 credit per referral<br>' +
      '  (applied to next purchase/renewal)<br>' +
      '• Or: 1 month free coaching<br><br>' +
      '<b>Tier 2: Affiliate Program</b><br>' +
      '• For audience builders (not clients)<br>' +
      '• Commission: 20% recurring<br>' +
      '• Example: They refer $10K client = $2K<br>' +
      '• Tools: Rewardful or PartnerStack<br><br>' +
      '<b>Tier 3: Strategic Partners</b><br>' +
      '• Other coaches, consultants<br>' +
      '• Revenue share: 30-50%<br>' +
      '• They deliver part of the program<br><br>' +
      '<b>How to Launch:</b><br>' +
      '1. Start with Tier 1 (clients only)<br>' +
      '2. Add Tier 2 after 20+ clients<br>' +
      '3. Add Tier 3 in Year 2-3<br><br>' +
      '<b>Referral Ask Template:</b><br>' +
      '"Who else do you know struggling with [problem]?<br>' +
      'If you refer them and they join, you get [reward]."<br><br>' +
      '<b>Timing:</b><br>' +
      '• Ask after they get their first win<br>' +
      '• Ask at program completion<br>' +
      '• Include in every testimonial request',
      centerX - colSpacing * 2.8,
      centerY + rowSpacing * 9.8,
      'yellow',
      340,
      480
    );
    createdItems.push(referral);
    await delay(350);

    // ===== SPEAKING STRATEGY =====
    console.log('Creating speaking strategy...');
    const speaking = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">🎤 SPEAKING & WORKSHOP STRATEGY</b><br><br>' +
      '<b>Timeline: Start in Year 2-3</b><br><br>' +
      '<b>Types of Speaking Gigs:</b><br>' +
      '1. <b>Free (Authority Building)</b><br>' +
      '   • Podcasts: 50-100 appearances<br>' +
      '   • Virtual summits: 10-20/year<br>' +
      '   • Webinars for partners<br>' +
      '   • Goal: Build audience, not revenue<br><br>' +
      '2. <b>Paid (Mid-Tier: $2K-$10K)</b><br>' +
      '   • Industry conferences<br>' +
      '   • Association events<br>' +
      '   • Corporate lunch-and-learns<br>' +
      '   • 30-60 min keynotes<br><br>' +
      '3. <b>Premium ($10K-$50K)</b><br>' +
      '   • Full-day workshops<br>' +
      '   • Multi-day retreats<br>' +
      '   • Executive team training<br>' +
      '   • Requires strong authority<br><br>' +
      '<b>How to Get Booked:</b><br>' +
      '1. Create speaker one-sheet (PDF)<br>' +
      '   • Headshot, bio, topics<br>' +
      '   • Past speaking experience<br>' +
      '   • Video demo reel (3-5 min)<br>' +
      '2. Pitch to event organizers<br>' +
      '   • Find events via Google<br>' +
      '   • LinkedIn search: "event organizer"<br>' +
      '3. Join speaker bureaus (Year 3+)<br><br>' +
      '<b>Signature Talk Structure:</b><br>' +
      '• Hook (story): 5 min<br>' +
      '• Problem: 10 min<br>' +
      '• Framework (3-5 steps): 25 min<br>' +
      '• Call to action: 5 min<br><br>' +
      '<b>Pitch from Stage:</b><br>' +
      '• Lead magnet in presentation<br>' +
      '• QR code for opt-in<br>' +
      '• Back-of-room sales (books/courses)',
      centerX - colSpacing * 1.6,
      centerY + rowSpacing * 9.8,
      'pink',
      340,
      480
    );
    createdItems.push(speaking);
    await delay(350);

    // ===== BOOK WRITING ROADMAP =====
    console.log('Creating book writing roadmap...');
    const bookRoadmap = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📖 BOOK WRITING ROADMAP</b><br><br>' +
      '<b>Timeline: Year 2-3 (when you have proof)</b><br><br>' +
      '<b>Why Write a Book:</b><br>' +
      '• Ultimate authority builder<br>' +
      '• Opens speaking opportunities<br>' +
      '• Lead generation machine<br>' +
      '• Premium pricing justification<br>' +
      '• Direct revenue: $50K-$200K<br><br>' +
      '<b>Traditional vs Self-Publishing:</b><br><br>' +
      '<b>Traditional Publishing:</b><br>' +
      '✓ Credibility, bookstore distribution<br>' +
      '✗ Takes 18-24 months<br>' +
      '✗ Lower royalties (10-15%)<br>' +
      '✗ Less control<br><br>' +
      '<b>Self-Publishing:</b><br>' +
      '✓ Fast (3-6 months)<br>' +
      '✓ Higher royalties (70%)<br>' +
      '✓ Full control<br>' +
      '✗ You handle everything<br><br>' +
      '<b>Recommended: Self-Publish First</b><br><br>' +
      '<b>6-Month Book Plan:</b><br>' +
      'Month 1-2: Outline & research<br>' +
      'Month 3-4: Write (40K-60K words)<br>' +
      'Month 5: Edit & design<br>' +
      'Month 6: Launch campaign<br><br>' +
      '<b>Book Launch Strategy:</b><br>' +
      '• Pre-sell to email list<br>' +
      '• Amazon bestseller campaign<br>' +
      '• Bulk sales to corporations<br>' +
      '• Use as high-ticket bonus<br><br>' +
      '<b>Title Ideas:</b><br>' +
      '• "The Agency Freedom Method"<br>' +
      '• "Scale Your Agency, Reclaim Your Life"<br>' +
      '• "The $1M Agency Blueprint"',
      centerX - colSpacing * 0.4,
      centerY + rowSpacing * 9.8,
      'orange',
      340,
      460
    );
    createdItems.push(bookRoadmap);
    await delay(350);

    // ===== MEDIA OUTREACH =====
    console.log('Creating media outreach strategy...');
    const mediaOutreach = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📰 MEDIA & PR STRATEGY</b><br><br>' +
      '<b>Timeline: Year 2-3</b><br><br>' +
      '<b>Why Media Matters:</b><br>' +
      '• Instant credibility<br>' +
      '• "As Seen In" logos on website<br>' +
      '• Traffic spike<br>' +
      '• Higher pricing power<br><br>' +
      '<b>Target Publications:</b><br><br>' +
      '<b>Tier 1 (Dream Goals):</b><br>' +
      '• Forbes, Inc, Entrepreneur<br>' +
      '• Fast Company, Business Insider<br>' +
      '• Require strong credentials<br><br>' +
      '<b>Tier 2 (Achievable Year 2):</b><br>' +
      '• Industry-specific publications<br>' +
      '• Agency/marketing blogs<br>' +
      '• Podcast features<br><br>' +
      '<b>Tier 3 (Start Here):</b><br>' +
      '• Local business journals<br>' +
      '• Your own guest posts<br>' +
      '• Partner websites<br><br>' +
      '<b>How to Get Featured:</b><br><br>' +
      '1. <b>Use HARO (Help A Reporter Out)</b><br>' +
      '   • Free service<br>' +
      '   • Respond to journalist queries<br>' +
      '   • 3-5 pitches per week<br><br>' +
      '2. <b>Pitch Your Own Story</b><br>' +
      '   • Find journalists on Twitter/LinkedIn<br>' +
      '   • Pitch unique angle or data<br>' +
      '   • Example: "I analyzed 100 agencies..."<br><br>' +
      '3. <b>Hire PR Firm (Year 3)</b><br>' +
      '   • Cost: $3K-$10K/month<br>' +
      '   • They pitch on your behalf<br>' +
      '   • Worth it when revenue > $500K<br><br>' +
      '<b>PR One-Sheet:</b><br>' +
      '• Professional headshot<br>' +
      '• Bio (100 words)<br>' +
      '• 3-5 talk topics<br>' +
      '• Past media features',
      centerX + colSpacing * 0.8,
      centerY + rowSpacing * 9.8,
      'red',
      340,
      480
    );
    createdItems.push(mediaOutreach);
    await delay(350);

    // ===== NETWORKING STRATEGY =====
    console.log('Creating networking strategy...');
    const networking = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">🤝 NETWORKING STRATEGY</b><br><br>' +
      '<b>Why Network: 80% of opportunities come from relationships</b><br><br>' +
      '<b>Online Networking (Daily):</b><br><br>' +
      '<b>LinkedIn (30 min/day):</b><br>' +
      '• Comment on 10-20 target profiles<br>' +
      '• Send 5-10 connection requests<br>' +
      '• DM 2-3 people with value (not pitch)<br>' +
      '• Share others\' content<br><br>' +
      '<b>Twitter/X (20 min/day):</b><br>' +
      '• Engage with industry leaders<br>' +
      '• Quote tweet with insights<br>' +
      '• Build relationships publicly<br><br>' +
      '<b>Instagram DMs (15 min/day):</b><br>' +
      '• Reply to story mentions<br>' +
      '• Engage with peers\' content<br>' +
      '• Build genuine friendships<br><br>' +
      '<b>In-Person Networking (Monthly):</b><br><br>' +
      '<b>Events to Attend:</b><br>' +
      '• Industry conferences (2-3/year)<br>' +
      '• Local business meetups (1-2/month)<br>' +
      '• Mastermind groups<br>' +
      '• Workshops & training<br><br>' +
      '<b>Networking Best Practices:</b><br>' +
      '1. <b>Give First</b><br>' +
      '   • Make intros for others<br>' +
      '   • Share resources<br>' +
      '   • Offer help (no strings)<br>' +
      '2. <b>Follow Up Within 24 Hours</b><br>' +
      '   • Send LinkedIn message<br>' +
      '   • Reference conversation<br>' +
      '   • Suggest next step<br>' +
      '3. <b>Stay In Touch</b><br>' +
      '   • Monthly check-ins<br>' +
      '   • Share relevant content<br>' +
      '   • Celebrate their wins',
      centerX + colSpacing * 2.0,
      centerY + rowSpacing * 9.8,
      'cyan',
      340,
      460
    );
    createdItems.push(networking);
    await delay(350);

    // ===== PERSONAL BRAND BUILDING =====
    console.log('Creating personal brand strategy...');
    const personalBrand = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">💎 PERSONAL BRAND BUILDING</b><br><br>' +
      '<b>Your Brand = Your Business Value</b><br><br>' +
      '<b>Brand Pillars (Choose 3-5):</b><br><br>' +
      '<b>1. Agency Systems Expert</b><br>' +
      '• Known for: Systemization & automation<br>' +
      '• Content: SOPs, processes, templates<br><br>' +
      '<b>2. Freedom Lifestyle Advocate</b><br>' +
      '• Known for: Work-life balance<br>' +
      '• Content: Time management, delegation<br><br>' +
      '<b>3. Straight-Shooter</b><br>' +
      '• Known for: Honest, no BS advice<br>' +
      '• Content: Reality checks, truth bombs<br><br>' +
      '<b>4. Data-Driven</b><br>' +
      '• Known for: Metrics, numbers, proof<br>' +
      '• Content: Case studies, analytics<br><br>' +
      '<b>Visual Brand Identity:</b><br><br>' +
      '<b>Colors:</b> Choose 2-3 brand colors<br>' +
      '• Use consistently across all platforms<br>' +
      '• Example: Navy blue + orange accent<br><br>' +
      '<b>Fonts:</b> 2 fonts max<br>' +
      '• Heading font (bold, attention-grabbing)<br>' +
      '• Body font (clean, readable)<br><br>' +
      '<b>Photography Style:</b><br>' +
      '• Consistent filter/editing<br>' +
      '• Similar backgrounds<br>' +
      '• Professional but approachable<br><br>' +
      '<b>Voice & Tone:</b><br>' +
      '• Confident but not arrogant<br>' +
      '• Educational but not boring<br>' +
      '• Personal but not oversharing<br>' +
      '• Example: "Here\'s what I learned..."<br><br>' +
      '<b>Signature Elements:</b><br>' +
      '• Catchphrase: "Scale smart, not hard"<br>' +
      '• Sign-off: "Build the business that runs without you"<br>' +
      '• Framework: Your unique acronym',
      centerX + colSpacing * 3.2,
      centerY + rowSpacing * 9.8,
      'violet',
      340,
      480
    );
    createdItems.push(personalBrand);
    await delay(350);

    // ===== YEAR 2 Q1-Q4 BREAKDOWN =====
    console.log('Creating Year 2 quarterly breakdown...');
    const year2Quarters = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 YEAR 2: QUARTERLY BREAKDOWN</b><br><br>' +
      '<b>Q1 (Months 19-21): Foundation Scale</b><br>' +
      '• Launch #1: Group program ($8K, 15 clients = $120K)<br>' +
      '• Start evergreen course setup<br>' +
      '• Hire launch manager<br>' +
      '• Build waitlist for mastermind<br>' +
      '• Revenue goal: $120K-$150K<br><br>' +
      '<b>Q2 (Months 22-24): Diversify</b><br>' +
      '• Launch evergreen course ($997-$1,497)<br>' +
      '• First mastermind cohort ($15K, 10 people = $150K)<br>' +
      '• Scale paid ads to $3K-$5K/month<br>' +
      '• Hire content strategist<br>' +
      '• Revenue goal: $150K-$200K<br><br>' +
      '<b>Q3 (Months 25-27): Optimize</b><br>' +
      '• Launch #2: Group program ($10K, 20 clients = $200K)<br>' +
      '• Optimize evergreen funnel<br>' +
      '• Plan book writing (if ready)<br>' +
      '• Apply to speak at 5-10 events<br>' +
      '• Revenue goal: $200K-$250K<br><br>' +
      '<b>Q4 (Months 28-30): Scale</b><br>' +
      '• Second mastermind cohort ($20K, 12 people = $240K)<br>' +
      '• Black Friday sale (low-ticket surge)<br>' +
      '• Year-end push (bonus for Q1 launch)<br>' +
      '• Plan Year 3 strategy<br>' +
      '• Revenue goal: $240K-$300K<br><br>' +
      '<b>Year 2 Total Revenue:</b><br>' +
      '💰 $710K-$900K<br><br>' +
      '<b>Team by End of Year 2:</b><br>' +
      '• Launch Manager<br>' +
      '• Content Strategist<br>' +
      '• Community Manager<br>' +
      '• Video Editor<br>' +
      '• VA',
      centerX - colSpacing * 2.8,
      centerY + rowSpacing * 11.2,
      'green',
      340,
      480
    );
    createdItems.push(year2Quarters);
    await delay(350);

    // ===== YEAR 3 QUARTERLY BREAKDOWN =====
    console.log('Creating Year 3 quarterly breakdown...');
    const year3Quarters = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">📅 YEAR 3: QUARTERLY BREAKDOWN</b><br><br>' +
      '<b>Q1 (Months 31-33): Premium Positioning</b><br>' +
      '• Launch elite mastermind ($25K-$30K annual)<br>' +
      '• Target: 15-20 members = $375K-$600K<br>' +
      '• Start book writing process<br>' +
      '• First speaking gigs (3-5 paid events)<br>' +
      '• Revenue goal: $400K-$600K<br><br>' +
      '<b>Q2 (Months 34-36): Authority Building</b><br>' +
      '• Done-with-you packages ($50K-$75K)<br>' +
      '• Target: 3-5 clients = $150K-$375K<br>' +
      '• Book writing continues<br>' +
      '• Speaking: 5-10 events<br>' +
      '• Media features: HARO pitches<br>' +
      '• Revenue goal: $400K-$500K<br><br>' +
      '<b>Q3 (Months 37-39): Book Launch</b><br>' +
      '• Publish book + launch campaign<br>' +
      '• Book sales: $50K-$100K<br>' +
      '• Speaking surge (book tour)<br>' +
      '• Elite mastermind cohort 2<br>' +
      '• Revenue goal: $450K-$600K<br><br>' +
      '<b>Q4 (Months 40-42): Scale Leadership</b><br>' +
      '• Year-end group program launch<br>' +
      '• Done-with-you: 3-5 more clients<br>' +
      '• Plan Year 4: Certification program<br>' +
      '• Build software/SaaS roadmap<br>' +
      '• Revenue goal: $500K-$700K<br><br>' +
      '<b>Year 3 Total Revenue:</b><br>' +
      '💰 $1.75M-$2.4M<br><br>' +
      '<b>Team Expansion:</b><br>' +
      '• COO (operations manager)<br>' +
      '• Head of Sales<br>' +
      '• 2-3 Coaches (deliver programs)<br>' +
      '• Marketing Manager<br>' +
      '• PR/Media person (contractor)',
      centerX - colSpacing * 1.6,
      centerY + rowSpacing * 11.2,
      'violet',
      340,
      480
    );
    createdItems.push(year3Quarters);
    await delay(350);

    // ===== CERTIFICATION PROGRAM =====
    console.log('Creating certification program details...');
    const certification = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">🎓 CERTIFICATION PROGRAM (Year 4+)</b><br><br>' +
      '<b>What: Train other coaches to use YOUR method</b><br><br>' +
      '<b>Why Build Certification:</b><br>' +
      '• Scalable revenue (train once, sell many times)<br>' +
      '• Network effect (certified coaches promote you)<br>' +
      '• Additional revenue stream: $300K-$800K/year<br>' +
      '• Market dominance (your methodology everywhere)<br><br>' +
      '<b>Certification Structure:</b><br><br>' +
      '<b>Program Design:</b><br>' +
      '• 8-12 week training<br>' +
      '• Learn your frameworks & systems<br>' +
      '• Practice delivery & coaching<br>' +
      '• Final exam/assessment<br>' +
      '• Ongoing support community<br><br>' +
      '<b>Pricing:</b><br>' +
      '• One-time: $10K-$25K<br>' +
      '• OR Annual license: $5K-$10K/year<br><br>' +
      '<b>What They Get:</b><br>' +
      '• Full curriculum (white-label)<br>' +
      '• Marketing materials<br>' +
      '• Sales scripts<br>' +
      '• Your brand association<br>' +
      '• Referrals from you<br><br>' +
      '<b>Revenue Model Options:</b><br><br>' +
      '<b>Option 1: One-Time Fee</b><br>' +
      '• $15K per coach<br>' +
      '• Train 20-40/year = $300K-$600K<br><br>' +
      '<b>Option 2: License + Royalty</b><br>' +
      '• $10K upfront<br>' +
      '• + 10% of their revenue<br>' +
      '• More aligned, higher LTV<br><br>' +
      '<b>Ideal Certified Coach:</b><br>' +
      '• Has audience (5K-20K)<br>' +
      '• Wants methodology (not create own)<br>' +
      '• Complementary niche',
      centerX - colSpacing * 0.4,
      centerY + rowSpacing * 11.2,
      'yellow',
      340,
      460
    );
    createdItems.push(certification);
    await delay(350);

    // ===== SAAS/SOFTWARE STRATEGY =====
    console.log('Creating SaaS strategy...');
    const saasStrategy = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">💻 SaaS/SOFTWARE STRATEGY (Year 4+)</b><br><br>' +
      '<b>Why Build Software:</b><br>' +
      '• Recurring revenue (MRR)<br>' +
      '• Higher valuation (10x+ revenue)<br>' +
      '• Passive income layer<br>' +
      '• Competitive moat<br><br>' +
      '<b>Software Ideas for Agency Coaches:</b><br><br>' +
      '<b>1. Agency Profitability Dashboard</b><br>' +
      '• Track revenue, expenses, profit margins<br>' +
      '• Pricing: $49-$99/month<br>' +
      '• Market: 50K+ agencies in US<br>' +
      '• Revenue potential: $200K-$500K/year<br><br>' +
      '<b>2. SOP Library & Automation</b><br>' +
      '• Pre-built templates<br>' +
      '• Customizable workflows<br>' +
      '• Pricing: $97-$197/month<br>' +
      '• Bundle with coaching<br><br>' +
      '<b>3. Client Onboarding Platform</b><br>' +
      '• Automated welcome sequences<br>' +
      '• Project kick-off tools<br>' +
      '• Pricing: $79-$149/month<br><br>' +
      '<b>Development Approach:</b><br><br>' +
      '<b>Don\'t Code Yourself!</b><br>' +
      '• Hire dev team or agency<br>' +
      '• Cost: $50K-$200K to build MVP<br>' +
      '• Timeline: 6-12 months<br><br>' +
      '<b>Or Partner:</b><br>' +
      '• Find existing tool<br>' +
      '• White-label it<br>' +
      '• Revenue share: 20-40%<br><br>' +
      '<b>Launch Strategy:</b><br>' +
      '• Beta to existing clients (free)<br>' +
      '• Get feedback & testimonials<br>' +
      '• Public launch with case studies<br>' +
      '• Bundle with high-ticket offers<br><br>' +
      '<b>Goal:</b> $200K-$800K ARR by Year 5',
      centerX + colSpacing * 0.8,
      centerY + rowSpacing * 11.2,
      'blue',
      340,
      480
    );
    createdItems.push(saasStrategy);
    await delay(350);

    // ===== LIVE EVENTS STRATEGY =====
    console.log('Creating live events strategy...');
    const liveEvents = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">🎪 LIVE EVENTS STRATEGY (Year 4-5)</b><br><br>' +
      '<b>Why Host Events:</b><br>' +
      '• High revenue in short time<br>' +
      '• Deepen relationships<br>' +
      '• Back-of-room sales<br>' +
      '• Content creation goldmine<br>' +
      '• Network building<br><br>' +
      '<b>Event Types:</b><br><br>' +
      '<b>1. Annual Conference</b><br>' +
      '• 2-3 days<br>' +
      '• 300-500 attendees<br>' +
      '• Ticket: $997-$2,497<br>' +
      '• Revenue: $300K-$1.2M<br>' +
      '• Includes: Speakers, workshops, networking<br><br>' +
      '<b>2. Quarterly Workshops</b><br>' +
      '• 1 day intensive<br>' +
      '• 30-50 attendees<br>' +
      '• Ticket: $497-$997<br>' +
      '• Revenue: $15K-$50K per event<br>' +
      '• Hands-on, tactical training<br><br>' +
      '<b>3. VIP Mastermind Retreats</b><br>' +
      '• 3-4 days<br>' +
      '• 10-20 attendees (invite-only)<br>' +
      '• Price: $5K-$15K<br>' +
      '• Revenue: $50K-$300K<br>' +
      '• Luxury venue, exclusive access<br><br>' +
      '<b>Event Planning Timeline:</b><br><br>' +
      '<b>6 Months Before:</b><br>' +
      '• Book venue<br>' +
      '• Confirm speakers<br>' +
      '• Create event page<br><br>' +
      '<b>3 Months Before:</b><br>' +
      '• Launch ticket sales<br>' +
      '• Email marketing campaign<br>' +
      '• Early bird pricing<br><br>' +
      '<b>1 Month Before:</b><br>' +
      '• Final push<br>' +
      '• Confirm logistics<br>' +
      '• Prepare materials<br><br>' +
      '<b>Event Monetization:</b><br>' +
      '• Ticket sales (primary)<br>' +
      '• Sponsors ($5K-$50K each)<br>' +
      '• Back-of-room sales<br>' +
      '• VIP upgrades<br>' +
      '• Recording sales',
      centerX + colSpacing * 2.0,
      centerY + rowSpacing * 11.2,
      'pink',
      340,
      480
    );
    createdItems.push(liveEvents);
    await delay(350);

    // ===== EXIT STRATEGY =====
    console.log('Creating exit strategy...');
    const exitStrategy = await createShape(
      MIRO_ACCESS_TOKEN,
      MIRO_BOARD_ID,
      '<b style="font-size:15px;">🚀 EXIT STRATEGY (Year 5+)</b><br><br>' +
      '<b>3 Potential Paths:</b><br><br>' +
      '<b>Path 1: SELL THE BUSINESS</b><br><br>' +
      '<b>Valuation Multiples:</b><br>' +
      '• Coaching business: 2-4x annual profit<br>' +
      '• With software: 5-10x annual revenue<br>' +
      '• Example: $3M profit = $6M-$12M sale<br><br>' +
      '<b>Who Buys:</b><br>' +
      '• Private equity firms<br>' +
      '• Larger education companies<br>' +
      '• Strategic acquirers<br><br>' +
      '<b>Preparation (12-24 months):</b><br>' +
      '• Remove yourself from operations<br>' +
      '• Build systems & team<br>' +
      '• Clean financials<br>' +
      '• Documented processes<br><br>' +
      '<b>Path 2: SCALE TO $10M+</b><br><br>' +
      '<b>Growth Levers:</b><br>' +
      '• Certification (train 100+ coaches)<br>' +
      '• Software (10K+ customers)<br>' +
      '• Events (1K+ attendees)<br>' +
      '• Multiple brands<br><br>' +
      '<b>Team Required:</b><br>' +
      '• 20-50 employees<br>' +
      '• C-suite (CEO, COO, CFO, CMO)<br>' +
      '• Department heads<br><br>' +
      '<b>Path 3: LIFESTYLE BUSINESS</b><br><br>' +
      '<b>Maintain $2M-$5M/year:</b><br>' +
      '• Work 10-15 hours/week<br>' +
      '• Keep it small & profitable<br>' +
      '• Focus on freedom<br>' +
      '• Enjoy the lifestyle<br><br>' +
      '<b>Structure:</b><br>' +
      '• Elite mastermind (20 members)<br>' +
      '• Done-with-you (5-10 clients)<br>' +
      '• Passive products<br>' +
      '• Small team (5-10 people)<br><br>' +
      '<b>Decision Timeline:</b><br>' +
      'Year 3: Decide which path<br>' +
      'Year 4-5: Execute strategy',
      centerX + colSpacing * 3.2,
      centerY + rowSpacing * 11.2,
      'red',
      340,
      480
    );
    createdItems.push(exitStrategy);
    await delay(350);

    console.log('\n✅ Ultimate mind map created successfully!');
    console.log(`📍 Total SHAPES created: ${createdItems.length}`);
    console.log(`🔗 View your board at: https://miro.com/app/board/${MIRO_BOARD_ID}/`);

  } catch (error) {
    console.error('❌ Error creating mind map:', error.message);
    if (error.message.includes('API Error')) {
      console.error('\n💡 Possible issues:');
      console.error('   - Check if your token has shapes:write permission');
      console.error('   - Verify board ID is correct');
      console.error('   - Some shapes features may require specific Miro plan');
    }
    process.exit(1);
  }
}

// Run the main function
createUltimateMindMap();
