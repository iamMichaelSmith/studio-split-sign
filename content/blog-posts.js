const blogPosts = [
  {
    slug: "what-is-a-split-sheet-in-music",
    title: "What Is a Split Sheet in Music?",
    excerpt: "A practical guide for producers, writers, artists, and managers who need to lock ownership before a session turns into an email chase.",
    category: "Split Sheets",
    publishedAt: "2026-07-15",
    seoTitle: "What Is a Split Sheet in Music? | SplitSheet Studio",
    metaDescription: "Learn what a split sheet is, why music creators need one, and how to lock writer and publisher percentages before rights disputes slow a release.",
    bodyHtml: `
      <p>A split sheet is the working record that captures who contributed to a song and what percentage of the composition each contributor owns.</p>
      <p>In real studio rooms, the issue is not theory. The issue is speed. Sessions end, people leave, and the paperwork gets pushed to later. Later is when confusion starts.</p>
      <p>At minimum, a usable split sheet should capture legal names, contributor roles, contact details, writer share, publisher share, and signatures. If writer and publisher totals do not resolve cleanly to 100%, the record is not ready.</p>
      <p>That is the operational problem SplitSheet Studio is built to solve: turn session closeout into a fast, enforceable, trackable workflow instead of a loose conversation.</p>
    `
  },
  {
    slug: "how-producers-can-collect-songwriting-splits-faster",
    title: "How Producers Can Collect Songwriting Splits Faster",
    excerpt: "A session-first workflow for producers who want less paperwork drag and fewer release-week rights disputes.",
    category: "Workflow",
    publishedAt: "2026-07-15",
    seoTitle: "How Producers Can Collect Songwriting Splits Faster | SplitSheet Studio",
    metaDescription: "See how producers can collect songwriting splits faster, reduce admin drag, and keep records clean for releases, metadata, and sync opportunities.",
    bodyHtml: `
      <p>Producers usually become the default traffic manager once the room starts moving. That means they also inherit the paperwork problem.</p>
      <p>The fastest way to collect splits is to keep the workflow inside the session while the facts are still fresh: title, contributors, roles, percentages, signatures, and recipient delivery.</p>
      <p>If the room is not ready to sign on the spot, the next-best path is invite-based completion with a clear audit trail. The critical point is to avoid losing the structured record.</p>
      <p>For releases, publishing admin, and sync licensing, clean split documentation is not optional. It is a dependency.</p>
    `
  },
  {
    slug: "why-clean-split-data-matters-for-sync-licensing",
    title: "Why Clean Split Data Matters for Sync Licensing",
    excerpt: "If you want fast clearance, fewer chain-of-title questions, and better licensing readiness, your split data has to be clean.",
    category: "Sync Licensing",
    publishedAt: "2026-07-15",
    seoTitle: "Why Clean Split Data Matters for Sync Licensing | SplitSheet Studio",
    metaDescription: "Understand why clean split data matters for sync licensing, chain-of-title clarity, and fast rights clearance for music supervisors and licensors.",
    bodyHtml: `
      <p>Sync does not slow down because the song is bad. It slows down because the rights picture is messy.</p>
      <p>Music supervisors, licensors, and clearance teams need clear ownership, accurate contacts, and confidence that the parties attached to the song agree on the record.</p>
      <p>When split records are missing, inconsistent, or disputed, opportunities stall. That costs time and can kill placements outright.</p>
      <p>Clean split data does not guarantee a placement, but messy split data can absolutely block one. That is why session capture matters long before the pitch ever happens.</p>
    `
  }
];

function withReadingMeta(post) {
  const plainText = String(post.bodyHtml || "").replace(/<[^>]+>/g, " ");
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  return {
    ...post,
    wordCount,
    readingMinutes: Math.max(1, Math.ceil(wordCount / 200))
  };
}

function listPosts() {
  return [...blogPosts]
    .map(withReadingMeta)
    .sort((left, right) => String(right.publishedAt).localeCompare(String(left.publishedAt)));
}

function getPostBySlug(slug) {
  const post = blogPosts.find((item) => item.slug === slug);
  return post ? withReadingMeta(post) : null;
}

module.exports = {
  listPosts,
  getPostBySlug
};
