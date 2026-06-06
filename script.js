/**
 * BizLeap Technologies - AI Ad Copy Generator
 * Application Logic & Presets Engine
 */

document.addEventListener('DOMContentLoaded', () => {
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

  // --- Navigation Aesthetic Handling ---
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.id === 'btn-nav-generator') return; // stay active
      
      showToast(`Feature coming soon in full production release!`, 'info');
    });
  });

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
