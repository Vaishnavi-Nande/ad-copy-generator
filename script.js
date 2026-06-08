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
                  updateResultsUI(results, platform, bizName);
                  if (withLoader) {
                    saveAdToDatabase(params, results);
                  }
                  showToast("High-converting copy generated successfully!", "success");
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

  // Update Preview Layout Inputs
  function updatePlatformMockupText(results, platform, bizName) {
    // Hide all platform containers
    updatePreviewPlatformVisibility(platform);

    if (platform === 'Facebook') {
      document.getElementById('fb-mock-biz-name').textContent = bizName || 'BizLeap Client';
      document.getElementById('fb-mock-body').textContent = results.body;
      document.getElementById('fb-mock-headline').textContent = results.headline;
      document.getElementById('fb-mock-cta').textContent = results.cta;
      document.getElementById('fb-mock-img-text').textContent = `${bizName} Ad Graphic`;
    } 
    
    else if (platform === 'Instagram') {
      document.getElementById('ig-mock-biz-name').textContent = formatInstagramUsername(bizName);
      document.getElementById('ig-mock-caption-name').textContent = formatInstagramUsername(bizName);
      document.getElementById('ig-mock-body').textContent = results.body;
      document.getElementById('ig-mock-headline').textContent = results.headline;
      document.getElementById('ig-mock-cta').textContent = results.cta;
      document.getElementById('ig-mock-img-text').textContent = `${bizName} Creative Grid`;
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
      document.getElementById('li-mock-img-text').textContent = `${bizName} B2B Creative Asset`;
      document.getElementById('li-mock-biz-domain').textContent = `${formatDomainName(bizName)}.in`;
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

  function saveAdToDatabase(params, results) {
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
      cta: results.cta
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
      console.log("Successfully saved ad:", savedAd);
      // Refresh backend datasets silently in the background
      loadHistoryData(false); 
      loadCampaignStats(false);
    })
    .catch(err => {
      console.error("Database save error:", err);
      showToast("Generated successfully but failed to save to database.", "error");
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
          // Reload history data and stats in the background
          loadHistoryData(false);
          loadCampaignStats(false);
        })
        .catch(err => {
          console.error("Delete failed:", err);
          showToast("Failed to delete history item.", "error");
          if (deleteConfirmModal) deleteConfirmModal.classList.add('hidden');
          adIdToDelete = null;
        });
    });
  }

  function loadCampaignStats(showLoading = true) {
    const statsTableBody = document.getElementById('stats-table-body');
    if (!statsTableBody) return;

    if (showLoading) {
      statsTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 30px;"><div class="quantum-spinner" style="margin: 0 auto;"></div></td></tr>';
    }

    fetch(`${API_BASE_URL}/api/campaign-stats`)
      .then(response => {
        if (!response.ok) throw new Error("Could not fetch stats.");
        return response.json();
      })
      .then(data => {
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
  }

  // Pre-load data in background
  loadHistoryData(false);
  loadCampaignStats(false);

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
});
