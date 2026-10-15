const sourceLibrary = {
  copyrightAiReplicas: ["U.S. Copyright Office — Digital replicas report","https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-1-Digital-Replicas-Report.pdf"],
  copyrightAiRegistration: ["U.S. Copyright Office — Registration guidance for AI-generated material","https://www.copyright.gov/ai/ai_policy_guidance.pdf"],
  bmiSongview: ["BMI — Songview and cross-society work data","https://www.bmi.com/about/songview"],
  isrcFaq: ["International ISRC Agency — Recording, remaster, and ownership FAQs","https://isrc.ifpi.org/faqs"],
  routenotePricing: ["RouteNote — Free and paid distribution pricing","https://routenote.com/pricing"],
  landrCancellation: ["LANDR — Distribution and commission after cancellation","https://support.landr.com/hc/en-us/articles/31618026457239-How-does-LANDR-Distribution-work"],
  abletonMissingPlugins: ["Ableton — Missing plug-in and deep-rescan guidance","https://help.ableton.com/hc/en-us/articles/115000349184-VST-AU-plug-in-doesn-t-appear-in-Live-s-Browser"],
  splitSheetPlugin: ["Split Sheet Studio — Available Windows plug-in package","https://www.splitsheetstudio.com/plugin"],
  copyrightMusicians: ["U.S. Copyright Office — What Musicians Should Know about Copyright", "https://www.copyright.gov/engage/musicians/"],
  copyrightRegistration: ["U.S. Copyright Office — Musical Compositions and Sound Recordings", "https://www.copyright.gov/register/pa-sr.html"],
  copyrightTransfers: ["U.S. Copyright Office — Copyright ownership transfers, Section 204", "https://www.copyright.gov/title17/92chap2.html#204"],
  copyrightPreexistingMusic: ["U.S. Copyright Office — Sampling, Interpolations, Beat Stores and More", "https://www.copyright.gov/music-modernization/educational-materials/Sampling-Interpolations-Beat-Stores-and-More-An-Introduction-for-Musicians-Using-Preexisting.pdf"],
  beatstarsLicenses: ["BeatStars — Content licenses and contracts FAQs", "https://help.beatstars.com/hc/en-us/articles/54320717002395-Content-Licenses-Contracts-FAQs"],
  youtubeContentId: ["YouTube — How Content ID works", "https://support.google.com/youtube/answer/2797370?hl=en"],
  splitSheetSupport: ["Split Sheet Studio — Signing, account access, and revisions", "https://www.splitsheetstudio.com/support"],
  esignValidity: ["U.S. Code — Electronic signatures, 15 U.S.C. § 7001", "https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap96-subchapI-sec7001.htm"],
  musicianIncome: ["U.S. Copyright Office — How Songwriters, Composers, and Performers Get Paid", "https://www.copyright.gov/music-modernization/educational-materials/musicians-income.pdf"],
  copyrightAiReport: ["U.S. Copyright Office — Copyright and Artificial Intelligence, Part 2: Copyrightability", "https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf"],
  copyrightAiNews: ["U.S. Copyright Office — AI and copyrightability report announcement", "https://www.copyright.gov/newsnet/2025/1060.html"],
  copyrightPermission: ["Copyright Alliance — Copyright permission and licensing basics", "https://copyrightalliance.org/faqs/copyright-permission-or-license/"],
  theMlc: ["The MLC — Mechanical Licensing Collective", "https://www.themlc.com/"],
  soundExchange: ["SoundExchange — Digital performance royalty collection", "https://www.soundexchange.com/"],
  soundExchangeDigitalRoyalties: ["SoundExchange — Digital performance royalties", "https://www.soundexchange.com/digital-performance-royalties/"],
  soundExchangeLod: ["SoundExchange — Letters of Direction for creative participants", "https://www.soundexchange.com/what-we-do/for-artists-labels-and-producers/letters-of-direction/"],
  distrokidPricing: ["DistroKid — Plans and pricing","https://distrokid.com/product/distrokid/plans-and-pricing-2"],
  distrokidIsrcUpc: ["DistroKid — UPC and ISRC guidance", "https://support.distrokid.com/hc/en-us/articles/360013648913-Do-I-Need-to-Provide-UPCs-or-ISRCs-to-Upload-to-DistroKid"],
  tunecorePricing: ["TuneCore — Distribution pricing", "https://www.tunecore.com/pricing"],
  tunecoreIsrcUpc: ["TuneCore — UPC and ISRC guidance", "https://support.tunecore.com/hc/en-in/articles/115006499567-TuneCore-UPCs-and-ISRCs"],
  cdbabyPricing: ["CD Baby — Current base fees and commission categories","https://support.cdbaby.com/hc/en-us/articles/213125406-How-much-does-CD-Baby-cost"],
  landrPricing: ["LANDR — Distribution subscription prices", "https://support.landr.com/hc/en-us/articles/31618416509975-How-much-does-it-cost-to-distribute-music-with-LANDR"],
  soundropPricing: ["Soundrop — Pricing and cover-song distribution", "https://soundrop.com/pricing"],
  mlcMember: ["The MLC — Membership for self-administered songwriters and publishers", "https://help.themlc.com/en/support/what-is-a-member"],
  mlcRegistration: ["The MLC — How to register musical works", "https://help.themlc.com/en/support/how-to-register-works-in-the-mlc-portal"],
  sesacPro: ["SESAC — What is a Performing Rights Organization?", "https://www.sesac.com/what-is-a-performing-rights-organization-pro/"],
  sesacFaq: ["SESAC — Music licensing frequently asked questions", "https://www.sesac.com/frequently-asked-questions/"],
  bmiRoyaltyManual: ["BMI — Royalty policy manual: how royalties are divided", "https://www.bmi.com/creators/royalty-policy-manual"],
  mlcHowItWorks: ["The MLC — How royalties flow and where The MLC fits", "https://www.themlc.com/how-it-works"],
  mlcScope: ["The MLC — Licensing scope, matching, and ownership-dispute FAQs", "https://www.themlc.com/faqs/categories/mlc"],
  bmiRegistration: ["BMI — Online Works Registration guidance", "https://applications.bmi.com/OWR"],
  bmiIpi: ["BMI — Creator account and IPI guidance", "https://www.bmi.com/creators/faqs?tag=my-bmi-account"],
  bmiWorkTerms: ["BMI — Online services work registration terms", "https://www.bmi.com/legal/work-registration-terms-and-conditions"],
  cisacIdentifiers: ["CISAC — International music identifiers", "https://www.cisac.org/services/information-services/international-identifiers"],
  isrcOfficial: ["International ISRC Agency — Using ISRC", "https://isrc.ifpi.org/why-use-isrc/using-isrc"],
  copyrightAllianceSync: ["Copyright Alliance — How to get permission to use a song", "https://copyrightalliance.org/faqs/how-to-get-permission-to-use-a-song/"],
  presonusPlugins: ["PreSonus — Make third-party plug-ins appear in Studio One", "https://support.presonus.com/hc/en-us/articles/29252556213773-Studio-One-Pro-7-How-can-I-get-my-3rd-party-plug-ins-to-show-up-in-Studio-One"],
  avidAax: ["Avid — AAX SDK and Pro Tools plug-in format", "https://developer.avid.com/aax/"],
  appleLogicPlugins: ["Apple — Find and rescan Audio Units in Logic Pro", "https://support.apple.com/en-gb/122179"],
  cakewalkScanner: ["Cakewalk — Using the VST Scanner", "https://help.cakewalk.com/hc/en-us/articles/360034722693-Using-the-VST-Scanner"],
  abletonWindowsPlugins: ["Ableton — Using VST plug-ins on Windows", "https://help.ableton.com/hc/en-us/articles/209071729-Using-VST-plug-ins-on-Windows"],
  flStudioPlugins: ["Image-Line — Installing and scanning FL Studio plug-ins", "https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/basics_externalplugins.htm"],
  cubasePluginManager: ["Steinberg — Cubase VST Plug-in Manager", "https://www.steinberg.help/r/cubase-pro/15.0/en/cubase_nuendo/topics/installing_and_managing_plugins/installing_and_managing_plugins_vst_plug_in_manager_toolbar_r.html"],
  reaperGuide: ["REAPER — Current user guide and documentation", "https://www.reaper.fm/userguide.php"]
};

const studioEditorialAuthor = {
  name: "Michael Smith",
  jobTitle: "Lead Engineer",
  organization: "Blak Marigold Studio"
};

const blogUpgradeGuides = {
  "how-to-rescan-plugins-in-your-daw": {
    audienceTitle: "Who this DAW rescan guide helps",
    audience: [
      ["Producers", "Use this before blaming the installer. Confirm the format, folder, DAW scan path, and blocked plug-in list before reinstalling everything in the middle of a session."],
      ["Artists", "If the DAW cannot load the plugin, use the hosted web app so the split sheet still gets completed before collaborators leave."],
      ["Studios", "Keep one printed rescan workflow near the workstation. Assistants can solve most missing VST3 issues without interrupting an engineer."],
      ["Managers", "When a collaborator says the plug-in is missing, ask which DAW, operating system, plug-in format, and folder they checked before escalating."]
    ],
    scenario: "A common real-world case: the installer succeeds, the standalone app opens, but the DAW still does not show Split Sheet Studio. That usually means the host has not scanned the standard VST3 folder, the plug-in was blocked after a failed scan, or the DAW expects a different format such as AAX or Audio Units.",
    tableTitle: "DAW compatibility quick map",
    tableHeaders: ["Host or workflow", "Current plugin path", "Best next step"],
    rows: [
      ["Studio One, Ableton Live, FL Studio, Cubase, REAPER, Cakewalk/Sonar, Bitwig, Mixcraft, Waveform", "Windows VST3 hosts can usually load the plugin.", "Install to the standard VST3 folder, rescan, then test in a blank project."],
      ["Pro Tools", "Requires AAX for native plug-ins.", "Use the standalone or web app until an AAX build exists."],
      ["Logic Pro", "Uses Audio Units on macOS.", "Use the web workflow until a native Mac build exists."],
      ["BandLab web/mobile and Adobe Audition", "Desktop VST3 support varies by product and version.", "Use the web app when the host does not expose a stable VST3 workflow."]
    ],
    checklistTitle: "Before you contact support",
    checklist: ["Confirm the DAW is a 64-bit Windows host that accepts VST3.", "Confirm the file is under C:\\Program Files\\Common Files\\VST3.", "Run a normal rescan, then a failed/blocked plug-in rescan.", "Restart the DAW after installation.", "Open the standalone app or web app so the split sheet can still be finished."],
    nextStep: "When the plug-in is working, create one test split sheet from a blank session, send yourself the signature link, and confirm the final PDF arrives."
  },
  "what-is-a-split-sheet-in-music": {
    audienceTitle: "How each music role should use a split sheet",
    audience: [
      ["Artists", "Use the split sheet to protect the song before release pressure starts. A clean record keeps co-writer conversations from turning into memory battles."],
      ["Producers", "Separate songwriting ownership from producer points, beat license terms, and master royalties. Put each deal layer in the right document."],
      ["Studios", "Make the split sheet part of session closeout. The studio does not need to decide ownership; it needs a repeatable way to capture the agreed record."],
      ["Sync teams", "A supervisor or clearance contact needs fast answers. Signed splits, publisher contacts, and master ownership are the difference between easy clearance and delay."]
    ],
    scenario: "Three people write a hook, one producer builds the track, and a featured artist adds a melodic change at the end of the night. Without a signed split sheet, everyone may remember the contribution differently two months later when a sync opportunity appears.",
    tableTitle: "Split sheet fields that matter most",
    tableHeaders: ["Field", "Why it matters", "Best practice"],
    rows: [
      ["Legal name and email", "Identifies the person who can sign and receive the completed record.", "Collect it in the room or through a secure invitation link."],
      ["Writer share", "Shows each contributor's composition ownership.", "Validate that total composition ownership equals 100%."],
      ["Publisher, PRO, and IPI", "Helps registrations and royalty matching downstream.", "Leave unknown data marked as unknown rather than guessing."],
      ["Master owner/contact", "Sync and licensing requests may require recording approval too.", "Store it beside the split sheet, even if it is not the same document."]
    ],
    checklistTitle: "End-of-session split sheet checklist",
    checklist: ["Name every contributor who helped create the composition.", "Agree on writer shares before anyone leaves.", "Confirm publisher and PRO details when known.", "Record whether master ownership is separate.", "Send the completed PDF to every signer."],
    nextStep: "Use the free web plan to create three completed split sheets per month, then upgrade only when the workflow becomes part of your regular sessions."
  },
  "songwriting-splits-writer-share-publisher-share": {
    audienceTitle: "Who needs writer and publisher share clarity",
    audience: [
      ["Songwriters", "Understand whether a number represents composition ownership, writer share display, or publisher administration before saying yes."],
      ["Producers", "A songwriting percentage is not the same as a master royalty. Write both down separately when both exist."],
      ["Publishers", "Consistent writer, publisher, PRO, and IPI data reduces registration conflicts and missing income."],
      ["Managers", "Keep one ownership summary that can be translated into each platform's required share format."]
    ],
    scenario: "A manager asks whether a song is split 25/25/50, but the PRO registration screen shows writer and publisher fields separately. If the team does not understand the display scale, one accurate agreement can accidentally become a mismatched registration.",
    tableTitle: "Share terms in plain English",
    tableHeaders: ["Term", "What it describes", "Common mistake"],
    rows: [
      ["Writer share", "The creator side of composition income.", "Treating a performer credit as automatic songwriting ownership."],
      ["Publisher share", "The publishing or administration side of the composition.", "Leaving self-administered writers with no publishing contact."],
      ["Composition total", "The full ownership of the song itself.", "Mixing a 100% ownership record with a 200% PRO display."],
      ["Master royalty", "A payment tied to the sound recording.", "Calling producer points publishing."]
    ],
    checklistTitle: "Clean split-to-registration checklist",
    checklist: ["Start with the signed 100% composition ownership agreement.", "Collect writer legal names and IPIs.", "Collect publisher/admin names and IPIs.", "Follow each PRO's current entry format.", "Store screenshots or confirmations after registration."],
    nextStep: "After the split is final, compare the same data against the PRO and MLC records so the song does not drift into conflicting versions."
  },
  "sync-licensing-checklist": {
    audienceTitle: "How sync-ready teams use this checklist",
    audience: [
      ["Sync producers", "Make your catalog easy to clear before pitching. Music supervisors move quickly when ownership, files, and contacts are ready."],
      ["Artists", "Do not wait for a placement request to learn who controls your publishing or master. Build the clearance folder first."],
      ["Studios", "Offer a session closeout system that leaves clients with split data, metadata, and deliverables organized for future licensing."],
      ["Managers", "Use one ownership/contact sheet for every song you pitch so approvals do not depend on scattered messages."]
    ],
    scenario: "A music supervisor asks for a clean, one-stop instrumental by tomorrow morning. The track is perfect, but the team cannot confirm one writer's publisher or whether the producer used a restricted loop. The opportunity moves on because the song is not clearance-ready.",
    tableTitle: "Sync readiness table",
    tableHeaders: ["Requirement", "What to prepare", "Why it wins"],
    rows: [
      ["Composition clearance", "Signed splits, publishers, PROs, IPIs, and approval contacts.", "Shows who can authorize the song."],
      ["Master clearance", "Master owner, label or artist contact, and any producer obligations.", "Shows who can authorize the recording."],
      ["Audio package", "Full mix, instrumental, clean version, stems, and cutdowns when available.", "Helps editors move fast."],
      ["Metadata", "Mood, genre, tempo, themes, lyrics, explicit status, ISRC, ISWC when assigned.", "Improves catalog search and AI discovery."]
    ],
    checklistTitle: "Before sending a sync pitch",
    checklist: ["Confirm every composition owner and master owner.", "Verify samples and interpolations are cleared or disclosed.", "Prepare clean, instrumental, and high-quality WAV files.", "Write a short scene-use description.", "Confirm who can quote and approve the license."],
    nextStep: "Use Split Sheet Studio to make the rights side as polished as the creative pitch, especially before pushing songs into sync libraries or supervisor inboxes."
  },
  "one-stop-music-licensing-rights-clearance": {
    audienceTitle: "Who needs one-stop clearance clarity",
    audience: [
      ["Sync producers", "A one-stop claim can help a pitch, but only when the composition and master approval path is actually documented and current."],
      ["Artists", "If you control both sides, prove it with splits, master notes, publisher data, and sample disclosures before a music supervisor asks."],
      ["Studios", "A closeout workflow turns a finished session into a licensable asset by capturing the facts that clearance teams need later."],
      ["Managers", "Keep one approval map for every song so quotes, restrictions, and rights-holder responses do not live in scattered texts."]
    ],
    scenario: "A supervisor needs a soulful hook for a streaming drama by tomorrow. The song feels perfect, but the artist cannot confirm whether a co-writer assigned publishing or whether the master producer needs approval. The creative fit is there, but the clearance confidence is not.",
    tableTitle: "One-stop clearance map",
    tableHeaders: ["Clearance layer", "What to document", "What can block the license"],
    rows: [
      ["Composition", "Writers, shares, publishers, PROs, IPIs, and approval contacts.", "Missing co-writers, conflicting registrations, or publisher approval rights."],
      ["Master", "Master owner, label or artist contact, producer obligations, and recording version.", "Unclear ownership, unapproved featured artists, or unpaid production terms."],
      ["Third-party material", "Samples, interpolations, loops, beat licenses, and restrictions.", "No written clearance or a license that excludes sync."],
      ["Delivery", "Instrumental, clean version, full mix, stems when available, lyrics, metadata, and quote contact.", "Slow file delivery or metadata that does not match the rights record."]
    ],
    checklistTitle: "One-stop readiness checklist",
    checklist: ["Verify that signed composition splits total 100%.", "Confirm every publisher, administrator, and approval contact.", "Document who owns or controls the exact master recording.", "List samples, loops, interpolations, and beat-license restrictions.", "Prepare a clean rights packet that can be sent within one business day."],
    nextStep: "Build a one-page rights packet for every sync candidate, then link that packet to the signed split sheet and final audio folder."
  },
  "recording-studio-session-closeout-workflow": {
    audienceTitle: "How each role benefits from session closeout",
    audience: [
      ["Studio owners", "A five-minute closeout system makes the studio feel premium because clients leave with organized rights data, not only audio files."],
      ["Engineers", "You do not have to decide ownership. You need a calm workflow that captures names, credits, splits, and unfinished questions before the room empties."],
      ["Artists", "Closeout protects momentum. The release, registration, and sync prep start from one signed record instead of memory."],
      ["Managers", "A repeatable studio handoff makes it easier to track credits, contacts, approvals, and deliverables across multiple songs."]
    ],
    scenario: "The last bounce is printing, the artist is happy, and the next client is almost there. Without a closeout habit, the credits, splits, master notes, and remote signatures get pushed into tomorrow. Two weeks later, nobody remembers the exact agreement with confidence.",
    tableTitle: "Five-minute studio closeout map",
    tableHeaders: ["Minute", "Studio action", "Why it matters"],
    rows: [
      ["1", "Name the song, version, session date, artist, producer, engineer, and all contributors.", "Creates the record before files and memories scatter."],
      ["2", "Capture roles, emails, PRO or publisher details when known, and master-side notes.", "Connects the session to release, royalty, and clearance workflows."],
      ["3", "Enter composition percentages and confirm the total reaches 100%.", "Prevents release-week cleanup and unclear ownership claims."],
      ["4", "Send secure signature links to everyone in the room or remote.", "Lets missing collaborators finish without delaying the whole project."],
      ["5", "Deliver the final PDF and store it beside the audio, metadata, invoice, and project notes.", "Gives the artist, studio, and manager one source of truth."]
    ],
    checklistTitle: "Studio closeout checklist",
    checklist: ["Confirm the working title and alternate title.", "List every contributor, role, email, and credit spelling.", "Separate composition splits from producer fees, points, and master terms.", "Capture sample, loop, beat-license, and featured-artist notes.", "Send the same completed PDF to every signer and back it up."],
    nextStep: "Make closeout part of the booked session, especially for clients releasing songs, pitching sync, or bringing multiple collaborators into the room."
  },
  "recording-studio-client-intake-form-music-sessions": {
    audienceTitle: "Who benefits from studio intake paperwork",
    audience: [
      ["Studio owners", "Use intake to reduce surprise risk before the clock starts and make the studio feel organized from the first booking."],
      ["Engineers", "Know who is attending, what files are expected, and whether beats, samples, or outside producers are involved before the session gets loud."],
      ["Artists", "Arrive with the right collaborators, files, credits, and release questions instead of trying to rebuild the business side afterward."],
      ["Managers", "Use one intake record to coordinate budgets, deliverables, rights questions, and follow-up responsibilities."]
    ],
    scenario: "A client books a vocal session, brings a leased beat, adds a featured artist, and asks for a radio edit at midnight. Intake would have flagged the beat license, credits, payment owner, and deliverables before the room was under pressure.",
    tableTitle: "Studio intake fields that prevent cleanup",
    tableHeaders: ["Field", "Ask before the session", "Why it matters"],
    rows: [
      ["Project basics", "Artist, song title, session goal, release date, and main contact.", "Keeps booking, files, and follow-up tied to one record."],
      ["People", "Writers, producers, featured artists, engineer, manager, label, and publisher contacts.", "Shows who may need credit, approval, or signatures."],
      ["Rights inputs", "Beat license, samples, loops, outside stems, and master owner expectations.", "Flags restrictions before the song is delivered."],
      ["Deliverables", "Full mix, instrumental, clean edit, stems, session files, and PDF paperwork.", "Prevents mismatch between client expectations and studio handoff."]
    ],
    checklistTitle: "Pre-session intake checklist",
    checklist: ["Collect the artist and manager contact.", "Ask who is writing or producing in the room.", "Ask whether third-party beats, samples, or stems are involved.", "Confirm expected deliverables and deadline.", "Prepare the split-sheet workflow before the session starts."],
    nextStep: "Turn intake into a normal booking step, then finish the record with session closeout before the client leaves."
  },
  "recording-studio-release-delivery-checklist": {
    audienceTitle: "Who needs a studio delivery checklist",
    audience: [
      ["Studio owners", "A clean delivery checklist makes your room feel premium because the client receives organized audio, metadata, and paperwork."],
      ["Engineers", "Use the same delivery package each time so final files, versions, credits, and split PDFs do not disappear into text threads."],
      ["Artists", "Know what you should receive from a paid session before distribution, registration, or sync pitching begins."],
      ["Managers", "Use the delivery record to verify release readiness and assign missing business tasks."]
    ],
    scenario: "The artist loves the final mix but only receives a WAV called finalfinal2.wav. A month later, the distributor needs credits, the sync library wants an instrumental, and the manager asks where the signed split sheet lives.",
    tableTitle: "Release delivery package",
    tableHeaders: ["Package layer", "Include this", "Why it matters"],
    rows: [
      ["Audio", "Final WAV, instrumental, clean version, stems when purchased, and version notes.", "Supports release, editing, content, and sync workflows."],
      ["Metadata", "Title, artist, contributors, credits, explicit status, tempo, genre, and identifiers.", "Keeps distributor and catalog data consistent."],
      ["Rights", "Signed split sheet, master notes, sample disclosures, and producer terms summary.", "Clarifies ownership and approval paths."],
      ["Storage", "Folder path, backup location, delivery date, and recipient list.", "Creates a durable trail after the session ends."]
    ],
    checklistTitle: "Before marking a session delivered",
    checklist: ["Confirm final audio versions are named clearly.", "Attach the completed split-sheet PDF or pending signature status.", "Save credits and metadata in the same folder.", "List master-side notes separately from composition ownership.", "Send the same delivery recap to the artist and manager."],
    nextStep: "Make every studio delivery feel like a release handoff, not just an exported file."
  },
  "artist-release-paperwork-checklist-before-distribution": {
    audienceTitle: "How artists use release paperwork",
    audience: [
      ["Independent artists", "Use this before DistroKid, TuneCore, UnitedMasters, CD Baby, or any distributor upload so your ownership data is not guessed under deadline."],
      ["Producers", "Confirm whether your deal includes composition share, master royalty, credit, fee, or a separate beat license."],
      ["Managers", "Create one release packet before the song is uploaded, promoted, pitched, or registered."],
      ["Studios", "Help clients leave with a release-ready folder that makes them more likely to return."]
    ],
    scenario: "A song is ready for release, but the artist is missing a producer credit, the writer shares are still in a group chat, and the beat license has not been reviewed for monetization or sync restrictions.",
    tableTitle: "Artist release paperwork map",
    tableHeaders: ["Before upload", "Confirm", "Do not confuse"],
    rows: [
      ["Split sheet", "Composition writers and shares.", "Producer points or master royalties."],
      ["Credits", "Producer, engineer, featured artist, mixer, mastering, and studio names.", "Ownership by itself."],
      ["Master notes", "Who owns the recording and who can approve uses.", "The underlying composition."],
      ["Registrations", "PRO, MLC, copyright, distributor, and metadata tasks.", "One platform doing everything automatically."]
    ],
    checklistTitle: "Artist release paperwork checklist",
    checklist: ["Complete a signed split sheet.", "Confirm producer and featured artist terms.", "Review beat, sample, and loop restrictions.", "Prepare clean credits and metadata.", "Store release, registration, and licensing contacts together."],
    nextStep: "Create the free web split sheet before the distributor upload, then upgrade when this becomes part of every release."
  },
  "independent-artist-sync-licensing-starter-kit": {
    audienceTitle: "Who should build a sync starter kit",
    audience: [
      ["Artists", "Build a simple sync packet before submitting music to libraries, publishers, brands, and supervisors."],
      ["Sync producers", "Use the kit to package production music with rights answers and useful versions from day one."],
      ["Managers", "Make pitching easier by keeping approval contacts, restrictions, files, and metadata in one place."],
      ["Studios", "Offer sync-ready delivery as an upsell for clients with placement goals."]
    ],
    scenario: "A creator finally gets a music supervisor reply, but the instrumental is missing, the master owner is unclear, and the publisher contact is buried in an old email. The opportunity needed a starter kit before the pitch went out.",
    tableTitle: "Sync starter kit components",
    tableHeaders: ["Component", "What belongs in it", "Why it helps"],
    rows: [
      ["Rights", "Splits, publishers, master owner, sample notes, and approval contacts.", "Answers clearance questions quickly."],
      ["Files", "Full mix, instrumental, clean, stems, and alt endings when available.", "Helps editors test the song fast."],
      ["Metadata", "Mood, genre, tempo, lyrics, themes, ISRC, ISWC when assigned.", "Improves discovery and catalog search."],
      ["Pitch", "Short scene-use copy and contact for quote/approval.", "Turns interest into a clear next action."]
    ],
    checklistTitle: "Sync starter kit checklist",
    checklist: ["Pick five songs with the strongest clearance records.", "Attach signed splits and master notes.", "Prepare instrumentals and clean versions.", "Write searchable mood and scene descriptions.", "List who can approve and quote each song."],
    nextStep: "Start with a small clean catalog instead of pitching a large messy one."
  },
  "music-supervisor-pitch-package": {
    audienceTitle: "Who needs a supervisor-ready pitch package",
    audience: [
      ["Sync producers", "Package songs so supervisors can hear, search, edit, and clear without a long investigation."],
      ["Artists", "Pitch fewer songs with stronger metadata, versions, and rights confidence."],
      ["Managers", "Keep pitch materials consistent across publishers, libraries, agencies, and direct supervisor relationships."],
      ["Studios", "Use the package format to help clients prepare music for TV, film, ads, trailers, and games."]
    ],
    scenario: "Two songs fit the brief. One arrives as a streaming link with no rights details. The other arrives with a download link, instrumental, lyrics, ownership summary, and contact. The second song is easier to move forward.",
    tableTitle: "Pitch package layers",
    tableHeaders: ["Layer", "Include", "Avoid"],
    rows: [
      ["Creative", "Streaming preview, download link, short description, mood, genre, tempo.", "Long hype paragraphs with no useful scene detail."],
      ["Edit-ready", "Instrumental, clean, stems, cutdowns, alt endings when available.", "Only sending a mastered vocal mix."],
      ["Clearance", "Composition/master contacts, one-stop status, restrictions, sample notes.", "Saying one-stop without proof."],
      ["Admin", "Lyrics, identifiers, writer/publisher data, quote contact.", "Forcing the supervisor to ask for basics."]
    ],
    checklistTitle: "Before sending a pitch package",
    checklist: ["Match the brief exactly.", "Send only songs you can clear.", "Include instrumental and clean files where possible.", "Summarize rights status honestly.", "Make quote and approval contacts obvious."],
    nextStep: "Use a signed split and a clear rights packet to make the creative pitch easier to trust."
  },
  "producer-agreement-vs-split-sheet": {
    audienceTitle: "Who needs producer paperwork separation",
    audience: [
      ["Artists", "Know when you are agreeing to songwriting ownership, master royalties, fees, credits, or beat-license terms."],
      ["Producers", "Protect the exact deal you made without relying on a single vague percentage."],
      ["Managers", "Compare producer agreements, split sheets, invoices, and distributor credits before release."],
      ["Studios", "Help clients separate creative ownership from production services during closeout."]
    ],
    scenario: "The producer says they get 25%. The artist thinks that means publishing. The manager thinks it means master points. The distributor only asks for credits. One number has become four different assumptions.",
    tableTitle: "Producer agreement versus split sheet",
    tableHeaders: ["Document", "Usually covers", "Do not use it to replace"],
    rows: [
      ["Split sheet", "Composition writers and ownership percentages.", "Producer fee, master royalty, or beat-license restrictions."],
      ["Producer agreement", "Fee, points, deliverables, credits, approvals, and master-side terms.", "Co-writer confirmation when songwriting share exists."],
      ["Beat license", "Permission to use an instrumental under specific terms.", "Full copyright transfer unless it says so."],
      ["Invoice/receipt", "Payment trail.", "Ownership agreement."]
    ],
    checklistTitle: "Producer paperwork checklist",
    checklist: ["Label every percentage by right.", "Document composition share on the split sheet.", "Document master points separately.", "Save the beat license and sample notes.", "Match credits across all release systems."],
    nextStep: "When a producer also co-writes, use both documents: one for composition splits and one for production terms."
  },
  "music-catalog-metadata-spreadsheet-for-sync": {
    audienceTitle: "Who needs a catalog metadata spreadsheet",
    audience: [
      ["Artists", "Use one spreadsheet to keep songs searchable, pitchable, and connected to rights paperwork."],
      ["Sync producers", "Track clearance status, versions, moods, stems, and approval contacts across a growing catalog."],
      ["Managers", "Use the sheet to know what can be pitched today and what still needs cleanup."],
      ["Studios", "Deliver metadata sheets with session files so clients leave with organized catalog assets."]
    ],
    scenario: "A catalog has 80 tracks, but nobody can filter by instrumental availability, clean version, one-stop status, master owner, or sample risk. The music exists, but the catalog cannot move fast.",
    tableTitle: "Catalog spreadsheet columns",
    tableHeaders: ["Column group", "Fields", "Purpose"],
    rows: [
      ["Creative search", "Mood, genre, tempo, vocal type, lyrical theme, scene use.", "Helps people find the right song fast."],
      ["Rights", "Writers, shares, publishers, master owner, samples, restrictions.", "Shows clearance readiness."],
      ["Files", "Full mix, instrumental, clean, stems, lyrics, artwork, links.", "Supports editor and supervisor requests."],
      ["Admin", "ISRC, ISWC, IPI, release date, distributor, contact, notes.", "Connects metadata to registrations."]
    ],
    checklistTitle: "Spreadsheet cleanup checklist",
    checklist: ["Create one row per song or recording version.", "Link the signed split-sheet PDF.", "Mark one-stop status only when verified.", "Track missing files and missing contacts.", "Review the sheet before every sync pitch cycle."],
    nextStep: "Treat the spreadsheet as the catalog map and the signed split as the ownership source."
  },
  "songwriter-collaboration-agreement-checklist": {
    audienceTitle: "Who needs a collaboration checklist",
    audience: [
      ["Songwriters", "Use the checklist before a writing session turns into a release, registration, or royalty argument."],
      ["Artists", "Make sure features, hooks, toplines, and production contributions are captured while the session is fresh."],
      ["Producers", "Clarify whether your creative contribution earns songwriting ownership, credit, fee, master royalty, or multiple rights."],
      ["Managers", "Keep collaboration records consistent across split sheets, publishing, distributor uploads, and sync pitches."]
    ],
    scenario: "A hook writer joins for one hour, a producer changes the chords, and the artist finishes lyrics later. Everyone loves the song, but nobody writes down what each collaborator agreed to before release momentum begins.",
    tableTitle: "Collaboration agreement checkpoints",
    tableHeaders: ["Checkpoint", "Question to answer", "Where to record it"],
    rows: [
      ["Authorship", "Who contributed lyrics, melody, composition, or arrangement?", "Split sheet notes and session recap."],
      ["Ownership", "What percentages did the collaborators agree to?", "Signed split sheet."],
      ["Administration", "Who has publisher, PRO, IPI, and registration details?", "Metadata and publishing record."],
      ["Approval", "Who can approve sync, samples, revisions, or release changes?", "Collaboration notes or separate agreement."]
    ],
    checklistTitle: "Before collaborators leave",
    checklist: ["Name every contributor.", "Separate creative credit from ownership.", "Agree on composition splits.", "Document unresolved questions.", "Send the same completed record to everyone."],
    nextStep: "Make the split-sheet conversation a normal part of collaboration, not a punishment after the song gets valuable."
  },
  "performance-rights-organizations-explained": {
    audienceTitle: "How different teams should think about PROs",
    audience: [
      ["Songwriters", "A PRO can collect public performance royalties, but it does not replace a signed split sheet or copyright registration strategy."],
      ["Producers", "If you receive a composition share, make sure your PRO, IPI, and publisher data are captured before registration."],
      ["Studios", "Ask for PRO and IPI details during closeout. It turns a session document into registration-ready data."],
      ["Sync teams", "PRO data helps identify owners, but sync approval still depends on the controlling parties and the master rights chain."]
    ],
    scenario: "A songwriter joins a PRO and assumes the song is handled. Months later, the co-writers discover the work was never registered accurately, publisher data is missing, and the producer's agreed share is not reflected anywhere.",
    tableTitle: "PROs versus other rights systems",
    tableHeaders: ["System", "Main purpose", "What it does not replace"],
    rows: [
      ["PRO", "Public performance royalties for compositions.", "Split sheets, mechanical registration, master royalties, or sample clearance."],
      ["The MLC", "U.S. digital audio mechanical royalties for eligible compositions.", "PRO performance royalties or master royalties."],
      ["Distributor/label", "Release delivery and master-side accounting.", "Composition ownership registration."],
      ["Copyright Office", "Public copyright registration record.", "Royalty collection or collaborator deal terms."]
    ],
    checklistTitle: "Registration data to collect early",
    checklist: ["Writer legal names and professional names.", "PRO affiliations.", "IPI or CAE numbers.", "Publisher or self-published status.", "Complete composition shares that match the signed split sheet."],
    nextStep: "Treat PRO registration as one step in a larger rights workflow, then link it back to the signed record for the song."
  },
  "the-mlc-mechanical-royalties-guide": {
    audienceTitle: "Who should care about MLC data",
    audience: [
      ["Self-administered writers", "The MLC can matter when you control your publishing and need eligible U.S. digital audio mechanical royalties matched correctly."],
      ["Producers", "If you own part of the composition, your writer and publisher data should be captured before anyone registers the work."],
      ["Managers", "Mechanical royalty matching depends on clean titles, writers, shares, publishers, and recording links."],
      ["Studios", "Collecting IPI and publisher details in the session makes later MLC cleanup easier for clients."]
    ],
    scenario: "A song starts streaming, but the work data is incomplete. The artist remembers the split, the producer has a different email, and nobody knows whether the co-writer is self-administered. Matching and claiming become a cleanup project instead of a routine step.",
    tableTitle: "MLC preparation table",
    tableHeaders: ["Data point", "Why it matters", "Where it starts"],
    rows: [
      ["Work title and alternate titles", "Helps match usage to the composition.", "Song metadata sheet."],
      ["Writers and shares", "Defines the composition ownership picture.", "Signed split sheet."],
      ["Publisher/admin data", "Identifies who administers the share.", "Writer or publisher records."],
      ["ISRC links", "Connects recordings to the underlying work.", "Distributor and release metadata."]
    ],
    checklistTitle: "Before registering or claiming works",
    checklist: ["Confirm the signed splits.", "Collect publisher and self-administered status.", "Add IPIs where available.", "Match recordings and ISRCs to the work.", "Review conflicts or duplicate registrations promptly."],
    nextStep: "Use the split sheet as the source record, then enter the same ownership data into the MLC workflow under the organization's current rules."
  },
  "music-copyright-musical-work-vs-sound-recording": {
    audienceTitle: "Why the two copyrights matter by role",
    audience: [
      ["Artists", "You may perform on a recording without owning the underlying composition, or write a song without owning the master."],
      ["Producers", "Producer compensation can touch composition ownership, master royalties, fees, or all three. Label each right clearly."],
      ["Studios", "A studio record should separate writer splits from master delivery, credits, session files, and payment terms."],
      ["Sync teams", "A placement using an existing recording usually needs both composition and master approval."]
    ],
    scenario: "A song has a clean writer split, but the master was paid for by a label, recorded with a featured artist, and built from a licensed beat. The composition record is useful, but it does not answer every clearance question.",
    tableTitle: "Composition versus master map",
    tableHeaders: ["Layer", "Covers", "Typical document"],
    rows: [
      ["Musical work", "Melody, lyrics, and composition ownership.", "Split sheet, publishing agreement, copyright registration."],
      ["Sound recording", "A particular recorded performance or master.", "Master agreement, label agreement, producer agreement."],
      ["Samples/interpolations", "Third-party composition and/or recording rights.", "Sample clearance or interpolation license."],
      ["Credits", "Public acknowledgment of roles.", "Credit sheet, liner notes, distributor metadata."]
    ],
    checklistTitle: "One-page rights map",
    checklist: ["List composition owners and shares.", "List master owner and approval contact.", "List producers, performers, and credits.", "List samples and clearance status.", "Store identifiers and final documents together."],
    nextStep: "Build this rights map before sync pitching, because a supervisor may need both sides answered in the same email."
  },
  "remote-collaboration-split-sheets": {
    audienceTitle: "Remote workflow priorities by role",
    audience: [
      ["Artists", "You can sign from your phone, but you still need to review every contributor and percentage before agreeing."],
      ["Producers", "Send each collaborator an individual link so one person's signature cannot stand in for the whole team."],
      ["Studios", "Remote signing keeps late-arriving collaborators from delaying final records after the session ends."],
      ["Managers", "Watch signature status and correction requests so releases are not blocked by one missing approval."]
    ],
    scenario: "A hook writer is in Atlanta, the producer is in Austin, and the featured artist is on tour. Everyone agrees in the chat, but no one signs a unified record. Remote invitations turn that scattered agreement into one completed document.",
    tableTitle: "Remote signature control table",
    tableHeaders: ["Control", "Why it matters", "Implementation note"],
    rows: [
      ["Unique links", "Prevents one shared URL from representing multiple people.", "Send one invite per signer."],
      ["Full-document review", "Signers need to see the whole ownership picture.", "Show all contributors and totals."],
      ["Locked final PDF", "Protects the completed record from silent edits.", "Finalize only after all required signatures."],
      ["Status tracking", "Keeps managers from guessing who still needs to sign.", "Show pending, viewed, signed, and expired states."]
    ],
    checklistTitle: "Remote signing checklist",
    checklist: ["Create one authoritative draft.", "Validate totals before sending invites.", "Send unique links to each contributor.", "Correct errors before collecting signatures.", "Deliver the same completed copy to everyone."],
    nextStep: "Run one test remote split with yourself as two signers before using it on a paid client session."
  },
  "recording-studio-paperwork-checklist": {
    audienceTitle: "How studios can turn paperwork into a product advantage",
    audience: [
      ["Studio owners", "A consistent closeout workflow makes the studio feel more professional and reduces post-session confusion."],
      ["Engineers", "You should not have to argue ownership; you need a fast way to capture the agreement the collaborators make."],
      ["Artists", "Ask the studio to help capture credits, splits, and metadata while everyone is still present."],
      ["Sync producers", "Studios that organize paperwork create songs that are easier to pitch, clear, and monetize."]
    ],
    scenario: "The mix sounds great, the artist is excited, and everyone leaves. A month later, the distributor needs credits, the manager asks for publishing data, and the producer wants confirmation of the split. The paperwork should have been part of the session, not a rescue mission.",
    tableTitle: "Studio paperwork operating system",
    tableHeaders: ["Moment", "Capture this", "Owner"],
    rows: [
      ["Before session", "Booking terms, participants, samples, expected deliverables.", "Studio manager or assistant."],
      ["During session", "Contributors, roles, credits, contact information.", "Engineer or session lead."],
      ["Closeout", "Splits, signatures, master notes, final file locations.", "Session lead."],
      ["After session", "Final PDF, metadata folder, backups, invoices.", "Studio/admin team."]
    ],
    checklistTitle: "Studio closeout checklist",
    checklist: ["Confirm title and alternate title.", "Capture all contributors and credits.", "Validate composition splits.", "Document master and producer terms separately.", "Deliver the split PDF and session recap."],
    nextStep: "Offer split-sheet closeout as part of the studio experience, especially for artists preparing songs for sync licensing or distribution."
  },
  "producer-splits-for-beats": {
    audienceTitle: "Producer split clarity by role",
    audience: [
      ["Beat producers", "State whether the buyer gets a license, exclusive rights, composition ownership, stems, master royalty terms, or only permission to use the beat."],
      ["Artists", "Buying a beat does not automatically answer publishing, master, sample, credit, or sync approval questions."],
      ["Managers", "Compare the beat license, split sheet, distributor credits, and producer agreement before release."],
      ["Studios", "Flag beat-license questions early so the artist does not discover restrictions after recording vocals."]
    ],
    scenario: "An artist buys a beat online, writes a hook with friends, records at a studio, and uploads the song. Later, the producer license limits monetization and the writers never signed composition splits. The release now has avoidable risk.",
    tableTitle: "Producer deal terms to separate",
    tableHeaders: ["Term", "Document it as", "Do not confuse it with"],
    rows: [
      ["Beat license", "Permission to use the production under defined limits.", "Copyright transfer."],
      ["Composition share", "Songwriting ownership percentage.", "Producer points."],
      ["Producer points", "Master royalty or master-side payment.", "Publishing share."],
      ["Credit", "Public wording for the producer role.", "Ownership by itself."]
    ],
    checklistTitle: "Before releasing a beat-based song",
    checklist: ["Read the beat license and usage limits.", "Confirm sample and loop status.", "Agree on songwriting splits.", "Document producer fees or points.", "Match credits across distributor, split sheet, and metadata."],
    nextStep: "Use the free web plan to document test collaborations, then upgrade when producer split paperwork becomes part of your regular release workflow."
  },
  "music-publishing-before-sync-licensing": {
    audienceTitle: "Publishing cleanup for sync-minded catalogs",
    audience: [
      ["Independent artists", "You can pitch without a traditional publisher, but you still need ownership, registration, and approval authority organized."],
      ["Sync producers", "The catalog that clears fastest often beats the catalog with unclear publishing."],
      ["Studios", "Ask for publisher and administrator info during closeout so the client leaves with a sync-ready record."],
      ["Managers", "Create one approval map for every song before pitching it as available for sync."]
    ],
    scenario: "A track is creatively perfect for an ad, but one writer has a publisher, another is self-administered, and the master owner is unclear. The pitch becomes a publishing investigation instead of a licensing conversation.",
    tableTitle: "Publishing pre-pitch audit",
    tableHeaders: ["Question", "Why it matters", "Where to verify"],
    rows: [
      ["Who owns the composition?", "Sync approval starts with the song owners.", "Signed split sheet and publisher records."],
      ["Who administers each share?", "The approval contact may not be the writer.", "Publisher/admin agreement or PRO data."],
      ["Who owns the master?", "Existing recording use needs master permission too.", "Artist, label, or producer agreement."],
      ["Are samples cleared?", "Uncleared material can block placements.", "Sample licenses and production notes."]
    ],
    checklistTitle: "Publishing cleanup checklist",
    checklist: ["Finalize splits.", "Verify publisher and administrator contacts.", "Register or correct works.", "Link ISRCs to compositions.", "Define who can approve sync uses."],
    nextStep: "Once this audit is complete, the sync pitch can focus on fit, fee, usage, and timing instead of emergency ownership cleanup."
  },
  "music-metadata-isrc-iswc-ipi-guide": {
    audienceTitle: "Metadata priorities by music role",
    audience: [
      ["Artists", "Metadata is how platforms, royalties, and licensors connect your release to the right people."],
      ["Producers", "Correct credits and identifiers help your work remain visible after files leave the session."],
      ["Studios", "A metadata checklist makes the studio more valuable because clients leave with release-ready information."],
      ["Sync teams", "Clean metadata makes catalog search, clearance, cue sheets, and AI discovery more reliable."]
    ],
    scenario: "A song has the right file, wrong spelling for a writer, missing IPI, and no connection between the ISRC and composition record. The music exists, but the business systems cannot confidently match it.",
    tableTitle: "Identifier cheat sheet",
    tableHeaders: ["Identifier", "Identifies", "Common mistake"],
    rows: [
      ["ISRC", "A specific recording or music video.", "Using it as a song composition ID."],
      ["ISWC", "The musical work/composition.", "Expecting it before the work is assigned one."],
      ["IPI", "A writer, composer, or publisher identity.", "Treating it as a private login number."],
      ["UPC/EAN", "A release product.", "Using it to represent individual song ownership."]
    ],
    checklistTitle: "Metadata source-of-truth checklist",
    checklist: ["Confirm exact titles and alternate titles.", "Capture writers, shares, publishers, PROs, and IPIs.", "Add ISRCs for each recording version.", "Add ISWC when assigned.", "Store lyrics, explicit status, credits, and licensing contacts."],
    nextStep: "Use the signed split as the ownership source, then let metadata carry that agreement through release, royalties, and licensing."
  }
};

function renderTableOfContents(config) {
  return `<nav class="blog-toc" aria-labelledby="table-of-contents-title"><h2 id="table-of-contents-title">Table of contents</h2><ol>${config.sections.map((section) => `<li><a href="#${section.id}">${section.title}</a></li>`).join("")}${config.showFieldGuide !== false && blogUpgradeGuides[config.slug] ? '<li><a href="#practical-field-guide">Practical field guide</a></li>' : ''}<li><a href="#frequently-asked-questions">Frequently asked questions</a></li></ol></nav>`;
}

function renderBlogUpgradeGuide(config) {
  if (config.showFieldGuide === false) return "";
  const guide = blogUpgradeGuides[config.slug];
  if (!guide) return "";
  const tableHead = guide.tableHeaders.map((header) => `<th scope="col">${header}</th>`).join("");
  const tableRows = guide.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");
  return `<section class="blog-field-guide" id="practical-field-guide"><div class="section-kicker">Practical field guide</div><h2>${guide.audienceTitle}</h2><div class="blog-role-grid">${guide.audience.map(([role, copy]) => `<article><h3>${role}</h3><p>${copy}</p></article>`).join("")}</div><div class="blog-scenario"><h3>Real session scenario</h3><p>${guide.scenario}</p></div><div class="blog-table-wrap"><h3>${guide.tableTitle}</h3><table><thead><tr>${tableHead}</tr></thead><tbody>${tableRows}</tbody></table></div><div class="blog-checklist"><h3>${guide.checklistTitle}</h3><ol>${guide.checklist.map((item) => `<li>${item}</li>`).join("")}</ol></div>${renderSessionSystem(config)}${renderTeamMessage(config, guide)}${renderGreenLightQuestions(config)}<aside class="blog-next-step"><strong>Best next step</strong><p>${guide.nextStep}</p><a href="https://app.splitsheetstudio.com/signup">Start with 3 free web split sheets per month</a></aside></section>`;
}

function renderSessionSystem(config) {
  return `<div class="blog-session-system"><h3>Turn this into a repeatable session system</h3><p>The best music-rights workflow is boring in the right way: the same fields, same closeout habit, same storage location, and same confirmation path every time. For ${config.primaryKeyword} work, that means the team should not wait until release week, a sync pitch, or a payment dispute to collect the facts.</p><ol><li><strong>Before the session:</strong> ask who is writing, producing, engineering, featured, managing, or controlling the master.</li><li><strong>During the session:</strong> capture names, emails, roles, titles, and any beat, sample, or publishing questions as they come up.</li><li><strong>Before people leave:</strong> confirm percentages, approval contacts, and unfinished questions while everyone can still answer.</li><li><strong>After the session:</strong> save the completed record beside the audio files, metadata, stems, invoices, and release notes.</li></ol><p>That rhythm helps artists, producers, studios, managers, and sync teams move faster because the catalog becomes organized by default instead of cleaned up in a panic.</p></div>`;
}

function renderTeamMessage(config, guide) {
  return `<div class="blog-team-message"><h3>Copy-ready team message</h3><p>Use this when a collaborator, manager, engineer, or artist needs a friendly nudge without making the conversation feel heavy.</p><blockquote><p>Before we move this song forward, I want to make sure the ${config.primaryKeyword} details are clean. Please review the current title, contributors, shares, publisher or master information, and any sample or credit notes. If anything is missing or incorrect, reply before we sign or register anything so the final record matches what everyone actually agreed to.</p></blockquote><p>This kind of message works because it asks for confirmation before there is a problem. It also creates a written trail showing that the team tried to verify the important details before release, licensing, registration, or delivery.</p></div>`;
}

function renderGreenLightQuestions(config) {
  return `<div class="blog-green-light"><h3>Green-light questions before you move forward</h3><p>Before treating this ${config.category.toLowerCase()} workflow as finished, make sure a person outside the session could understand the record without calling everyone back. A strong answer should be specific enough for a collaborator, publisher, studio admin, or sync clearance contact to act on it later.</p><ul><li>Does the record name every person or company that must approve, register, deliver, or receive a copy?</li><li>Do the percentages, identifiers, credits, and contacts match across the split sheet, metadata, distributor upload, and licensing notes?</li><li>Can the team explain what is still unknown without turning the unknown field into a guess?</li><li>Would the same information help a music supervisor, publisher, manager, or studio assistant move faster under a deadline?</li></ul></div>`;
}

function renderFaqs(faqs) {
  return `<section class="blog-faq" id="frequently-asked-questions"><h2>Frequently asked questions</h2>${faqs.map((faq) => `<details><summary>${faq.question}</summary><p>${faq.answer}</p></details>`).join("")}</section>`;
}

function renderSources(sourceKeys) {
  return `<aside class="blog-sources" aria-labelledby="article-sources-title"><h2 id="article-sources-title">Authoritative sources</h2><ul>${sourceKeys.map((key) => `<li><a href="${sourceLibrary[key][1]}" rel="noopener noreferrer">${sourceLibrary[key][0]}</a></li>`).join("")}</ul><p>This article is educational and is not legal, tax, or financial advice.</p></aside>`;
}

function renderBlakMarigoldSpotlight() {
  return `<aside class="blog-studio-spotlight" aria-labelledby="blak-marigold-studio-title"><div><span>From the studio</span><h2 id="blak-marigold-studio-title">About Blak Marigold Studio</h2><p>Split Sheet Studio was built inside <a href="https://www.blakmarigold.com/" rel="noopener noreferrer">Blak Marigold Studio</a>, an Austin-area creative facility helping artists move from recording to release-ready delivery. Explore <a href="https://www.blakmarigold.com/recording-studio" rel="noopener noreferrer">recording sessions</a>, <a href="https://www.blakmarigold.com/mixing-and-mastering" rel="noopener noreferrer">mixing and mastering</a>, and <a href="https://www.blakmarigold.com/sync" rel="noopener noreferrer">sync licensing support</a>.</p></div></aside>`;
}

function renderCreatorResources(limit = 11) {
  const links = [
    ["Split Sheet Studio", "https://splitsheetstudio.com/"],
    ["Create a free account", "https://app.splitsheetstudio.com/signup"],
    ["Windows VST3 plugin", "https://splitsheetstudio.com/plugin"],
    ["Music rights blog", "https://splitsheetstudio.com/blog"],
    ["Producer splits explained", "https://splitsheetstudio.com/blog/producer-splits-explained"],
    ["Master rights vs publishing rights", "https://splitsheetstudio.com/blog/master-rights-vs-publishing-rights"],
    ["Release checklist before DistroKid or TuneCore", "https://splitsheetstudio.com/blog/distrokid-tunecore-release-checklist"],
    ["Sync-ready song guide", "https://splitsheetstudio.com/blog/how-to-make-a-song-sync-ready"],
    ["AI music ownership guide", "https://splitsheetstudio.com/blog/ai-music-voice-clones-song-credits"],
    ["Complete split-sheet guide", "https://splitsheetstudio.com/blog/what-is-a-split-sheet-in-music"],
    ["Sync licensing checklist", "https://splitsheetstudio.com/blog/sync-licensing-checklist"],
    ["One-stop sync clearance", "https://splitsheetstudio.com/blog/one-stop-music-licensing-rights-clearance"],
    ["Studio session closeout", "https://splitsheetstudio.com/blog/recording-studio-session-closeout-workflow"],
    ["Remote collaboration guide", "https://splitsheetstudio.com/blog/remote-collaboration-split-sheets"],
    ["Blak Marigold Studio blog", "https://www.blakmarigold.com/blog"],
    ["Contact Blak Marigold Studio", "https://www.blakmarigold.com/contact"]
  ];
  return `<nav class="blog-resource-links" aria-labelledby="creator-resource-links-title"><h2 id="creator-resource-links-title">Creator resources</h2><p>Continue with the workflow, rights, and studio resources most relevant to your next release.</p><ul>${links.slice(0, limit).map(([label, href]) => `<li><a href="${href}">${label}<span aria-hidden="true">↗</span></a></li>`).join("")}</ul></nav>`;
}

function renderRelatedReading(articles) {
  return `<nav class="blog-resource-links" aria-labelledby="related-reading-title"><h2 id="related-reading-title">Keep reading</h2><ul>${articles.map(([label, slug]) => `<li><a href="/blog/${slug}">${label}</a></li>`).join("")}</ul></nav>`;
}

function createPost(config) {
  return {
    ...config,
    bodyHtml: `<p class="blog-definition"><strong>Quick answer:</strong> ${config.definition}</p><aside class="blog-takeaway"><strong>Session takeaway</strong><span>${config.takeaway}</span></aside>${renderTableOfContents(config)}${config.scopeNote ? `<p class="blog-scope-note">${config.scopeNote}</p>` : ""}${config.sections.map((section) => `<section id="${section.id}"><h2>${section.title}</h2>${section.html}</section>`).join("")}${renderBlogUpgradeGuide(config)}${renderFaqs(config.faqs)}${config.showStudioSpotlight === false ? "" : renderBlakMarigoldSpotlight()}${config.relatedArticles ? renderRelatedReading(config.relatedArticles) : renderCreatorResources(config.creatorResourceLimit)}${renderSources(config.sources)}`
  };
}

const blogPosts = [
  createPost({
    slug: "ai-music-voice-clones-song-credits",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. copyright context. The session example is fictional. Tool contracts and voice permissions need their own review; this guide does not determine a particular work’s copyrightability.",
    relatedArticles: [["Review a collaboration agreement","songwriter-collaboration-agreement-checklist"],["Check third-party beat terms","producer-splits-for-beats"],["Prepare release paperwork","artist-release-paperwork-checklist-before-distribution"]],
    cta: {"title":"Keep the contributor agreement clear","description":"Document the people and agreed rights, with separate records for tool licenses and voice permissions.","label":"Start a split record"},
    title: "AI Music, Voice Clones, and Song Credits: Who Actually Owns What?",
    excerpt: "A practical guide for artists, producers, studios, and sync teams documenting human authorship, AI-assisted production, voice replicas, credits, and release risk.",
    category: "AI Music Rights",
    publishedAt: "2026-10-12",
    seoTitle: "AI Music Copyright, Voice Clones, and Song Credits",
    metaDescription: "Understand AI music ownership, voice clones, song credits, human authorship, split sheets, and release documentation before you distribute or pitch.",
    primaryKeyword: "AI music copyright ownership",
    definition: "AI music ownership starts with a simple question: what human creative work exists, who contributed it, and what permissions control the tools, vocals, training inputs, samples, and final recording?",
    takeaway: "Do not treat AI as a magic shortcut around credits. Document the human writers, producers, performers, voice permissions, tool usage, and release restrictions before the song leaves the session.",
    sections: [
      { id: "why-this-matters", title: "Start with what happened in the session", html: `<p>AI tools can enter a session as cleanup software, lyric suggestions, generated accompaniment, or a synthetic vocal. “We used AI” leaves too much unanswered. Record which tool was used, what went into it, which output remains in the track, and what each person created.</p><p>A polished bounce does not answer those questions. Keep the session notes and relevant license terms while they are still available, rather than reconstructing the process at upload.</p>` },
      { id: "human-authorship", title: "Human expression and prompting are different questions", html: `<p>The Copyright Office's <a href="https://www.copyright.gov/newsnet/2025/1060.html">2025 copyrightability conclusions</a> distinguish human-authored expression from output determined by a machine. Prompts alone do not establish authorship of the resulting output. Human writing, sufficiently creative arrangement, or modifications may support protection in the human contribution, depending on the facts.</p><p>AI assistance does not automatically disqualify an entire work. Equally, spending time selecting outputs does not automatically establish ownership of all of them. Describe the actual contribution before discussing percentages; the split sheet cannot create copyright in material that is unprotectable.</p>` },
      { id: "voice-clones", title: "Review voice permission separately", html: `<p>A synthetic vocal raises questions beyond who wrote the lyrics and melody. Identify whose voice is replicated, who supplied any source performance, and what the model or service permits. A platform's commercial-use plan does not itself establish the imitated person's consent.</p><p>Ask what written permission covers: model creation, retained files, commercial releases, advertising and sync, territory, duration, approvals, and attribution. Voice and likeness rules vary by jurisdiction. The Copyright Office's <a href="https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-1-Digital-Replicas-Report.pdf">digital-replicas report</a> explains why these issues extend beyond ordinary copyright. Resolve a missing permission before treating the track as available.</p>` },
      { id: "credits-table", title: "Keep a contribution and permission log", html: `<div class="blog-table-wrap" role="region" aria-label="AI session documentation" tabindex="0"><table><caption>AI session documentation</caption><thead><tr><th scope="col">Layer</th><th scope="col">Record</th><th scope="col">Question to resolve</th></tr></thead><tbody><tr><th scope="row">Composition</th><td>Human-written lyrics and music; dated drafts; agreed shares.</td><td>Which expression was created by people?</td></tr><tr><th scope="row">Generated material</th><td>Tool, version or plan, date, input source, retained output.</td><td>What does the applicable license permit?</td></tr><tr><th scope="row">Voice</th><td>Source performer and any model or replica consent.</td><td>Does permission cover this intended use?</td></tr><tr><th scope="row">Recording</th><td>Performances, production, ownership agreements.</td><td>Who can authorize this recording?</td></tr></tbody></table></div><p>Keep permission documents with the log. A contributor credit, license to use software, and consent to replicate a voice serve different purposes.</p>` },
      { id: "session-example", title: "Two uses of AI in the same fictional session", html: `<div class="blog-scenario"><h3>Fictional example: “Static Bloom”</h3><p>Amara writes the lyrics and records the lead vocal. Jules uses a cleanup tool on that performance. The team also keeps a generated backing-vocal passage from a separate service.</p><p>The log identifies Amara's writing and performance, Jules's processing work, and the retained generated passage separately. The backing-vocal service's commercial terms are saved, but the source-voice permission is unresolved. The team marks that passage for replacement or permission review before release. It does not give the software a songwriting percentage or call the entire track cleared.</p></div>` },
      { id: "studio-workflow", title: "A studio workflow for AI-assisted sessions", html: `<ol><li>Ask about generated audio, lyrics, voice models, and outside inputs before recording.</li><li>Keep human drafts and a plain account of the creative work, alongside the tool log.</li><li>Review applicable tool terms and voice, sample, and other permissions for the intended release.</li><li>Agree credits, composition shares, and recording terms only after the contributions are understood.</li><li>Give the release or sync contact an accurate description of retained generated material and any open restrictions.</li></ol>` },
      { id: "red-flags", title: "Issues to resolve before uploading", html: `<ul><li>A retained voice replica has no documented permission for the intended use.</li><li>The team cannot identify the license applying when the output was generated.</li><li>Someone supplied source audio they were not authorized to use.</li><li>A human contribution is missing from the credits or agreement.</li><li>A rights summary describes unresolved generated material as fully cleared.</li></ul><p>Assign each issue to a person and record whether it was resolved by permission, replacement, or removal. Do not label all tool-assisted processing and all generated audio as the same kind of contribution.</p>` },
      { id: "best-practice", title: "Keep registration disclosures accurate", html: `<p>For U.S. copyright applications, use the <a href="https://www.copyright.gov/ai/ai_policy_guidance.pdf">Copyright Office's AI registration guidance</a> to describe human authorship and disclose and exclude relevant AI-generated material as required. Internal disclosure to the team and an application disclosure are separate steps.</p><p>Keep the split agreement, recording terms, permission log, and registration reference together. None substitutes for the others.</p>` }
    ],
    faqs: [{"question":"Can prompting alone make me the author of the generated music?","answer":"The Copyright Office says prompts alone do not establish authorship of the resulting output. The analysis looks at human control of expressive elements."},{"question":"Should I give an AI tool a writing share?","answer":"Do not list software as a human author. Document the actual human contributions and review any contractual terms separately."},{"question":"Does a paid tool plan clear a cloned voice?","answer":"Do not assume it does. Review the voice permission, source performance, service terms, and intended use separately."},{"question":"Does using a cleanup tool invalidate my whole song?","answer":"AI assistance does not automatically bar copyright protection. The human expression and any retained generated material need to be identified accurately."}],
    sources: ["copyrightAiNews","copyrightAiReport","copyrightAiReplicas","copyrightAiRegistration"]
  }),
  createPost({
    slug: "master-rights-vs-publishing-rights",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. rights context. The ownership example uses fictional agreements; credits, payments, and job titles alone do not establish the rights in a particular project.",
    relatedArticles: [["Understand writer and publisher share formats","songwriting-splits-writer-share-publisher-share"],["Separate producer fees, ownership, and royalties","producer-splits-explained"],["Build a sync delivery packet","how-to-make-a-song-sync-ready"]],
    cta: {"title":"Label the rights before collecting signatures","description":"Choose composition, master, or combined rights for the agreed split record. Keep royalty calculations and other production promises in the relevant agreements.","label":"Create a split record"},
    title: "Master Rights vs. Publishing Rights: What Independent Artists Need to Know",
    excerpt: "Understand the difference between the master recording and the song composition so releases, royalties, sync licenses, credits, and split sheets do not get mixed together.",
    category: "Music Rights",
    publishedAt: "2026-10-11",
    seoTitle: "Master Rights vs Publishing Rights for Artists",
    metaDescription: "Learn master rights vs publishing rights, including sound recordings, compositions, royalties, sync clearance, split sheets, and release paperwork.",
    primaryKeyword: "master rights vs publishing rights",
    creatorResourceLimit: 14,
    definition: "Publishing rights usually concern the underlying song composition, while master rights concern a specific sound recording of that song. A released track often needs both rights layers documented.",
    takeaway: "Every serious release should answer two questions separately: who owns the song, and who controls this recording of the song?",
    sections: [
      { id: "two-rights", title: "The two-rights problem in one plain example", html: `<p>You write a song on piano. That composition is one rights layer. Later, you record a studio version with a producer, featured vocalist, engineer, and session musicians. That sound recording is another rights layer. Same song, different legal and business questions.</p><p>A collaborator can have a songwriting share without owning the master. A producer can receive a contractual master royalty without owning part of the recording copyright. A vocalist can perform on the recording without writing the song. Keep ownership, credit, payment, and permission distinct when documenting the deal.</p>` },
      { id: "publishing", title: "Publishing rights: the composition side", html: `<p>Publishing concerns the underlying musical work, including music and lyrics. Songwriters and composers create this work; publishers and administrators may own or manage interests under their agreements. The <a href="https://www.copyright.gov/register/pa-sr.html">Copyright Office distinguishes this work from the sound recording</a>.</p><p>Useful composition records include the ownership agreement, writer and publisher details, administration arrangements, PRO affiliations, IPIs, an ISWC when assigned, and licensing contacts. An IPI identifies an interested party; an ISWC identifies a musical work. Neither number grants permission to use the song.</p>` },
      { id: "master", title: "Master rights: the recording side", html: `<p>The master is the specific sound recording. A newly recorded acoustic performance of the same song creates a different recording from the original studio performance. An ISRC identifies a recording; it is not proof of its ownership.</p><p>Ask who owns the final recording, which agreements establish that ownership, who can license it, and what producer, performer, or label obligations apply. Who paid for the session is relevant background, but the invoice alone is not a complete ownership agreement.</p>` },
      { id: "comparison", title: "Master vs. publishing comparison table", html: `<div class="blog-table-wrap" role="region" aria-label="Composition and master rights comparison" tabindex="0"><table><caption>Composition and recording rights</caption><thead><tr><th scope="col">Question</th><th scope="col">Publishing / composition</th><th scope="col">Master / recording</th></tr></thead><tbody><tr><th scope="row">What does it cover?</th><td>The underlying music and lyrics.</td><td>A particular sound recording.</td></tr><tr><th scope="row">Ownership evidence</th><td>Songwriting agreements and any publishing transfers.</td><td>Recording agreements and any relevant rights transfers.</td></tr><tr><th scope="row">Useful identifiers</th><td>IPI for parties; ISWC for the work.</td><td>ISRC for the recording.</td></tr><tr><th scope="row">License question</th><td>Who can authorize use of the composition?</td><td>Who can authorize use of this recording?</td></tr><tr><th scope="row">What a split record needs</th><td>Clearly labeled composition and publishing interests.</td><td>Clearly labeled master ownership, separate from royalty points.</td></tr></tbody></table></div><p>One release can contain several recordings. Keep release-level product codes separate from the work and recording identifiers rather than using one number for every purpose.</p>` },
      { id: "rights-example", title: "One song, two recordings, different owners", html: `<div class="blog-scenario"><h3>Fictional example: “Window Seat”</h3><p>Under their signed composition agreement, Lena Ortiz owns 60% and Marcus Bell owns 40%. Separate agreements establish the following recording ownership. These are example terms, not conclusions drawn from who performed or paid.</p></div><div class="blog-table-wrap" role="region" aria-label="Fictional composition and recording ownership" tabindex="0"><table><caption>Fictional recording ownership</caption><thead><tr><th scope="col">Record</th><th scope="col">Composition ownership</th><th scope="col">Recording ownership</th><th scope="col">Permission to use this audio in a film</th></tr></thead><tbody><tr><th scope="row">Original studio recording</th><td>Lena 60%; Marcus 40%</td><td>Lena 100%</td><td>Composition clearance through the authorized contacts for both interests; master clearance from Lena.</td></tr><tr><th scope="row">New acoustic recording</th><td>Lena 60%; Marcus 40%</td><td>Harbor Sessions label 100%</td><td>Same composition clearance; master clearance from the label.</td></tr></tbody></table></div><p>Marcus's 40% composition interest does not automatically give him 40% of either master. The label's acoustic master ownership does not automatically give it composition ownership. A producer royalty could be payable under a separate contract without changing these ownership percentages.</p><p>In this example, neither Lena's original master approval nor the label's acoustic master approval clears the composition by itself. The contact collecting approvals should confirm who is authorized to act for each interest.</p>` },
      { id: "royalties", title: "Why royalties do not all come from one place", html: `<p>Distribution revenue is usually tied to the recording. PRO royalties concern public performance of the composition. The MLC handles eligible U.S. digital audio mechanical royalties for musical works. SoundExchange collects statutory digital performance royalties for qualifying non-interactive uses of recordings.</p><p>These are different collection paths with different rules. For example, <a href="https://www.soundexchange.com/digital-performance-royalties/">SoundExchange's statutory allocation</a> includes payments to featured artists and a fund for non-featured performers as well as the recording owner. Being paid as a performer does not, by itself, establish master ownership.</p><p>Check what each service actually administers for you. A company may offer both distribution and publishing services through separate agreements; opening a distributor account does not establish that both are covered.</p>` },
      { id: "sync", title: "Why sync licensing cares about both sides", html: `<p>A planned audiovisual use of an existing recording generally needs composition synchronization permission and master-use permission. The rights may be controlled by different people, as the example shows. One authorized representative may handle several interests, but that authority needs to be confirmed.</p><p>Keep ownership records, approval contacts, restrictions, and the exact recording version together. A signed ownership split does not automatically approve every future film, ad, territory, or term. See the <a href="/blog/how-to-make-a-song-sync-ready">sync-ready song guide</a> for the delivery workflow.</p>` },
      { id: "workflow", title: "A practical rights workflow for independent artists", html: `<ol><li>Identify the composition and the exact recording version.</li><li>Document composition ownership and any publisher or administrator authority.</li><li>Document master ownership, licensing authority, and separate royalty or payment promises.</li><li>Review samples, beat licenses, featured-performer arrangements, and other third-party restrictions.</li><li>Keep names, identifiers, agreements, and approval contacts consistent across the release and catalog records.</li></ol><p>Split Sheet Studio offers composition, master, and combined rights modes. Choose the scope that matches the agreement and review each applicable share total separately. A percentage field does not replace production terms, sample permissions, or a license for a particular use.</p>` }
    ],
    faqs: [
      {"question":"Can the same person own both the song and the master?","answer":"Yes, but verify both rights separately. Ownership of one does not automatically establish ownership of the other."},
      {"question":"Are producer points the same as master ownership?","answer":"No. A contractual royalty is a payment entitlement. Recording copyright ownership is a separate question that should be stated clearly."},
      {"question":"Does a composition split sheet cover the master?","answer":"Only if the document also expressly covers that recording and its ownership. Check its stated scope rather than assuming."},
      {"question":"If I pay for the recording, do I own it?","answer":"Payment alone does not answer every ownership question. Review the recording, producer, performer, and transfer agreements relevant to the project."},
      {"question":"Does a distributor collect publishing royalties for me?","answer":"Check your service agreement. Distribution and publishing administration are separate services, even when one company offers both."}
    ],
    sources: ["copyrightRegistration","copyrightMusicians","copyrightTransfers","musicianIncome","soundExchangeDigitalRoyalties","mlcHowItWorks","copyrightAllianceSync","cisacIdentifiers","isrcOfficial"]
  }),
  createPost({
    slug: "producer-splits-explained",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. rights context. The two deals below use fictional terms to illustrate the paperwork, rather than recommend market rates.",
    relatedArticles: [
      ["Choose the right document for producer terms", "producer-agreement-vs-split-sheet"],
      ["Review beat-specific split questions", "producer-splits-for-beats"],
      ["See a filled composition split example", "what-is-a-split-sheet-in-music"]
    ],
    cta: { title: "Document the songwriting agreement", description: "Once everyone agrees on composition shares, capture them and collect signatures with Split Sheet Studio. Handle producer compensation and master terms separately.", label: "Record the agreed shares →" },
    title: "Producer Splits Explained: Who Gets What When Making a Song?",
    excerpt: "A clear guide to producer splits, songwriting shares, producer points, beat licenses, fees, credits, and master royalties for modern recording sessions.",
    category: "Producers",
    publishedAt: "2026-10-10",
    seoTitle: "Producer Splits Explained: Song Shares and Points",
    metaDescription: "Learn producer splits, songwriting percentages, producer points, beat licenses, fees, credits, master royalties, and what to document before release.",
    primaryKeyword: "producer splits",
    creatorResourceLimit: 14,
    definition: "Producer splits can mean composition ownership, producer points on the master, an upfront fee, beat-license terms, or credit. The safest workflow labels each one separately.",
    takeaway: "The producer's percentage is meaningless until everyone knows which right the percentage applies to.",
    sections: [
      { id: "why-confusing", title: "Why producer splits get confusing so fast", html: `<p>“I get ten percent.” Before anyone agrees, ask: ten percent of what? A songwriting share, a royalty on the recording, and a share of distributor payouts describe different arrangements.</p><p>The word <em>producer</em> does not settle the question. One producer co-writes a melody; another records an already-written song; another licenses a beat. Label the actual rights and payments before reaching for a percentage. Otherwise, the song can end up with a paperwork remix nobody asked for.</p>` },
      { id: "five-buckets", title: "The five terms to separate", html: `<div class="blog-table-wrap" role="region" aria-label="Producer rights and payment terms" tabindex="0"><table><caption>Put each term in the record that actually defines it</caption><thead><tr><th scope="col">Term</th><th scope="col">What it describes</th><th scope="col">Where to document it</th></tr></thead><tbody><tr><th scope="row">Songwriting share</th><td>Ownership in the composition: music and lyrics.</td><td>Split sheet and applicable publishing agreement.</td></tr><tr><th scope="row">Producer royalty / points</th><td>A contractual payment tied to the recording.</td><td>Producer agreement defining the rate, payment base, and accounting.</td></tr><tr><th scope="row">Upfront fee</th><td>Payment for agreed production services or delivery.</td><td>Production agreement, plus invoice and payment record.</td></tr><tr><th scope="row">Beat license</th><td>Permission to use a beat under stated conditions.</td><td>Beat license specifying permitted uses and retained rights.</td></tr><tr><th scope="row">Credit</th><td>The exact name and role shown publicly.</td><td>Agreement and release metadata.</td></tr></tbody></table></div>` },
      { id: "songwriting", title: "When a producer should be on the split sheet", html: `<p>Ask what the producer contributed to the underlying song and what the parties have agreed. A producer may also write lyrics or melody; the production credit alone does not answer the composition-ownership question. The <a href="https://www.copyright.gov/register/pa-sr.html">Copyright Office distinguishes authorship of a composition from authorship of a recording</a>.</p><p>Document agreed composition shares rather than assigning ownership from job titles. If the facts or contracts are disputed, get qualified advice before treating a percentage as settled. An upfront fee alone does not explain what rights were granted.</p>` },
      { id: "points", title: "Producer points: define the base before doing the math", html: `<p>Producer points describe a contractual recording royalty. The percentage needs a defined <strong>royalty base</strong>: the amount to which the rate applies. Check deductions, payment timing, accounting, and which income categories the agreement includes.</p><p><strong>Recoupment</strong> means recovering specified costs or advances under the contract. Whether it delays or reduces a producer's payment depends on that agreement. A bare promise of “three points” leaves too much unexplained.</p><p>A producer can receive a master royalty with or without a composition share. Payment instructions may also need separate action: for example, a <a href="https://www.soundexchange.com/what-we-do/for-artists-labels-and-producers/letters-of-direction/">SoundExchange Letter of Direction</a> lets a featured artist direct part of their sound-recording performance royalties to an eligible creative participant. That is a specific payment mechanism, separate from songwriting ownership.</p>` },
      { id: "beat-license", title: "Beat licenses need their own review", html: `<p>Leased beats, exclusive beats, and custom production can all carry different rules. Look for usage limits, territory, term, Content ID restrictions, sync restrictions, sample warranties, credit language, stem delivery, publishing claims, and whether ownership transfers at all.</p><p>Before a distributor upload, make sure the beat license does not contradict the split sheet. If the producer keeps publishing, the split sheet should not pretend otherwise. If sync is restricted, your pitch package needs to say that before a music supervisor asks.</p>` },
      { id: "studio-example", title: "Two fictional deals, with the money separated", html: `<p>These examples use invented terms to show how the records differ. Neither is an industry standard, a recommended percentage, or a legal template.</p><div class="blog-example"><h3>Deal A: co-writing, a fee, and a master royalty</h3><p>The artist and producer co-write the song. They agree to 75% artist / 25% producer composition ownership, a $500 production fee, and a separate master royalty. Their fictional agreement defines the royalty as 3% of specified master receipts actually received, with no deductions or recoupment for this calculation.</p><p><strong>Worked calculation:</strong> $2,000 in qualifying master receipts × 0.03 = $60 producer royalty. The $500 fee is separate, so the producer receives $560 across those two payment categories in this example. The 25% composition ownership is not part of that $2,000 calculation, and it does not imply another $500 is due from the master receipts.</p><p>Real producer agreements may use a different base, permitted deductions, recoupment, or payment timing. A promise of “three points” is incomplete until those terms are defined.</p></div><div class="blog-example"><h3>Deal B: production services for a fee</h3><p>The artist arrives with a finished song. The producer performs recording and production services without co-writing. For this example, the parties agree on a $750 fee, no producer composition share, no continuing master royalty, an exact producer credit, and separately documented master rights.</p><p>The artist's composition share remains 100% in this scenario. The services agreement records the fee, deliverables, credit, and master-rights terms. Paying the invoice alone is not the explanation of who owns the recording; the agreement needs to address that.</p></div><div class="blog-table-wrap" role="region" aria-label="Where each fictional deal term is documented" tabindex="0"><table><caption>Which document answers which question?</caption><thead><tr><th scope="col">Record</th><th scope="col">Deal A</th><th scope="col">Deal B</th></tr></thead><tbody><tr><th scope="row">Composition split</th><td>Artist 75%; producer 25%</td><td>Artist 100%; no producer songwriting share</td></tr><tr><th scope="row">Producer agreement</th><td>$500 fee; defined 3% master royalty; delivery and accounting terms</td><td>$750 services fee; no continuing royalty; delivery terms</td></tr><tr><th scope="row">Master rights and credit</th><td>Identify recording owner, approvals, and exact credit separately</td><td>Record agreed master rights and exact producer credit separately</td></tr></tbody></table></div><p>Before signing, be able to finish three sentences: “My songwriting share is…”, “My master royalty is calculated on…”, and “My fee covers…”. If a term is missing, that is a question to resolve, not a number to guess.</p>` },
      { id: "checklist", title: "Producer split checklist before release", html: `<ul><li>Confirm whether the producer is a songwriter.</li><li>Document composition shares totaling 100%.</li><li>Separate producer points from publishing shares.</li><li>Store the beat license or producer agreement.</li><li>Confirm sample and loop status.</li><li>Write exact public credit language.</li><li>Confirm master ownership and payment obligations.</li><li>Send every collaborator the final signed PDF.</li></ul><p>For beat-specific scenarios, use this cornerstone guide with the supporting <a href="/blog/producer-splits-for-beats">producer splits for beats</a> article.</p>` }
    ],
    faqs: [
      { question: "Does a producer automatically get 50 percent of a song?", answer: "No. There is no automatic producer percentage. Shares depend on contribution and agreement." },
      { question: "Are producer points the same as songwriting splits?", answer: "No. Producer points usually refer to master royalties. Songwriting splits refer to composition ownership." },
      { question: "Should beat producers be on the split sheet?", answer: "Only if the agreement or contribution gives them composition ownership. Beat-license terms should be reviewed separately." },
      { question: "Can a producer get paid a fee and still own publishing?", answer: "Yes, if the parties agree. Receiving a fee does not by itself transfer the songwriting rights. Check the actual rights granted in the agreement." },
      { question: "What should be documented before uploading the song?", answer: "Document writer shares, producer terms, credits, beat licenses, samples, master ownership, and final signatures." },
      { question: "Can Split Sheet Studio replace a producer agreement?", answer: "No. It documents split-sheet data and signatures. Producer fees, points, and master terms may need a separate agreement." }
    ],
    sources: ["copyrightMusicians", "copyrightRegistration", "musicianIncome", "soundExchangeLod"]
  }),
  createPost({
    slug: "how-to-make-a-song-sync-ready",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. rights context. The brief and song examples are fictional; follow the actual request and applicable agreements.",
    relatedArticles: [
      ["Check whether you can claim one-stop clearance", "one-stop-music-licensing-rights-clearance"],
      ["Use the shorter sync licensing checklist", "sync-licensing-checklist"],
      ["Capture the record before the session ends", "recording-studio-session-closeout-workflow"]
    ],
    cta: { title: "Start with the composition record", description: "Document agreed songwriting shares and collect signatures with Split Sheet Studio. Keep master permissions, licenses, and approval contacts alongside that record in your clearance packet.", label: "Document the song splits →" },
    title: "How to Make a Song Sync-Ready for Film, TV, and Advertising",
    excerpt: "Prepare the files, metadata, and approval record a sync request needs, with a sample delivery folder and a realistic response when clearance is pending.",
    category: "Sync Licensing",
    publishedAt: "2026-10-09",
    seoTitle: "How to Make a Song Sync-Ready for Film and TV",
    metaDescription: "Make music sync-ready with clean splits, master ownership, metadata, instrumentals, stems, approval contacts, and clearance documentation.",
    primaryKeyword: "sync ready music",
    creatorResourceLimit: 14,
    definition: "A sync-ready track has suitable audio versions, useful metadata, and a documented path to the composition and master permissions required for the intended use.",
    takeaway: "A signed ownership record and permission for a particular use answer different questions. Make both statuses clear before confirming clearance.",
    sections: [
      { id: "what-sync-ready-means", title: "What sync-ready actually means", html: `<p>A supervisor asks for an instrumental and a clearance answer by the afternoon. You can send the file immediately, but can you also explain who controls the song and recording, and who can approve that use?</p><p>That is the practical test. A useful packet connects the right audio version to its writers, publishers, recording owner, restrictions, and approval contacts. Preparing it ahead of time makes a deadline less dependent on old group chats.</p>` },
      { id: "rights", title: "Start with the rights packet", html: `<p>Keep signed composition splits, publisher and administrator contacts, master-owner details, producer obligations, licenses, and relevant restrictions together. Include performance rights organization (PRO) affiliations and writer or publisher identifiers (IPIs) when known.</p><p>The <a href="https://copyrightalliance.org/faqs/how-to-get-permission-to-use-a-song/">Copyright Alliance explains the two permissions involved in using an existing recording with visuals</a>: synchronization permission for the composition and master-use permission for the recording. A split sheet is part of the ownership record; it does not grant both permissions.</p><p>Claim one-stop only when a single contact actually has authority to clear the required rights. Knowing every writer's email is useful coordination, not proof of that authority.</p>` },
      { id: "files", title: "Prepare the audio requested in the brief", html: `<ul><li>Full mix and instrumental.</li><li>Clean vocal version if the song contains explicit language.</li><li><strong>Stems:</strong> grouped audio exports, such as drums, vocals, or instruments, when requested or useful.</li><li>Alternate endings or short edits if the brief asks for them.</li><li>Lyrics and notes identifying the versions supplied.</li></ul><p>An instrumental can leave room for dialogue; stems give an editor more control. Follow the recipient's file format, sample rate, bit depth, and delivery instructions.</p><div class="blog-example"><h3>A fictional supervisor request</h3><blockquote><p>“Please send the full mix and instrumental as 24-bit, 48 kHz WAVs by 5 p.m. Central, plus lyrics and the current clearance status. We need room for dialogue.”</p></blockquote><p>For this request, export those two versions to the stated specification. Include the lyrics and a clear approval-status note in the same delivery. Other briefs may ask for a different package.</p></div>` },
      { id: "delivery-folder", title: "A sample sync folder you can adapt", html: `<p>This proposed structure separates audio delivery from the supporting rights record. Keep personal contact details and agreements in an access-controlled location; share the necessary materials with the relevant clearance team.</p><pre class="blog-code-block" tabindex="0" aria-label="Example sync delivery folder">After-the-Last-Train_v1/
  Audio/
    After-the-Last-Train_Full_v1.wav
    After-the-Last-Train_Instrumental_v1.wav
  Metadata/
    Track-Metadata.csv
    Lyrics.txt
  Rights-Private/
    Composition-Splits_SIGNED-v1.pdf
    Master-Owner-and-Approvals.txt
    Licenses-and-Restrictions.txt
  Delivery-Status.txt</pre><p>Use the same title and version across the files and metadata. A signed composition document does not mean master permissions are complete: record each status separately in <code>Delivery-Status.txt</code>.</p>` },
      { id: "metadata", title: "Write metadata someone can actually search", html: `<p><strong>ISRC</strong> identifies a recording; <strong>ISWC</strong> identifies a composition. Keep them in their correct fields, and mark unassigned codes accurately. The <a href="https://isrc.ifpi.org/why-use-isrc/using-isrc">International ISRC Agency explains the recording code</a>, while <a href="https://www.cisac.org/services/information-services/international-identifiers">CISAC describes the work identifier</a>.</p><p>For discovery, describe what a listener will hear: “sparse piano, reflective verse, hopeful final chorus, instrumental available.” Add the title, version, genre, tempo, key, lyrical themes, vocal type, and explicit status. Keep the ownership and clearance status alongside those descriptions so a good creative match can be evaluated quickly.</p>` },
      { id: "metadata-example", title: "What a filled metadata record looks like", html: `<p><strong>Fictional example:</strong> the writers signed their ownership agreement on October 2. A later licensing request still needs a separate clearance check; Avery's approval for that use is pending.</p><dl class="blog-example blog-example-details"><dt>Title / artist / version</dt><dd>After the Last Train / Maya Chen / Full v1</dd><dt>Sound and lyrical theme</dt><dd>Soul-pop; 92 BPM; A minor; reflective verse, hopeful chorus; leaving a relationship</dd><dt>Composition ownership</dt><dd>Maya Chen 50%; Jordan Ellis 25%; Avery Brooks 25%</dd><dt>Ownership record</dt><dd>Composition agreement v1, signed by all three writers on October 2, 2026</dd><dt>Publishing / administration</dt><dd>Each writer is self-administered in this example, with no outside publisher</dd><dt>Master owner</dt><dd>Maya Chen, under the team's separate fictional recording agreement</dd><dt>Clearance status</dt><dd>Not one-stop; Avery's approval for the proposed use is pending</dd><dt>Third-party material</dt><dd>Team reports none; verify the source record before licensing</dd><dt>Recording / work identifiers</dt><dd>ISRC and ISWC not assigned in this example</dd><dt>Coordination contact</dt><dd>maya@example.com — coordinates responses; has no authority to approve Avery's share</dd></dl><p><a href="/resources/sync-metadata-example.csv" download>Download the fictional metadata example (CSV)</a> and replace the values with verified information. Keep current rights-holder contacts and supporting agreements in the private clearance record.</p>` },
      { id: "missing-approval", title: "When a co-writer cannot be reached", html: `<p>In the example, Avery owns 25% and has not approved the requested use. The coordinator has the split sheet and audio, but no documented authority to approve Avery's share. The <a href="https://www.copyright.gov/engage/musicians/">Copyright Office warns that trying and failing to reach a rights holder does not replace required permission</a>.</p><p>A useful reply is specific: “We can supply the requested files, but composition approval for this use is still pending for one writer's 25% share. We cannot confirm clearance by your deadline. We can offer an alternative track with confirmed permissions.”</p><p>Check whether an authorized publisher or representative can handle the request. If authority remains uncertain, disclose the unresolved approval and get qualified clearance advice; do not turn silence into consent.</p>` },
      { id: "table", title: "Check readiness against the actual request", html: `<div class="blog-table-wrap" role="region" aria-label="Sync readiness and clearance checks" tabindex="0"><table><caption>Check permissions as carefully as the files</caption><thead><tr><th scope="col">Area</th><th scope="col">Ready when…</th><th scope="col">Common blocker</th></tr></thead><tbody><tr><th scope="row">Composition</th><td>Ownership is documented and the approval authority for this use is confirmed.</td><td>An owner or publisher's authority remains unresolved.</td></tr><tr><th scope="row">Master</th><td>The recording owner and required permission for this use are confirmed.</td><td>Producer, artist, or label terms still need review.</td></tr><tr><th scope="row">Audio</th><td>The requested versions and technical specifications are available.</td><td>The requested instrumental or clean mix is missing.</td></tr><tr><th scope="row">Metadata</th><td>The title, version, searchable description, identifiers, and contacts match the files.</td><td>The ownership record refers to a different version.</td></tr><tr><th scope="row">Third-party material</th><td>Necessary permissions cover the proposed use and remaining restrictions are stated.</td><td>A sample or beat-license restriction has only been disclosed, not resolved.</td></tr></tbody></table></div>` },
      { id: "workflow", title: "A simple sync-prep workflow", html: `<ol><li>Choose a track that fits the brief.</li><li>Verify the composition record and the current approval authority for both composition and master.</li><li>Check third-party licenses and restrictions against the proposed use.</li><li>Prepare the requested audio versions, lyrics, and metadata.</li><li>Confirm file access and state clearance status in the delivery reply.</li><li>Keep the final licenses and delivery record with the track.</li></ol><p>Before replying, ask: can the recipient identify the exact version, find the requested files, and tell which permissions are confirmed? If any answer is unclear, fix the packet before representing the song as cleared.</p>` }
    ],
    faqs: [
      { question: "What does sync-ready mean?", answer: "It means the song has organized rights, clear approval contacts, useful metadata, and deliverable audio versions for visual media licensing." },
      { question: "Do I need an instrumental for sync?", answer: "It is strongly recommended because editors often need music without lead vocals under dialogue." },
      { question: "Can a song with samples be sync-ready?", answer: "It can be, if the necessary permissions cover the intended use. Disclose restrictions and unresolved permissions; disclosure alone does not clear a sample." },
      { question: "What is one-stop clearance?", answer: "One-stop generally means one authorized party can approve both composition and master rights, but the claim should be verified." },
      { question: "Does Split Sheet Studio pitch songs for sync?", answer: "No. Split Sheet Studio helps document splits, signatures, and records. It does not pitch songs or guarantee placements." },
      { question: "What files should I keep in a sync folder?", answer: "Keep the full mix, instrumental, clean version, stems, lyrics, metadata, split sheet, master notes, sample notes, and approval contacts." }
    ],
    sources: ["copyrightPermission", "copyrightAllianceSync", "copyrightMusicians", "cisacIdentifiers", "isrcOfficial"]
  }),
  createPost({
    slug: "distrokid-tunecore-release-checklist",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "Pre-upload workflow, with a fictional file-check example. Distributor field names and technical requirements vary by service and plan.",
    relatedArticles: [["Prepare the underlying agreements","artist-release-paperwork-checklist-before-distribution"],["Choose a distribution service","best-music-distribution-services-2026"],["Check recording and work identifiers","music-metadata-isrc-iswc-ipi-guide"]],
    cta: {"title":"Finish the agreement before the upload","description":"Keep contributor shares and signatures in a separate agreed record before entering release metadata or payout instructions.","label":"Start the split record"},
    title: "Before You Upload to DistroKid or TuneCore: Your Music Release Checklist",
    excerpt: "Use this pre-upload checklist for independent artists preparing split sheets, credits, metadata, ISRCs, UPCs, artwork, audio, samples, and release approvals.",
    category: "Music Distribution",
    publishedAt: "2026-10-08",
    seoTitle: "DistroKid and TuneCore Release Checklist",
    metaDescription: "Before uploading to DistroKid or TuneCore, check your split sheet, credits, ISRC, UPC, metadata, artwork, audio, samples, and release rights.",
    primaryKeyword: "music release checklist",
    definition: "Before uploading to DistroKid, TuneCore, or any distributor, confirm the song rights, recording rights, metadata, credits, audio files, artwork, identifiers, and collaborator approvals.",
    takeaway: "A distributor can deliver your music. It cannot fix ownership confusion that should have been handled before upload.",
    sections: [
      { id: "positioning", title: "Use this when you are ready to upload", html: `<p>This checklist starts after choosing a distributor: compare the proposed upload with the approved audio, artwork, credits, identifiers, and rights record. For platform selection, use the <a href="/blog/best-music-distribution-services-2026">distribution comparison</a>; for the agreements themselves, use the <a href="/blog/artist-release-paperwork-checklist-before-distribution">paperwork checklist</a>.</p><p>Have one person perform the check against the same saved release record. The upload form should not become a new negotiation about the deal.</p>` },
      { id: "rights", title: "1. Confirm the agreed rights record", html: `<p>Check that the composition agreement has been reviewed and signed as intended and that the complete ownership picture totals 100%. Keep the publisher, administrator, PRO, and confirmed IPI data needed for later registrations with it.</p><p>Use each destination's share conventions when registering. You will not necessarily enter every private rights detail in the distributor's public metadata fields. A distributor payout split is a separate instruction.</p>` },
      { id: "master", title: "2. Confirm master ownership and producer terms", html: `<p>The master recording needs its own review. Who paid for the recording? Who owns the final audio? Are there producer points, featured artist approvals, label obligations, or beat-license limits? If the producer has a master royalty, do not bury that inside the publishing split.</p><p>Use the <a href="/blog/master-rights-vs-publishing-rights">master rights vs publishing rights guide</a> if the team is mixing these concepts together.</p>` },
      { id: "metadata", title: "3. Check the fields that reach the stores", html: `<div class="blog-table-wrap" role="region" aria-label="Pre-upload metadata check" tabindex="0"><table><caption>Pre-upload metadata check</caption><thead><tr><th scope="col">Field</th><th scope="col">Compare with</th><th scope="col">Resolve before submission</th></tr></thead><tbody><tr><th scope="row">Title and version</th><td>Approved release record and exact audio.</td><td>Explicit and clean editions must not be swapped.</td></tr><tr><th scope="row">Artist and features</th><td>Confirmed names and intended artist profiles.</td><td>Identify similarly named artists and incorrect profile mappings.</td></tr><tr><th scope="row">Credits</th><td>Approved public credits.</td><td>Keep legal registration names and display names labeled separately.</td></tr><tr><th scope="row">Recording code</th><td>Existing ISRC for this unchanged recording, or the distributor’s assignment process.</td><td>Do not invent a code or reuse one for a different recording.</td></tr><tr><th scope="row">Release product code</th><td>The selected service’s UPC/EAN guidance.</td><td>Existing-code support can depend on the platform or plan.</td></tr></tbody></table></div><p><a href="https://support.distrokid.com/hc/en-us/articles/360013648913-Do-I-Need-to-Provide-UPCs-or-ISRCs-to-Upload-to-DistroKid">DistroKid</a> and <a href="https://support.tunecore.com/hc/en-in/articles/115006499567-TuneCore-UPCs-and-ISRCs">TuneCore</a> explain their identifier processes separately. Follow the current instructions for the selected account.</p>` },
      { id: "assets", title: "4. Check audio and artwork by opening them", html: `<p>Listen to the actual upload file through the ending. Check the version, clipping or export faults, silence, and whether the filename describes the audio. Open the artwork at full size and verify the selected distributor's current format and content rules.</p><p>Keep the approved master, clean version, instrumental, and any promised delivery files separately labeled. An instrumental or session backup does not belong in the main release slot unless that is the version you intend to release.</p>` },
      { id: "samples", title: "5. Resolve third-party uses", html: `<p>Check the intended distribution against any beat, sample, loop, cover, or tool license. Permission for a cover's composition does not itself clear a sampled master or an audiovisual use. An interpolation uses recreated material rather than copying the earlier recording, but composition permission can still matter.</p><p>Keep license evidence and restrictions in the private release folder. If a permission is unresolved, identify the responsible person and hold the affected release rather than treating a metadata checkbox as clearance.</p>` },
      { id: "upload-example", title: "Catch a version mismatch before pressing submit", html: `<div class="blog-scenario"><h3>Fictional upload check: “Blue Hour”</h3><p>The release record calls for the explicit studio master. The selected audio is named <code>BlueHour_Clean_Master.wav</code>, while the form is marked explicit and carries the original recording's code.</p><p>The uploader opens the file, confirms the mismatch, and pauses submission. They select the approved audio, verify the intended identifier and explicit flag, then save the confirmation. Changing the filename alone would not have fixed the audio or metadata.</p></div>` },
      { id: "launch", title: "6. Save and review the submission", html: `<ol><li>Keep the approved audio, artwork, and public metadata used for upload.</li><li>Save the distributor's submission reference, selected stores, date, and payout instructions.</li><li>Keep agreements and licenses in access-controlled storage alongside the release record.</li><li>Review the resulting artist profile, credits, artwork, and audio when the release appears.</li><li>Use the distributor's correction process for a mismatch; update the source record and affected destinations.</li></ol><p>A saved submission is evidence of what you sent, not a guarantee of a particular store's approval date.</p>` }
    ],
    faqs: [{"question":"Do I need a split sheet before uploading to DistroKid or TuneCore?","answer":"You should complete one before uploading if multiple people contributed to the composition. It keeps release metadata and registrations aligned."},{"question":"Do DistroKid and TuneCore provide ISRCs?","answer":"Both platforms provide workflows involving ISRCs and UPCs, but artists with existing identifiers should review each platform's guidance before uploading."},{"question":"Is distributor revenue the same as publishing income?","answer":"No. Distributor revenue usually concerns the master recording. Publishing and composition royalties use other systems and registrations."},{"question":"Can I upload before the producer agreement is finished?","answer":"It is risky. Confirm producer fees, points, credits, samples, and master terms before release."}],
    sources: ["distrokidIsrcUpc","tunecoreIsrcUpc","copyrightMusicians","isrcOfficial","theMlc"]
  }),
  createPost({
    slug: "best-music-distribution-services-2026",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "Official-page research checked October 14, 2026. USD prices are advertised base prices where stated, before extras, taxes, and payment fees. This is a focused comparison, not hands-on testing or a ranking of every distributor.",
    relatedArticles: [["Run the distributor upload checks","distrokid-tunecore-release-checklist"],["Prepare rights and agreements","artist-release-paperwork-checklist-before-distribution"],["Understand the two rights layers","master-rights-vs-publishing-rights"]],
    cta: {"title":"Agree on rights before routing revenue","description":"Document the ownership agreement separately from any distributor’s collaborator payment settings.","label":"Create a split record"},
    title: "Best Music Distribution Services for Independent Artists in 2026",
    excerpt: "Compare six distribution services using official pricing, commission categories, cancellation terms, and a worked three-year cost example.",
    category: "Music Distribution",
    publishedAt: "2026-09-16",
    seoTitle: "Music Distribution Services in 2026: Costs and Terms",
    metaDescription: "Compare DistroKid, TuneCore, CD Baby, LANDR, RouteNote, and Soundrop using checked base prices, commissions, cancellation terms, and cost examples.",
    primaryKeyword: "best music distribution services 2026",
    definition: "The best music distribution service in 2026 is the one that matches your release schedule, collaborator workflow, catalog plans, royalty needs, and budget. No distributor is the best fit for every independent artist.",
    takeaway: "Choose the distributor after the rights are clean. Agree on ownership, document splits, understand the master and publishing picture, then pick the delivery platform that fits how you release music.",
    sections: [
      { id: "short-version", title: "Choose for your release pattern", html: `<p>Start with the number of releases and artist profiles you expect to manage, then compare the full cost over several years. A low annual price can change when you add scheduling, collaborator accounts, cover licensing, or monetization services. A one-time release fee can still come with a revenue commission.</p><p>The six services below illustrate annual, per-release, and commission-funded models. They were selected for their published independent-artist offers and to make those tradeoffs comparable. The list is not exhaustive. The assessment uses official pricing and help pages; it does not rate support quality, upload speed, or placement results from personal testing.</p>` },
      { id: "release-principle", title: "Set the rights and collection plan before upload", html: `<p>Confirm composition ownership, recording ownership, credits, producer terms, and third-party permissions before release. Assign PRO, mechanical, and other applicable registration tasks alongside distribution; they need not wait until the track is already live.</p><p>A distributor's payment splits usually route recording revenue. They do not replace the underlying ownership agreement or automatically give a recipient the same percentage of publishing. Keep the signed record and the payment instructions separately labeled.</p>` },
      { id: "what-distributors-handle", title: "What a distributor actually handles", html: `<p>For most independent artists, digital distributors are the connection between the finished master and services such as Spotify, Apple Music, Amazon Music, YouTube Music, TikTok, Instagram, TIDAL, and Deezer. Instead of delivering to every service separately, the artist sends the distributor a master file, artwork, metadata, and release information.</p><p>Depending on the company and plan, distribution may also include UPC and ISRC generation, scheduled release dates, lyric delivery, analytics, collaborator payments, social-platform monetization, YouTube Content ID, catalog transfers, and takedowns.</p><p>Using a distributor does not automatically mean giving that company ownership of the master copyright. Some agreements can, however, give the distributor exclusive digital-distribution rights during a contractual term. Copyright ownership and distribution authorization are different concepts, and independent artists should read that distinction carefully.</p>` },
      { id: "royalty-picture", title: "Distribution is only one part of royalties", html: `<p>A streaming release can generate revenue connected to two different copyrights. The composition is the underlying lyrics and music. The master recording is the specific recorded performance listeners hear.</p><p>Basic digital distribution primarily concerns the master side. That does not mean every royalty generated by the song has automatically been collected. In the United States, The MLC administers certain digital mechanical royalties for eligible interactive streaming and download services, while SoundExchange collects statutory digital-performance royalties for sound recordings used by qualifying non-interactive digital services.</p><p>Some distribution companies offer publishing administration, SoundExchange-related collection, sync pitching, or other rights services as add-ons. Evaluate those services separately from the basic question of getting the recording onto DSPs.</p>` },
      { id: "comparison-table", title: "2026 distribution pricing and terms", html: `<p>Each service name links to an official plan or help page. Compare the stated base offer with the features you actually need; confirm the current checkout quote before paying.</p><div class="blog-table-wrap" role="region" aria-label="Distribution offers checked October 14, 2026" tabindex="0"><table><caption>Distribution offers checked October 14, 2026</caption><thead><tr><th scope="col">Service</th><th scope="col">Base offer</th><th scope="col">Revenue / practical check</th></tr></thead><tbody><tr><th scope="row"><a href="https://distrokid.com/product/distrokid/plans-and-pricing-2">DistroKid</a></th><td>Musician: $24.99/year; one artist, unlimited uploads.</td><td>Advertises no commission on store streaming/sales earnings. Custom release dates are listed on higher plans; check extras and payout costs.</td></tr><tr><th scope="row"><a href="https://www.tunecore.com/pricing">TuneCore</a></th><td>Rising Artist: $24.99/year; unlimited distribution.</td><td>The plan lists scheduling and collaborator splits. Social-platform monetization has a stated 20% fee; distinguish it from store revenue.</td></tr><tr><th scope="row"><a href="https://support.cdbaby.com/hc/en-us/articles/213125406-How-much-does-CD-Baby-cost">CD Baby</a></th><td>$9.99 per single; $14.99 per album; no recurring distribution subscription.</td><td>9% commission on downloads and streaming. Other collection and monetization categories have different rates.</td></tr><tr><th scope="row"><a href="https://support.landr.com/hc/en-us/articles/31618416509975-How-much-does-it-cost-to-distribute-music-with-LANDR">LANDR</a></th><td>Distribution Basic: $24/year; Distribution Pro: $45/year, as listed in support.</td><td>Support states 100% of distribution royalties while subscribed; 15% commission after cancellation, with releases remaining live subject to its policies.</td></tr><tr><th scope="row"><a href="https://routenote.com/pricing">RouteNote</a></th><td>Free tier with a revenue share; paid alternatives also offered.</td><td>Free tier pays the artist 85% of streaming/download revenue. Compare a paid offer against expected receipts.</td></tr><tr><th scope="row"><a href="https://soundrop.com/pricing">Soundrop</a></th><td>$4.99 per track; no annual fee.</td><td>15% revenue share. Advertises cover licensing and splits within its workflow; confirm eligibility and the uses covered.</td></tr></tbody></table></div><p>“100% royalties” is a statement about a defined revenue category, not a promise that every dollar reaches your bank without costs. Review monetization commissions, licensing costs, withdrawal charges, currency conversion, taxes, and paid add-ons separately.</p>` },
      { id: "pricing-models", title: "Work the cost over the same period", html: `<p>For an annual plan, count every year you intend to keep it active. For a per-release offer, count the actual releases plus the applicable revenue share. Keep the same catalog, time period, and receipts assumptions on both sides.</p><div class="blog-scenario"><h3>Fictional three-year comparison</h3><p>Assume an annual service stays at $24.99 per year. Compare it with an offer charging $9.99 per single plus 9% of qualifying receipts. Both scenarios assume $500 total qualifying receipts over three years, with no extras or price changes. These assumptions illustrate cost only, not expected earnings or equivalent features.</p></div><div class="blog-table-wrap" role="region" aria-label="Illustrative three-year cost" tabindex="0"><table><caption>Illustrative three-year cost</caption><thead><tr><th scope="col">Release plan</th><th scope="col">Annual model</th><th scope="col">Per-single plus commission</th></tr></thead><tbody><tr><th scope="row">Three singles total</th><td>$24.99 × 3 = $74.97</td><td>3 × $9.99 + 9% × $500 = $74.97</td></tr><tr><th scope="row">Eighteen singles total</th><td>$24.99 × 3 = $74.97</td><td>18 × $9.99 + 9% × $500 = $224.82</td></tr></tbody></table></div><p>The first case ties on these narrow assumptions. The second favors the annual model on cost. Scheduling, collaboration charges, future receipts, cancellation, and support needs can change the decision. Get the actual quote before choosing.</p>` },
      { id: "best-fit", title: "Shortlist by the constraint that matters", html: `<ul><li><strong>Frequent releases:</strong> compare the annual plans' artist limits, scheduling, and required extras.</li><li><strong>A small catalog held for years:</strong> compare recurring fees with per-release fees and commissions over the same period.</li><li><strong>No upfront budget:</strong> examine a commission-funded route and what it costs as receipts grow.</li><li><strong>Cover recordings:</strong> check whether the particular song and territories qualify for the offered licensing process. Sampling and audiovisual uses need separate review.</li><li><strong>Many collaborators:</strong> check recipient account requirements, payment costs, statement exports, and how splits are changed.</li></ul>` },
      { id: "features-that-matter", title: "Check these terms before paying", html: `<p>Confirm custom release scheduling, use of existing ISRCs, artist-profile matching, collaborator payout requirements, and whether the chosen recordings qualify for Content ID. A nonexclusive beat or licensed loop may affect eligibility even when distribution is permitted.</p><p>Get a clear answer about cancellation: will releases be removed, retained with a commission, or subject to an additional option? LANDR's <a href="https://support.landr.com/hc/en-us/articles/31618026457239-How-does-LANDR-Distribution-work">current help page</a>, for example, specifies a 15% commission after cancellation. Keep the applicable terms with your release records.</p>` },
      { id: "rights-before-upload", title: "Keep ownership and payout instructions separate", html: `<p>Agree the composition, master, producer royalties, credits, and any third-party restrictions before entering payment splits. Give the person uploading the approved recording version and agreed public credits, with private rights documents stored securely.</p><p>Use the <a href="/blog/artist-release-paperwork-checklist-before-distribution">paperwork checklist</a> for the agreements and the <a href="/blog/distrokid-tunecore-release-checklist">upload checklist</a> for the actual submission.</p>` },
      { id: "switching-distributors", title: "Plan a catalog transfer before takedown", html: `<p>Gather the exact audio, artwork, metadata, original release information, UPC, and ISRCs. The unchanged recording keeps its ISRC. Follow the receiving and outgoing services' current transfer instructions, including their delivery and takedown sequence.</p><p>A supported transfer can involve temporary overlap. Avoid improvising duplicate deliveries or removing the original release before understanding the migration process. Matching an identifier does not guarantee that every store will preserve a playlist position, display, or metric.</p>` },
      { id: "final-recommendation", title: "Make the final choice reviewable", html: `<p>Keep a one-page comparison for your own release plan: base fee, required extras, commission categories, three-year cost, cancellation result, and unresolved questions. Save the official quote and terms you relied on.</p><p>Choose the offer whose cost and obligations fit that plan. Recheck before renewal or a catalog move, since an attractive offer for the first single may be a poor fit for a label-sized catalog.</p>` }
    ],
    faqs: [{"question":"Is there one best distributor for every artist?","answer":"No. Release frequency, catalog size, required features, revenue share, and cancellation terms change the comparison."},{"question":"Does 100% royalties mean no fees?","answer":"No. The phrase can concern store revenue while subscriptions, add-ons, monetization commissions, payment costs, or taxes still apply."},{"question":"Is a distributor split an ownership agreement?","answer":"Usually it is a payment-routing instruction. Document composition and recording ownership separately."},{"question":"Will a cover-song service clear a sample or sync use?","answer":"Do not assume it will. Check the specific rights, song, territory, and use covered by that licensing process."},{"question":"Were these services tested in real release accounts?","answer":"This comparison is based on official public pricing and help pages, not hands-on release testing or a support-speed study."}],
    sources: ["distrokidPricing","tunecorePricing","cdbabyPricing","landrPricing","landrCancellation","routenotePricing","soundropPricing","isrcOfficial"]
  }),
  createPost({
    slug: "one-stop-music-licensing-rights-clearance",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. sync context. “One-stop” is industry shorthand, not a substitute for the actual grant of authority. The example is fictional.",
    relatedArticles: [["Check publishing approval authority","music-publishing-before-sync-licensing"],["Review a specific sync request","sync-licensing-checklist"],["Prepare the delivery packet","how-to-make-a-song-sync-ready"]],
    cta: {"title":"Keep the ownership evidence organized","description":"Document agreed rights and signatures, then keep any separate licensing authority with the record.","label":"Create a split record"},
    title: "One-Stop Music Licensing: Make Your Song Easier to Clear for Sync",
    excerpt: "A sync-ready rights clearance guide for artists, producers, managers, and studios who want songs that can move fast when a placement opportunity appears.",
    category: "Sync Licensing",
    publishedAt: "2026-09-13",
    seoTitle: "One-Stop Music Licensing Rights-Clearance Checklist",
    metaDescription: "Learn one-stop music licensing for sync: composition rights, master rights, publisher contacts, samples, metadata, and clearance-ready paperwork.",
    primaryKeyword: "one-stop music licensing",
    definition: "One-stop music licensing generally means a single authorized source can grant the composition and recording permissions needed for the stated use. A person who can only coordinate separate approvals should describe that role accurately.",
    takeaway: "Do not claim a song is one-stop because it feels independent. Claim it only when the composition, master, publisher, sample, and approval records support that promise.",
    sections: [
      { id: "what-one-stop-means", title: "Verify authority before using the label", html: `<p>The useful question is whether the contact can actually grant the needed rights for the proposed use. Knowing every owner, holding the files, or handling the pitch does not establish that authority.</p><p>One contact can represent several owners under appropriate agreements. Confirm the scope: composition interests, exact recording, types of use, territories, term, and any reserved approvals. Keep the evidence of authority beside the ownership record.</p>` },
      { id: "why-clearance-wins", title: "Why clearance can beat a perfect pitch", html: `<p>Sync opportunities often move on tight deadlines. A track may be emotionally perfect for a scene, ad, trailer, game, or sports promo, but the buyer still needs a dependable rights answer. If the team cannot confirm ownership, files, terms, and contacts quickly, the buyer may choose a less exciting song that is easier to clear.</p><p>This is where independent artists and studios can compete. Clean ownership records make a small catalog feel professional. They reduce friction for supervisors, editors, creative directors, and clearance teams who do not have time to chase every collaborator.</p>` },
      { id: "composition-side", title: "Clear the composition side first", html: `<p>The composition is the underlying song: melody, lyrics, and musical work. Before pitching for sync, confirm every writer, composition percentage, publisher or administrator, PRO affiliation, IPI when known, and approval contact.</p><p>A signed split sheet is the first practical record. It should total 100%, reflect the team agreement, and connect to publishing records later. Check ownership and authority against the agreements. Different registration share scales can show different numbers without changing ownership, so compare like with like before reporting a conflict.</p><ul><li>Confirm the writer legal names and professional names.</li><li>Verify composition shares total 100%.</li><li>Record publishers, administrators, PROs, and IPIs when available.</li><li>Identify who can approve a sync use and who must be copied.</li><li>Store the signed split beside the song metadata.</li></ul>` },
      { id: "master-side", title: "Map the master side separately", html: `<p>The master is the specific sound recording. A sync use of an existing recording usually needs permission for the master in addition to the composition. The master owner might be the artist, a label, a production company, a studio client, or another party depending on the agreement.</p><p>Do not assume master control just because the artist uploaded the release. Review producer agreements, label deals, featured-artist terms, work-for-hire language, studio payment terms, and any contract that affects who can approve the recording.</p><ul><li>Name the exact recording version and ISRC when assigned.</li><li>Identify the master owner and approval contact.</li><li>List producer points, featured artist restrictions, and payment obligations.</li><li>Keep instrumental, clean, and alternate mixes attached to the same record.</li></ul>` },
      { id: "samples-and-beats", title: "Find sample, loop, and beat restrictions early", html: `<p>Uncleared samples, interpolations, loops, and beat licenses are common sync blockers. Some beat licenses allow distribution but restrict television, film, advertising, games, trailers, or commercial licensing. Some sample packs allow use in songs but still require careful review of redistribution and identification terms.</p><p>Ask the uncomfortable question before pitching: did any part of this production come from third-party material? If yes, document the source, license, restrictions, and clearance status. Unknown is better than pretending a risk is gone.</p>` },
      { id: "authority-example", title: "One coordinator can still need another approval", html: `<div class="blog-scenario"><h3>Fictional example: “Copper Sky”</h3><p>Tessa owns 60% of the composition and the full studio master. Milo owns the remaining 40%, with sync approval controlled by his publisher under their agreement. Tessa manages the catalog and has everyone's contact details.</p></div><div class="blog-table-wrap" role="region" aria-label="Fictional sync authority map" tabindex="0"><table><caption>Fictional sync authority map</caption><thead><tr><th scope="col">Interest</th><th scope="col">Authorized approval route</th><th scope="col">Status</th></tr></thead><tbody><tr><th scope="row">Composition: Tessa 60%</th><td>Tessa for her interest.</td><td>Confirmed for the example.</td></tr><tr><th scope="row">Composition: Milo 40%</th><td>Milo’s publisher.</td><td>Separate approval still required.</td></tr><tr><th scope="row">Studio recording: Tessa 100%</th><td>Tessa for this master.</td><td>Confirmed for the example.</td></tr></tbody></table></div><p>Tessa can coordinate the request but should not describe herself as able to clear all rights through one approval. If the publisher later grants her suitable authority, she must check its scope against the actual brief before changing that status.</p>` },
      { id: "rights-packet", title: "Build a sync-ready rights packet", html: `<p>A rights packet is a compact folder that lets a clearance person understand the song without a long back-and-forth. It should include the signed split sheet, composition ownership summary, publisher and administrator contacts, master owner contact, sample notes, metadata, lyrics, audio files, and any restrictions.</p><p>For Split Sheet Studio users, the final PDF can become the ownership anchor inside that packet. Add the related audio, metadata, and master notes around it so the song has one source of truth.</p><ol><li>Signed split sheet PDF.</li><li>One-page composition and master ownership summary.</li><li>Publisher, administrator, PRO, and IPI details.</li><li>Full mix, instrumental, clean version, and stems when available.</li><li>Lyrics, explicit status, tempo, mood, genre, themes, and scene-use notes.</li><li>Sample, interpolation, beat-license, and restricted-use notes.</li><li>Approval contacts and expected response time.</li></ol>` },
      { id: "supervisor-email", title: "Give a precise clearance response", html: `<p>Use a response that matches the authority you have. The following is a fictional example with an outstanding separate approval:</p><blockquote><p>For “Copper Sky,” I can approve the studio master and my 60% composition interest. The remaining 40% requires the publisher's approval; I can coordinate that request. Please send the media, use description, territory, term, exclusivity, deadline, and budget so we can confirm the required permissions and quote.</p></blockquote><p>Do not promise a response time on someone else's behalf without checking availability. A listening link and a rights summary help review; they do not grant a license.</p>` },
      { id: "what-not-to-claim", title: "Distinguish ownership, authority, and license terms", html: `<p>A completed split shows the agreed interests within its scope. It does not automatically appoint the sender to license every contributor's share. A PRO or MLC registration is also not a sync approval.</p><p>Define “pre-cleared” if using it: identify which uses and terms have actually been approved. An earlier television permission may not cover a later advertisement, and a master approval does not clear the composition by itself.</p>` },
      { id: "studio-closeout-link", title: "Keep the authority map current after production", html: `<p>Save the agreed split, recording terms, publishers, representatives, and approval contacts after production. Update the catalog when an administration or ownership arrangement changes.</p><p>The <a href="/blog/recording-studio-session-closeout-workflow">session closeout workflow</a> helps capture the starting record. Confirm the authority again when responding to a specific request.</p>` },
      { id: "score-your-song", title: "Record a specific clearance status", html: `<ul><li><strong>Authority verified for the brief:</strong> the contact's grant covers the identified interests and requested use, with any conditions stated.</li><li><strong>Separate approval needed:</strong> name the interest and the party who must approve; give a realistic next action.</li><li><strong>Rights unresolved:</strong> identify the dispute, missing license, or unknown owner and hold any clearance claim.</li></ul><p>These statuses are more useful than a green badge with no explanation. Recheck whenever the use, recording, rights, or representative changes.</p>` }
    ],
    faqs: [{"question":"Must one-stop music have a single owner?","answer":"No. One source may have authority from multiple owners. Check the actual scope of that authority."},{"question":"Does coordinating approvals make me one-stop?","answer":"Coordination alone does not establish permission to grant all needed rights. State which separate approvals remain."},{"question":"Does a signed split grant sync permission?","answer":"It records the interests and terms stated in that document. Do not assume it also authorizes every later audiovisual use or appoints one licensing representative."},{"question":"Is one-stop the same as pre-cleared?","answer":"Define both terms in context. One-stop concerns the authorized approval source; pre-clearance should identify the uses and terms actually approved."}],
    sources: ["copyrightMusicians","copyrightAllianceSync","sesacFaq","cisacIdentifiers","isrcOfficial"]
  }),
  createPost({
    slug: "recording-studio-session-closeout-workflow",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "The five-minute routine below assumes the terms are already agreed. Ownership disputes need a separate conversation.",
    relatedArticles: [
      ["Collect project details before the session", "recording-studio-client-intake-form-music-sessions"],
      ["Organize the final client delivery", "recording-studio-release-delivery-checklist"],
      ["Build a separate sync-delivery packet", "how-to-make-a-song-sync-ready"]
    ],
    cta: { title: "Make agreed splits part of closeout", description: "Use Split Sheet Studio to capture composition shares and collect signatures. Keep unresolved decisions visible in the session handoff until the collaborators resolve them.", label: "Start the split-sheet record →" },
    title: "Recording Studio Session Closeout: A Five-Minute Split-Sheet Workflow",
    excerpt: "A practical studio handoff for agreed splits, credits, signatures, files, and follow-up, including the workflow we use before mixing and mastering.",
    category: "Studio Operations",
    publishedAt: "2026-09-13",
    seoTitle: "Recording Studio Session Closeout Split-Sheet Workflow",
    metaDescription: "Use this recording studio session closeout workflow to capture splits, credits, signatures, master notes, samples, metadata, and final PDFs.",
    primaryKeyword: "recording studio session closeout",
    creatorResourceLimit: 11,
    definition: "Recording studio session closeout is a handoff that records who contributed, what was agreed, which files are ready, and who is responsible for anything still pending.",
    takeaway: "Leave with a clear status, even when the paperwork is still pending: what is agreed, what needs a decision, and who follows up next.",
    sections: [
      { id: "why-closeout-matters", title: "Close the session without losing the details", html: `<p>The final bounce is running and the next booking is close. Someone asks for the instrumental, a producer wants the credit spelling checked, and a remote writer still needs to review the split. Those are three different tasks; a useful closeout tells everyone where each one stands.</p><p>Record the song version, people, agreed shares, signature status, delivered files, and open questions. The engineer can coordinate the handoff while the collaborators remain responsible for their agreement.</p>` },
      { id: "five-minute-frame", title: "A five-minute closeout when the terms are already agreed", html: `<p>Use this suggested timebox to capture an existing agreement. Start the conversation earlier if the team still needs to negotiate shares.</p><ol><li><strong>Minute 1:</strong> confirm the song title, date, version, and contributors.</li><li><strong>Minute 2:</strong> collect contact details, exact credits, and known publisher or performance rights organization (PRO) details.</li><li><strong>Minute 3:</strong> review agreed composition percentages and check the 100% total.</li><li><strong>Minute 4:</strong> collect signatures or send the agreed version for review.</li><li><strong>Minute 5:</strong> save the status recap, file locations, and follow-up owner. Add the signed PDF once signing is complete.</li></ol><p><a href="/resources/session-closeout-checklist.html">Open the printable session closeout checklist</a> for the workstation. Your browser can print it or save a PDF copy.</p>` },
      { id: "contributor-capture", title: "Step 1: name the record and the people", html: `<p>Start with names. Capture the artist name, legal names where appropriate, professional names, emails, phone numbers when used for coordination, and the role each person played in the room. Include songwriters, producers, featured artists, musicians, engineers, managers, and anyone who needs a copy.</p><p>Credits and ownership are different. Someone can deserve a public credit without owning the composition. Someone can own part of the song without being featured on the recording. The closeout should make those layers visible instead of mixing them together.</p>` },
      { id: "rights-fields", title: "Step 2: capture publishing, master, and sample notes", html: `<p>Collect publisher, administrator, PRO, and IPI details when people know them. An IPI is an identifier used for writers and publishers in rights databases. If a detail is unknown, name who will verify it and by when; do not invent a value.</p><p>Then capture master-side notes. Who claims ownership of the recording, and which agreement supports it? Is there a label or a producer royalty? Who paid is useful context, but payment alone is not a complete ownership record. The <a href="https://www.copyright.gov/engage/musicians/">Copyright Office explains why the composition and recording need separate consideration</a>.</p><p>Ask about beats, samples, interpolations (re-created portions of another composition), loops, and outside stems. Record the license location and any unknowns. “Client says cleared” records a statement; it does not verify the license's scope.</p>` },
      { id: "split-validation", title: "Step 3: check the agreed totals and record the status", html: `<p>Read the shares back to the team and check that composition ownership totals 100%. A correct sum checks the arithmetic; each collaborator still needs to review the agreement.</p><p>If a share is disputed, save a draft with the open question, follow-up owner, and due date. Keep that draft clearly distinguishable from a signed record. For master ownership, keep a separate total and identify the agreement supporting it.</p>` },
      { id: "remote-signing", title: "Step 4: collect signatures on the same version", html: `<p>For remote collaborators, send individual review links. In Split Sheet Studio, signers see the contributors and percentages for the selected rights before confirming; the final PDF is issued after every contributor has signed.</p><p>Check required contact and registration details before expecting someone to finish signing. If a correction is requested, resolve it with the affected parties and send the corrected version through review. Preserve the earlier signed record when making a later revision.</p>` },
      { id: "final-pdf-handoff", title: "Step 5: deliver the final PDF and close the folder", html: `<p>After signatures are complete, deliver the same final PDF to every contributor. Store it beside the final mix, instrumental, clean version, stems when available, lyrics, credits, invoice, session notes, and metadata.</p><p>Use one consistent naming convention. A folder named with the artist, song title, date, and version is easier to search than a folder full of mystery files. The goal is for a manager, artist, or studio assistant to find the correct document months later without calling everyone.</p>` },
      { id: "pending-handoff", title: "What a useful handoff looks like when something is pending", html: `<p><strong>Fictional session recap:</strong> the rough mix is approved, two writers agree on the composition shares, and a remote third writer has not reviewed them. The producer also needs to locate the beat license. The engineer can finish a clear handoff without describing the rights record as complete.</p><div class="blog-table-wrap" role="region" aria-label="Example pending session handoff" tabindex="0"><table><caption>After the Last Train — illustrative handoff, October 1, 2026</caption><thead><tr><th scope="col">Item / status</th><th scope="col">Next action and owner</th><th scope="col">Due / record location</th></tr></thead><tbody><tr><th scope="row">Rough mix / approved for client review</th><td>Engineer sends the review copy; this is not release authorization</td><td>Tonight / Audio/Review-v1.wav</td></tr><tr><th scope="row">Composition / draft, not fully agreed or signed</th><td>Artist asks remote writer to review; resolve changes with all writers before signing</td><td>October 2 / Documents/Splits-DRAFT-v1</td></tr><tr><th scope="row">Beat license / not verified</th><td>Producer supplies the license; artist reviews intended release and sync uses</td><td>October 2 / Documents/Licenses</td></tr></tbody></table></div><p>When an item is resolved, record the new status and notify affected collaborators. Keep old drafts distinguishable from the signed version. A useful recap tells the next person exactly what remains open and who is handling it.</p>` },
      { id: "sync-ready-closeout", title: "Keep the handoff useful for future licensing", html: `<p>A closeout record gives future clearance work a starting point: contributor contacts, agreed splits, recording ownership notes, licenses, and file locations. It does not establish that a song is ready for every proposed use.</p><p>If a licensing opportunity arrives, check the actual permissions, restrictions, and approval authority for that use. The <a href="https://www.copyright.gov/engage/musicians/">Copyright Office cautions that a failed attempt to contact a rights holder does not replace required permission</a>.</p>` },
      { id: "windows-plugin", title: "Our workflow: production, splits, mix, then DISCO", html: `<p>At Blak Marigold Studio, we regularly pitch sync opportunities with our in-house producers. We use Split Sheet Studio inside our Studio One sessions on every track we produce together. Our handoff happens in this order:</p><ol><li><strong>Finish production and document the splits.</strong> We handle the split record before moving into mixing and mastering.</li><li><strong>Mix and master the track.</strong> Keep the agreed contributor and ownership record with the project as the audio moves toward delivery.</li><li><strong>Enter the same information in DISCO.</strong> After mixing and mastering, we carry that information into DISCO, where we host our sync portfolio.</li></ol><p>The plugin places the paperwork at a stage we already recognize: production is done, and the song is moving to the next part of the process. If a detail changes later, update the source record and check the portfolio entry against it.</p><p>Our setup uses the Windows VST3 workflow. Studio One Pro's current successor branding is <a href="https://www.fender.com/newsroom/270270-fender-unveils-connected-music-ecosystem-with-fender-studio-pro-audio-interfaces-and-controllers/">Fender Studio Pro</a>; check the plugin format supported by your installed DAW. The DISCO entry is a separate catalog step.</p>` },
      { id: "daily-studio-system", title: "Make the next session easier", html: `<p>Put the closeout checklist beside the workstation and introduce it at session start. Before leaving, the artist and engineer should both be able to find the current audio, the current split status, and the next person responsible for any open item. Test that handoff once, then adjust the routine around what your room actually needs.</p>` }
    ],
    faqs: [
      {
        "question": "What if the collaborators have not agreed on shares?",
        "answer": "Keep a draft with the open question, a follow-up owner, and a due date. The engineer can document the status while the collaborators resolve the disagreement before signing."
      },
      {
        "question": "What if a collaborator is remote?",
        "answer": "Send an individual review link for the agreed version. In Split Sheet Studio, signing remains pending until every contributor confirms and signs; the completed PDF follows finalization."
      },
      {
        "question": "Can I send a review mix while signatures are pending?",
        "answer": "Distinguish the audio handoff from permission to release or license the track. Follow the applicable agreements, label the file for review, and state which rights decisions remain unresolved."
      },
      {
        "question": "When does Blak Marigold Studio document splits?",
        "answer": "After production and before mixing and mastering. After the mix and master are finished, the team enters the same information in DISCO for its sync portfolio."
      },
      {
        "question": "Does a completed split sheet make a song cleared for sync?",
        "answer": "It records the selected ownership agreement. Check the separate permissions, restrictions, and approval authority for the proposed use before confirming clearance."
      }
    ],
    sources: ["copyrightMusicians", "copyrightRegistration", "bmiIpi", "cisacIdentifiers", "isrcOfficial", "copyrightAllianceSync"]
  }),
  createPost({
    slug: "recording-studio-client-intake-form-music-sessions",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "A suggested studio workflow. The filled intake example is fictional and is not presented as an actual Blak Marigold client or policy.",
    relatedArticles: [["Close out the actual session","recording-studio-session-closeout-workflow"],["Define the final delivery","recording-studio-release-delivery-checklist"],["Review third-party beat permissions","producer-splits-for-beats"]],
    cta: {"title":"Carry confirmed contributors into the split discussion","description":"Use the agreed names and rights to prepare a separate split record when the collaboration is ready.","label":"Start a split record"},
    title: "Recording Studio Client Intake Form: What to Ask Before a Music Session",
    excerpt: "A studio-owner intake workflow for collecting client goals, contributors, beats, samples, deliverables, rights questions, and split-sheet readiness before the session starts.",
    category: "Studio Operations",
    publishedAt: "2026-09-13",
    seoTitle: "Recording Studio Client Intake Form for Music Sessions",
    metaDescription: "Use this recording studio client intake form checklist to capture artist goals, collaborators, beats, samples, deliverables, credits, and split-sheet needs.",
    primaryKeyword: "recording studio client intake form",
    definition: "A recording studio client intake form is the pre-session record that captures who is coming, what will be created, which files are involved, what deliverables are expected, and which rights questions should be handled before the session becomes urgent.",
    takeaway: "The best studio paperwork starts before the first take, because intake gives the engineer and owner time to spot rights, file, credit, and delivery issues early.",
    sections: [
      { id: "why-intake-matters", title: "Why intake matters for studio owners", html: `<p>A studio intake form is not busywork. It is how the room protects time, sets expectations, and makes the client experience feel professional. When a client arrives with a leased beat, three co-writers, a remote producer, and a release deadline, the studio should already know enough to keep the session moving.</p><p>Good intake gives the owner and engineer a simple view of the project: who is responsible, who needs credit, who might need to sign, what files are expected, and whether third-party material is involved. It keeps business questions from ambushing the creative process.</p>` },
      { id: "booking-fields", title: "Start with booking and approval contacts", html: `<p>Collect the project and artist names, main contact, session date, release goal, decision deadline, payer, and agreed delivery recipients. Ask who can approve overtime or a change in scope. Do not infer that authority from who pays.</p><p>Confirm the booking's practical terms separately: included hours, revisions, cancellation terms, expected preparation, and what the studio will deliver. Intake captures information; it does not automatically transfer song or recording ownership.</p>` },
      { id: "people-fields", title: "Ask who will be in the room", html: `<p>List expected songwriters, producers, featured artists, musicians, engineers, managers, videographers, and guests. A person in the room may affect credits, releases, confidentiality, session flow, or ownership discussions.</p><p>The form should not decide whether someone owns part of the song. It should make sure the team knows who participated, what role they played, and who needs follow-up before the release record is treated as final.</p>` },
      { id: "beats-samples", title: "Flag beats, samples, loops, and outside files", html: `<p>Ask whether the client is bringing a beat lease, exclusive beat, sample, interpolation, loop, outside stem, YouTube download, remix material, or reference that may affect rights. If the answer is yes, collect the source, license status, restrictions, and who is responsible for confirming permission.</p><p>The U.S. Copyright Office warns musicians not to assume they can freely use someone else's work. Trying and failing to reach a rightsholder is not a replacement for permission when permission is required.</p>` },
      { id: "deliverables", title: "Define deliverables before the clock starts", html: `<p>Ask whether the booking covers tracking, editing, production, mixing, mastering, or a combination. List included outputs and separately quoted work. A rough bounce for review and an approved release master should have different status labels.</p><p>Define “stems” with the client: grouped audio parts, individual tracks, and editable session files are different deliveries. Agree whether a clean edit, instrumental, or session archive is included, and when it is due.</p>` },
      { id: "intake-example", title: "A filled intake should reveal the next question", html: `<div class="blog-scenario"><h3>Fictional intake: “Sunday Bus”</h3><p><strong>Booking:</strong> two-hour vocal tracking session. <strong>Files arriving:</strong> stereo beat WAV and lyric draft. <strong>Expected people:</strong> artist and one remote producer. <strong>Included delivery:</strong> edited vocal takes and a clearly labeled rough reference.</p><p><strong>Open request:</strong> the artist also wants an instrumental and release master. The engineer confirms that the booking does not include mixing or mastering, asks who can supply the instrumental, and agrees a separate scope before the session. The artist is responsible for bringing the full beat license for review.</p></div><p><a href="/resources/studio-intake-questions.txt" download>Download the reusable intake questions (plain text)</a>. Adapt them to your service rather than using them as a contract or asking clients for private account credentials.</p>` },
      { id: "split-readiness", title: "Prepare the split discussion early", html: `<p>Ask who is expected to contribute writing or production and whether the composition already has an agreement. Collect the relevant names and invitation emails, then confirm the actual contributions after production.</p><p>A short closeout works when the decisions are already settled. If ownership or required details remain unresolved, record the follow-up and keep the proposed split a draft. Intake data does not automatically become a signed agreement or import into the product.</p>` },
      { id: "privacy-consent", title: "Add consent, contact, and communication language", html: `<p>The intake form should explain how contact information will be used for booking, session delivery, signature links, support, and follow-up. Keep marketing opt-in separate from operational communication.</p><p>Studios should store intake data in access-controlled systems and avoid collecting sensitive information they do not need. The goal is practical workflow, not turning a simple booking form into a risky database.</p>` },
      { id: "handoff-to-closeout", title: "Compare intake with what actually happened", html: `<p>At closeout, note new contributors, title changes, extra revisions, outside material, and newly requested files. Confirm the changed scope with the responsible person and name any outstanding action.</p><p>Use the <a href="/blog/recording-studio-session-closeout-workflow">session closeout workflow</a> to record agreed splits and the handoff. Keep the original intake as context instead of silently replacing it with a description of a different booking.</p>` }
    ],
    faqs: [{"question":"Does intake decide who owns the song?","answer":"No. It identifies participants and questions for a separate agreement. Attendance or payment does not automatically establish a composition share."},{"question":"Should intake include every possible deliverable?","answer":"List what is included, what can be quoted separately, and what is pending. Define stems and session files specifically."},{"question":"What should clients bring for an outside beat?","answer":"The audio needed for the booking and the full applicable license, with the source and intended uses identified."},{"question":"Should intake collect marketing consent?","answer":"If requested, keep it clear and optional, separate from booking and delivery communication. Avoid unnecessary personal data."},{"question":"What happens when the booking changes?","answer":"Record the new request, who approved it, the cost or timing consequence, and the updated delivery expectation."}],
    sources: ["copyrightMusicians","copyrightAllianceSync","copyrightRegistration"]
  }),
  createPost({
    slug: "recording-studio-release-delivery-checklist",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "Suggested delivery practice. The recap is fictional; file requirements, included services, and storage terms should follow the actual booking.",
    relatedArticles: [["Agree delivery at intake","recording-studio-client-intake-form-music-sessions"],["Use the session closeout checklist","recording-studio-session-closeout-workflow"],["Prepare the upload","distrokid-tunecore-release-checklist"]],
    cta: {"title":"Include the agreed rights record in the handoff","description":"Keep the completed split PDF with the private project records and send contributors the appropriate completed copy.","label":"Document the split"},
    title: "Recording Studio Release Delivery Checklist: Files, Credits, Metadata, and Splits",
    excerpt: "A release-delivery workflow for studios that want clients to leave with organized audio files, credits, metadata, split PDFs, and clear next steps.",
    category: "Studio Operations",
    publishedAt: "2026-09-13",
    seoTitle: "Recording Studio Release Delivery Checklist",
    metaDescription: "Use this recording studio release delivery checklist for final WAVs, instrumentals, clean edits, stems, credits, metadata, master notes, and split sheets.",
    primaryKeyword: "recording studio release delivery checklist",
    definition: "A recording studio release delivery checklist is the final handoff system that confirms audio versions, credits, metadata, rights paperwork, storage, and recipients before a project leaves the studio.",
    takeaway: "A studio can sound great and still create chaos if clients leave without the right files, credits, metadata, and paperwork.",
    sections: [
      { id: "delivery-is-product", title: "Make the handoff understandable without a call", html: `<p>The recipient should be able to identify the approved version, the files included, and any open work without asking which bounce is final. Compare delivery against the agreed service before sharing it.</p><p>One complete folder can still contain a mix awaiting approval. Label the audio status and rights status separately so “files delivered” is not mistaken for “ready for any use.”</p>` },
      { id: "audio-package", title: "Build and listen to the audio package", html: `<p>Deliver the approved mix or master and the versions promised in the booking. Depending on the job, that may include a clean edit, instrumental, reference MP3, grouped stems, individual tracks, or session archive. Define those outputs instead of treating the word “stems” as a universal format.</p><p>Listen to each delivered version through its ending. Confirm that clean edits remove the intended words, instrumentals contain the intended vocal content, and exports meet the agreed format. Name each file with the artist, title, version, and approval status.</p>` },
      { id: "credits-package", title: "Confirm credits before delivery", html: `<p>Credits should include primary artist, featured artists, producers, songwriters, engineers, mixers, mastering engineer, musicians, studio name, and any required production credit language. Verify spelling and professional names.</p><p>Credit is not the same as ownership, but it still matters. Incorrect credits can create relationship damage and metadata conflicts even when the split percentages are correct.</p>` },
      { id: "metadata-package", title: "Attach release metadata", html: `<p>Store title, alternate title, artist, contributors, explicit status, language, genre, mood, tempo, lyrics, release date, distributor, ISRC when assigned, ISWC when assigned, publisher information, and contact notes. Metadata helps songs move through release, royalty, and licensing systems.</p><p>The ISRC identifies a recording, while the ISWC identifies a musical work. Keep identifiers in the correct lane and never use one as a substitute for the other.</p>` },
      { id: "rights-package", title: "Keep rights evidence and delivery status separate", html: `<p>Link the composition agreement, recording ownership and producer terms, relevant performer agreements, and full third-party licenses as applicable. Keep sensitive documents in access-controlled storage and share them with the people who need them.</p><p>A client saying “the sample is cleared” is a reported status, not a substitute for checking the relevant permission when you are responsible for clearance. Record what evidence exists and who is responsible for anything unresolved.</p>` },
      { id: "delivery-recap", title: "Send a recap with status and responsibility", html: `<div class="blog-scenario"><h3>Fictional delivery recap: “Evening Ferry”</h3><p><strong>Delivered:</strong> approved full master WAV, reference MP3, instrumental, and confirmed credits. The private folder includes the completed composition agreement.</p><p><strong>Still open:</strong> clean edit awaiting artist approval. Engineer sends the revised edit October 16; artist reviews by October 17. Producer's master royalty terms remain with the artist and producer for confirmation.</p><p><strong>Use status:</strong> the delivered full master is the approved audio version. This recap does not represent the unresolved recording deal as settled or authorize a sync license.</p></div><p>Name actual recipients and the secure file location. Test the recipient's access and identify how they report a missing or incorrect file.</p>` },
      { id: "backup-retention", title: "Set storage and retention expectations", html: `<p>Tell clients how long the studio stores session files, whether backups are included, and how retrieval works later. If the studio is not promising lifetime storage, say that clearly in the agreement or delivery note.</p><p>Keep signed PDFs and final delivery records in a more durable place than an engineer's desktop. Access control and consistent folders matter when clients come back months later.</p>` },
      { id: "upgrade-service", title: "Agree any extra preparation before delivering it", html: `<p>If the client needs instrumentals, clean edits, detailed metadata, or a sync packet beyond the original booking, agree the scope, fee, and delivery date. File preparation does not promise placements or clear outstanding rights.</p><p>Use <a href="/blog/recording-studio-client-intake-form-music-sessions">intake</a> to set that expectation and <a href="/blog/recording-studio-session-closeout-workflow">closeout</a> to track what remains.</p>` }
    ],
    faqs: [{"question":"What should a recording studio deliver after a session?","answer":"Depending on the service, studios may deliver final audio, references, stems, clean edits, instrumentals, credits, metadata, split PDFs, invoices, and next-step notes."},{"question":"Should stems always be included?","answer":"Not always. Some studios charge separately for stems or session files, so the delivery policy should be clear."},{"question":"What paperwork belongs with final audio?","answer":"Attach split sheets, credit notes, master notes, sample disclosures, beat licenses, and producer terms where applicable."},{"question":"Should the studio keep copies of split sheets?","answer":"If the studio is part of the workflow, it should keep access-controlled records according to its retention policy and give contributors their copies."},{"question":"How should studios name final files?","answer":"Use clear names with artist, title, version, date, and status so recipients can identify the correct file later."}],
    sources: ["copyrightMusicians","copyrightRegistration","cisacIdentifiers","isrcOfficial"]
  }),
  createPost({
    slug: "artist-release-paperwork-checklist-before-distribution",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. rights context. The fictional readiness record illustrates missing paperwork, not a universal contract template.",
    relatedArticles: [["Check the actual distributor upload","distrokid-tunecore-release-checklist"],["Choose producer documents","producer-agreement-vs-split-sheet"],["Handle songwriter collaboration terms","songwriter-collaboration-agreement-checklist"]],
    cta: {"title":"Put the agreed split in writing","description":"Create a clear rights record and collect signatures alongside the other agreements your release needs.","label":"Start a split record"},
    title: "Artist Release Paperwork Checklist Before Uploading to a Distributor",
    excerpt: "A practical checklist for independent artists preparing split sheets, credits, producer terms, master notes, metadata, and registrations before release day.",
    category: "Independent Artists",
    publishedAt: "2026-09-13",
    seoTitle: "Artist Release Paperwork Checklist Before Distribution",
    metaDescription: "Before uploading music to a distributor, use this artist release paperwork checklist for splits, credits, metadata, producer terms, samples, PROs, and The MLC.",
    primaryKeyword: "artist release paperwork checklist",
    definition: "An artist release paperwork checklist is the pre-upload review that confirms composition splits, master ownership, credits, metadata, samples, producer terms, and registration tasks before a song goes public.",
    takeaway: "Distribution is not the start of paperwork; it is the moment your paperwork gets tested.",
    sections: [
      { id: "before-upload", title: "Find the agreement behind each promise", html: `<p>A release combines several promises: who owns the song, who owns the recording, what the producer is owed, what a featured performer permits, and whether outside material may be used. One document rarely answers all of them.</p><p>Use this page to find missing agreements and assign follow-up. Once they are settled, the <a href="/blog/distrokid-tunecore-release-checklist">pre-upload checklist</a> helps compare the actual files and fields with the approved record.</p>` },
      { id: "split-sheet", title: "Finish the split sheet first", html: `<p>Before upload, confirm every songwriter and percentage. The composition split should total 100% and reflect the actual agreement among writers. Include legal names, professional names, emails, publishers, PROs, and IPI numbers when available.</p><p>A signed split sheet is especially important when the song begins to earn money, attract sync interest, or create registration questions. It is much easier to capture the agreement while everyone is excited than after the song has value.</p>` },
      { id: "master-ownership", title: "Confirm master ownership separately", html: `<p>The master is the specific recording. The artist may own it, but that depends on label agreements, producer terms, featured artist deals, funding, work-for-hire arrangements, and other facts. Keep this record separate from the composition split.</p><p>The U.S. Copyright Office distinguishes musical works from sound recordings. A clean release packet should do the same.</p>` },
      { id: "producer-feature", title: "Review producer and featured artist terms", html: `<p>Producer paperwork may include fee, credit, master royalty, producer points, publishing share, stem delivery, revisions, approvals, and sample responsibility. A featured artist agreement may include credit language, royalty terms, approval rights, and promotional expectations.</p><p>Do not let one text message stand in for the whole deal. If the producer owns part of the composition, document that on the split sheet. If they receive master royalties, document that separately.</p>` },
      { id: "samples-beats", title: "Check beats, samples, loops, and interpolations", html: `<p>Read the actual license for the proposed use, including term, territory, distribution limits, monetization, Content ID, and sync restrictions. A tier name or purchase receipt is not the full grant of rights.</p><p>A sample of existing audio can involve both composition and recording rights. An interpolation recreates material without using that earlier audio, so the composition remains a separate review. Identify each source and the relevant permission or other lawful basis instead of marking every borrowed element “covered.”</p>` },
      { id: "credits-metadata", title: "Clean up credits and metadata", html: `<p>Confirm spelling for artist names, featured artists, producers, writers, engineers, mixers, mastering engineers, musicians, and studio credits. Match those names across distributor upload, split sheet, metadata sheet, and public credits.</p><p>Add lyrics, explicit status, language, genre, mood, tempo, and identifiers when available. Metadata is not decoration; it helps systems and people understand the release.</p>` },
      { id: "registration-tasks", title: "Assign registrations alongside release preparation", html: `<p>Name the person or representative handling PRO work registration, MLC registration or claims where applicable, copyright registration, and publishing updates. Confirm which works, shares, and territories an administrator actually covers.</p><p>Keep ownership percentages separate from each organization's collection-share format. Save submission references and check accepted records; a plan to register and an accepted registration are different statuses.</p>` },
      { id: "paperwork-example", title: "A release can have signed splits and still be waiting", html: `<div class="blog-scenario"><h3>Fictional readiness review: “Back to the Avenue”</h3><p>The writers have signed a 70/30 composition agreement. The producer's fee and credit are agreed, but the master-royalty calculation is still described only as “three points.” A beat receipt is present without the full license.</p><p>The artist assigns two follow-ups: confirm the royalty base and payment terms with the producer, and retrieve and review the beat license for this release. The signed composition total is complete; those separate recording and permission questions remain open.</p></div><div class="blog-table-wrap" role="region" aria-label="Document readiness review" tabindex="0"><table><caption>Document readiness review</caption><thead><tr><th scope="col">Question</th><th scope="col">Evidence to keep</th><th scope="col">Status to record</th></tr></thead><tbody><tr><th scope="row">Composition shares</th><td>Agreed signed record and relevant publishing grants.</td><td>Agreed / awaiting signatures / disputed.</td></tr><tr><th scope="row">Recording and royalties</th><td>Recording ownership and producer or performer terms.</td><td>Approved / terms missing.</td></tr><tr><th scope="row">Third-party inputs</th><td>Full license or other applicable permission record.</td><td>Reviewed for this use / unresolved.</td></tr><tr><th scope="row">Registration responsibility</th><td>Named registrant and confirmations when completed.</td><td>Assigned / submitted / follow-up needed.</td></tr></tbody></table></div>` },
      { id: "release-packet", title: "Create one release packet", html: `<p>Store the final split PDF, audio versions, lyrics, artwork, credits, metadata, master notes, producer terms, beat licenses, sample notes, registration confirmations, and contacts in one folder. Use it as the source for your distributor, publisher, manager, and sync pitches.</p><p>For sync-minded artists, add the <a href="/blog/independent-artist-sync-licensing-starter-kit">sync licensing starter kit</a> before sending songs to libraries or supervisors.</p>` }
    ],
    faqs: [{"question":"Must every person in the studio receive a songwriting split?","answer":"No. Record the actual composition agreement and separate performer, engineering, credit, fee, and recording arrangements."},{"question":"Does paying the producer establish all recording rights?","answer":"Payment alone does not explain every ownership or licensing term. Review the relevant agreements."},{"question":"Can a beat receipt replace the license?","answer":"Keep the full license and any amendments. The receipt alone may not show permitted uses or restrictions."},{"question":"What if an IPI is unknown?","answer":"Mark it pending and ask the contributor or representative to confirm it. Do not invent an identifier."},{"question":"Does the distributor finish these agreements?","answer":"No. Delivery, payout settings, ownership agreements, and publishing administration serve different jobs."}],
    sources: ["copyrightMusicians","copyrightTransfers","copyrightPreexistingMusic","mlcMember","mlcRegistration"]
  }),
  createPost({
    slug: "independent-artist-sync-licensing-starter-kit",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "Starter workflow with fictional song statuses. This is preparation guidance, not a promise of placement or a fixed industry song-count requirement.",
    relatedArticles: [["Build the detailed sync packet","how-to-make-a-song-sync-ready"],["Organize the catalog spreadsheet","music-catalog-metadata-spreadsheet-for-sync"],["Write the actual submission","music-supervisor-pitch-package"]],
    cta: {"title":"Start the kit with an agreed rights record","description":"Keep signed contributor information beside the audio and catalog notes.","label":"Document the split"},
    title: "Independent Artist Sync Licensing Starter Kit: Rights, Files, Metadata, and Pitch Prep",
    excerpt: "A sync starter kit for independent artists who want to prepare songs for TV, film, ads, trailers, games, content, and licensing opportunities.",
    category: "Sync Licensing",
    publishedAt: "2026-09-13",
    seoTitle: "Independent Artist Sync Licensing Starter Kit",
    metaDescription: "Build an independent artist sync licensing starter kit with signed splits, master rights, metadata, clean versions, instrumentals, lyrics, and pitch-ready files.",
    primaryKeyword: "independent artist sync licensing",
    definition: "An independent artist sync licensing starter kit is a small, organized set of songs with clear rights, useful audio versions, searchable metadata, and approval contacts ready before a supervisor, brand, or library asks.",
    takeaway: "Start with a manageable group of songs whose files, rights evidence, and approval contacts you can reliably find and maintain.",
    sections: [
      { id: "starter-kit-purpose", title: "What a sync starter kit does", html: `<p>A starter kit helps an independent artist move from “I want placements” to “these songs are actually pitchable.” It collects the rights records, files, metadata, and contact details that make a track easier to review and clear.</p><p>Sync licensing is not just sending music links. A buyer may need composition permission, master permission, clean files, instrumentals, lyrics, usage details, and fast approval. Your kit should answer those needs before they become urgent.</p>` },
      { id: "choose-songs", title: "Start with a manageable shortlist", html: `<p>Choose a few songs you can explain and deliver reliably. Five to ten can be a useful working limit, but the right number depends on your catalog and the brief. Include songs with known ownership, usable files, relevant creative descriptions, and reachable approval contacts.</p><p>Separate the kit from any one pitch. You can maintain several prepared songs while sending only the strongest matches to a particular request.</p>` },
      { id: "shortlist-example", title: "Use the first review to choose what to finish", html: `<div class="blog-table-wrap" role="region" aria-label="Fictional starter-kit shortlist" tabindex="0"><table><caption>Fictional starter-kit shortlist</caption><thead><tr><th scope="col">Song</th><th scope="col">Prepared</th><th scope="col">Next decision</th></tr></thead><tbody><tr><th scope="row">“Open Windows”</th><td>Full mix, instrumental, confirmed rights contacts.</td><td>Consider for a matching brief; confirm its requested terms.</td></tr><tr><th scope="row">“Late Connection”</th><td>Full mix and ownership record.</td><td>Engineer prepares the promised instrumental; mark it pending.</td></tr><tr><th scope="row">“Home Signal”</th><td>Audio and mood notes.</td><td>Resolve an unidentified sample before representing the track as clearable.</td></tr></tbody></table></div><p>Work on the specific missing item instead of sending all three as equally ready. Preparation status does not mean a license has been issued.</p>` },
      { id: "rights-folder", title: "Create the rights folder", html: `<p>Attach signed split sheets, publisher and PRO details, master owner contacts, sample notes, beat-license notes, and approval restrictions. If a song is not one-stop, say who needs to approve it.</p><p>Copyright Alliance explains that sync use of a composition and use of an existing recording can require different permissions. Keep those permission paths visible.</p>` },
      { id: "audio-folder", title: "Prepare useful audio versions", html: `<p>Every sync candidate should have a high-quality full mix. When possible, add instrumental, clean, no-lead-vocal, stems, short edits, and alternate endings. Editors often need options to fit a scene.</p><p>Name files clearly with artist, title, version, BPM if useful, explicit status, and date. Do not make a supervisor decode your session naming habits.</p>` },
      { id: "metadata-folder", title: "Make the shortlist easy to search", html: `<p>Describe genre, mood, energy, tempo, vocal content, lyrical themes, language, and explicit status. Add the work and recording references, relevant rights contacts, and available versions.</p><p>Use descriptions supported by the track: “warm acoustic song about returning home, lead vocal, instrumental available” gives a listener more to work with than a string of broad promotional keywords. It does not guarantee search visibility or selection.</p>` },
      { id: "pitch-copy", title: "Write pitch copy that respects the brief", html: `<p>Use a short pitch note. Mention the song, why it fits, what versions are available, and how rights can be cleared. Do not send ten unrelated songs because one brief used the word emotional.</p><p>Good pitch copy is practical: “Soulful mid-tempo R&B track about rebuilding confidence, clean and instrumental available, composition and master contacts attached.”</p>` },
      { id: "clearance-honesty", title: "Keep preparation separate from clearance", html: `<p>For each song, record ownership evidence, who can approve, third-party restrictions, and any missing decision. A publisher's involvement does not automatically prevent one-stop clearance; the relevant question is what authority has been granted.</p><p>Use the <a href="/blog/one-stop-music-licensing-rights-clearance">one-stop guide</a> to describe that authority accurately. Keep private signed agreements out of a public listening page; provide the required evidence through the appropriate private channel.</p>` },
      { id: "conversion-workflow", title: "Maintain the kit as the songs change", html: `<p>After production, add the agreed rights record. After mixing and mastering, add the approved audio and matching metadata. After release or registration, add confirmed references. Log changed representatives, restrictions, and approvals when they arise.</p><p>Michael Smith describes Blak Marigold Studio's own sequence as production, in-session splits in Studio One, mixing and mastering, then entering the same information in its DISCO portfolio. That is a reported studio process; it does not imply an automatic integration.</p>` }
    ],
    faqs: [{"question":"How do independent artists get started with sync licensing?","answer":"Start by organizing a small set of songs with clear rights, useful audio versions, metadata, and contacts before pitching."},{"question":"What files do I need for sync licensing?","answer":"Prepare full mix, instrumental, clean version, lyrics, stems when available, and clear metadata."},{"question":"Do I need a publisher for sync licensing?","answer":"Not always, but you need clear composition ownership, administration, and approval authority."},{"question":"Can I pitch songs with samples?","answer":"Only if the sample status and permissions are clear. Uncleared samples can block placements."},{"question":"Should I send MP3s or WAVs?","answer":"A streaming preview is useful for first listen, but have high-quality WAV files ready when requested."}],
    sources: ["copyrightMusicians","copyrightAllianceSync","sesacFaq","cisacIdentifiers","isrcOfficial"]
  }),
  createPost({
    slug: "music-supervisor-pitch-package",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "Fictional brief and email example. Follow the recipient’s actual submission rules; these suggestions do not establish a universal supervisor preference.",
    relatedArticles: [["Choose and prepare the candidates","independent-artist-sync-licensing-starter-kit"],["Verify one-stop authority","one-stop-music-licensing-rights-clearance"],["Track song and recording data","music-catalog-metadata-spreadsheet-for-sync"]],
    cta: {"title":"Keep a clear record behind the pitch","description":"Document the agreed contributors and rights, then summarize the relevant approval route for the recipient.","label":"Prepare a split record"},
    title: "Music Supervisor Pitch Package: What to Send With a Sync Submission",
    excerpt: "A practical package format for sending music supervisors useful songs, clean files, metadata, lyrics, rights notes, and approval contacts without creating friction.",
    category: "Sync Licensing",
    publishedAt: "2026-09-13",
    seoTitle: "Music Supervisor Pitch Package for Sync Submissions",
    metaDescription: "Build a music supervisor pitch package with streaming links, downloads, instrumentals, clean versions, lyrics, metadata, rights status, and approval contacts.",
    primaryKeyword: "music supervisor pitch package",
    definition: "A music supervisor pitch package is the compact set of links, files, rights notes, metadata, and contact information that lets a supervisor evaluate and clear a song with minimal back-and-forth.",
    takeaway: "The best pitch package respects the brief and makes the next step obvious: listen, test, clear, quote, or pass.",
    sections: [
      { id: "supervisor-needs", title: "What a supervisor needs from your pitch", html: `<p>A supervisor is usually balancing creative fit, clearance risk, budget, timeline, edit needs, and communication speed. Your pitch package should help them move through those filters quickly.</p><p>Do not treat the pitch like a fan announcement. Treat it like a professional handoff: here is the song, here is why it fits, here are the usable versions, here is who controls it, and here is how to quote or approve it.</p>` },
      { id: "match-the-brief", title: "Match the brief before you send anything", html: `<p>If the brief asks for upbeat indie pop with clean lyrics, do not send dark explicit trap because it is your strongest record. Save everyone's time by reading the mood, tempo, lyrical subject, vocal type, era, budget, and clearance requirements.</p><p>When a song is close but not exact, explain the useful angle in one sentence. The goal is to help the supervisor imagine the placement, not convince them to reinterpret the brief.</p>` },
      { id: "listening-link", title: "Test the listening link as a recipient", html: `<p>Follow the brief's link, file, and naming instructions. Where a private streaming link is permitted, check that the intended recipient can listen, see the correct tracks, and use any promised downloads. Check access in a signed-out browser context or with the service's recipient preview.</p><p>Keep the selection short enough to explain why each track fits. Do not change permissions on your private rights archive just to make the preview convenient. Audio access and agreement access should be deliberate.</p>` },
      { id: "download-folder", title: "Prepare the download folder", html: `<p>Have WAV, MP3, instrumental, clean version, lyrics, and stems when available. If you do not want to send downloads immediately, state that files are ready on request.</p><p>Every file should be named clearly. Include artist, title, version, and status. Avoid inside jokes, old mix numbers, or confusing abbreviations.</p>` },
      { id: "rights-summary", title: "Add a short rights summary", html: `<p>The rights summary should state composition contact, master contact, publisher or administrator info, one-stop status, sample notes, restrictions, and approval timing. It does not need to expose every private deal detail in the first email.</p><p>Copyright Alliance notes that sync and master-use permissions can both matter when using an existing recording. A good pitch package makes both paths easy to understand.</p>` },
      { id: "metadata-lyrics", title: "Provide the information needed for review", html: `<p>Keep genre, mood, tempo, vocal content, language, explicit status, title, artist, versions, and contact details with the listening material. Have lyrics and a more detailed rights summary ready in the format requested.</p><p>Identify who may approve lyric changes, cutdowns, or alternate versions if those are discussed. Being able to edit the session does not by itself authorize every adaptation.</p>` },
      { id: "pitch-email", title: "Show the match in a short email", html: `<div class="blog-scenario"><h3>Fictional brief</h3><p>A family-drama scene needs warm acoustic music about returning home, with clean lyrics, an instrumental option, and a rights answer by October 20. No song-count limit is specified.</p></div><blockquote><p><strong>Subject:</strong> “Open Windows” — warm acoustic song for the homecoming scene</p><p>Sending one candidate: a warm acoustic vocal about returning home, with clean lyrics and an instrumental available. The private listening page includes both versions and lyrics.</p><p>I can coordinate composition and master clearance; a co-writer's publisher must approve its composition interest separately. Please confirm the media, territory, term, and budget, and I will check the requested October 20 timing with that publisher.</p></blockquote><p>The example identifies a fit, available files, and an honest approval limitation. Use an actual working link in your own message; this example does not represent a real brief or authorize sending a pitch.</p>` },
      { id: "follow-up", title: "Follow the brief’s communication rules", html: `<p>Respect submission deadlines, no-contact instructions, and any stated follow-up policy. If follow-up is welcome, send a concise, useful update, such as an available instrumental or a newly confirmed approval. Repeated status requests add little.</p><p>Track the recipient, brief, submitted recording version, date, rights statement, and outcome. The <a href="/blog/music-catalog-metadata-spreadsheet-for-sync">catalog sheet</a> helps identify the exact material previously sent.</p>` }
    ],
    faqs: [{"question":"How many songs should I submit?","answer":"Follow the brief’s limit. Otherwise send only the matches you can justify briefly; a fixed number is not an industry rule."},{"question":"Should I attach the full rights agreement to the first pitch?","answer":"Follow the request and share only what is needed. A concise rights summary can identify the approval path without exposing private signatures or contacts."},{"question":"What if the track needs a separate publisher approval?","answer":"State that clearly, identify the coordination route, and verify timing rather than calling it unconditionally one-stop."},{"question":"Does a clean version guarantee suitability?","answer":"No. Confirm lyrical meaning, scene fit, requested restrictions, and the actual audio version as well as the explicit label."}],
    sources: ["copyrightAllianceSync","copyrightMusicians","sesacFaq","isrcOfficial"]
  }),
  createPost({
    slug: "producer-agreement-vs-split-sheet",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. rights context. The deal example below is fictional; document contents and the actual agreement matter more than the file name.",
    relatedArticles: [["Understand producer fees, points, and songwriting shares","producer-splits-explained"],["Check the terms of a purchased beat license","producer-splits-for-beats"],["See a filled composition split example","what-is-a-split-sheet-in-music"]],
    cta: {"title":"Record the ownership everyone agreed to","description":"Use Split Sheet Studio for composition, master, or combined ownership records and signatures. Keep production services, fees, and royalty calculations clearly documented alongside the selected shares.","label":"Start the ownership record →"},
    title: "Producer Agreement vs. Split Sheet: What Music Creators Should Document",
    excerpt: "Choose the right record for ownership, production fees, revisions, credit, and royalties, then check a fictional deal for the terms still missing.",
    category: "Producers",
    publishedAt: "2026-09-13",
    seoTitle: "Producer Agreement vs Split Sheet for Music Creators",
    metaDescription: "Learn the difference between a producer agreement and a split sheet, including producer points, master royalties, beat licenses, credits, fees, and publishing shares.",
    primaryKeyword: "producer agreement vs split sheet",
    creatorResourceLimit: 11,
    definition: "A songwriting split sheet records agreed composition shares. A producer agreement defines production services and deal terms such as fees, deliverables, credit, and recording royalties. Either document needs to say exactly which rights and obligations it covers.",
    takeaway: "A signed ownership percentage does not explain a revision allowance, a delivery deadline, or how a producer royalty is calculated. Put each promise where both parties can find it.",
    sections: [
      { id: "why-confusion-happens", title: "Start with the promise, then choose the document", html: `<p>The invoice says “paid in full.” The split sheet gives the producer 25%. The artist now asks for another mix revision. Which document answers whether that revision is included?</p><p>That question belongs in the production-service terms. The ownership share answers a different question. Use this guide to identify the record each promise needs; the <a href="/blog/producer-splits-explained">producer-splits guide</a> explains the underlying rights and payment categories.</p>` },
      { id: "document-map", title: "Which document answers which question?", html: `<div class="blog-table-wrap" role="region" aria-label="Producer document decision guide" tabindex="0"><table><caption>Check the contents, rather than relying on the document title</caption><thead><tr><th scope="col">Question</th><th scope="col">Record to check</th><th scope="col">Detail that needs an answer</th></tr></thead><tbody><tr><th scope="row">Who owns the composition?</th><td>Songwriting split sheet and relevant publishing agreement</td><td>Names, agreed shares, rights covered, and signatures.</td></tr><tr><th scope="row">Who owns the recording?</th><td>Master ownership terms or a clearly scoped master split record</td><td>Recording/version, owners, and any reserved rights.</td></tr><tr><th scope="row">What does the fee cover?</th><td>Producer or services agreement</td><td>Payment milestones, deliverables, revisions, and deadlines.</td></tr><tr><th scope="row">How is a royalty paid?</th><td>Producer agreement</td><td>Rate, calculation base, deductions, accounting, and payment timing.</td></tr><tr><th scope="row">What uses does a beat license allow?</th><td>The actual license for that transaction</td><td>Term, territory, usage limits, and any extra approval requirements.</td></tr><tr><th scope="row">What credit must appear?</th><td>Agreed credit terms and release metadata</td><td>Exact wording, spelling, role, and where it will appear.</td></tr></tbody></table></div>` },
      { id: "split-sheet-role", title: "What belongs on the split sheet", html: `<p>For a composition split, identify the song, writers, contact details, agreed shares, and signatures. Keep the ownership total at 100%. Publisher information helps carry the agreement into the appropriate registration workflow.</p><p>A split record can also expressly cover master ownership. Split Sheet Studio offers composition, master, and combined packets, with separate totals for the selected rights. A master ownership percentage and a royalty payment percentage still describe different terms.</p><p>The <a href="https://www.copyright.gov/register/pa-sr.html">Copyright Office distinguishes the composition and recording</a>. Name the right being documented rather than assuming one percentage covers both.</p>` },
      { id: "producer-agreement-role", title: "What belongs in a producer agreement", html: `<p>A producer agreement may cover the fee, payment timing, deliverables, revisions, stems, session files, credit, approvals, representations about samples, producer points, accounting, recoupment, and master-side royalties. The scope depends on the actual deal.</p><p>Define the practical terms. <strong>Stems</strong> are grouped audio exports, such as drums or vocals; specify whether individual tracks or session files are also included. <strong>Recoupment</strong> describes recovering agreed costs or advances under the contract. A <strong>sample warranty</strong> is a contractual statement about third-party material; it is not the permission itself.</p><p>If a term transfers copyright ownership, <a href="https://www.copyright.gov/title17/92chap2.html#204">U.S. law generally requires a signed writing</a>. Get qualified advice on ownership transfers, disputed terms, or complex royalty arrangements.</p>` },
      { id: "beat-license", title: "Where beat licenses fit", html: `<p>A beat license is not automatically the same as a producer agreement or split sheet. It may grant permission to use a production under defined limits while reserving other rights. Exclusive and nonexclusive licenses can still include restrictions.</p><p>Review term, territory, monetization, sync, Content ID, stems, publishing, credit, samples, and transfer language. If the producer also owns a composition share, document that separately.</p>` },
      { id: "points-vs-publishing", title: "Separate ownership from a producer royalty", html: `<p>A producer may co-own a composition, own part of a recording, receive a recording royalty, or combine those arrangements. Write each one separately. A royalty rate needs a defined payment base, accounting schedule, and treatment of costs.</p><p>For a worked calculation, use the <a href="/blog/producer-splits-explained#studio-example">two fictional producer deals</a>. This article's job is to help you find the document that defines each obligation.</p>` },
      { id: "credits", title: "Credit language should be exact", html: `<p>Credit affects reputation and metadata. Write the exact credit: produced by, co-produced by, additional production, beat by, mixed by, vocal production by, or another agreed phrase. Make sure distributor metadata, social captions, liner notes, and studio delivery match.</p><p>Credit does not automatically equal ownership. Ownership should be stated in the relevant agreement.</p>` },
      { id: "session-closeout", title: "Set service terms early, confirm ownership at closeout", html: `<p>Agree on production services, fees, deliverables, and the intended rights arrangement before work starts. Once the songwriting and production contributions are settled, confirm the actual composition shares and collect signatures. Closeout checks the agreement; it should not be the first time anyone hears the fee or delivery terms.</p><p>Use the <a href="/blog/recording-studio-session-closeout-workflow">session closeout workflow</a> and the <a href="/blog/producer-splits-for-beats">beat-license review guide</a> to carry the agreed terms into the final handoff.</p>` },
      { id: "missing-term-example", title: "A fictional deal: find the missing terms", html: `<div class="blog-example"><h3>Night Bus — an illustrative paperwork check</h3><p>The artist and producer record composition ownership at 75% / 25%. Their production summary lists a $600 fee, two mix revisions, delivery of a full mix and instrumental, and the credit “Produced by Noah Reed.” These are invented terms, not recommended rates or contract wording.</p><p>The split sheet answers who owns the composition. The production summary answers several service questions. Neither summary yet says who owns the master, whether any continuing royalty is owed, when payment is due, or whether stems are included.</p><p><strong>Next action:</strong> resolve those open terms and add them to the relevant agreement before treating the paperwork as complete. Do not infer recording ownership or unlimited revisions from the fee, the credit, or the composition share.</p></div>` },
      { id: "release-review", title: "Review all producer paperwork before release", html: `<p>Compare the split sheet, producer agreement, beat license, invoice, credits, and metadata. Names, song versions, and rights descriptions should agree. If the documents conflict, ask the parties to resolve the conflict and document the correction.</p><p>Keep sample disclosures and the actual license or permission records together. The <a href="https://www.copyright.gov/engage/musicians/">Copyright Office warns against assuming someone else's music can be used freely</a>. A payment receipt or a producer's warranty does not tell you whether a particular third-party use was licensed.</p>` }
    ],
    faqs: [
      {
        "question": "Do I always need two separate documents?",
        "answer": "A broader agreement can cover several subjects. What matters is whether it clearly addresses ownership, services, payments, permissions, and signatures where required. A short split sheet often leaves service and royalty terms unanswered."
      },
      {
        "question": "Does paying the producer transfer all rights?",
        "answer": "The invoice records payment. Check the rights granted by the agreement rather than treating payment alone as an ownership transfer."
      },
      {
        "question": "Can Split Sheet Studio document master ownership?",
        "answer": "Yes. It supports composition, master, and combined ownership packets. Producer fees, continuing royalty calculations, deliverables, and service terms still need clear documentation."
      },
      {
        "question": "What if the beat license conflicts with the split sheet?",
        "answer": "Resolve the conflict with the relevant parties before relying on either record for release or clearance. Save the agreed clarification or amendment with both documents."
      }
    ],
    sources: ["copyrightMusicians","copyrightRegistration","copyrightTransfers","musicianIncome"]
  }),
  createPost({
    slug: "music-catalog-metadata-spreadsheet-for-sync",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "The downloadable CSV contains fictional examples, not a live catalog or assigned identifiers. It is an editable starter, with no clearance automation or integration.",
    relatedArticles: [["Understand the identifier fields","music-metadata-isrc-iswc-ipi-guide"],["Verify licensing authority","one-stop-music-licensing-rights-clearance"],["Build the pitch package","music-supervisor-pitch-package"]],
    cta: {"title":"Link the agreed rights record to each work","description":"Keep the completed agreement in private storage and summarize its status in the catalog.","label":"Create the split record"},
    title: "Music Catalog Metadata Spreadsheet for Sync: Columns Every Artist and Studio Should Track",
    excerpt: "A sync-focused metadata spreadsheet guide for tracking songs, recordings, splits, publishers, master owners, files, moods, identifiers, and clearance status.",
    category: "Music Metadata",
    publishedAt: "2026-09-13",
    seoTitle: "Music Catalog Metadata Spreadsheet for Sync Licensing",
    metaDescription: "Build a music catalog metadata spreadsheet for sync licensing with columns for rights, files, writers, publishers, master owners, ISRC, ISWC, moods, and clearance status.",
    primaryKeyword: "music catalog metadata spreadsheet",
    definition: "A music catalog metadata spreadsheet is a searchable source of truth for songs and recordings, connecting creative descriptions, rights data, identifiers, files, approvals, and pitch status in one structured place.",
    takeaway: "If your catalog cannot be filtered by mood, rights status, instrumental availability, and approval contact, it is harder to pitch and harder to clear.",
    sections: [
      { id: "why-spreadsheet", title: "Why sync catalogs need a spreadsheet", html: `<p>A catalog can sound amazing and still be hard to use. If you cannot quickly find songs by mood, tempo, clean status, one-stop status, instrumental availability, writer, publisher, master owner, or sample risk, your catalog will slow down under pressure.</p><p>A metadata spreadsheet gives artists, studios, managers, and sync producers a practical operating system. It does not replace agreements. It points to them and makes the catalog searchable.</p>` },
      { id: "song-vs-recording", title: "Choose a row structure you can maintain", html: `<p>For a small catalog, use one row per recording, with a stable internal work label linking versions of the same composition. Keep recording title, version, audio link, and ISRC separate from the work title, composition agreement, and ISWC.</p><p>As the catalog grows, put works, recordings, and individual writers or publishers in linked tabs or tables. Avoid treating several writers and several share percentages in one cell as a database that can calculate ownership reliably.</p>` },
      { id: "creative-columns", title: "Creative discovery columns", html: `<p>Add title, artist, genre, subgenre, mood, energy, tempo, BPM, vocal type, language, explicit status, lyrical theme, instruments, era, similar scene uses, and short pitch description. Write like a human searching for a scene, not like a keyword robot.</p><p>Useful examples include: “tense trap instrumental for sports comeback,” “warm acoustic love song for family montage,” or “clean confident hip-hop hook for brand launch.”</p>` },
      { id: "rights-columns", title: "Track the evidence behind the status", html: `<p>Include composition agreement status, recording ownership, approval route, restrictions, evidence location, last-checked date, and the next responsible person. Keep the underlying contracts in private storage.</p><p>Use explicit values such as “authority needs confirmation,” “separate publisher approval,” and “rights unresolved.” A single green status cannot tell you whether the audio is complete, ownership is agreed, or a particular license is approved.</p>` },
      { id: "starter-download", title: "Download and adapt the catalog starter", html: `<p><a href="/resources/sync-catalog-starter.csv" download>Download the sync catalog starter (CSV)</a>. It contains three fictional recording rows and the fields used in the example below. Replace or delete the examples before using it for your own catalog.</p><div class="blog-table-wrap" role="region" aria-label="Fictional catalog records" tabindex="0"><table><caption>Fictional catalog records</caption><thead><tr><th scope="col">Recording</th><th scope="col">Work label</th><th scope="col">Next action</th></tr></thead><tbody><tr><th scope="row">“Open Windows” — Studio</th><td>DEMO-WORK-01</td><td>Confirm authority for the current brief; no license issued.</td></tr><tr><th scope="row">“Open Windows” — New live performance</th><td>DEMO-WORK-01</td><td>Obtain the live recording ownership record before pitching.</td></tr><tr><th scope="row">“Late Connection” — Studio</th><td>DEMO-WORK-02</td><td>Request the instrumental and confirm the publisher approval route.</td></tr></tbody></table></div><p>The internal labels link recordings to compositions. They are not official identifiers. Blank ISRC and ISWC fields mean the example supplies no assigned code.</p><p>Import the CSV into your preferred spreadsheet app and keep identifier columns as text. It has no formulas, automatic clearance, or DISCO connection. Add detailed writer and publisher records separately rather than treating the summary as a completed split agreement.</p>` },
      { id: "file-columns", title: "Audio and asset columns", html: `<p>Track full mix, instrumental, clean, stems, acapella, lyrics, artwork, WAV link, MP3 link, file location, and version notes. The sheet should answer whether useful edit versions exist before someone opens the session folder.</p><p>For studios, this doubles as a delivery record. For managers, it becomes a quick way to know which songs can be submitted to a brief.</p>` },
      { id: "identifier-columns", title: "Identifier and registration columns", html: `<p>Add ISRC for recordings, ISWC for compositions when assigned, IPI for writers and publishers, distributor, release date, UPC, PRO registration status, MLC status, copyright registration status, and notes.</p><p>ISRC guidance says ISRC is intended for recordings and music videos. Keep it attached to the correct recording version instead of treating it as the song ownership ID.</p>` },
      { id: "split-links", title: "Link to signed records without making them public", html: `<p>Link the work to the applicable signed agreement or mark it missing. Keep a separate status for the recording agreement and any licensing authority. A composition split can be complete while master terms remain open.</p><p>Use access-controlled evidence links for people who need them. Before sending a catalog extract outside the team, remove private agreement URLs, personal contact data, and internal negotiation notes that the recipient does not need.</p>` },
      { id: "review-rhythm", title: "Filter for the question you are answering", html: `<p>For a brief requiring instrumentals, filter for that file availability and then review rights authority and restrictions. For a rights cleanup, filter for missing agreements or stale authority checks. These are different tasks.</p><p>If someone supplies the missing instrumental, update its file status without silently changing an unresolved approval to complete. Confirm every required condition for the actual pitch and log the version sent.</p>` }
    ],
    faqs: [{"question":"Does one row represent a song or recording?","answer":"The starter uses one row per recording with an internal work label connecting versions of the same composition."},{"question":"Can the CSV validate composition ownership totals?","answer":"No. It is a catalog summary, not a split calculator. Keep the complete signed ownership record and detailed party data separately."},{"question":"Does the starter contain real music or assigned codes?","answer":"No. The rows are fictional, internal labels are clearly marked, and official identifier fields are blank."},{"question":"Can an audio status change clear the rights status?","answer":"No. Track file availability and approval authority separately, and check both for the intended use."},{"question":"Should I share the whole sheet with a supervisor?","answer":"Share the relevant listening and rights summary requested. Remove private evidence links and unnecessary personal or negotiation details from an external extract."}],
    sources: ["copyrightMusicians","copyrightRegistration","cisacIdentifiers","isrcOfficial","mlcRegistration"]
  }),
  createPost({
    slug: "songwriter-collaboration-agreement-checklist",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. songwriting workflow. The example is fictional; this checklist helps prepare a discussion and is not a complete collaboration contract.",
    relatedArticles: [["See a filled composition split","what-is-a-split-sheet-in-music"],["Manage remote review and signing","remote-collaboration-split-sheets"],["Choose producer terms and documents","producer-agreement-vs-split-sheet"]],
    cta: {"title":"Send the agreed version for review","description":"Document the contributors and applicable rights only after everyone understands the proposal.","label":"Prepare the split record"},
    title: "Songwriter Collaboration Agreement Checklist: Splits, Credits, Publishing, and Approval Notes",
    excerpt: "A songwriting-session checklist for capturing collaborators, composition splits, credits, publishing details, approvals, and unresolved questions before release pressure starts.",
    category: "Songwriting",
    publishedAt: "2026-09-13",
    seoTitle: "Songwriter Collaboration Agreement Checklist",
    metaDescription: "Use this songwriter collaboration agreement checklist to document co-writers, splits, credits, publishing, PROs, IPIs, samples, approvals, and signatures.",
    primaryKeyword: "songwriter collaboration agreement checklist",
    definition: "A songwriter collaboration agreement checklist is the practical review of who contributed to a song, what ownership percentages were agreed, what credits and publishing details are known, and what questions must be resolved before release or registration.",
    takeaway: "The split conversation is easiest while the session is fresh and hardest after the song starts earning attention.",
    sections: [
      { id: "why-collaboration-needs-record", title: "Record what the collaborators actually agree", html: `<p>A hook in the room, a bridge written remotely, or a late lyric revision can change the group involved in a song. Keep contributions, credits, ownership proposals, and approvals visible as the work develops.</p><p>The checklist prepares the discussion. The final agreement should identify the work, parties, interests, and terms clearly enough that everyone reviews the same proposal.</p>` },
      { id: "name-contributors", title: "Name every contributor", html: `<p>List legal names, professional names, emails, roles, and what each person contributed. Include people in the room and remote collaborators. If someone contributed to performance or engineering but not composition, record the credit separately.</p><p>Credits and ownership are related but not identical. The checklist should make both visible.</p>` },
      { id: "composition-splits", title: "Agree on composition splits", html: `<p>Discuss writer shares while the session is fresh. The split sheet should total 100% and reflect the collaborators' agreement. Include publisher, PRO, and IPI information when known, but do not guess missing data.</p><p>If the team is not ready to decide, label the split as a draft and schedule a specific follow-up. Avoid letting an unresolved draft become the release record by accident.</p>` },
      { id: "publishing-admin", title: "Capture publishing and administration details", html: `<p>Ask whether each writer is self-administered, represented by a publisher, using an administrator, or unsure. This matters for registrations, licensing, and sync approval. The MLC guidance distinguishes self-administered writers from represented writers in its membership and registration workflows.</p><p>When someone does not know their publishing data, capture the person responsible for finding it.</p>` },
      { id: "master-and-producer", title: "Separate composition, recording, and payment promises", html: `<p>A producer may have a composition interest, a fee, a contractual recording royalty, a credit, or several of these. State the categories separately. Composition ownership does not automatically determine master ownership or the producer royalty calculation.</p><p>If the split record expressly covers the master too, review the separately labeled master ownership total. Broader production promises, such as delivery, revisions, payment dates, and royalty accounting, need the relevant agreement language.</p>` },
      { id: "samples-approvals", title: "List samples, loops, and approvals", html: `<p>Ask whether the collaboration used samples, interpolations, loops, outside stems, or reference material. Document the source and status. Also list approvals required for release, sync, remix, lyric changes, or featured artist use.</p><p>Unknown material should be marked as unknown. Pretending it is cleared can hurt the song later.</p>` },
      { id: "late-contributor", title: "When someone joins after the first draft", html: `<div class="blog-scenario"><h3>Fictional example: “Porchlight”</h3><p>Two writers have an unsigned 60/40 proposal. A third collaborator later contributes a new chorus. The team discusses the contribution and proposes a new 50/30/20 composition split. Those figures are fictional negotiated terms, not a rule for valuing a chorus.</p><p>The requester replaces the unsigned working proposal and gives all three people the revised version to review. They do not obtain a signature on the older 60/40 version while telling the new collaborator that their interest will be added later.</p></div><div class="blog-table-wrap" role="region" aria-label="Collaboration change record" tabindex="0"><table><caption>Collaboration change record</caption><thead><tr><th scope="col">Record</th><th scope="col">Status</th><th scope="col">Next step</th></tr></thead><tbody><tr><th scope="row">Earlier 60/40 draft</th><td>Superseded working proposal; unsigned.</td><td>Retain as history and identify the current proposal.</td></tr><tr><th scope="row">New 50/30/20 proposal</th><td>Awaiting everyone’s review.</td><td>Confirm contributions, publishing details, and other affected terms.</td></tr><tr><th scope="row">Recording deal</th><td>Separate review.</td><td>Check whether the change affects recording ownership, credits, fees, or royalties.</td></tr></tbody></table></div><p>If a Split Sheet Studio request has already been submitted for signatures, its terms are locked. Follow the <a href="/blog/remote-collaboration-split-sheets#finalization">correction guidance</a> for pending proposals; do not imply an informal message changes the active record. Completed records use the separate revision process.</p>` },
      { id: "signatures", title: "Give everyone the same full proposal", html: `<p>Confirm required details, contribution descriptions, rights scope, shares, publishing arrangements, and any linked terms before sending. Unknown information can stay flagged during drafting; it must be resolved where the final signing process requires it.</p><p>Track actual signatures rather than treating an invitation or a viewed link as acceptance. Once the request is completed, keep the same completed record for all signers, alongside the separate agreements it references.</p>` },
      { id: "make-it-normal", title: "Make collaboration paperwork normal", html: `<p>The goal is not to scare collaborators. The goal is to protect the song. A simple message works: “Before we upload or pitch this, let's make sure everyone is named correctly and the split matches what we agreed.”</p><p>Use <a href="/blog/what-is-a-split-sheet-in-music">the split-sheet guide</a> and <a href="/blog/artist-release-paperwork-checklist-before-distribution">the artist release checklist</a> when the collaboration is moving toward release.</p>` }
    ],
    faqs: [{"question":"Does a split sheet contain every collaboration term?","answer":"It documents the rights and terms it expressly covers. Approval, administration, payment, delivery, or recording arrangements can require additional agreement language."},{"question":"What if a third writer joins before signing?","answer":"Review the changed contribution and proposal with everyone. Identify the current version before collecting signatures."},{"question":"Can I change submitted percentages inside an active request?","answer":"Submitted Split Sheet Studio terms are locked. Use the support and correction guidance for a pending proposal or the separate completed-record revision flow."},{"question":"Does engineering or performance automatically earn a writing share?","answer":"No automatic percentage follows from the job title. Discuss actual authorship and the relevant agreements, with credits and compensation recorded separately."},{"question":"Can I invent publisher or IPI details to finish?","answer":"No. Confirm required details with the contributor or representative before finalizing."}],
    sources: ["copyrightMusicians","copyrightTransfers","mlcMember","splitSheetSupport"]
  }),
  createPost({
    slug: "how-to-rescan-plugins-in-your-daw",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "Vendor instructions checked October 14, 2026. Menu names are version-dependent. This is a documentation review, not a claim that every named host or plug-in version was tested hands-on.",
    relatedArticles: [["Use a browser-based remote split workflow","remote-collaboration-split-sheets"],["Document the studio closeout","recording-studio-session-closeout-workflow"],["Prepare client intake","recording-studio-client-intake-form-music-sessions"]],
    cta: {"title":"Keep the split discussion moving","description":"Use the hosted workflow when it fits the session, then return to host troubleshooting with the exact versions and scan result.","label":"Open the web workflow"},
    title: "How to Rescan Plugins in Your DAW: The Complete VST3, AU, and AAX Guide",
    excerpt: "Find missing plug-ins in Studio One, Ableton Live, FL Studio, Cubase, Cakewalk, REAPER, Pro Tools, Logic Pro, Bitwig, and other major DAWs.",
    category: "DAW Workflow",
    publishedAt: "2026-08-23",
    seoTitle: "How to Rescan Plugins in Any DAW: VST3, AU & AAX",
    metaDescription: "Learn how to rescan missing plugins in Studio One, Ableton, FL Studio, Cubase, Cakewalk, REAPER, Pro Tools, Logic Pro, Bitwig, and more.",
    primaryKeyword: "how to rescan plugins in your DAW",
    definition: "To find a missing plug-in, match its operating system, architecture, and format to the DAW, verify the installation location, and run the host’s normal scan before trying a targeted rescan. Authorization and account errors need a different check after the plug-in loads.",
    takeaway: "Identify where the process fails: installation, discovery, validation, opening the plug-in, or signing in. That keeps the next troubleshooting step specific.",
    sections: [
      { id: "check-format-first", title: "Check the plug-in format before you rescan", html: `<p>Most missing-plugin problems begin with format mismatch. VST3 is widely supported by Windows DAWs. Pro Tools uses AAX, while Logic Pro uses Audio Units on macOS. A DAW cannot discover a format it does not host, no matter how many times you scan.</p><ul><li><strong>VST3:</strong> common in Studio One, Ableton Live, FL Studio, Cubase, Nuendo, Cakewalk, REAPER, Bitwig, Mixcraft, Waveform, and other Windows hosts.</li><li><strong>AAX:</strong> the current Pro Tools plug-in format.</li><li><strong>Audio Units:</strong> the native third-party format used by Logic Pro.</li><li><strong>Standalone:</strong> opens outside a DAW and does not require a plug-in scan.</li></ul>` },
      { id: "diagnosis", title: "Choose the next check from the symptom", html: `<div class="blog-table-wrap" role="region" aria-label="Missing plug-in diagnosis" tabindex="0"><table><caption>Missing plug-in diagnosis</caption><thead><tr><th scope="col">Symptom</th><th scope="col">First check</th><th scope="col">Useful next action</th></tr></thead><tbody><tr><th scope="row">Installer completed but no entry in the DAW</th><td>Correct OS, format, architecture, and folder.</td><td>Run the normal host scan and check the effect category.</td></tr><tr><th scope="row">Entry appears as failed or blocked</th><td>Exact scan or validation message.</td><td>Use the host’s targeted rescan and vendor compatibility guidance.</td></tr><tr><th scope="row">Plug-in opens but sign-in or connection fails</th><td>Hosted account, network, and displayed service error.</td><td>Use product support; repeated audio scanning will not change account access.</td></tr><tr><th scope="row">Standalone opens but the DAW has no entry</th><td>Standalone and plug-in are separate installed components.</td><td>Confirm the actual plug-in bundle exists in the expected folder.</td></tr></tbody></table></div>` },
      { id: "windows-vst3-location", title: "Verify the standard Windows VST3 location", html: `<p>On 64-bit Windows, the standard VST3 system folder is <code>C:\\Program Files\\Common Files\\VST3</code>. Split Sheet Studio installs its VST3 bundle there and also installs a standalone app.</p><p>Close every DAW before running an installer or update. After installation, confirm that the Split Sheet Studio bundle exists in the standard folder, reopen your DAW, and let its startup scan finish. Download the current build from the <a href="/plugin">Windows plugin page</a>.</p>` },
      { id: "studio-one", title: "How to rescan in Studio One Pro 7", html: `<p>These steps reference the <a href="https://support.presonus.com/hc/en-us/articles/29252556213773-Studio-One-Pro-7-How-can-I-get-my-3rd-party-plug-ins-to-show-up-in-Studio-One">Studio One Pro 7 vendor guide</a>. For Fender Studio Pro or a different release, confirm the corresponding menus in its documentation.</p><ol><li>Close the host before installing or updating.</li><li>Confirm the 64-bit Windows VST3 installation in the standard folder.</li><li>Open Studio One, review <strong>Options &gt; Locations &gt; VST Plug-ins</strong>, and allow startup scanning to finish.</li><li>Check <strong>View &gt; Plug-in Manager</strong> for a hidden or blocked entry. Use its blocklist controls when the scan result calls for them.</li><li>Restart and look for the effect in the Browser.</li></ol><p>The standard Windows VST3 folder is scanned automatically. Do not add the whole drive or all of Program Files as a scan path.</p>` },
      { id: "ableton-live", title: "How to rescan in Ableton Live on Windows", html: `<ol><li>Open <strong>Settings/Preferences &gt; Plug-Ins</strong>.</li><li>Enable the VST3 system folder and confirm the plug-in is installed there.</li><li>Click <strong>Rescan</strong> and wait for completion.</li><li>If the correctly installed device remains missing, Ableton's <a href="https://help.ableton.com/hc/en-us/articles/115000349184-VST-AU-plug-in-doesn-t-appear-in-Live-s-Browser">missing-plug-in guidance</a> describes holding <strong>Alt</strong> while clicking Rescan for a deep scan on Windows.</li><li>Check the plug-in category in the Browser and test in a blank Set.</li></ol><p>Keep VST2 and VST3 locations distinct. A system folder setting and a custom folder setting are not interchangeable.</p>` },
      { id: "fl-studio", title: "How to rescan in FL Studio", html: `<ol><li>Open <strong>Options &gt; File settings &gt; Manage plugins</strong>.</li><li>Use the vendor installer and the expected plug-in location.</li><li>Enable <strong>Verify plugins</strong>, then choose <strong>Find installed plugins</strong>.</li><li>For an updated or previously verified device, use <strong>Rescan previously verified plugins</strong> as appropriate.</li><li>Check <strong>Plugin database &gt; Installed &gt; Effects</strong> for an effect such as Split Sheet Studio.</li></ol><p><a href="https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/basics_externalplugins.htm">Image-Line's instructions</a> distinguish a verified scan from a fast scan and explain favorites. Do not place third-party VSTs in FL Studio's native plug-in folder.</p>` },
      { id: "cubase-nuendo", title: "How to rescan in Cubase; check Nuendo’s matching version", html: `<p>In Cubase Pro 15, open the <strong>VST Plug-in Manager</strong> from the Studio menu. Search the effects tab, then use <strong>Scan for new and blocked plug-ins</strong>. The <a href="https://www.steinberg.help/r/cubase-pro/15.0/en/cubase_nuendo/topics/installing_and_managing_plugins/installing_and_managing_plugins_vst_plug_in_manager_toolbar_r.html">version 15 manual</a> identifies <strong>Shift</strong> with that control for a full rescan.</p><p>Review the scan or blocklist result instead of repeatedly attempting to load a rejected device. For Nuendo or another Cubase release, use that version's manual rather than assuming identical controls.</p>` },
      { id: "cakewalk-bandlab", title: "How to rescan in Cakewalk Sonar", html: `<ol><li>Open <strong>Edit &gt; Preferences</strong> or press <strong>P</strong>.</li><li>Choose <strong>File &gt; VST Settings</strong>.</li><li>Confirm the standard VST3 scan location.</li><li>Run a normal scan. For a failed device, set Manual Scan, select <strong>Rescan Failed Plug-ins</strong>, and scan again.</li></ol><p>The <a href="https://help.cakewalk.com/hc/en-us/articles/360034722693-Using-Cakewalk-Sonar-VST-Scanner">current Sonar scanner guide</a> lists the default paths. Distinguish this Windows desktop host from a browser or mobile music tool; a desktop VST3 installer is not a browser extension.</p>` },
      { id: "reaper-bitwig-more", title: "Find the equivalent scan controls in other hosts", html: `<p>In REAPER, look in <strong>Options &gt; Preferences &gt; Plug-ins &gt; VST</strong> for the paths and re-scan controls. Match the instructions to the current <a href="https://www.reaper.fm/userguide.php">REAPER user guide</a>.</p><p>For Bitwig, Mixcraft, Waveform, Reason, or another host, check its current manual for supported formats, locations, blocked devices, and rescan controls. A broad claim that a host accepts “plugins” does not verify that your exact plug-in format and operating system are supported.</p>` },
      { id: "pro-tools-logic", title: "Check AAX and Audio Units before rescanning", html: `<p><strong>Pro Tools:</strong> its native plug-in format is AAX. A VST3-only installer will not become a native AAX device through a rescan. Use the plug-in vendor's AAX build and authorization instructions if one is offered.</p><p><strong>Logic Pro on Mac:</strong> use an appropriate Audio Units build. In <strong>Logic Pro &gt; Settings &gt; Plug-in Manager</strong>, a failed-validation entry can be selected for <strong>Reset &amp; Rescan Selection</strong>. If it is not authorized, resolve authorization using the manufacturer instructions. See <a href="https://support.apple.com/en-gb/122179">Apple's troubleshooting guide</a>.</p><p>The currently advertised Split Sheet Studio download is a Windows VST3 and standalone package. Use the <a href="/plugin">download page</a> for available builds rather than assuming an AAX or Mac edition exists.</p>` },
      { id: "troubleshooting", title: "Keep a short troubleshooting record", html: `<p>Before contacting support, capture the OS, DAW version, plug-in version and format, installed location, exact scan message, and whether the device opens in a blank project. Note the scan steps already tried.</p><p>Start with format and location, then normal scanning, then the vendor's targeted failed or blocked-device guidance. Reinstall or use a full cache rebuild only when the evidence calls for it. A scan cannot fix a host that does not accept the installed format.</p>` },
      { id: "split-sheet-studio-plugin", title: "Check discovery and the hosted connection separately", html: `<p>The <a href="/plugin">Windows package</a> includes a VST3 effect and standalone app. The installer places the VST3 bundle in the standard Windows folder. Host support and actual compatibility still depend on the specific versions in use.</p><ol><li>Close the host, install the package, and confirm the bundle.</li><li>Rescan with the host's documented procedure.</li><li>Open the effect in a blank test project.</li><li>Check sign-in and the hosted workflow separately from plug-in discovery.</li></ol><p>If an important session needs its split agreement now, the hosted browser workflow is another entry point. No release date for additional formats is promised here.</p>` }
    ],
    faqs: [{"question":"Why does the standalone open while the VST3 is missing?","answer":"They are separate installed components. Confirm the plug-in bundle, supported format, folder, and host scan result."},{"question":"Where is the standard 64-bit Windows VST3 folder?","answer":"C:\\Program Files\\Common Files\\VST3. Use the vendor installer and check the actual installed bundle."},{"question":"Will rescanning turn a Windows VST3 into an AAX or Mac plug-in?","answer":"No. The host needs a compatible operating-system build and format."},{"question":"Should I reset every plug-in cache first?","answer":"Check format, location, and the normal scan first. Use targeted or full resets according to the relevant vendor guidance and observed failure."},{"question":"Why does rescanning not fix sign-in?","answer":"Once the plug-in opens, account or network errors belong to the hosted connection check, not the audio discovery scan."}],
    sources: ["presonusPlugins","abletonWindowsPlugins","abletonMissingPlugins","flStudioPlugins","cubasePluginManager","cakewalkScanner","appleLogicPlugins","avidAax","reaperGuide","splitSheetPlugin"]
  }),
  createPost({
    slug: "what-is-a-split-sheet-in-music",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "This guide uses a U.S. copyright framework. The worked example is fictional; the studio account comes from Michael Smith’s experience.",
    relatedArticles: [
      ["Understand writer and publisher share displays", "songwriting-splits-writer-share-publisher-share"],
      ["Collect signatures from remote collaborators", "remote-collaboration-split-sheets"],
      ["Separate producer fees, points, and songwriting shares", "producer-splits-explained"]
    ],
    cta: { title: "Put the agreed splits in writing", description: "Choose the rights your packet covers, record the agreed shares, and collect signatures with Split Sheet Studio. Keep producer fees, royalties, and other contract terms documented alongside it.", label: "Create a split sheet →" },
    title: "What Is a Split Sheet in Music? The Complete Creator Guide",
    excerpt: "See what belongs on a music split sheet, work through a three-writer example, and learn when to collect signatures and handle unresolved shares.",
    category: "Split Sheets",
    publishedAt: "2026-08-22",
    seoTitle: "What Is a Split Sheet in Music? Complete 2026 Guide",
    metaDescription: "Learn what a music split sheet is, what it should include, when producers and songwriters should sign it, and why every writing session needs one.",
    primaryKeyword: "music split sheet",
    definition: "A music split sheet is a written record of who helped create a song and the percentage of the underlying composition each songwriter or composer owns.",
    takeaway: "Capture the agreed composition shares while the session is fresh. If a share is disputed, keep the record in draft and name the next step before everyone leaves.",
    sections: [
      { id: "what-it-records", title: "What a music split sheet records", html: `<p>A split sheet records the collaborators' agreement about the underlying music and lyrics, known as the <em>composition</em>. Start with the song title, date, writers' legal names, contact details, agreed ownership shares, and signatures.</p><p>Publisher and registration details help the same agreement travel into royalty systems. A <strong>PRO</strong> is a performance rights organization; it licenses public performances of compositions and distributes royalties. An <strong>IPI</strong> identifies a writer or publisher in rights databases. Collect verified details or assign follow-up for anything unknown.</p><p>The <a href="https://www.copyright.gov/engage/musicians/">U.S. Copyright Office distinguishes the composition from the recording</a>. This guide's 100% example covers the composition. Master ownership needs its own clearly identified shares.</p>` },
      { id: "filled-example", title: "A filled example: three writers, one composition", html: `<p><strong>Fictional example:</strong> Maya writes the verses and part of the melody. Jordan co-writes the chorus melody while producing the track, and Avery writes the hook lyrics. They agree to 50/25/25 after reviewing their contributions. These are negotiated example shares, not a formula for dividing every song.</p><div class="blog-example"><h3>Song: After the Last Train</h3><dl class="blog-example-details"><dt>Production session</dt><dd>October 1, 2026</dd><dt>Agreement version and signing</dt><dd>Composition agreement v1; all three writers sign on October 2, 2026</dd><dt>Rights covered</dt><dd>100% of the composition; recording ownership and producer compensation handled separately</dd></dl><div class="blog-split-bar" role="img" aria-label="Composition ownership: Maya Chen 50 percent, Jordan Ellis 25 percent, Avery Brooks 25 percent"><span>Maya 50%</span><span>Jordan 25%</span><span>Avery 25%</span></div><div class="blog-table-wrap" role="region" aria-label="Example songwriter details" tabindex="0"><table><caption>Composition ownership summary — fictional names and contacts</caption><thead><tr><th scope="col">Writer / contribution</th><th scope="col">Contact</th><th scope="col">Composition ownership</th></tr></thead><tbody><tr><th scope="row">Maya Chen / lyrics and melody</th><td>maya@example.com</td><td>50%</td></tr><tr><th scope="row">Jordan Ellis / chorus melody</th><td>jordan@example.com</td><td>25%</td></tr><tr><th scope="row">Avery Brooks / hook lyrics</th><td>avery@example.com</td><td>25%</td></tr><tr><th scope="row">Total</th><td>Three agreeing writers</td><td>100%</td></tr></tbody></table></div><p>This is a compact summary of the fictional agreement. Registration details and signatures are omitted from the illustration, rather than presented as a completed product form. Collect the required details before completing your own signing workflow; keep unknown information pending instead of inventing identifiers.</p></div><p>Jordan's 25% refers to this composition. A production fee or master royalty would be calculated separately. When registering the work, follow the receiving organization's writer and publisher share instructions; its display may differ from this ownership summary.</p>` },
      { id: "why-it-matters", title: "Why producers, artists, and songwriters need one", html: `<p>Six months after a session, a manager asks who owns the chorus and who can approve a licensing request. The answer should be in a shared record, with names and contacts attached, rather than reconstructed from separate conversations.</p><p>A signed split sheet gives collaborators a reference for what they agreed. It also gives later registration and clearance work a consistent starting point.</p>` },
      { id: "studio-lesson", title: "A studio lesson: the song was finished before the paperwork", html: `<p>On one sync-focused project at Blak Marigold Studio, we finished production before creating a split sheet. We had discussed a publishing interest for the studio verbally. The artist later released the song, claimed full ownership of the composition and master, and said she had no publisher. We disputed that position and could not add the track to our sync portfolio on the publishing basis we understood had been agreed.</p><p>This is our account; the artist and project are unnamed. The practical mistake was doing the work before putting the business arrangement in writing.</p><p>Discuss production, publishing, and recording terms before work begins, then finalize the agreed composition shares once the contributions are settled. <a href="https://www.copyright.gov/title17/92chap2.html#204">U.S. copyright ownership transfers generally require a signed writing</a>. A split sheet may need to be accompanied by publishing, administration, or production agreements that spell out the remaining rights and duties. The missing split sheet alone does not decide the parties' legal rights.</p>` },
      { id: "composition-versus-master", title: "Composition splits are not master ownership", html: `<p>A released song commonly contains two copyright-protected works: the musical composition and the sound recording. A split sheet normally covers the composition. The master may have different owners and revenue terms.</p><p>Two writers can own the composition 50/50 while one artist or label owns the master. A producer may receive a songwriting share, master royalty, fee, or combination. Document each right in the correct agreement.</p>` },
      { id: "deciding-splits", title: "How collaborators decide songwriting splits", html: `<p>There is no universal formula that determines a fair split. Collaborators may split equally, divide ownership according to contribution, or negotiate another arrangement. The goal is informed agreement before release pressure begins.</p><ul><li>Discuss contributions to lyrics, melody, harmony, and composition.</li><li>Separate songwriting from featured-artist fees and producer master points.</li><li>Confirm that the composition ownership totals exactly 100%.</li><li>Leave a disputed record unresolved instead of forcing a false final document.</li></ul>` },
      { id: "session-workflow", title: "From agreed shares to a completed record", html: `<ol><li>Enter the song title, date, and version.</li><li>Identify the writers and their current contact details; distinguish songwriting from performance and production credits.</li><li>Review the composition shares together and check the 100% total.</li><li>Collect the required publisher and registration details, or keep the record pending while someone verifies them.</li><li>Have every writer review the same version and sign in person or remotely.</li><li>Give everyone the completed record and store it with the song's documents.</li></ol><p>In Split Sheet Studio, select whether the packet covers the composition, master ownership, or both. The example above covers composition only. The app checks separate writer, publisher, and master totals for the selected rights; copying one composition percentage into every field can misstate the deal.</p><p>For a disputed share, record the open question and arrange follow-up. In our studio, we complete the split step after production and before mixing and mastering; the <a href="/blog/recording-studio-session-closeout-workflow#windows-plugin">studio closeout guide shows that workflow</a>.</p>` },
      { id: "mistakes", title: "Split sheet mistakes that delay releases", html: `<p>Common failures include missing legal names, percentages that do not total 100%, confusing composition ownership with master ownership, leaving out a producer who contributed to the song, and using old contact information.</p><p>A blank publisher field should trigger a question, not an assumption. Review the record before submission so the data is complete, readable, and accepted by every contributor.</p>` },
      { id: "after-signing", title: "What to do after everyone signs", html: `<p>Store the completed record, give every party a copy, and use the agreed ownership data for the relevant registration workflows. A signed split sheet does not automatically register the song with a PRO, The MLC, or the Copyright Office. The <a href="https://www.copyright.gov/engage/musicians/">Copyright Office explains these separate registration activities</a>.</p><p>If an error appears after signing, keep the earlier version, discuss the correction with everyone affected, and obtain confirmation of the revised agreement. Editing your own copy does not show that the others accepted the change.</p><p>The useful finish line is a record every writer understands and can find later, with separate master terms and a named owner for any remaining follow-up.</p>` }
    ],
    faqs: [
      { question: "Is a split sheet a legal contract?", answer: "A signed split sheet can be important evidence of agreed ownership, but it may not cover every term in a full collaboration or publishing agreement. Ask a qualified music attorney about your situation." },
      { question: "When should a split sheet be completed?", answer: "Start while the session is fresh and complete it when every writer has reviewed and agreed to the shares. If terms are disputed, keep a draft and arrange follow-up rather than rushing signatures." },
      { question: "Do producer points belong on a songwriting split sheet?", answer: "Usually not. Songwriting shares concern the composition. Producer points commonly concern master royalties and should be documented separately unless the agreement clearly combines both subjects." },
      { question: "Can a split sheet be signed remotely?", answer: "Yes. A remote workflow can send each contributor a secure link to review the same song data, confirm percentages, and sign from another location." },
      { question: "Do split sheet percentages need to equal 100%?", answer: "Yes. Composition ownership should resolve to a complete 100%. Follow the specific display rules of the organization where the work is later registered." }
    ],
    sources: ["copyrightMusicians", "copyrightRegistration", "copyrightTransfers", "bmiRegistration", "bmiIpi", "sesacPro"]
  }),
  createPost({
    slug: "songwriting-splits-writer-share-publisher-share",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. publishing context. The payment example is fictional; registration formats and administration agreements determine how actual shares are entered and paid.",
    relatedArticles: [["See a filled composition split example","what-is-a-split-sheet-in-music"],["Separate composition and recording rights","master-rights-vs-publishing-rights"],["Prepare for MLC registration","the-mlc-mechanical-royalties-guide"]],
    cta: {"title":"Document the agreement before entering registrations","description":"Record the agreed contributors, shares, and publishing details, then use each organization’s instructions to translate that record.","label":"Start a split sheet"},
    title: "Songwriting Splits Explained: Writer Share, Publisher Share, and 100% Totals",
    excerpt: "A plain-English explanation of writer share, publisher share, self-publishing, PRO registration scales, and why clean totals matter.",
    category: "Publishing",
    publishedAt: "2026-08-21",
    seoTitle: "Songwriting Splits: Writer vs Publisher Share Explained",
    metaDescription: "Understand composition ownership, writer and publisher shares, BMI’s 200% scale, and self-administration with a clear 60/40 payment example.",
    primaryKeyword: "songwriting splits",
    definition: "A songwriting split records the agreed ownership of the composition. In performance royalty accounting, writer share and publisher share describe payment allocations; they should not be mistaken for two separate songs or a universal split of all music income.",
    takeaway: "Agree on one complete ownership picture, then translate it carefully into the share format used by your PRO, publisher, or administrator.",
    sections: [
      { id: "ownership-pie", title: "Start with one composition ownership pie", html: `<p>When collaborators say a song is split 50/50, they usually mean each writer owns half of the composition. That ownership picture should resolve to 100%.</p><p>Confusion starts when creators mix that calculation with a PRO's payment display. Preserve the underlying agreement first, then enter it in the format required by each platform. A composition split also does not settle the ownership of the recording or a producer's fee.</p>` },
      { id: "writer-share", title: "What writer share means", html: `<p>In a U.S. PRO statement, writer share refers to the songwriter or composer's allocation of composition public-performance royalties. On a session split sheet, people may use the same words to mean the writers' agreed composition ownership. Check which meaning a form uses before entering a number.</p><p>Legal name, professional name, PRO affiliation, and IPI help identify the correct person. A performing artist is not automatically a songwriter, and a producer is not automatically excluded. Discuss authorship and the agreement rather than assigning a percentage from a job title alone.</p>` },
      { id: "publisher-share", title: "What publisher share means", html: `<p>For performance royalties, publisher share describes the publishing-side allocation. Who receives or administers it depends on the rights granted and the collection rules. A writer may retain publishing rights, assign an interest to a publisher, or authorize administration under an agreement.</p><p>Administration authority and copyright ownership are separate questions. Ask each collaborator: “Who owns your share, who collects for it, and which rights and territories does that arrangement cover?” A business name alone does not answer all three.</p>` },
      { id: "different-scales", title: "Why BMI can show 200% for one song", html: `<p><a href="https://www.bmi.com/creators/royalty-policy-manual">BMI's royalty policy manual</a> treats the performance payment as 200%. The usual division allocates 100% to writers and 100% to publishers. This is an accounting scale; the composition has not acquired 200% ownership.</p><p>Unassigned publishing interests change the entries. BMI explains that a writer can receive the applicable unassigned publishing portion through the writer allocation. Do not automatically copy a 60/40 ownership agreement into both sets of fields. Follow the current instructions for each writer's actual publishing arrangement.</p>` },
      { id: "payment-example", title: "A 60/40 song: ownership versus a payment", html: `<div class="blog-scenario"><h3>Fictional example: “Paper Lanterns”</h3><p>Nina Patel and Theo Grant agree that Nina owns 60% of the composition and Theo owns 40%. Both retain their publishing interests. For this illustration only, assume a $1,000 composition performance payment is allocated into equal $500 writer and $500 publisher portions, with each portion following 60/40 and no fees or deductions.</p></div><div class="blog-table-wrap blog-payment-table" role="region" aria-label="Fictional writer and publisher payment example" tabindex="0"><table><caption>Fictional performance payment</caption><thead><tr><th scope="col">Writer</th><th scope="col">Ownership</th><th scope="col">Writer portion</th><th scope="col">Publisher portion</th><th scope="col">Total paid</th></tr></thead><tbody><tr><th scope="row">Nina Patel</th><td>60%</td><td>$300</td><td>$300</td><td>$600</td></tr><tr><th scope="row">Theo Grant</th><td>40%</td><td>$200</td><td>$200</td><td>$400</td></tr><tr><th scope="row">Total</th><td>100%</td><td>$500</td><td>$500</td><td>$1,000</td></tr></tbody></table></div><p>This is a payment illustration, not a set of registration form entries. Nina's $300 plus $300 is still 60% of the $1,000 payment. It does not give her 120% ownership. A publisher or administrator agreement could change who receives a portion and what reaches the writer.</p><p>This example does not describe a universal division of mechanical royalties, sync fees, distributor revenue, or master ownership. Those require their own terms. Nor does it predict the amount earned from a stream.</p>` },
      { id: "self-published", title: "What “I don’t have a publisher” leaves unanswered", html: `<p>A self-administered songwriter handles the relevant share without an outside administrator. Saying “I don't have a publisher” does not make that person's publishing interest available to another collaborator. Confirm whether the writer retains it and whether any earlier agreement grants someone else rights.</p><p>Self-administration also brings registration work. Eligible self-administered writers can become <a href="https://help.themlc.com/en/support/what-is-a-member">Members of The MLC</a> for the works they administer. A fully administered writer should confirm the administrator's responsibilities before setting up a second collection route.</p>` },
      { id: "conversation", title: "How to lead the split conversation", html: `<ol><li>Name everyone who contributed to the composition.</li><li>Discuss creative contributions while the session is fresh.</li><li>State proposed composition percentages out loud.</li><li>Separate composition ownership from master ownership, royalties, and fees.</li><li>Confirm that the composition ownership totals 100% and identify any existing publishing agreements.</li><li>Give everyone the same agreed record to review and sign before using it for registrations.</li></ol>` },
      { id: "registration-data", title: "The data to collect before registration", html: `<p>Keep the title and any genuine alternate titles, writers' legal and professional names, roles, PROs and IPIs, publishing entities, administrators, contacts, and agreed composition shares together. Confirm identifiers with the person or organization that issued them; a guessed IPI can identify the wrong person.</p><p>Keep a separate note of the share format used by each destination and its registration reference. When a number looks different, check the scale and administration arrangement before assuming someone changed the deal. A signed record helps explain the agreement; it does not submit a PRO or MLC registration automatically.</p>` }
    ],
    faqs: [
      {"question":"Are writer share and composition ownership always the same number?","answer":"No. A split sheet and a PRO payment system can use different conventions. Check the field definition and the writer’s publishing arrangement."},
      {"question":"Does a publisher automatically own half of every song?","answer":"No. Ownership and administration depend on the agreements. A performance royalty allocation is not a universal ownership rule."},
      {"question":"Why does BMI use 200%?","answer":"BMI measures the performance payment on a 200% scale. Unassigned publishing interests can be included in a writer’s allocation; follow its current registration guidance."},
      {"question":"Do I need to form a publishing company to retain rights?","answer":"Retaining rights does not itself require transferring them to a new company. Collection organizations have their own account and registration requirements for self-administered writers."},
      {"question":"Should collaborators split a song equally?","answer":"They may agree to equal shares, but the percentage should be discussed rather than assumed. Keep the recording deal and fees separate."}
    ],
    sources: ["bmiRoyaltyManual","copyrightMusicians","mlcMember"]
  }),
  createPost({
    slug: "sync-licensing-checklist",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. sync context. The fictional request is a review exercise, not a proposed license or standard deal terms.",
    relatedArticles: [["Assemble the audio and metadata packet","how-to-make-a-song-sync-ready"],["Check approval authority","one-stop-music-licensing-rights-clearance"],["Audit publishing arrangements","music-publishing-before-sync-licensing"]],
    cta: {"title":"Keep the rights record ready for review","description":"Document agreed composition and recording shares, then track permissions for each proposed use separately.","label":"Start a split record"},
    title: "Sync Licensing Checklist: Make Your Music Easier to Clear",
    excerpt: "Review the proposed media, territory, term, versions, restrictions, and approval authority before granting a sync use.",
    category: "Sync Licensing",
    publishedAt: "2026-08-20",
    seoTitle: "Sync Licensing Checklist for Independent Artists & Producers",
    metaDescription: "Use a practical sync request checklist to review media, territory, term, recording version, fees, restrictions, and composition and master approvals.",
    primaryKeyword: "sync licensing checklist",
    definition: "Sync licensing allows a composition to be paired with visual media. Using an existing sound recording also requires master-use permission, so a sync-ready song needs clear ownership on both sides.",
    takeaway: "A great song can miss a deadline if nobody can quickly identify and contact every composition and master rights holder.",
    sections: [
      { id: "two-rights", title: "Identify the song, recording, and requested use", html: `<p>A synchronization permission concerns the composition used with visuals. Use of an existing recording also generally requires master-use permission. Start with the exact recording and the rights needed for this request.</p><p>This page helps review the request. Use <a href="/blog/how-to-make-a-song-sync-ready">the sync-ready guide</a> to assemble the files and metadata, and <a href="/blog/one-stop-music-licensing-rights-clearance">the one-stop guide</a> to check who has authority.</p>` },
      { id: "ownership-checklist", title: "Clear ownership before you pitch", html: `<ul><li>Signed composition splits totaling 100%.</li><li>Current publisher and administrator information.</li><li>Confirmed master owner and authorized contact.</li><li>Written sample and interpolation clearances.</li><li>Agreement on who may approve and quote the use.</li><li>No unresolved contributor disputes.</li></ul><p>Do not call a track one-stop unless one authorized contact can truly clear the relevant rights.</p>` },
      { id: "metadata", title: "Build a supervisor-ready metadata package", html: `<p>Use a consistent title, alternate title, artist, writers, publishers, PROs, IPIs, ISWC when assigned, ISRC, release status, explicit flag, genre, mood, tempo, themes, and contacts.</p><p>Metadata should answer three questions fast: What is this track? Who controls it? How can approval be obtained?</p>` },
      { id: "deliverables", title: "Prepare useful audio deliverables", html: `<p>Keep a high-quality full mix and instrumental ready. Depending on the opportunity, clean versions, vocal-up or vocal-down mixes, stems, cutdowns, and alternate endings can help editors.</p><p>Name files consistently. A music supervisor should not have to guess whether “FINAL_mix_7_REAL.wav” matches the metadata sheet.</p>` },
      { id: "discovery", title: "Ask for the use details before quoting", html: `<ul><li>Production and scene or advertisement description.</li><li>Media and platforms, including any separate promotional use.</li><li>Territory, term, start date, and proposed duration of music.</li><li>Recording version, edits, lyric changes, or stems requested.</li><li>Exclusivity, restricted categories, options, and any renewal terms.</li><li>Budget, fee structure, response deadline, and contracting parties.</li></ul><p>Do not quote a limited permission while allowing the discussion to imply a broader grant.</p>` },
      { id: "request-example", title: "Read the gap in a fictional request", html: `<div class="blog-scenario"><h3>Fictional request: “Glass Morning”</h3><p>A producer asks for 30 seconds in a North American online film for one year. The email adds, “We may also use it for worldwide paid social promotion.” A $500 budget is mentioned without saying whether it covers both rights.</p><p>Before approving, confirm the advertising use, territory, term, edit, exclusivity, and whether the budget is total or per rights side. Send the clarified use to the authorized composition and master contacts. Do not treat the online-film description as permission for the additional worldwide campaign.</p></div>` },
      { id: "response", title: "Record the approval and final license", html: `<ol><li>Confirm the complete use description and any negotiation limits.</li><li>Identify every required authorized approval route and outstanding permission.</li><li>Record approvals against the exact terms and recording version.</li><li>Have the relevant parties complete the actual license and agreed payment process.</li><li>Deliver the approved assets under those terms and keep the final license and usage records.</li></ol><p>Identify who supplies cue-sheet information when needed. A completed ownership split or a sent file does not replace the license.</p>` },
      { id: "readiness-test", title: "Check for unanswered questions", html: `<p>Before saying yes, confirm: what use, which version, who can approve, what terms and fee, what restrictions, and which files are required? If the answer depends on another owner or publisher, keep that approval pending.</p><p>An organized catalog helps respond quickly. No particular time limit or checklist score proves a song is legally cleared.</p>` }
    ],
    faqs: [{"question":"What does sync licensing mean?","answer":"Sync licensing is permission to pair a musical composition with visual media such as film, television, advertising, games, trailers, or online video."},{"question":"Do I also need a master use license?","answer":"If a production wants to use a particular sound recording, it generally needs permission for that master in addition to the composition."},{"question":"What does one-stop mean in sync licensing?","answer":"One-stop commonly means a single authorized party can approve both composition and master rights. Confirm the exact scope before representing a song that way."},{"question":"Can an uncleared sample block a sync placement?","answer":"Yes. Samples and interpolations can introduce more rights owners and approvals, so disclose and clear them before pitching."}],
    sources: ["copyrightMusicians","copyrightAllianceSync","sesacFaq"]
  }),
  createPost({
    slug: "performance-rights-organizations-explained",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. composition performance royalties. Organization terms vary; the fictional registration example illustrates a handoff rather than predict a royalty payment.",
    relatedArticles: [["Translate writer and publisher shares","songwriting-splits-writer-share-publisher-share"],["Handle digital mechanicals separately","the-mlc-mechanical-royalties-guide"],["Identify ISRC, ISWC, and IPI fields","music-metadata-isrc-iswc-ipi-guide"]],
    cta: {"title":"Start registrations from an agreed record","description":"Keep the composition contributors and publishing details consistent before preparing separate royalty registrations.","label":"Document the split"},
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
      { id: "choosing", title: "Questions to answer before affiliating", html: `<p>Review the current creator terms from <a href="https://www.ascap.com/">ASCAP</a>, <a href="https://www.bmi.com/">BMI</a>, <a href="https://www.sesac.com/">SESAC</a>, and <a href="https://globalmusicrights.com/">GMR</a> as relevant. Their availability, agreements, and services are not interchangeable.</p><ul><li>Am I eligible, and what fees apply to my writer or publisher relationship?</li><li>What rights and territories does the agreement cover?</li><li>What term, renewal, and withdrawal requirements apply, including any existing affiliation?</li><li>Who handles work registration and corrections?</li><li>How are distributions explained and support questions handled?</li></ul><p>A famous roster does not tell you what your own songs will earn. Compare the contract and the service you need rather than assuming a universal best choice.</p>` },
      { id: "registration", title: "Register works after joining", html: `<p>Affiliation establishes the relationship with the organization; work registration identifies particular songs. Check that both steps have been handled. Give the responsible registrant the agreed titles, all relevant writers, publishing details, affiliations, and confirmed IPIs.</p><p>Translate the agreement into the organization's current share format. A 100% composition ownership picture is not necessarily a set of numbers to paste into every writer and publisher field. The <a href="/blog/songwriting-splits-writer-share-publisher-share">writer and publisher share guide</a> explains the distinction.</p><p>Save the work reference and review the resulting entry. If it conflicts with the agreement, use the organization's correction process with the affected parties rather than submitting a different ownership claim casually.</p>` },
      { id: "registration-example", title: "A co-write with different PRO affiliations", html: `<div class="blog-scenario"><h3>Fictional example: “Kitchen Light”</h3><p>Jo and Ben agree to 50/50 composition ownership. Jo is affiliated with ASCAP and Ben with BMI. Their different affiliations do not require them to change the songwriting agreement.</p><p>They confirm who handles each registration, include both writers and relevant publishers as required, and check each organization's share format. Each keeps the confirmation for the work. Jo's distributor upload does not complete Ben's PRO work registration or either writer's mechanical collection setup.</p></div><p>BMI's <a href="https://www.bmi.com/about/songview">Songview guidance</a> explains that aligned work data does not mean one participating society pays every writer and publisher.</p>` },
      { id: "pro-versus-mlc", title: "Put each collection task in the right place", html: `<div class="blog-table-wrap" role="region" aria-label="Collection responsibilities" tabindex="0"><table><caption>Collection responsibilities</caption><thead><tr><th scope="col">Task</th><th scope="col">Relevant route</th><th scope="col">Separate follow-up</th></tr></thead><tbody><tr><th scope="row">Composition performance</th><td>Your PRO or authorized representative.</td><td>Confirm affiliation and work entries.</td></tr><tr><th scope="row">Eligible U.S. digital mechanicals</th><td>The MLC or your administrator.</td><td>Confirm who administers and claims each share.</td></tr><tr><th scope="row">Recording distribution revenue</th><td>Distributor or recording-side representative.</td><td>Check the recording agreement and payout setup.</td></tr><tr><th scope="row">Copyright registration</th><td>U.S. Copyright Office where applicable.</td><td>Use the appropriate application process.</td></tr></tbody></table></div><p>One company may offer several services under different agreements. Confirm actual coverage instead of assuming one login covers the entire release.</p>` },
      { id: "checklist", title: "The songwriter registration checklist", html: `<ol><li>Finalize the split sheet.</li><li>Confirm legal names and IPI numbers.</li><li>Identify publishers and administrators.</li><li>Register under the PRO's current rules.</li><li>Handle mechanical registration separately.</li><li>Keep confirmations and correct conflicts quickly.</li></ol><p>Continue with <a href="/blog/the-mlc-mechanical-royalties-guide">The MLC guide</a>.</p>` }
    ],
    faqs: [{"question":"What is a performance rights organization?","answer":"A PRO licenses public performances of works in its repertoire and distributes performance royalties to affiliated songwriters, composers, and publishers under its rules."},{"question":"Is a PRO the same as a publisher?","answer":"No. A PRO licenses and pays for public performance rights. A publisher or administrator may manage a wider set of composition rights."},{"question":"Does joining a PRO register my copyright?","answer":"No. PRO work registration and U.S. Copyright Office registration are different processes."},{"question":"Does a PRO collect mechanical royalties?","answer":"A traditional U.S. PRO focuses on public performance royalties. Mechanical royalty administration is a separate function."},{"question":"What information is needed to register a song?","answer":"Expect to provide the title, writers, publishers, affiliations, identifiers, and complete shares. Requirements vary by organization."}],
    sources: ["sesacPro","bmiRoyaltyManual","bmiSongview","mlcHowItWorks","copyrightMusicians"]
  }),
  createPost({
    slug: "the-mlc-mechanical-royalties-guide",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. digital audio mechanical royalties. The example is fictional and covers administration of a composition share, not ownership of the recording or a promised royalty amount.",
    relatedArticles: [["Understand ownership and publisher share formats","songwriting-splits-writer-share-publisher-share"],["Separate composition and recording rights","master-rights-vs-publishing-rights"],["Collect a clear signed composition record","what-is-a-split-sheet-in-music"]],
    cta: {"title":"Agree on the ownership record first","description":"Keep the agreed contributors, composition shares, and publishing details together before preparing separate royalty registrations.","label":"Start a split sheet"},
    title: "The MLC Explained for Independent Artists and Songwriters",
    excerpt: "A practical guide to U.S. digital audio mechanical royalties, self-administered songwriters, work registration, matching, and publishing data.",
    category: "Mechanical Royalties",
    publishedAt: "2026-08-18",
    seoTitle: "The MLC for Songwriters: Membership and Registration",
    metaDescription: "Find out who handles MLC registration, what to prepare, how to avoid duplicate works, and how collection shares differ from songwriting ownership.",
    primaryKeyword: "MLC registration",
    definition: "The MLC administers the U.S. blanket mechanical license for eligible interactive streaming and digital download activity and distributes related royalties for musical works.",
    takeaway: "First identify who administers your U.S. digital mechanical rights. Then search the existing work data and register or claim only the share you are authorized to collect.",
    sections: [
      { id: "basics", title: "What a mechanical royalty is", html: `<p>A mechanical royalty is tied to reproduction and distribution of a composition. Eligible U.S. interactive streams and digital downloads can generate digital audio mechanical royalties.</p><p>This is composition income, separate from the sound-recording payment a distributor or label receives. A songwriter who also owns the master may have interests on both sides, with separate collection arrangements.</p>` },
      { id: "what-mlc-does", title: "Which royalties The MLC handles", html: `<p>The MLC administers the U.S. blanket mechanical license for eligible digital audio uses, including interactive streams, limited downloads, and permanent downloads. Not every download's mechanical royalty necessarily follows that route; a service can use a pass-through licensing arrangement for permanent downloads.</p><p>The MLC receives usage data, matches recordings to compositions, and pays the relevant Members. It does not replace a PRO's composition performance collection, collect your distributor's master revenue, or clear a song for film and advertising. See its <a href="https://www.themlc.com/faqs/categories/mlc">official scope and licensing FAQs</a>.</p>` },
      { id: "membership", title: "Who should become a Member", html: `<p>A Member is the person or entity authorized to administer works and receive these royalties. A portal login and a payable Member setup are different steps. The <a href="https://help.themlc.com/en/support/what-is-a-member">MLC membership guidance</a> explains verification and tax and banking setup.</p><ul><li><strong>You administer the relevant rights:</strong> establish the appropriate Member and manage the works you administer.</li><li><strong>An administrator handles your entire catalog:</strong> ask it to confirm the works, shares, territory, and collection coverage before duplicating claims.</li><li><strong>Only part is administered:</strong> identify what remains yours to administer. Do not claim shares already assigned to someone else's collection arrangement.</li></ul>` },
      { id: "collection-example", title: "A 60/40 song does not mean you should claim 100%", html: `<div class="blog-scenario"><h3>Fictional example: “Daylight on the Platform”</h3><p>Iris Lane owns 60% of the composition and Owen Price owns 40%. Their agreement gives each the full corresponding mechanical interest. An administrator collects Iris's 60% for U.S. digital audio mechanical uses; Owen administers his own 40%. There are no other grants affecting these example shares.</p></div><div class="blog-table-wrap" role="region" aria-label="Fictional MLC collection responsibility" tabindex="0"><table><caption>Fictional collection responsibilities</caption><thead><tr><th scope="col">Writer</th><th scope="col">Ownership</th><th scope="col">Collects through</th><th scope="col">Collection share</th></tr></thead><tbody><tr><th scope="row">Iris Lane</th><td>60%</td><td>Iris’s administrator</td><td>60%</td></tr><tr><th scope="row">Owen Price</th><td>40%</td><td>Owen’s self-administered Member</td><td>40%</td></tr></tbody></table></div><p>Owen should represent his authorized 40% collection interest, not claim the full song because he is uploading the information. Listing Iris as a co-writer is different from claiming her share. If the work is already present with the administrator's 60% claim, Owen should check the existing record and the available claim process.</p><p>Do not halve Owen's 40% to 20% merely because a PRO statement elsewhere separates writer and publisher portions. The MLC form asks for the share the publisher or administrator is responsible for collecting. Confirm that authority against the actual agreement.</p>` },
      { id: "registration", title: "Search, then register or claim the appropriate share", html: `<p>Use <a href="https://help.themlc.com/en/support/how-to-register-works-in-the-mlc-portal">The MLC's current registration instructions</a> alongside the portal:</p><ol><li>Search by title and writer information before creating a work.</li><li>If the correct work exists, review it and use the share-claiming route where appropriate. If it is absent, follow the new-work process.</li><li>Identify all known writers and the publishers or administrators involved; enter the collection share you are authorized to represent.</li><li>Add accurate recording details to support matching. This is optional in the individual registration process.</li><li>Review, submit, and keep the reference so you can follow the submission status.</li></ol><p>A self-administered writer without a publishing entity name can use the current Member as publisher under the guide's instructions. A submitted registration is not a guarantee that every recording use has matched or that a payment is already due.</p>` },
      { id: "split-data", title: "Prepare one consistent work record", html: `<p>A signed split sheet gives collaborators a shared starting point for names, composition ownership, and publishing contacts. It does not automatically establish every administrator's collection authority or send the work to The MLC.</p><ul><li><strong>Agreement:</strong> composition shares, relevant publishing or administration grants, and who handles registration.</li><li><strong>People:</strong> legal and professional names, writer roles, confirmed IPIs where available, and contact details.</li><li><strong>Work:</strong> title, genuine alternate titles, ISWC when assigned, and any existing registration reference.</li><li><strong>Recordings:</strong> artist, recording title, and known ISRCs for the released versions.</li></ul><p>An IPI identifies a party, an ISWC a musical work, and an ISRC a recording. One composition may have several recordings. Use confirmed identifiers rather than inventing a missing number or treating the recording code as the song's ownership record.</p>` },
      { id: "mistakes", title: "If the record exists but the money does not line up", html: `<p>Start by identifying the problem. <strong>Unmatched</strong> means a reported recording use has not been connected to a work; <strong>unclaimed</strong> means a matched work has an ownership share that no Member has claimed. Those require different follow-up.</p><ul><li><strong>Recording not connected:</strong> check the title, artist, recording identifiers, and work details against the actual release.</li><li><strong>Your authorized share is missing:</strong> review the work and claim process rather than creating a duplicate composition.</li><li><strong>Existing claims leave no room for your share:</strong> review the conflicting-share instructions linked from the registration guide and contact The MLC with the relevant records. Do not change the percentage just to fit.</li><li><strong>Registration appears correct:</strong> check Member payment details, statements, and administrator reporting before assuming all income is missing.</li></ul><p>The MLC does not decide copyright ownership disputes. Its <a href="https://www.themlc.com/faqs/categories/mlc">dispute guidance</a> distinguishes holding affected royalties from deciding who owns the work.</p>` },
      { id: "collection-stack", title: "Keep the collection responsibilities visible", html: `<p>An independent setup may include a distributor for recording revenue, a PRO for composition performance royalties, and The MLC or an administrator for eligible U.S. digital audio mechanicals. Other rights and territories may require other arrangements.</p><p>For each service, write down the rights, territory, catalog, responsible person, and reference number. Keep registration confirmations beside the agreement. That gives you a concrete question when a statement is missing: which right and which share was this service supposed to collect?</p>` }
    ],
    faqs: [
      {"question":"Should every songwriter create a separate MLC Member?","answer":"Not necessarily. Identify who administers the relevant rights first. A fully administered writer should confirm the administrator’s coverage; a self-administered writer may need a payable Member."},
      {"question":"Do I claim the whole song if I wrote only part of it?","answer":"Only claim the share you are authorized to collect. Identifying all known co-writers does not authorize you to collect their shares."},
      {"question":"Does an ISRC register my composition?","answer":"No. An ISRC identifies a recording. Recording details can help connect usage to the underlying musical work."},
      {"question":"Is The MLC a PRO or a copyright registration office?","answer":"No. MLC work data supports digital audio mechanical collection. PRO registration and U.S. Copyright Office registration are separate activities."},
      {"question":"Will registering guarantee payment for every stream?","answer":"No. Coverage, claims, matching, usage reporting, and payment requirements matter. Keep the reference and review the work and account status."}
    ],
    sources: ["mlcScope","mlcHowItWorks","mlcMember","mlcRegistration","copyrightMusicians","cisacIdentifiers"]
  }),
  createPost({
    slug: "music-copyright-musical-work-vs-sound-recording",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. copyright overview. The fictional example illustrates separate works and does not decide ownership in an actual recording.",
    relatedArticles: [["Apply the distinction to release ownership","master-rights-vs-publishing-rights"],["Choose the right producer documents","producer-agreement-vs-split-sheet"],["Prepare release paperwork","artist-release-paperwork-checklist-before-distribution"]],
    cta: {"title":"State which rights the agreement covers","description":"Document composition shares, master ownership, or both under an expressly labeled rights scope.","label":"Create a split record"},
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
      { id: "musical-work", title: "The musical work: composition and lyrics", html: `<p>The musical work is the underlying song: melody, harmony, rhythm where protectable, and lyrics. Songwriters, composers, and lyricists create this layer.</p><p>This page explains the copyright foundation. For the artist-facing business workflow, continue with <a href="/blog/master-rights-vs-publishing-rights">Master Rights vs. Publishing Rights</a>.</p><p>A split sheet documents ownership among composition creators. The work may later be administered by publishers or administrators.</p>` },
      { id: "sound-recording", title: "The sound recording: the master", html: `<p>The sound recording is a particular fixation of sounds. Performers and record producers may contribute authorship, while ownership is shaped by facts and agreements.</p><p>One performance is distinct from another recording of the same composition. A cover can use the song while creating a new master.</p>` },
      { id: "cover-example", title: "A new recording of an existing composition", html: `<div class="blog-scenario"><h3>Fictional example: a cover of “River Steps”</h3><p>A band records its own performance of an existing song. It has created new recorded audio while using an underlying composition it did not write. Permission to distribute its cover does not give the band ownership of the original composition.</p><p>If the band instead samples audio from the earlier recording, that also introduces the earlier master into the rights review. If a filmmaker wants the band's new version, review the composition's audiovisual permission and the band's recording permission separately. A cover-distribution arrangement should not be assumed to clear a film use.</p></div>` },
      { id: "revenue", title: "Why the two layers create different revenue", html: `<p>Composition owners may receive performance, mechanical, sync, print, and other income. Master owners and eligible performers may receive recording revenue, master-use fees, neighboring-rights income, and other payments.</p><p>One collection stream does not automatically collect the other. Keep separate ownership records.</p>` },
      { id: "registration", title: "Protection and registration are separate steps", html: `<p>Under U.S. law, an original work gains copyright protection when it is fixed, such as in notation or an audio recording. A private agreement helps document rights; it is not a Copyright Office registration.</p><p>Registration provides additional benefits, and timing can matter when pursuing remedies. Follow the <a href="https://www.copyright.gov/engage/musicians/">Copyright Office's musician guidance</a> and choose the application that fits the actual works, authors, claimants, and publication facts. Combined registration of a composition and recording has specific eligibility conditions.</p><p>PRO, MLC, and distributor records serve different purposes. Keep their references separate from the copyright application and registration record.</p>` },
      { id: "licensing", title: "How the two rights affect sync licensing", html: `<p>A production using a song in visual media generally needs composition permission. If it uses an existing recording, it also needs master permission.</p><p>A song with clean splits but uncertain master ownership is not fully clearance-ready.</p>` },
      { id: "documents", title: "Match the document to the question", html: `<div class="blog-table-wrap" role="region" aria-label="Documents and copyright questions" tabindex="0"><table><caption>Documents and copyright questions</caption><thead><tr><th scope="col">Question</th><th scope="col">Relevant record</th><th scope="col">Limit</th></tr></thead><tbody><tr><th scope="row">Who owns composition shares?</th><td>Songwriting agreement and any transfers.</td><td>A royalty database entry alone does not settle a dispute.</td></tr><tr><th scope="row">Who owns this recording?</th><td>Recording, producer, performer, and transfer agreements as applicable.</td><td>Payment or credit alone is incomplete evidence.</td></tr><tr><th scope="row">Which rights are being split?</th><td>The split record’s stated scope.</td><td>A composition-only agreement does not allocate the master.</td></tr><tr><th scope="row">May I use third-party material?</th><td>Applicable licenses or another lawful basis.</td><td>Listing the source is not itself permission.</td></tr><tr><th scope="row">Was copyright registered?</th><td>Copyright Office registration record.</td><td>An ISRC or PRO entry is a different record.</td></tr></tbody></table></div>` },
      { id: "rights-map", title: "Create a one-page rights map for every release", html: `<p>Maintain composition owners and shares, publishers, administrators, master owner, licensed samples, featured artists, identifiers, and approval contacts. Store signed documents beside the audio and metadata.</p><p>Use the <a href="/blog/recording-studio-paperwork-checklist">studio paperwork checklist</a> to operationalize this map.</p>` }
    ],
    faqs: [{"question":"What are the two copyrights in a recorded song?","answer":"A recorded song commonly contains a copyright in the underlying musical work and a separate copyright in the sound recording."},{"question":"Who owns the musical work?","answer":"Songwriters or composers initially create the work, but ownership may later be transferred or administered under agreements."},{"question":"Who owns the master recording?","answer":"Ownership depends on the recording and agreements. It may belong to an artist, label, producer, employer, or another party."},{"question":"Does a split sheet prove master ownership?","answer":"A standard songwriting split sheet usually addresses composition shares, not complete master ownership."},{"question":"When does copyright protection begin?","answer":"The U.S. Copyright Office explains that protection begins when an original work is fixed, such as when music is notated or recorded."}],
    sources: ["copyrightMusicians","copyrightRegistration","copyrightTransfers","copyrightPreexistingMusic"]
  }),
  createPost({
    slug: "remote-collaboration-split-sheets",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. electronic-signature context. The status example and team message are fictional; signing records document agreement without guaranteeing a particular legal outcome.",
    relatedArticles: [["See the basic composition split example","what-is-a-split-sheet-in-music"],["Separate producer contracts from ownership records","producer-agreement-vs-split-sheet"],["Use the studio session handoff checklist","recording-studio-session-closeout-workflow"]],
    cta: {"title":"Give every collaborator the same record to review","description":"Choose the rights covered, check the agreed shares and invitation emails, then send individual signature links with Split Sheet Studio.","label":"Prepare the signature invitations →"},
    title: "Remote Collaboration Split Sheets: A Smooth Signature Workflow",
    excerpt: "Prepare a remote split-sheet request, help signers complete review, and handle missing details, expired links, and corrections without confusing a draft with a final record.",
    category: "Remote Collaboration",
    publishedAt: "2026-08-16",
    seoTitle: "Remote Collaboration Split Sheets & Signatures Guide",
    metaDescription: "Send remote music split sheets with individual review links. Learn account requirements, signature status, expired links, corrections, and final PDF delivery.",
    primaryKeyword: "remote split sheet",
    definition: "A remote split-sheet workflow gives collaborators in different locations the same ownership proposal to review and sign. In Split Sheet Studio, the completed packet follows every required contributor’s confirmation and signature.",
    takeaway: "An invitation, a viewed link, and a saved signature are different milestones. Check which people still need to act before describing the record as complete.",
    sections: [
      { id: "scenario", title: "Three collaborators, one current record", html: `<p>You make a beat in Texas. A featured artist records in another state. A songwriter sends a hook from a third studio. Nobody is in the same room, but the release needs one ownership record.</p><p>Start by agreeing who owns what, then send the same proposal to each person for review. Use this guide for the remote handoff; the <a href="/blog/what-is-a-split-sheet-in-music">split-sheet guide</a> covers the underlying composition example.</p>` },
      { id: "draft", title: "Step 1: prepare the proposal before sending", html: `<p>Identify the song and version, contributors, contact emails, and rights being documented. Split Sheet Studio can cover composition, recording ownership, or both. Check the separate totals for the selected rights; a correct sum still needs the collaborators' agreement.</p><p>Collect performance rights organization (PRO), writer or publisher identifier (IPI), publisher, and contact details when known. Invitation mode lets contributors complete missing profile details during signing, but the required fields must be completed before that signer can finish.</p><p>Resolve disputed ownership before requesting signatures. A clear draft is easier to correct than a submitted invitation that already has people acting on it.</p>` },
      { id: "invites", title: "Step 2: send individual links and explain the account step", html: `<p>Split Sheet Studio sends each contributor an individual invitation. The recipient signs in or creates a free account using the invitation email, then completes email verification if needed. No payment is required to sign. The invitation and review page show the link's expiration.</p><p>Tell collaborators to review the rights covered and all relevant contributors and shares. Send links only to their intended recipients, and have anyone with an unexpected invitation confirm the sender and song through a known contact channel.</p>` },
      { id: "review", title: "Step 3: review, correct, and sign", html: `<p>The signer checks the song, rights scope, contributors, and percentages, then completes the required profile details. The current form collects agreement confirmation, a typed legal name, and a drawn signature.</p><p>If the shares are wrong, contact the requester before signing. Submitted terms are locked rather than editable in place. For an incorrect pending request, ask the requester or support how to replace it; sending a correction in a separate message does not change the active signing record.</p><p>When a completed record needs an ownership change, the requester can use the revision link in the completion email to create a new request for everyone to review and sign. The earlier completed record is preserved. The <a href="/support">support guide explains completed-record revisions</a>.</p>` },
      { id: "finalization", title: "Step 4: distinguish viewed, signed, and completed", html: `<p>The document stays pending while a required contributor has not signed. A viewed link shows that the page was opened; it does not show agreement.</p><div class="blog-table-wrap" role="region" aria-label="Fictional remote signature status example" tabindex="0"><table><caption>City After Dark v1 — fictional example, three required signers</caption><thead><tr><th scope="col">Contributor</th><th scope="col">Current status</th><th scope="col">Next action</th></tr></thead><tbody><tr><th scope="row">Elena / artist</th><td>Signed</td><td>Wait for the others; keep this version identifiable.</td></tr><tr><th scope="row">Sam / producer</th><td>Viewed, not signed</td><td>Review all shares, complete missing details, and sign if agreed.</td></tr><tr><th scope="row">Devin / songwriter</th><td>Invitation link expired</td><td>Ask the creator to resend the invitation, then review the current record.</td></tr></tbody></table></div><p>Only one of three people has signed in this snapshot. Resending Devin's link does not add a signature, and Sam opening the page does not complete the document. Check the actual signature count and completion status.</p>` },
      { id: "delivery", title: "Step 5: keep the completed packet and check delivery", html: `<p>Once all required contributors have confirmed and signed, Split Sheet Studio generates the completed PDF packet and makes the record available in the signers' accounts. Completion emails deliver the packet to the selected recipients.</p><p>Check delivery separately from signing status. If a message does not arrive, check the account copy, spam folder, recipient address, and delivery status before assuming someone still needs to sign. Keep the same completed version with the song's files and metadata.</p>` },
      { id: "team-message", title: "A short message to send with the invitation", html: `<p><strong>Fictional example:</strong> adapt the details before sending.</p><blockquote><p>Please review City After Dark v1. The proposal covers composition ownership: Elena 50%, Sam 25%, and Devin 25%; recording ownership is separate. Open your individual invitation using the email address it was sent to, review the full record, and complete your details. If a name, share, or right is wrong, contact me before signing so we can resolve it. The final packet follows everyone's confirmation and signature.</p></blockquote><p>This tells collaborators what they are reviewing, how to access it, and what to do if the record needs attention.</p>` },
      { id: "smooth-ux", title: "When signing gets stuck", html: `<dl class="blog-example blog-example-details"><dt>The link has expired</dt><dd>Ask the split-sheet creator to resend the invitation. Use the new link rather than forwarding an old one.</dd><dt>The account uses a different email</dt><dd>Sign in using the address the invitation was sent to. Ask the requester for help if the invitation address itself is wrong.</dd><dt>The form asks for missing details</dt><dd>Verify the requested profile or registration information. Keep the record pending while resolving unknown details instead of inventing identifiers.</dd><dt>A percentage needs to change</dt><dd>Contact the requester before signing. Confirm how the incorrect pending proposal will be replaced; completed records use a new signed revision.</dd><dt>The status says signed, but no final packet is available</dt><dd>Check whether the other contributors have signed and whether the whole document is completed.</dd></dl><p>For legal context, <a href="https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap96-subchapI-sec7001.htm">the federal E-SIGN rule generally prevents rejection solely because a record or signature is electronic</a>. It does not remove the other requirements for a valid agreement; local law and the specific facts still matter.</p>` }
    ],
    faqs: [
      {
        "question": "Does every invited signer need a paid plan?",
        "answer": "No. Invited contributors can use a free Split Sheet Studio account with the invitation email to review and sign. Verify the account email and complete any required sign-in or verification steps."
      },
      {
        "question": "Does viewed mean agreed?",
        "answer": "No. Viewing, confirming agreement, and saving a signature are different events. The record is completed only after all required contributors confirm and sign."
      },
      {
        "question": "Can I change a submitted percentage in place?",
        "answer": "Submitted terms are locked. Contact the requester before signing incorrect shares. Ask how an incorrect pending proposal will be replaced; a completed record can be followed by a new signed revision that preserves the original."
      },
      {
        "question": "What if my signing link has expired?",
        "answer": "Ask the split-sheet creator to resend the invitation and use the new link. Link expiration alone does not mean the document has been cancelled or completed."
      },
      {
        "question": "Does an electronic signature guarantee enforceability?",
        "answer": "No. Electronic format alone is not generally a reason to reject a covered agreement under the federal E-SIGN rule, but agreement validity also depends on applicable law and the facts."
      }
    ],
    sources: ["esignValidity", "copyrightTransfers", "copyrightMusicians", "splitSheetSupport"]
  }),
  createPost({
    slug: "recording-studio-paperwork-checklist",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "Studio operations guide. The responsibility example is fictional; adapt owners and due dates to the actual service and agreements.",
    relatedArticles: [["Prepare client intake","recording-studio-client-intake-form-music-sessions"],["Complete session closeout","recording-studio-session-closeout-workflow"],["Verify release delivery","recording-studio-release-delivery-checklist"]],
    cta: {"title":"Give the split record a responsible owner","description":"Prepare the agreed rights and contributors, then track review and signatures as a separate completion step.","label":"Start a split record"},
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
      { id: "closeout", title: "At the end of the session", html: `<ul><li>Confirm the current title, credits, and actual contributors.</li><li>Record the agreed composition ownership and separately labeled recording terms.</li><li>Check required details and invitation emails before sending a final proposal.</li><li>Track who has signed; an invitation or view is not a completed signature.</li><li>Identify pending decisions with a responsible person and due date.</li><li>Save a recap and back up the session according to the booking.</li></ul>` },
      { id: "responsibility-example", title: "Assign the next action to a person", html: `<div class="blog-table-wrap" role="region" aria-label="Fictional studio responsibility record" tabindex="0"><table><caption>Fictional studio responsibility record</caption><thead><tr><th scope="col">Stage</th><th scope="col">Responsible person</th><th scope="col">Evidence / next action</th></tr></thead><tbody><tr><th scope="row">Before booking</th><td>Client coordinator</td><td>Confirm included deliverables and who approves changes.</td></tr><tr><th scope="row">During production</th><td>Engineer</td><td>Log contributors and flag an outside beat license still needed from the artist.</td></tr><tr><th scope="row">Before mixing</th><td>Artist and collaborators</td><td>Resolve proposed shares; requester sends the agreed signature record.</td></tr><tr><th scope="row">After mastering</th><td>Delivery coordinator</td><td>Verify audio, give approved recipients access, and list any open rights task.</td></tr></tbody></table></div><p>This example is a responsibility map, not an instruction that the studio decides every collaborator's ownership. Use the actual agreed timing; a brief closeout cannot resolve a dispute by itself.</p>` },
      { id: "identifiers", title: "Keep registration and identifier tasks separate", html: `<p>An ISRC identifies the recording, an ISWC the composition, and an IPI a relevant writer or publisher identity. Keep confirmed values with the correct record and mark unavailable values pending.</p><p>The unchanged recording retains its ISRC when transferred. A new performance has its own recording identity; edits and remasters need the <a href="/blog/music-metadata-isrc-iswc-ipi-guide">identifier guidance</a>. Assign a person to obtain and verify the code rather than guessing one during closeout.</p>` },
      { id: "release", title: "Before distribution and release", html: `<ol><li>Confirm master ownership and delivery acceptance.</li><li>Register the composition through appropriate channels.</li><li>Assign or obtain the recording's ISRC.</li><li>Review names, title, featured credits, and metadata.</li><li>Clear samples and interpolations.</li><li>Register copyrights where appropriate.</li></ol>` },
      { id: "sync-folder", title: "Build a sync-ready song folder", html: `<p>Store the full mix, instrumental, clean version, stems, lyrics, split sheet, master contact, sample clearances, writer and publisher contacts, identifiers, and creative description together.</p><p>A clean folder turns a frantic clearance email into a professional response.</p>` },
      { id: "system", title: "Use one project record with clear handoffs", html: `<p>Keep booking scope, contribution notes, agreement status, delivery status, and links to evidence together. Those statuses should remain distinct: “audio approved,” “split proposed,” and “all signatures complete” describe different events.</p><p>Choose a responsible person for each stage, then confirm that the next person received the files and open actions. Follow the detailed intake, closeout, and delivery guides rather than making one person reconstruct the whole project from messages.</p>` }
    ],
    faqs: [{"question":"What paperwork should be completed in a recording session?","answer":"Document contributors and splits, contacts, credits, master or service terms, samples, featured artists, and appropriate signatures."},{"question":"What is an IPI number?","answer":"An IPI identifies an interested party such as a creator or publisher in music-rights systems. It is different from a private PRO account number."},{"question":"What is the difference between ISRC and ISWC?","answer":"ISRC identifies a recording. ISWC identifies a musical work or composition."},{"question":"Should engineers be listed on a split sheet?","answer":"List an engineer as a composition owner only if the parties agree that the engineer contributed songwriting. Engineering credit and payment should be documented separately."},{"question":"Where should studios store completed records?","answer":"Use secure, access-controlled storage with backups and consistent song folders. Give contributors their completed copies."}],
    sources: ["copyrightMusicians","copyrightRegistration","cisacIdentifiers","isrcOfficial"]
  }),
  createPost({
    slug: "producer-splits-for-beats",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. rights context. The annotated deal is fictional; the actual license controls what has been granted.",
    relatedArticles: [["Understand the broader producer split categories","producer-splits-explained"],["Choose the right document for producer terms","producer-agreement-vs-split-sheet"],["Prepare a track for a specific sync request","how-to-make-a-song-sync-ready"]],
    cta: {"title":"Carry the licensed deal into the split record","description":"After resolving the license terms and agreeing the relevant ownership shares, document those shares and collect signatures with Split Sheet Studio. Keep the beat license with the completed record.","label":"Document the agreed shares →"},
    title: "Producer Splits for Beats: What to Document Before Release",
    excerpt: "Read a beat license for the rights your release needs, with an annotated fictional deal and practical questions to resolve before upload or sync pitching.",
    category: "Producers",
    publishedAt: "2026-08-14",
    seoTitle: "Producer Splits for Beats: Check Your Beat License",
    metaDescription: "Check composition shares, recording rights, usage limits, samples, Content ID, and sync permissions in your beat license before releasing a song.",
    primaryKeyword: "beat license splits",
    definition: "For a song built on a licensed beat, the producer split comes from the agreed composition and recording terms, not the purchase price or license-tier name. Check ownership, payments, and permitted uses separately.",
    takeaway: "Save the actual license for your purchase and compare its permissions with what you plan to do. A license that allows distribution may still require separate approval for sync.",
    sections: [
      { id: "layers", title: "Start with the license you actually purchased", html: `<p>You have the WAV, a payment receipt, and a release date. Before uploading, find the license that came with that transaction. A file called “unlimited” does not explain whether you can pitch the song for an ad, enroll it in Content ID, or transfer rights to someone else.</p><p><a href="https://support.google.com/youtube/answer/2797370?hl=en">Content ID is YouTube's automated content-matching system</a>. Check both the beat license and the service's eligibility rules before enrolling a recording.</p><p>The <a href="https://www.copyright.gov/music-modernization/educational-materials/Sampling-Interpolations-Beat-Stores-and-More-An-Introduction-for-Musicians-Using-Preexisting.pdf">Copyright Office's beat-store guidance</a> explains why tier names can hide materially different restrictions. Keep the agreement, transaction date, beat title, producer identity, and receipt together.</p><p>For the broader distinction between songwriting shares, fees, and producer royalties, read <a href="/blog/producer-splits-explained">Producer Splits Explained</a>. Here, the task is checking your purchased license against your intended use.</p>` },
      { id: "songwriting", title: "When production may involve songwriting", html: `<p>Beat-making can include melody, harmony, rhythm, and other musical expression. Producers and artists should discuss authorship instead of assuming the job title decides the outcome.</p><p>Record any agreed composition share on the split sheet with all writers, totaling 100%.</p>` },
      { id: "points", title: "Producer points and master royalties", html: `<p>Producer points commonly describe a royalty connected to the master. The agreement should define the royalty base, deductions, accounting, recoupment, payment method, and statements.</p><p>A 3% master royalty is not the same as 3% composition ownership. The <a href="/blog/producer-splits-explained#points">producer royalty guide</a> explains the calculation base and recoupment in plain English.</p>` },
      { id: "licenses", title: "Exclusive and nonexclusive: read the actual grant", html: `<p>A nonexclusive license allows use under its stated conditions while the producer may license the beat to others. An exclusive agreement can still reserve composition interests, royalties, or specific uses. Check the grant of rights, the term, and any earlier licenses.</p><p>As one platform-specific example, <a href="https://help.beatstars.com/hc/en-us/articles/54320717002395-Content-Licenses-Contracts-FAQs">BeatStars says earlier nonexclusive licenses remain valid after an exclusive sale</a>. Its guidance also distinguishes composition and recording terms. Read the agreement issued for your transaction rather than applying that platform's description to every marketplace.</p><p>For either tier, identify permitted releases, usage caps, territory, duration, credit, recording rights, producer participation, video or sync permissions, Content ID rules, and the audio files included.</p>` },
      { id: "license-example", title: "An annotated fictional beat deal", html: `<p>The following summary is invented to show what to check. It is not a BeatStars contract, a standard market deal, or reusable license wording.</p><dl class="blog-example blog-example-details"><dt>Payment / license type</dt><dd>$75 upfront; nonexclusive permission for one new song for three years</dd><dt>Usage cap</dt><dd>50,000 monetized audio streams in total across services</dd><dt>Composition ownership</dt><dd>Artist 50%; producer 50%, as expressly agreed for this example</dd><dt>Recording ownership</dt><dd>Not stated in the summary — needs clarification</dd><dt>Sync / Content ID</dt><dd>Sync requires separate written approval; Content ID enrollment is not permitted</dd><dt>Files included</dt><dd>WAV beat only; separate audio parts for mixing and session files are not included</dd></dl><p><strong>For a streaming release:</strong> save the license, confirm the recording terms, check how usage is counted, and identify the renewal or upgrade process before the cap or term is reached.</p><p><strong>For a film or advertising pitch:</strong> the streaming permission does not answer the sync question. Obtain the required approval for the proposed use before presenting the track as cleared.</p><p><strong>For the split sheet:</strong> record the agreed 50/50 composition ownership. Do not turn the $75 payment into an assumed transfer of the entire composition or master.</p>` },
      { id: "samples", title: "Check samples, loops, and interpolations separately", html: `<p>Ask the producer whether the beat includes sampled audio, a loop, or an <strong>interpolation</strong> that re-creates part of an existing composition. Identify the source, license, relevant restrictions, and who is responsible for any additional approval and cost.</p><p>The <a href="https://www.copyright.gov/music-modernization/educational-materials/Sampling-Interpolations-Beat-Stores-and-More-An-Introduction-for-Musicians-Using-Preexisting.pdf">Copyright Office notes that a producer's permission may not cover your use</a>. Check the intended release and licensing uses against the actual permissions. A disclosure or warranty is useful documentation, but it is not itself clearance from the third-party rights holder.</p>` },
      { id: "agreement", title: "Save a beat-license review note with the song", html: `<ul><li>Beat title, producer name, transaction date, and exact license file.</li><li>Your planned uses: streaming, downloads, video, live performance, and any sync pitch.</li><li>Composition shares, publisher details, recording ownership, and separate royalty obligations.</li><li>Usage caps, expiration, territory, and what happens at a limit or renewal.</li><li>Content ID permission, credit wording, included files, and sample or loop records.</li><li>Unresolved questions, the producer's response, and any agreed amendment.</li></ul><p>If a term is missing, ask for clarification and keep the answer with the license. A product-page badge or a receipt alone is not a complete account of the rights granted.</p>` },
      { id: "before-upload", title: "What to confirm before the distributor upload", html: `<p>Make sure the split sheet, producer agreement, credits, master ownership, sample status, and payment obligations tell the same story. Deliver the producer's copy and preserve the final version.</p><p>Use the <a href="/blog/recording-studio-paperwork-checklist">recording studio paperwork checklist</a> and the <a href="/blog/recording-studio-session-closeout-workflow">session closeout workflow</a>.</p>` }
    ],
    faqs: [
      {
        "question": "Is a 50/50 composition split automatic when I buy a beat?",
        "answer": "No. The example uses negotiated shares for teaching. Check the actual license and the collaborators’ agreement rather than assigning a percentage from the producer’s job title or the beat price."
      },
      {
        "question": "Does an exclusive purchase erase earlier licenses?",
        "answer": "Check the contract. BeatStars states that earlier nonexclusive licenses remain valid under its described arrangements; do not assume that buying an exclusive removes every previous use."
      },
      {
        "question": "Can I pitch a licensed beat song for sync?",
        "answer": "Check whether the beat license and any third-party permissions cover that use, and confirm who can approve the composition and master. Distribution permission alone does not establish sync clearance."
      },
      {
        "question": "Should I put the beat into Content ID?",
        "answer": "Check the license and the current enrollment requirements before doing so. The fictional deal above prohibits enrollment; other agreements may differ."
      },
      {
        "question": "What if I exceed a stream cap or the term expires?",
        "answer": "Review the license’s renewal, upgrade, termination, and continued-use terms and contact the producer before reaching the limit. Do not assume the same permission continues automatically."
      }
    ],
    sources: ["copyrightPreexistingMusic", "copyrightMusicians", "beatstarsLicenses", "youtubeContentId"]
  }),
  createPost({
    slug: "music-publishing-before-sync-licensing",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "U.S. publishing and sync context. The authority audit is fictional and does not interpret an actual publishing contract.",
    relatedArticles: [["Understand writer and publisher allocations","songwriting-splits-writer-share-publisher-share"],["Verify one-stop authority","one-stop-music-licensing-rights-clearance"],["Review the specific license request","sync-licensing-checklist"]],
    cta: {"title":"Keep the composition agreement accessible","description":"Document agreed shares and publishing details, with separate evidence of administration and licensing authority.","label":"Prepare a split record"},
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
      { id: "ownership", title: "Confirm ownership before assigning administration tasks", html: `<p>Keep the agreed composition ownership picture and any relevant transfers together. Identify each writer's publisher or administrator, if any, and confirm names and identifiers rather than assuming a registration entry explains every right.</p><p>A writer who says “I have no publisher” may retain their own publishing interest. That statement does not grant another collaborator authority to license it. Keep the recording ownership and its approval route separately linked.</p>` },
      { id: "publisher-versus-admin", title: "Publisher versus publishing administrator", html: `<p>A traditional deal may include ownership or control, creative services, advances, and administration. An administration deal commonly focuses on registration and collection while the writer retains ownership, but terms differ.</p><p>Review the grant of rights, term, territory, commission, approvals, collection scope, and post-term provisions.</p>` },
      { id: "responsibilities", title: "Map authority as well as registration work", html: `<div class="blog-table-wrap" role="region" aria-label="Publishing responsibility audit" tabindex="0"><table><caption>Publishing responsibility audit</caption><thead><tr><th scope="col">Question</th><th scope="col">Evidence to check</th><th scope="col">Record the answer</th></tr></thead><tbody><tr><th scope="row">Who owns each composition interest?</th><td>Songwriting agreement and transfers.</td><td>Owner and percentage.</td></tr><tr><th scope="row">Who collects which income?</th><td>Publishing or administration grant.</td><td>Rights, territory, term, and collection scope.</td></tr><tr><th scope="row">Who may grant sync permission?</th><td>Approval and licensing clauses.</td><td>Authorized signer and reserved approvals.</td></tr><tr><th scope="row">Who corrects a work record?</th><td>Administrator responsibilities and society process.</td><td>Named person and reference.</td></tr></tbody></table></div>` },
      { id: "authority", title: "Confirm sync approval authority", html: `<p>Some agreements grant a publisher or administrator authority to negotiate or approve sync; others reserve approval to the songwriter or require multiple parties. The master has its own chain.</p><p>Create a contact sheet stating who can quote, who must approve, and expected response time.</p>` },
      { id: "authority-example", title: "An administrator may collect without approving sync", html: `<div class="blog-scenario"><h3>Fictional publishing audit: “Harbor Road”</h3><p>A writer's agreement authorizes an administrator to register and collect specified royalties but reserves sync approval to the writer. The catalog lists only the administrator's general email.</p><p>The writer adds the correct approval contact and keeps the administrator as the registration and collection contact. If a request arrives, the team sends it through the reserved approval route. The administrator's name in a database is not treated as evidence of authority the contract did not grant.</p></div>` },
      { id: "metadata", title: "Keep catalog contacts tied to their roles", html: `<p>Use consistent titles, writers, confirmed identifiers, publishing and administration names, and related recording versions. Label collection, licensing, and approval contacts separately where they differ.</p><p>Keep the relevant grant or confirmation with the private catalog record and note when it was checked. Descriptive metadata can help people find a song; it does not establish the representative's authority.</p>` },
      { id: "audit", title: "Run the publishing audit before claiming availability", html: `<ol><li>Confirm the composition agreement and relevant publishing grants.</li><li>Identify who administers each share for the requested rights, territory, and period.</li><li>Review work entries using the destination's share format and correct discrepancies through its process.</li><li>Identify the authorized sync approval route and any reserved decisions.</li><li>Check third-party material and the recording's separate approval requirements.</li><li>State any outstanding approval accurately in the pitch.</li></ol>` }
    ],
    faqs: [{"question":"Do independent artists need a music publisher?","answer":"Not every creator needs a traditional publisher, but every composition needs accurate administration."},{"question":"Can I pitch for sync without a publisher?","answer":"Potentially, if the owners can authorize the composition use and the rights information is complete."},{"question":"What is a publishing administrator?","answer":"An administrator commonly handles registrations, collection, and catalog administration without necessarily taking the same ownership as a traditional publisher."},{"question":"Why do supervisors need publisher contacts?","answer":"Publishers or administrators may control or represent composition rights and may need to approve the use."},{"question":"What is one-stop clearance?","answer":"One-stop generally means one authorized contact can approve composition and master rights. Confirm authority before making that claim."}],
    sources: ["copyrightMusicians","copyrightAllianceSync","mlcMember","sesacFaq"]
  }),
  createPost({
    slug: "music-metadata-isrc-iswc-ipi-guide",
    author: studioEditorialAuthor,
    updatedAt: "2026-10-14",
    showFieldGuide: false,
    showStudioSpotlight: false,
    showPluginCta: false,
    scopeNote: "Identifier guidance with fictional internal record labels. No sample code below is an assigned ISRC, ISWC, or IPI.",
    relatedArticles: [["Build a searchable catalog sheet","music-catalog-metadata-spreadsheet-for-sync"],["Prepare the distributor upload","distrokid-tunecore-release-checklist"],["Check MLC work matching","the-mlc-mechanical-royalties-guide"]],
    cta: {"title":"Keep ownership details with the identifiers","description":"Use an agreed contributor record alongside your recording and work metadata.","label":"Document the contributors"},
    title: "Music Metadata Guide: ISRC, ISWC, IPI, Credits, and Ownership",
    excerpt: "A creator-friendly guide to the identifiers and metadata that connect songs, recordings, writers, publishers, credits, and royalty systems.",
    category: "Music Metadata",
    publishedAt: "2026-08-12",
    seoTitle: "Music Metadata Guide: ISRC, ISWC, IPI & Credits",
    metaDescription: "Understand ISRC, ISWC, IPI, and release product codes with a linked-record example and a practical process for fixing metadata mistakes.",
    primaryKeyword: "ISRC ISWC IPI",
    definition: "Music metadata identifies a composition, recording, creator, publisher, owner, release, and credit. ISRC, ISWC, and IPI identify different entities and are not interchangeable.",
    takeaway: "Good metadata cannot repair a bad ownership agreement, but it can carry a good agreement through royalty, release, and licensing systems.",
    sections: [
      { id: "importance", title: "Why music metadata matters", html: `<p>Streaming, publishing, royalty, licensing, and discovery systems process huge catalogs. They rely on names, titles, identifiers, and ownership data to connect usage with the correct people and works.</p><p>Errors create mismatches: a creator may be listed under the wrong name or a recording may not connect to its composition.</p>` },
      { id: "isrc", title: "ISRC identifies a recording", html: `<p>The International Standard Recording Code identifies a sound or music-video recording, rather than a composition, performer, or release product. Keep it with the artist, title, version, duration, content type, and publication date.</p><p>Use the existing code for the unchanged recording when transferring it between distributors or owners. A newly recorded performance needs its own identity. Edits, remixes, and remasters require checking the <a href="https://isrc.ifpi.org/faqs">ISRC agency's guidance</a>; not every remaster automatically receives a new code.</p>` },
      { id: "iswc", title: "ISWC identifies a musical work", html: `<p>The International Standard Musical Work Code identifies the composition. CISAC describes it as connecting the work title and creators, including authors, composers, and arrangers.</p><p>One song may have one ISWC while multiple recordings each have their own ISRC.</p>` },
      { id: "ipi", title: "IPI identifies creators and publishers", html: `<p>The Interested Party Information number helps distinguish songwriters, composers, and publishers within rights systems. It is valuable when names are common or represented in multiple territories.</p><p>Use the IPI tied to the exact identity in the registration. Do not substitute private account credentials.</p>` },
      { id: "linked-example", title: "One composition, two recordings, several people", html: `<div class="blog-scenario"><h3>Fictional internal records</h3><p>Use internal labels while official identifiers are pending. These labels organize the catalog and must not be entered as official codes.</p></div><div class="blog-table-wrap" role="region" aria-label="Linked metadata records" tabindex="0"><table><caption>Linked metadata records</caption><thead><tr><th scope="col">Internal label</th><th scope="col">What it represents</th><th scope="col">Official identifier field</th></tr></thead><tbody><tr><th scope="row">WORK-01</th><td>The composition “Small Hours,” written by two people.</td><td>ISWC when assigned.</td></tr><tr><th scope="row">REC-01</th><td>The original studio recording of WORK-01.</td><td>Its confirmed ISRC.</td></tr><tr><th scope="row">REC-02</th><td>A new live performance of WORK-01.</td><td>Its separately assigned ISRC.</td></tr><tr><th scope="row">Writer and publisher records</th><td>The people and entities connected to WORK-01.</td><td>Confirmed IPIs for the relevant identities.</td></tr></tbody></table></div><p>A release product may package one or several recordings and have its own UPC or EAN. That product code does not replace recording identifiers or establish ownership.</p>` },
      { id: "credits", title: "Credits are data, not decoration", html: `<p>Record songwriter, producer, featured artist, engineer, mixer, mastering engineer, musician, and studio credits consistently. Verify spelling and professional names.</p><p>Creative credit and ownership are related but not identical. Someone can deserve credit without owning composition or master rights.</p>` },
      { id: "source-of-truth", title: "Correct the source record and affected destinations", html: `<p>Keep the confirmed title, people, rights, identifiers, and recording versions in one maintained record. Note where each value came from and when it was checked. Treat official IDs as text when using a spreadsheet so leading zeroes are preserved.</p><p>If an IPI belongs to the wrong person, confirm the correct identity with that writer or representative. Correct the relevant work registration through its process, and update the catalog record and other affected submissions. An edit in your private spreadsheet does not automatically update a distributor or society.</p><p>If an ISRC was entered against the wrong audio, identify which recording the code actually describes before submitting corrections. Do not generate replacement codes simply to hide the mismatch.</p>` },
      { id: "checklist", title: "The release metadata checklist", html: `<ul><li>Song and alternate titles.</li><li>Primary and featured artists.</li><li>Writers and composition shares.</li><li>Publishers, administrators, PROs, and IPIs.</li><li>ISWC when assigned.</li><li>ISRC for each recording.</li><li>Master owner and licensing contact.</li><li>Creative credits, lyrics, language, and version details.</li></ul><p>Connect the data to the signed record using <a href="/blog/what-is-a-split-sheet-in-music">the split-sheet guide</a>.</p>` }
    ],
    faqs: [{"question":"Does an ISRC prove that I own the recording?","answer":"No. It identifies a recording; relevant agreements establish the ownership picture."},{"question":"Should I invent an ISWC while waiting?","answer":"No. Use an internal work label and mark the official field pending. Obtain the assigned code through the relevant registration channel."},{"question":"Is an IPI my private PRO account number?","answer":"No. Confirm the IPI tied to the relevant writer or publisher identity. Do not share login credentials as metadata."},{"question":"Do I need a new ISRC when switching distributors?","answer":"The unchanged recording keeps its existing ISRC. Follow the transfer instructions and retain the original reference metadata."}],
    sources: ["isrcOfficial","isrcFaq","cisacIdentifiers","bmiIpi","distrokidIsrcUpc","tunecoreIsrcUpc"]
  }),

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
          dateModified: post.updatedAt || post.publishedAt,
          mainEntityOfPage: `https://splitsheetstudio.com/blog/${post.slug}`,
          image: "https://splitsheetstudio.com/vst-contributors.png",
          author: post.author ? {
            "@type": "Person",
            name: post.author.name,
            jobTitle: post.author.jobTitle,
            worksFor: { "@type": "Organization", name: post.author.organization }
          } : { "@type": "Organization", name: "Split Sheet Studio" },
          publisher: {
            "@type": "Organization",
            name: "Split Sheet Studio",
            url: "https://splitsheetstudio.com",
            logo: { "@type": "ImageObject", url: "https://splitsheetstudio.com/split-sheet-studio-logo.png" }
          },
          keywords: post.primaryKeyword,
          isPartOf: { "@type": "Blog", name: "Split Sheet Studio Blog", url: "https://splitsheetstudio.com/blog" },
          about: [
            { "@type": "Thing", name: "music split sheets" },
            { "@type": "Thing", name: "sync licensing" },
            { "@type": "Thing", name: "music publishing" },
            { "@type": "Thing", name: "recording studio paperwork" }
          ]
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Blog", item: "https://splitsheetstudio.com/blog" },
            { "@type": "ListItem", position: 2, name: post.title, item: `https://splitsheetstudio.com/blog/${post.slug}` }
          ]
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
