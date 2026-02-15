const rawPromptEl = document.getElementById("rawPrompt");
const enhancedPromptEl = document.getElementById("enhancedPrompt");
const projectTypeEl = document.getElementById("projectType");
const industryEl = document.getElementById("industry");
const audienceEl = document.getElementById("audience");
const toneEl = document.getElementById("tone");
const goalsEl = document.getElementById("goals");
const mustHaveEl = document.getElementById("mustHave");
const constraintsEl = document.getElementById("constraints");
const enhanceBtn = document.getElementById("enhanceBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

const INDUSTRY_MAP = [
  { pattern: /financ|bank|invest|fintech|account|insurance/i, name: "Finance" },
  { pattern: /health|clinic|medical|hospital|doctor/i, name: "Healthcare" },
  { pattern: /saas|software|b2b/i, name: "SaaS" },
  { pattern: /e-?commerce|shop|store|product catalog/i, name: "E-commerce" },
  { pattern: /educat|school|university|course/i, name: "Education" },
  { pattern: /real estate|property|realtor/i, name: "Real Estate" }
];

const PLACEHOLDER_TEXT = "Your professional prompt will appear here.";

function detectIndustry(text) {
  const found = INDUSTRY_MAP.find((entry) => entry.pattern.test(text));
  return found ? found.name : "General Business";
}

function splitList(text) {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function defaultGoals(industry) {
  if (industry === "Finance") {
    return [
      "Build trust and credibility with institutional and retail audiences.",
      "Improve discoverability and accessibility of financial reports.",
      "Increase high-quality inbound inquiries from target clients."
    ];
  }

  return [
    "Communicate value proposition clearly to target users.",
    "Improve conversion from visitors to qualified leads.",
    "Provide a scalable content structure for future growth."
  ];
}

function baselineFeatures(industry) {
  if (industry === "Finance") {
    return [
      "Report library with filters for period, category, and document type.",
      "KPI dashboard panels with trend visualization.",
      "Secure access controls for restricted documents and user roles.",
      "Regulatory/compliance-ready legal and privacy sections.",
      "Lead capture flow with qualification form and CRM handoff."
    ];
  }

  return [
    "Clear information architecture with intuitive navigation.",
    "High-clarity service/product sections with conversion-focused CTAs.",
    "Validated contact form with thank-you and follow-up flow.",
    "Search-engine-ready page structure and metadata.",
    "Reusable content blocks to support future scale."
  ];
}

function createProfessionalPrompt(formData) {
  const cleanedRequest = formData.rawPrompt.trim().replace(/\s+/g, " ");
  const selectedIndustry =
    formData.industry === "Auto" ? detectIndustry(cleanedRequest) : formData.industry;
  const projectType = formData.projectType;
  const audience = formData.audience || "Decision-makers, evaluators, and operational users";
  const goals = formData.goals ? [formData.goals] : defaultGoals(selectedIndustry);
  const requiredFeatures = [
    ...splitList(formData.mustHave),
    ...baselineFeatures(selectedIndustry)
  ];
  const dedupedFeatures = [...new Set(requiredFeatures)];
  const constraints = formData.constraints || "No explicit constraints provided.";

  return [
    "Role and Responsibility:",
    "Act as a senior digital consultant and solution architect. Convert the following business request into a complete execution brief with precise scope, requirements, and delivery outputs.",
    "",
    "Project Context:",
    `- Project Type: ${projectType}`,
    `- Industry: ${selectedIndustry}`,
    `- Target Audience: ${audience}`,
    `- Source Request: "${cleanedRequest}"`,
    "",
    "Business Objectives:",
    ...goals.map((goal, index) => `${index + 1}. ${goal}`),
    "",
    "Mandatory Scope of Work:",
    "1. Executive Summary",
    "   - Problem statement",
    "   - Strategic positioning",
    "   - Measurable success outcomes",
    "",
    "2. Information Architecture",
    "   - Full sitemap",
    "   - Purpose of each page/section",
    "   - Primary and secondary user flows",
    "",
    "3. Functional Requirements",
    ...dedupedFeatures.map((item, index) => `   ${index + 1}. ${item}`),
    "",
    "4. Non-Functional Requirements",
    "   - Responsive behavior across mobile, tablet, and desktop breakpoints.",
    "   - Accessibility standard aligned to WCAG 2.2 AA.",
    "   - Performance target: Lighthouse 90+ for performance, accessibility, and best practices.",
    "   - SEO fundamentals: metadata, semantic structure, internal linking, and index-ready pages.",
    "   - Analytics plan: define event tracking for critical conversion actions.",
    "",
    "5. Content and UX Direction",
    `   - Tone: ${formData.tone}`,
    "   - Message hierarchy for above-the-fold and conversion sections.",
    "   - Trust-building elements (proof points, credentials, testimonials, case evidence).",
    "   - CTA strategy for top, mid, and bottom funnel actions.",
    "",
    "6. Technical Recommendation",
    "   - Suggested stack and rationale.",
    "   - CMS/content workflow recommendation if applicable.",
    "   - Security and privacy considerations relevant to the industry.",
    "",
    "Constraints and Notes:",
    `- ${constraints}`,
    "",
    "Required Output Format:",
    "Provide the response using these exact sections:",
    "1) Strategic Brief",
    "2) Detailed Requirements Matrix",
    "3) Proposed Site/Page Blueprint",
    "4) Feature Specifications",
    "5) Content Outline and Messaging Framework",
    "6) Technical Implementation Plan",
    "7) QA and Launch Checklist",
    "8) Assumptions and Open Questions",
    "",
    "Quality Standard:",
    "Use precise business language, avoid generic filler, and make each requirement testable or reviewable."
  ].join("\n");
}

enhanceBtn.addEventListener("click", () => {
  if (!rawPromptEl.value.trim()) {
    enhancedPromptEl.textContent = "Please enter a rough prompt first.";
    return;
  }

  const formData = {
    rawPrompt: rawPromptEl.value,
    projectType: projectTypeEl.value,
    industry: industryEl.value,
    audience: audienceEl.value.trim(),
    tone: toneEl.value,
    goals: goalsEl.value.trim(),
    mustHave: mustHaveEl.value.trim(),
    constraints: constraintsEl.value.trim()
  };

  const result = createProfessionalPrompt(formData);
  enhancedPromptEl.textContent = result;
});

clearBtn.addEventListener("click", () => {
  rawPromptEl.value = "";
  projectTypeEl.value = "Website";
  industryEl.value = "Auto";
  audienceEl.value = "";
  toneEl.value = "Executive and concise";
  goalsEl.value = "";
  mustHaveEl.value = "";
  constraintsEl.value = "";
  enhancedPromptEl.textContent = PLACEHOLDER_TEXT;
  rawPromptEl.focus();
});

copyBtn.addEventListener("click", async () => {
  const text = enhancedPromptEl.textContent.trim();
  if (!text || text === PLACEHOLDER_TEXT) return;

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copied";
    setTimeout(() => {
      copyBtn.textContent = "Copy";
    }, 1400);
  } catch (_err) {
    copyBtn.textContent = "Failed";
    setTimeout(() => {
      copyBtn.textContent = "Copy";
    }, 1400);
  }
});

downloadBtn.addEventListener("click", () => {
  const text = enhancedPromptEl.textContent.trim();
  if (!text || text === PLACEHOLDER_TEXT) return;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "professional-prompt.txt";
  anchor.click();
  URL.revokeObjectURL(url);
});
