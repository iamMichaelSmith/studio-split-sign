const PLAN_DEFINITIONS = {
  free: {
    key: "free",
    name: "Free",
    monthlySheetLimit: 3,
    monthlyPriceUsdCents: 0,
    annualPriceUsdCents: 0,
    stripePriceEnv: "",
    annualStripePriceEnv: "",
    priceLabel: "$0",
    annualPriceLabel: "",
    compareAtPriceLabel: "",
    annualCompareAtPriceLabel: "",
    discountLabel: "",
    description: "Starter access for testing the workflow."
  },
  creator: {
    key: "creator",
    name: "Creator",
    monthlySheetLimit: 25,
    monthlyPriceUsdCents: 700,
    annualPriceUsdCents: 7000,
    stripePriceEnv: "STRIPE_CREATOR_PRICE_ID",
    annualStripePriceEnv: "STRIPE_CREATOR_ANNUAL_PRICE_ID",
    priceLabel: "$7/mo",
    annualPriceLabel: "$70/yr",
    compareAtPriceLabel: "$10/mo",
    annualCompareAtPriceLabel: "$100/yr",
    discountLabel: "Launch deal",
    description: "For artists, producers, and songwriters using split sheets regularly. Includes approved collaborator profiles, the Windows VST3 plugin, and standalone app."
  },
  studio_pro: {
    key: "studio_pro",
    name: "Studio",
    monthlySheetLimit: 150,
    monthlyPriceUsdCents: 1900,
    annualPriceUsdCents: 19000,
    stripePriceEnv: "STRIPE_STUDIO_PRO_PRICE_ID",
    annualStripePriceEnv: "STRIPE_STUDIO_ANNUAL_PRICE_ID",
    priceLabel: "$19/mo",
    annualPriceLabel: "$190/yr",
    compareAtPriceLabel: "$30/mo",
    annualCompareAtPriceLabel: "$300/yr",
    discountLabel: "Launch deal",
    description: "For studios, engineers, managers, and regular session workflows. Includes approved collaborator profiles, the Windows VST3 plugin, and standalone app."
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
