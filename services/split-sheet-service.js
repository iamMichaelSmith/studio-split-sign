class SplitSheetValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "SplitSheetValidationError";
    this.statusCode = 400;
    this.details = details;
  }
}

function pickArray(input, key) {
  if (!input || typeof input !== "object") return [];
  const value = input[key];
  if (Array.isArray(value)) return value;
  return [value].filter((item) => item !== undefined && item !== null);
}

function toBooleanFlag(value) {
  if (value === true) return true;
  const normalized = String(value || "").trim().toLowerCase();
  return ["yes", "true", "1", "on"].includes(normalized);
}

function normalizeNumber(value) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount : 0;
}

function normalizeRightsScope(value) {
  const normalized = String(value || "composition").trim().toLowerCase();
  if (["composition", "master", "composition-and-master"].includes(normalized)) return normalized;
  return "composition";
}

function includesCompositionRights(rightsScope) {
  return rightsScope === "composition" || rightsScope === "composition-and-master";
}

function includesMasterRights(rightsScope) {
  return rightsScope === "master" || rightsScope === "composition-and-master";
}

function normalizeContributor(raw = {}) {
  return {
    legalName: String(raw.legalName || "").trim(),
    role: String(raw.role || "").trim(),
    address: String(raw.address || "").trim(),
    phone: String(raw.phone || "").trim(),
    email: String(raw.email || "").trim(),
    pro: String(raw.pro || "").trim(),
    ipi: String(raw.ipi || "").trim(),
    publisherName: String(raw.publisherName || "").trim(),
    publisherIpi: String(raw.publisherIpi || "").trim(),
    writerShare: normalizeNumber(raw.writerShare),
    publisherShare: normalizeNumber(raw.publisherShare),
    masterShare: normalizeNumber(raw.masterShare),
    typedSignatureName: String(raw.typedSignatureName || "").trim(),
    signatureData: String(raw.signatureData || "").trim()
  };
}

function parseContributorArrayInput(input) {
  if (Array.isArray(input?.contributors)) {
    return input.contributors.map(normalizeContributor).filter(contributorHasIdentity);
  }

  if (typeof input?.contributors === "string") {
    try {
      const parsed = JSON.parse(input.contributors);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeContributor).filter(contributorHasIdentity);
      }
    } catch {}
  }

  return null;
}

function parseFlatContributorInput(input) {
  const names = pickArray(input, "legalName");
  const roles = pickArray(input, "role");
  const addresses = pickArray(input, "address");
  const phones = pickArray(input, "phone");
  const emails = pickArray(input, "email");
  const pros = pickArray(input, "pro");
  const ipis = pickArray(input, "ipi");
  const publisherNames = pickArray(input, "publisherName");
  const publisherIpis = pickArray(input, "publisherIpi");
  const writerShares = pickArray(input, "writerShare");
  const publisherShares = pickArray(input, "publisherShare");
  const masterShares = pickArray(input, "masterShare");
  const typedNames = pickArray(input, "typedSignatureName");
  const signatureData = pickArray(input, "signatureData");

  const count = Math.max(
    names.length,
    roles.length,
    addresses.length,
    phones.length,
    emails.length,
    pros.length,
    ipis.length,
    publisherNames.length,
    publisherIpis.length,
    writerShares.length,
    publisherShares.length,
    masterShares.length,
    typedNames.length,
    signatureData.length
  );

  return Array.from({ length: count }, (_, index) => normalizeContributor({
    legalName: names[index],
    role: roles[index],
    address: addresses[index],
    phone: phones[index],
    email: emails[index],
    pro: pros[index],
    ipi: ipis[index],
    publisherName: publisherNames[index],
    publisherIpi: publisherIpis[index],
    writerShare: writerShares[index],
    publisherShare: publisherShares[index],
    masterShare: masterShares[index],
    typedSignatureName: typedNames[index],
    signatureData: signatureData[index]
  })).filter(contributorHasIdentity);
}

function contributorHasIdentity(contributor) {
  return Boolean(contributor?.legalName || contributor?.email);
}

function hasEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function parseContributors(input) {
  const contributorArray = parseContributorArrayInput(input);
  if (contributorArray) return contributorArray;
  return parseFlatContributorInput(input);
}

function splitTotals(contributors = []) {
  return contributors.reduce((totals, contributor) => {
    totals.writer += normalizeNumber(contributor.writerShare);
    totals.publisher += normalizeNumber(contributor.publisherShare);
    totals.master += normalizeNumber(contributor.masterShare);
    return totals;
  }, { writer: 0, publisher: 0, master: 0 });
}

function normalizeRecipientEmails(value) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item || "").split(/[;,]/))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return String(value || "")
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function buildSplitSheetPayload(input, { nextVersion, createSignerToken, signerLinkExpiresAt, nowIso }) {
  const contributors = parseContributors(input);
  const totals = splitTotals(contributors);
  const collectByInvite = toBooleanFlag(input.collectSignaturesByInvite);
  const rightsScope = normalizeRightsScope(input.rightsScope);
  const recipientEmails = normalizeRecipientEmails(input.recipientEmails);

  if (!String(input.songTitle || "").trim()) {
    throw new SplitSheetValidationError("Song title is required.", { field: "songTitle" });
  }

  if (contributors.length < 2) {
    throw new SplitSheetValidationError("At least 2 contributors are required for a valid split sheet.", { field: "contributors" });
  }

  const hasMissingBasicFields = contributors.some((contributor) => {
    if (collectByInvite) return !hasEmail(contributor.email);
    return !contributor.legalName || !contributor.role || !hasEmail(contributor.email);
  });
  if (hasMissingBasicFields) {
    throw new SplitSheetValidationError(
      collectByInvite
        ? "Each invited contributor must include a valid email address."
        : "Each contributor must include legal name, role, and email.",
      { field: "contributors" }
    );
  }

  if (!collectByInvite) {
    const hasMissingLegalFields = contributors.some((contributor) =>
      !contributor.typedSignatureName ||
      !String(contributor.signatureData || "").startsWith("data:image/")
    );
    if (hasMissingLegalFields) {
      throw new SplitSheetValidationError("Each contributor must include typed signature name and drawn signature unless invite flow is enabled.", { field: "contributors" });
    }
  }

  const compositionTotalsValid = !includesCompositionRights(rightsScope) || (
    Math.round(totals.writer * 100) / 100 === 100 &&
    Math.round(totals.publisher * 100) / 100 === 100
  );
  const masterTotalValid = !includesMasterRights(rightsScope) || Math.round(totals.master * 100) / 100 === 100;
  if (!compositionTotalsValid || !masterTotalValid) {
    throw new SplitSheetValidationError(`Shares invalid for ${rightsScope}. Required ownership totals must equal 100.`, {
      field: "contributors",
      totals,
      rightsScope
    });
  }

  if (!toBooleanFlag(input.allPartiesAgree)) {
    throw new SplitSheetValidationError("All parties agreement confirmation is required.", { field: "allPartiesAgree" });
  }

  const payload = {
    songTitle: String(input.songTitle || "").trim(),
    alternateTitle: String(input.alternateTitle || "").trim(),
    iswc: String(input.iswc || "").trim(),
    isrc: String(input.isrc || "").trim(),
    date: String(input.date || "").trim(),
    sessionLocation: String(input.sessionLocation || "").trim(),
    notes: String(input.notes || "").trim(),
    rightsScope,
    supersedesPrevious: toBooleanFlag(input.supersedesPrevious),
    initiatorConfirmedProposedSplits: true,
    allPartiesAgree: !collectByInvite,
    collectSignaturesByInvite: collectByInvite,
    recipientEmails,
    completedAt: collectByInvite ? null : nowIso(),
    auditTrail: [{ type: "proposal-created", at: nowIso() }],
    version: await nextVersion(input.songTitle),
    contributors: contributors.map((contributor) => ({
      ...contributor,
      signerToken: collectByInvite ? createSignerToken() : null,
      signerTokenExpiresAt: collectByInvite ? (typeof signerLinkExpiresAt === "function" ? signerLinkExpiresAt() : null) : null,
      inviteSentAt: null,
      inviteEmailStatus: collectByInvite ? "pending" : "not-required",
      inviteEmailReason: null,
      inviteCount: 0,
      reminderSentAt: null,
      reminderCount: 0,
      viewedAt: null,
      agreementAcceptedAt: collectByInvite ? null : nowIso(),
      agreementVersion: "remote-split-v1",
      signedAt: collectByInvite ? null : nowIso()
    }))
  };

  return {
    payload,
    contributors: payload.contributors,
    totals,
    collectByInvite,
    recipientEmails
  };
}

async function buildSplitSheetDraftPayload(input, { nextVersion, existingPayload = {} }) {
  const contributors = parseContributors(input);
  const songTitle = String(input.songTitle ?? existingPayload.songTitle ?? "").trim();
  const version = Number(
    input.version ??
    existingPayload.version ??
    (songTitle ? await nextVersion(songTitle) : 1)
  ) || 1;

  return {
    songTitle,
    alternateTitle: String(input.alternateTitle ?? existingPayload.alternateTitle ?? "").trim(),
    iswc: String(input.iswc ?? existingPayload.iswc ?? "").trim(),
    isrc: String(input.isrc ?? existingPayload.isrc ?? "").trim(),
    date: String(input.date ?? existingPayload.date ?? "").trim(),
    sessionLocation: String(input.sessionLocation ?? existingPayload.sessionLocation ?? "").trim(),
    notes: String(input.notes ?? existingPayload.notes ?? "").trim(),
    rightsScope: normalizeRightsScope(input.rightsScope ?? existingPayload.rightsScope),
    supersedesPrevious: toBooleanFlag(input.supersedesPrevious ?? existingPayload.supersedesPrevious),
    allPartiesAgree: toBooleanFlag(input.allPartiesAgree ?? existingPayload.allPartiesAgree),
    collectSignaturesByInvite: toBooleanFlag(input.collectSignaturesByInvite ?? existingPayload.collectSignaturesByInvite),
    version,
    contributors
  };
}

function summarizeSplitSheet(doc, baseUrl) {
  const contributors = doc?.payload?.contributors || [];
  const signedCount = contributors.filter((contributor) => contributor.signedAt).length;
  const viewedCount = contributors.filter((contributor) => contributor.viewedAt).length;

  return {
    id: doc.id,
    type: doc.type,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    songTitle: doc.payload?.songTitle || "",
    version: Number(doc.payload?.version || 1),
    rightsScope: normalizeRightsScope(doc.payload?.rightsScope),
    collectSignaturesByInvite: Boolean(doc.payload?.collectSignaturesByInvite),
    allPartiesAgree: Boolean(doc.payload?.allPartiesAgree),
    completedAt: doc.payload?.completedAt || null,
    delivery: doc.payload?.completionEmailDelivery || null,
    signers: contributors.map((contributor, index) => ({
      index: index + 1,
      legalName: contributor.legalName || "",
      role: contributor.role || "",
      inviteEmailStatus: contributor.inviteEmailStatus || "unknown",
      inviteCount: Number(contributor.inviteCount || 0),
      reminderCount: Number(contributor.reminderCount || 0),
      signerTokenExpiresAt: contributor.signerTokenExpiresAt || null,
      viewedAt: contributor.viewedAt || null,
      agreementAcceptedAt: contributor.agreementAcceptedAt || null,
      signedAt: contributor.signedAt || null
    })),
    signerStats: {
      total: contributors.length,
      signed: signedCount,
      viewed: viewedCount,
      pending: Math.max(0, contributors.length - signedCount)
    },
    pdfUrl: `${baseUrl}/split-sheet/pdf/${doc.id}`
  };
}

function detailSplitSheet(doc, baseUrl) {
  return {
    ...summarizeSplitSheet(doc, baseUrl),
    ownerUserId: doc.ownerUserId || null,
    ownerEmail: doc.ownerEmail || null,
    payload: doc.payload || {}
  };
}

module.exports = {
  SplitSheetValidationError,
  buildSplitSheetPayload,
  buildSplitSheetDraftPayload,
  detailSplitSheet,
  includesCompositionRights,
  includesMasterRights,
  normalizeRightsScope,
  parseContributors,
  splitTotals,
  summarizeSplitSheet
};
