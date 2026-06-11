const Presentation = require('pptxgenjs');
const path = require('path');

let pptx = new Presentation();
pptx.layout = 'LAYOUT_16x9';

// Define Color Scheme (Hex)
const COLORS = {
  bgMain: 'FFFFFF',      // Pure White for clean corporate look
  primary: '1E3A8A',     // Corporate Navy Blue (Blue 900)
  secondary: '3B82F6',   // Medium Blue (Blue 500)
  accent: 'EA580C',      // Brand Orange (Orange 600)
  textMain: '1E293B',    // Slate 800 (Charcoal)
  textMuted: '475569',   // Slate 600 (Muted)
  border: 'CBD5E1',      // Slate 300 (Divider)
  lightBlue: 'F8FAFC',   // Light Slate 50 for client box
  lightOrange: 'FFF7ED', // Orange 50 for server box
  lightGreen: 'F0FDF4',  // Green 50 for database box
  success: '16A34A'      // Green 600
};

const FONT_TITLE = 'Segoe UI';
const FONT_BODY = 'Arial';

function applyBackground(slide) {
  slide.background = { color: COLORS.bgMain };
}

function addHeader(slide, title, subtitle) {
  // Top Accent bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: '100%', h: 0.08,
    fill: { color: COLORS.primary }
  });
  
  // Clean thin line divider
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 1.1, w: 8.8, h: 0.015,
    fill: { color: COLORS.border }
  });
  
  // Title
  slide.addText(title, {
    x: 0.6, y: 0.3, w: 8.8, h: 0.45,
    fontFace: FONT_TITLE,
    fontSize: 22,
    bold: true,
    color: COLORS.primary,
    fit: 'shrink'
  });
  
  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 0.75, w: 8.8, h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 12,
      color: COLORS.textMuted,
      fit: 'shrink'
    });
  }
}

function addFooter(slide, slideNum) {
  // Footer text
  slide.addText("BizLeap Technologies | AI Copywriter & Publisher Project Review", {
    x: 0.6, y: 5.15, w: 7.0, h: 0.3,
    fontFace: FONT_BODY,
    fontSize: 8.5,
    color: COLORS.textMuted,
    fit: 'shrink'
  });
  
  // Slide Number
  slide.addText(String(slideNum), {
    x: 9.0, y: 5.15, w: 0.6, h: 0.3,
    fontFace: FONT_BODY,
    fontSize: 8.5,
    align: 'right',
    color: COLORS.textMuted,
    fit: 'shrink'
  });
}

// ====================================================
// SLIDE 1: Title Slide (Internship Presentation Layout)
// ====================================================
const slide1 = pptx.addSlide();
applyBackground(slide1);

// Visual Accents (Top/Left bar)
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 0.6, y: 1.5, w: 0.08, h: 2.8,
  fill: { color: COLORS.primary }
});
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8, y: 1.5, w: 0.08, h: 2.8,
  fill: { color: COLORS.accent }
});

slide1.addText("BIZLEAP TECHNOLOGIES | INTERNSHIP PROJECT REVIEW", {
  x: 1.1, y: 1.4, w: 8.0, h: 0.3,
  fontFace: FONT_BODY,
  fontSize: 11,
  bold: true,
  color: COLORS.accent,
  fit: 'shrink'
});

slide1.addText("AI Ad Copy Generator\n& Simulated Publisher Hub", {
  x: 1.1, y: 1.8, w: 8.0, h: 1.4,
  fontFace: FONT_TITLE,
  fontSize: 32,
  bold: true,
  color: COLORS.primary,
  fit: 'shrink'
});

slide1.addText("Technical Project Presentation for Internship Review", {
  x: 1.1, y: 3.3, w: 8.0, h: 0.3,
  fontFace: FONT_BODY,
  fontSize: 14,
  bold: true,
  color: COLORS.textMain,
  fit: 'shrink'
});

slide1.addText("Presenter: Vaishnavi Nande\nRole: Software Engineering Intern", {
  x: 1.1, y: 3.7, w: 8.0, h: 0.6,
  fontFace: FONT_BODY,
  fontSize: 11,
  color: COLORS.textMuted,
  fit: 'shrink'
});

addFooter(slide1, 1);
slide1.addNotes("Good morning, members of the review panel. Today, I am presenting my internship project, the AI Ad Copy Generator and simulated Publisher Hub. This project was developed as a technical solution to bridge the gap between creative marketing copy generation and real-time ad previews across major social platforms, backed by a simulated ad publishing queue and local persistence.");

// ====================================================
// SLIDE 2: System Architecture Diagram
// ====================================================
const slide2 = pptx.addSlide();
applyBackground(slide2);
addHeader(slide2, "System Architecture Diagram", "Client-server architecture showing end-to-end data transmission");

// Flow components layout
const archSteps = [
  { text: "User\nInputs Form", type: "client", x: 0.6, w: 0.9 },
  { text: "Frontend\n(HTML, CSS, JS)", type: "client", x: 1.75, w: 1.1 },
  { text: "Express.js\nBackend", type: "server", x: 3.1, w: 1.1 },
  { text: "API Layer\n(Endpoints)", type: "server", x: 4.45, w: 1.1 },
  { text: "JSON DB\n(db.json)", type: "db", x: 5.8, w: 1.1 },
  { text: "Response\nPayload", type: "client", x: 7.15, w: 1.0 },
  { text: "UI Preview\n(Mockups)", type: "client", x: 8.4, w: 1.0 }
];

const archArrows = [
  { x: 1.5 }, { x: 2.85 }, { x: 4.2 }, { x: 5.55 }, { x: 6.9 }, { x: 8.15 }
];

// Draw Boxes
archSteps.forEach(step => {
  let fillColor = COLORS.lightBlue;
  let borderColor = COLORS.secondary;
  let textColor = COLORS.primary;

  if (step.type === "server") {
    fillColor = COLORS.lightOrange;
    borderColor = COLORS.accent;
    textColor = COLORS.accent;
  } else if (step.type === "db") {
    fillColor = COLORS.lightGreen;
    borderColor = COLORS.success;
    textColor = COLORS.success;
  }

  slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: step.x, y: 1.6, w: step.w, h: 1.1,
    fill: { color: fillColor },
    line: { color: borderColor, width: 1.5 },
    rectRadius: 0.05
  });

  slide2.addText(step.text, {
    x: step.x, y: 1.6, w: step.w, h: 1.1,
    fontFace: FONT_BODY,
    fontSize: 9.5,
    bold: true,
    color: textColor,
    align: 'center',
    valign: 'middle',
    fit: 'shrink'
  });
});

// Draw Arrows
archArrows.forEach(arrow => {
  slide2.addShape(pptx.shapes.RIGHT_ARROW, {
    x: arrow.x, y: 2.05, w: 0.25, h: 0.2,
    fill: { color: COLORS.border }
  });
});

// Explain the flow below the diagram
slide2.addText(
  "• User Initiated Form: Captures business details, goals, audience, platform, and tone in UI.\n" +
  "• Client-to-Server Fetch: Dispatches asynchronous GET and POST payloads to specific REST backend routes.\n" +
  "• Backend Route Processing: Express.js acts as an API controller, processing request arguments.\n" +
  "• JSON Database Persistence: Express utilizes Node's 'fs' library to write data documents securely to db.json.\n" +
  "• Response Flow & Preview: Returns structured ad copy object to render authentic platform previews in real time.",
  {
    x: 0.6, y: 2.9, w: 8.8, h: 2.1,
    fontFace: FONT_BODY,
    fontSize: 11,
    color: COLORS.textMain,
    fit: 'shrink'
  }
);

addFooter(slide2, 2);
slide2.addNotes("This slide showcases the complete System Architecture of the project. The system utilizes a Client-Server design. The client-side frontend consists of HTML5, CSS3, and JavaScript which renders the interactive inputs and social feed previews. The Express.js backend handles routing and acts as the API Layer. For persistence, it reads and writes to a local JSON database (db.json) via the Node.js file system API. The response data is then propagated back to render the UI mockups.");

// ====================================================
// SLIDE 3: Technologies Used
// ====================================================
const slide3 = pptx.addSlide();
applyBackground(slide3);
addHeader(slide3, "Technologies Used", "Segmented layer-by-layer technical stack breakdown");

// Col 1: Frontend
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.6, y: 1.4, w: 2.0, h: 3.4,
  fill: { color: COLORS.lightBlue },
  line: { color: COLORS.secondary, width: 1.5 },
  rectRadius: 0.05
});
slide3.addText("FRONTEND", {
  x: 0.7, y: 1.5, w: 1.8, h: 0.3,
  fontFace: FONT_TITLE, fontSize: 13, bold: true, color: COLORS.primary,
  fit: 'shrink'
});
slide3.addText(
  "• HTML5\n" +
  "  Provides semantic DOM structure.\n\n" +
  "• CSS3\n" +
  "  Handles responsive design & dark mode.\n\n" +
  "• JavaScript\n" +
  "  Runs DOM logic & client event handling.",
  { x: 0.7, y: 1.9, w: 1.8, h: 2.8, fontFace: FONT_BODY, fontSize: 10, color: COLORS.textMain, fit: 'shrink' }
);

// Col 2: Backend
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 2.8, y: 1.4, w: 2.0, h: 3.4,
  fill: { color: COLORS.lightOrange },
  line: { color: COLORS.accent, width: 1.5 },
  rectRadius: 0.05
});
slide3.addText("BACKEND", {
  x: 2.9, y: 1.5, w: 1.8, h: 0.3,
  fontFace: FONT_TITLE, fontSize: 13, bold: true, color: COLORS.accent,
  fit: 'shrink'
});
slide3.addText(
  "• Node.js\n" +
  "  JavaScript runtime execution engine.\n\n" +
  "• Express.js\n" +
  "  Lightweight REST routing server.",
  { x: 2.9, y: 1.9, w: 1.8, h: 2.8, fontFace: FONT_BODY, fontSize: 10, color: COLORS.textMain, fit: 'shrink' }
);

// Col 3: Database
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 5.0, y: 1.4, w: 2.0, h: 3.4,
  fill: { color: COLORS.lightGreen },
  line: { color: COLORS.success, width: 1.5 },
  rectRadius: 0.05
});
slide3.addText("DATABASE", {
  x: 5.1, y: 1.5, w: 1.8, h: 0.3,
  fontFace: FONT_TITLE, fontSize: 13, bold: true, color: COLORS.success,
  fit: 'shrink'
});
slide3.addText(
  "• db.json\n" +
  "  Flat JSON document store.\n\n" +
  "• File System (fs)\n" +
  "  Native Node module for reading and writing database records.",
  { x: 5.1, y: 1.9, w: 1.8, h: 2.8, fontFace: FONT_BODY, fontSize: 10, color: COLORS.textMain, fit: 'shrink' }
);

// Col 4: Libraries
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.2, y: 1.4, w: 2.2, h: 3.4,
  fill: { color: COLORS.lightBlue },
  line: { color: COLORS.border, width: 1.5 },
  rectRadius: 0.05
});
slide3.addText("LIBRARIES", {
  x: 7.3, y: 1.5, w: 2.0, h: 0.3,
  fontFace: FONT_TITLE, fontSize: 13, bold: true, color: COLORS.textMuted,
  fit: 'shrink'
});
slide3.addText(
  "• CORS\n" +
  "  Enables secure cross-origin API calls.\n\n" +
  "• Lucide Icons\n" +
  "  Dynamic UI vector graphic icons.\n\n" +
  "• Google Fonts\n" +
  "  Polished modern typography.\n\n" +
  "• Fetch API\n" +
  "  Asynchronous HTTP queries.",
  { x: 7.3, y: 1.9, w: 2.0, h: 2.8, fontFace: FONT_BODY, fontSize: 9.5, color: COLORS.textMain, fit: 'shrink' }
);

addFooter(slide3, 3);
slide3.addNotes("In this slide, we outline the comprehensive technology stack categorized into four layers. The Frontend uses HTML5 for structure, CSS3 for styling and responsive grids, and vanilla JavaScript for state management. The Backend utilizes Node.js and Express.js to host lightweight RESTful routes. The Database uses db.json for document storage and the fs module for filesystem persistence. Key libraries include CORS, Lucide Icons, Google Fonts, and the Fetch API.");

// ====================================================
// SLIDE 4: Project File Structure
// ====================================================
const slide4 = pptx.addSlide();
applyBackground(slide4);
addHeader(slide4, "Project File Structure", "Roles and purpose of individual application files");

// Left Column
slide4.addText(
  "• index.html\n" +
  "  The primary UI container. Renders form inputs, preview templates, publishing queue timeline, and performance stats dashboard.\n\n" +
  "• style.css\n" +
  "  Contains style rules, custom CSS grid/flex parameters, clean layout spacings, and responsive dark-mode styles.\n\n" +
  "• script.js\n" +
  "  Manages all client-side event logic. Handles active mockup switching, fetches API data, caches Places photos, and manages PDF/PNG file compiling.\n\n" +
  "• server.js\n" +
  "  The backend node app. Sets up Express middleware, implements CORS rules, defines REST routing endpoints, and proxies Google Places queries.",
  { x: 0.6, y: 1.4, w: 4.2, h: 3.5, fontFace: FONT_BODY, fontSize: 10.5, color: COLORS.textMain, fit: 'shrink' }
);

// Right Column
slide4.addText(
  "• db.json\n" +
  "  The local database. Maintains records of saved ad campaigns, active scheduling parameters, and performance tracking KPIs.\n\n" +
  "• business_image_cache.json\n" +
  "  The local storefront image cache. Resolves business name queries to crawled photos, reducing API request counts.\n\n" +
  "• package.json\n" +
  "  Project metadata and dependency tracking file, mapping Express, CORS, and script configurations.\n\n" +
  "• package-lock.json\n" +
  "  Automated lock file locking specific package version installs, ensuring reproducible server runs.",
  { x: 5.2, y: 1.4, w: 4.2, h: 3.5, fontFace: FONT_BODY, fontSize: 10.5, color: COLORS.textMain, fit: 'shrink' }
);

addFooter(slide4, 4);
slide4.addNotes("This slide describes the project directory structure. We have a clear separation of concerns. index.html defines the layout, while style.css contains the styling tokens. script.js manages all client-side logic, and server.js acts as the Express backend. Persistence is maintained in db.json and cached storefront images are stored in business_image_cache.json. package.json holds the metadata and server dependencies.");

// ====================================================
// SLIDE 5: API Endpoints & Request-Response Flow
// ====================================================
const slide5 = pptx.addSlide();
applyBackground(slide5);
addHeader(slide5, "API Endpoints & Request-Response Flow", "Exposing core REST endpoints to query and compute campaign structures");

// Left Column: Endpoint specs
slide5.addText("CORE REST API ENDPOINTS", {
  x: 0.6, y: 1.4, w: 4.2, h: 0.3,
  fontFace: FONT_TITLE, fontSize: 13, bold: true, color: COLORS.primary,
  fit: 'shrink'
});
slide5.addText(
  "• GET /api/history\n" +
  "  - Purpose: Fetches list of all saved campaign records.\n" +
  "  - Query Flow: Reads db.json, parses the campaign list, and returns them sorted chronologically.\n\n" +
  "• GET /api/campaign-stats\n" +
  "  - Purpose: Pulls aggregated advertising performance stats.\n" +
  "  - Computation: Excludes drafts and scheduled items, summing up impressions, spend, clicks, and average CTR.",
  { x: 0.6, y: 1.8, w: 4.2, h: 3.1, fontFace: FONT_BODY, fontSize: 11, color: COLORS.textMain, fit: 'shrink' }
);

// Right Column: Request-Response Flow
slide5.addText("REQUEST-RESPONSE LIFECYCLE", {
  x: 5.2, y: 1.4, w: 4.2, h: 0.3,
  fontFace: FONT_TITLE, fontSize: 13, bold: true, color: COLORS.accent,
  fit: 'shrink'
});
slide5.addText(
  "1. Fetch Call: Client initiates an async HTTP Fetch call to server.js.\n\n" +
  "2. Express Processing: Express routes incoming requests, verifies CORS, and checks filesystem permissions.\n\n" +
  "3. Disk Sync: The Node file system library reads/writes data to the local db.json schema file.\n\n" +
  "4. JSON Payload: The server compiles the output data and responds with a JSON payload to update the dashboard UI.",
  { x: 5.2, y: 1.8, w: 4.2, h: 3.1, fontFace: FONT_BODY, fontSize: 11, color: COLORS.textMain, fit: 'shrink' }
);

addFooter(slide5, 5);
slide5.addNotes("Here, we detail the core API endpoints of our Express backend. GET /api/history retrieves the historical feed of saved campaigns sorted by time. GET /api/campaign-stats calculates key advertising performance indicators like Spend and CTR from active campaigns, filtering out drafts. The request-response flow uses standard Fetch calls from script.js which the Express controller resolves by reading db.json and returning clean JSON payloads.");

// ====================================================
// SLIDE 6: Workflow Diagram
// ====================================================
const slide6 = pptx.addSlide();
applyBackground(slide6);
addHeader(slide6, "Campaign Workflow Diagram", "Sequenced processing pipeline of ad creation and export");

// Workflow 3x3 Grid
const steps = [
  { num: "01", title: "Inputs Details", text: "User fills company details, audience, goals.", type: "client", x: 0.6, y: 1.4 },
  { num: "02", title: "Generate Request", text: "Triggers request payload creation in UI.", type: "client", x: 3.6, y: 1.4 },
  { num: "03", title: "JS Validation", text: "Verifies form fields and length bounds.", type: "client", x: 6.6, y: 1.4 },

  { num: "04", title: "Express API", text: "Receives parameters and processes routes.", type: "server", x: 0.6, y: 2.6 },
  { num: "05", title: "DB Read/Write", text: "Performs fs actions to update db.json file.", type: "db", x: 3.6, y: 2.6 },
  { num: "06", title: "Generate Content", text: "Compiles headlines, copy, and CTAs.", type: "server", x: 6.6, y: 2.6 },

  { num: "07", title: "Store History", text: "Saves new document in database list.", type: "db", x: 0.6, y: 3.8 },
  { num: "08", title: "Platform Preview", text: "Updates active social feed mockup frames.", type: "client", x: 3.6, y: 3.8 },
  { num: "09", title: "Export/Download", text: "Allows client PDF briefs and PNG mockup downloads.", type: "client", x: 6.6, y: 3.8 }
];

steps.forEach(step => {
  let fillColor = COLORS.lightBlue;
  let borderColor = COLORS.secondary;
  let numColor = COLORS.secondary;

  if (step.type === "server") {
    fillColor = COLORS.lightOrange;
    borderColor = COLORS.accent;
    numColor = COLORS.accent;
  } else if (step.type === "db") {
    fillColor = COLORS.lightGreen;
    borderColor = COLORS.success;
    numColor = COLORS.success;
  }

  slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: step.x, y: step.y, w: 2.8, h: 0.9,
    fill: { color: fillColor },
    line: { color: borderColor, width: 1 },
    rectRadius: 0.05
  });

  // Number badge
  slide6.addText(step.num, {
    x: step.x + 0.1, y: step.y + 0.05, w: 0.4, h: 0.25,
    fontFace: FONT_TITLE, fontSize: 12, bold: true, color: numColor,
    fit: 'shrink'
  });

  // Title
  slide6.addText(step.title, {
    x: step.x + 0.5, y: step.y + 0.05, w: 2.2, h: 0.25,
    fontFace: FONT_TITLE, fontSize: 11, bold: true, color: COLORS.textMain,
    fit: 'shrink'
  });

  // Desc
  slide6.addText(step.text, {
    x: step.x + 0.1, y: step.y + 0.35, w: 2.6, h: 0.5,
    fontFace: FONT_BODY, fontSize: 9.5, color: COLORS.textMuted,
    fit: 'shrink'
  });
});

// Horizontal Arrows
const wflowArrows = [
  { x: 3.45, y: 1.75 }, { x: 6.45, y: 1.75 },
  { x: 3.45, y: 2.95 }, { x: 6.45, y: 2.95 },
  { x: 3.45, y: 4.15 }, { x: 6.45, y: 4.15 }
];

wflowArrows.forEach(arrow => {
  slide6.addShape(pptx.shapes.RIGHT_ARROW, {
    x: arrow.x, y: arrow.y, w: 0.12, h: 0.15,
    fill: { color: COLORS.border }
  });
});

addFooter(slide6, 6);
slide6.addNotes("This flowchart visualizes the complete end-to-end user and system workflow. It begins with the user entering campaign parameters in the UI. Next, JavaScript validates the fields before dispatching a Fetch call. The Express API receives the request, writes the new campaign record to the JSON database, and triggers ad copywriting template matrices. Finally, the campaign is stored, loaded in the history feed, rendered in the real-time social previews, and becomes exportable as PNG or PDF.");

// ====================================================
// SLIDE 7: Database Design (Campaign Object Schema)
// ====================================================
const slide7 = pptx.addSlide();
applyBackground(slide7);
addHeader(slide7, "Database Design & Schema", "Structured JSON document design representing generated ad campaigns");

// JSON Code Block
slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.6, y: 1.4, w: 4.0, h: 3.5,
  fill: { color: '1E293B' }, // Dark slate
  line: { color: COLORS.border, width: 1.5 },
  rectRadius: 0.05
});

const jsonRuns = [
  { text: "{\n", options: { color: 'FFFFFF' } },
  { text: "  \"businessName\": ", options: { color: 'A5B4FC' } }, { text: "\"Zudio Store\",\n", options: { color: 'FDBA74' } },
  { text: "  \"product\": ", options: { color: 'A5B4FC' } }, { text: "\"Casual Wear\",\n", options: { color: 'FDBA74' } },
  { text: "  \"audience\": ", options: { color: 'A5B4FC' } }, { text: "\"College Students\",\n", options: { color: 'FDBA74' } },
  { text: "  \"goal\": ", options: { color: 'A5B4FC' } }, { text: "\"Brand Awareness\",\n", options: { color: 'FDBA74' } },
  { text: "  \"platform\": ", options: { color: 'A5B4FC' } }, { text: "\"Instagram\",\n", options: { color: 'FDBA74' } },
  { text: "  \"tone\": ", options: { color: 'A5B4FC' } }, { text: "\"Promotional\",\n", options: { color: 'FDBA74' } },
  { text: "  \"headline\": ", options: { color: 'A5B4FC' } }, { text: "\"Fresh Style, Bold Looks\",\n", options: { color: 'FDBA74' } },
  { text: "  \"description\": ", options: { color: 'A5B4FC' } }, { text: "\"Upgrade your style...\",\n", options: { color: 'FDBA74' } },
  { text: "  \"cta\": ", options: { color: 'A5B4FC' } }, { text: "\"Shop Now\",\n", options: { color: 'FDBA74' } },
  { text: "  \"imageUrl\": ", options: { color: 'A5B4FC' } }, { text: "\"https://unsplash...\",\n", options: { color: 'FDBA74' } },
  { text: "  \"timestamp\": ", options: { color: 'A5B4FC' } }, { text: "\"2026-06-10T11:05:00Z\"\n", options: { color: 'FDBA74' } },
  { text: "}", options: { color: 'FFFFFF' } }
];

slide7.addText(jsonRuns, {
  x: 0.7, y: 1.5, w: 3.8, h: 3.3,
  fontFace: 'Courier New',
  fontSize: 9.5,
  fit: 'shrink'
});

// Schema Specs List (Right Column)
slide7.addText("CAMPAIGN SCHEMA ATTRIBUTES", {
  x: 4.8, y: 1.4, w: 4.6, h: 0.3,
  fontFace: FONT_TITLE, fontSize: 13, bold: true, color: COLORS.primary,
  fit: 'shrink'
});

slide7.addText(
  "• Campaign Context: Business Name, Product Name, Target Audience, and Goal determine core ad framing.\n\n" +
  "• Mockup Layout Keys: Headline, Description, and CTA text map directly to standard platform layout fields.\n\n" +
  "• Platform & Tone Rules: Control character lengths, text formatting rules, and visual style.\n\n" +
  "• Asset & Log Metadata: Stores Google Places/Unsplash Image URL references alongside creation Timestamps.\n\n" +
  "• Analytics Counters: Tracks simulated performance scores (Spend, CTR, Clicks) dynamically on publication.",
  { x: 4.8, y: 1.8, w: 4.6, h: 3.1, fontFace: FONT_BODY, fontSize: 10.5, color: COLORS.textMain, fit: 'shrink' }
);

addFooter(slide7, 7);
slide7.addNotes("This slide explains the Campaign Object structure in our JSON database. On the left is a code-editor mockup of a campaign document, illustrating keys like businessName, target audience, goal, tone, platform, generated copy fields (headline, description, cta), image URL, and creation timestamp. The right column outlines how validation limits and data types are mapped for consistency and database integrity.");

// ====================================================
// SLIDE 8: Libraries & Resources Used
// ====================================================
const slide8 = pptx.addSlide();
applyBackground(slide8);
addHeader(slide8, "Libraries & Resources Used", "Overview of critical external modules and packages used");

const librariesList = [
  { title: "CORS", text: "Enables secure cross-origin resource sharing, permitting the frontend client to query the Node server.", x: 0.6, y: 1.4 },
  { title: "Lucide Icons", text: "Delivers crisp, scalable vector SVG icon badges for interactive buttons and status tracking.", x: 3.6, y: 1.4 },
  { title: "Google Fonts", text: "Integrates Inter and Outfit web typography styles directly into UI elements for a modern feel.", x: 6.6, y: 1.4 },
  
  { title: "Fetch API", text: "Native async browser API used to send requests and fetch campaign records from REST endpoints.", x: 0.6, y: 3.2 },
  { title: "html2canvas", text: "Compiles DOM nodes into canvas buffers, letting users download high-res PNG mockups.", x: 3.6, y: 3.2 },
  { title: "jsPDF", text: "Converts text and canvas screenshots into downloadable multi-page campaign PDF briefings.", x: 6.6, y: 3.2 }
];

librariesList.forEach(lib => {
  slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: lib.x, y: lib.y, w: 2.8, h: 1.5,
    fill: { color: COLORS.lightBlue },
    line: { color: COLORS.border, width: 1.5 },
    rectRadius: 0.05
  });

  slide8.addText(lib.title, {
    x: lib.x + 0.15, y: lib.y + 0.1, w: 2.5, h: 0.25,
    fontFace: FONT_TITLE, fontSize: 12, bold: true, color: COLORS.primary,
    fit: 'shrink'
  });

  slide8.addText(lib.text, {
    x: lib.x + 0.15, y: lib.y + 0.45, w: 2.5, h: 0.95,
    fontFace: FONT_BODY, fontSize: 10, color: COLORS.textMain,
    fit: 'shrink'
  });
});

addFooter(slide8, 8);
slide8.addNotes("Here is a detailed breakdown of the libraries and external resources used. CORS allows client-server communication during local development. Lucide Icons and Google Fonts provide vector icons and premium typography. Fetch API handles async REST requests. html2canvas renders the preview container to standard PNG graphics, and jsPDF compiles marketing data sheets and image embeds directly in the browser.");

// ====================================================
// SLIDE 9: Challenges and Solutions
// ====================================================
const slide9 = pptx.addSlide();
applyBackground(slide9);
addHeader(slide9, "Challenges & Technical Solutions", "Overcoming core obstacles in browser canvas security and platform validation");

const challengesList = [
  {
    num: "CHALLENGE 1",
    title: "CORS Canvas Tainting",
    desc: "Fetching Unsplash or Google Places photos directly in html2canvas caused CORS security issues, blocking mockup PNG exports.",
    sol: "Solution: Set up a backend Express image proxy route that fetches image binary buffers and pipes them as safe Base64 URLs.",
    x: 0.6,
    fill: COLORS.lightBlue,
    border: COLORS.secondary
  },
  {
    num: "CHALLENGE 2",
    title: "Character Limit Variances",
    desc: "Facebook, Google Ads, and LinkedIn have strict character bounds (e.g. 30-char Google headers). Copy overflowing limits broke layouts.",
    sol: "Solution: Designed client validation logic that trims strings and highlights overflow dynamically per social layout grid.",
    x: 3.6,
    fill: COLORS.lightOrange,
    border: COLORS.accent
  },
  {
    num: "CHALLENGE 3",
    title: "Offline Sync Failover",
    desc: "Intermittent connection drops to server.js interrupted copy editing and review flows on local development.",
    sol: "Solution: Constructed a failsafe localStorage layer caching campaigns locally and syncs back when database recovers.",
    x: 6.6,
    fill: COLORS.lightGreen,
    border: COLORS.success
  }
];

challengesList.forEach(item => {
  const boxY = 1.4;

  // Container Box
  slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: item.x, y: boxY, w: 2.8, h: 3.4,
    fill: { color: item.fill },
    line: { color: item.border, width: 1.5 },
    rectRadius: 0.05
  });

  // Challenge Number Label
  slide9.addText(item.num, {
    x: item.x + 0.15, y: boxY + 0.1, w: 2.5, h: 0.25,
    fontFace: FONT_TITLE, fontSize: 10, bold: true, color: COLORS.textMuted,
    fit: 'shrink'
  });

  // Challenge Title
  slide9.addText(item.title, {
    x: item.x + 0.15, y: boxY + 0.35, w: 2.5, h: 0.3,
    fontFace: FONT_TITLE, fontSize: 13, bold: true, color: COLORS.primary,
    fit: 'shrink'
  });

  // Problem Description
  slide9.addText(item.desc, {
    x: item.x + 0.15, y: boxY + 0.75, w: 2.5, h: 1.1,
    fontFace: FONT_BODY, fontSize: 9.5, color: COLORS.textMain,
    fit: 'shrink'
  });

  // Solution Description
  slide9.addText(item.sol, {
    x: item.x + 0.15, y: boxY + 1.95, w: 2.5, h: 1.3,
    fontFace: FONT_BODY, fontSize: 10, bold: true, color: COLORS.success,
    fit: 'shrink'
  });
});

addFooter(slide9, 9);
slide9.addNotes("During development, we overcame three major technical challenges. First, CORS paint errors in html2canvas were resolved by implementing a backend proxy that converts image URLs into base64 strings. Second, differences in platform character lengths were solved by developing client-side input validation matrices. Third, potential connection failures were mitigated by creating a LocalStorage fallback that auto-syncs when the database server is back online.");

// ====================================================
// SLIDE 10: Future Enhancements
// ====================================================
const slide10 = pptx.addSlide();
applyBackground(slide10);

// Visual Accents (Top/Left bar)
slide10.addShape(pptx.shapes.RECTANGLE, {
  x: 0.6, y: 1.5, w: 0.08, h: 2.8,
  fill: { color: COLORS.primary }
});
slide10.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8, y: 1.5, w: 0.08, h: 2.8,
  fill: { color: COLORS.accent }
});

slide10.addText("PROJECT ROADMAP", {
  x: 1.1, y: 1.4, w: 8.0, h: 0.3,
  fontFace: FONT_BODY,
  fontSize: 11,
  bold: true,
  color: COLORS.accent,
  fit: 'shrink'
});

slide10.addText("Strategic Production Upgrades", {
  x: 1.1, y: 1.8, w: 8.0, h: 0.45,
  fontFace: FONT_TITLE,
  fontSize: 22,
  bold: true,
  color: COLORS.primary,
  fit: 'shrink'
});

slide10.addText(
  "• Database Migration: Move from local flat file db.json to a managed Supabase PostgreSQL instance to enable user accounts, session handling, and scale.\n\n" +
  "• Generative AI API: Integrate official Gemini Pro API routes on the Express backend, replacing template matrices with real-time semantic copy generation.\n\n" +
  "• OAuth 2.0 logins: Introduce secure Google, Microsoft, and Meta OAuth sign-in workflows to support custom user workspaces and multi-tenant profiles.\n\n" +
  "• Active Publishing Webhooks: Link drafts to Google Ads API and Facebook Marketing Graph API for true automated publishing straight from the UI.",
  { x: 1.1, y: 2.4, w: 8.0, h: 2.5, fontFace: FONT_BODY, fontSize: 11, color: COLORS.textMain, fit: 'shrink' }
);

addFooter(slide10, 10);
slide10.addNotes("Finally, we present the roadmap for future enhancements. This includes migrating to Supabase PostgreSQL for multi-user collaboration and secure scaling, integrating the live Gemini Pro API to produce dynamic generative ad copy, implementing OAuth 2.0 logins, and connecting direct advertising API webhooks to actually publish final drafts directly to Meta and Google Campaign Managers.");

// Save the Presentation
pptx.writeFile({ fileName: 'ad_copy_generator_presentation.pptx', compression: true })
  .then(fileName => {
    console.log(`Successfully compiled PowerPoint: ${fileName}`);
  })
  .catch(err => {
    console.warn(`Original file locked: ${err.message}. Saving as fallback instead.`);
    pptx.writeFile({ fileName: 'ad_copy_generator_presentation_fixed.pptx', compression: true })
      .then(fileName => {
        console.log(`Successfully compiled PowerPoint fallback: ${fileName}`);
      })
      .catch(err => {
        console.warn(`Fallback file locked: ${err.message}. Saving as timestamped fallback...`);
        const timestamp = Date.now();
        const uniqueName = `ad_copy_generator_presentation_${timestamp}.pptx`;
        pptx.writeFile({ fileName: uniqueName, compression: true })
          .then(fileName => {
            console.log(`Successfully compiled PowerPoint timestamped fallback: ${fileName}`);
          })
          .catch(err => {
            console.error(`Error saving timestamped presentation:`, err);
          });
      });
  });
