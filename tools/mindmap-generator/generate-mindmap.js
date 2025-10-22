#!/usr/bin/env node

/**
 * Mind Map Generator for Growth Strategy
 * Converts structured analysis into interactive HTML mind maps using Markmap
 */

const fs = require('fs');
const path = require('path');

// Sample data structure for Derek Rodriguez
const exampleAnalysis = {
  name: "Derek Rodriguez",
  company: "Alpha Ascension",
  currentState: {
    niche: "Agency Growth Expert",
    positioning: "Helps agencies scale to 6-7 figures & remove owners from daily operations",
    instagram: { followers: "TBD", engagement: "TBD" },
    youtube: { subscribers: "TBD", frequency: "TBD" },
    currentOffers: "TBD"
  },
  vision: "Market leader in agency scaling education",
  branches: {
    audienceGrowth: {
      title: "Audience & Community Growth 👥",
      currentState: ["Instagram presence", "YouTube channel", "Lead magnet active"],
      opportunities: [
        {
          name: "YouTube SEO Optimization",
          timeline: "0-3 months",
          impact: "HIGH",
          effort: "MEDIUM",
          actions: [
            "Keyword research for 'agency scaling' terms",
            "Optimize titles for search intent",
            "Create playlist series on specific topics",
            "Add timestamps and chapters"
          ],
          metrics: ["3x organic views", "500+ new subs/month"]
        },
        {
          name: "Podcast Interview Circuit",
          timeline: "3-6 months",
          impact: "HIGH",
          effort: "MEDIUM",
          actions: [
            "Target 20 business/agency podcasts",
            "Prepare signature stories/frameworks",
            "Create podcast pitch template",
            "Repurpose content for social"
          ],
          metrics: ["20+ interviews", "5K+ new leads"]
        }
      ],
      competitive: {
        leaders: ["Karl Sakas", "Parakeeto", "GYDA"],
        insights: ["Long-form content dominates", "Community-first approach works"]
      }
    },
    positioning: {
      title: "Expertise & Positioning 🎯",
      currentStrengths: ["Agency expertise", "6-7 figure results"],
      opportunities: [
        {
          name: "Signature Framework Development",
          timeline: "1-2 months",
          impact: "HIGH",
          effort: "LOW",
          actions: [
            "Create proprietary 'Alpha Ascension Method'",
            "Name each phase/step memorably",
            "Design visual framework diagram",
            "Use in all content/marketing"
          ],
          metrics: ["Brand recognition", "Increased positioning"]
        },
        {
          name: "Case Study Documentation",
          timeline: "Ongoing",
          impact: "HIGH",
          effort: "MEDIUM",
          actions: [
            "Document 5-10 agency transformations",
            "Get video testimonials from clients",
            "Show before/after metrics",
            "Create mini case study videos"
          ],
          metrics: ["20+ detailed case studies", "Social proof library"]
        }
      ]
    },
    monetization: {
      title: "Monetization Architecture 💰",
      current: "TBD - awaiting details",
      opportunities: [
        {
          category: "HIGH-TICKET",
          name: "Group Mastermind Program",
          priceRange: "$7K-$15K for 6-12 months",
          format: "12-month mastermind for $5M-$20M agencies",
          marketBenchmark: "Similar programs: $10K-$25K",
          actions: [
            "Create application funnel",
            "Design 12-month curriculum",
            "Build private community",
            "Monthly group calls + quarterly retreats"
          ],
          revenue: "10 clients × $12K = $120K/cohort"
        },
        {
          category: "MID-TICKET",
          name: "Agency Scaling Blueprint Course",
          priceRange: "$997-$1,997",
          format: "Self-paced + group coaching hybrid",
          marketBenchmark: "Agency courses: $500-$2K",
          actions: [
            "6-8 module course on agency systems",
            "Weekly Q&A calls for 8 weeks",
            "Template library + SOP pack",
            "Private Slack community"
          ],
          revenue: "50 sales × $1,497 = $74K/launch"
        },
        {
          category: "LOW-TICKET",
          name: "Agency Owner's Playbook",
          priceRange: "$47-$97",
          format: "Digital guide + templates",
          actions: [
            "Comprehensive PDF guide",
            "10+ template pack",
            "Video walkthroughs",
            "Upsell to mid-ticket"
          ],
          revenue: "$5K-$10K passive/month"
        }
      ],
      competitivePricing: {
        "Karl Sakas": "$10K+ for consulting",
        "Parakeeto": "$997-$5K+ programs",
        "GYDA": "$5K-$15K mastermind"
      }
    },
    contentMarketing: {
      title: "Content & Marketing Strategy 📈",
      opportunities: [
        {
          name: "Long-Form Content Hub",
          platform: "YouTube + Blog",
          actions: [
            "Weekly 'Agency Scaling Deep Dive' series",
            "Case study breakdowns (15-20 min)",
            "Client interviews & transformations",
            "Tactical 'How-To' tutorials"
          ],
          seo: [
            "Target: 'how to scale an agency'",
            "Target: 'agency profit margins'",
            "Target: 'remove yourself from agency'"
          ]
        },
        {
          name: "Short-Form Authority Content",
          platform: "Instagram Reels + TikTok",
          actions: [
            "Daily tips for agency owners",
            "Myth-busting common beliefs",
            "Client results screenshots",
            "Behind-the-scenes of scaling"
          ],
          frequency: "5-7 posts/week"
        }
      ]
    },
    operations: {
      title: "Operational Excellence ⚙️",
      systemsNeeded: [
        {
          name: "Email Marketing Automation",
          tools: "ActiveCampaign or ConvertKit",
          sequences: [
            "Welcome series (5-7 emails)",
            "Nurture sequence (bi-weekly)",
            "Launch sequence (10-14 days)",
            "Webinar funnel automation"
          ]
        },
        {
          name: "Course/Community Platform",
          options: ["Kajabi ($199/mo)", "Circle ($89/mo)", "Skool ($99/mo)"],
          features: "Courses + community + email in one"
        }
      ]
    },
    quickWins: {
      title: "Quick Wins (0-3 months) ⚡",
      wins: [
        {
          action: "Add email capture to top YouTube videos",
          impact: "500-1K new leads/month",
          effort: "2 hours"
        },
        {
          action: "Create $97 'Agency Systems' template pack",
          impact: "$2K-$5K/month passive",
          effort: "1 week"
        },
        {
          action: "Launch LinkedIn content repurposing",
          impact: "Reach agency decision makers",
          effort: "30 min/day"
        },
        {
          action: "Start agency owner email newsletter",
          impact: "Build relationship with list",
          effort: "2 hours/week"
        }
      ]
    }
  },
  threeYearRoadmap: {
    year1: {
      focus: "Foundation & First Offers",
      milestones: [
        "Launch low-ticket offer ($47-$97): $5K-$10K/mo",
        "Beta launch group program ($3K-$5K): $30K-$50K",
        "Build email list to 10K",
        "20+ case studies documented",
        "Revenue: $10K-$30K/month"
      ]
    },
    year2: {
      focus: "Scale & Optimize",
      milestones: [
        "2-3 high-ticket launches/year ($7K-$10K)",
        "Evergreen low-ticket funnel: $15K-$25K/mo",
        "Podcast/speaking 20+ appearances",
        "Team: VA + launch manager",
        "Revenue: $40K-$80K/month"
      ]
    },
    year3: {
      focus: "Market Leadership",
      milestones: [
        "Elite mastermind ($15K-$25K): 20-30 members",
        "Annual agency conference/retreat",
        "Book deal or major publication",
        "Certification program for coaches",
        "Revenue: $100K-$200K/month"
      ]
    }
  }
};

/**
 * Convert analysis object to Markmap markdown format
 */
function generateMarkdownMindMap(analysis) {
  let markdown = `# ${analysis.name} - Growth Strategy\n\n`;

  // Current State
  markdown += `## 🎯 Current Position\n\n`;
  markdown += `### Strengths\n`;
  markdown += `- **Niche**: ${analysis.currentState.niche}\n`;
  markdown += `- **Positioning**: ${analysis.currentState.positioning}\n`;
  markdown += `- **Company**: ${analysis.currentState.company}\n\n`;

  markdown += `### Current Channels\n`;
  markdown += `- **Instagram**: ${analysis.currentState.instagram.followers} followers\n`;
  markdown += `- **YouTube**: ${analysis.currentState.youtube.subscribers} subscribers\n`;
  markdown += `- **Offers**: ${analysis.currentState.currentOffers}\n\n`;

  markdown += `### Vision\n`;
  markdown += `- ${analysis.vision}\n\n`;

  // Audience Growth
  const audienceGrowth = analysis.branches.audienceGrowth;
  markdown += `## 👥 ${audienceGrowth.title}\n\n`;

  audienceGrowth.opportunities.forEach(opp => {
    markdown += `### ${opp.name}\n`;
    markdown += `- **Timeline**: ${opp.timeline}\n`;
    markdown += `- **Impact**: ${opp.impact} | **Effort**: ${opp.effort}\n\n`;
    markdown += `#### Actions\n`;
    opp.actions.forEach(action => {
      markdown += `- ${action}\n`;
    });
    markdown += `\n#### Success Metrics\n`;
    opp.metrics.forEach(metric => {
      markdown += `- ${metric}\n`;
    });
    markdown += `\n`;
  });

  markdown += `### Competitive Landscape\n`;
  markdown += `- **Leaders**: ${audienceGrowth.competitive.leaders.join(', ')}\n`;
  audienceGrowth.competitive.insights.forEach(insight => {
    markdown += `- ${insight}\n`;
  });
  markdown += `\n`;

  // Positioning
  const positioning = analysis.branches.positioning;
  markdown += `## 🎯 ${positioning.title}\n\n`;

  positioning.opportunities.forEach(opp => {
    markdown += `### ${opp.name}\n`;
    markdown += `- **Timeline**: ${opp.timeline}\n`;
    markdown += `- **Impact**: ${opp.impact} | **Effort**: ${opp.effort}\n\n`;
    markdown += `#### Actions\n`;
    opp.actions.forEach(action => {
      markdown += `- ${action}\n`;
    });
    markdown += `\n`;
  });

  // Monetization
  const monetization = analysis.branches.monetization;
  markdown += `## 💰 ${monetization.title}\n\n`;

  monetization.opportunities.forEach(opp => {
    markdown += `### ${opp.category}: ${opp.name}\n`;
    markdown += `- **Price Range**: ${opp.priceRange}\n`;
    markdown += `- **Format**: ${opp.format}\n`;
    markdown += `- **Market Benchmark**: ${opp.marketBenchmark}\n`;
    markdown += `- **Revenue Potential**: ${opp.revenue}\n\n`;
    markdown += `#### Actions\n`;
    opp.actions.forEach(action => {
      markdown += `- ${action}\n`;
    });
    markdown += `\n`;
  });

  markdown += `### Competitive Pricing\n`;
  Object.entries(monetization.competitivePricing).forEach(([competitor, pricing]) => {
    markdown += `- **${competitor}**: ${pricing}\n`;
  });
  markdown += `\n`;

  // Content Marketing
  const content = analysis.branches.contentMarketing;
  markdown += `## 📈 ${content.title}\n\n`;

  content.opportunities.forEach(opp => {
    markdown += `### ${opp.name}\n`;
    markdown += `- **Platform**: ${opp.platform}\n\n`;
    markdown += `#### Actions\n`;
    opp.actions.forEach(action => {
      markdown += `- ${action}\n`;
    });
    if (opp.seo) {
      markdown += `\n#### SEO Opportunities\n`;
      opp.seo.forEach(keyword => {
        markdown += `- ${keyword}\n`;
      });
    }
    if (opp.frequency) {
      markdown += `\n- **Frequency**: ${opp.frequency}\n`;
    }
    markdown += `\n`;
  });

  // Quick Wins
  const quickWins = analysis.branches.quickWins;
  markdown += `## ⚡ ${quickWins.title}\n\n`;

  quickWins.wins.forEach(win => {
    markdown += `### ${win.action}\n`;
    markdown += `- **Impact**: ${win.impact}\n`;
    markdown += `- **Effort**: ${win.effort}\n\n`;
  });

  // 3-Year Roadmap
  markdown += `## 🗓️ 3-Year Growth Roadmap\n\n`;

  markdown += `### Year 1: ${analysis.threeYearRoadmap.year1.focus}\n`;
  analysis.threeYearRoadmap.year1.milestones.forEach(milestone => {
    markdown += `- ${milestone}\n`;
  });
  markdown += `\n`;

  markdown += `### Year 2: ${analysis.threeYearRoadmap.year2.focus}\n`;
  analysis.threeYearRoadmap.year2.milestones.forEach(milestone => {
    markdown += `- ${milestone}\n`;
  });
  markdown += `\n`;

  markdown += `### Year 3: ${analysis.threeYearRoadmap.year3.focus}\n`;
  analysis.threeYearRoadmap.year3.milestones.forEach(milestone => {
    markdown += `- ${milestone}\n`;
  });
  markdown += `\n`;

  return markdown;
}

/**
 * Generate HTML with embedded Markmap visualization
 */
function generateHTMLMindMap(markdown, title) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Growth Strategy Mind Map</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .header p {
      font-size: 1.2em;
      opacity: 0.9;
    }
    #mindmap {
      width: 100%;
      height: 800px;
      background: #fafafa;
    }
    .instructions {
      padding: 30px 40px;
      background: #f8f9fa;
      border-top: 2px solid #e9ecef;
    }
    .instructions h2 {
      color: #495057;
      margin-bottom: 15px;
      font-size: 1.5em;
    }
    .instructions ul {
      list-style: none;
      padding: 0;
    }
    .instructions li {
      padding: 10px 0;
      color: #6c757d;
      font-size: 1.1em;
    }
    .instructions li::before {
      content: "→ ";
      color: #667eea;
      font-weight: bold;
      margin-right: 10px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6c757d;
      font-size: 0.9em;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
  <script src="https://cdn.jsdelivr.net/npm/markmap-view@0.15.4"></script>
  <script src="https://cdn.jsdelivr.net/npm/markmap-lib@0.15.4"></script>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 ${title}</h1>
      <p>Interactive Growth Strategy Mind Map</p>
    </div>

    <svg id="mindmap"></svg>

    <div class="instructions">
      <h2>How to Use This Mind Map</h2>
      <ul>
        <li><strong>Click nodes</strong> to expand/collapse branches</li>
        <li><strong>Zoom</strong> with mouse wheel or pinch gesture</li>
        <li><strong>Pan</strong> by clicking and dragging</li>
        <li><strong>Explore</strong> each branch for detailed strategies and actions</li>
      </ul>
    </div>

    <div class="footer">
      Generated by Growth Strategy Mind Map Coordinator 🤖
    </div>
  </div>

  <script>
    // Markdown content
    const markdown = \`${markdown.replace(/`/g, '\\`')}\`;

    // Create markmap
    const { Markmap, loadCSS, loadJS } = window.markmap;
    const { root } = window.markmap.Transformer.transform(markdown);

    const svg = document.querySelector('#mindmap');
    const mm = Markmap.create(svg, {
      color: (node) => {
        // Color coding based on depth
        const colors = [
          '#667eea', // Level 1
          '#764ba2', // Level 2
          '#f093fb', // Level 3
          '#4facfe', // Level 4
          '#00f2fe', // Level 5
        ];
        return colors[node.depth % colors.length];
      },
      duration: 500,
      maxWidth: 300,
      initialExpandLevel: 2,
    }, root);

    // Fit view on load
    setTimeout(() => {
      mm.fit();
    }, 100);
  </script>
</body>
</html>`;
}

// Main execution
function main() {
  console.log('🚀 Mind Map Generator for Growth Strategy\n');

  // Generate markdown
  console.log('📝 Generating markdown mind map...');
  const markdown = generateMarkdownMindMap(exampleAnalysis);

  // Create output directory
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save markdown file
  const markdownPath = path.join(outputDir, 'growth-strategy.md');
  fs.writeFileSync(markdownPath, markdown, 'utf8');
  console.log(`✅ Markdown saved: ${markdownPath}`);

  // Generate HTML
  console.log('🎨 Generating interactive HTML mind map...');
  const html = generateHTMLMindMap(markdown, exampleAnalysis.name);

  // Save HTML file
  const htmlPath = path.join(outputDir, 'growth-strategy-mindmap.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`✅ HTML mind map saved: ${htmlPath}`);

  console.log('\n🎉 Done! Open growth-strategy-mindmap.html in your browser to view the interactive mind map.\n');
  console.log('📁 Output files:');
  console.log(`   - ${markdownPath}`);
  console.log(`   - ${htmlPath}`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateMarkdownMindMap, generateHTMLMindMap, exampleAnalysis };
