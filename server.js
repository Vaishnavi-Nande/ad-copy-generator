const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;
const DB_FILE = path.join(__dirname, 'db.json');

// Enable CORS middleware explicitly for all domain origins to allow cross-origin API access
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static frontend files from current directory
app.use(express.static(__dirname));

// --- Simulated Database Seeding Helper ---
function getDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialSeeds = generateSeeds();
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSeeds, null, 2));
      return initialSeeds;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(data || '[]');
    if (parsed.length === 0) {
      const initialSeeds = generateSeeds();
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSeeds, null, 2));
      return initialSeeds;
    }
    return parsed;
  } catch (err) {
    console.error("Database read error:", err);
    return [];
  }
}

function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Database write error:", err);
  }
}

function generateSeeds() {
  const now = new Date();
  
  // Date offsets for chronological simulation
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  return [
    {
      id: "seed-1",
      business_name: "Apex Heights",
      industry_type: "Real Estate",
      product_name: "Premium 2 & 3 BHK Smart Apartments",
      target_audience: "Families and investors looking for premium, well-connected homes in Nagpur (Wardha Road / Manish Nagar).",
      campaign_goal: "Lead Generation",
      ad_platform: "Facebook",
      ad_tone: "Luxury",
      headline: "Elevated Living: Premium 2 & 3 BHK Smart Apartments by Apex Heights",
      body_text: "Experience the pinnacle of luxury. \n\nIntroducing Premium 2 & 3 BHK Smart Apartments – the exquisite solution by Apex Heights customized specifically for Families and investors looking for premium, well-connected homes in Nagpur.\n\n✨ Why choose us?\n✔️ Engineered for excellence & reliability\n✔️ Tailored for local Nagpur requirements\n✔️ Crafted exclusively for those who settle for nothing less than perfection\n\nSchedule your private consultation today.",
      cta: "Book Site Visit",
      mock_impressions: 4850,
      mock_ctr: 3.4,
      mock_clicks: 165,
      mock_spend: 520,
      created_at: oneDayAgo.toISOString()
    },
    {
      id: "seed-2",
      business_name: "The Orange Bistro",
      industry_type: "Food & Beverage",
      product_name: "Nagpur's First Orange Mocha & Continental Brunch",
      target_audience: "Youth, foodies, and families looking for a cozy hangout in Nagpur.",
      campaign_goal: "Brand Awareness",
      ad_platform: "Instagram",
      ad_tone: "Friendly",
      headline: "The Orange Bistro - Nagpur's First Orange Mocha",
      body_text: "Hey Nagpur! 👋 Check this out: Nagpur's First Orange Mocha & Continental Brunch is here! ✨\n\nThe Orange Bistro brings you the most cozy & friendly experience yet. Specially made for Youth, foodies, and families looking for a cozy hangout in Nagpur.\n\n💫 What you get:\n✦ Premium local quality in Nagpur\n✦ Attention to detail\n✦ Your new favorite spot in town\n\nDrop by and say hi to the team! 😊",
      cta: "Claim Offer",
      mock_impressions: 3420,
      mock_ctr: 4.2,
      mock_clicks: 144,
      mock_spend: 290,
      created_at: twoDaysAgo.toISOString()
    },
    {
      id: "seed-3",
      business_name: "BizLeap Digital SEO",
      industry_type: "Digital Marketing / IT",
      product_name: "Local SEO Audit & Optimization Packages",
      target_audience: "Nagpur-based SME owners, doctors, retailers, and builders looking to double online enquiries.",
      campaign_goal: "Lead Generation",
      ad_platform: "LinkedIn",
      ad_tone: "Professional",
      headline: "B2B Growth Solution: BizLeap Digital SEO launches Local SEO Audit Packages",
      body_text: "💡 In today's competitive landscape, Nagpur-based SME owners, doctors, retailers, and builders require solutions that drive real business impact.\n\nBizLeap Digital SEO is proud to introduce our latest project: Local SEO Audit & Optimization Packages.\n\nWhy leading Nagpur enterprises trust us:\n📈 High ROI & Proven Efficiency - scale operations seamlessly.\n💼 Dedicated Professional Support - tailored for B2B goals.\n⭐ Trusted by leading professionals across Central India.\n\nReady to take the next step?\n\n🔗 Click below to get free quote today.",
      cta: "Get Free Quote",
      mock_impressions: 5900,
      mock_ctr: 2.3,
      mock_clicks: 136,
      mock_spend: 740,
      created_at: threeDaysAgo.toISOString()
    }
  ];
}

// --- REST API Endpoints ---

// 1. GET /api/history - Retrieve saved copies
app.get('/api/history', (req, res) => {
  const db = getDb();
  res.json(db);
});

// 2. POST /api/history - Save a generated copy
app.post('/api/history', (req, res) => {
  try {
    const { 
      business_name, 
      industry_type, 
      product_name, 
      target_audience, 
      campaign_goal, 
      ad_platform, 
      ad_tone, 
      headline, 
      body_text, 
      cta 
    } = req.body;

    if (!business_name || !product_name || !headline || !body_text) {
      return res.status(400).json({ error: "Missing required campaign parameters." });
    }

    const db = getDb();

    // Simulated marketing metrics calculations
    const mock_impressions = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000; // 1,000 to 5,000
    const mock_ctr = parseFloat((Math.random() * (4.2 - 1.5) + 1.5).toFixed(2)); // 1.5% to 4.2%
    const mock_clicks = Math.round(mock_impressions * (mock_ctr / 100));
    const mock_spend = Math.floor(Math.random() * (1200 - 150 + 1)) + 150; // $150 to $1200

    const newAd = {
      id: "ad-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      business_name,
      industry_type: industry_type || "General",
      product_name,
      target_audience: target_audience || "General Audience",
      campaign_goal: campaign_goal || "Traffic",
      ad_platform: ad_platform || "Facebook",
      ad_tone: ad_tone || "Professional",
      headline,
      body_text,
      cta: cta || "Learn More",
      mock_impressions,
      mock_ctr,
      mock_clicks,
      mock_spend,
      created_at: new Date().toISOString()
    };

    db.unshift(newAd); // Add to the beginning of array
    saveDb(db);

    res.status(201).json(newAd);
  } catch (err) {
    res.status(500).json({ error: "Server failed to save copy: " + err.message });
  }
});

// 3. DELETE /api/history/:id - Delete record by ID
app.delete('/api/history/:id', (req, res) => {
  try {
    const idToDelete = req.params.id;
    let db = getDb();
    const originalLength = db.length;

    db = db.filter(ad => ad.id !== idToDelete);

    if (db.length === originalLength) {
      return res.status(404).json({ error: "Ad element not found." });
    }

    saveDb(db);
    res.json({ success: true, message: "History item deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server failed to delete: " + err.message });
  }
});

// 4. GET /api/campaign-stats - Calculate analytics from history database
app.get('/api/campaign-stats', (req, res) => {
  try {
    const db = getDb();
    
    if (db.length === 0) {
      return res.json({
        totals: {
          ads_count: 0,
          unique_businesses: 0,
          spend: 0,
          impressions: 0,
          ctr: 0.0,
          clicks: 0
        },
        campaigns: []
      });
    }

    let totalSpend = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    const businessSet = new Set();
    const campaignsMap = {};

    db.forEach(ad => {
      totalSpend += ad.mock_spend;
      totalImpressions += ad.mock_impressions;
      totalClicks += ad.mock_clicks;
      
      const bizKey = ad.business_name.trim();
      businessSet.add(bizKey);

      // Aggregate comparative stats by Business Name
      if (!campaignsMap[bizKey]) {
        campaignsMap[bizKey] = {
          name: bizKey,
          industry: ad.industry_type,
          platform: ad.ad_platform,
          goal: ad.campaign_goal,
          ads_count: 0,
          spend: 0,
          impressions: 0,
          clicks: 0
        };
      }

      campaignsMap[bizKey].ads_count += 1;
      campaignsMap[bizKey].spend += ad.mock_spend;
      campaignsMap[bizKey].impressions += ad.mock_impressions;
      campaignsMap[bizKey].clicks += ad.mock_clicks;
    });

    const averageCtr = totalImpressions > 0 
      ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2)) 
      : 0;

    // Convert map to list and calculate individual CTRs
    const campaigns = Object.values(campaignsMap).map(c => {
      c.ctr = c.impressions > 0 ? parseFloat(((c.clicks / c.impressions) * 100).toFixed(2)) : 0;
      return c;
    });

    res.json({
      totals: {
        ads_count: db.length,
        unique_businesses: businessSet.size,
        spend: totalSpend,
        impressions: totalImpressions,
        ctr: averageCtr,
        clicks: totalClicks
      },
      campaigns
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate stats: " + err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`BizLeap AI Ad Copy Server running at http://localhost:${PORT}`);
});
