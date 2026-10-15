# Blog editorial improvement log

## Publication — October 14, 2026

Published to [the public blog](https://splitsheetstudio.com/blog) from GitHub source commit [2118222](https://github.com/iamMichaelSmith/studio-split-sign/commit/2118222193d71fa37fae7381420b2221ac01419d), **Blog revisions: improve all 28 articles and reader resources**.

- Release image: `20261014-blog-revisions-230337`; ECS task definition `splitsheetstudio-staging:90`.
- Image digest: `sha256:518db29f7d59de7075432823595b411903b534f48ca38d58ad9df6845a512e53`.
- GitHub CI passed, including the blog checks, application checks, smoke test, and isolated PostgreSQL checks.
- Production verification: all 28 article bodies match the committed source; author/date/canonical metadata and one closing CTA per article are correct. Blog indexes on the root, www, and app hosts include all 28 articles.
- All five resource files and the blog stylesheet match their committed bytes. Health reports the new release; readiness, pricing, and the plug-in page respond successfully.
- Deployment preserves the previous runtime configuration except for the image and release identifier. Previous task revision 89 remains the rollback reference.

The local/unpublished descriptions below are historical notes from preparation, before this authorized publication.

First pilot pass: October 14, 2026. Local implementation; not deployed.

## Second editorial pass — October 14, 2026

Completed a focused second pass on the same four articles. The other 24 article bodies remain identical to their pre-edit versions. This pass is ready for Michael's final read; publication is a separate step.

| Article | Second-pass result |
| --- | --- |
| Split-sheet guide | Tightened the opening explanation and studio account, clarified which parts of the example are only a summary, corrected the fictional signing date, and matched product guidance to composition, master, and combined rights modes. |
| Producer splits | Replaced unsupported generalizations with a direct opening question, explained royalty base and recoupment, made the document comparison accessible, and linked SoundExchange's specific payment mechanism to its primary guidance. |
| Studio closeout | Put the actual studio process in Michael's first-person voice, reduced the FAQ from ten repeated/promotional questions to five practical questions, and clarified review files versus unresolved rights decisions. |
| Sync readiness | Explained stems and identifiers, placed metadata guidance before the filled example, corrected the clearance checklist, and synchronized the CSV and article's ownership-versus-permission status. |

### Reader-task walkthrough and verification

This was an agent walkthrough, not an independent human usability study.

- Composition example: the three shares sum to 100%; the visual, table, and metadata CSV agree on 50/25/25. The session is October 1, the fictional composition agreement is signed October 2, and the later sync request can still have pending approval. Profile details are omitted from the teaching summary rather than portrayed as blank fields in a completed product form.
- Producer example: recalculated $2,000 × 0.03 = $60. The separate $500 fee produces $560 across those two example payment categories; the composition ownership is not applied again to master receipts.
- Closeout: the pending-item example identifies a responsible person and due date; the real studio sequence remains production → splits → mixing/mastering → DISCO. No automatic DISCO integration is claimed.
- Sync delivery: the folder identifies the full mix, instrumental, lyrics, metadata, and private rights record. The metadata distinguishes a signed ownership agreement from pending approval for a particular use. Downloaded the actual CSV through the browser; its SHA-256 matches the source. All 19 rows conform to the resource's two-column format.
- Product descriptions checked against the current public product page, the rights selector, share validation, and remote-signing form. The selected rights have separate totals; signers review all relevant contributors and shares; required signer details must be completed before finalization.
- `npm run test:blog`: passed for all 28 article routes, bylines/author metadata, anchors, article links, dates, and resources.
- `npm test`: all 39 application tests and the smoke test passed again.
- `node --check content/blog-posts.js` and `git diff --check`: passed.
- Browser review at 390px and 1280px: all four articles fit the viewport; tables scroll within their containers on mobile and fit their containers on desktop. Enlarged the contents links to complete block tap areas after testing exposed dead space between wrapped lines. Verified both pointer and keyboard navigation, with destination headings clearing the sticky header.
- Checked the workstation resource in the browser. Its print stylesheet is present and served; a physical print or PDF export remains untested.

Additional source checks: [current product descriptions](https://www.splitsheetstudio.com/), [SoundExchange Letters of Direction](https://www.soundexchange.com/what-we-do/for-artists-labels-and-producers/letters-of-direction/), [Copyright Office musician guidance](https://www.copyright.gov/engage/musicians/), [ownership transfers](https://www.copyright.gov/title17/92chap2.html#204), [sync and master permissions](https://copyrightalliance.org/faqs/how-to-get-permission-to-use-a-song/), and [ISRC guidance](https://isrc.ifpi.org/why-use-isrc/using-isrc).

## Supporting-article pass — October 14, 2026

Improved three supporting articles individually. Seven article bodies have now been edited across the project; 21 remain identical to the initial snapshot. The four completed pilots were unchanged during this pass. Publication has not been performed.

| Article | Distinct reader task / primary term | Practical addition |
| --- | --- | --- |
| Producer Agreement vs. Split Sheet | Choose the record that defines each promise / `producer agreement vs split sheet` | Accessible document-decision table and a fictional $600 production deal with missing recording, royalty, payment, and delivery terms to identify. |
| Producer Splits for Beats | Compare the purchased license with the intended use / `beat license splits` | Annotated fictional license showing a fee, duration, usage cap, composition shares, unresolved recording ownership, and separate sync approval. |
| Remote Collaboration Split Sheets | Complete a remote review/signing handoff and handle blockers / `remote split sheet` | Three-person status example, reusable invitation message, and troubleshooting for account email, required details, expired links, and corrections. |

Preserved the producer-document article's useful beat-license and exact-credit sections, and the beat article's songwriting, royalty distinction, and pre-upload guidance. The remote article required more extensive factual editing: the earlier text described an in-place correction workflow and a visible correction-request control that the current app does not offer. It now explains the actual verified-account requirement, locked submitted terms, support-guided handling of an incorrect pending proposal, and the separate revision flow for completed records. It does not imply that a chat message cancels or changes an active request.

Each supporting article uses Michael's established byline, its original publication date and URL, a truthful update date, selected related reading, and one contextual product CTA. The repeated generated field guide, studio promotion, resource directory, and extra plugin CTA are omitted. The beat article's primary term is more specific than the broader producer-splits guide; no search-volume or ranking claims are made.

### Sources and verification for the supporting articles

- [Copyright Office beat-store and preexisting-music guidance](https://www.copyright.gov/music-modernization/educational-materials/Sampling-Interpolations-Beat-Stores-and-More-An-Introduction-for-Musicians-Using-Preexisting.pdf): tier labels, scope of permission, third-party material, and producer participation.
- [BeatStars content-license FAQs](https://help.beatstars.com/hc/en-us/articles/54320717002395-Content-Licenses-Contracts-FAQs): used as a clearly identified platform example, including earlier nonexclusive licenses. The fictional license is not represented as a BeatStars contract.
- [YouTube Content ID guidance](https://support.google.com/youtube/answer/2797370?hl=en): definition and the need to check current eligibility separately from a beat license.
- [Federal E-SIGN rule, 15 U.S.C. § 7001](https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap96-subchapI-sec7001.htm): electronic format alone is not generally grounds for rejecting a covered agreement; no guarantee of enforceability is made.
- [Split Sheet Studio support](https://www.splitsheetstudio.com/support), current sign/revision routes, signer form, and share validation: account-email matching and verification, required profile fields, completion, delivery, and completed-record revisions.
- `npm run test:blog`: all 28 article routes, internal article links, jump targets, metadata, bylines, and resources passed.
- `node --test tests/release-security.cjs`: passed, 13 reported tests including verified account access, finalization, immutable submitted documents, and revisions preserving the original.
- Syntax and whitespace checks passed. Snapshot comparison confirmed that exactly these three article bodies changed in this pass.
- Browser review at 390px and 1280px: all three pages fit the viewport. Tables remain within scrollable regions on mobile and fit on desktop. Verified pointer jump navigation, 110px heading clearance, and keyboard horizontal scrolling of the remote-status table.
- Reader walkthrough: the agreement example's 75/25 and beat example's 50/50 ownership totals are complete; fees remain separate from ownership. In the remote example, only Elena has signed; Sam's view and Devin's expired link do not make the record complete. No real client, sample contract, or firsthand marketplace test was invented.

This pass changed editorial content, not signing behavior. It did not introduce an in-place edit or cancellation control for pending signature requests.

## Rights and registration pass — October 14, 2026

Completed individual passes on three more articles. Ten article bodies have now been edited; the other 18 remain identical to the initial local snapshot. Only these three bodies changed during this pass. Their titles, URLs, and original publication dates are preserved, with Michael's established byline and an October 14 update date. These changes remain local and unpublished.

| Article | Reader task | Changes and practical example |
| --- | --- | --- |
| Songwriting Splits: Writer and Publisher Shares | Translate a composition agreement into the appropriate royalty-accounting format | Preserved the ownership-first explanation and split-conversation sequence. Clarified performance allocations, administration versus ownership, and BMI's treatment of unassigned publishing interests. Added a fictional 60/40 composition and $1,000 payment illustration with explicit assumptions; it is not a registration-form template. |
| Master Rights vs. Publishing Rights | Identify the rights and authorized contacts for a particular recording | Preserved the two-rights opening, collection-path explanation, and practical workflow. Replaced the old comparison with an accessible table and added one fictional composition with two separately owned recordings. Distinguished producer royalties, performer payments, and recording ownership. Corrected the product description to reflect composition, master, and combined rights modes. |
| The MLC Explained | Identify who administers the relevant rights, then prepare a registration or share claim | Preserved the mechanical-royalty foundation, membership decision, and search-first approach. Added a fictional 60/40 work with one administered and one self-administered share, plus preparation and troubleshooting steps. Clarified collection shares, optional recording details, submitted status, unmatched versus unclaimed royalties, and ownership disputes. Refined the primary term to `MLC registration`; no search-volume or ranking claim is made. |

All three omit repeated generated supporting sections and the extra plugin promotion. Each has three selected next reads and one contextual closing CTA. No additional client story, credential, product screenshot, actual registration, or royalty outcome is claimed.

### Sources and verification for the rights articles

- [BMI royalty policy manual](https://www.bmi.com/creators/royalty-policy-manual): 200% performance-payment scale, usual writer/publisher allocation, and unassigned publishing interests. The article avoids treating the usual allocation as a universal registration rule.
- [Copyright Office composition and recording guidance](https://www.copyright.gov/register/pa-sr.html), [musician guidance](https://www.copyright.gov/engage/musicians/), and [ownership transfers](https://www.copyright.gov/title17/92chap2.html#204): separate rights and the need to examine relevant agreements.
- [SoundExchange digital performance royalties](https://www.soundexchange.com/digital-performance-royalties/): recording-owner and performer payment categories are distinct.
- [The MLC membership](https://help.themlc.com/en/support/what-is-a-member), [registration](https://help.themlc.com/en/support/how-to-register-works-in-the-mlc-portal), [royalty flow](https://www.themlc.com/how-it-works), and [licensing and dispute FAQs](https://www.themlc.com/faqs/categories/mlc): Member setup, administration scope, search before registration, collection-share entries, optional recording information, matching, and dispute limits.
- Existing primary identifier guidance and sync-permission sources remain linked where relevant. Product rights modes were checked against the current local selector and separate share validation; no signing behavior changed.
- `npm run test:blog`: passed for all 28 routes, internal article links, jump targets, coherent author/date/canonical metadata, optional sections, and reader resources. Syntax and whitespace checks passed.
- Compared snapshots: exactly these three bodies changed in this pass; ten differ from the initial snapshot and 18 are preserved. The earlier seven editorial bodies were unchanged.
- Recalculated the displayed payment rows: 60/40 ownership; $300 + $300 = $600; $200 + $200 = $400; $600 + $400 = $1,000. The two assumed payment portions each total $500. The MLC example allocates collection responsibility 60% to Iris's administrator and 40% to Owen; it does not authorize either to claim 100%.
- Browser review at 390px and 1280px: the pages fit the viewport, tables scroll within their regions on mobile and fit their containers on desktop, and the worked-example jump headings clear the sticky header by 110px. Keyboard scrolling was checked. Shortened table labels and gave the five-column payment table a scoped 700px minimum after the mobile review exposed broken header words; important qualifications remain outside the scrollable tables. The final table fits its desktop container and keeps words intact at phone width.

This is an agent reader-task walkthrough and local rendering check, not an independent human comprehension study, qualified legal review, or live MLC registration test. No royalty account, ownership claim, or payment information was submitted.

## Remaining-library batch — October 14, 2026

At Michael's request, completed the remaining 18 articles in one batch, with a separate reader task and content decision for each. All 28 articles have now received an individual editorial pass. The earlier ten article bodies are preserved exactly as they stood before this batch. All 28 original article titles, slugs, and publication dates are retained. Changes remain local and unpublished.

| Article | Reader task and useful change |
| --- | --- |
| AI Music, Voice Clones, and Song Credits | Document human expression, retained generated material, and voice permission separately. Added a fictional cleanup/generated-vocal session log; corrected the implication that prompting alone establishes authorship. |
| Before You Upload to DistroKid or TuneCore | Compare the actual upload with approved audio and metadata. Added a version-mismatch exercise and service-specific identifier references. |
| Best Music Distribution Services in 2026 | Compare the cost and obligations of an actual release plan. Replaced the unsourced 15-service grid with six documented offers, checked fees and commissions, and a worked three-year cost comparison. Updated the excerpt and SEO metadata to match six services. |
| One-Stop Music Licensing | Verify authority to grant the relevant rights. Added a three-interest approval map and clarified that coordinating contacts alone does not establish one-stop authority. |
| Recording Studio Client Intake | Identify service scope, participants, inputs, and delivery expectations before booking. Added a filled fictional intake and downloadable reusable questions. |
| Recording Studio Release Delivery | Verify the handoff against the booking. Added a delivery recap distinguishing approved audio, a pending clean edit, and unresolved recording terms. |
| Artist Release Paperwork | Find the agreement behind each promise. Added a document-readiness matrix and an example with completed composition shares but missing royalty and beat-license terms. |
| Independent Artist Sync Starter Kit | Build a manageable first shortlist. Added three different preparation statuses and preserved Michael's supplied production-to-DISCO sequence as a reported workflow. |
| Music Supervisor Pitch Package | Respond to a particular brief. Added a fictional brief and matched email with an honest separate publisher approval; follow-up advice now defers to recipient instructions. |
| Music Catalog Metadata Spreadsheet | Maintain recording rows linked to works, evidence, and actions. Added a fictional catalog CSV with separate file, agreement, and authority fields; clarified that the starter is not an ownership calculator or integration. |
| Songwriter Collaboration Agreement | Handle changed contributors and proposals. Added an unsigned 60/40 draft becoming a proposed 50/30/20 record, with locked submitted requests distinguished from draft editing. |
| DAW Rescan Guide | Identify discovery, validation, and account failures separately. Added a diagnosis table; checked version-specific vendor instructions and current Windows product formats; removed promises about future builds and universal host compatibility. |
| Sync Licensing Checklist | Review a specific use before granting permission. Added a fictional film request with additional worldwide advertising language to resolve, and explicit media, territory, term, exclusivity, and fee questions. |
| PROs Explained | Distinguish affiliation, work registration, and separate collection tasks. Added a co-write involving ASCAP and BMI and a collection-responsibility table. |
| Music Copyright | Distinguish the composition, recording, registration, and relevant documents. Added a cover-versus-sample example and a document comparison. |
| Recording Studio Paperwork | Assign responsibility across the project. Added a stage-by-stage handoff record and separated audio, agreement, and signature status. |
| Music Publishing Before Sync | Identify collection and licensing authority from the actual grant. Added an administrator example where sync approval remains with the writer. |
| ISRC, ISWC, and IPI Guide | Put identifiers in the correct records and correct affected destinations. Added linked fictional work/recording labels and clarified unchanged recordings, remasters, and ownership changes. |

Preserved useful existing explanations and sequences rather than replacing every paragraph. Removed the repeated generated field guide, studio advertisement, broad resource directory, and extra plug-in promotion from these 18, matching the earlier ten. Each now has three chosen next reads, one contextual closing CTA, Michael's established byline, a truthful update date, and a scope note appropriate to the topic. No new client account, credential, actual supervisor brief, royalty result, marketplace test, or plug-in compatibility test was invented.

### Sources for the remaining batch

- Copyright Office: [current AI resource hub](https://www.copyright.gov/ai/), [copyrightability announcement](https://www.copyright.gov/newsnet/2025/1060.html), [registration guidance](https://www.copyright.gov/ai/ai_policy_guidance.pdf), and [digital replicas report](https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-1-Digital-Replicas-Report.pdf). Voice and likeness issues are identified for the relevant jurisdiction; no universal permission rule or new-law claim is made.
- Music rights: existing Copyright Office composition, recording, transfer, and preexisting-music guidance; Copyright Alliance sync-permission guidance; SESAC PRO explanation; BMI share and [Songview guidance](https://www.bmi.com/about/songview); MLC membership and registration instructions; CISAC and [ISRC agency FAQs](https://isrc.ifpi.org/faqs). Registration numbers and ownership evidence remain distinct.
- Distribution: [DistroKid plans](https://distrokid.com/product/distrokid/plans-and-pricing-2), [TuneCore pricing](https://www.tunecore.com/pricing), [CD Baby fees and commissions](https://support.cdbaby.com/hc/en-us/articles/213125406-How-much-does-CD-Baby-cost), [LANDR pricing](https://support.landr.com/hc/en-us/articles/31618416509975-How-much-does-it-cost-to-distribute-music-with-LANDR), [LANDR cancellation commission](https://support.landr.com/hc/en-us/articles/31618026457239-How-does-LANDR-Distribution-work), [RouteNote pricing](https://routenote.com/pricing), and [Soundrop pricing](https://soundrop.com/pricing). Official public-page research, not hands-on accounts, support comparisons, or affiliate rankings. In particular, LANDR's support page states a 15% commission after cancellation, and the comparison shows it.
- Technical instructions: PreSonus Studio One Pro 7, Ableton Windows installation and missing-plug-in guidance, Image-Line installation guidance, Steinberg Cubase Pro 15 scan controls, current Cakewalk Sonar scanner guidance, Apple Audio Units troubleshooting, Avid AAX documentation, and REAPER's official guide. Broader host names are not represented as a tested compatibility matrix.
- Product scope: current public Windows download page plus local rights selector, share checks, installer locations, and submitted-record rules. Local build configuration containing an Apple target does not establish a publicly released Mac package.

### Reader resources and validation

- Added `public/resources/sync-catalog-starter.csv`: 23 columns and three clearly fictional recording rows, with two recordings linked to one internal work. Official identifier fields and actual evidence/audio links are blank. Audio availability, composition and master records, approval route, restrictions, responsible person, and next action are separate fields. The starter has no formulas, automatic clearance, or DISCO integration.
- Created and inspected the catalog cells with the spreadsheet skill's bundled Artifact Tool runtime, rendered the identity and action ranges, verified CSV quoting and an Artifact Tool import round-trip, and independently parsed the exported CSV. No real account, assigned identifiers, or private information is included.
- Added `public/resources/studio-intake-questions.txt`: reusable questions for the booking, contacts, contributors, incoming files, outside material, included outputs, retention, and open actions. It is explicitly an intake worksheet, not an ownership transfer or complete contract.
- Browser download checks exercise the resource links; downloaded file hashes are compared with the source. The original closeout checklist and one-song metadata CSV remain available.
- `npm run test:blog`: passed for all 28 routes, internal article links, same-page anchors, cross-article fragments, authorship and date/canonical metadata, one closing CTA, and all four reader resources. The cross-article check caught an incorrect correction-section fragment during this batch; it was fixed before delivery.
- `npm test`: all 39 application checks and the smoke test passed. This is regression validation; the batch does not change signing behavior.
- Snapshot comparison verifies exactly 18 changed bodies in this batch, the earlier ten preserved, and all original titles and publication dates retained. Recalculated the fictional distribution examples: three annual payments total $74.97; three $9.99 singles plus 9% of $500 also total $74.97; eighteen singles under that model total $224.82. These are cost assumptions, not earnings predictions or equivalent-feature claims.
- Browser geometry checks cover all 18 at 390px and 1280px. No page-wide overflow was found; their table regions scroll within the phone viewport and fit the desktop container. Representative visual checks and contents-link interactions supplement these measurements. This is not an independent human comprehension study, a production crawl, or a Core Web Vitals measurement.
- The desktop visual check exposed lost backslashes in the DAW article's Windows folder path. Corrected the content serialization and the delivered path, then added an HTTP-rendered path assertion. The final blog test and snapshot checks pass. The final 23-column catalog download and intake text download each match their source file's SHA-256.

## Working agreement

Improve existing articles selectively. Preserve useful explanations, titles, publication dates, and URLs. Do not rewrite the library as a batch or assign inflated quality scores to declare it finished.

Each article should help a specific reader complete a task. Retain, edit, replace, or remove a section according to that task. Scenarios, tables, FAQs, visuals, and product references are editorial choices rather than required padding.

## Pilot changes

| Existing article / unchanged URL | Reader outcome | Targeted changes |
| --- | --- | --- |
| [What Is a Split Sheet in Music?](/blog/what-is-a-split-sheet-in-music) | Understand what the composition agreement records and complete the next step | Added a clearly fictional 50/25/25 contributor record and accessible percentage diagram; explained unknown registration fields, draft status, and corrections after signing; retained the core rights explanation and common mistakes. |
| [Producer Splits Explained](/blog/producer-splits-explained) | Distinguish composition ownership, master royalties, and fees | Preserved five existing main sections; replaced the brief example with two fictional deals, explicit calculation assumptions, and a document comparison; revised the authorship explanation to avoid deciding ownership from job titles. |
| [Recording Studio Session Closeout](/blog/recording-studio-session-closeout-workflow) | Hand off a session with clear status and responsibility | Added a printable workstation checklist and fictional pending-item handoff; made the five-minute suggestion conditional on existing agreement; clarified payment versus ownership and removed repetitive promotion. |
| [How to Make a Song Sync-Ready](/blog/how-to-make-a-song-sync-ready) | Assemble a delivery packet and report clearance status accurately | Added a fictional supervisor request, folder tree, filled metadata record, CSV download, and missing-approval response; distinguished ownership documentation from permission for a specific use. |

Each pilot opts out of the automatically appended field guide, studio spotlight, resource directory, and extra plugin promotion. Each has three selected next reads and one contextual closing product CTA. Other article bodies retain their existing content and layout choices.

The shared template now supports these choices. It displays a separate update date when one exists, with matching social and structured metadata. An article without a recorded update uses its publication date as the structured-data fallback rather than the old fixed September 13 date. That corrects six cases where modification appeared to precede publication; it does not claim those six articles received a fresh editorial review.

## Evidence and sourcing

Sources consulted for the new distinctions:

- [U.S. Copyright Office: musicians and copyright](https://www.copyright.gov/engage/musicians/) — separate works, registration activities, permission, and unanswered requests.
- [U.S. Copyright Office: compositions and recordings](https://www.copyright.gov/register/pa-sr.html) — composition and recording authorship are different questions.
- [Copyright Alliance: permission to use a song](https://copyrightalliance.org/faqs/how-to-get-permission-to-use-a-song/) — synchronization and master-use permissions. This is explanatory industry guidance, not a government determination about a reader's deal.
- [SESAC: what a PRO does](https://www.sesac.com/what-is-a-performing-rights-organization-pro/) — basic PRO definition.
- [BMI: creator account and IPI guidance](https://www.bmi.com/creators/faqs?tag=my-bmi-account) — identity information and IPI terminology.
- [CISAC: international identifiers](https://www.cisac.org/services/information-services/international-identifiers) — work versus recording identifiers.

The worked examples' people, contacts, deal terms, amounts, and briefs are fictional. Two separate studio notes use experience supplied by Michael Smith, Lead Engineer at Blak Marigold Studio, in this chat. Michael clarified that the unnamed dispute concerned both composition/publishing and master claims, and that he understood a verbal agreement to include a studio publishing interest. The article attributes that account to Michael without deciding legal ownership, motives, enforceability, or remedies. The signed-writing requirement for ownership transfers is linked to [17 U.S.C. Section 204](https://www.copyright.gov/title17/92chap2.html#204).

Michael also specified the studio's actual sequence: finish production; document splits inside Studio One before mixing and mastering; after mixing and mastering, enter the same information in DISCO, where the studio hosts its sync portfolio. This is a reported studio process, not a claim of an automated DISCO integration or a compatibility test across host versions. No interview, hands-on distributor testing, or qualified legal review is claimed. No product screenshots or features were fabricated.

The four pilot articles now use Michael's requested byline: **Michael Smith | Lead Engineer at Blak Marigold Studio**. Their BlogPosting author metadata identifies him as a Person, with the same job title and studio. Split Sheet Studio remains the publisher. Other articles retain their existing organization byline pending their individual editorial passes.

[Fender's official naming announcement](https://www.fender.com/newsroom/270270-fender-unveils-connected-music-ecosystem-with-fender-studio-pro-audio-interfaces-and-controllers/) was checked before explaining Studio One Pro's successor branding in the studio workflow section.

## Editorial completion checks

Before accepting another article:

1. Write one sentence describing the reader's task and select the appropriate article format.
2. Identify what already works. Preserve it unless evidence supports a change.
3. Check consequential claims against direct sources; distinguish U.S. rules, negotiated terms, and hypothetical assumptions.
4. Add an example or resource that helps complete the task where useful. Check the arithmetic and keep ownership, payment bases, and permissions separate.
5. Remove repeated explanations and generic supporting sections. Choose next reads and a relevant CTA.
6. Read the article for flow, then attempt its task without relying on unstated knowledge. A separate human reader remains valuable.
7. Check mobile layout, anchors, links, resources, and metadata. Record actual changes and unresolved questions.

## Verification

- `npm run test:blog`: passed. Checked all 28 article routes, one H1 per page, consistent canonical/structured-data URLs, valid internal article links, unique HTML IDs, working jump targets, coherent dates, optional supporting sections, and reader-resource responses.
- `npm test`: passed, 39 existing application security, launch, email, and signing checks, followed by the passing smoke test.
- `node --check content/blog-posts.js` and `git diff --check`: passed.
- Compared all article bodies against the pre-edit local snapshot: exactly four changed; the other 24 are identical.
- Browser review: all four pilots checked at a 390px viewport; the split example also checked at 1280px. Tables and the folder example scroll within their containers without widening the page. Jump headings clear the fixed navigation. The checklist print stylesheet exists and loads; a physical print or PDF export was not tested.

This is local validation, not a production crawl, Google rich-result eligibility determination, or Core Web Vitals measurement. Visual inspection and final command results are recorded in the accompanying chat.

## What still improves these pilots

- Owner review of the two newly incorporated studio accounts for accuracy, tone, and any details to remove. A real screenshot of the in-session workflow would further substantiate the second account.
- A useful author profile or additional verified background if Michael chooses to provide it. His name and Lead Engineer role are now included; no additional credentials or independent reviewer are claimed.
- Human feedback from someone attempting the split example, closeout checklist, or sync packet. The scripted checks do not establish reader comprehension.
- Qualified review of consequential contract interpretations where warranted.
- Actual product screenshots if they help the task, after checking they match the current interface.

## Next passes

All 28 articles have received their individual passes. The next editorial step is Michael's read-through for voice and factual accuracy, followed by feedback from people attempting the examples and worksheets. Keep those findings separate from the automated checks. This log does not assign a new quality score or claim the library cannot improve further.

The distribution comparison now records its October 14 pricing review and official-page methodology. Recheck the actual quote and terms before publication, renewal, or a catalog move. Review canonical host behavior and indexing with production responses and Search Console access before changing infrastructure. Search Console and conversion data were not available, so there are no ranking or conversion claims.

For maintenance, check price and compatibility details before publishing changes and when plans or releases change. Give AI/legal coverage a source review when relevant guidance changes. Review stable workflow pieces when the studio process or product changes. Keep original publication dates and record meaningful updates honestly.
