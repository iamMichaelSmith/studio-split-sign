const assert = require('node:assert/strict');
const { test } = require('node:test');
const { listPosts, getPostBySlug } = require('../content/blog-posts');
const { startApp } = require('./helpers/isolated-app.cjs');

test('blog pages retain working routes, navigation, and truthful date metadata', async () => {
  const app = await startApp();
  try {
    const posts = listPosts();
    assert.equal(new Set(posts.map((post) => post.slug)).size, posts.length, 'slugs must be unique');
    for (const post of posts) {
      const response = await fetch(`${app.baseUrl}/blog/${post.slug}`);
      assert.equal(response.status, 200, post.slug);
      const html = await response.text();
      if (post.slug === 'how-to-rescan-plugins-in-your-daw') {
        assert.ok(html.includes(String.raw`<code>C:\Program Files\Common Files\VST3</code>`), 'Windows installation path must preserve its backslashes');
      }
      assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${post.slug}: one H1`);
      const schema = JSON.parse(html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1]);
      const article = schema['@graph'].find((entry) => entry['@type'] === 'BlogPosting');
      assert.equal(article.datePublished, post.publishedAt);
      assert.equal(article.dateModified, post.updatedAt || post.publishedAt);
      if (post.author) {
        assert.equal(article.author['@type'], 'Person');
        assert.equal(article.author.name, post.author.name);
        assert.equal(article.author.jobTitle, post.author.jobTitle);
        assert.equal(article.author.worksFor.name, post.author.organization);
        assert.ok(html.includes(`By ${post.author.name} | ${post.author.jobTitle} at ${post.author.organization}`), `${post.slug}: byline must match author metadata`);
      } else {
        assert.equal(article.author['@type'], 'Organization');
        assert.ok(html.includes('By Split Sheet Studio'), `${post.slug}: default authorship changed`);
      }
      assert.ok(article.dateModified >= article.datePublished, `${post.slug}: modification predates publication`);
      assert.ok(html.includes(`<link rel="canonical" href="${article.mainEntityOfPage}">`));
      const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
      assert.equal(new Set(ids).size, ids.length, `${post.slug}: duplicate HTML ids`);
      for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) {
        assert.ok(ids.includes(anchor), `${post.slug}: missing anchor ${anchor}`);
      }
      for (const [, slug] of html.matchAll(/href="\/blog\/([^"#?]+)"/g)) {
        assert.ok(getPostBySlug(slug), `${post.slug}: broken article link ${slug}`);
      }
      for (const [, slug, fragment] of html.matchAll(/href="\/blog\/([^"#?]+)#([^"]+)"/g)) {
        const target = getPostBySlug(slug);
        assert.ok(target?.bodyHtml.includes(`id="${fragment}"`), `${post.slug}: broken article jump ${slug}#${fragment}`);
      }
      for (const [, resource] of html.matchAll(/href="(\/resources\/[^"]+)"/g)) {
        const resourceResponse = await fetch(`${app.baseUrl}${resource}`);
        assert.equal(resourceResponse.status, 200, `${post.slug}: missing reader resource ${resource}`);
      }
      if (post.showFieldGuide === false) {
        assert.ok(!html.includes('id="practical-field-guide"'), `${post.slug}: omitted guide still rendered`);
        assert.ok(!html.includes('class="blog-plugin-cta"'), `${post.slug}: repeated plugin promotion`);
        assert.ok(html.includes('id="related-reading-title"'));
        assert.ok(html.includes(`datetime="${post.updatedAt}"`));
        assert.equal((html.match(/class="journal-cta"/g) || []).length, 1);
      } else {
        assert.ok(html.includes('class="blog-plugin-cta"'), `${post.slug}: legacy layout lost its default`);
      }
    }
    assert.equal((await fetch(`${app.baseUrl}/blog/does-not-exist-editorial-check`)).status, 404);
    const checklist = await fetch(`${app.baseUrl}/resources/session-closeout-checklist.html`);
    assert.equal(checklist.status, 200);
    const checklistHtml = await checklist.text();
    assert.ok(checklistHtml.includes('noindex,follow'));
    const stylesheet = await fetch(`${app.baseUrl}/resources/session-closeout-checklist.css`);
    assert.equal(stylesheet.status, 200);
    assert.ok((await stylesheet.text()).includes('@media print'));
    const csv = await fetch(`${app.baseUrl}/resources/sync-metadata-example.csv`);
    assert.equal(csv.status, 200);
    assert.match(csv.headers.get('content-type'), /text\/csv/);
    assert.ok((await csv.text()).includes('Fictional teaching example only'));
    const catalog = await fetch(`${app.baseUrl}/resources/sync-catalog-starter.csv`);
    assert.equal(catalog.status, 200);
    assert.match(catalog.headers.get('content-type'), /text\/csv/);
    assert.ok((await catalog.text()).includes('DEMO-WORK-01'));
    const intake = await fetch(`${app.baseUrl}/resources/studio-intake-questions.txt`);
    assert.equal(intake.status, 200);
    assert.match(intake.headers.get('content-type'), /text\/plain/);
    assert.ok((await intake.text()).includes('Person authorized to approve overtime'));
    console.log(`Verified ${posts.length} blog routes, article links and fragments, metadata, and four reader resources.`);
  } finally {
    await app.stop();
  }
});
