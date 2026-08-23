const sourceLibrary = {
  copyrightMusicians: ["U.S. Copyright Office — What Musicians Should Know about Copyright", "https://www.copyright.gov/engage/musicians/"],
  copyrightRegistration: ["U.S. Copyright Office — Musical Compositions and Sound Recordings", "https://www.copyright.gov/register/pa-sr.html"],
  musicianIncome: ["U.S. Copyright Office — How Songwriters, Composers, and Performers Get Paid", "https://www.copyright.gov/music-modernization/educational-materials/musicians-income.pdf"],
  mlcMember: ["The MLC — Membership for self-administered songwriters and publishers", "https://help.themlc.com/en/support/what-is-a-member"],
  mlcRegistration: ["The MLC — How to register musical works", "https://help.themlc.com/en/support/how-to-register-works-in-the-mlc-portal"],
  sesacPro: ["SESAC — What is a Performing Rights Organization?", "https://www.sesac.com/what-is-a-performing-rights-organization-pro/"],
  sesacFaq: ["SESAC — Music licensing frequently asked questions", "https://www.sesac.com/frequently-asked-questions/"],
  bmiRegistration: ["BMI — Online Works Registration guidance", "https://applications.bmi.com/OWR"],
  cisacIdentifiers: ["CISAC — International music identifiers", "https://www.cisac.org/services/information-services/international-identifiers"],
  isrcOfficial: ["International ISRC Agency — Using ISRC", "https://isrc.ifpi.org/why-use-isrc/using-isrc"],
  copyrightAllianceSync: ["Copyright Alliance — How to get permission to use a song", "https://copyrightalliance.org/faqs/how-to-get-permission-to-use-a-song/"]
};

function renderTableOfContents(sections) {
  return `<nav class="blog-toc" aria-labelledby="table-of-contents-title"><h2 id="table-of-contents-title">Table of contents</h2><ol>${sections.map((section) => `<li><a href="#${section.id}">${section.title}</a></li>`).join("")}<li><a href="#frequently-asked-questions">Frequently asked questions</a></li></ol></nav>`;
}

function renderFaqs(faqs) {
  return `<section class="blog-faq" id="frequently-asked-questions"><h2>Frequently asked questions</h2>${faqs.map((faq) => `<details><summary>${faq.question}</summary><p>${faq.answer}</p></details>`).join("")}</section>`;
}

function renderSources(sourceKeys) {
  return `<aside class="blog-sources" aria-labelledby="article-sources-title"><h2 id="article-sources-title">Authoritative sources</h2><ul>${sourceKeys.map((key) => `<li><a href="${sourceLibrary[key][1]}" rel="noopener noreferrer">${sourceLibrary[key][0]}</a></li>`).join("")}</ul><p>This article is educational and is not legal, tax, or financial advice.</p></aside>`;
}

function createPost(config) {
  return {
    ...config,
    bodyHtml: `<p class="blog-definition"><strong>Quick answer:</strong> ${config.definition}</p><aside class="blog-takeaway"><strong>Session takeaway</strong><span>${config.takeaway}</span></aside>${renderTableOfContents(config.sections)}${config.sections.map((section) => `<section id="${section.id}"><h2>${section.title}</h2>${section.html}</section>`).join("")}${renderFaqs(config.faqs)}${renderSources(config.sources)}`
  };
}

const blogPosts = [
  createPost({
    slug: "what-is-a-split-sheet-in-music",
    title: "What Is a Split Sheet in Music? The Complete Creator Guide",
    excerpt: "Learn what a music split sheet records, when to complete one, which details belong on it, and how it prevents ownership confusion after a session.",
    category: "Split Sheets",
    publishedAt: "2026-08-22",
    seoTitle: "What Is a Split Sheet in Music? Complete 2026 Guide",
    metaDescription: "Learn what a music split sheet is, what it should include, when producers and songwriters should sign it, and why every writing session needs one.",
    primaryKeyword: "music split sheet",
    definition: "A music split sheet is a written record of who helped create a song and the percentage of the underlying composition each songwriter or composer owns.",
    takeaway: "Do not let the session end with only a verbal agreement. Record the legal names, roles, contacts, shares, publisher information, and signatures while everyone remembers the deal.",
    sections: [
      { id: "what-it-records", title: "What a music split sheet records", html: `<p>A split sheet documents ownership of the <em>musical work</em>: the melody, lyrics, and other protectable parts of the composition. It identifies each contributor and the percentage that contributor owns.</p><p>A strong record includes the song title and alternate title, session date and location, legal names, creator roles, emails, performance rights organizations, IPI or CAE numbers, publishers, writer shares, publisher details, signatures, and agreement date.</p>` },
      { id: "why-it-matters", title: "Why producers, artists, and songwriters need one", html: `<p>Memory is not a rights-management system. A song may reach a distributor, publisher, label, manager, or music supervisor months after the session. If ownership was never documented, every downstream task becomes slower.</p><p>A clean split record reduces disputes, supports accurate registration, and gives managers one reliable contact list. Everyone reviews the same percentages instead of relying on different text threads.</p>` },
      { id: "composition-versus-master", title: "Composition splits are not master ownership", html: `<p>A released song commonly contains two copyright-protected works: the musical composition and the sound recording. A split sheet normally covers the composition. The master may have different owners and revenue terms.</p><p>Two writers can own the composition 50/50 while one artist or label owns the master. A producer may receive a songwriting share, master royalty, fee, or combination. Document each right in the correct agreement.</p>` },
      { id: "deciding-splits", title: "How collaborators decide songwriting splits", html: `<p>There is no universal formula that determines a fair split. Collaborators may split equally, divide ownership according to contribution, or negotiate another arrangement. The goal is informed agreement before release pressure begins.</p><ul><li>Discuss contributions to lyrics, melody, harmony, and composition.</li><li>Separate songwriting from featured-artist fees and producer master points.</li><li>Confirm that the composition ownership totals exactly 100%.</li><li>Leave a disputed record unresolved instead of forcing a false final document.</li></ul>` },
      { id: "session-workflow", title: "A five-minute end-of-session workflow", html: `<ol><li>Enter the working title, date, and location.</li><li>Add every contributor using legal names and current emails.</li><li>Enter roles, PROs, publishers, and shares.</li><li>Validate the 100% total.</li><li>Sign in the room or send secure remote signature links.</li><li>Deliver the completed copy to every contributor.</li></ol><p>Split Sheet Studio is designed to keep this closeout inside the recording session, including through its VST3 workflow.</p>` },
      { id: "mistakes", title: "Split sheet mistakes that delay releases", html: `<p>Common failures include missing legal names, percentages that do not total 100%, confusing composition ownership with master ownership, leaving out a producer who contributed to the song, and using old contact information.</p><p>A blank publisher field should trigger a question, not an assumption. Review the record before submission so the data is complete, readable, and accepted by every contributor.</p>` },
      { id: "after-signing", title: "What to do after everyone signs", html: `<p>Store the completed record, send every party a copy, and use the same data when registering the work with PROs, publishers, administrators, and The MLC where applicable. Keep it beside the song metadata, master files, licenses, and release records.</p><p>For collaborators in different locations, use our <a href="/blog/remote-collaboration-split-sheets">remote split-sheet guide</a>.</p>` }
    ],
    faqs: [
      { question: "Is a split sheet a legal contract?", answer: "A signed split sheet can be important evidence of agreed ownership, but it may not cover every term in a full collaboration or publishing agreement. Ask a qualified music attorney about your situation." },
      { question: "When should a split sheet be completed?", answer: "Complete it before everyone leaves the session or immediately after the song is created, while the contributor list and percentages are fresh." },
      { question: "Do producer points belong on a songwriting split sheet?", answer: "Usually not. Songwriting shares concern the composition. Producer points commonly concern master royalties and should be documented separately unless the agreement clearly combines both subjects." },
      { question: "Can a split sheet be signed remotely?", answer: "Yes. A remote workflow can send each contributor a secure link to review the same song data, confirm percentages, and sign from another location." },
      { question: "Do split sheet percentages need to equal 100%?", answer: "Yes. Composition ownership should resolve to a complete 100%. Follow the specific display rules of the organization where the work is later registered." }
    ],
    sources: ["copyrightMusicians", "copyrightRegistration", "bmiRegistration"]
  }),
  createPost({
    slug: "songwriting-splits-writer-share-publisher-share",
    title: "Songwriting Splits Explained: Writer Share, Publisher Share, and 100% Totals",
    excerpt: "A plain-English explanation of writer share, publisher share, self-publishing, PRO registration scales, and why clean totals matter.",
    category: "Publishing",
    publishedAt: "2026-08-21",
    seoTitle: "Songwriting Splits: Writer vs Publisher Share Explained",
    metaDescription: "Understand songwriting splits, writer share, publisher share, self-publishing, and how to make music ownership percentages total 100% correctly.",
    primaryKeyword: "songwriting splits",
    definition: "A songwriting split divides ownership of the composition among its creators. Writer share identifies the creators' portions, while publisher share identifies who administers or receives the publishing side.",
    takeaway: "Agree on one complete ownership picture, then translate it carefully into the share format used by your PRO, publisher, or administrator.",
    sections: [
      { id: "ownership-pie", title: "Start with one composition ownership pie", html: `<p>When collaborators say a song is split 50/50, they usually mean each writer owns half of the composition. That ownership picture should resolve to 100%.</p><p>Confusion starts when creators mix that calculation with a PRO's payment display. Preserve the underlying agreement first, then enter it in the format required by each platform.</p>` },
      { id: "writer-share", title: "What writer share means", html: `<p>Writer share represents the creator side of composition income. A writer's percentage should reflect the agreed ownership of the songwriting contribution. Legal name, professional name, PRO affiliation, and IPI help royalties reach the correct person.</p><p>A performing artist is not automatically a songwriter, and a producer is not automatically excluded. Ownership follows authorship and agreement, not only a job title.</p>` },
      { id: "publisher-share", title: "What publisher share means", html: `<p>Publisher share is connected to administration of the composition. It may be controlled by a music publisher, publishing administrator, a writer's own publishing entity, or the writer as a self-administered creator.</p><p>Ask whether each writer is self-published, represented, or using an administrator. Record the answer consistently across the split sheet and registrations.</p>` },
      { id: "different-scales", title: "Why PRO share scales can look different", html: `<p>Organizations may display shares using different conventions. BMI's registration guidance describes a 200% scale made of 100% writer shares and 100% publisher shares. Other workflows present one 100% composition total.</p><p>Keep a master record of the collaborators' agreement and follow each organization's current instructions when registering.</p>` },
      { id: "self-published", title: "How self-published writers handle publishing", html: `<p>A self-administered songwriter has not assigned administration of the relevant share to an outside publisher or administrator. The MLC allows eligible self-administered writers to become Members and register the works they administer for U.S. digital audio mechanical royalties.</p><p>Self-published does not mean no paperwork. The creator is responsible for accurate registrations, ownership data, and updates.</p>` },
      { id: "conversation", title: "How to lead the split conversation", html: `<ol><li>Name everyone who contributed to the composition.</li><li>Discuss creative contributions while the session is fresh.</li><li>State proposed percentages out loud.</li><li>Separate composition shares from master royalties and fees.</li><li>Confirm the complete ownership total.</li><li>Send the same final record to all parties.</li></ol>` },
      { id: "registration-data", title: "The data to collect before registration", html: `<p>Capture legal names, professional names, roles, PROs, IPI numbers, publishing entities, publisher IPIs, writer percentages, title, alternate title, and contacts. These fields reduce duplicate records and mismatched claims.</p><p>Next, read <a href="/blog/performance-rights-organizations-explained">our PRO guide</a> and <a href="/blog/the-mlc-mechanical-royalties-guide">The MLC guide</a>.</p>` }
    ],
    faqs: [
      { question: "What is a writer share?", answer: "Writer share is the portion of composition income allocated to the songwriter or composer based on that creator's agreed ownership." },
      { question: "What is a publisher share?", answer: "Publisher share is the portion administered or collected by a publisher, administrator, or self-published writer, depending on the agreement and income type." },
      { question: "Can an independent songwriter own the publisher share?", answer: "Yes. A songwriter can be self-administered and retain publishing rights, although registration and collection requirements vary." },
      { question: "Why does BMI show 200%?", answer: "BMI uses a registration scale of 100% writer shares plus 100% publisher shares. That display convention does not create two separate composition ownership pies." },
      { question: "Should collaborators split a song equally?", answer: "They may, but equal splits are a business choice, not an automatic rule. The collaborators should discuss contributions and agree before signing." }
    ],
    sources: ["bmiRegistration", "mlcMember", "mlcRegistration"]
  }),
  createPost({
    slug: "sync-licensing-checklist",
    title: "Sync Licensing Checklist: Make Your Music Easier to Clear",
    excerpt: "Prepare your song for TV, film, advertising, games, trailers, and digital media with a practical rights, metadata, and delivery checklist.",
    category: "Sync Licensing",
    publishedAt: "2026-08-20",
    seoTitle: "Sync Licensing Checklist for Independent Artists & Producers",
    metaDescription: "Use this sync licensing checklist to prepare song splits, master rights, metadata, clean versions, stems, and contacts for music supervisors.",
    primaryKeyword: "sync licensing checklist",
    definition: "Sync licensing allows a composition to be paired with visual media. Using an existing sound recording also requires master-use permission, so a sync-ready song needs clear ownership on both sides.",
    takeaway: "A great song can miss a deadline if nobody can quickly identify and contact every composition and master rights holder.",
    sections: [
      { id: "two-rights", title: "Understand the two rights a placement may need", html: `<p>The composition and sound recording are separate works. A synchronization license addresses use of the composition with visuals. A master-use license addresses use of a particular recording.</p><p>If you control both, document that clearly. If a label, publisher, co-writer, producer, or administrator controls a share, keep accurate approval contacts.</p>` },
      { id: "ownership-checklist", title: "Clear ownership before you pitch", html: `<ul><li>Signed composition splits totaling 100%.</li><li>Current publisher and administrator information.</li><li>Confirmed master owner and authorized contact.</li><li>Written sample and interpolation clearances.</li><li>Agreement on who may approve and quote the use.</li><li>No unresolved contributor disputes.</li></ul><p>Do not call a track one-stop unless one authorized contact can truly clear the relevant rights.</p>` },
      { id: "metadata", title: "Build a supervisor-ready metadata package", html: `<p>Use a consistent title, alternate title, artist, writers, publishers, PROs, IPIs, ISWC when assigned, ISRC, release status, explicit flag, genre, mood, tempo, themes, and contacts.</p><p>Metadata should answer three questions fast: What is this track? Who controls it? How can approval be obtained?</p>` },
      { id: "deliverables", title: "Prepare useful audio deliverables", html: `<p>Keep a high-quality full mix and instrumental ready. Depending on the opportunity, clean versions, vocal-up or vocal-down mixes, stems, cutdowns, and alternate endings can help editors.</p><p>Name files consistently. A music supervisor should not have to guess whether “FINAL_mix_7_REAL.wav” matches the metadata sheet.</p>` },
      { id: "discovery", title: "Write discoverable descriptions without keyword stuffing", html: `<p>Describe genre, mood, energy, instrumentation, lyrical theme, vocal type, and possible scene uses naturally. “Tense cinematic hip-hop instrumental for a sports trailer” is more useful than unrelated trending keywords.</p><p>For AI search and catalog discovery, clear entity-rich descriptions outperform vague hype.</p>` },
      { id: "response", title: "Create a fast clearance response workflow", html: `<ol><li>Designate one lead contact.</li><li>Keep every rights holder's approval channel current.</li><li>Know minimum fees or restricted-use terms.</li><li>Respond with the song, ownership summary, and files together.</li><li>Record the final license and cue-sheet information.</li></ol>` },
      { id: "readiness-test", title: "The 60-second sync readiness test", html: `<p>Can you identify every writer and publisher, state who owns the master, confirm samples are cleared, produce instrumental and clean files, and reach all approval parties within one minute? If not, fix the data before increasing pitch volume.</p><p>Use the <a href="/blog/music-publishing-before-sync-licensing">publishing-before-sync guide</a> to close the gaps.</p>` }
    ],
    faqs: [
      { question: "What does sync licensing mean?", answer: "Sync licensing is permission to pair a musical composition with visual media such as film, television, advertising, games, trailers, or online video." },
      { question: "Do I also need a master use license?", answer: "If a production wants to use a particular sound recording, it generally needs permission for that master in addition to the composition." },
      { question: "What does one-stop mean in sync licensing?", answer: "One-stop commonly means a single authorized party can approve both composition and master rights. Confirm the exact scope before representing a song that way." },
      { question: "Can an uncleared sample block a sync placement?", answer: "Yes. Samples and interpolations can introduce more rights owners and approvals, so disclose and clear them before pitching." },
      { question: "What files should I have ready?", answer: "Keep the full mix, instrumental, clean version, stems when available, lyrics, ownership data, writer and publisher contacts, master contact, and identifiers organized." }
    ],
    sources: ["copyrightMusicians", "copyrightAllianceSync", "sesacFaq"]
  }),
  createPost({
    slug: "performance-rights-organizations-explained",
    title: "PROs Explained: ASCAP, BMI, SESAC, GMR, and Performance Royalties",
    excerpt: "Understand what performance rights organizations do, what they do not collect, and which creator data helps royalties find songwriters and publishers.",
    category: "Royalties",
    publishedAt: "2026-08-19",
    seoTitle: "PROs Explained: ASCAP, BMI, SESAC & GMR Guide",
    metaDescription: "Learn what performance rights organizations do for songwriters and publishers, how performance royalties work, and what creators must register.",
    primaryKeyword: "performance rights organization",
    definition: "A performance rights organization, or PRO, licenses public performances of compositions and distributes performance royalties to the songwriters, composers, and publishers it represents.",
    takeaway: "A PRO is one part of rights administration, not a replacement for copyright registration, mechanical royalty registration, publishing administration, or split agreements.",
    sections: [
      { id: "what-pros-do", title: "What a PRO does", html: `<p>Businesses and platforms publicly perform enormous catalogs. PROs license compositions in their repertoires, collect fees, track or estimate performances under their methodologies, and distribute royalties to represented creators and publishers.</p><p>U.S. creators commonly encounter ASCAP, BMI, SESAC, and GMR. Eligibility, agreements, tools, and payment rules differ, so review each organization's current terms.</p>` },
      { id: "limits", title: "What a PRO does not automatically do", html: `<p>PRO affiliation does not settle ownership among co-writers. It does not replace a split sheet, register a copyright with the U.S. Copyright Office, clear samples, or guarantee that every work is registered accurately.</p><p>It also does not replace systems for mechanical royalties, master royalties, neighboring rights, sync fees, or direct licenses.</p>` },
      { id: "public-performance", title: "What public performance can include", html: `<p>Performance royalties can arise from broadcast, live venues, businesses, and certain digital transmissions, depending on the right, territory, license, and organization. Composition income remains distinct from royalties tied to the recording.</p><p>Do not assume one registration captures every income stream. Map each use to the relevant right and collection path.</p>` },
      { id: "choosing", title: "How songwriters evaluate a PRO", html: `<ul><li>Eligibility and membership model.</li><li>Agreement length, withdrawal terms, and territories.</li><li>Registration and catalog tools.</li><li>Payment schedule and distribution policies.</li><li>Support and international relationships.</li><li>Services for publishers and self-published writers.</li></ul><p>Choose the relationship that fits your catalog and business, not only a famous affiliation.</p>` },
      { id: "registration", title: "How to register works cleanly", html: `<p>Use the same legal names, professional names, titles, alternate titles, IPI numbers, publishers, and shares found in the signed split record. Include every writer and publisher required by the system.</p><p>Duplicate titles, missing co-writers, and conflicting percentages slow matching. Search before creating another registration when instructed.</p>` },
      { id: "pro-versus-mlc", title: "PROs versus The MLC", html: `<p>PROs focus on public performance rights in compositions. The MLC administers the U.S. blanket mechanical license for eligible interactive streaming and downloads and pays related digital audio mechanical royalties.</p><p>A self-administered songwriter may need both a PRO relationship and an MLC registration strategy.</p>` },
      { id: "checklist", title: "The songwriter registration checklist", html: `<ol><li>Finalize the split sheet.</li><li>Confirm legal names and IPI numbers.</li><li>Identify publishers and administrators.</li><li>Register under the PRO's current rules.</li><li>Handle mechanical registration separately.</li><li>Keep confirmations and correct conflicts quickly.</li></ol><p>Continue with <a href="/blog/the-mlc-mechanical-royalties-guide">The MLC guide</a>.</p>` }
    ],
    faqs: [
      { question: "What is a performance rights organization?", answer: "A PRO licenses public performances of works in its repertoire and distributes performance royalties to affiliated songwriters, composers, and publishers under its rules." },
      { question: "Is a PRO the same as a publisher?", answer: "No. A PRO licenses and pays for public performance rights. A publisher or administrator may manage a wider set of composition rights." },
      { question: "Does joining a PRO register my copyright?", answer: "No. PRO work registration and U.S. Copyright Office registration are different processes." },
      { question: "Does a PRO collect mechanical royalties?", answer: "A traditional U.S. PRO focuses on public performance royalties. Mechanical royalty administration is a separate function." },
      { question: "What information is needed to register a song?", answer: "Expect to provide the title, writers, publishers, affiliations, identifiers, and complete shares. Requirements vary by organization." }
    ],
    sources: ["sesacPro", "sesacFaq", "bmiRegistration", "musicianIncome"]
  }),
  createPost({
    slug: "the-mlc-mechanical-royalties-guide",
    title: "The MLC Explained for Independent Artists and Songwriters",
    excerpt: "A practical guide to U.S. digital audio mechanical royalties, self-administered songwriters, work registration, matching, and publishing data.",
    category: "Mechanical Royalties",
    publishedAt: "2026-08-18",
    seoTitle: "The MLC Explained: Mechanical Royalties for Songwriters",
    metaDescription: "Learn how The MLC works, who should join, how independent songwriters register works, and why accurate split and publishing data matters.",
    primaryKeyword: "mechanical royalties",
    definition: "The MLC administers the U.S. blanket mechanical license for eligible interactive streaming and digital download activity and distributes related royalties for musical works.",
    takeaway: "If you are self-administered, accurate titles, writer names, publishing data, shares, and recording identifiers help The MLC match usage to your work.",
    sections: [
      { id: "basics", title: "What a mechanical royalty is", html: `<p>A mechanical royalty is tied to reproduction and distribution of a composition. Eligible U.S. interactive streams and downloads can generate digital audio mechanical royalties.</p><p>This is composition income, not the payment a distributor or label receives for the sound recording.</p>` },
      { id: "what-mlc-does", title: "What The MLC does", html: `<p>The MLC receives usage data and royalties from digital music providers operating under the blanket license, maintains work data, matches recordings to compositions, and distributes royalties to eligible rightsholders.</p><p>Matching depends on titles, writers, shares, and identifiers describing the same work consistently across systems.</p>` },
      { id: "membership", title: "Who should become a Member", html: `<p>The MLC states that a Member may be a publisher, administrator, or self-administered songwriter, composer, or lyricist. A writer whose catalog is fully administered should first confirm whether the administrator handles registration and collection.</p><p>Partially administered writers may manage only the works or shares they still administer.</p>` },
      { id: "registration", title: "How work registration starts", html: `<p>The MLC's guidance begins with searching before creating another work record. Searching reduces duplicates and helps determine whether the catalog already contains the composition.</p><p>Registration can require title, writers, publishers, shares, and identifiers. Connecting released recordings and ISRCs can support matching.</p>` },
      { id: "split-data", title: "Why split-sheet data matters for matching", html: `<p>A signed split sheet gives the team one source for legal names, ownership percentages, publishers, and contacts. Without it, collaborators may register different shares or different versions of a name.</p><p>Accurate IPI data helps distinguish people with similar names and link creators to works.</p>` },
      { id: "mistakes", title: "Mechanical royalty registration mistakes", html: `<ul><li>Assuming a distributor registers the composition everywhere.</li><li>Confusing an ISRC with an ISWC.</li><li>Creating duplicate works before searching.</li><li>Leaving publisher information unresolved.</li><li>Submitting shares that conflict with collaborator records.</li><li>Ignoring account, tax, or payment updates.</li></ul>` },
      { id: "collection-stack", title: "Build a complete royalty collection stack", html: `<p>An independent setup may include a distributor for master revenue, a PRO for performance royalties, The MLC or an administrator for eligible U.S. digital mechanicals, and other systems for neighboring rights and territories.</p><p>Your exact stack depends on your agreements. Start by separating composition and master rights using our <a href="/blog/music-copyright-musical-work-vs-sound-recording">copyright guide</a>.</p>` }
    ],
    faqs: [
      { question: "What is The MLC?", answer: "The MLC administers the U.S. blanket mechanical license for eligible interactive streams and downloads and distributes related royalties to eligible musical-work rightsholders." },
      { question: "Should every songwriter join The MLC?", answer: "Not necessarily. Self-administered writers may need membership, while fully administered writers should confirm who is registering and collecting for them." },
      { question: "Is The MLC a PRO?", answer: "No. The MLC's role concerns digital audio mechanical royalties, while PROs focus on public performance licensing and royalties." },
      { question: "Does The MLC register my copyright?", answer: "No. Registering a work with The MLC is not the same as registering a copyright with the U.S. Copyright Office." },
      { question: "Why search before registering?", answer: "Searching helps prevent duplicate registrations and can improve the accuracy of matching recordings to the correct work." }
    ],
    sources: ["copyrightMusicians", "mlcMember", "mlcRegistration", "cisacIdentifiers"]
  }),
  createPost({
    slug: "music-copyright-musical-work-vs-sound-recording",
    title: "Music Copyright Explained: Musical Work vs. Sound Recording",
    excerpt: "Learn the difference between a song's composition and master recording, who may own each copyright, and why licensing and royalties follow separate paths.",
    category: "Copyright",
    publishedAt: "2026-08-17",
    seoTitle: "Music Copyright: Musical Work vs Sound Recording",
    metaDescription: "Understand the two copyrights in recorded music: the composition and sound recording, plus ownership, registration, royalties, and licensing.",
    primaryKeyword: "music copyright",
    definition: "A recorded song commonly contains two separate works: the musical work, meaning the composition and lyrics, and the sound recording, meaning a particular recorded performance.",
    takeaway: "Whenever money, licensing, or ownership is discussed, ask whether the conversation concerns the composition, the master recording, or both.",
    sections: [
      { id: "musical-work", title: "The musical work: composition and lyrics", html: `<p>The musical work is the underlying song: melody, harmony, rhythm where protectable, and lyrics. Songwriters, composers, and lyricists create this layer.</p><p>A split sheet documents ownership among composition creators. The work may later be administered by publishers or administrators.</p>` },
      { id: "sound-recording", title: "The sound recording: the master", html: `<p>The sound recording is a particular fixation of sounds. Performers and record producers may contribute authorship, while ownership is shaped by facts and agreements.</p><p>One performance is distinct from another recording of the same composition. A cover can use the song while creating a new master.</p>` },
      { id: "revenue", title: "Why the two layers create different revenue", html: `<p>Composition owners may receive performance, mechanical, sync, print, and other income. Master owners and eligible performers may receive recording revenue, master-use fees, neighboring-rights income, and other payments.</p><p>One collection stream does not automatically collect the other. Keep separate ownership records.</p>` },
      { id: "registration", title: "Copyright registration is a separate process", html: `<p>Copyright exists upon fixation under U.S. law, but registration with the Copyright Office provides additional benefits and creates a public record. PRO, MLC, distributor, and publisher registrations serve different functions.</p><p>The Office permits combined registration only in certain situations where authorship and ownership requirements align.</p>` },
      { id: "licensing", title: "How the two rights affect sync licensing", html: `<p>A production using a song in visual media generally needs composition permission. If it uses an existing recording, it also needs master permission.</p><p>A song with clean splits but uncertain master ownership is not fully clearance-ready.</p>` },
      { id: "documents", title: "Which studio documents cover which rights", html: `<ul><li><strong>Split sheet:</strong> composition contributors and shares.</li><li><strong>Producer agreement:</strong> fee, master royalty, credit, deliverables, and possible composition share.</li><li><strong>Featured-artist agreement:</strong> master-use permission, credit, compensation, and release terms.</li><li><strong>Sample clearance:</strong> permission for sampled composition and recording rights.</li><li><strong>Master record:</strong> owner and licensing contact.</li></ul>` },
      { id: "rights-map", title: "Create a one-page rights map for every release", html: `<p>Maintain composition owners and shares, publishers, administrators, master owner, licensed samples, featured artists, identifiers, and approval contacts. Store signed documents beside the audio and metadata.</p><p>Use the <a href="/blog/recording-studio-paperwork-checklist">studio paperwork checklist</a> to operationalize this map.</p>` }
    ],
    faqs: [
      { question: "What are the two copyrights in a recorded song?", answer: "A recorded song commonly contains a copyright in the underlying musical work and a separate copyright in the sound recording." },
      { question: "Who owns the musical work?", answer: "Songwriters or composers initially create the work, but ownership may later be transferred or administered under agreements." },
      { question: "Who owns the master recording?", answer: "Ownership depends on the recording and agreements. It may belong to an artist, label, producer, employer, or another party." },
      { question: "Does a split sheet prove master ownership?", answer: "A standard songwriting split sheet usually addresses composition shares, not complete master ownership." },
      { question: "When does copyright protection begin?", answer: "The U.S. Copyright Office explains that protection begins when an original work is fixed, such as when music is notated or recorded." }
    ],
    sources: ["copyrightMusicians", "copyrightRegistration", "musicianIncome"]
  }),
  createPost({
    slug: "remote-collaboration-split-sheets",
    title: "Remote Collaboration Split Sheets: A Smooth Signature Workflow",
    excerpt: "Send a feature artist, songwriter, or producer the exact split terms, collect signatures remotely, and release the final copy only after everyone confirms.",
    category: "Remote Collaboration",
    publishedAt: "2026-08-16",
    seoTitle: "Remote Collaboration Split Sheets & Signatures Guide",
    metaDescription: "Learn how to send music splits to remote collaborators, collect secure signatures, confirm 100% ownership, and deliver a final split sheet.",
    primaryKeyword: "remote split sheet",
    definition: "A remote split-sheet workflow lets collaborators in different locations review one shared ownership record, confirm their information, sign, and receive the same final document.",
    takeaway: "Treat the process as a state machine: draft, invited, viewed, signed, fully executed, and delivered. Never call a partially signed draft final.",
    sections: [
      { id: "scenario", title: "The real-world remote collaboration scenario", html: `<p>You make a beat in Texas. A featured artist records in another state. A songwriter sends a hook from a third studio. Nobody is in the same room, but the release needs one ownership record.</p><p>The answer is not another group text. It is a shared draft with individual signature invitations and visible status.</p>` },
      { id: "draft", title: "Step 1: create one authoritative draft", html: `<p>The initiator enters the title, date, contributors, roles, legal names, contacts, PRO and publisher details, and proposed shares. Writer ownership must total 100% before finalization.</p><p>Use a version or audit timestamp so edits can be distinguished from the draft originally viewed.</p>` },
      { id: "invites", title: "Step 2: send secure signature invitations", html: `<p>Each contributor receives a unique link instead of a shared editable URL. The invite should identify the song, sender, requested action, and security expectations.</p><p>A contributor should review the full split picture, not only their own number. Informed agreement requires context.</p>` },
      { id: "review", title: "Step 3: review, correct, and sign", html: `<p>The signer verifies identity, role, email, publisher information, and percentages. If something is wrong, return to draft instead of collecting a signature on incorrect data.</p><p>Typed names, drawn signatures, consent, timestamps, and event logs strengthen the operational record.</p>` },
      { id: "finalization", title: "Step 4: finalize only after every required signature", html: `<p>The document remains pending while any required contributor has not signed. Once all signatures are present, the system revalidates totals, locks the completed version, and marks it fully executed.</p><p>If a signed field changes, require renewed confirmation.</p>` },
      { id: "delivery", title: "Step 5: deliver the same completed copy", html: `<p>Email the final PDF or image to every contributor. It should display the song data, ownership percentages, signatures, completion date, and a consistent identifier.</p><p>Store a durable server-side copy so the initiator is not the only person with the record.</p>` },
      { id: "smooth-ux", title: "What makes the remote experience feel smooth", html: `<ul><li>Mobile-friendly signing.</li><li>Clear progress such as “2 of 3 signatures complete.”</li><li>Automatic reminders that stop after signing.</li><li>Plain-language errors.</li><li>A visible correction request.</li><li>Immediate final delivery after the last signature.</li></ul><p>Split Sheet Studio is built around this flow for the web app and DAW workflow.</p>` }
    ],
    faqs: [
      { question: "Can musicians sign from different states?", answer: "Yes. A digital workflow can let each contributor review and sign the same record remotely, subject to applicable electronic-signature and contract rules." },
      { question: "Should the creator sign before sending an invite?", answer: "The initiator can sign first, but no version should be final until every required party confirms the same terms." },
      { question: "What should the invite email contain?", answer: "Identify the song and sender, explain the action, provide a secure unique link, state any expiration, and offer a correction path." },
      { question: "What happens if a collaborator requests a change?", answer: "Pause finalization, revise the shared draft, and require every affected contributor to confirm the new version." },
      { question: "When should the completed copy be emailed?", answer: "Send it automatically after all required signatures are complete and ownership totals pass validation." }
    ],
    sources: ["copyrightMusicians", "cisacIdentifiers"]
  }),
  createPost({
    slug: "recording-studio-paperwork-checklist",
    title: "Recording Studio Paperwork Checklist for Independent Music",
    excerpt: "The practical session-to-release checklist for splits, credits, signatures, publishing data, identifiers, master rights, and sync-ready files.",
    category: "Studio Operations",
    publishedAt: "2026-08-15",
    seoTitle: "Recording Studio Paperwork Checklist for Music Creators",
    metaDescription: "Use this recording studio paperwork checklist for split sheets, credits, publishing data, signatures, ISRC, ISWC, and releases.",
    primaryKeyword: "recording studio paperwork",
    definition: "Recording studio paperwork is the ownership, credit, permission, payment, and metadata record set that moves a song from session to defensible release and licensing asset.",
    takeaway: "Capture information once, at the source, then reuse verified data for publishing, distribution, credits, copyright, and licensing workflows.",
    sections: [
      { id: "before", title: "Before the session", html: `<ul><li>Confirm the booking and payment terms.</li><li>Identify the artist, producer, engineer, and expected collaborators.</li><li>Ask about beats, samples, or third-party material.</li><li>Prepare contributor fields and the split workflow.</li><li>Clarify the service or collaboration relationship where applicable.</li></ul>` },
      { id: "during", title: "During the session", html: `<p>Track who contributes lyrics, melody, harmony, production, performance, engineering, and other work. Contribution does not automatically determine ownership, but an accurate activity record makes the conversation clearer.</p><p>Save real names and emails as people arrive. Do not wait until release week.</p>` },
      { id: "closeout", title: "At the end of the session", html: `<ul><li>Finalize the working and alternate titles.</li><li>Agree on composition splits totaling 100%.</li><li>Record publishers, PROs, and IPIs when known.</li><li>Confirm credits and master compensation separately.</li><li>Sign or send remote invitations.</li><li>Export a recap and back up the files.</li></ul>` },
      { id: "identifiers", title: "ISRC, ISWC, and IPI without confusion", html: `<p><strong>ISRC</strong> identifies a specific recording. <strong>ISWC</strong> identifies a musical composition. <strong>IPI</strong> identifies creators and publishers in rights systems.</p><p>An ISRC is not a copyright registration and should never be reused for a different recording.</p>` },
      { id: "release", title: "Before distribution and release", html: `<ol><li>Confirm master ownership and delivery acceptance.</li><li>Register the composition through appropriate channels.</li><li>Assign or obtain the recording's ISRC.</li><li>Review names, title, featured credits, and metadata.</li><li>Clear samples and interpolations.</li><li>Register copyrights where appropriate.</li></ol>` },
      { id: "sync-folder", title: "Build a sync-ready song folder", html: `<p>Store the full mix, instrumental, clean version, stems, lyrics, split sheet, master contact, sample clearances, writer and publisher contacts, identifiers, and creative description together.</p><p>A clean folder turns a frantic clearance email into a professional response.</p>` },
      { id: "system", title: "Turn paperwork into a repeatable studio system", html: `<p>Use the same naming convention, required fields, validation, signature flow, and storage location for every session. Assign one person to close the record before the project leaves production.</p><p>Pair this with the <a href="/blog/sync-licensing-checklist">sync checklist</a> and <a href="/blog/producer-splits-for-beats">producer guide</a>.</p>` }
    ],
    faqs: [
      { question: "What paperwork should be completed in a recording session?", answer: "Document contributors and splits, contacts, credits, master or service terms, samples, featured artists, and appropriate signatures." },
      { question: "What is an IPI number?", answer: "An IPI identifies an interested party such as a creator or publisher in music-rights systems. It is different from a private PRO account number." },
      { question: "What is the difference between ISRC and ISWC?", answer: "ISRC identifies a recording. ISWC identifies a musical work or composition." },
      { question: "Should engineers be listed on a split sheet?", answer: "List an engineer as a composition owner only if the parties agree that the engineer contributed songwriting. Engineering credit and payment should be documented separately." },
      { question: "Where should studios store completed records?", answer: "Use secure, access-controlled storage with backups and consistent song folders. Give contributors their completed copies." }
    ],
    sources: ["copyrightMusicians", "copyrightRegistration", "cisacIdentifiers", "isrcOfficial"]
  }),
  createPost({
    slug: "producer-splits-for-beats",
    title: "Producer Splits for Beats: What to Document Before Release",
    excerpt: "Separate songwriting ownership, beat licenses, producer fees, master royalties, credits, and sample obligations before distribution.",
    category: "Producers",
    publishedAt: "2026-08-14",
    seoTitle: "Producer Splits for Beats: Songwriting & Master Guide",
    metaDescription: "Learn how producer splits work for beats, including songwriting share, producer points, fees, beat licenses, master ownership, credits, and samples.",
    primaryKeyword: "producer splits",
    definition: "A producer split can refer to ownership in the composition, compensation from the master recording, or both. Those rights are separate and should be labeled clearly.",
    takeaway: "Never use one unlabeled percentage for publishing, master royalties, and fees. Name the right, calculation base, and payment obligation.",
    sections: [
      { id: "layers", title: "The three producer deal layers", html: `<p>A producer relationship can include an upfront fee, songwriting ownership, and a royalty tied to the master. Credit, expenses, deliverables, revisions, and session files may also matter.</p><p>Not every deal has every layer. Documentation makes the actual deal visible.</p>` },
      { id: "songwriting", title: "When production may involve songwriting", html: `<p>Beat-making can include melody, harmony, rhythm, and other musical expression. Producers and artists should discuss authorship instead of assuming the job title decides the outcome.</p><p>Record any agreed composition share on the split sheet with all writers, totaling 100%.</p>` },
      { id: "points", title: "Producer points and master royalties", html: `<p>Producer points commonly describe a royalty connected to the master. The agreement should define the royalty base, deductions, accounting, recoupment, payment method, and statements.</p><p>A 3% master royalty is not the same as 3% composition ownership.</p>` },
      { id: "licenses", title: "Exclusive and nonexclusive beat licenses", html: `<p>A nonexclusive license may let multiple artists use the beat under limits. An exclusive license may restrict future licenses but does not necessarily transfer every composition or master right.</p><p>Review usage limits, monetization, term, territory, credit, publishing, Content ID, sync, stems, and sample provisions.</p>` },
      { id: "samples", title: "Sample and interpolation responsibility", html: `<p>A producer should disclose third-party samples, restricted loops, and interpolations. The release team should identify who obtains approvals and bears costs.</p><p>Uncleared material can affect distribution, monetization, copyright, and sync licensing.</p>` },
      { id: "agreement", title: "Producer agreement checklist", html: `<ul><li>Legal and professional names.</li><li>Song and artist.</li><li>Fee and payment milestones.</li><li>Composition share and publisher data.</li><li>Master royalty terms.</li><li>Credit language.</li><li>Deliverables and revisions.</li><li>Sample disclosure.</li><li>Signatures and date.</li></ul>` },
      { id: "before-upload", title: "What to confirm before the distributor upload", html: `<p>Make sure the split sheet, producer agreement, credits, master ownership, sample status, and payment obligations tell the same story. Deliver the producer's copy and preserve the final version.</p><p>Use the <a href="/blog/recording-studio-paperwork-checklist">recording studio paperwork checklist</a>.</p>` }
    ],
    faqs: [
      { question: "Does a producer automatically get songwriting credit?", answer: "Not automatically. A producer may be a songwriter when contributing protectable composition elements, but the collaborators should document the agreement." },
      { question: "Are producer points the same as publishing?", answer: "No. Producer points usually refer to a master royalty, while publishing concerns the composition." },
      { question: "Does buying a beat mean I own the copyright?", answer: "Not necessarily. Beat licenses may reserve composition, master, royalty, or usage rights. Read the actual license." },
      { question: "Who clears a sample in a beat?", answer: "The agreement should allocate responsibility, but the release team should never assume a sample is cleared without written confirmation." },
      { question: "What credits should a producer receive?", answer: "Document exact producer credit, roles, legal and professional names, and where the credit will appear." }
    ],
    sources: ["copyrightMusicians", "musicianIncome", "copyrightRegistration"]
  }),
  createPost({
    slug: "music-publishing-before-sync-licensing",
    title: "Music Publishing for Independent Artists Before a Sync Pitch",
    excerpt: "Organize composition ownership, publishers, administrators, registrations, identifiers, and clearance authority before pitching for sync.",
    category: "Music Publishing",
    publishedAt: "2026-08-13",
    seoTitle: "Music Publishing for Independent Artists Before Sync",
    metaDescription: "Prepare music publishing before pitching for sync licensing: splits, PROs, The MLC, publishers, administrators, ownership, and contacts.",
    primaryKeyword: "music publishing for independent artists",
    definition: "Music publishing is the ownership and administration business around compositions. Before a sync pitch, creators should know every owner, publisher, administrator, share, and approval contact.",
    takeaway: "The best sync pitch is not only creatively right; it is easy to clear because ownership and authority are organized.",
    sections: [
      { id: "basics", title: "What music publishing covers", html: `<p>Publishing concerns the composition rather than the master. It includes ownership, registration, licensing, administration, royalty collection, and catalog development depending on the relationship.</p><p>A writer may self-administer, create a publishing entity, use an administrator, or sign with a publisher.</p>` },
      { id: "ownership", title: "Finalize ownership before administration", html: `<p>No publisher can cleanly manage a song whose writers disagree about shares. Complete a split sheet, resolve the 100% total, and verify names, PROs, IPIs, publishers, and contacts.</p><p>Keep master ownership in a separate linked record so both sides of a sync request can be answered.</p>` },
      { id: "publisher-versus-admin", title: "Publisher versus publishing administrator", html: `<p>A traditional deal may include ownership or control, creative services, advances, and administration. An administration deal commonly focuses on registration and collection while the writer retains ownership, but terms differ.</p><p>Review the grant of rights, term, territory, commission, approvals, collection scope, and post-term provisions.</p>` },
      { id: "responsibilities", title: "Map every registration responsibility", html: `<ul><li>Who registers with the PRO?</li><li>Who handles mechanical registration?</li><li>Who manages international registrations?</li><li>Who corrects conflicts?</li><li>Who updates ISRC associations and alternate titles?</li><li>Who can approve sync licenses?</li></ul>` },
      { id: "authority", title: "Confirm sync approval authority", html: `<p>Some agreements grant a publisher or administrator authority to negotiate or approve sync; others reserve approval to the songwriter or require multiple parties. The master has its own chain.</p><p>Create a contact sheet stating who can quote, who must approve, and expected response time.</p>` },
      { id: "metadata", title: "Make the catalog searchable and trustworthy", html: `<p>Use consistent titles, writers, publishers, IPIs, ISWCs, associated ISRCs, genre, mood, themes, lyrics, explicit status, and ownership contacts. Link instrumentals and clean versions to the same song record.</p><p>Structured language supports AI discovery because the catalog clearly identifies entities and rights status.</p>` },
      { id: "audit", title: "Run a pre-pitch publishing audit", html: `<ol><li>Confirm signed splits total 100%.</li><li>Verify publisher and administrator names.</li><li>Check work registrations against the split.</li><li>Identify composition and master contacts.</li><li>Clear samples.</li><li>Prepare metadata and audio.</li><li>Claim one-stop only when verified.</li></ol><p>Use the <a href="/blog/sync-licensing-checklist">full sync checklist</a>.</p>` }
    ],
    faqs: [
      { question: "Do independent artists need a music publisher?", answer: "Not every creator needs a traditional publisher, but every composition needs accurate administration." },
      { question: "Can I pitch for sync without a publisher?", answer: "Potentially, if the owners can authorize the composition use and the rights information is complete." },
      { question: "What is a publishing administrator?", answer: "An administrator commonly handles registrations, collection, and catalog administration without necessarily taking the same ownership as a traditional publisher." },
      { question: "Why do supervisors need publisher contacts?", answer: "Publishers or administrators may control or represent composition rights and may need to approve the use." },
      { question: "What is one-stop clearance?", answer: "One-stop generally means one authorized contact can approve composition and master rights. Confirm authority before making that claim." }
    ],
    sources: ["copyrightMusicians", "copyrightAllianceSync", "mlcMember", "sesacFaq"]
  }),
  createPost({
    slug: "music-metadata-isrc-iswc-ipi-guide",
    title: "Music Metadata Guide: ISRC, ISWC, IPI, Credits, and Ownership",
    excerpt: "A creator-friendly guide to the identifiers and metadata that connect songs, recordings, writers, publishers, credits, and royalty systems.",
    category: "Music Metadata",
    publishedAt: "2026-08-12",
    seoTitle: "Music Metadata Guide: ISRC, ISWC, IPI & Credits",
    metaDescription: "Learn music metadata essentials including ISRC, ISWC, IPI numbers, songwriter splits, publisher data, credits, and release identifiers.",
    primaryKeyword: "music metadata",
    definition: "Music metadata identifies a composition, recording, creator, publisher, owner, release, and credit. ISRC, ISWC, and IPI identify different entities and are not interchangeable.",
    takeaway: "Good metadata cannot repair a bad ownership agreement, but it can carry a good agreement through royalty, release, and licensing systems.",
    sections: [
      { id: "importance", title: "Why music metadata matters", html: `<p>Streaming, publishing, royalty, licensing, and discovery systems process huge catalogs. They rely on names, titles, identifiers, and ownership data to connect usage with the correct people and works.</p><p>Errors create mismatches: a creator may be listed under the wrong name or a recording may not connect to its composition.</p>` },
      { id: "isrc", title: "ISRC identifies a recording", html: `<p>The International Standard Recording Code uniquely identifies a sound or music video recording. Official guidance says it is not used to identify compositions, products, or performers.</p><p>Maintain the ISRC with artist, title, version, duration, content type, and publication date. Never reuse it for another recording.</p>` },
      { id: "iswc", title: "ISWC identifies a musical work", html: `<p>The International Standard Musical Work Code identifies the composition. CISAC describes it as connecting the work title and creators, including authors, composers, and arrangers.</p><p>One song may have one ISWC while multiple recordings each have their own ISRC.</p>` },
      { id: "ipi", title: "IPI identifies creators and publishers", html: `<p>The Interested Party Information number helps distinguish songwriters, composers, and publishers within rights systems. It is valuable when names are common or represented in multiple territories.</p><p>Use the IPI tied to the exact identity in the registration. Do not substitute private account credentials.</p>` },
      { id: "credits", title: "Credits are data, not decoration", html: `<p>Record songwriter, producer, featured artist, engineer, mixer, mastering engineer, musician, and studio credits consistently. Verify spelling and professional names.</p><p>Creative credit and ownership are related but not identical. Someone can deserve credit without owning composition or master rights.</p>` },
      { id: "source-of-truth", title: "Create one source of truth", html: `<p>Maintain a canonical record containing titles, writers, shares, publishers, IPIs, ISWC, recording versions, ISRCs, master owners, credits, lyrics, release data, and contacts.</p><p>Update downstream platforms from that record instead of rebuilding metadata from memory.</p>` },
      { id: "checklist", title: "The release metadata checklist", html: `<ul><li>Song and alternate titles.</li><li>Primary and featured artists.</li><li>Writers and composition shares.</li><li>Publishers, administrators, PROs, and IPIs.</li><li>ISWC when assigned.</li><li>ISRC for each recording.</li><li>Master owner and licensing contact.</li><li>Creative credits, lyrics, language, and version details.</li></ul><p>Connect the data to the signed record using <a href="/blog/what-is-a-split-sheet-in-music">the split-sheet guide</a>.</p>` }
    ],
    faqs: [
      { question: "Does an ISRC identify a song or a recording?", answer: "An ISRC identifies a specific sound or music video recording, not the underlying composition." },
      { question: "What does an ISWC identify?", answer: "An ISWC is a globally recognized identifier for a musical work and connects its title and creators." },
      { question: "Is an IPI the same as a PRO account number?", answer: "No. An IPI identifies a creator or publisher in rights systems. Private account numbers serve different purposes." },
      { question: "Can the same recording receive a new ISRC after ownership changes?", answer: "Generally, the ISRC remains with the unchanged recording and should not be reassigned solely because ownership changes." },
      { question: "Why do alternate titles matter?", answer: "Alternate titles help systems recognize that differently styled or parenthetical titles refer to the same work or recording." }
    ],
    sources: ["cisacIdentifiers", "isrcOfficial", "mlcRegistration"]
  })
];

function withReadingMeta(post) {
  const plainText = String(post.bodyHtml || "").replace(/<[^>]+>/g, " ");
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  return {
    ...post,
    wordCount,
    readingMinutes: Math.max(1, Math.ceil(wordCount / 200)),
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          headline: post.title,
          description: post.metaDescription,
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
          mainEntityOfPage: `https://splitsheetstudio.com/blog/${post.slug}`,
          author: { "@type": "Organization", name: "Split Sheet Studio" },
          publisher: { "@type": "Organization", name: "Split Sheet Studio", url: "https://splitsheetstudio.com" },
          keywords: post.primaryKeyword
        },
        {
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer }
          }))
        }
      ]
    }
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

module.exports = { listPosts, getPostBySlug };
