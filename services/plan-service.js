const PLAN_DEFINITIONS = {
  free: {
    key: "free",
    name: "Free",
    monthlySheetLimit: 3,
    monthlyPriceUsdCents: 0,
    stripePriceEnv: "",
    priceLabel: "$0",
    description: "Starter access for testing the workflow."
  },
  creator: {
    key: "creator",
    name: "Creator",
    monthlySheetLimit: 25,
    monthlyPriceUsdCents: 500,
    stripePriceEnv: "STRIPE_CREATOR_PRICE_ID",
    priceLabel: "$5/mo",
    description: "For artists, producers, and songwriters using split sheets regularly."
  },
  studio_pro: {
    key: "studio_pro",
    name: "Studio Pro",
    monthlySheetLimit: 250,
    monthlyPriceUsdCents: 2000,
    stripePriceEnv: "STRIPE_STUDIO_PRO_PRICE_ID",
    priceLabel: "$20/mo",
    description: "For studios, engineers, managers, and high-volume sessions."
  }
};

function normalizePlanKey(value) {
  const key = String(value || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  return PLAN_DEFINITIONS[key] ? key : "free";
}

function planForUser(user = {}) {
  return PLAN_DEFINITIONS[normalizePlanKey(user.planKey)] || PLAN_DEFINITIONS.free;
}

function currentUsageWindow(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0));
  return {
    start: start.toISOString(),
    end: end.toISOString(),
    label: start.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
  };
}

function isBillableSplitSheet(doc) {
  return doc?.type === "split-sheet" && String(doc.status || "").toLowerCase() !== "draft";
}

function isInUsageWindow(doc, window) {
  const createdAt = Date.parse(doc?.createdAt || "");
  const start = Date.parse(window.start);
  const end = Date.parse(window.end);
  return Number.isFinite(createdAt) && createdAt >= start && createdAt < end;
}

function buildUsageSummary(user, splitSheets = [], now = new Date()) {
  const plan = planForUser(user);
  const window = currentUsageWindow(now);
  const used = splitSheets.filter((doc) => isBillableSplitSheet(doc) && isInUsageWindow(doc, window)).length;
  const limit = Number(plan.monthlySheetLimit);
  return {
    plan,
    window,
    used,
    limit,
    remaining: Math.max(0, limit - used),
    percentUsed: limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0,
    canCreate: used < limit
  };
}

module.exports = {
  PLAN_DEFINITIONS,
  buildUsageSummary,
  currentUsageWindow,
  normalizePlanKey,
  planForUser
};
