import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, CheckCircle2, Circle, Rocket, Inbox, Copy, FileText, 
  CheckCircle, Info, AlertTriangle, RefreshCw, Send as LucideSend
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Import components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GeneratorForm from './components/GeneratorForm';
import AdCopyOutputs from './components/AdCopyOutputs';
import ExporterControls from './components/ExporterControls';
import ImageSelector from './components/ImageSelector';
import AdPreviewMockup from './components/AdPreviewMockup';
import PublisherColumns from './components/PublisherColumns';
import HistoryList from './components/HistoryList';
import StatsDashboard from './components/StatsDashboard';
import { DeleteConfirmModal, PublishWizardModal } from './components/Modals';

// Predefined fallbacks & presets
const clientGenericFallback = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
];

const clientCuratedBrands = {
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

const clientCuratedCategories = {
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

const presets = {
  realestate: {
    businessName: 'Apex Heights',
    industry: 'Real Estate',
    productName: 'Premium 2 & 3 BHK Smart Apartments',
    targetAudience: 'Families and investors looking for premium, well-connected homes in Nagpur (Wardha Road / Manish Nagar).',
    campaignGoal: 'Lead Generation',
    cta: 'Book Site Visit',
    platform: 'Facebook',
    tone: 'Luxury'
  },
  cafe: {
    businessName: 'The Orange Bistro',
    industry: 'Food & Beverage',
    productName: "Nagpur's First Orange-Infused Mocha & Continental Brunch Specials",
    targetAudience: 'Youth, college students, and families looking for a cozy, Instagrammable cafe experience in Nagpur.',
    campaignGoal: 'Brand Awareness',
    cta: 'Claim Offer',
    platform: 'Instagram',
    tone: 'Friendly'
  },
  seo: {
    businessName: 'BizLeap SEO Packages',
    industry: 'Digital Marketing / IT',
    productName: 'Local SEO Audit & Rank Booster Program',
    targetAudience: 'Nagpur-based SME owners, doctors, retailers, and builders looking to double online enquiries.',
    campaignGoal: 'Lead Generation',
    cta: 'Get Free Quote',
    platform: 'LinkedIn',
    tone: 'Professional'
  }
};

export default function App() {
  // --- Initialize Environmental Variables & API Base URL ---
  const getApiBaseUrl = () => {
    if (window.PUBLIC_API_URL) return window.PUBLIC_API_URL;
    if (window.VITE_API_URL) return window.VITE_API_URL;
    
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      const port = window.location.port;
      
      if (protocol === 'file:' || ['3000', '5173', '8080', '8081', '8082'].includes(port)) {
        return `${protocol === 'https:' ? 'https:' : 'http:'}//${hostname || 'localhost'}:8000`;
      }
    }
    return '';
  };

  const API_BASE_URL = getApiBaseUrl();

  // --- States ---
  const [currentView, setCurrentView] = useState('btn-nav-generator');
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [dbModeChecked, setDbModeChecked] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Generator State
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    productName: '',
    targetAudience: '',
    campaignGoal: '',
    cta: '',
    platform: 'Facebook',
    tone: 'Professional'
  });
  
  const [results, setResults] = useState({
    headline: '',
    body: '',
    cta: ''
  });
  const [resultsVisible, setResultsVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loaderStep, setLoaderStep] = useState(1);
  const [loaderStatus, setLoaderStatus] = useState('Analyzing parameters...');
  
  // Image Selector State
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [imageOptions, setImageOptions] = useState([]);
  const [imageSource, setImageSource] = useState('No Image Loaded');
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  // Database Data States
  const [historyData, setHistoryData] = useState([]);
  const [statsData, setStatsData] = useState({
    totals: { spend: 0, ctr: 0, impressions: 0, ads_count: 0 },
    campaigns: []
  });
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  
  // Filters States
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [toneFilter, setToneFilter] = useState('');
  
  // Modals States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteAdId, setDeleteAdId] = useState(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishWizardOption, setPublishWizardOption] = useState('now');
  const [scheduleTime, setScheduleTime] = useState('');
  
  // Active publishing simulations progress state: { [id]: progressPercent }
  const [publishingProgress, setPublishingProgress] = useState({});

  // --- Toast helper ---
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exit: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, 3000);
  };

  // --- Database Mode & Sync Handlers ---
  const checkConnectionMode = () => {
    return fetch(`${API_BASE_URL}/api/history`)
      .then(res => {
        setIsBackendConnected(res.ok);
        setDbModeChecked(true);
        return res.ok;
      })
      .catch(() => {
        setIsBackendConnected(false);
        setDbModeChecked(true);
        return false;
      });
  };

  useEffect(() => {
    checkConnectionMode().then((connected) => {
      loadHistoryData(false, connected);
      loadCampaignStats(false, connected);
    });
  }, []);

  // Sync mode badge click
  const handleLocationClick = () => {
    showToast("BizLeap Nagpur HQ - Powered by Gemini AI Agency Tools", "success");
  };

  // --- LocalStorage Fallbacks ---
  const getLocalStorageSeeds = () => {
    const now = new Date();
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
        created_at: oneDayAgo.toISOString(),
        selected_image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80",
        status: "history"
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
        created_at: twoDaysAgo.toISOString(),
        selected_image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
        status: "history"
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
        created_at: threeDaysAgo.toISOString(),
        selected_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        status: "history"
      }
    ];
  };

  const getLocalStorageAds = () => {
    const data = localStorage.getItem('bizleap_ads');
    if (!data) {
      const initialSeeds = getLocalStorageSeeds();
      localStorage.setItem('bizleap_ads', JSON.stringify(initialSeeds));
      return initialSeeds;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      const initialSeeds = getLocalStorageSeeds();
      localStorage.setItem('bizleap_ads', JSON.stringify(initialSeeds));
      return initialSeeds;
    }
  };

  const saveLocalStorageAds = (ads) => {
    localStorage.setItem('bizleap_ads', JSON.stringify(ads));
  };

  const saveLocalStorageAd = (params, results, status = "history", scheduledTime = null) => {
    const mock_impressions = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
    const mock_ctr = parseFloat((Math.random() * (4.2 - 1.5) + 1.5).toFixed(2));
    const mock_clicks = Math.round(mock_impressions * (mock_ctr / 100));
    const mock_spend = Math.floor(Math.random() * (1200 - 150 + 1)) + 150;

    const newAd = {
      id: "ad-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      business_name: params.businessName,
      industry_type: params.industry || "General",
      product_name: params.productName,
      target_audience: params.targetAudience || "General Audience",
      campaign_goal: params.campaignGoal || "Website Traffic",
      ad_platform: params.platform || "Facebook",
      ad_tone: params.tone || "Professional",
      headline: results.headline,
      body_text: results.body,
      cta: results.cta || "Learn More",
      selected_image_url: selectedImageUrl || clientGenericFallback[0],
      status: status,
      scheduled_time: scheduledTime,
      published_time: (status === "published" || status === "publishing") ? new Date().toISOString() : null,
      mock_impressions,
      mock_ctr,
      mock_clicks,
      mock_spend,
      created_at: new Date().toISOString()
    };

    const ads = getLocalStorageAds();
    ads.unshift(newAd);
    saveLocalStorageAds(ads);
    return newAd;
  };

  const deleteLocalStorageAd = (id) => {
    let ads = getLocalStorageAds();
    ads = ads.filter(ad => ad.id !== id);
    saveLocalStorageAds(ads);
  };

  const getLocalStorageCampaignStats = () => {
    const ads = getLocalStorageAds();
    const activeAds = ads.filter(ad => !ad.status || ad.status === 'history' || ad.status === 'published');
    
    if (activeAds.length === 0) {
      return {
        totals: { ads_count: 0, unique_businesses: 0, spend: 0, impressions: 0, ctr: 0, clicks: 0 },
        campaigns: []
      };
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

    const campaigns = Object.values(campaignsMap).map(c => {
      c.ctr = c.impressions > 0 ? parseFloat(((c.clicks / c.impressions) * 100).toFixed(2)) : 0;
      return c;
    });

    return {
      totals: {
        ads_count: activeAds.length,
        unique_businesses: businessSet.size,
        spend: totalSpend,
        impressions: totalImpressions,
        ctr: averageCtr,
        clicks: totalClicks
      },
      campaigns
    };
  };

  // --- Loader/API Trigger Fetch routines ---
  const loadHistoryData = (showLoading = true, forceConnected = null) => {
    const isConnected = forceConnected !== null ? forceConnected : isBackendConnected;
    if (showLoading) setIsHistoryLoading(true);

    if (isConnected) {
      fetch(`${API_BASE_URL}/api/history`)
        .then(response => {
          if (!response.ok) throw new Error("Could not load history.");
          return response.json();
        })
        .then(data => {
          setHistoryData(data);
          setIsHistoryLoading(false);
        })
        .catch(err => {
          console.error("Fetch history failed:", err);
          setIsHistoryLoading(false);
          // Auto fallback to local storage
          const localData = getLocalStorageAds();
          setHistoryData(localData);
          showToast("Failed to fetch campaigns. Loaded offline data.", "error");
        });
    } else {
      const localData = getLocalStorageAds();
      setHistoryData(localData);
      setIsHistoryLoading(false);
    }
  };

  const loadCampaignStats = (showLoading = true, forceConnected = null) => {
    const isConnected = forceConnected !== null ? forceConnected : isBackendConnected;
    if (showLoading) setIsStatsLoading(true);

    if (isConnected) {
      fetch(`${API_BASE_URL}/api/campaign-stats`)
        .then(response => {
          if (!response.ok) throw new Error("Could not load stats.");
          return response.json();
        })
        .then(data => {
          setStatsData(data);
          setIsStatsLoading(false);
        })
        .catch(err => {
          console.error("Load stats failed:", err);
          setIsStatsLoading(false);
          // Auto fallback to local storage
          const localStats = getLocalStorageCampaignStats();
          setStatsData(localStats);
        });
    } else {
      const localStats = getLocalStorageCampaignStats();
      setStatsData(localStats);
      setIsStatsLoading(false);
    }
  };

  // Update status patch API
  const updateCampaignStatus = (id, newStatus, scheduledTime = null) => {
    if (isBackendConnected) {
      return fetch(`${API_BASE_URL}/api/history/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, scheduled_time: scheduledTime })
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update status.");
        return res.json();
      })
      .catch(err => {
        console.error("Patch status failed:", err);
        // Fallback update local storage
        return updateLocalAdStatus(id, newStatus, scheduledTime);
      });
    } else {
      return Promise.resolve(updateLocalAdStatus(id, newStatus, scheduledTime));
    }
  };

  const updateLocalAdStatus = (id, newStatus, scheduledTime) => {
    const ads = getLocalStorageAds();
    const adIdx = ads.findIndex(ad => ad.id === id);
    if (adIdx !== -1) {
      ads[adIdx].status = newStatus;
      ads[adIdx].scheduled_time = scheduledTime;
      if (newStatus === 'published' || newStatus === 'publishing') {
        ads[adIdx].published_time = new Date().toISOString();
      }
      saveLocalStorageAds(ads);
      return ads[adIdx];
    }
    throw new Error("Local ad not found");
  };

  // --- Form Auto-Fill Preset Handler ---
  const handlePreset = (presetKey) => {
    const data = presets[presetKey];
    if (!data) return;

    setFormData({
      businessName: data.businessName,
      industry: data.industry,
      productName: data.productName,
      targetAudience: data.targetAudience,
      campaignGoal: data.campaignGoal,
      cta: data.cta,
      platform: data.platform,
      tone: data.tone
    });

    // If results are open, generate instantly
    if (resultsVisible) {
      const copyResults = generateAdCopyText({ ...data });
      setResults(copyResults);
    }

    showToast(`Preset loaded: ${data.businessName} Campaign!`, 'success');
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => {
      const nextForm = { ...prev, [field]: value };
      
      // If results are visible, regenerate instantly for platform/tone changes (fast generation)
      if (resultsVisible && (field === 'platform' || field === 'tone')) {
        const copyResults = generateAdCopyText(nextForm);
        setResults(copyResults);
      }
      
      return nextForm;
    });
  };

  // --- Copywriting Engine Math ---
  const generateAdCopyText = (params) => {
    const { businessName: bizName, industry, productName: product, targetAudience: audience, campaignGoal: goal, platform, tone, cta } = params;
    
    const toneWords = {
      Professional: {
        hookStart: "Looking to scale?",
        adjective1: "highly-efficient",
        adjective2: "industry-standard",
        trustphrase: "Trusted by leading professionals across Central India",
        outro: "Align your campaign objectives with proven performance."
      },
      Friendly: {
        hookStart: "Hey Nagpur! 👋 Check this out:",
        adjective1: "delightful",
        adjective2: "cozy & friendly",
        trustphrase: "Your new favorite spot in town",
        outro: "Drop by and say hi to the team! 😊"
      },
      Promotional: {
        hookStart: "🚨 LIMITED TIME OFFER! 🚨",
        adjective1: "exclusive",
        adjective2: "unbelievable value",
        trustphrase: "Hurry, slots are filling up fast!",
        outro: "Don't miss out on this deal. Grab it before it's gone!"
      },
      Luxury: {
        hookStart: "Experience the pinnacle of luxury.",
        adjective1: "exquisite",
        adjective2: "unrivalled & premium",
        trustphrase: "Crafted exclusively for those who settle for nothing less than perfection",
        outro: "Schedule your private consultation today."
      }
    }[tone] || {
      hookStart: "Introducing a game-changer:",
      adjective1: "premium",
      adjective2: "innovative",
      trustphrase: "Engineered for excellence",
      outro: "Get started today."
    };

    let headline = "";
    let body = "";
    
    if (platform === 'Facebook') {
      headline = tone === 'Luxury' 
        ? `Elevated Living: ${product} by ${bizName}`
        : `${bizName} | ${product} in Nagpur!`;
      
      body = `${toneWords.hookStart}\n\nIntroducing ${product} – the ${toneWords.adjective1} solution by ${bizName} customized specifically for ${audience}.\n\n✨ Why choose us?\n✔️ Engineered for excellence & reliability\n✔️ Tailored for local Nagpur requirements\n✔️ ${toneWords.trustphrase}\n\nLet us help you achieve your goals.\n\n👉 Click below to ${cta.toLowerCase()}!`;
    } 
    
    else if (platform === 'Instagram') {
      headline = `${bizName} - ${product}`;
      
      body = `${toneWords.hookStart} ${product} is here! ✨\n\n${bizName} brings you the most ${toneWords.adjective2} experience yet. Specially made for ${audience}.\n\n💫 What you get:\n✦ Premium local quality in Nagpur\n✦ Attention to detail\n✦ ${toneWords.trustphrase}\n\n${toneWords.outro}\n\n👉 Click the link in our bio to ${cta.toLowerCase()}! \n\n#${bizName.replace(/\s+/g, '')} #Nagpur #DigitalMarketing #AdCampaigns #${industry.replace(/[^a-zA-Z]/g, '')}`;
    } 
    
    else if (platform === 'Google Ads') {
      const h1 = bizName.substring(0, 30);
      const h2 = product.substring(0, 30);
      const h3 = cta.substring(0, 30);
      headline = `${h1} | ${h2} | ${h3}`;
      
      body = `Looking for ${product}? ${bizName} offers ${toneWords.adjective1} options in Nagpur. Designed for ${audience.substring(0, 50)}. ${toneWords.trustphrase.substring(0, 40)}. Call now!`;
    } 
    
    else if (platform === 'LinkedIn') {
      headline = `${goal === 'Lead Generation' ? 'B2B Growth Solution: ' : ''}${bizName} launches ${product}`;
      
      body = `💡 In today's competitive landscape, ${audience} requires solutions that drive real business impact.\n\n${bizName} is proud to introduce our latest project: ${product}.\n\nWhy leading Nagpur enterprises trust us:\n📈 High ROI & Proven Efficiency - scale operations seamlessly.\n💼 Dedicated Professional Support - tailored for B2B goals.\n⭐ ${toneWords.trustphrase}.\n\nReady to take the next step?\n\n🔗 Click below to ${cta.toLowerCase()} today.`;
    }

    return { headline, body, cta };
  };

  // --- Form Submission / Loading Sequence ---
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setResultsVisible(false);
    setLoaderStep(1);
    setLoaderStatus("Analyzing campaign goal: " + formData.campaignGoal + "...");

    // Stage 1
    setTimeout(() => {
      setLoaderStep(2);
      setLoaderStatus("Tailoring copy to " + formData.tone + " tone...");

      // Stage 2
      setTimeout(() => {
        setLoaderStep(3);
        setLoaderStatus("Structuring for " + formData.platform + "...");

        // Stage 3
        setTimeout(() => {
          setIsGenerating(false);
          const copyResults = generateAdCopyText(formData);
          setResults(copyResults);
          setResultsVisible(true);
          
          // Fetch dynamic brand or category images
          fetchBusinessImages(formData.businessName, formData.industry);
          
          // Save to database
          saveAdToDatabase(formData, copyResults);
          showToast("High-converting copy generated successfully!", "success");
        }, 600);
      }, 600);
    }, 600);
  };

  // --- Image Selector Search Engine ---
  const fetchBusinessImages = (query, industry) => {
    setIsImageLoading(true);
    setImageSource("Searching...");
    
    checkConnectionMode().then(connected => {
      if (connected) {
        return fetch(`${API_BASEUrl()}/api/business-images?query=${encodeURIComponent(query)}&industry=${encodeURIComponent(industry)}`)
          .then(res => {
            if (!res.ok) throw new Error("API failed");
            return res.json();
          });
      } else {
        // Fallback simulation
        return new Promise(resolve => {
          setTimeout(() => {
            const normQuery = query.toLowerCase();
            let brandKey = null;
            if (normQuery.includes('zudio')) brandKey = 'zudio';
            else if (normQuery.includes('lenskart')) brandKey = 'lenskart';
            else if (normQuery.includes('domino')) brandKey = 'dominos';
            else if (normQuery.includes('reliance') && (normQuery.includes('digital') || normQuery.includes('electric') || normQuery.includes('tech'))) brandKey = 'reliance';

            if (brandKey && clientCuratedBrands[brandKey]) {
              resolve({
                images: clientCuratedBrands[brandKey],
                source: "brand_assets",
                status_message: "Real business photos found"
              });
            } else {
              const normInd = industry.toLowerCase();
              let selectedCategoryImages = null;
              for (const key of Object.keys(clientCuratedCategories)) {
                if (normInd.includes(key) || key.includes(normInd)) {
                  selectedCategoryImages = clientCuratedCategories[key];
                  break;
                }
              }
              resolve({
                images: selectedCategoryImages || clientGenericFallback,
                source: "fallback_categories",
                status_message: "Using category-based images"
              });
            }
          }, 400);
        });
      }
    })
    .then(data => {
      setIsImageLoading(false);
      setImageOptions(data.images);
      setSelectedImageUrl(data.images[0]);
      setImageSource(data.status_message);
    })
    .catch(() => {
      setIsImageLoading(false);
      setImageOptions(clientGenericFallback);
      setSelectedImageUrl(clientGenericFallback[0]);
      setImageSource("Using category-based images");
    });
  };

  const API_BASEUrl = () => API_BASE_URL;

  const handleSelectImage = (url, index) => {
    setSelectedImageUrl(url);
    showToast(`Selected Image Option ${index + 1}`, 'info');
  };

  const saveAdToDatabase = (params, copyResults, status = "history", scheduledTime = null) => {
    checkConnectionMode().then(connected => {
      if (connected) {
        const dataToPost = {
          business_name: params.businessName,
          industry_type: params.industry,
          product_name: params.productName,
          target_audience: params.targetAudience,
          campaign_goal: params.campaignGoal,
          ad_platform: params.platform,
          ad_tone: params.tone,
          headline: copyResults.headline,
          body_text: copyResults.body,
          cta: copyResults.cta,
          selected_image_url: selectedImageUrl || clientGenericFallback[0],
          status: status,
          scheduled_time: scheduledTime
        };

        fetch(`${API_BASE_URL}/api/history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToPost)
        })
        .then(res => {
          if (!res.ok) throw new Error("API post failed");
          return res.json();
        })
        .then(() => {
          loadHistoryData(false, true);
          loadCampaignStats(false, true);
        })
        .catch(() => {
          showToast("Generated successfully but failed to sync with server.", "error");
        });
      } else {
        saveLocalStorageAd(params, copyResults, status, scheduledTime);
        loadHistoryData(false, false);
        loadCampaignStats(false, false);
      }
    });
  };

  // --- Copy Clipboard handlers ---
  const handleCopyText = (text, name = 'Text') => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => showToast(`${name} copied to clipboard!`, 'success'))
        .catch(() => showToast('Failed to copy', 'error'));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showToast(`${name} copied to clipboard!`, 'success');
      } catch (err) {
        showToast('Failed to copy', 'error');
      }
      textArea.remove();
    }
  };

  const handleCopyAll = () => {
    const fullText = `--- GENERATED AD COPY ---\nHeadline: ${results.headline}\n\nAd Text:\n${results.body}\n\nCall-To-Action: ${results.cta}\n--------------------------`;
    handleCopyText(fullText, 'All fields');
  };

  // --- Exporters ---
  const handleExportJson = () => {
    const data = {
      business_name: formData.businessName || "Apex Heights",
      industry_type: formData.industry || "Real Estate",
      product_name: formData.productName || "Premium Apartments",
      target_audience: formData.targetAudience || "General Audience",
      campaign_goal: formData.campaignGoal || "Lead Generation",
      ad_platform: formData.platform,
      ad_tone: formData.tone,
      headline: results.headline,
      body_text: results.body,
      cta: results.cta,
      selected_image_url: selectedImageUrl || clientGenericFallback[0]
    };
    const filename = `${data.business_name.toLowerCase().replace(/\s+/g, '_')}_campaign.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Campaign exported as JSON successfully!", "success");
  };

  const handleDownloadImage = () => {
    const plat = formData.platform;
    let targetId = '';
    if (plat === 'Facebook') targetId = 'mockup-facebook';
    else if (plat === 'Instagram') targetId = 'mockup-instagram';
    else if (plat === 'Google Ads') targetId = 'mockup-google';
    else if (plat === 'LinkedIn') targetId = 'mockup-linkedin';

    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      showToast("Mockup element not found.", "error");
      return;
    }

    showToast("Generating image asset...", "info");

    html2canvas(targetElement, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scale: 2
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const filename = `${plat.toLowerCase().replace(/\s+/g, '_')}_mockup_${Date.now()}.png`;
      const a = document.createElement('a');
      a.href = imgData;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("Ad Mockup image downloaded!", "success");
    }).catch(() => {
      showToast("Failed to render mockup image.", "error");
    });
  };

  const handleDownloadPdf = () => {
    const plat = formData.platform;
    let targetId = '';
    if (plat === 'Facebook') targetId = 'mockup-facebook';
    else if (plat === 'Instagram') targetId = 'mockup-instagram';
    else if (plat === 'Google Ads') targetId = 'mockup-google';
    else if (plat === 'LinkedIn') targetId = 'mockup-linkedin';

    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      showToast("Mockup element not found.", "error");
      return;
    }

    showToast("Compiling PDF Campaign Report...", "info");

    html2canvas(targetElement, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scale: 2
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Page 1: Header & Metadata
      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, 0, 210, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.text("BIZLEAP TECHNOLOGIES", 15, 20);
      pdf.setFontSize(12);
      pdf.text("Campaign Copywriting & Visual Proposal Report", 15, 28);
      
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(18);
      pdf.text(`Campaign: ${formData.businessName || 'BizLeap Client'}`, 15, 55);
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("CAMPAIGN METADATA", 15, 68);
      pdf.line(15, 70, 195, 70);
      
      const metadataRows = [
        ["Business Name", formData.businessName || "Apex Heights"],
        ["Industry / Sector", formData.industry || "Real Estate"],
        ["Target Product/Service", formData.productName || "Premium Apartments"],
        ["Campaign Objective", formData.campaignGoal || "Lead Generation"],
        ["Ad Platform", formData.platform],
        ["Creative Tone", formData.tone],
        ["Call To Action", results.cta]
      ];
      
      pdf.setFont("helvetica", "normal");
      let startY = 78;
      metadataRows.forEach(row => {
        pdf.setFont("helvetica", "bold");
        pdf.text(row[0] + ":", 17, startY);
        pdf.setFont("helvetica", "normal");
        pdf.text(row[1], 60, startY);
        startY += 8;
      });

      startY += 6;
      pdf.setFont("helvetica", "bold");
      pdf.text("GENERATED COPYPACK", 15, startY);
      pdf.line(15, startY + 2, 195, startY + 2);
      startY += 10;

      pdf.setFont("helvetica", "bold");
      pdf.text("Headline / Hook:", 17, startY);
      pdf.setFont("helvetica", "normal");
      pdf.text(results.headline, 17, startY + 6, { maxWidth: 175 });
      startY += 18;

      pdf.setFont("helvetica", "bold");
      pdf.text("Primary Body Text:", 17, startY);
      pdf.setFont("helvetica", "normal");
      const bodyLines = pdf.splitTextToSize(results.body, 175);
      pdf.text(bodyLines, 17, startY + 6);
      
      // Page 2
      pdf.addPage();
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(`Live Mockup Ad Creative - ${formData.platform}`, 15, 13);

      const imgWidth = 140; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 15, 30, imgWidth, Math.min(imgHeight, 140));

      const projY = 30 + Math.min(imgHeight, 140) + 15;
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Projected Campaign Performance (Simulation)", 15, projY);
      pdf.line(15, projY + 2, 195, projY + 2);
      
      const metricX = 15;
      const metricY = projY + 8;
      pdf.setFillColor(248, 250, 252);
      pdf.rect(metricX, metricY, 180, 28, 'F');
      pdf.rect(metricX, metricY, 180, 28, 'D');

      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.setFont("helvetica", "normal");
      pdf.text("Est. Impressions", metricX + 10, metricY + 10);
      pdf.text("Est. Clicks", metricX + 60, metricY + 10);
      pdf.text("Target CTR", metricX + 110, metricY + 10);
      pdf.text("Est. Budget Spend", metricX + 145, metricY + 10);

      pdf.setFontSize(12);
      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.text("3,500 - 5,000", metricX + 10, metricY + 20);
      pdf.text("120 - 180", metricX + 60, metricY + 20);
      pdf.text("3.42%", metricX + 110, metricY + 20);
      pdf.text("$350.00", metricX + 145, metricY + 20);

      pdf.setFontSize(9);
      pdf.setTextColor(148, 163, 184);
      pdf.setFont("helvetica", "italic");
      pdf.text("This is an AI-generated marketing proposal compiled by BizLeap Technologies.", 15, 285);
      
      pdf.save(`${(formData.businessName || "bizleap").toLowerCase().replace(/\s+/g, '_')}_campaign_report.pdf`);
      showToast("PDF Campaign Report downloaded!", "success");
    }).catch(err => {
      console.error(err);
      showToast("Failed to compile PDF Report.", "error");
    });
  };

  // --- Confirm delete triggers ---
  const handleOpenDeleteConfirm = (id) => {
    setDeleteAdId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteAdId) return;

    checkConnectionMode().then(connected => {
      if (connected) {
        fetch(`${API_BASE_URL}/api/history/${deleteAdId}`, { method: 'DELETE' })
          .then(res => {
            if (!res.ok) throw new Error("Delete failed");
            showToast("Campaign ad copy deleted successfully.", "success");
            setDeleteModalOpen(false);
            setDeleteAdId(null);
            loadHistoryData(false, true);
            loadCampaignStats(false, true);
          })
          .catch(() => {
            showToast("Failed to delete history item.", "error");
            setDeleteModalOpen(false);
            setDeleteAdId(null);
          });
      } else {
        deleteLocalStorageAd(deleteAdId);
        showToast("Campaign ad copy deleted successfully.", "success");
        setDeleteModalOpen(false);
        setDeleteAdId(null);
        loadHistoryData(false, false);
        loadCampaignStats(false, false);
      }
    });
  };

  // --- Confirm Publish Wizard triggers ---
  const handleConfirmPublishWizard = () => {
    setPublishModalOpen(false);

    const params = {
      businessName: formData.businessName || "Apex Heights",
      industry: formData.industry || "Real Estate",
      productName: formData.productName || "Premium Apartments",
      targetAudience: formData.targetAudience || "General Audience",
      campaignGoal: formData.campaignGoal || "Lead Generation",
      platform: formData.platform,
      tone: formData.tone,
      cta: formData.cta || "Learn More"
    };

    const copyResults = {
      headline: results.headline || "",
      body: results.body || "",
      cta: results.cta || "Learn More"
    };

    if (publishWizardOption === 'now') {
      showToast("Initializing simulated publishing pipeline...", "info");
      
      checkConnectionMode().then(connected => {
        if (connected) {
          const dataToPost = {
            business_name: params.businessName,
            industry_type: params.industry,
            product_name: params.productName,
            target_audience: params.targetAudience,
            campaign_goal: params.campaignGoal,
            ad_platform: params.platform,
            ad_tone: params.tone,
            headline: copyResults.headline,
            body_text: copyResults.body,
            cta: copyResults.cta,
            selected_image_url: selectedImageUrl || clientGenericFallback[0],
            status: 'publishing',
            scheduled_time: null
          };
          fetch(`${API_BASE_URL}/api/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToPost)
          })
          .then(res => res.json())
          .then(savedAd => {
            setCurrentView('btn-nav-publisher');
            startQueueSimulation(savedAd);
          });
        } else {
          const savedAd = saveLocalStorageAd(params, copyResults, 'publishing', null);
          setCurrentView('btn-nav-publisher');
          startQueueSimulation(savedAd);
        }
      });
    } 
    
    else if (publishWizardOption === 'schedule') {
      if (!scheduleTime) {
        showToast("Please choose a schedule date & time.", "error");
        setPublishModalOpen(true);
        return;
      }
      showToast("Campaign scheduled successfully!", "success");

      checkConnectionMode().then(connected => {
        if (connected) {
          const dataToPost = {
            business_name: params.businessName,
            industry_type: params.industry,
            product_name: params.productName,
            target_audience: params.targetAudience,
            campaign_goal: params.campaignGoal,
            ad_platform: params.platform,
            ad_tone: params.tone,
            headline: copyResults.headline,
            body_text: copyResults.body,
            cta: copyResults.cta,
            selected_image_url: selectedImageUrl || clientGenericFallback[0],
            status: 'scheduled',
            scheduled_time: new Date(scheduleTime).toISOString()
          };
          fetch(`${API_BASE_URL}/api/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToPost)
          })
          .then(res => res.json())
          .then(() => {
            setCurrentView('btn-nav-publisher');
            loadHistoryData(false, true);
          });
        } else {
          saveLocalStorageAd(params, copyResults, 'scheduled', new Date(scheduleTime).toISOString());
          setCurrentView('btn-nav-publisher');
          loadHistoryData(false, false);
        }
      });
    } 
    
    else if (publishWizardOption === 'draft') {
      showToast("Campaign saved to drafts.", "success");

      checkConnectionMode().then(connected => {
        if (connected) {
          const dataToPost = {
            business_name: params.businessName,
            industry_type: params.industry,
            product_name: params.productName,
            target_audience: params.targetAudience,
            campaign_goal: params.campaignGoal,
            ad_platform: params.platform,
            ad_tone: params.tone,
            headline: copyResults.headline,
            body_text: copyResults.body,
            cta: copyResults.cta,
            selected_image_url: selectedImageUrl || clientGenericFallback[0],
            status: 'draft',
            scheduled_time: null
          };
          fetch(`${API_BASE_URL}/api/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToPost)
          })
          .then(res => res.json())
          .then(() => {
            setCurrentView('btn-nav-publisher');
            loadHistoryData(false, true);
          });
        } else {
          saveLocalStorageAd(params, copyResults, 'draft', null);
          setCurrentView('btn-nav-publisher');
          loadHistoryData(false, false);
        }
      });
    }
  };

  // --- Simulated publisher ticks ---
  const startQueueSimulation = (ad, startPct = 0) => {
    setPublishingProgress(prev => ({ ...prev, [ad.id]: startPct }));
  };

  // Trigger publishing loops on load and state changes
  useEffect(() => {
    const publishingAds = historyData.filter(ad => ad.status === 'publishing');
    let progressUpdated = false;
    const nextProgress = { ...publishingProgress };

    publishingAds.forEach(ad => {
      if (nextProgress[ad.id] === undefined) {
        nextProgress[ad.id] = Math.floor(Math.random() * 40) + 10; // start percent
        progressUpdated = true;
      }
    });

    if (progressUpdated) {
      setPublishingProgress(nextProgress);
    }
  }, [historyData]);

  useEffect(() => {
    const activeIds = Object.keys(publishingProgress);
    if (activeIds.length === 0) return;

    const timer = setInterval(() => {
      setPublishingProgress(prev => {
        const updated = { ...prev };
        let finishedId = null;

        for (let id of Object.keys(updated)) {
          const current = updated[id];
          if (current >= 100) continue;
          
          const next = current + Math.floor(Math.random() * 10) + 5;
          if (next >= 100) {
            updated[id] = 100;
            finishedId = id;
          } else {
            updated[id] = next;
          }
        }

        if (finishedId) {
          const ad = historyData.find(a => a.id === finishedId);
          updateCampaignStatus(finishedId, 'published').then(() => {
            if (ad) {
              showToast(`Campaign published live to ${ad.ad_platform}!`, "success");
            } else {
              showToast(`Campaign published live!`, "success");
            }
            loadHistoryData(false);
            loadCampaignStats(false);
          });
          delete updated[finishedId];
        }

        return updated;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [publishingProgress, historyData]);

  // Sidebar hooks for view routing
  useEffect(() => {
    if (currentView === 'btn-nav-history') {
      loadHistoryData(true);
    } else if (currentView === 'btn-nav-analytics') {
      loadCampaignStats(true);
    } else if (currentView === 'btn-nav-publisher') {
      loadHistoryData(false);
    }
  }, [currentView]);

  // --- Sub-components interactions handlers ---
  const handleResumeDraft = (ad) => {
    setFormData({
      businessName: ad.business_name,
      industry: ad.industry_type,
      productName: ad.product_name,
      targetAudience: ad.target_audience,
      campaignGoal: ad.campaign_goal,
      cta: ad.cta,
      platform: ad.ad_platform,
      tone: ad.ad_tone
    });
    setSelectedImageUrl(ad.selected_image_url);
    setResults({
      headline: ad.headline,
      body: ad.body_text,
      cta: ad.cta
    });
    setResultsVisible(true);
    setCurrentView('btn-nav-generator');
    showToast("Resumed draft campaign!", "success");
  };

  const handleCancelSchedule = (id) => {
    updateCampaignStatus(id, 'draft', null).then(() => {
      showToast("Schedule cancelled. Campaign reverted to drafts.", "info");
      loadHistoryData(false);
    });
  };

  const handleLaunchNow = (id) => {
    updateCampaignStatus(id, 'publishing', null).then(updatedAd => {
      showToast("Initializing publishing sequence...", "info");
      loadHistoryData(false);
      startQueueSimulation(updatedAd);
    });
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        onLocationClick={handleLocationClick} 
      />

      <main className="main-content">
        <Header 
          isBackendConnected={isBackendConnected} 
          dbModeChecked={dbModeChecked} 
        />

        {/* 1. Generator View Panel */}
        {currentView === 'btn-nav-generator' && (
          <div id="generator-view" className="view-panel">
            <div className="dashboard-grid">
              
              {/* Form Input Parameters */}
              <GeneratorForm 
                formData={formData}
                onChange={handleFormChange}
                onPreset={handlePreset}
                onSubmit={handleFormSubmit}
              />

              {/* Outputs and Previews Column */}
              <section className="right-panel">
                
                {/* Loader Spinner Overlay */}
                {isGenerating && (
                  <div className="loading-state card" id="loading-spinner">
                    <div className="loader-content">
                      <div className="quantum-spinner"></div>
                      <h3 id="loader-status">{loaderStatus}</h3>
                      <p className="loader-sub">BizLeap AI Copywriter is crafting compelling copy...</p>
                      <div className="loader-steps">
                        <div className={`step-item ${loaderStep >= 1 ? (loaderStep > 1 ? 'done' : 'active') : ''}`} id="step-1">
                          {loaderStep > 1 ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          <span>Analyzing Goal</span>
                        </div>
                        <div className={`step-item ${loaderStep >= 2 ? (loaderStep > 2 ? 'done' : 'active') : ''}`} id="step-2">
                          {loaderStep > 2 ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          <span>Targeting Audience</span>
                        </div>
                        <div className={`step-item ${loaderStep >= 3 ? (loaderStep > 3 ? 'done' : 'active') : ''}`} id="step-3">
                          {loaderStep > 3 ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          <span>Structuring Layout</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty Initial Screen State */}
                {!isGenerating && !resultsVisible && (
                  <div className="empty-state card" id="empty-state-card">
                    <div className="empty-content">
                      <div className="icon-glow">
                        <Sparkles size={32} />
                      </div>
                      <h3>Ready to Generate Copy</h3>
                      <p>Fill out the campaign form details on the left or load one of our optimized Nagpur preset templates to witness high-converting copies instant generation.</p>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => handlePreset('realestate')}
                      >
                        <Rocket size={14} style={{ marginRight: '6px' }} /> Load Fast Example
                      </button>
                    </div>
                  </div>
                )}

                {/* Active Results Display Card */}
                {!isGenerating && resultsVisible && (
                  <div className="results-container" id="results-card">
                    {/* Copy Text Outputs */}
                    <AdCopyOutputs 
                      headline={results.headline}
                      body={results.body}
                      cta={results.cta}
                      onCopyField={(txt, name) => handleCopyText(txt, name)}
                      onCopyAll={handleCopyAll}
                    />

                    {/* Exporters and Publish Launcher controls */}
                    <ExporterControls 
                      onExportJson={handleExportJson}
                      onDownloadImage={handleDownloadImage}
                      onDownloadPdf={handleDownloadPdf}
                      onOpenPublishWizard={() => setPublishModalOpen(true)}
                    />

                    {/* Photo Selector */}
                    <ImageSelector 
                      imageOptions={imageOptions}
                      selectedImageUrl={selectedImageUrl}
                      onSelectImage={handleSelectImage}
                      imageSource={imageSource}
                      isImageLoading={isImageLoading}
                    />

                    {/* Previews Mockups frames */}
                    <AdPreviewMockup 
                      formData={formData}
                      results={results}
                      selectedImageUrl={selectedImageUrl}
                    />
                  </div>
                )}

              </section>

            </div>
          </div>
        )}

        {/* 2. Publishing Hub Panel */}
        {currentView === 'btn-nav-publisher' && (
          <div id="publisher-view" className="view-panel">
            <div className="view-header" style={{ marginBottom: '20px' }}>
              <div className="card-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LucideSend className="header-icon" style={{ color: 'var(--accent-color)' }} />
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  Campaign Publishing Hub
                </h2>
              </div>
              <p className="subtitle" style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>
                Monitor active publish simulations, scheduled calendar posts, and campaign drafts.
              </p>
            </div>

            <PublisherColumns 
              campaigns={historyData}
              publishingProgress={publishingProgress}
              onResumeDraft={handleResumeDraft}
              onDeleteCampaign={handleOpenDeleteConfirm}
              onCancelSchedule={handleCancelSchedule}
              onLaunchNow={handleLaunchNow}
            />
          </div>
        )}

        {/* 3. History Feed View Panel */}
        {currentView === 'btn-nav-history' && (
          <HistoryList 
            campaigns={historyData}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            platformFilter={platformFilter}
            setPlatformFilter={setPlatformFilter}
            toneFilter={toneFilter}
            setToneFilter={setToneFilter}
            onDeleteHistoryAd={handleOpenDeleteConfirm}
            onCopyText={(txt) => handleCopyText(txt, 'Campaign copy')}
            isBackendConnected={isBackendConnected}
            onRetryConnection={() => loadHistoryData(true)}
            isLoading={isHistoryLoading}
          />
        )}

        {/* 4. Analytics Stats view Panel */}
        {currentView === 'btn-nav-analytics' && (
          <StatsDashboard 
            statsData={statsData}
            isLoading={isStatsLoading}
          />
        )}

      </main>

      {/* --- Dialog Modals --- */}
      <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setDeleteAdId(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <PublishWizardModal 
        isOpen={publishModalOpen}
        onCancel={() => setPublishModalOpen(false)}
        onConfirm={handleConfirmPublishWizard}
        selectedOption={publishWizardOption}
        setSelectedOption={setPublishWizardOption}
        scheduleTime={scheduleTime}
        setScheduleTime={setScheduleTime}
      />

      {/* --- Toast System Alerts --- */}
      <div className="toast-container">
        {toasts.map(toast => {
          let Icon = CheckCircle;
          if (toast.type === 'info') Icon = Info;
          if (toast.type === 'error') Icon = AlertTriangle;
          
          return (
            <div 
              key={toast.id} 
              className={`toast ${toast.type === 'success' ? 'toast-success' : ''} ${toast.exit ? 'toast-exit' : ''}`}
            >
              <Icon size={16} />
              <span>{toast.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
