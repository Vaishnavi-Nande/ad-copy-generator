/**
 * BizLeap Technologies - AI Ad Copy Generator
 * Application Logic & Presets Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Environmental Variables & API Base URL ---
  window.PUBLIC_API_URL = window.PUBLIC_API_URL || "";
  window.VITE_API_URL = window.VITE_API_URL || "";

  function getApiBaseUrl() {
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
  }

  const API_BASE_URL = getApiBaseUrl();

  // --- Safe Lucide Icons Wrapper ---
  function safeCreateIcons() {
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      try {
        lucide.createIcons();
      } catch (err) {
        console.error("Lucide icon creation failed:", err);
      }
    } else {
      console.warn("Lucide library is not available.");
    }
  }

  // --- Initialize Lucide Icons ---
  safeCreateIcons();

  // --- DOM Elements ---
  const form = document.getElementById('ad-copy-form');
  const btnGenerate = document.getElementById('btn-generate');
  const loadingSpinner = document.getElementById('loading-spinner');
  const emptyStateCard = document.getElementById('empty-state-card');
  const resultsCard = document.getElementById('results-card');
  const loaderStatus = document.getElementById('loader-status');
  
  // Form Inputs
  const businessNameInput = document.getElementById('business-name');
  const industryTypeInput = document.getElementById('industry-type');
  const productNameInput = document.getElementById('product-name');
  const targetAudienceInput = document.getElementById('target-audience');
  const campaignGoalInput = document.getElementById('campaign-goal');
  const ctaPreferenceInput = document.getElementById('cta-preference');
  
  // Output Textareas
  const headlineTextarea = document.getElementById('headline-text');
  const bodyTextarea = document.getElementById('body-text');
  const ctaTextarea = document.getElementById('cta-text');
  
  // Character Counts
  const headlineCount = document.getElementById('headline-count');
  const bodyCount = document.getElementById('body-count');
  const ctaCount = document.getElementById('cta-count');
  
  // Copy Buttons
  const btnCopyAll = document.getElementById('btn-copy-all');
  const copyFieldBtns = document.querySelectorAll('.copy-field-btn');
  const toastContainer = document.getElementById('toast-container');
  
  // Presets
  const btnPresetRealestate = document.getElementById('preset-realestate');
  const btnPresetCafe = document.getElementById('preset-cafe');
  const btnPresetSeo = document.getElementById('preset-seo');
  const btnLoadSampleEmpty = document.getElementById('btn-load-sample-empty');
  
  // Sidebar navigation & alerts (for aesthetics)
  const navItems = document.querySelectorAll('.nav-item');
  const locationBadge = document.querySelector('.location-badge');

  // Preview elements
  const previewPlatformBadge = document.getElementById('preview-platform-badge');
  const mockups = {
    Facebook: document.getElementById('mockup-facebook'),
    Instagram: document.getElementById('mockup-instagram'),
    'Google Ads': document.getElementById('mockup-google'),
    LinkedIn: document.getElementById('mockup-linkedin')
  };

  // --- Campaign Presets ---
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
      productName: 'Nagpur\'s First Orange-Infused Mocha & Continental Brunch Specials',
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

  // --- Form Auto-Fill Preset Handler ---
  function applyPreset(presetKey) {
    const data = presets[presetKey];
    if (!data) return;

    businessNameInput.value = data.businessName;
    industryTypeInput.value = data.industry;
    productNameInput.value = data.productName;
    targetAudienceInput.value = data.targetAudience;
    campaignGoalInput.value = data.campaignGoal;
    ctaPreferenceInput.value = data.cta;

    // Check Platform radio
    const platformRadio = document.querySelector(`input[name="ad-platform"][value="${data.platform}"]`);
    if (platformRadio) platformRadio.checked = true;

    // Check Tone radio
    const toneRadio = document.querySelector(`input[name="ad-tone"][value="${data.tone}"]`);
    if (toneRadio) toneRadio.checked = true;

    showToast(`Preset loaded: ${data.businessName} Campaign!`, 'success');
  }

  btnPresetRealestate.addEventListener('click', () => applyPreset('realestate'));
  btnPresetCafe.addEventListener('click', () => applyPreset('cafe'));
  btnPresetSeo.addEventListener('click', () => applyPreset('seo'));
  btnLoadSampleEmpty.addEventListener('click', () => applyPreset('realestate'));

  // --- Navigation Routing Logic ---
  const views = {
    'btn-nav-generator': document.getElementById('generator-view'),
    'btn-nav-publisher': document.getElementById('publisher-view'),
    'btn-nav-history': document.getElementById('history-view'),
    'btn-nav-analytics': document.getElementById('stats-view')
  };

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update nav active state
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Toggle views
      Object.keys(views).forEach(navId => {
        const view = views[navId];
        if (view) {
          if (item.id === navId) {
            view.classList.remove('hidden');
          } else {
            view.classList.add('hidden');
          }
        }
      });

      // Load data based on view selection
      if (item.id === 'btn-nav-history') {
        loadHistoryData(true);
      } else if (item.id === 'btn-nav-analytics') {
        loadCampaignStats(true);
      } else if (item.id === 'btn-nav-publisher') {
        loadPublisherHubData();
      }
    });
  });

  // Bind History Filters
  const historySearch = document.getElementById('history-search');
  const filterPlatform = document.getElementById('filter-platform');
  const filterTone = document.getElementById('filter-tone');

  if (historySearch) historySearch.addEventListener('input', () => renderHistoryList(historyData));
  if (filterPlatform) filterPlatform.addEventListener('change', () => renderHistoryList(historyData));
  if (filterTone) filterTone.addEventListener('change', () => renderHistoryList(historyData));

  locationBadge.addEventListener('click', () => {
    showToast("BizLeap Nagpur HQ - Powered by Gemini AI Agency Tools", "success");
  });

  // --- Platform Selector Realtime Preview Switch ---
  document.querySelectorAll('input[name="ad-platform"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const selectedPlatform = e.target.value;
      updatePreviewPlatformVisibility(selectedPlatform);
      
      // If we already have generated results, regenerate instantly
      if (!resultsCard.classList.contains('hidden')) {
        simulateAIGeneration(false); // fast generation without heavy loader
      }
    });
  });

  function updatePreviewPlatformVisibility(platform) {
    previewPlatformBadge.textContent = platform;
    
    // Hide all mockups
    Object.keys(mockups).forEach(key => {
      mockups[key].classList.add('hidden');
    });
    
    // Show selected mockup
    if (mockups[platform]) {
      mockups[platform].classList.remove('hidden');
    }
  }

  // --- Ad Copy Copywriter Engine Matrix ---
  function generateAdCopyText(params) {
    const { bizName, industry, product, audience, goal, platform, tone, cta } = params;
    
    // Core tone phrases/adjectives
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
      // Google Ads formats: Headline 1 | Headline 2 | Headline 3
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

    return {
      headline: headline,
      body: body,
      cta: cta
    };
  }

  // --- Form Submission Handler ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    simulateAIGeneration(true); // Full generation with heavy loading screens
  });

  // --- Error Handling and State Restoration ---
  function handleGenerationError(error) {
    console.error("Ad copy generation error:", error);
    
    // Restore UI state
    if (loadingSpinner) loadingSpinner.classList.add('hidden');
    if (emptyStateCard) emptyStateCard.classList.remove('hidden');
    if (resultsCard) resultsCard.classList.add('hidden');
    
    // Display error message
    showToast(error.message || "Failed to generate ad copy. Please try again.", "error");
  }

  // --- Simulate AI Copywriting Process ---
  function simulateAIGeneration(withLoader) {
    try {
      const bizName = businessNameInput.value;
      const industry = industryTypeInput.value;
      const product = productNameInput.value;
      const audience = targetAudienceInput.value;
      const goal = campaignGoalInput.value;
      
      const platformRadio = document.querySelector('input[name="ad-platform"]:checked');
      const toneRadio = document.querySelector('input[name="ad-tone"]:checked');
      
      if (!platformRadio || !toneRadio) {
        throw new Error("Ad platform and tone parameters must be selected.");
      }
      
      const platform = platformRadio.value;
      const tone = toneRadio.value;
      const cta = ctaPreferenceInput.value;

      const params = { bizName, industry, product, audience, goal, platform, tone, cta };

      if (!withLoader) {
        const results = generateAdCopyText(params);
        updateResultsUI(results, platform, bizName);
        return;
      }

      // Scroll to panel
      if (resultsCard) {
        resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Show Loader State, Hide Results and Empty states
      if (emptyStateCard) emptyStateCard.classList.add('hidden');
      if (resultsCard) resultsCard.classList.add('hidden');
      if (loadingSpinner) loadingSpinner.classList.remove('hidden');

      // Reset steps
      const step1 = document.getElementById('step-1');
      const step2 = document.getElementById('step-2');
      const step3 = document.getElementById('step-3');
      
      if (!step1 || !step2 || !step3) {
        throw new Error("Required multi-step loader elements are missing from the page.");
      }
      
      step1.className = 'step-item active';
      step2.className = 'step-item';
      step3.className = 'step-item';
      
      const setStepIcon = (stepEl, iconName) => {
        const oldIcon = stepEl.querySelector('i, svg');
        if (oldIcon) {
          const newIcon = document.createElement('i');
          newIcon.setAttribute('data-lucide', iconName);
          oldIcon.replaceWith(newIcon);
        }
      };

      setStepIcon(step1, 'check-circle-2');
      setStepIcon(step2, 'circle');
      setStepIcon(step3, 'circle');
      safeCreateIcons();

      // Step 1: Goal Analysis
      if (loaderStatus) {
        loaderStatus.textContent = "Analyzing campaign goal: " + goal + "...";
      }
      
      setTimeout(() => {
        try {
          // Step 2: Audience Analysis
          step1.className = 'step-item done';
          setStepIcon(step1, 'check-circle-2');
          step2.className = 'step-item active';
          if (loaderStatus) {
            loaderStatus.textContent = "Tailoring copy to " + tone + " tone...";
          }
          safeCreateIcons();

          setTimeout(() => {
            try {
              // Step 3: Platform Layout Setup
              step2.className = 'step-item done';
              setStepIcon(step2, 'check-circle-2');
              step3.className = 'step-item active';
              if (loaderStatus) {
                loaderStatus.textContent = "Structuring for " + platform + "...";
              }
              safeCreateIcons();

              setTimeout(() => {
                try {
                  // Finish Generation
                  if (loadingSpinner) loadingSpinner.classList.add('hidden');
                  if (resultsCard) resultsCard.classList.remove('hidden');

                  const results = generateAdCopyText(params);
                  
                  // Fetch dynamic business/storefront images first, then display and save
                  fetchBusinessImages(bizName, industry).then(() => {
                    updateResultsUI(results, platform, bizName);
                    if (withLoader) {
                      saveAdToDatabase(params, results);
                    }
                    showToast("High-converting copy generated successfully!", "success");
                  }).catch(() => {
                    updateResultsUI(results, platform, bizName);
                    if (withLoader) {
                      saveAdToDatabase(params, results);
                    }
                    showToast("High-converting copy generated successfully!", "success");
                  });
                } catch (err) {
                  handleGenerationError(err);
                }
              }, 600);

            } catch (err) {
              handleGenerationError(err);
            }
          }, 600);

        } catch (err) {
          handleGenerationError(err);
        }
      }, 600);

    } catch (error) {
      handleGenerationError(error);
    }
  }

  // --- Update Results and Mockup UI ---
  function updateResultsUI(results, platform, bizName) {
    // Fill textareas
    headlineTextarea.value = results.headline;
    bodyTextarea.value = results.body;
    ctaTextarea.value = results.cta;

    // Trigger typing effect or transition on outputs
    triggerTextareaGlow(headlineTextarea);
    triggerTextareaGlow(bodyTextarea);
    triggerTextareaGlow(ctaTextarea);

    // Update character counts
    updateCharCounts();

    // Update Platform-Specific Mockup Elements
    updatePlatformMockupText(results, platform, bizName);
  }

  function triggerTextareaGlow(textarea) {
    textarea.classList.add('glow-effect');
    setTimeout(() => {
      textarea.classList.remove('glow-effect');
    }, 1000);
  }

  function updateCharCounts() {
    headlineCount.textContent = headlineTextarea.value.length + " ch";
    bodyCount.textContent = bodyTextarea.value.length + " ch";
    ctaCount.textContent = ctaTextarea.value.length + " ch";
  }

  // --- Dynamic Ad Preview Image Engine ---

  let selectedImageUrl = '';

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

  const clientGenericFallback = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
  ];

  function fetchBusinessImages(query, industry) {
    const loaderSkeleton = document.getElementById('image-loader-skeleton');
    const optionsGrid = document.getElementById('image-options-grid');
    const sourceBadge = document.getElementById('image-source-badge');

    if (loaderSkeleton) loaderSkeleton.classList.remove('hidden');
    if (optionsGrid) optionsGrid.innerHTML = '';
    if (sourceBadge) {
      sourceBadge.textContent = "Searching...";
      sourceBadge.className = "badge";
      sourceBadge.style.backgroundColor = "rgba(249, 115, 22, 0.1)"; // orange badge
      sourceBadge.style.color = "#f97316";
    }

    return ensureDbMode().then(connected => {
      if (connected) {
        return fetch(`${API_BASE_URL}/api/business-images?query=${encodeURIComponent(query)}&industry=${encodeURIComponent(industry)}`)
          .then(res => {
            if (!res.ok) throw new Error("API failed");
            return res.json();
          });
      } else {
        // Client-side local simulation
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
          }, 400); // simulate API call
        });
      }
    })
    .then(data => {
      if (loaderSkeleton) loaderSkeleton.classList.add('hidden');
      renderImageOptions(data);
    })
    .catch(err => {
      console.error("Failed to load business images:", err);
      if (loaderSkeleton) loaderSkeleton.classList.add('hidden');
      if (sourceBadge) {
        sourceBadge.textContent = "Error Loading Images";
        sourceBadge.className = "badge";
        sourceBadge.style.backgroundColor = "#fee2e2";
        sourceBadge.style.color = "#ef4444";
      }
      renderImageOptions({
        images: clientGenericFallback,
        source: "fallback_categories",
        status_message: "Using category-based images"
      });
    });
  }

  function renderImageOptions(data) {
    const optionsGrid = document.getElementById('image-options-grid');
    const sourceBadge = document.getElementById('image-source-badge');

    if (!optionsGrid) return;
    optionsGrid.innerHTML = '';

    if (sourceBadge) {
      sourceBadge.textContent = data.status_message;
      if (data.source === 'google_places' || data.source === 'brand_assets') {
        sourceBadge.className = "badge";
        sourceBadge.style.backgroundColor = "rgba(16, 185, 129, 0.1)"; // soft emerald green
        sourceBadge.style.color = "#10b981";
      } else {
        sourceBadge.className = "badge badge-accent";
        sourceBadge.style.backgroundColor = "";
        sourceBadge.style.color = "";
      }
    }

    if (!data.images || data.images.length === 0) {
      optionsGrid.innerHTML = '<p style="font-size: 13px; color: var(--text-muted);">No images found.</p>';
      return;
    }

    // Automatically select the first option
    selectedImageUrl = data.images[0];
    updateMockupImages(selectedImageUrl);

    data.images.forEach((imgUrl, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `thumb-option ${index === 0 ? 'active' : ''}`;
      btn.innerHTML = `<img src="${imgUrl}" alt="Option ${index + 1}">`;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.thumb-option').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        selectedImageUrl = imgUrl;
        updateMockupImages(selectedImageUrl);
        showToast(`Selected Image Option ${index + 1}`, 'info');
      });

      optionsGrid.appendChild(btn);
    });
  }

  function updateMockupImages(url) {
    const fbImg = document.getElementById('fb-mock-img');
    const igImg = document.getElementById('ig-mock-img');
    const liImg = document.getElementById('li-mock-img');
    const fbPlaceholder = document.getElementById('fb-mock-placeholder');
    const igPlaceholder = document.getElementById('ig-mock-placeholder');
    const liPlaceholder = document.getElementById('li-mock-placeholder');

    if (fbImg && fbPlaceholder) {
      fbImg.classList.add('hidden');
      fbPlaceholder.classList.remove('hidden');
      fbImg.src = url;
    }
    if (igImg && igPlaceholder) {
      igImg.classList.add('hidden');
      igPlaceholder.classList.remove('hidden');
      igImg.src = url;
    }
    if (liImg && liPlaceholder) {
      liImg.classList.add('hidden');
      liPlaceholder.classList.remove('hidden');
      liImg.src = url;
    }
  }

  // Setup onload and onerror handlers for preview images to toggle loading state
  function setupPreviewImageLoaders() {
    const platforms = ['fb', 'ig', 'li'];

    platforms.forEach(platform => {
      const img = document.getElementById(`${platform}-mock-img`);
      const placeholder = document.getElementById(`${platform}-mock-placeholder`);

      if (!img || !placeholder) return;

      img.onload = () => {
        img.classList.remove('hidden');
        placeholder.classList.add('hidden');
      };

      img.onerror = () => {
        const currentSrc = img.src;
        const fallbackUrl = clientGenericFallback[0];

        if (currentSrc !== fallbackUrl) {
          console.warn(`Failed to load ${platform} mockup image, falling back to generic:`, fallbackUrl);
          img.src = fallbackUrl;
        } else {
          console.error(`Fallback failed for ${platform} mockup image.`);
          img.classList.add('hidden');
          placeholder.classList.remove('hidden');
        }
      };
    });
  }

  // Update Preview Layout Inputs
  function updatePlatformMockupText(results, platform, bizName) {
    // Hide all platform containers
    updatePreviewPlatformVisibility(platform);

    const activeImage = selectedImageUrl || clientGenericFallback[0];
    const fbImg = document.getElementById('fb-mock-img');
    const igImg = document.getElementById('ig-mock-img');
    const liImg = document.getElementById('li-mock-img');

    const fbPlaceholder = document.getElementById('fb-mock-placeholder');
    const igPlaceholder = document.getElementById('ig-mock-placeholder');
    const liPlaceholder = document.getElementById('li-mock-placeholder');

    if (platform === 'Facebook') {
      document.getElementById('fb-mock-biz-name').textContent = bizName || 'BizLeap Client';
      document.getElementById('fb-mock-body').textContent = results.body;
      document.getElementById('fb-mock-headline').textContent = results.headline;
      document.getElementById('fb-mock-cta').textContent = results.cta;

      if (fbImg && fbPlaceholder) {
        fbImg.classList.add('hidden');
        fbPlaceholder.classList.remove('hidden');
        fbImg.src = activeImage;
      }
    } 

    else if (platform === 'Instagram') {
      document.getElementById('ig-mock-biz-name').textContent = formatInstagramUsername(bizName);
      document.getElementById('ig-mock-caption-name').textContent = formatInstagramUsername(bizName);
      document.getElementById('ig-mock-body').textContent = results.body;
      document.getElementById('ig-mock-headline').textContent = results.headline;
      document.getElementById('ig-mock-cta').textContent = results.cta;

      if (igImg && igPlaceholder) {
        igImg.classList.add('hidden');
        igPlaceholder.classList.remove('hidden');
        igImg.src = activeImage;
      }
    } 

    else if (platform === 'Google Ads') {
      const formattedDomain = `https://www.${formatDomainName(bizName)}.in/campaign`;
      document.getElementById('google-mock-url').textContent = formattedDomain;
      document.getElementById('google-mock-headline').textContent = results.headline;
      document.getElementById('google-mock-body').textContent = results.body;
      document.getElementById('google-mock-cta').textContent = `➔ Call Action: ${results.cta}`;
    } 

    else if (platform === 'LinkedIn') {
      document.getElementById('li-mock-biz-name').textContent = bizName || 'BizLeap Client';
      document.getElementById('li-mock-body').textContent = results.body;
      document.getElementById('li-mock-headline').textContent = results.headline;
      document.getElementById('li-mock-cta').textContent = results.cta;
      document.getElementById('li-mock-biz-domain').textContent = `${formatDomainName(bizName)}.in`;

      if (liImg && liPlaceholder) {
        liImg.classList.add('hidden');
        liPlaceholder.classList.remove('hidden');
        liImg.src = activeImage;
      }
    }
  }

  // --- String Helpers ---
  function formatInstagramUsername(name) {
    if (!name) return 'bizleap_client';
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
  }

  function formatDomainName(name) {
    if (!name) return 'bizleap';
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // --- Clipboard Integration & Toast Alerts ---
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        document.execCommand('copy') ? res() : rej();
        textArea.remove();
      });
    }
  }

  // individual field copy
  copyFieldBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const textarea = document.getElementById(targetId);
      if (textarea && textarea.value) {
        copyToClipboard(textarea.value)
          .then(() => {
            showToast("Copied to clipboard!", "success");
          })
          .catch(() => {
            showToast("Failed to copy", "error");
          });
      }
    });
  });

  // copy all output block
  btnCopyAll.addEventListener('click', () => {
    const headline = headlineTextarea.value;
    const body = bodyTextarea.value;
    const cta = ctaTextarea.value;

    const fullText = `--- GENERATED AD COPY ---\nHeadline: ${headline}\n\nAd Text:\n${body}\n\nCall-To-Action: ${cta}\n--------------------------`;

    copyToClipboard(fullText)
      .then(() => {
        showToast("All fields copied to clipboard!", "success");
      })
      .catch(() => {
        showToast("Failed to copy", "error");
      });
  });

  // Toast Alert System
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    
    let iconName = 'check-circle';
    if (type === 'info') iconName = 'info';
    if (type === 'error') iconName = 'alert-triangle';

    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    safeCreateIcons(); // render the icon

    // Wait and slide out
    setTimeout(() => {
      toast.classList.add('toast-exit');
      // remove from DOM
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // --- Database Persistence & Stats Aggregation API Wrappers ---
  
  let historyData = []; // Store raw history locally for real-time client-side search filtering
  let isBackendConnected = false;
  let dbModeChecked = false;

  function ensureDbMode() {
    if (dbModeChecked) return Promise.resolve(isBackendConnected);
    
    return fetch(`${API_BASE_URL}/api/history`)
      .then(res => {
        isBackendConnected = res.ok;
        dbModeChecked = true;
        updateDbModeBadge();
        return isBackendConnected;
      })
      .catch(() => {
        isBackendConnected = false;
        dbModeChecked = true;
        updateDbModeBadge();
        return false;
      });
  }

  function updateDbModeBadge() {
    const badge = document.getElementById('db-mode-badge');
    if (!badge) return;
    
    if (isBackendConnected) {
      badge.textContent = "Cloud Sync";
      badge.className = "badge";
      badge.style.backgroundColor = "rgba(16, 185, 129, 0.1)"; // soft emerald green background
      badge.style.color = "#10b981"; // emerald green
      badge.style.border = "1px solid rgba(16, 185, 129, 0.2)";
    } else {
      badge.textContent = "Browser Storage";
      badge.className = "badge";
      badge.style.backgroundColor = "rgba(100, 116, 139, 0.1)"; // soft slate grey background
      badge.style.color = "#64748b"; // slate grey
      badge.style.border = "1px solid rgba(100, 116, 139, 0.2)";
    }
  }

  // --- Browser LocalStorage Database Simulation (Vercel Offline Fallback) ---
  
  function getLocalStorageSeeds() {
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

  function getLocalStorageAds() {
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
  }

  function saveLocalStorageAds(ads) {
    localStorage.setItem('bizleap_ads', JSON.stringify(ads));
  }

  let lastSavedAdId = null;

  function saveLocalStorageAd(params, results, status = "history", scheduled_time = null) {
    const mock_impressions = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
    const mock_ctr = parseFloat((Math.random() * (4.2 - 1.5) + 1.5).toFixed(2));
    const mock_clicks = Math.round(mock_impressions * (mock_ctr / 100));
    const mock_spend = Math.floor(Math.random() * (1200 - 150 + 1)) + 150;

    const newAd = {
      id: "ad-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      business_name: params.bizName || params.business_name,
      industry_type: params.industry || params.industry_type || "General",
      product_name: params.product || params.product_name,
      target_audience: params.audience || params.target_audience || "General Audience",
      campaign_goal: params.goal || params.campaign_goal || "Traffic",
      ad_platform: params.platform || params.ad_platform || "Facebook",
      ad_tone: params.tone || params.ad_tone || "Professional",
      headline: results.headline,
      body_text: results.body || results.body_text,
      cta: results.cta || "Learn More",
      selected_image_url: selectedImageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      status: status,
      scheduled_time: scheduled_time,
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
  }

  function deleteLocalStorageAd(id) {
    let ads = getLocalStorageAds();
    ads = ads.filter(ad => ad.id !== id);
    saveLocalStorageAds(ads);
  }

  function getLocalStorageCampaignStats() {
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
  }

  // --- Hybrid Fetch Wrapper Methods ---

  function saveAdToDatabase(params, results, status = "history", scheduled_time = null) {
    ensureDbMode().then(connected => {
      if (connected) {
        const dataToPost = {
          business_name: params.bizName,
          industry_type: params.industry,
          product_name: params.product,
          target_audience: params.audience,
          campaign_goal: params.goal,
          ad_platform: params.platform,
          ad_tone: params.tone,
          headline: results.headline,
          body_text: results.body,
          cta: results.cta,
          selected_image_url: selectedImageUrl,
          status: status,
          scheduled_time: scheduled_time
        };

        fetch(`${API_BASE_URL}/api/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToPost)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to save generated ad to history database.");
          }
          return response.json();
        })
        .then(savedAd => {
          console.log("Successfully saved ad (Cloud Sync):", savedAd);
          lastSavedAdId = savedAd.id;
          loadHistoryData(false); 
          loadCampaignStats(false);
        })
        .catch(err => {
          console.error("Database save error:", err);
          showToast("Generated successfully but failed to sync with cloud server.", "error");
        });
      } else {
        // Fallback: Save to LocalStorage
        const savedAd = saveLocalStorageAd(params, results, status, scheduled_time);
        lastSavedAdId = savedAd.id;
        console.log("Successfully saved ad (Browser Storage).");
        loadHistoryData(false); 
        loadCampaignStats(false);
      }
    });
  }

  function loadHistoryData(showLoading = true) {
    const historyList = document.getElementById('history-list');
    const historyEmpty = document.getElementById('history-empty');
    
    if (!historyList) return;

    if (showLoading) {
      historyList.innerHTML = '<div style="grid-column: span 2; text-align: center; padding: 40px; color: var(--text-muted);"><div class="quantum-spinner" style="margin: 0 auto 20px;"></div>Loading saved campaigns...</div>';
      if (historyEmpty) historyEmpty.classList.add('hidden');
    }

    ensureDbMode().then(connected => {
      if (connected) {
        fetch(`${API_BASE_URL}/api/history`)
          .then(response => {
            if (!response.ok) throw new Error("Could not load history.");
            return response.json();
          })
          .then(data => {
            historyData = data;
            renderHistoryList(historyData);
          })
          .catch(err => {
            console.error("Fetch history failed:", err);
            historyList.innerHTML = `
              <div style="grid-column: span 2; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; gap: 16px;" class="card">
                <i data-lucide="alert-triangle" style="width: 48px; height: 48px; color: #f59e0b; background-color: #fffbeb; padding: 10px; border-radius: 50%;"></i>
                <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--text-main);">Connection Error</h3>
                <p style="font-size: 14px; color: var(--text-muted); max-width: 340px;">Unable to establish communication with the database server at <strong>${API_BASE_URL || window.location.origin}</strong>. Please ensure the server is active.</p>
                <button type="button" class="btn btn-sm btn-secondary" onclick="loadHistoryData(true);">
                  <i data-lucide="refresh-cw"></i> Retry Connection
                </button>
              </div>
            `;
            safeCreateIcons();
            if (historyEmpty) historyEmpty.classList.add('hidden');
            showToast("Failed to fetch campaign history.", "error");
          });
      } else {
        // Fallback: Read from LocalStorage
        historyData = getLocalStorageAds();
        renderHistoryList(historyData);
      }
    });
  }

  function createHistoryCardHTML(ad) {
    const dateStr = new Date(ad.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const platformIcons = {
      Facebook: '<i data-lucide="facebook" class="icon-fb"></i>',
      Instagram: '<i data-lucide="instagram" class="icon-ig"></i>',
      'Google Ads': '<i data-lucide="search" class="icon-google"></i>',
      LinkedIn: '<i data-lucide="linkedin" class="icon-li"></i>'
    };
    
    const iconHtml = platformIcons[ad.ad_platform] || '<i data-lucide="globe"></i>';
    const imageUrl = ad.selected_image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80";

    return `
      <div class="card history-card" data-id="${ad.id}">
        <div class="history-card-header">
          <div class="history-card-title">
            <div class="platform-indicator ${ad.ad_platform.toLowerCase().replace(/\s/g, '')}">
              ${iconHtml}
              <span>${ad.ad_platform}</span>
            </div>
            <h3>${ad.business_name}</h3>
          </div>
          <div class="history-card-actions">
            <button class="btn-delete-history" data-id="${ad.id}" title="Delete Record">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
        
        <!-- Display Saved Business Image -->
        <div class="history-card-image">
          <img src="${imageUrl}" alt="${ad.business_name}">
        </div>

        <div class="history-card-meta">
          <span class="meta-tag"><i data-lucide="tag"></i> ${ad.industry_type}</span>
          <span class="meta-tag"><i data-lucide="target"></i> ${ad.campaign_goal}</span>
          <span class="meta-tag"><i data-lucide="smile"></i> ${ad.ad_tone}</span>
          <span class="meta-tag date-tag"><i data-lucide="calendar"></i> ${dateStr}</span>
        </div>

        <div class="history-card-product">
          <strong>Product/Service:</strong> ${ad.product_name}
        </div>

        <div class="history-card-content">
          <div class="history-content-section">
            <span class="section-label">Headline</span>
            <p class="history-headline">${ad.headline}</p>
          </div>
          <div class="history-content-section">
            <span class="section-label">Primary Body Copy</span>
            <p class="history-body-text">${ad.body_text.replace(/\n/g, '<br>')}</p>
          </div>
          <div class="history-content-section">
            <span class="section-label">CTA</span>
            <p class="history-cta-text">${ad.cta}</p>
          </div>
        </div>

        <!-- Performance Metrics Banner -->
        <div class="history-metrics-banner">
          <div class="metric-mini">
            <span class="metric-mini-label">Spend</span>
            <span class="metric-mini-val">$${ad.mock_spend}</span>
          </div>
          <div class="metric-mini">
            <span class="metric-mini-label">Impressions</span>
            <span class="metric-mini-val">${ad.mock_impressions.toLocaleString()}</span>
          </div>
          <div class="metric-mini">
            <span class="metric-mini-label">Avg CTR</span>
            <span class="metric-mini-val">${ad.mock_ctr}%</span>
          </div>
          <div class="metric-mini">
            <span class="metric-mini-label">Clicks</span>
            <span class="metric-mini-val">${ad.mock_clicks}</span>
          </div>
        </div>

        <div class="history-card-footer">
          <button class="btn btn-sm btn-outline btn-copy-history" data-id="${ad.id}">
            <i data-lucide="copy"></i> Copy Ad Copy
          </button>
        </div>
      </div>
    `;
  }

  function renderHistoryList(data) {
    const historyList = document.getElementById('history-list');
    const historyEmpty = document.getElementById('history-empty');
    if (!historyList) return;
    
    historyList.innerHTML = '';

    const searchInput = document.getElementById('history-search');
    const platformFilterSelect = document.getElementById('filter-platform');
    const toneFilterSelect = document.getElementById('filter-tone');

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const platformFilter = platformFilterSelect ? platformFilterSelect.value : '';
    const toneFilter = toneFilterSelect ? toneFilterSelect.value : '';

    const filtered = data.filter(ad => {
      const matchesSearch = 
        ad.business_name.toLowerCase().includes(searchTerm) ||
        ad.product_name.toLowerCase().includes(searchTerm) ||
        ad.campaign_goal.toLowerCase().includes(searchTerm) ||
        ad.headline.toLowerCase().includes(searchTerm);
      
      const matchesPlatform = !platformFilter || ad.ad_platform === platformFilter;
      const matchesTone = !toneFilter || ad.ad_tone === toneFilter;

      return matchesSearch && matchesPlatform && matchesTone;
    });

    if (filtered.length === 0) {
      if (historyEmpty) historyEmpty.classList.remove('hidden');
    } else {
      if (historyEmpty) historyEmpty.classList.add('hidden');
      filtered.forEach(ad => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = createHistoryCardHTML(ad);
        const cardNode = tempDiv.firstElementChild;
        
        // Bind delete button listener
        const deleteBtn = cardNode.querySelector('.btn-delete-history');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteHistoryAd(ad.id);
          });
        }

        // Bind copy button listener
        const copyBtn = cardNode.querySelector('.btn-copy-history');
        if (copyBtn) {
          copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const fullText = `--- GENERATED AD COPY ---\nHeadline: ${ad.headline}\n\nAd Text:\n${ad.body_text}\n\nCall-To-Action: ${ad.cta}\n--------------------------`;
            copyToClipboard(fullText)
              .then(() => showToast("Campaign copy copied to clipboard!", "success"))
              .catch(() => showToast("Failed to copy", "error"));
          });
        }

        historyList.appendChild(cardNode);
      });
    }

    safeCreateIcons();
  }

  let adIdToDelete = null;

  function deleteHistoryAd(id) {
    adIdToDelete = id;
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  // Bind custom modal buttons
  const btnDeleteCancel = document.getElementById('btn-delete-cancel');
  const btnDeleteConfirm = document.getElementById('btn-delete-confirm');
  const deleteConfirmModal = document.getElementById('delete-confirm-modal');

  if (btnDeleteCancel) {
    btnDeleteCancel.addEventListener('click', () => {
      if (deleteConfirmModal) deleteConfirmModal.classList.add('hidden');
      adIdToDelete = null;
    });
  }

  if (btnDeleteConfirm) {
    btnDeleteConfirm.addEventListener('click', () => {
      if (!adIdToDelete) return;

      ensureDbMode().then(connected => {
        if (connected) {
          fetch(`${API_BASE_URL}/api/history/${adIdToDelete}`, {
            method: 'DELETE'
          })
            .then(response => {
              if (!response.ok) throw new Error("Delete failed");
              return response.json();
            })
            .then(res => {
              showToast("Campaign ad copy deleted successfully.", "success");
              if (deleteConfirmModal) deleteConfirmModal.classList.add('hidden');
              adIdToDelete = null;
              loadHistoryData(false);
              loadCampaignStats(false);
            })
            .catch(err => {
              console.error("Delete failed:", err);
              showToast("Failed to delete history item.", "error");
              if (deleteConfirmModal) deleteConfirmModal.classList.add('hidden');
              adIdToDelete = null;
            });
        } else {
          // Fallback: Delete from LocalStorage
          deleteLocalStorageAd(adIdToDelete);
          showToast("Campaign ad copy deleted successfully.", "success");
          if (deleteConfirmModal) deleteConfirmModal.classList.add('hidden');
          adIdToDelete = null;
          loadHistoryData(false);
          loadCampaignStats(false);
        }
      });
    });
  }

  function loadCampaignStats(showLoading = true) {
    const statsTableBody = document.getElementById('stats-table-body');
    if (!statsTableBody) return;

    if (showLoading) {
      statsTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 30px;"><div class="quantum-spinner" style="margin: 0 auto;"></div></td></tr>';
    }

    ensureDbMode().then(connected => {
      if (connected) {
        fetch(`${API_BASE_URL}/api/campaign-stats`)
          .then(response => {
            if (!response.ok) throw new Error("Could not fetch stats.");
            return response.json();
          })
          .then(data => {
            renderStatsUI(data);
          })
          .catch(err => {
            console.error("Load stats failed:", err);
            statsTableBody.innerHTML = `
              <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
                  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;">
                    <i data-lucide="alert-triangle" style="width: 32px; height: 32px; color: #ef4444;"></i>
                    <span style="font-weight: 600; color: var(--text-main);">Database Connection Failed</span>
                    <span style="font-size: 13px;">Unable to load stats from database server at <strong>${API_BASE_URL || window.location.origin}</strong>.</span>
                  </div>
                </td>
              </tr>
            `;
            safeCreateIcons();
            showToast("Failed to fetch campaign stats.", "error");
          });
      } else {
        // Fallback: Read from LocalStorage
        const data = getLocalStorageCampaignStats();
        renderStatsUI(data);
      }
    });
  }

  function renderStatsUI(data) {
    const statsTableBody = document.getElementById('stats-table-body');
    if (!statsTableBody) return;

    // Update KPI values
    const spendEl = document.getElementById('kpi-spend');
    const ctrEl = document.getElementById('kpi-ctr');
    const impressionsEl = document.getElementById('kpi-impressions');
    const adsEl = document.getElementById('kpi-ads');

    if (spendEl) spendEl.textContent = `$${data.totals.spend.toLocaleString()}`;
    if (ctrEl) ctrEl.textContent = `${data.totals.ctr}%`;
    if (impressionsEl) impressionsEl.textContent = data.totals.impressions.toLocaleString();
    if (adsEl) adsEl.textContent = data.totals.ads_count;

    // Render comparative table
    statsTableBody.innerHTML = '';
    if (data.campaigns.length === 0) {
      statsTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 30px;">No campaigns found. Generate copies to view statistics.</td></tr>';
      return;
    }

    data.campaigns.forEach(c => {
      const row = document.createElement('tr');
      const platformClass = c.platform ? c.platform.toLowerCase().replace(/\s/g, '') : '';
      row.innerHTML = `
        <td><strong>${c.name}</strong></td>
        <td><span class="badge badge-outline" style="background: var(--bg-main); color: var(--text-main); font-weight: 500; font-size: 11px; text-transform: none; letter-spacing: 0;">${c.industry}</span></td>
        <td><span class="platform-indicator ${platformClass}">${c.platform}</span></td>
        <td><span class="badge badge-accent" style="font-weight: 500; font-size: 11px;">${c.goal}</span></td>
        <td class="text-right">${c.ads_count}</td>
        <td class="text-right"><strong>$${c.spend.toLocaleString()}</strong></td>
        <td class="text-right">${c.impressions.toLocaleString()}</td>
        <td class="text-right" style="color: var(--primary); font-weight: 600;">${c.ctr}%</td>
      `;
      statsTableBody.appendChild(row);
    });

    // Set progress bars width based on CTR percentage, up to 100%
    const ctrProgressBar = document.querySelector('.border-ctr .kpi-progress-bar');
    if (ctrProgressBar) {
      const ctrPercent = Math.min((data.totals.ctr / 5) * 100, 100);
      ctrProgressBar.style.width = `${ctrPercent}%`;
    }
  }

  // Pre-load data in background after checking connection mode
  ensureDbMode().then(() => {
    loadHistoryData(false);
    loadCampaignStats(false);
  });

  // --- Initial Page Prep ---
  // Apply a nice custom style class to indicate newly loaded content
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .glow-effect {
      box-shadow: 0 0 12px rgba(37, 99, 235, 0.4);
      border-color: var(--primary) !important;
      transition: all 0.2s ease;
    }
  `;
  document.head.appendChild(styleEl);

  // --- Publishing Hub & Exporter Actions Integration ---

  // Helper: Get current campaign object
  function getCurrentCampaignData() {
    const platformRadio = document.querySelector('input[name="ad-platform"]:checked');
    const toneRadio = document.querySelector('input[name="ad-tone"]:checked');
    return {
      business_name: businessNameInput.value || "Apex Heights",
      industry_type: industryTypeInput.value || "Real Estate",
      product_name: productNameInput.value || "Premium Apartments",
      target_audience: targetAudienceInput.value || "General Audience",
      campaign_goal: campaignGoalInput.value || "Lead Generation",
      ad_platform: platformRadio ? platformRadio.value : 'Facebook',
      ad_tone: toneRadio ? toneRadio.value : 'Professional',
      headline: headlineTextarea.value || "",
      body_text: bodyTextarea.value || "",
      cta: ctaTextarea.value || "Learn More",
      selected_image_url: selectedImageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
    };
  }

  // 1. Export JSON Action
  const btnExportJson = document.getElementById('btn-export-json');
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      const data = getCurrentCampaignData();
      const filename = `${data.business_name.toLowerCase().replace(/\s+/g, '_')}_campaign.json`;
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Campaign exported as JSON successfully!", "success");
    });
  }

  // 2. Download Image Action (html2canvas capture)
  const btnDownloadImage = document.getElementById('btn-download-image');
  if (btnDownloadImage) {
    btnDownloadImage.addEventListener('click', () => {
      const currentPlatform = getCurrentCampaignData().ad_platform;
      let targetElement = null;
      
      if (currentPlatform === 'Facebook') targetElement = document.getElementById('mockup-facebook');
      else if (currentPlatform === 'Instagram') targetElement = document.getElementById('mockup-instagram');
      else if (currentPlatform === 'Google Ads') targetElement = document.getElementById('mockup-google');
      else if (currentPlatform === 'LinkedIn') targetElement = document.getElementById('mockup-linkedin');

      if (!targetElement) {
        showToast("Mockup element not found.", "error");
        return;
      }

      showToast("Generating image asset...", "info");

      html2canvas(targetElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 2 // high resolution
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const filename = `${currentPlatform.toLowerCase().replace(/\s+/g, '_')}_mockup_${Date.now()}.png`;
        
        const a = document.createElement('a');
        a.href = imgData;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("Ad Mockup image downloaded!", "success");
      }).catch(err => {
        console.error("html2canvas error:", err);
        showToast("Failed to render mockup image.", "error");
      });
    });
  }

  // 3. Download PDF Report Action (jsPDF + html2canvas capture)
  const btnDownloadPdf = document.getElementById('btn-download-pdf');
  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener('click', () => {
      const data = getCurrentCampaignData();
      let targetElement = null;
      
      if (data.ad_platform === 'Facebook') targetElement = document.getElementById('mockup-facebook');
      else if (data.ad_platform === 'Instagram') targetElement = document.getElementById('mockup-instagram');
      else if (data.ad_platform === 'Google Ads') targetElement = document.getElementById('mockup-google');
      else if (data.ad_platform === 'LinkedIn') targetElement = document.getElementById('mockup-linkedin');

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
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Page 1: Header & Metadata
        pdf.setFillColor(37, 99, 235); // Blue primary banner
        pdf.rect(0, 0, 210, 40, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(22);
        pdf.text("BIZLEAP TECHNOLOGIES", 15, 20);
        pdf.setFontSize(12);
        pdf.text("Campaign Copywriting & Visual Proposal Report", 15, 28);
        
        pdf.setTextColor(15, 23, 42); // slate 900
        pdf.setFontSize(18);
        pdf.text(`Campaign: ${data.business_name}`, 15, 55);
        
        // Metadata Table
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("CAMPAIGN METADATA", 15, 68);
        pdf.line(15, 70, 195, 70);
        
        const metadataRows = [
          ["Business Name", data.business_name],
          ["Industry / Sector", data.industry_type],
          ["Target Product/Service", data.product_name],
          ["Campaign Objective", data.campaign_goal],
          ["Ad Platform", data.ad_platform],
          ["Creative Tone", data.ad_tone],
          ["Call To Action", data.cta]
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

        // Copy outputs section
        startY += 6;
        pdf.setFont("helvetica", "bold");
        pdf.text("GENERATED COPYPACK", 15, startY);
        pdf.line(15, startY + 2, 195, startY + 2);
        startY += 10;

        // Headline
        pdf.setFont("helvetica", "bold");
        pdf.text("Headline / Hook:", 17, startY);
        pdf.setFont("helvetica", "normal");
        pdf.text(data.headline, 17, startY + 6, { maxWidth: 175 });
        startY += 18;

        // Primary Copy
        pdf.setFont("helvetica", "bold");
        pdf.text("Primary Body Text:", 17, startY);
        pdf.setFont("helvetica", "normal");
        const bodyLines = pdf.splitTextToSize(data.body_text, 175);
        pdf.text(bodyLines, 17, startY + 6);
        
        // Move to Page 2 for preview mockup and projected performance
        pdf.addPage();
        
        // Mockup Header
        pdf.setFillColor(15, 23, 42); // Dark slate header
        pdf.rect(0, 0, 210, 20, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text(`Live Mockup Ad Creative - ${data.ad_platform}`, 15, 13);

        // Calculate aspect ratio to fit image into page
        const imgWidth = 140; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Embed Mockup creative
        pdf.addImage(imgData, 'JPEG', 15, 30, imgWidth, Math.min(imgHeight, 140));

        // Projections Block
        const projY = 30 + Math.min(imgHeight, 140) + 15;
        pdf.setTextColor(15, 23, 42);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Projected Campaign Performance (Simulation)", 15, projY);
        pdf.line(15, projY + 2, 195, projY + 2);
        
        // Draw some metrics cards
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

        // Footer notice
        pdf.setFontSize(9);
        pdf.setTextColor(148, 163, 184);
        pdf.setFont("helvetica", "italic");
        pdf.text("This is an AI-generated marketing proposal compiled by BizLeap Technologies.", 15, 285);
        
        pdf.save(`${data.business_name.toLowerCase().replace(/\s+/g, '_')}_campaign_report.pdf`);
        showToast("PDF Campaign Report downloaded!", "success");
      }).catch(err => {
        console.error("PDF generation failed:", err);
        showToast("Failed to compile PDF Report.", "error");
      });
    });
  }

  // 4. Publish Wizard Dialog controls
  const publishWizardModal = document.getElementById('publish-wizard-modal');
  const btnPublishWizard = document.getElementById('btn-publish-wizard');
  const btnWizardCancel = document.getElementById('btn-wizard-cancel');
  const btnWizardConfirm = document.getElementById('btn-wizard-confirm');
  const wizardScheduleTimeBox = document.getElementById('wizard-schedule-time-box');
  const wizardScheduleTimeInput = document.getElementById('wizard-schedule-time');

  let selectedWizardOption = 'now'; // default option

  if (btnPublishWizard) {
    btnPublishWizard.addEventListener('click', () => {
      if (publishWizardModal) {
        publishWizardModal.classList.remove('hidden');
      }
    });
  }

  if (btnWizardCancel) {
    btnWizardCancel.addEventListener('click', () => {
      if (publishWizardModal) publishWizardModal.classList.add('hidden');
    });
  }

  // Handle option cards click inside the wizard modal
  const wizardOptionCards = document.querySelectorAll('.wizard-option-card');
  wizardOptionCards.forEach(card => {
    card.addEventListener('click', () => {
      wizardOptionCards.forEach(c => {
        c.classList.remove('active');
        c.style.borderColor = 'var(--border-color)';
        c.style.background = '';
      });
      card.classList.add('active');
      card.style.borderColor = 'var(--accent)';
      card.style.background = 'rgba(249, 115, 22, 0.04)';
      
      const opt = card.getAttribute('data-option');
      selectedWizardOption = opt;

      if (opt === 'schedule') {
        if (wizardScheduleTimeBox) wizardScheduleTimeBox.classList.remove('hidden');
      } else {
        if (wizardScheduleTimeBox) wizardScheduleTimeBox.classList.add('hidden');
      }
    });
  });

  if (btnWizardConfirm) {
    btnWizardConfirm.addEventListener('click', () => {
      const data = getCurrentCampaignData();
      if (publishWizardModal) publishWizardModal.classList.add('hidden');
      
      const params = {
        bizName: data.business_name,
        industry: data.industry_type,
        product: data.product_name,
        audience: data.target_audience,
        goal: data.campaign_goal,
        platform: data.ad_platform,
        tone: data.ad_tone,
        cta: data.cta
      };
      
      const results = {
        headline: data.headline,
        body: data.body_text,
        cta: data.cta
      };

      if (selectedWizardOption === 'now') {
        // Publish Now -> simulation queue
        showToast("Initializing simulated publishing pipeline...", "info");
        
        // Save to DB in 'publishing' state
        ensureDbMode().then(connected => {
          if (connected) {
            const dataToPost = {
              ...data,
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
              // Redirect to Publisher Hub
              document.getElementById('btn-nav-publisher').click();
              startQueueSimulation(savedAd);
            });
          } else {
            const savedAd = saveLocalStorageAd(params, results, 'publishing', null);
            document.getElementById('btn-nav-publisher').click();
            startQueueSimulation(savedAd);
          }
        });
      } 
      
      else if (selectedWizardOption === 'schedule') {
        // Schedule Campaign
        const scheduleVal = wizardScheduleTimeInput ? wizardScheduleTimeInput.value : '';
        if (!scheduleVal) {
          showToast("Please choose a schedule date & time.", "error");
          if (publishWizardModal) publishWizardModal.classList.remove('hidden');
          return;
        }

        showToast("Campaign scheduled successfully!", "success");
        
        ensureDbMode().then(connected => {
          if (connected) {
            const dataToPost = {
              ...data,
              status: 'scheduled',
              scheduled_time: new Date(scheduleVal).toISOString()
            };
            fetch(`${API_BASE_URL}/api/history`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(dataToPost)
            })
            .then(res => res.json())
            .then(() => {
              document.getElementById('btn-nav-publisher').click();
            });
          } else {
            saveLocalStorageAd(params, results, 'scheduled', new Date(scheduleVal).toISOString());
            document.getElementById('btn-nav-publisher').click();
          }
        });
      } 
      
      else if (selectedWizardOption === 'draft') {
        // Save as Draft
        showToast("Campaign saved to drafts.", "success");
        
        ensureDbMode().then(connected => {
          if (connected) {
            const dataToPost = {
              ...data,
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
              document.getElementById('btn-nav-publisher').click();
            });
          } else {
            saveLocalStorageAd(params, results, 'draft', null);
            document.getElementById('btn-nav-publisher').click();
          }
        });
      }
    });
  }

  // 5. Publisher Hub Render Logic
  let activeSimulationIntervals = {}; // tracks running queue timers

  function loadPublisherHubData() {
    const queueList = document.getElementById('queue-list');
    const scheduledList = document.getElementById('scheduled-list');
    const draftsList = document.getElementById('drafts-list');
    
    const queueEmpty = document.getElementById('queue-empty');
    const scheduledEmpty = document.getElementById('scheduled-empty');
    const draftsEmpty = document.getElementById('drafts-empty');

    const scheduledCountBadge = document.getElementById('scheduled-count-badge');
    const draftsCountBadge = document.getElementById('drafts-count-badge');

    // Fetch campaigns
    ensureDbMode().then(connected => {
      if (connected) {
        return fetch(`${API_BASE_URL}/api/history`)
          .then(res => res.json());
      } else {
        return getLocalStorageAds();
      }
    })
    .then(data => {
      const queueItems = data.filter(ad => ad.status === 'publishing' || ad.status === 'published');
      const scheduledItems = data.filter(ad => ad.status === 'scheduled');
      const draftsItems = data.filter(ad => ad.status === 'draft');

      if (scheduledCountBadge) scheduledCountBadge.textContent = scheduledItems.length;
      if (draftsCountBadge) draftsCountBadge.textContent = draftsItems.length;

      // Render Drafts
      if (draftsList) {
        const items = draftsList.querySelectorAll('.campaign-hub-card');
        items.forEach(el => el.remove());

        if (draftsItems.length === 0) {
          if (draftsEmpty) draftsEmpty.classList.remove('hidden');
        } else {
          if (draftsEmpty) draftsEmpty.classList.add('hidden');
          draftsItems.forEach(ad => {
            const card = createPublisherHubCardHTML(ad, 'draft');
            draftsList.appendChild(card);
          });
        }
      }

      // Render Scheduled
      if (scheduledList) {
        const items = scheduledList.querySelectorAll('.campaign-hub-card');
        items.forEach(el => el.remove());

        if (scheduledItems.length === 0) {
          if (scheduledEmpty) scheduledEmpty.classList.remove('hidden');
        } else {
          if (scheduledEmpty) scheduledEmpty.classList.add('hidden');
          scheduledItems.forEach(ad => {
            const card = createPublisherHubCardHTML(ad, 'scheduled');
            scheduledList.appendChild(card);
          });
        }
      }

      // Render Queue
      if (queueList) {
        const items = queueList.querySelectorAll('.campaign-hub-card');
        items.forEach(el => el.remove());

        // Check if there are active publishing items not in our UI intervals yet
        queueItems.forEach(ad => {
          if (ad.status === 'publishing' && !activeSimulationIntervals[ad.id]) {
            startQueueSimulation(ad, Math.floor(Math.random() * 40) + 10);
          }
        });

        if (queueItems.length === 0) {
          if (queueEmpty) queueEmpty.classList.remove('hidden');
        } else {
          if (queueEmpty) queueEmpty.classList.add('hidden');
          queueItems.forEach(ad => {
            const card = createPublisherHubCardHTML(ad, 'queue');
            queueList.appendChild(card);
          });
        }
      }

      safeCreateIcons();
    })
    .catch(err => {
      console.error("Failed to load publisher hub data:", err);
      showToast("Could not load Publishing Hub proposals.", "error");
    });
  }

  // Create Card Element for Hub Columns
  function createPublisherHubCardHTML(ad, type) {
    const card = document.createElement('div');
    card.className = 'campaign-hub-card';
    card.id = `hub-card-${ad.id}`;
    
    const platformClass = ad.ad_platform ? ad.ad_platform.toLowerCase().replace(/\s/g, '') : 'facebook';
    const cleanPlatform = ad.ad_platform || 'Facebook';
    
    let headerRight = '';
    let footerRow = '';
    
    if (type === 'draft') {
      headerRight = `<span class="badge" style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: none;">Draft</span>`;
      footerRow = `
        <div class="hub-card-actions">
          <button class="btn btn-sm btn-outline btn-hub-delete" style="padding: 4px 8px; font-size: 11px;" data-id="${ad.id}">
            <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i> Delete
          </button>
          <button class="btn btn-sm btn-primary btn-hub-resume" style="padding: 4px 10px; font-size: 11px;" data-id="${ad.id}">
            <i data-lucide="edit" style="width: 12px; height: 12px;"></i> Resume Draft
          </button>
        </div>
      `;
    } 
    
    else if (type === 'scheduled') {
      const dateStr = new Date(ad.scheduled_time).toLocaleString();
      headerRight = `<span class="badge" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: none;">Scheduled</span>`;
      footerRow = `
        <div class="hub-card-time"><i data-lucide="clock" style="width: 12px; height: 12px;"></i> Launch: ${dateStr}</div>
        <div class="hub-card-actions">
          <button class="btn btn-sm btn-outline btn-hub-cancel-schedule" style="padding: 4px 8px; font-size: 11px;" data-id="${ad.id}">
             Cancel Schedule
          </button>
          <button class="btn btn-sm btn-primary btn-hub-publish-now" style="padding: 4px 10px; font-size: 11px;" data-id="${ad.id}">
            <i data-lucide="send" style="width: 12px; height: 12px;"></i> Launch Now
          </button>
        </div>
      `;
    } 
    
    else if (type === 'queue') {
      const isPublishing = ad.status === 'publishing';
      const badgeColor = isPublishing ? 'rgba(249, 115, 22, 0.1)' : 'rgba(16, 185, 129, 0.1)';
      const badgeText = isPublishing ? 'Publishing' : 'Active';
      const badgeTextColor = isPublishing ? '#f97316' : '#10b981';
      
      headerRight = `<span class="badge" style="background: ${badgeColor}; color: ${badgeTextColor}; border: none;" id="queue-badge-${ad.id}">${badgeText}</span>`;
      
      const progressPct = isPublishing ? '30%' : '100%';
      const progressText = isPublishing ? 'Uploading assets...' : 'Campaign deployed';
      
      footerRow = `
        <div class="queue-progress-container">
          <div class="queue-progress-label-row">
            <span class="queue-progress-status" id="queue-status-text-${ad.id}">${progressText}</span>
            <span class="queue-progress-pct" id="queue-pct-text-${ad.id}">${progressPct}</span>
          </div>
          <div class="queue-progress-bar">
            <div class="queue-progress-fill" id="queue-progress-fill-${ad.id}" style="width: ${progressPct};"></div>
          </div>
        </div>
        <div class="hub-card-actions">
          <button class="btn btn-sm btn-outline btn-hub-delete" style="padding: 4px 8px; font-size: 11px;" data-id="${ad.id}">
            <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i> Delete
          </button>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="hub-card-header">
        <span class="hub-card-biz">${ad.business_name}</span>
        ${headerRight}
      </div>
      <div class="hub-card-prod">${ad.product_name}</div>
      <div class="hub-card-platform badge-platform-${platformClass}">
        <i data-lucide="${getPlatformIconName(cleanPlatform)}" style="width: 11px; height: 11px;"></i>
        <span>${cleanPlatform}</span>
      </div>
      ${footerRow}
    `;

    // Bind Resume Draft click
    const resumeBtn = card.querySelector('.btn-hub-resume');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => resumeDraft(ad));
    }

    // Bind Delete Draft
    const deleteBtn = card.querySelector('.btn-hub-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        adIdToDelete = ad.id;
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.classList.remove('hidden');
        btnDeleteConfirm.onclick = () => {
          ensureDbMode().then(connected => {
            if (connected) {
              return fetch(`${API_BASE_URL}/api/history/${ad.id}`, { method: 'DELETE' }).then(res => res.json());
            } else {
              deleteLocalStorageAd(ad.id);
            }
          }).then(() => {
            showToast("Campaign deleted successfully.", "success");
            if (deleteConfirmModal) deleteConfirmModal.classList.add('hidden');
            loadPublisherHubData();
            loadCampaignStats(false);
          });
        };
      });
    }

    // Bind Cancel Schedule
    const cancelScheduleBtn = card.querySelector('.btn-hub-cancel-schedule');
    if (cancelScheduleBtn) {
      cancelScheduleBtn.addEventListener('click', () => {
        updateCampaignStatus(ad.id, 'draft', null).then(() => {
          showToast("Schedule cancelled. Campaign reverted to drafts.", "info");
          loadPublisherHubData();
        });
      });
    }

    // Bind Publish Now from Scheduled
    const publishNowBtn = card.querySelector('.btn-hub-publish-now');
    if (publishNowBtn) {
      publishNowBtn.addEventListener('click', () => {
        updateCampaignStatus(ad.id, 'publishing', null).then(updatedAd => {
          showToast("Initializing publishing sequence...", "info");
          loadPublisherHubData();
          startQueueSimulation(updatedAd);
        });
      });
    }

    return card;
  }

  function getPlatformIconName(platform) {
    if (platform === 'Facebook') return 'facebook';
    if (platform === 'Instagram') return 'instagram';
    if (platform === 'Google Ads') return 'search';
    if (platform === 'LinkedIn') return 'linkedin';
    return 'globe';
  }

  // Update Status in DB or LocalStorage
  function updateCampaignStatus(id, newStatus, scheduledTime = null) {
    return ensureDbMode().then(connected => {
      if (connected) {
        return fetch(`${API_BASE_URL}/api/history/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, scheduled_time: scheduledTime })
        }).then(res => res.json());
      } else {
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
      }
    });
  }

  // Resume Draft details
  function resumeDraft(ad) {
    businessNameInput.value = ad.business_name;
    industryTypeInput.value = ad.industry_type;
    productNameInput.value = ad.product_name;
    targetAudienceInput.value = ad.target_audience;
    campaignGoalInput.value = ad.campaign_goal;
    ctaPreferenceInput.value = ad.cta;

    // Platform selection
    const platformRadio = document.querySelector(`input[name="ad-platform"][value="${ad.ad_platform}"]`);
    if (platformRadio) platformRadio.checked = true;

    // Tone selection
    const toneRadio = document.querySelector(`input[name="ad-tone"][value="${ad.ad_tone}"]`);
    if (toneRadio) toneRadio.checked = true;

    // Load selected image
    selectedImageUrl = ad.selected_image_url;
    
    // Switch views to Generator
    document.getElementById('btn-nav-generator').click();
    
    // Fast generation
    simulateAIGeneration(false);
    showToast("Resumed draft campaign!", "success");
  }

  // Simulate progress bar publishing ticks
  function startQueueSimulation(ad, startPct = 0) {
    if (activeSimulationIntervals[ad.id]) return;

    let pct = startPct;
    const statusMessages = [
      { max: 25, msg: "Verifying campaign policy..." },
      { max: 50, msg: "Optimizing bid strategies..." },
      { max: 75, msg: "Uploading creative media assets..." },
      { max: 100, msg: "Deploying campaign to channels..." }
    ];

    const timer = setInterval(() => {
      pct += Math.floor(Math.random() * 10) + 5; // increment
      if (pct >= 100) {
        pct = 100;
        clearInterval(timer);
        delete activeSimulationIntervals[ad.id];

        // Update UI
        const badge = document.getElementById(`queue-badge-${ad.id}`);
        const statusText = document.getElementById(`queue-status-text-${ad.id}`);
        const pctText = document.getElementById(`queue-pct-text-${ad.id}`);
        const fillBar = document.getElementById(`queue-progress-fill-${ad.id}`);

        if (badge) {
          badge.textContent = "Active";
          badge.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
          badge.style.color = "#10b981";
        }
        if (statusText) statusText.textContent = "Campaign Deployed";
        if (pctText) pctText.textContent = "100%";
        if (fillBar) fillBar.style.width = "100%";

        updateCampaignStatus(ad.id, 'published', null).then(() => {
          showToast(`Campaign published live to ${ad.ad_platform}!`, "success");
          loadCampaignStats(false);
        });
      } else {
        // Find message
        let activeMsg = "Publishing...";
        for (let s of statusMessages) {
          if (pct <= s.max) {
            activeMsg = s.msg;
            break;
          }
        }

        // Update UI
        const statusText = document.getElementById(`queue-status-text-${ad.id}`);
        const pctText = document.getElementById(`queue-pct-text-${ad.id}`);
        const fillBar = document.getElementById(`queue-progress-fill-${ad.id}`);

        if (statusText) statusText.textContent = activeMsg;
        if (pctText) pctText.textContent = `${pct}%`;
        if (fillBar) fillBar.style.width = `${pct}%`;
      }
    }, 1200);

    activeSimulationIntervals[ad.id] = timer;
  }

  // Initialize mockup image loaders
  setupPreviewImageLoaders();
});
