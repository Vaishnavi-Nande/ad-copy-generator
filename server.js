const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const PORT = 8000;
const DB_FILE = path.join(__dirname, 'db.json');
const CACHE_FILE = path.join(__dirname, 'business_image_cache.json');

// --- Image Cache Setup ---
let imageCache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    imageCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (err) {
    console.error("Cache load error:", err);
  }
}

function saveCache() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(imageCache, null, 2));
  } catch (err) {
    console.error("Cache save error:", err);
  }
}

// Built-in HTTPS Fetch Helper
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => reject(err));
  });
}

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
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialSeeds, null, 2));
      } catch (writeErr) {
        console.error("Database seeding write error (expected on serverless):", writeErr);
      }
      return initialSeeds;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(data || '[]');
    if (parsed.length === 0) {
      const initialSeeds = generateSeeds();
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialSeeds, null, 2));
      } catch (writeErr) {
        console.error("Database seeding write error (expected on serverless):", writeErr);
      }
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
    console.error("Database write error (expected on serverless):", err);
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
      selected_image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80",
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
      selected_image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
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
      selected_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
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
      cta,
      selected_image_url,
      status,
      scheduled_time
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
      selected_image_url: selected_image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      status: status || "history",
      scheduled_time: scheduled_time || null,
      published_time: (status === "published" || status === "publishing") ? new Date().toISOString() : null,
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

// 3. PATCH /api/history/:id - Update campaign status, timing, or performance metrics
app.patch('/api/history/:id', (req, res) => {
  try {
    const idToUpdate = req.params.id;
    const db = getDb();
    const adIndex = db.findIndex(ad => ad.id === idToUpdate);

    if (adIndex === -1) {
      return res.status(404).json({ error: "Campaign copy not found." });
    }

    const ad = db[adIndex];
    const updates = req.body;

    // Allowed fields to update
    const allowedUpdates = ['status', 'scheduled_time', 'published_time', 'mock_impressions', 'mock_ctr', 'mock_clicks', 'mock_spend'];
    
    allowedUpdates.forEach(key => {
      if (updates[key] !== undefined) {
        ad[key] = updates[key];
      }
    });

    db[adIndex] = ad;
    saveDb(db);

    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: "Server failed to update campaign: " + err.message });
  }
});

// 4. DELETE /api/history/:id - Delete record by ID
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

// 5. GET /api/campaign-stats - Calculate analytics from history database
app.get('/api/campaign-stats', (req, res) => {
  try {
    const db = getDb();
    
    // Only include published campaigns or history seeds in active campaign stats
    const activeAds = db.filter(ad => !ad.status || ad.status === 'history' || ad.status === 'published');
    
    if (activeAds.length === 0) {
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

    activeAds.forEach(ad => {
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
        ads_count: activeAds.length,
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

// Curated Brands Database for offline simulator
const curatedBrands = {
  zudio: [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80"
  ],
  lenskart: [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80"
  ],
  dominos: [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=600&q=80"
  ],
  reliance: [
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  ]
};

// Curated Categories Database
const curatedCategories = {
  "real estate": [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
  ],
  "food & beverage": [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
  ],
  "digital marketing / it": [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80"
  ],
  "education & coaching": [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80"
  ],
  "healthcare & wellness": [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80"
  ],
  "retail & e-commerce": [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80"
  ]
};

const genericFallback = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
];

// 5. GET /api/business-images - Retrieve business location/brand photos
app.get('/api/business-images', async (req, res) => {
  try {
    const query = req.query.query ? req.query.query.trim() : '';
    const industry = req.query.industry ? req.query.industry.trim() : '';

    if (!query) {
      return res.status(400).json({ error: "Missing query business name parameter." });
    }

    const normQuery = query.toLowerCase();

    // Check Cache First
    if (imageCache[normQuery]) {
      console.log(`[Cache Hit] Serving business images for: "${query}"`);
      return res.json(imageCache[normQuery]);
    }

    // Google Places API lookup
    const placesKey = process.env.GOOGLE_PLACES_API_KEY;
    if (placesKey) {
      try {
        console.log(`[Google Places] Searching for: "${query}"`);
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${placesKey}`;
        const searchResult = await fetchJson(searchUrl);

        if (searchResult.results && searchResult.results.length > 0) {
          const place = searchResult.results[0];
          if (place.photos && place.photos.length > 0) {
            const photos = place.photos.slice(0, 5).map(photo => {
              return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${placesKey}`;
            });

            const responsePayload = {
              images: photos,
              source: "google_places",
              status_message: "Real business photos found"
            };

            imageCache[normQuery] = responsePayload;
            saveCache();
            return res.json(responsePayload);
          }
        }
      } catch (err) {
        console.error("Google Places API failure, falling back:", err);
      }
    }

    // Fallback 1: Local curated brand stores
    let brandKey = null;
    if (normQuery.includes('zudio')) brandKey = 'zudio';
    else if (normQuery.includes('lenskart')) brandKey = 'lenskart';
    else if (normQuery.includes('domino')) brandKey = 'dominos';
    else if (normQuery.includes('reliance') && (normQuery.includes('digital') || normQuery.includes('electric') || normQuery.includes('tech'))) brandKey = 'reliance';

    if (brandKey && curatedBrands[brandKey]) {
      const responsePayload = {
        images: curatedBrands[brandKey],
        source: "brand_assets",
        status_message: "Real business photos found"
      };
      imageCache[normQuery] = responsePayload;
      saveCache();
      return res.json(responsePayload);
    }

    // Fallback 2: Category-based curated images
    const normInd = industry.toLowerCase();
    let selectedCategoryImages = null;

    for (const key of Object.keys(curatedCategories)) {
      if (normInd.includes(key) || key.includes(normInd)) {
        selectedCategoryImages = curatedCategories[key];
        break;
      }
    }

    const responsePayload = {
      images: selectedCategoryImages || genericFallback,
      source: "fallback_categories",
      status_message: "Using category-based images"
    };

    imageCache[normQuery] = responsePayload;
    saveCache();
    return res.json(responsePayload);

  } catch (err) {
    res.status(500).json({ error: "Failed to resolve business images: " + err.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`BizLeap AI Ad Copy Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
