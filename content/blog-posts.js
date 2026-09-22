const sourceLibrary = {
  copyrightMusicians: ["U.S. Copyright Office — What Musicians Should Know about Copyright", "https://www.copyright.gov/engage/musicians/"],
  copyrightRegistration: ["U.S. Copyright Office — Musical Compositions and Sound Recordings", "https://www.copyright.gov/register/pa-sr.html"],
  musicianIncome: ["U.S. Copyright Office — How Songwriters, Composers, and Performers Get Paid", "https://www.copyright.gov/music-modernization/educational-materials/musicians-income.pdf"],
  theMlc: ["The MLC — Mechanical Licensing Collective", "https://www.themlc.com/"],
  soundExchange: ["SoundExchange — Digital performance royalty collection", "https://www.soundexchange.com/"],
  distrokidPricing: ["DistroKid — Music distribution plans", "https://distrokid.com/"],
  tunecorePricing: ["TuneCore — Distribution pricing", "https://www.tunecore.com/pricing"],
  cdbabyPricing: ["CD Baby — Music distribution pricing", "https://cdbaby.com/pricing"],
  landrPricing: ["LANDR — Distribution pricing", "https://www.landr.com/pricing/"],
  soundropPricing: ["Soundrop — Pricing and cover-song distribution", "https://soundrop.com/pricing"],
  mlcMember: ["The MLC — Membership for self-administered songwriters and publishers", "https://help.themlc.com/en/support/what-is-a-member"],
  mlcRegistration: ["The MLC — How to register musical works", "https://help.themlc.com/en/support/how-to-register-works-in-the-mlc-portal"],
  sesacPro: ["SESAC — What is a Performing Rights Organization?", "https://www.sesac.com/what-is-a-performing-rights-organization-pro/"],
  sesacFaq: ["SESAC — Music licensing frequently asked questions", "https://www.sesac.com/frequently-asked-questions/"],
  bmiRegistration: ["BMI — Online Works Registration guidance", "https://applications.bmi.com/OWR"],
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
  return `<nav class="blog-toc" aria-labelledby="table-of-contents-title"><h2 id="table-of-contents-title">Table of contents</h2><ol>${config.sections.map((section) => `<li><a href="#${section.id}">${section.title}</a></li>`).join("")}<li><a href="#practical-field-guide">Practical field guide</a></li><li><a href="#frequently-asked-questions">Frequently asked questions</a></li></ol></nav>`;
}

function renderBlogUpgradeGuide(config) {
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

function createPost(config) {
  return {
    ...config,
    bodyHtml: `<p class="blog-definition"><strong>Quick answer:</strong> ${config.definition}</p><aside class="blog-takeaway"><strong>Session takeaway</strong><span>${config.takeaway}</span></aside>${renderTableOfContents(config)}${config.sections.map((section) => `<section id="${section.id}"><h2>${section.title}</h2>${section.html}</section>`).join("")}${renderBlogUpgradeGuide(config)}${renderFaqs(config.faqs)}${renderBlakMarigoldSpotlight()}${renderCreatorResources(config.creatorResourceLimit)}${renderSources(config.sources)}`
  };
}

const blogPosts = [
  createPost({
    slug: "best-music-distribution-services-2026",
    title: "Best Music Distribution Services for Independent Artists in 2026",
    excerpt: "Compare 15 music distribution services for independent artists, including DistroKid, TuneCore, CD Baby, Too Lost, LANDR, UnitedMasters, Soundrop, AWAL, and more.",
    category: "Music Distribution",
    publishedAt: "2026-09-16",
    seoTitle: "Best Music Distribution Services in 2026: 15 Compared",
    metaDescription: "Compare DistroKid, TuneCore, CD Baby, Too Lost, LANDR, UnitedMasters and more. See 2026 pricing, royalties, splits, Content ID and best use cases.",
    primaryKeyword: "best music distribution services 2026",
    creatorResourceLimit: 12,
    definition: "The best music distribution service in 2026 is the one that matches your release schedule, collaborator workflow, catalog plans, royalty needs, and budget. No distributor is the best fit for every independent artist.",
    takeaway: "Choose the distributor after the rights are clean. Agree on ownership, document splits, understand the master and publishing picture, then pick the delivery platform that fits how you release music.",
    sections: [
      { id: "short-version", title: "The short version", html: `<p>Choosing a distributor in 2026 is less about finding one company that wins every category and more about matching the pricing model to the way you actually release music. Artists who release often usually get more value from an unlimited annual plan. Artists who release once in a while may prefer paying per release.</p><p>That is why the advertised yearly price should never be the only number you compare. Look at cancellation rules, YouTube Content ID, collaborator payouts, cover-song licensing, multi-artist accounts, catalog transfers, and whether a percentage of revenue is taken.</p><p>There is also a rights question that belongs before all of those: did everyone who created the record agree on who owns what before it was uploaded? A distributor can move audio to streaming services and route money to collaborators, but it does not automatically establish ownership of the song.</p><p>If you are building a release from a professional session, pair this comparison with the <a href="/blog/artist-release-paperwork-checklist-before-distribution">artist release paperwork checklist</a> and the studio workflow at <a href="https://www.blakmarigold.com/" rel="noopener noreferrer">Blak Marigold Studio</a>. Clean files and clean paperwork make the distributor choice much easier.</p>` },
      { id: "release-principle", title: "The release principle to remember", html: `<p>The cleanest order is simple: agree on the rights, document them, distribute the recording, then register the remaining royalty sources. Before release, confirm the writers, composition ownership, master ownership, producer participation, credits, and any other relevant deal terms.</p><p>Once those details are clear, the distributor becomes a delivery and accounting choice instead of the place where everyone tries to figure out the deal after the fact. Use a signed <a href="/blog/what-is-a-split-sheet-in-music">split sheet</a> before distribution so the release metadata, registrations, and collaborator payouts are built from the same truth.</p>` },
      { id: "what-distributors-handle", title: "What a distributor actually handles", html: `<p>For most independent artists, digital distributors are the connection between the finished master and services such as Spotify, Apple Music, Amazon Music, YouTube Music, TikTok, Instagram, TIDAL, and Deezer. Instead of delivering to every service separately, the artist sends the distributor a master file, artwork, metadata, and release information.</p><p>Depending on the company and plan, distribution may also include UPC and ISRC generation, scheduled release dates, lyric delivery, analytics, collaborator payments, social-platform monetization, YouTube Content ID, catalog transfers, and takedowns.</p><p>Using a distributor does not automatically mean giving that company ownership of the master copyright. Some agreements can, however, give the distributor exclusive digital-distribution rights during a contractual term. Copyright ownership and distribution authorization are different concepts, and independent artists should read that distinction carefully.</p>` },
      { id: "royalty-picture", title: "Distribution is only one part of royalties", html: `<p>A streaming release can generate revenue connected to two different copyrights. The composition is the underlying lyrics and music. The master recording is the specific recorded performance listeners hear.</p><p>Basic digital distribution primarily concerns the master side. That does not mean every royalty generated by the song has automatically been collected. In the United States, The MLC administers certain digital mechanical royalties for eligible interactive streaming and download services, while SoundExchange collects statutory digital-performance royalties for sound recordings used by qualifying non-interactive digital services.</p><p>Some distribution companies offer publishing administration, SoundExchange-related collection, sync pitching, or other rights services as add-ons. Evaluate those services separately from the basic question of getting the recording onto DSPs.</p>` },
      { id: "comparison-table", title: "2026 music distribution comparison", html: `<p>The pricing notes below were checked in September 2026 from the article draft. Distributor plans change frequently, so verify the current terms before opening an account or moving an established catalog.</p><div class="table-scroll"><table><thead><tr><th>Distributor</th><th>Starting price</th><th>Standard DSP royalty model</th><th>Releases</th><th>Useful distinction</th></tr></thead><tbody><tr><td>DistroKid</td><td>$24.99/year</td><td>100% to artist</td><td>Unlimited</td><td>Fast DIY workflow with many optional extras.</td></tr><tr><td>TuneCore</td><td>$24.99/year</td><td>100% to artist</td><td>Unlimited</td><td>Strong reporting, splits, and publishing ecosystem.</td></tr><tr><td>Too Lost</td><td>$19.99/year</td><td>100% while subscribed</td><td>Unlimited</td><td>450+ destinations and a label tier for larger catalogs.</td></tr><tr><td>LANDR</td><td>$24/year</td><td>100%</td><td>Unlimited</td><td>Content ID included and catalog retention options after cancellation.</td></tr><tr><td>CD Baby</td><td>$9.99 single</td><td>91% of digital distribution revenue</td><td>Pay per release</td><td>No recurring distribution subscription.</td></tr><tr><td>UnitedMasters</td><td>$19.99/year</td><td>100% on paid plans</td><td>Unlimited</td><td>SELECT adds brand and sync opportunities.</td></tr><tr><td>Amuse</td><td>$23.99/year</td><td>100% standard DSP royalties</td><td>Unlimited</td><td>Music can remain online after cancellation with commission.</td></tr><tr><td>RouteNote</td><td>Free</td><td>Artist keeps 85%</td><td>Unlimited</td><td>Free and premium models available.</td></tr><tr><td>SoundCloud for Artists</td><td>$39/year</td><td>100%</td><td>2 distributed tracks/month on Artist</td><td>Distribution integrated with SoundCloud audience tools.</td></tr><tr><td>Symphonic Starter</td><td>$29.99/year</td><td>100% standard distribution royalties</td><td>Unlimited</td><td>Strong analytics and free collaborator splits.</td></tr><tr><td>Soundrop</td><td>$4.99/track</td><td>Artist keeps 85%</td><td>Pay per track</td><td>Cover-song licensing included.</td></tr><tr><td>Ditto Music</td><td>$19/year</td><td>100% standard distribution</td><td>Unlimited</td><td>Pro adds publishing, sync, and Content ID.</td></tr><tr><td>Horus Music</td><td>GBP20/year</td><td>100%</td><td>Unlimited</td><td>Low-cost global distribution.</td></tr><tr><td>OFFstep</td><td>From $1.50/month</td><td>100%</td><td>Unlimited</td><td>Budget-focused DIY distribution.</td></tr><tr><td>AWAL</td><td>Application based</td><td>Artist receives 85% of qualifying distribution receipts</td><td>Selective</td><td>Artist-services model rather than open DIY distribution.</td></tr></tbody></table></div>` },
      { id: "pricing-models", title: "How to compare pricing models", html: `<p>Unlimited annual plans are attractive when you release singles, alternate versions, remixes, beat-tape style projects, or multiple artists under one workflow. The risk is that the subscription may become the catalog's access fee, so cancellation terms matter.</p><p>Pay-per-release models can make sense for slower catalogs because the artist does not keep paying every year just to maintain a small number of releases. The tradeoff is usually a revenue percentage, per-track fee, or fewer platform-style add-ons.</p><p>Artist-services and selective platforms are a different category. They may offer marketing, sync, analytics, advances, playlist strategy, brand opportunities, or higher-touch campaign support. Those services may be valuable, but they should be judged against your actual team, not against a basic distributor's upload form.</p>` },
      { id: "best-fit", title: "Best fit by artist situation", html: `<ul><li><strong>Frequent independent releasers:</strong> compare DistroKid, TuneCore, Too Lost, LANDR, Ditto, Amuse, Symphonic, Horus Music, and OFFstep first.</li><li><strong>Occasional releasers:</strong> compare CD Baby and Soundrop against annual-plan costs over three years, not only the first upload.</li><li><strong>Cover-song focused artists:</strong> study Soundrop, DistroKid, LANDR, and any platform that makes mechanical cover licensing part of the workflow.</li><li><strong>Teams with many collaborators:</strong> prioritize splits, payout routing, exportable statements, and clean metadata before chasing the lowest advertised price.</li><li><strong>Sync-minded artists:</strong> choose distribution that does not make clearance harder. Then keep split sheets, master ownership, instrumental files, and approval contacts organized.</li><li><strong>Artists who record professionally:</strong> connect the release process to studio handoff. The <a href="https://www.blakmarigold.com/recording-studio" rel="noopener noreferrer">Blak Marigold recording studio</a> and <a href="/blog/recording-studio-session-closeout-workflow">session closeout workflow</a> are built around that exact handoff.</li></ul>` },
      { id: "features-that-matter", title: "Features that matter more than the headline price", html: `<p>Compare the fine print before you compare logos. Content ID can be included, optional, restricted, or unavailable depending on the plan. Collaborator splits can be free, paid, manual, or limited to certain revenue types. Cover-song licensing can be handled inside the platform or left to the artist.</p><p>Catalog permanence is another major issue. Some services remove releases if the subscription lapses. Others keep music online with a commission, permanent-release option, or legacy arrangement. If you are moving a catalog, confirm transfer rules and preserve the same ISRCs when possible so stream history and royalty matching stay cleaner.</p><p>Finally, check whether the platform supports the way you actually work: multiple artist names, label accounts, pre-save tools, TikTok and Instagram delivery, lyric delivery, YouTube monetization, analytics exports, royalty statements, payment thresholds, and territory restrictions.</p>` },
      { id: "rights-before-upload", title: "Rights to settle before upload", html: `<p>Before uploading the master, answer the ownership questions that will become expensive later. Who wrote the composition? What are the writer shares? Who owns or controls the master? Are there producer points, master royalties, featured artist approvals, samples, loops, beat licenses, or label obligations?</p><p>Split Sheet Studio exists for this exact moment. Use the <a href="/split-sheet">split sheet builder</a> to capture the composition record, then store the final PDF beside release metadata, artwork, lyrics, ISRCs, UPCs, and master notes. If the team needs a repeatable workflow, the <a href="/pricing">Split Sheet Studio plans</a> are built for artists, producers, managers, and studios that release often.</p>` },
      { id: "switching-distributors", title: "Switching distributors without making a mess", html: `<p>Many artists eventually move a release from one distributor to another. Before doing that, collect the UPC, ISRCs, release date, exact audio files, artwork, contributor metadata, songwriter and publisher details, and takedown timing. Preserve ISRCs whenever possible so stores can connect the new delivery to the existing recording identity.</p><p>Do not deliver the same active release through two distributors at the same time unless you are following a transfer process the stores and distributors support. Duplicate deliveries can create conflicts, takedowns, split reporting, and catalog confusion.</p>` },
      { id: "final-recommendation", title: "Final recommendation", html: `<p>If you release constantly and want speed, start with unlimited annual plans. If you release rarely, run the math on pay-per-release services. If you want marketing, sync, brand opportunities, or a more curated team, look at higher-touch services with realistic expectations.</p><p>But do not let the distributor become the first place your team discusses ownership. Finish the split sheet, clarify the master, save the paperwork, then distribute the recording. That order protects the release, the collaborators, and every future opportunity attached to the song.</p>` }
    ],
    faqs: [
      { question: "What is the best music distribution service in 2026?", answer: "There is no single best service for every artist. Compare release frequency, total cost, cancellation terms, collaborator splits, Content ID, cover-song licensing, catalog transfers, and whether the platform takes a revenue share." },
      { question: "Do I need a distributor to get music on Spotify?", answer: "Most independent artists use an approved digital distributor to deliver music, artwork, metadata, and release information to Spotify and other DSPs." },
      { question: "Which distributors advertise 100% royalties?", answer: "DistroKid, TuneCore, Too Lost, LANDR, Ditto, Amuse, and Symphonic advertise 100% standard streaming or download royalties on certain paid plans, but add-ons, commissions, taxes, payment fees, or special services can still affect the final money received." },
      { question: "Does a music distributor own my master?", answer: "A distributor does not automatically own your master just because it delivers the release, but some agreements include exclusive distribution rights or other restrictions. Read the terms before uploading." },
      { question: "Can I use different distributors for different releases?", answer: "Yes. Many artists use different distributors for different releases or catalogs. The same active release should not normally be delivered by two distributors at once except during a supported transfer." },
      { question: "Does distribution collect publishing royalties?", answer: "Basic distribution usually focuses on the master recording side. Publishing administration, MLC registration, PRO registration, and SoundExchange collection may require separate steps or add-on services." },
      { question: "Is a distributor split the same as a split sheet?", answer: "No. A distributor split is usually a payment routing feature. A split sheet documents the ownership agreement for the song, especially composition shares." },
      { question: "What happens if I cancel my distributor?", answer: "It depends on the platform. Some releases may be removed, some can stay online through a legacy commission, and some require an optional leave-a-legacy or catalog-retention feature." },
      { question: "Which distributor is best for cover songs?", answer: "Soundrop is known for cover-song licensing in its workflow, and some other platforms offer cover licensing options. Always confirm current rules before releasing a cover." },
      { question: "Should I keep the same ISRC when switching distributors?", answer: "Yes, when possible. Keeping the same ISRC helps identify the same recording across services and can reduce catalog confusion during a transfer." }
    ],
    sources: ["distrokidPricing", "tunecorePricing", "cdbabyPricing", "landrPricing", "soundropPricing", "theMlc", "soundExchange", "isrcOfficial", "copyrightMusicians"]
  }),
  createPost({
    slug: "one-stop-music-licensing-rights-clearance",
    title: "One-Stop Music Licensing: Make Your Song Easier to Clear for Sync",
    excerpt: "A sync-ready rights clearance guide for artists, producers, managers, and studios who want songs that can move fast when a placement opportunity appears.",
    category: "Sync Licensing",
    publishedAt: "2026-09-13",
    seoTitle: "One-Stop Music Licensing Rights-Clearance Checklist",
    metaDescription: "Learn one-stop music licensing for sync: composition rights, master rights, publisher contacts, samples, metadata, and clearance-ready paperwork.",
    primaryKeyword: "one-stop music licensing",
    creatorResourceLimit: 11,
    definition: "One-stop music licensing means the people pitching a song can identify the approval path for both the composition and the master quickly enough for a supervisor, brand, film, game, or trailer team to trust the clearance process.",
    takeaway: "Do not claim a song is one-stop because it feels independent. Claim it only when the composition, master, publisher, sample, and approval records support that promise.",
    sections: [
      { id: "what-one-stop-means", title: "What one-stop music licensing means", html: `<p>In sync conversations, one-stop is shorthand for speed and confidence. A music supervisor wants to know who can approve the song, who can approve the recording, whether all contributors are reachable, and whether the quoted license can actually be granted.</p><p>The phrase does not erase the two-rights structure of music. A song can still involve composition owners, publishers, administrators, master owners, producers, featured artists, labels, sample owners, and approval restrictions. One-stop only works when the team has mapped those people and documents clearly.</p>` },
      { id: "why-clearance-wins", title: "Why clearance can beat a perfect pitch", html: `<p>Sync opportunities often move on tight deadlines. A track may be emotionally perfect for a scene, ad, trailer, game, or sports promo, but the buyer still needs a dependable rights answer. If the team cannot confirm ownership, files, terms, and contacts quickly, the buyer may choose a less exciting song that is easier to clear.</p><p>This is where independent artists and studios can compete. Clean ownership records make a small catalog feel professional. They reduce friction for supervisors, editors, creative directors, and clearance teams who do not have time to chase every collaborator.</p>` },
      { id: "composition-side", title: "Clear the composition side first", html: `<p>The composition is the underlying song: melody, lyrics, and musical work. Before pitching for sync, confirm every writer, composition percentage, publisher or administrator, PRO affiliation, IPI when known, and approval contact.</p><p>A signed split sheet is the first practical record. It should total 100%, reflect the team agreement, and connect to publishing records later. If the split says one thing and the publisher registration says another, the song may become a clearance conversation instead of a licensing opportunity.</p><ul><li>Confirm the writer legal names and professional names.</li><li>Verify composition shares total 100%.</li><li>Record publishers, administrators, PROs, and IPIs when available.</li><li>Identify who can approve a sync use and who must be copied.</li><li>Store the signed split beside the song metadata.</li></ul>` },
      { id: "master-side", title: "Map the master side separately", html: `<p>The master is the specific sound recording. A sync use of an existing recording usually needs permission for the master in addition to the composition. The master owner might be the artist, a label, a production company, a studio client, or another party depending on the agreement.</p><p>Do not assume master control just because the artist uploaded the release. Review producer agreements, label deals, featured-artist terms, work-for-hire language, studio payment terms, and any contract that affects who can approve the recording.</p><ul><li>Name the exact recording version and ISRC when assigned.</li><li>Identify the master owner and approval contact.</li><li>List producer points, featured artist restrictions, and payment obligations.</li><li>Keep instrumental, clean, and alternate mixes attached to the same record.</li></ul>` },
      { id: "samples-and-beats", title: "Find sample, loop, and beat restrictions early", html: `<p>Uncleared samples, interpolations, loops, and beat licenses are common sync blockers. Some beat licenses allow distribution but restrict television, film, advertising, games, trailers, or commercial licensing. Some sample packs allow use in songs but still require careful review of redistribution and identification terms.</p><p>Ask the uncomfortable question before pitching: did any part of this production come from third-party material? If yes, document the source, license, restrictions, and clearance status. Unknown is better than pretending a risk is gone.</p>` },
      { id: "rights-packet", title: "Build a sync-ready rights packet", html: `<p>A rights packet is a compact folder that lets a clearance person understand the song without a long back-and-forth. It should include the signed split sheet, composition ownership summary, publisher and administrator contacts, master owner contact, sample notes, metadata, lyrics, audio files, and any restrictions.</p><p>For Split Sheet Studio users, the final PDF can become the ownership anchor inside that packet. Add the related audio, metadata, and master notes around it so the song has one source of truth.</p><ol><li>Signed split sheet PDF.</li><li>One-page composition and master ownership summary.</li><li>Publisher, administrator, PRO, and IPI details.</li><li>Full mix, instrumental, clean version, and stems when available.</li><li>Lyrics, explicit status, tempo, mood, genre, themes, and scene-use notes.</li><li>Sample, interpolation, beat-license, and restricted-use notes.</li><li>Approval contacts and expected response time.</li></ol>` },
      { id: "supervisor-email", title: "Prepare a one-stop response email", html: `<p>When a supervisor asks if a song is clearable, answer like a professional catalog owner. Lead with what you can confirm, avoid overpromising, and attach the right packet.</p><blockquote><p>This song is organized for sync review. We can provide composition ownership, publisher or administrator contacts, master ownership, clean and instrumental versions, lyrics, and sample-status notes. Please send the usage details, media type, territory, term, and budget range so we can confirm final approval and quote accurately.</p></blockquote><p>That tone protects the relationship. It says the catalog is prepared while still leaving room to verify final terms.</p>` },
      { id: "what-not-to-claim", title: "What not to claim as one-stop", html: `<p>Do not call a song one-stop when one writer is missing, publishing data is unknown, a producer agreement is unresolved, a sample is uncleared, or the master owner has not authorized licensing. Do not rely on a text thread as the final proof of ownership if the split sheet was never completed.</p><p>It is better to pitch a song as <strong>clearance-ready</strong> or <strong>organized for fast clearance</strong> than to make a one-stop claim that falls apart under questions. Trust matters more than sounding bigger than the paperwork.</p>` },
      { id: "studio-closeout-link", title: "Make one-stop readiness part of session closeout", html: `<p>The easiest time to collect one-stop data is when the session is still fresh. Studios can help by ending every writing or recording session with title confirmation, contributor names, split percentages, master notes, sample notes, and remote signature links.</p><p>Use the <a href="/blog/recording-studio-session-closeout-workflow">recording studio session closeout workflow</a> to build this habit into the last five minutes of the room.</p>` },
      { id: "score-your-song", title: "Score your song before pitching it for sync", html: `<p>Before sending a track to a library, supervisor, publisher, brand agency, or production company, score it honestly. A song is not ready because it is good; it is ready when the creative, rights, metadata, and delivery pieces are all reachable.</p><ul><li><strong>Green:</strong> all rights owners, files, contacts, and restrictions are documented.</li><li><strong>Yellow:</strong> ownership is mostly clear, but one or two data points still need confirmation.</li><li><strong>Red:</strong> missing signatures, unknown master owner, unresolved samples, or conflicting percentages.</li></ul><p>If a song is yellow or red, fix the record before increasing pitch volume. Clean paperwork compounds over time because every future release, registration, and license starts from a stronger base.</p>` }
    ],
    faqs: [
      { question: "What is one-stop music licensing?", answer: "One-stop music licensing means one clear approval path can handle the rights needed for a sync use, especially the composition and master rights. The exact scope should be verified before pitching." },
      { question: "Does one-stop mean one person owns everything?", answer: "Not always. It can mean one authorized party can approve or coordinate the needed rights, but the team should still document every owner, publisher, administrator, and master contact." },
      { question: "Do I need both composition and master permission for sync?", answer: "If the buyer wants to use an existing recording, the use generally needs composition permission and master-use permission." },
      { question: "Can a split sheet make a song one-stop?", answer: "A split sheet can document composition ownership, but one-stop readiness also depends on master ownership, publisher authority, samples, restrictions, and approval contacts." },
      { question: "Can uncleared samples block a sync license?", answer: "Yes. Samples, interpolations, loops, and some beat licenses can create extra approvals or restrictions that stop a sync use." },
      { question: "What should be in a sync-ready rights packet?", answer: "Include the signed split sheet, composition and master ownership summary, publisher contacts, sample notes, lyrics, metadata, audio deliverables, and approval contacts." },
      { question: "Should independent artists pitch songs as one-stop?", answer: "Only when they can verify the rights and approval authority. If not, pitch the song as organized for clearance and explain what still needs confirmation." },
      { question: "Why do music supervisors care about one-stop songs?", answer: "Supervisors and clearance teams often work under deadlines. Songs with clear ownership, contacts, and files reduce risk and save time." },
      { question: "What is the difference between one-stop and pre-cleared music?", answer: "One-stop usually describes the approval path. Pre-cleared can imply rights and terms are already approved for certain uses. Always define the exact meaning in the deal." },
      { question: "How does Split Sheet Studio help with sync clearance?", answer: "Split Sheet Studio helps teams capture signed composition splits, contributor details, and final PDFs that can become the ownership anchor in a sync-ready rights packet." }
    ],
    sources: ["copyrightMusicians", "copyrightAllianceSync", "sesacFaq", "cisacIdentifiers", "isrcOfficial"]
  }),
  createPost({
    slug: "recording-studio-session-closeout-workflow",
    title: "Recording Studio Session Closeout: A Five-Minute Split-Sheet Workflow",
    excerpt: "A practical closeout system for studios, engineers, artists, and managers who want every session to end with clean splits, credits, signatures, and handoff notes.",
    category: "Studio Operations",
    publishedAt: "2026-09-13",
    seoTitle: "Recording Studio Session Closeout Split-Sheet Workflow",
    metaDescription: "Use this recording studio session closeout workflow to capture splits, credits, signatures, master notes, samples, metadata, and final PDFs.",
    primaryKeyword: "recording studio session closeout",
    creatorResourceLimit: 11,
    definition: "Recording studio session closeout is the final routine that turns a finished session into a documented record of contributors, splits, credits, master notes, signatures, files, and next steps before everyone leaves.",
    takeaway: "The last five minutes of the session can save weeks of release, publishing, and sync licensing cleanup later.",
    sections: [
      { id: "why-closeout-matters", title: "Why studio closeout matters", html: `<p>Studios are already trusted rooms. Artists come in to create, managers ask for deliverables, producers expect credits, and engineers know which files are final. That makes the studio the perfect place to capture paperwork while the truth is still in the room.</p><p>A closeout workflow does not turn the engineer into a lawyer. It gives the session a professional handoff: who contributed, what the song is called, what percentages were agreed, what credits should appear, who controls the master, what files were delivered, and what still needs follow-up.</p>` },
      { id: "five-minute-frame", title: "The five-minute workflow: session to split to signed", html: `<p>The closeout should feel simple enough to run after a long night. Think of it as a repeatable checklist, not a meeting. When the final bounce starts or the session is wrapping, open the split-sheet workflow and collect the core record.</p><ol><li><strong>Minute 1:</strong> confirm the song title, session date, artist, producer, engineer, and contributors.</li><li><strong>Minute 2:</strong> capture roles, emails, credits, publisher or PRO details when known, and master notes.</li><li><strong>Minute 3:</strong> enter composition percentages and validate that the total equals 100%.</li><li><strong>Minute 4:</strong> send secure signature links to in-room and remote collaborators.</li><li><strong>Minute 5:</strong> save the final PDF or pending recap beside the audio folder and metadata notes.</li></ol>` },
      { id: "contributor-capture", title: "Step 1: name the record and the people", html: `<p>Start with names. Capture the artist name, legal names where appropriate, professional names, emails, phone numbers when used for coordination, and the role each person played in the room. Include songwriters, producers, featured artists, musicians, engineers, managers, and anyone who needs a copy.</p><p>Credits and ownership are different. Someone can deserve a public credit without owning the composition. Someone can own part of the song without being featured on the recording. The closeout should make those layers visible instead of mixing them together.</p>` },
      { id: "rights-fields", title: "Step 2: capture publishing, master, and sample notes", html: `<p>Collect publisher, administrator, PRO, and IPI details when people know them. If they do not know them, mark the field as unknown and assign a follow-up owner. Guessing can create worse data than leaving a clean blank.</p><p>Then capture master-side notes. Who paid for the recording? Is there a label? Are there producer points? Was a beat licensed? Did anyone use a sample, interpolation, loop, or third-party stem? Those details may not belong on the composition split, but they belong in the session handoff.</p>` },
      { id: "split-validation", title: "Step 3: validate 100% before the bounce leaves", html: `<p>The split conversation is easiest while everyone remembers the contributions. Enter the agreed composition percentages and make sure the total reaches 100%. If the team is not ready to decide, label the split as a draft and schedule the follow-up before the project leaves the studio.</p><p>Do not let a 95%, 105%, or “we will figure it out later” record become the release source of truth. A small mismatch can create registration conflicts, royalty disputes, and sync clearance delays later.</p>` },
      { id: "remote-signing", title: "Step 4: sign in the room or send secure links", html: `<p>For collaborators in the building, signing can happen before they leave. For remote writers, managers, or producers, send individual links so every signer reviews the same record. A shared editable link is weaker than a controlled signature flow.</p><p>The signer should see the song title, all contributors, all percentages, and the terms they are confirming. If someone requests a correction, pause the final version, update the record, and send the revised version for confirmation.</p>` },
      { id: "final-pdf-handoff", title: "Step 5: deliver the final PDF and close the folder", html: `<p>After signatures are complete, deliver the same final PDF to every contributor. Store it beside the final mix, instrumental, clean version, stems when available, lyrics, credits, invoice, session notes, and metadata.</p><p>Use one consistent naming convention. A folder named with the artist, song title, date, and version is easier to search than a folder full of mystery files. The goal is for a manager, artist, or studio assistant to find the correct document months later without calling everyone.</p>` },
      { id: "studio-service", title: "How studios turn paperwork into a premium service", html: `<p>Session closeout can become part of the studio brand. It tells clients that the room cares about the business life of the song, not only the recording. That matters to serious artists, sync producers, indie labels, managers, and publishing-minded teams.</p><p>Frame it as a value-add: “Before you leave, we will help you capture the split, credits, signature links, and final PDF so your release paperwork starts clean.” That sentence feels professional without offering legal advice.</p>` },
      { id: "sync-ready-closeout", title: "Make every studio handoff sync-ready", html: `<p>A studio closeout should support future sync licensing even if the artist is not pitching today. The same data that helps distribution and royalties also helps clearance: contributors, publishers, master owner, ISRC, ISWC when assigned, lyrics, explicit status, instrumental files, sample notes, and approval contacts.</p><p>When a supervisor asks for music, the artist should not need to reopen old group chats. Pair this workflow with the <a href="/blog/one-stop-music-licensing-rights-clearance">one-stop music licensing guide</a> and the <a href="/blog/sync-licensing-checklist">sync licensing checklist</a>.</p>` },
      { id: "windows-plugin", title: "How the Windows plugin fits the workflow", html: `<p>Split Sheet Studio can be used through the web app, standalone Windows app, and Windows VST3 plugin. Until broader plug-in formats are available, studios can rely on the hosted web workflow for client-facing closeout and use the VST3 download in compatible Windows DAWs that accept VST3.</p><p>The web workflow is ready for session closeout, while the downloadable DAW workflow keeps the split sheet close to the creative moment.</p>` },
      { id: "daily-studio-system", title: "Turn closeout into a daily studio habit", html: `<p>The best closeout system is consistent. Put it into the engineer checklist, assistant handoff, booking notes, and end-of-session wrap. Use the same fields every time so the team stops inventing paperwork under pressure.</p><ul><li>Ask about splits at booking or session start.</li><li>Collect emails before contributors leave.</li><li>Review titles and credits before export.</li><li>Send signature links while the session is still active.</li><li>Attach the final PDF to the session folder and client delivery email.</li></ul><p>That habit makes the studio more valuable because the client leaves with a better song package, not just a better recording.</p>` }
    ],
    faqs: [
      { question: "What is recording studio session closeout?", answer: "Recording studio session closeout is the end-of-session routine for confirming contributors, splits, credits, signatures, master notes, files, metadata, and next steps." },
      { question: "What paperwork should studios finish before a client leaves?", answer: "Studios should help capture contributor details, split percentages, credits, publisher or PRO details when known, master notes, sample notes, signature status, and final file locations." },
      { question: "Should engineers decide song ownership?", answer: "No. Engineers should not decide ownership for the collaborators. The workflow should capture the agreement the parties make and flag unresolved questions." },
      { question: "What if one collaborator is remote?", answer: "Send that collaborator a unique signature link and keep the record pending until they review and sign the same terms as everyone else." },
      { question: "Does session closeout replace a music attorney?", answer: "No. Session closeout is an operational workflow for documentation. Complex deals, disputes, and legal questions should go to a qualified professional." },
      { question: "How do studios avoid holding up a release?", answer: "Use the same closeout checklist every session, validate 100% composition totals, store master notes separately, and deliver the final PDF to all parties." },
      { question: "Should producer points go on a split sheet?", answer: "Producer points are usually master-side compensation and should be documented separately from composition ownership unless the parties also agree to a songwriting share." },
      { question: "What should be stored with the final split-sheet PDF?", answer: "Store the final mix, instrumental, clean version, stems when available, lyrics, credits, metadata, sample notes, master notes, invoice, and release contacts." },
      { question: "Can the workflow help sync licensing?", answer: "Yes. Clean closeout records help artists and managers answer composition, master, metadata, file, and approval questions faster during sync clearance." },
      { question: "Which Split Sheet Studio plan fits a recording studio?", answer: "The Studio plan is built for higher-volume session rooms that need more completed split sheets each month, while Creator is better for individual artists, writers, and producers." }
    ],
    sources: ["copyrightMusicians", "copyrightRegistration", "cisacIdentifiers", "isrcOfficial", "copyrightAllianceSync"]
  }),
  createPost({
    slug: "recording-studio-client-intake-form-music-sessions",
    title: "Recording Studio Client Intake Form: What to Ask Before a Music Session",
    excerpt: "A studio-owner intake workflow for collecting client goals, contributors, beats, samples, deliverables, rights questions, and split-sheet readiness before the session starts.",
    category: "Studio Operations",
    publishedAt: "2026-09-13",
    seoTitle: "Recording Studio Client Intake Form for Music Sessions",
    metaDescription: "Use this recording studio client intake form checklist to capture artist goals, collaborators, beats, samples, deliverables, credits, and split-sheet needs.",
    primaryKeyword: "recording studio client intake form",
    creatorResourceLimit: 11,
    definition: "A recording studio client intake form is the pre-session record that captures who is coming, what will be created, which files are involved, what deliverables are expected, and which rights questions should be handled before the session becomes urgent.",
    takeaway: "The best studio paperwork starts before the first take, because intake gives the engineer and owner time to spot rights, file, credit, and delivery issues early.",
    sections: [
      { id: "why-intake-matters", title: "Why intake matters for studio owners", html: `<p>A studio intake form is not busywork. It is how the room protects time, sets expectations, and makes the client experience feel professional. When a client arrives with a leased beat, three co-writers, a remote producer, and a release deadline, the studio should already know enough to keep the session moving.</p><p>Good intake gives the owner and engineer a simple view of the project: who is responsible, who needs credit, who might need to sign, what files are expected, and whether third-party material is involved. It keeps business questions from ambushing the creative process.</p>` },
      { id: "booking-fields", title: "Start with booking and project fields", html: `<p>Collect the client name, artist name, main contact, manager contact, session date, project title, release goal, deadline, payment owner, and preferred delivery method. Add a notes field for label, publisher, or team relationships.</p><p>This information helps the studio know who can approve overtime, who receives files, and who should be included when the final split-sheet or delivery recap goes out.</p>` },
      { id: "people-fields", title: "Ask who will be in the room", html: `<p>List expected songwriters, producers, featured artists, musicians, engineers, managers, videographers, and guests. A person in the room may affect credits, releases, confidentiality, session flow, or ownership discussions.</p><p>The form should not decide whether someone owns part of the song. It should make sure the team knows who participated, what role they played, and who needs follow-up before the release record is treated as final.</p>` },
      { id: "beats-samples", title: "Flag beats, samples, loops, and outside files", html: `<p>Ask whether the client is bringing a beat lease, exclusive beat, sample, interpolation, loop, outside stem, YouTube download, remix material, or reference that may affect rights. If the answer is yes, collect the source, license status, restrictions, and who is responsible for confirming permission.</p><p>The U.S. Copyright Office warns musicians not to assume they can freely use someone else's work. Trying and failing to reach a rightsholder is not a replacement for permission when permission is required.</p>` },
      { id: "deliverables", title: "Define deliverables before the clock starts", html: `<p>Ask what the client expects at the end: rough bounce, final mix, instrumental, clean version, acapella, stems, session files, mastered WAV, MP3, lyrics, credits, and split-sheet PDF. If the studio charges differently for stems or revisions, the intake form should make that visible.</p><p>For sync-minded clients, include fields for instrumental, clean, stems, lyrics, and metadata. Those files can turn a good record into a usable catalog asset.</p>` },
      { id: "split-readiness", title: "Prepare the split-sheet workflow early", html: `<p>Ask whether the song needs a split sheet during the session. If collaborators are present or remote, collect their names and emails before the creative work ends. That makes the final five-minute closeout smoother.</p><p>When everyone waits until release week, the studio gets pulled into a cleanup job. Intake lets the room frame split sheets as a normal part of a professional session.</p>` },
      { id: "privacy-consent", title: "Add consent, contact, and communication language", html: `<p>The intake form should explain how contact information will be used for booking, session delivery, signature links, support, and follow-up. Keep marketing opt-in separate from operational communication.</p><p>Studios should store intake data in access-controlled systems and avoid collecting sensitive information they do not need. The goal is practical workflow, not turning a simple booking form into a risky database.</p>` },
      { id: "handoff-to-closeout", title: "Connect intake to session closeout", html: `<p>At the end of the session, reopen the intake record and compare it to what actually happened. Did new contributors join? Did the title change? Did the client request new deliverables? Did a beat or sample issue appear?</p><p>Then use the <a href="/blog/recording-studio-session-closeout-workflow">five-minute session closeout workflow</a> to complete splits, credits, signatures, and delivery notes.</p>` }
    ],
    faqs: [
      { question: "What should a recording studio intake form include?", answer: "It should include project details, client contacts, expected collaborators, rights inputs, deliverables, payment owner, release goals, and split-sheet readiness." },
      { question: "Should studios ask about beats and samples before the session?", answer: "Yes. Beats, samples, loops, and outside stems can affect release and sync permissions, so they should be flagged early." },
      { question: "Should a studio intake form include split-sheet questions?", answer: "Yes. Asking early helps the studio collect names and emails before collaborators leave." },
      { question: "Is the studio responsible for deciding ownership?", answer: "No. The studio should capture the collaborators' agreement and recommend qualified legal help for disputes or complex deals." },
      { question: "What contact info should studios collect?", answer: "Collect operational contacts such as artist, manager, collaborators, and delivery recipients. Avoid unnecessary sensitive data." },
      { question: "Should studios collect marketing opt-in on intake?", answer: "Only if it is separate, clear, and optional. Operational session communication should not be confused with marketing consent." },
      { question: "What deliverables should clients choose from?", answer: "Common deliverables include final WAV, MP3, instrumental, clean version, stems, acapella, session files, metadata, credits, and split-sheet PDF." },
      { question: "How does intake help sync licensing?", answer: "It captures the rights, files, and contact information that a supervisor or clearance team may need later." },
      { question: "Should intake happen online or in person?", answer: "Online intake is easier to store and reuse, but studios can also review it in person at session start." },
      { question: "How does Split Sheet Studio fit studio intake?", answer: "Split Sheet Studio can turn intake names and emails into a signed split-sheet workflow during session closeout." }
    ],
    sources: ["copyrightMusicians", "copyrightAllianceSync", "copyrightRegistration"]
  }),
  createPost({
    slug: "recording-studio-release-delivery-checklist",
    title: "Recording Studio Release Delivery Checklist: Files, Credits, Metadata, and Splits",
    excerpt: "A release-delivery workflow for studios that want clients to leave with organized audio files, credits, metadata, split PDFs, and clear next steps.",
    category: "Studio Operations",
    publishedAt: "2026-09-13",
    seoTitle: "Recording Studio Release Delivery Checklist",
    metaDescription: "Use this recording studio release delivery checklist for final WAVs, instrumentals, clean edits, stems, credits, metadata, master notes, and split sheets.",
    primaryKeyword: "recording studio release delivery checklist",
    creatorResourceLimit: 11,
    definition: "A recording studio release delivery checklist is the final handoff system that confirms audio versions, credits, metadata, rights paperwork, storage, and recipients before a project leaves the studio.",
    takeaway: "A studio can sound great and still create chaos if clients leave without the right files, credits, metadata, and paperwork.",
    sections: [
      { id: "delivery-is-product", title: "Delivery is part of the studio product", html: `<p>Clients remember more than the mix. They remember whether the studio helped them feel ready. A clean release delivery package gives artists, managers, and producers the confidence to upload, register, pitch, and archive the song without chasing files for weeks.</p><p>For studio owners, delivery is a conversion tool. It makes the room feel premium, gives clients a reason to trust your process, and turns paperwork into a repeatable service instead of a last-minute favor.</p>` },
      { id: "audio-package", title: "Build the audio package", html: `<p>At minimum, identify the final master or approved mix. Depending on the service, include WAV, MP3 reference, instrumental, clean edit, TV track, acapella, stems, and alternate versions. Label each file with artist, title, version, date, and status.</p><p>A file named finalfinalREAL.wav might make sense at 2 a.m., but it does not help a distributor, music supervisor, manager, or future engineer. Clear naming is part of professional delivery.</p>` },
      { id: "credits-package", title: "Confirm credits before delivery", html: `<p>Credits should include primary artist, featured artists, producers, songwriters, engineers, mixers, mastering engineer, musicians, studio name, and any required production credit language. Verify spelling and professional names.</p><p>Credit is not the same as ownership, but it still matters. Incorrect credits can create relationship damage and metadata conflicts even when the split percentages are correct.</p>` },
      { id: "metadata-package", title: "Attach release metadata", html: `<p>Store title, alternate title, artist, contributors, explicit status, language, genre, mood, tempo, lyrics, release date, distributor, ISRC when assigned, ISWC when assigned, publisher information, and contact notes. Metadata helps songs move through release, royalty, and licensing systems.</p><p>The ISRC identifies a recording, while the ISWC identifies a musical work. Keep identifiers in the correct lane and never use one as a substitute for the other.</p>` },
      { id: "rights-package", title: "Attach the rights package", html: `<p>The rights package should include the signed split-sheet PDF, master ownership notes, producer agreement summary, beat license, sample disclosures, and any restrictions. If something is unresolved, mark it clearly instead of burying it.</p><p>The U.S. Copyright Office explains that musical compositions and sound recordings are separate works. Studio delivery should respect that separation by keeping composition splits and master-side terms distinct.</p>` },
      { id: "delivery-recap", title: "Send a delivery recap", html: `<p>The delivery email or client portal note should list what was delivered, where it was stored, which files are final, which documents are attached, who received the package, and what tasks remain. Keep it short enough that people read it.</p><p>For example: final mix delivered, instrumental delivered, clean edit pending, split sheet completed, producer agreement pending, sample status client-confirmed. That kind of recap turns confusion into a manageable checklist.</p>` },
      { id: "backup-retention", title: "Set storage and retention expectations", html: `<p>Tell clients how long the studio stores session files, whether backups are included, and how retrieval works later. If the studio is not promising lifetime storage, say that clearly in the agreement or delivery note.</p><p>Keep signed PDFs and final delivery records in a more durable place than an engineer's desktop. Access control and consistent folders matter when clients come back months later.</p>` },
      { id: "upgrade-service", title: "Turn delivery into an upsell without pressure", html: `<p>Studios can offer basic delivery, release-ready delivery, or sync-ready delivery. The upgrade is not hype; it is more organization: clean versions, instrumentals, metadata, split PDFs, rights packet, and catalog notes.</p><p>Use <a href="/blog/recording-studio-client-intake-form-music-sessions">client intake</a> and <a href="/blog/recording-studio-session-closeout-workflow">session closeout</a> to make the delivery package easy instead of rebuilding it at the end.</p>` }
    ],
    faqs: [
      { question: "What should a recording studio deliver after a session?", answer: "Depending on the service, studios may deliver final audio, references, stems, clean edits, instrumentals, credits, metadata, split PDFs, invoices, and next-step notes." },
      { question: "Should studios deliver instrumentals?", answer: "If included in the package or useful for sync and performance needs, yes. Set that expectation before the session." },
      { question: "Should stems always be included?", answer: "Not always. Some studios charge separately for stems or session files, so the delivery policy should be clear." },
      { question: "What paperwork belongs with final audio?", answer: "Attach split sheets, credit notes, master notes, sample disclosures, beat licenses, and producer terms where applicable." },
      { question: "Why does metadata matter after a studio session?", answer: "Metadata helps distributors, royalty systems, catalogs, and sync teams connect the recording to the correct people and rights." },
      { question: "What is the difference between ISRC and ISWC?", answer: "ISRC identifies a specific recording. ISWC identifies the underlying musical work." },
      { question: "Should the studio keep copies of split sheets?", answer: "If the studio is part of the workflow, it should keep access-controlled records according to its retention policy and give contributors their copies." },
      { question: "Can delivery help with sync licensing?", answer: "Yes. Instrumentals, clean versions, stems, metadata, and rights records make songs easier to pitch and clear." },
      { question: "How should studios name final files?", answer: "Use clear names with artist, title, version, date, and status so recipients can identify the correct file later." },
      { question: "How does Split Sheet Studio improve delivery?", answer: "It creates a final signed split-sheet PDF and signature trail that can travel with the session delivery package." }
    ],
    sources: ["copyrightMusicians", "copyrightRegistration", "cisacIdentifiers", "isrcOfficial"]
  }),
  createPost({
    slug: "artist-release-paperwork-checklist-before-distribution",
    title: "Artist Release Paperwork Checklist Before Uploading to a Distributor",
    excerpt: "A practical checklist for independent artists preparing split sheets, credits, producer terms, master notes, metadata, and registrations before release day.",
    category: "Independent Artists",
    publishedAt: "2026-09-13",
    seoTitle: "Artist Release Paperwork Checklist Before Distribution",
    metaDescription: "Before uploading music to a distributor, use this artist release paperwork checklist for splits, credits, metadata, producer terms, samples, PROs, and The MLC.",
    primaryKeyword: "artist release paperwork checklist",
    creatorResourceLimit: 11,
    definition: "An artist release paperwork checklist is the pre-upload review that confirms composition splits, master ownership, credits, metadata, samples, producer terms, and registration tasks before a song goes public.",
    takeaway: "Distribution is not the start of paperwork; it is the moment your paperwork gets tested.",
    sections: [
      { id: "before-upload", title: "Why artists should slow down before upload", html: `<p>Independent artists can upload music quickly, but the business side still needs care. A distributor may ask for title, artist, credits, explicit status, ISRC, writers, and other metadata, yet it may not solve split agreements, publishing registration, producer terms, sample clearance, or sync authority for you.</p><p>The release feels more professional when the artist can answer who wrote the song, who produced it, who owns the master, what credits belong on the release, and what documents back those answers.</p>` },
      { id: "split-sheet", title: "Finish the split sheet first", html: `<p>Before upload, confirm every songwriter and percentage. The composition split should total 100% and reflect the actual agreement among writers. Include legal names, professional names, emails, publishers, PROs, and IPI numbers when available.</p><p>A signed split sheet is especially important when the song begins to earn money, attract sync interest, or create registration questions. It is much easier to capture the agreement while everyone is excited than after the song has value.</p>` },
      { id: "master-ownership", title: "Confirm master ownership separately", html: `<p>The master is the specific recording. The artist may own it, but that depends on label agreements, producer terms, featured artist deals, funding, work-for-hire arrangements, and other facts. Keep this record separate from the composition split.</p><p>The U.S. Copyright Office distinguishes musical works from sound recordings. A clean release packet should do the same.</p>` },
      { id: "producer-feature", title: "Review producer and featured artist terms", html: `<p>Producer paperwork may include fee, credit, master royalty, producer points, publishing share, stem delivery, revisions, approvals, and sample responsibility. A featured artist agreement may include credit language, royalty terms, approval rights, and promotional expectations.</p><p>Do not let one text message stand in for the whole deal. If the producer owns part of the composition, document that on the split sheet. If they receive master royalties, document that separately.</p>` },
      { id: "samples-beats", title: "Check beats, samples, loops, and interpolations", html: `<p>Review beat licenses and sample permissions before distribution. A lease may allow streaming but limit sync, monetization, Content ID, stems, or revenue thresholds. Samples and interpolations may require permission from composition and master owners.</p><p>If a producer used a loop or outside stem, identify the source and license terms. Unknown third-party material can become a takedown, blocked monetization, or sync rejection later.</p>` },
      { id: "credits-metadata", title: "Clean up credits and metadata", html: `<p>Confirm spelling for artist names, featured artists, producers, writers, engineers, mixers, mastering engineers, musicians, and studio credits. Match those names across distributor upload, split sheet, metadata sheet, and public credits.</p><p>Add lyrics, explicit status, language, genre, mood, tempo, and identifiers when available. Metadata is not decoration; it helps systems and people understand the release.</p>` },
      { id: "registration-tasks", title: "Map registration tasks after the split", html: `<p>After the split is signed, decide who handles PRO registration, The MLC registration or claiming, copyright registration, distributor metadata, and any publisher or administrator updates. The MLC guidance emphasizes accurate matching data and searching before creating duplicate works.</p><p>If a publisher or administrator handles registration, confirm the workflow. If you are self-administered, keep your records organized and current.</p>` },
      { id: "release-packet", title: "Create one release packet", html: `<p>Store the final split PDF, audio versions, lyrics, artwork, credits, metadata, master notes, producer terms, beat licenses, sample notes, registration confirmations, and contacts in one folder. Use it as the source for your distributor, publisher, manager, and sync pitches.</p><p>For sync-minded artists, add the <a href="/blog/independent-artist-sync-licensing-starter-kit">sync licensing starter kit</a> before sending songs to libraries or supervisors.</p>` }
    ],
    faqs: [
      { question: "What paperwork do artists need before releasing a song?", answer: "Artists should prepare split sheets, credits, producer terms, master ownership notes, sample or beat licenses, metadata, artwork, and registration plans." },
      { question: "Do I need a split sheet before uploading to a distributor?", answer: "Yes, if there are multiple writers or contributors. It creates a clear composition ownership record before release." },
      { question: "Does my distributor handle my publishing?", answer: "Not automatically. Distribution and publishing administration are different workflows." },
      { question: "Should producer points go in distributor metadata?", answer: "Producer points are usually master-side payment terms and should be documented in an agreement, not treated as public metadata alone." },
      { question: "Can a beat license affect my release?", answer: "Yes. Beat licenses may restrict monetization, sync, stems, Content ID, term, territory, or exclusivity." },
      { question: "What if I do not know a co-writer's IPI?", answer: "Mark it as missing and follow up. Do not invent identifiers." },
      { question: "Should I register with a PRO before release?", answer: "Many songwriters affiliate with a PRO and register works, but timing and process depend on your rights and organization rules." },
      { question: "What does The MLC have to do with my release?", answer: "The MLC handles certain U.S. digital audio mechanical royalty workflows for eligible musical works and relies on accurate work and recording data." },
      { question: "Does copyright protection require registration?", answer: "Copyright protection exists when an original work is fixed, but U.S. Copyright Office registration can provide additional benefits." },
      { question: "How does Split Sheet Studio help artists before release?", answer: "It helps artists create signed split sheets, validate 100% totals, collect signatures, and store a final PDF with the release packet." }
    ],
    sources: ["copyrightMusicians", "copyrightRegistration", "mlcMember", "mlcRegistration", "isrcOfficial"]
  }),
  createPost({
    slug: "independent-artist-sync-licensing-starter-kit",
    title: "Independent Artist Sync Licensing Starter Kit: Rights, Files, Metadata, and Pitch Prep",
    excerpt: "A sync starter kit for independent artists who want to prepare songs for TV, film, ads, trailers, games, content, and licensing opportunities.",
    category: "Sync Licensing",
    publishedAt: "2026-09-13",
    seoTitle: "Independent Artist Sync Licensing Starter Kit",
    metaDescription: "Build an independent artist sync licensing starter kit with signed splits, master rights, metadata, clean versions, instrumentals, lyrics, and pitch-ready files.",
    primaryKeyword: "independent artist sync licensing",
    creatorResourceLimit: 11,
    definition: "An independent artist sync licensing starter kit is a small, organized set of songs with clear rights, useful audio versions, searchable metadata, and approval contacts ready before a supervisor, brand, or library asks.",
    takeaway: "A small catalog that is easy to clear can outperform a large catalog that creates questions under deadline.",
    sections: [
      { id: "starter-kit-purpose", title: "What a sync starter kit does", html: `<p>A starter kit helps an independent artist move from “I want placements” to “these songs are actually pitchable.” It collects the rights records, files, metadata, and contact details that make a track easier to review and clear.</p><p>Sync licensing is not just sending music links. A buyer may need composition permission, master permission, clean files, instrumentals, lyrics, usage details, and fast approval. Your kit should answer those needs before they become urgent.</p>` },
      { id: "choose-songs", title: "Choose fewer songs with stronger records", html: `<p>Start with five to ten songs, not your entire hard drive. Pick songs where the writers are known, the master owner is clear, the samples are cleared or absent, and the files are easy to deliver. Then build from there.</p><p>Search engines and supervisors both reward clarity. A focused, organized catalog page or pitch note is easier to understand than a long list of tracks with no context.</p>` },
      { id: "rights-folder", title: "Create the rights folder", html: `<p>Attach signed split sheets, publisher and PRO details, master owner contacts, sample notes, beat-license notes, and approval restrictions. If a song is not one-stop, say who needs to approve it.</p><p>Copyright Alliance explains that sync use of a composition and use of an existing recording can require different permissions. Keep those permission paths visible.</p>` },
      { id: "audio-folder", title: "Prepare useful audio versions", html: `<p>Every sync candidate should have a high-quality full mix. When possible, add instrumental, clean, no-lead-vocal, stems, short edits, and alternate endings. Editors often need options to fit a scene.</p><p>Name files clearly with artist, title, version, BPM if useful, explicit status, and date. Do not make a supervisor decode your session naming habits.</p>` },
      { id: "metadata-folder", title: "Make metadata searchable", html: `<p>Describe each song with genre, subgenre, mood, energy, tempo, vocal type, lyrical themes, similar scene uses, explicit status, writers, publishers, master owner, ISRC, and ISWC when assigned. Use natural, specific language.</p><p>For AI discovery, the catalog should include entities and context: Austin R&B artist, soulful female vocal, breakup lyric, clean hook, summer brand ad, sports montage, documentary ending. Useful specificity beats keyword stuffing.</p>` },
      { id: "pitch-copy", title: "Write pitch copy that respects the brief", html: `<p>Use a short pitch note. Mention the song, why it fits, what versions are available, and how rights can be cleared. Do not send ten unrelated songs because one brief used the word emotional.</p><p>Good pitch copy is practical: “Soulful mid-tempo R&B track about rebuilding confidence, clean and instrumental available, composition and master contacts attached.”</p>` },
      { id: "clearance-honesty", title: "Be honest about one-stop status", html: `<p>Only call a song one-stop when you can verify the authority. If one writer has a publisher, a sample is not cleared, or the master owner must approve separately, explain that cleanly.</p><p>Use the <a href="/blog/one-stop-music-licensing-rights-clearance">one-stop music licensing checklist</a> to decide whether a song is green, yellow, or red for sync clearance.</p>` },
      { id: "conversion-workflow", title: "Turn sync prep into a repeatable workflow", html: `<p>After each session, save the split sheet, master notes, metadata, and audio versions into the starter kit folder. After each release, add distributor identifiers and registration confirmations. After each pitch, track who received it and what happened.</p><p>That rhythm makes the catalog stronger every month and helps the artist move like a small licensing company instead of a scattered inbox.</p>` }
    ],
    faqs: [
      { question: "How do independent artists get started with sync licensing?", answer: "Start by organizing a small set of songs with clear rights, useful audio versions, metadata, and contacts before pitching." },
      { question: "What files do I need for sync licensing?", answer: "Prepare full mix, instrumental, clean version, lyrics, stems when available, and clear metadata." },
      { question: "Do I need a publisher for sync licensing?", answer: "Not always, but you need clear composition ownership, administration, and approval authority." },
      { question: "Can I pitch songs with samples?", answer: "Only if the sample status and permissions are clear. Uncleared samples can block placements." },
      { question: "What does one-stop mean for independent artists?", answer: "It generally means one clear approval path can handle the needed rights, but the claim should be verified." },
      { question: "Do music supervisors need my split sheet?", answer: "They may not need the full document first, but the data behind it helps prove who controls the composition." },
      { question: "Should I send MP3s or WAVs?", answer: "A streaming preview is useful for first listen, but have high-quality WAV files ready when requested." },
      { question: "What metadata helps sync discovery?", answer: "Mood, genre, tempo, vocal type, lyrical theme, scene use, explicit status, writers, publishers, and rights contacts all help." },
      { question: "How many songs should I pitch first?", answer: "Pitch a smaller set of strong, clear songs that match the brief rather than a large unfocused batch." },
      { question: "How does Split Sheet Studio support sync prep?", answer: "It helps create the signed composition ownership record that anchors the rights folder in your starter kit." }
    ],
    sources: ["copyrightMusicians", "copyrightAllianceSync", "sesacFaq", "cisacIdentifiers", "isrcOfficial"]
  }),
  createPost({
    slug: "music-supervisor-pitch-package",
    title: "Music Supervisor Pitch Package: What to Send With a Sync Submission",
    excerpt: "A practical package format for sending music supervisors useful songs, clean files, metadata, lyrics, rights notes, and approval contacts without creating friction.",
    category: "Sync Licensing",
    publishedAt: "2026-09-13",
    seoTitle: "Music Supervisor Pitch Package for Sync Submissions",
    metaDescription: "Build a music supervisor pitch package with streaming links, downloads, instrumentals, clean versions, lyrics, metadata, rights status, and approval contacts.",
    primaryKeyword: "music supervisor pitch package",
    creatorResourceLimit: 11,
    definition: "A music supervisor pitch package is the compact set of links, files, rights notes, metadata, and contact information that lets a supervisor evaluate and clear a song with minimal back-and-forth.",
    takeaway: "The best pitch package respects the brief and makes the next step obvious: listen, test, clear, quote, or pass.",
    sections: [
      { id: "supervisor-needs", title: "What a supervisor needs from your pitch", html: `<p>A supervisor is usually balancing creative fit, clearance risk, budget, timeline, edit needs, and communication speed. Your pitch package should help them move through those filters quickly.</p><p>Do not treat the pitch like a fan announcement. Treat it like a professional handoff: here is the song, here is why it fits, here are the usable versions, here is who controls it, and here is how to quote or approve it.</p>` },
      { id: "match-the-brief", title: "Match the brief before you send anything", html: `<p>If the brief asks for upbeat indie pop with clean lyrics, do not send dark explicit trap because it is your strongest record. Save everyone's time by reading the mood, tempo, lyrical subject, vocal type, era, budget, and clearance requirements.</p><p>When a song is close but not exact, explain the useful angle in one sentence. The goal is to help the supervisor imagine the placement, not convince them to reinterpret the brief.</p>` },
      { id: "listening-link", title: "Use a clean listening link", html: `<p>Send a private streaming link that works without forcing account creation. Include track title, artist, short description, explicit status, and download availability. Make sure links do not expire too soon.</p><p>If you send a playlist, keep it short and ordered by relevance. A ten-song playlist can work if the first three are clearly the best matches. A fifty-song dump almost never feels helpful.</p>` },
      { id: "download-folder", title: "Prepare the download folder", html: `<p>Have WAV, MP3, instrumental, clean version, lyrics, and stems when available. If you do not want to send downloads immediately, state that files are ready on request.</p><p>Every file should be named clearly. Include artist, title, version, and status. Avoid inside jokes, old mix numbers, or confusing abbreviations.</p>` },
      { id: "rights-summary", title: "Add a short rights summary", html: `<p>The rights summary should state composition contact, master contact, publisher or administrator info, one-stop status, sample notes, restrictions, and approval timing. It does not need to expose every private deal detail in the first email.</p><p>Copyright Alliance notes that sync and master-use permissions can both matter when using an existing recording. A good pitch package makes both paths easy to understand.</p>` },
      { id: "metadata-lyrics", title: "Attach metadata and lyrics", html: `<p>Metadata should include genre, mood, tempo, vocal type, language, explicit status, writers, publishers, master owner, ISRC, ISWC when assigned, and contact info. Lyrics help supervisors check scene fit, brand safety, and cue-sheet context.</p><p>When possible, include clean lyric notes and alternate lines. A song that can be adapted safely has more placement flexibility.</p>` },
      { id: "pitch-email", title: "Use a direct pitch email structure", html: `<p>Keep the pitch email readable on a phone. Use a clear subject line, one-sentence fit, two or three recommended songs, rights status, available versions, and a single contact for next steps.</p><blockquote><p>Subject: Clean soulful R&B for family-drama brief. Sending two one-stop candidates with instrumentals and clean versions ready. Rights summaries are included in the folder, and I can confirm quote/approval timing today.</p></blockquote>` },
      { id: "follow-up", title: "Follow up without burning the relationship", html: `<p>Follow up once with useful context: a new instrumental, a cleared clean version, or a better match for a later brief. Do not repeatedly ask whether they listened. Track briefs, submissions, responses, and restrictions in your catalog spreadsheet.</p><p>Pair this article with the <a href="/blog/music-catalog-metadata-spreadsheet-for-sync">catalog metadata spreadsheet guide</a> so every pitch has better source data.</p>` }
    ],
    faqs: [
      { question: "What should I send to a music supervisor?", answer: "Send a relevant listening link, short fit note, available versions, lyrics, metadata, rights status, and contact for clearance or quote." },
      { question: "Should I send attachments in the first email?", answer: "Usually send links instead of heavy attachments unless requested. Keep files ready for quick download." },
      { question: "How many songs should be in a sync pitch?", answer: "Send only the strongest matches. Two to five highly relevant songs often beats a large playlist." },
      { question: "Should I say a song is one-stop?", answer: "Only if you can verify that the approval path covers the needed rights." },
      { question: "Do supervisors need stems?", answer: "Not always, but stems can help if the song reaches an edit or trailer stage." },
      { question: "Should I include lyrics?", answer: "Yes. Lyrics help check story fit, explicit content, brand safety, and cue-sheet details." },
      { question: "What metadata matters most?", answer: "Genre, mood, tempo, vocal type, explicit status, writers, publishers, master owner, identifiers, and approval contacts." },
      { question: "How fast should I respond to a supervisor?", answer: "As fast as practical, especially when a brief has a deadline. Prepared rights and files make fast replies possible." },
      { question: "Can studios help create pitch packages?", answer: "Yes. Studios can deliver clean files, metadata, credits, and split PDFs that help artists pitch professionally." },
      { question: "How does Split Sheet Studio help a pitch package?", answer: "It gives the team a signed ownership record that can support the rights summary in the package." }
    ],
    sources: ["copyrightAllianceSync", "copyrightMusicians", "sesacFaq", "isrcOfficial"]
  }),
  createPost({
    slug: "producer-agreement-vs-split-sheet",
    title: "Producer Agreement vs. Split Sheet: What Music Creators Should Document",
    excerpt: "A creator-friendly guide to separating producer fees, points, credits, beat licenses, master royalties, and composition splits before release.",
    category: "Producers",
    publishedAt: "2026-09-13",
    seoTitle: "Producer Agreement vs Split Sheet for Music Creators",
    metaDescription: "Learn the difference between a producer agreement and a split sheet, including producer points, master royalties, beat licenses, credits, fees, and publishing shares.",
    primaryKeyword: "producer agreement vs split sheet",
    creatorResourceLimit: 11,
    definition: "A split sheet records composition ownership among songwriters, while a producer agreement can cover production fees, producer points, master royalties, credits, deliverables, approvals, and other master-side or service terms.",
    takeaway: "One vague producer percentage can create four different assumptions unless the team labels the right it belongs to.",
    sections: [
      { id: "why-confusion-happens", title: "Why producer paperwork gets confusing", html: `<p>Producer conversations often happen fast: “I get 25,” “I need points,” “give me publishing,” or “credit me as producer.” Those phrases can mean different things to different people. Without clear documents, an artist may think one number means a composition share while the producer thinks it means master royalties.</p><p>The fix is not complicated: separate the rights. Put songwriting ownership on the split sheet. Put production services, fees, points, deliverables, and master terms in a producer agreement or related written record.</p>` },
      { id: "split-sheet-role", title: "What belongs on the split sheet", html: `<p>The split sheet should identify composition contributors and percentages. If the producer contributed protectable songwriting elements and the team agrees to a composition share, include that share with the other writers so the total equals 100%.</p><p>Do not use the split sheet as the only place to document a fee, recoupment term, stem delivery obligation, credit wording, or producer point. Those terms need their own clarity.</p>` },
      { id: "producer-agreement-role", title: "What belongs in a producer agreement", html: `<p>A producer agreement may cover the fee, payment timing, deliverables, revisions, stems, session files, credit, approvals, representations about samples, producer points, accounting, recoupment, and master-side royalties. The scope depends on the actual deal.</p><p>For higher-stakes releases, the parties should use qualified legal help. For everyday workflow, the important habit is labeling every promise and saving the record before distribution.</p>` },
      { id: "beat-license", title: "Where beat licenses fit", html: `<p>A beat license is not automatically the same as a producer agreement or split sheet. It may grant permission to use a production under defined limits while reserving other rights. Exclusive and nonexclusive licenses can still include restrictions.</p><p>Review term, territory, monetization, sync, Content ID, stems, publishing, credit, samples, and transfer language. If the producer also owns a composition share, document that separately.</p>` },
      { id: "points-vs-publishing", title: "Producer points are not publishing by default", html: `<p>Producer points commonly refer to master-side royalties. Publishing or composition share refers to the underlying song. A producer can have one, both, or neither depending on the agreement.</p><p>Before release, ask: percentage of what? Gross or net? Master revenue or composition income? Recoupable or not? Paid by whom? Accounted when? Those questions prevent one number from becoming a dispute.</p>` },
      { id: "credits", title: "Credit language should be exact", html: `<p>Credit affects reputation and metadata. Write the exact credit: produced by, co-produced by, additional production, beat by, mixed by, vocal production by, or another agreed phrase. Make sure distributor metadata, social captions, liner notes, and studio delivery match.</p><p>Credit does not automatically equal ownership. Ownership should be stated in the relevant agreement.</p>` },
      { id: "session-closeout", title: "Use session closeout to separate the terms", html: `<p>At the end of the session, ask whether the producer is receiving a composition share, master royalty, fee, beat-license payment, credit, or other approval rights. Then place each answer in the right record.</p><p>Use the <a href="/blog/recording-studio-session-closeout-workflow">session closeout workflow</a> and the <a href="/blog/producer-splits-for-beats">producer splits guide</a> together.</p>` },
      { id: "release-review", title: "Review all producer paperwork before release", html: `<p>Before upload, compare the split sheet, producer agreement, beat license, invoice, credits, and metadata. The same names and roles should appear consistently. If something conflicts, fix it before the release is live.</p><p>This is also the moment to check sample disclosures. The Copyright Office reminds musicians not to assume third-party work can be used freely.</p>` }
    ],
    faqs: [
      { question: "Is a producer agreement the same as a split sheet?", answer: "No. A split sheet records composition ownership. A producer agreement can cover production fees, credits, master royalties, deliverables, and other terms." },
      { question: "Does a producer automatically get publishing?", answer: "Not automatically. A producer receives composition ownership only when authorship and agreement support that share." },
      { question: "Are producer points the same as writer share?", answer: "No. Producer points usually refer to master-side royalties, while writer share refers to the composition." },
      { question: "Can a producer be on the split sheet?", answer: "Yes, when the parties agree the producer contributed to the composition and owns a writer share." },
      { question: "Does buying a beat mean I own the master?", answer: "Not necessarily. The beat license controls what rights you receive." },
      { question: "Should producer credits be in writing?", answer: "Yes. Exact credit language should be saved and matched across metadata and release materials." },
      { question: "Where do sample warranties belong?", answer: "They are usually part of a producer agreement, beat license, or sample disclosure record, not just a split sheet." },
      { question: "Can one document cover everything?", answer: "Sometimes a broader agreement can cover multiple terms, but the categories should still be labeled clearly." },
      { question: "What should artists check before release?", answer: "Compare splits, producer terms, beat license, credits, master notes, samples, and distributor metadata." },
      { question: "How does Split Sheet Studio help producers?", answer: "It captures agreed composition splits and keeps that record separate from other producer deal terms." }
    ],
    sources: ["copyrightMusicians", "copyrightRegistration", "musicianIncome"]
  }),
  createPost({
    slug: "music-catalog-metadata-spreadsheet-for-sync",
    title: "Music Catalog Metadata Spreadsheet for Sync: Columns Every Artist and Studio Should Track",
    excerpt: "A sync-focused metadata spreadsheet guide for tracking songs, recordings, splits, publishers, master owners, files, moods, identifiers, and clearance status.",
    category: "Music Metadata",
    publishedAt: "2026-09-13",
    seoTitle: "Music Catalog Metadata Spreadsheet for Sync Licensing",
    metaDescription: "Build a music catalog metadata spreadsheet for sync licensing with columns for rights, files, writers, publishers, master owners, ISRC, ISWC, moods, and clearance status.",
    primaryKeyword: "music catalog metadata spreadsheet",
    creatorResourceLimit: 11,
    definition: "A music catalog metadata spreadsheet is a searchable source of truth for songs and recordings, connecting creative descriptions, rights data, identifiers, files, approvals, and pitch status in one structured place.",
    takeaway: "If your catalog cannot be filtered by mood, rights status, instrumental availability, and approval contact, it is harder to pitch and harder to clear.",
    sections: [
      { id: "why-spreadsheet", title: "Why sync catalogs need a spreadsheet", html: `<p>A catalog can sound amazing and still be hard to use. If you cannot quickly find songs by mood, tempo, clean status, one-stop status, instrumental availability, writer, publisher, master owner, or sample risk, your catalog will slow down under pressure.</p><p>A metadata spreadsheet gives artists, studios, managers, and sync producers a practical operating system. It does not replace agreements. It points to them and makes the catalog searchable.</p>` },
      { id: "song-vs-recording", title: "Separate song rows from recording rows", html: `<p>A composition can have multiple recordings. A recording can have remixes, clean versions, instrumentals, and edits. Decide whether your sheet uses one row per song, one row per recording, or linked tabs for both.</p><p>The U.S. Copyright Office distinguishes musical works from sound recordings. Your catalog should too, especially when sync use may need composition and master approval.</p>` },
      { id: "creative-columns", title: "Creative discovery columns", html: `<p>Add title, artist, genre, subgenre, mood, energy, tempo, BPM, vocal type, language, explicit status, lyrical theme, instruments, era, similar scene uses, and short pitch description. Write like a human searching for a scene, not like a keyword robot.</p><p>Useful examples include: “tense trap instrumental for sports comeback,” “warm acoustic love song for family montage,” or “clean confident hip-hop hook for brand launch.”</p>` },
      { id: "rights-columns", title: "Rights and clearance columns", html: `<p>Track writer names, shares, publishers, administrators, PROs, IPIs, master owner, approval contact, one-stop status, samples, beat-license restrictions, featured artist approvals, and last verified date.</p><p>Use status values such as green, yellow, and red. Green means ready to pitch. Yellow means one or two items need confirmation. Red means do not pitch until the issue is fixed.</p>` },
      { id: "file-columns", title: "Audio and asset columns", html: `<p>Track full mix, instrumental, clean, stems, acapella, lyrics, artwork, WAV link, MP3 link, file location, and version notes. The sheet should answer whether useful edit versions exist before someone opens the session folder.</p><p>For studios, this doubles as a delivery record. For managers, it becomes a quick way to know which songs can be submitted to a brief.</p>` },
      { id: "identifier-columns", title: "Identifier and registration columns", html: `<p>Add ISRC for recordings, ISWC for compositions when assigned, IPI for writers and publishers, distributor, release date, UPC, PRO registration status, MLC status, copyright registration status, and notes.</p><p>ISRC guidance says ISRC is intended for recordings and music videos. Keep it attached to the correct recording version instead of treating it as the song ownership ID.</p>` },
      { id: "split-links", title: "Link the spreadsheet to signed split sheets", html: `<p>Every song row should link to its signed split-sheet PDF or show that it is missing. The spreadsheet summarizes ownership; the signed document supports it. Do not let the spreadsheet become an unsigned replacement for collaborator agreement.</p><p>Split Sheet Studio can generate the signed PDF, while your spreadsheet can track where that PDF lives and whether the song is ready for release or sync.</p>` },
      { id: "review-rhythm", title: "Review the catalog before every pitch cycle", html: `<p>Set a recurring cleanup rhythm. Before a sync push, filter for green songs, missing instrumentals, missing master contacts, sample risks, and stale verification dates. Fix the catalog before sending more pitches.</p><p>Then pair the sheet with the <a href="/blog/music-supervisor-pitch-package">music supervisor pitch package</a> so every submission starts from trustworthy data.</p>` }
    ],
    faqs: [
      { question: "What columns should a music catalog spreadsheet include?", answer: "Include title, artist, writers, shares, publishers, master owner, files, moods, tempo, lyrics, identifiers, rights status, and approval contacts." },
      { question: "Should I track songs or recordings?", answer: "Ideally track both. A composition and a recording are different rights layers." },
      { question: "What does ISRC identify?", answer: "ISRC identifies a specific recording or music video." },
      { question: "What does ISWC identify?", answer: "ISWC identifies a musical work or composition." },
      { question: "Should one-stop status be in the spreadsheet?", answer: "Yes, but only mark one-stop when the rights and approval authority are verified." },
      { question: "Can a spreadsheet replace a split sheet?", answer: "No. It summarizes and links to records; it should not replace signed ownership documents." },
      { question: "What metadata helps sync searches?", answer: "Mood, genre, tempo, lyrical theme, energy, vocal type, explicit status, scene use, and rights status are especially useful." },
      { question: "Should studios deliver a metadata spreadsheet?", answer: "For serious clients, yes. It adds value and helps releases stay organized." },
      { question: "How often should I update catalog metadata?", answer: "Update after sessions, releases, registrations, ownership changes, and each sync pitch cycle." },
      { question: "How does Split Sheet Studio fit a catalog spreadsheet?", answer: "It creates signed split PDFs that can be linked from the spreadsheet as the ownership source." }
    ],
    sources: ["copyrightMusicians", "copyrightRegistration", "cisacIdentifiers", "isrcOfficial", "mlcRegistration"]
  }),
  createPost({
    slug: "songwriter-collaboration-agreement-checklist",
    title: "Songwriter Collaboration Agreement Checklist: Splits, Credits, Publishing, and Approval Notes",
    excerpt: "A songwriting-session checklist for capturing collaborators, composition splits, credits, publishing details, approvals, and unresolved questions before release pressure starts.",
    category: "Songwriting",
    publishedAt: "2026-09-13",
    seoTitle: "Songwriter Collaboration Agreement Checklist",
    metaDescription: "Use this songwriter collaboration agreement checklist to document co-writers, splits, credits, publishing, PROs, IPIs, samples, approvals, and signatures.",
    primaryKeyword: "songwriter collaboration agreement checklist",
    creatorResourceLimit: 11,
    definition: "A songwriter collaboration agreement checklist is the practical review of who contributed to a song, what ownership percentages were agreed, what credits and publishing details are known, and what questions must be resolved before release or registration.",
    takeaway: "The split conversation is easiest while the session is fresh and hardest after the song starts earning attention.",
    sections: [
      { id: "why-collaboration-needs-record", title: "Why collaboration needs a written record", html: `<p>Songwriting can happen casually: a hook in the room, a chord change from a producer, a bridge over FaceTime, a topline from a friend, or a late lyric rewrite. The creative process feels fluid, but release systems eventually ask for structured answers.</p><p>A checklist helps the team capture the agreement before memory turns into negotiation. It gives collaborators a shared record without making the session feel hostile.</p>` },
      { id: "name-contributors", title: "Name every contributor", html: `<p>List legal names, professional names, emails, roles, and what each person contributed. Include people in the room and remote collaborators. If someone contributed to performance or engineering but not composition, record the credit separately.</p><p>Credits and ownership are related but not identical. The checklist should make both visible.</p>` },
      { id: "composition-splits", title: "Agree on composition splits", html: `<p>Discuss writer shares while the session is fresh. The split sheet should total 100% and reflect the collaborators' agreement. Include publisher, PRO, and IPI information when known, but do not guess missing data.</p><p>If the team is not ready to decide, label the split as a draft and schedule a specific follow-up. Avoid letting an unresolved draft become the release record by accident.</p>` },
      { id: "publishing-admin", title: "Capture publishing and administration details", html: `<p>Ask whether each writer is self-administered, represented by a publisher, using an administrator, or unsure. This matters for registrations, licensing, and sync approval. The MLC guidance distinguishes self-administered writers from represented writers in its membership and registration workflows.</p><p>When someone does not know their publishing data, capture the person responsible for finding it.</p>` },
      { id: "master-and-producer", title: "Separate master and producer terms", html: `<p>If a producer contributed, ask whether they have a composition share, fee, producer points, master royalty, credit, or beat-license terms. Put composition ownership on the split sheet and master-side terms in a separate record.</p><p>This protects both sides. The artist does not accidentally give publishing when they meant points, and the producer does not lose a term because it was described vaguely.</p>` },
      { id: "samples-approvals", title: "List samples, loops, and approvals", html: `<p>Ask whether the collaboration used samples, interpolations, loops, outside stems, or reference material. Document the source and status. Also list approvals required for release, sync, remix, lyric changes, or featured artist use.</p><p>Unknown material should be marked as unknown. Pretending it is cleared can hurt the song later.</p>` },
      { id: "signatures", title: "Collect signatures and distribute the same copy", html: `<p>Once the team agrees, send secure signature links or sign while everyone is present. Every contributor should review the full ownership picture, not only their own percentage.</p><p>After completion, send the same final PDF to everyone and store it with the release packet. That final record becomes the reference for registrations, sync prep, and future questions.</p>` },
      { id: "make-it-normal", title: "Make collaboration paperwork normal", html: `<p>The goal is not to scare collaborators. The goal is to protect the song. A simple message works: “Before we upload or pitch this, let's make sure everyone is named correctly and the split matches what we agreed.”</p><p>Use <a href="/blog/what-is-a-split-sheet-in-music">the split-sheet guide</a> and <a href="/blog/artist-release-paperwork-checklist-before-distribution">the artist release checklist</a> when the collaboration is moving toward release.</p>` }
    ],
    faqs: [
      { question: "What is a songwriter collaboration agreement checklist?", answer: "It is a practical checklist for documenting contributors, shares, credits, publishing details, samples, approvals, and signatures." },
      { question: "Is a split sheet a collaboration agreement?", answer: "A split sheet documents composition ownership, but broader collaboration terms may need additional agreement language." },
      { question: "When should songwriters discuss splits?", answer: "Ideally before the session ends, while contributions and expectations are fresh." },
      { question: "Does every performer get a songwriting split?", answer: "Not automatically. Performance credit and composition ownership are different." },
      { question: "Can a producer be a songwriter?", answer: "Yes, if the producer contributed to the composition and the parties agree to a writer share." },
      { question: "What if we do not know publisher information yet?", answer: "Mark it as unknown, assign follow-up, and avoid guessing." },
      { question: "Should samples be listed on collaboration paperwork?", answer: "Yes. Samples, interpolations, loops, and outside stems should be disclosed and tracked." },
      { question: "Do all collaborators need a copy?", answer: "Yes. Everyone who signs should receive the same completed record." },
      { question: "Does this replace legal advice?", answer: "No. It is a workflow checklist, not legal advice." },
      { question: "How does Split Sheet Studio help collaborators?", answer: "It helps collaborators validate totals, collect signatures, and preserve a final PDF record of the agreed split." }
    ],
    sources: ["copyrightMusicians", "copyrightRegistration", "mlcMember", "mlcRegistration"]
  }),
  createPost({
    slug: "how-to-rescan-plugins-in-your-daw",
    title: "How to Rescan Plugins in Your DAW: The Complete VST3, AU, and AAX Guide",
    excerpt: "Find missing plug-ins in Studio One, Ableton Live, FL Studio, Cubase, Cakewalk, REAPER, Pro Tools, Logic Pro, Bitwig, and other major DAWs.",
    category: "DAW Workflow",
    publishedAt: "2026-08-23",
    seoTitle: "How to Rescan Plugins in Any DAW: VST3, AU & AAX",
    metaDescription: "Learn how to rescan missing plugins in Studio One, Ableton, FL Studio, Cubase, Cakewalk, REAPER, Pro Tools, Logic Pro, Bitwig, and more.",
    primaryKeyword: "how to rescan plugins in your DAW",
    creatorResourceLimit: 6,
    definition: "To rescan a plug-in, first confirm that its format matches your DAW, verify the correct system folder, close and reopen the DAW, then use the host's plug-in manager to scan new, failed, or blocked plug-ins.",
    takeaway: "A rescan cannot make an incompatible format work. Windows VST3 hosts can load the Split Sheet Studio plugin; Pro Tools requires AAX, and Logic Pro uses Audio Units on macOS.",
    sections: [
      { id: "check-format-first", title: "Check the plug-in format before you rescan", html: `<p>Most missing-plugin problems begin with format mismatch. VST3 is widely supported by Windows DAWs. Pro Tools uses AAX, while Logic Pro uses Audio Units on macOS. A DAW cannot discover a format it does not host, no matter how many times you scan.</p><ul><li><strong>VST3:</strong> common in Studio One, Ableton Live, FL Studio, Cubase, Nuendo, Cakewalk, REAPER, Bitwig, Mixcraft, Waveform, and other Windows hosts.</li><li><strong>AAX:</strong> the current Pro Tools plug-in format.</li><li><strong>Audio Units:</strong> the native third-party format used by Logic Pro.</li><li><strong>Standalone:</strong> opens outside a DAW and does not require a plug-in scan.</li></ul>` },
      { id: "windows-vst3-location", title: "Verify the standard Windows VST3 location", html: `<p>On 64-bit Windows, the standard VST3 system folder is <code>C:\\Program Files\\Common Files\\VST3</code>. Split Sheet Studio installs its VST3 bundle there and also installs a standalone app.</p><p>Close every DAW before running an installer or update. After installation, confirm that the Split Sheet Studio bundle exists in the standard folder, reopen your DAW, and let its startup scan finish. Download the current build from the <a href="/plugin">Windows plugin page</a>.</p>` },
      { id: "studio-one", title: "How to rescan plugins in Studio One", html: `<ol><li>Close Studio One before installing the plug-in.</li><li>Install the 64-bit VST3 to the standard Windows VST3 folder.</li><li>Open Studio One and go to <strong>Studio One &gt; Options &gt; Locations &gt; VST Plug-ins</strong>.</li><li>Make sure scanning at startup is enabled, then restart Studio One or run the available scan action.</li><li>Search the Browser under <strong>Effects</strong> for the plug-in name.</li></ol><p>PreSonus states that Studio One scans the standard VST3 folder automatically. Do not add the entire C drive or all of Program Files as a plug-in path; broad paths can make scans unstable.</p>` },
      { id: "ableton-live", title: "How to rescan plugins in Ableton Live", html: `<ol><li>Open <strong>Settings/Preferences &gt; Plug-Ins</strong>.</li><li>Turn on <strong>Use VST3 Plug-In System Folders</strong>.</li><li>Click <strong>Rescan</strong> and wait for indexing to complete.</li><li>If the plug-in is still missing, hold <strong>Alt</strong> while clicking Rescan for a deeper scan.</li><li>Look under <strong>Plug-ins &gt; VST3</strong> in Live's Browser.</li></ol><p>Ableton recommends keeping VST2 and VST3 files in separate folders and using the standard VST3 system location on Windows.</p>` },
      { id: "fl-studio", title: "How to rescan plugins in FL Studio", html: `<ol><li>Open <strong>Options &gt; Manage plugins</strong>.</li><li>Confirm the standard VST3 location is available.</li><li>Enable <strong>Verify plugins</strong>.</li><li>For an updated or previously failed plug-in, enable <strong>Rescan previously verified plugins</strong> and <strong>Rescan plugins with errors</strong>.</li><li>Click <strong>Find installed plugins</strong>, then look under Installed Effects.</li></ol><p>Image-Line advises installing VST3 files in the standard system folder instead of FL Studio's native plug-in folder.</p>` },
      { id: "cubase-nuendo", title: "How to rescan plugins in Cubase and Nuendo", html: `<ol><li>Open <strong>Studio &gt; VST Plug-in Manager</strong>.</li><li>Search for the plug-in on the effects or instruments tab.</li><li>Use <strong>Scan for new and blocked plug-ins</strong>.</li><li>Hold <strong>Shift</strong> when using the scan control to rescan all plug-ins in current versions.</li><li>Check the blocklist if the plug-in failed validation.</li></ol><p>Cubase and Nuendo are Steinberg VST hosts, so a correctly installed 64-bit Windows VST3 should use the standard VST3 location.</p>` },
      { id: "cakewalk-bandlab", title: "How to rescan plugins in Cakewalk Sonar and BandLab workflows", html: `<ol><li>Open <strong>Edit &gt; Preferences</strong>, or press <strong>P</strong>.</li><li>Choose <strong>File &gt; VST Settings</strong>.</li><li>Confirm <code>C:\\Program Files\\Common Files\\VST3</code> is in the scan paths.</li><li>Run a manual scan.</li><li>If needed, select <strong>Rescan Failed Plugins</strong> and scan again.</li></ol><p>Cakewalk's scanner normally runs when the DAW opens. BandLab's web and mobile creation tools do not host desktop VST3 plug-ins; use a compatible Windows desktop DAW or the Split Sheet Studio web app for that workflow.</p>` },
      { id: "reaper-bitwig-more", title: "How to rescan in REAPER, Bitwig, Mixcraft, Waveform, and Reason", html: `<p><strong>REAPER:</strong> open <strong>Options &gt; Preferences &gt; Plug-ins &gt; VST</strong>, verify the path, then choose <strong>Re-scan</strong>. Use <strong>Clear cache/re-scan</strong> only when a normal scan does not resolve the issue.</p><p><strong>Bitwig Studio:</strong> open Settings, review Locations or Plug-ins, confirm VST3 support and the system location, then refresh or reindex plug-ins.</p><p><strong>Mixcraft, Waveform, Reason, Samplitude, and similar Windows hosts:</strong> open the application's plug-in settings or manager, verify that VST3 is enabled, scan the standard system folder, then search under effects. Menu names vary by version, so use the DAW vendor's current manual when the wording differs.</p>` },
      { id: "pro-tools-logic", title: "Why Pro Tools and Logic Pro are different", html: `<p><strong>Pro Tools:</strong> current versions require 64-bit AAX plug-ins. A Windows VST3 installer will not appear in Pro Tools because it is the wrong format. Until an AAX edition exists, use Split Sheet Studio as the standalone Windows app or through the hosted browser workflow.</p><p><strong>Logic Pro:</strong> Logic runs on macOS and hosts Audio Units. In Logic Pro, open <strong>Logic Pro &gt; Settings &gt; Plug-In Manager</strong>, select an installed Audio Unit, and choose <strong>Reset &amp; Rescan Selection</strong>. The Split Sheet Studio Windows VST3 download is not a native Logic plug-in; Mac Audio Unit support is a separate future build.</p>` },
      { id: "troubleshooting", title: "The missing plug-in troubleshooting checklist", html: `<ol><li>Confirm the operating system and DAW are supported.</li><li>Match the format: VST3, AAX, or Audio Units.</li><li>Confirm 64-bit architecture where required.</li><li>Close the DAW and reinstall using the vendor installer.</li><li>Verify the exact standard system folder.</li><li>Restart the computer if the installer changed shared components.</li><li>Run a normal scan, then a failed/blocked or deep scan.</li><li>Check the DAW blocklist, crash list, or validation status.</li><li>Update the DAW and plug-in.</li><li>Test the plug-in in a blank project before opening an important session.</li></ol>` },
      { id: "split-sheet-studio-plugin", title: "Testing the Split Sheet Studio Windows plugin", html: `<p>Split Sheet Studio is distributed as a 64-bit Windows VST3 plugin plus a standalone app. It is designed for most Windows DAWs that support VST3 effects, but compatibility can vary by DAW version, security settings, and plug-in scanner.</p><ol><li>Close your DAW.</li><li>Download and run the Windows installer.</li><li>Open your preferred VST3-compatible Windows DAW.</li><li>Rescan using the instructions above.</li><li>Load Split Sheet Studio as an effect, sign in, and run a test split.</li></ol><p>If your DAW does not host VST3, use the standalone or <a href="https://app.splitsheetstudio.com">web app</a> while native formats are expanded.</p>` }
    ],
    faqs: [
      { question: "Why is my VST3 plugin not showing up?", answer: "The most common causes are an incorrect install folder, a disabled VST3 system folder, a failed scan, a blocked plug-in, a 32/64-bit mismatch, or a DAW that does not host VST3." },
      { question: "Where do VST3 plugins install on Windows?", answer: "The standard 64-bit Windows VST3 location is C:\\Program Files\\Common Files\\VST3." },
      { question: "Does Pro Tools load VST3 plugins?", answer: "No. Current Pro Tools versions use the 64-bit AAX format. A VST3-only product needs an AAX edition before it can load natively in Pro Tools." },
      { question: "Does Logic Pro load Windows VST3 plugins?", answer: "No. Logic Pro runs on macOS and uses Audio Units. A Windows VST3 installer cannot be rescanned into Logic Pro." },
      { question: "Can BandLab use VST3 plugins?", answer: "Cakewalk Sonar on Windows supports VST3 scanning. BandLab's browser and mobile creation tools do not host Windows desktop VST3 plug-ins." },
      { question: "Do I need the Split Sheet Studio standalone app open while using the VST3?", answer: "No. The VST3 connects directly to the hosted Split Sheet Studio service. The standalone app is an additional way to use the same workflow outside a DAW." },
      { question: "Should I clear the entire plug-in cache first?", answer: "Start with a normal rescan. Use a deep scan, failed-plugin rescan, or cache reset only after confirming the format and installation path, because a full rebuild can take longer and may affect custom organization." }
    ],
    sources: ["presonusPlugins", "abletonWindowsPlugins", "flStudioPlugins", "cubasePluginManager", "cakewalkScanner", "avidAax", "appleLogicPlugins", "reaperGuide"]
  }),
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
      { id: "readiness-test", title: "The 60-second sync readiness test", html: `<p>Can you identify every writer and publisher, state who owns the master, confirm samples are cleared, produce instrumental and clean files, and reach all approval parties within one minute? If not, fix the data before increasing pitch volume.</p><p>Use the <a href="/blog/music-publishing-before-sync-licensing">publishing-before-sync guide</a> and the <a href="/blog/one-stop-music-licensing-rights-clearance">one-stop licensing checklist</a> to close the gaps.</p>` }
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
      { id: "system", title: "Turn paperwork into a repeatable studio system", html: `<p>Use the same naming convention, required fields, validation, signature flow, and storage location for every session. Assign one person to close the record before the project leaves production.</p><p>Pair this with the <a href="/blog/recording-studio-session-closeout-workflow">five-minute session closeout workflow</a>, the <a href="/blog/sync-licensing-checklist">sync checklist</a>, and the <a href="/blog/producer-splits-for-beats">producer guide</a>.</p>` }
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
      { id: "before-upload", title: "What to confirm before the distributor upload", html: `<p>Make sure the split sheet, producer agreement, credits, master ownership, sample status, and payment obligations tell the same story. Deliver the producer's copy and preserve the final version.</p><p>Use the <a href="/blog/recording-studio-paperwork-checklist">recording studio paperwork checklist</a> and the <a href="/blog/recording-studio-session-closeout-workflow">session closeout workflow</a>.</p>` }
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
      { id: "audit", title: "Run a pre-pitch publishing audit", html: `<ol><li>Confirm signed splits total 100%.</li><li>Verify publisher and administrator names.</li><li>Check work registrations against the split.</li><li>Identify composition and master contacts.</li><li>Clear samples.</li><li>Prepare metadata and audio.</li><li>Claim one-stop only when verified.</li></ol><p>Use the <a href="/blog/sync-licensing-checklist">full sync checklist</a> and the <a href="/blog/one-stop-music-licensing-rights-clearance">one-stop music licensing guide</a>.</p>` }
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
          dateModified: post.updatedAt || "2026-09-13",
          mainEntityOfPage: `https://splitsheetstudio.com/blog/${post.slug}`,
          image: "https://splitsheetstudio.com/vst-contributors.png",
          author: { "@type": "Organization", name: "Split Sheet Studio" },
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
