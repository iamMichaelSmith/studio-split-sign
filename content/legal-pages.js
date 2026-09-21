const updatedLabel = "September 13, 2026";

const commonNotice = [
  "These pages are operating templates for Split Sheet Studio. They are written to be conservative and clear, but they are not legal advice.",
  "Before public launch, have a qualified attorney review these terms for your business entity, state, payment flow, and customer base."
];

const legalPages = {
  terms: {
    slug: "terms",
    title: "Terms of Service",
    description: "Rules for using Split Sheet Studio, the hosted app, the VST3 plugin, and related services.",
    sections: [
      {
        heading: "Agreement to these terms",
        body: [
          "By accessing Split Sheet Studio, creating an account, using the hosted app, using the VST3 plugin, downloading software, submitting split-sheet information, or clicking any acceptance control, you agree to these Terms of Service.",
          "If you are using the service on behalf of a studio, company, label, publisher, management company, or other organization, you represent that you have authority to bind that organization."
        ]
      },
      {
        heading: "What Split Sheet Studio provides",
        body: [
          "Split Sheet Studio provides workflow tools for capturing song metadata, contributor information, publishing information, ownership percentages, remote signature links, audit events, and generated PDF packets.",
          "The service is a documentation and workflow tool. It does not replace legal counsel, copyright registration, publishing administration, PRO registration, label clearance, sync licensing clearance, or professional accounting."
        ]
      },
      {
        heading: "Your responsibility for split information",
        body: [
          "You are solely responsible for the accuracy, completeness, authorization, and legality of all information you submit, including names, roles, email addresses, writer shares, publisher shares, master shares, PRO information, IPI numbers, signature names, and recipient lists.",
          "You are responsible for confirming that every contributor understands the split, has authority to sign, and agrees to the final record. We do not verify ownership claims, songwriter credits, master ownership, publishing control, or sync licensing rights."
        ]
      },
      {
        heading: "No legal, tax, royalty, publishing, or accounting advice",
        body: [
          "Split Sheet Studio and Blak Marigold Studio do not provide legal, tax, royalty, publishing, copyright, sync licensing, music clearance, or accounting advice.",
          "Any examples, blog posts, labels, prompts, summaries, or generated packet language are for general workflow and educational purposes only. You should consult qualified professionals before relying on any split sheet in a dispute, negotiation, registration, release, licensing deal, audit, or royalty collection process."
        ]
      },
      {
        heading: "Electronic records and signatures",
        body: [
          "The service may collect typed signatures, drawn signatures, timestamps, IP-related request information, email delivery events, signer events, and acceptance confirmations.",
          "You agree that electronic records, electronic signatures, click confirmations, typed names, drawn signatures, and related audit events may be used for the transactions you conduct through the service, subject to applicable law."
        ]
      },
      {
        heading: "Accounts and security",
        body: [
          "You are responsible for maintaining the confidentiality of your account, password, API tokens, plugin sessions, and devices.",
          "You must not use the service to impersonate someone, submit false ownership information, send unauthorized signature requests, scrape the service, bypass rate limits, attack infrastructure, or interfere with other users."
        ]
      },
      {
        heading: "Software license",
        body: [
          "The Split Sheet Studio VST3 plugin and standalone application are licensed, not sold. Subject to these terms, you receive a limited, non-exclusive, non-transferable license to install and use the software for your own studio workflow.",
          "You may not reverse engineer, resell, redistribute, sublicense, modify, remove notices from, or use the software to build a competing service, except where applicable law prohibits this restriction."
        ]
      },
      {
        heading: "Service availability and updates",
        body: [
          "We may update, modify, suspend, discontinue, patch, or replace parts of the service or plugin. We may also enforce version requirements when older plugin builds are insecure, incompatible, or unsupported.",
          "We do not guarantee uninterrupted service, permanent storage, permanent email delivery, permanent compatibility with every DAW, or permanent compatibility with every operating system."
        ]
      },
      {
        heading: "Third-party services",
        body: [
          "The service may depend on third-party providers such as AWS, Stripe, email providers, DAWs, operating systems, browsers, plugin hosts, and internet service providers.",
          "We are not responsible for third-party outages, billing rules, account restrictions, DAW scanning behavior, email filtering, payment processor decisions, or platform changes."
        ]
      },
      {
        heading: "Disclaimers",
        body: [
          "The service, software, website, documentation, generated PDFs, signature flow, update checks, and blog content are provided on an “as is” and “as available” basis.",
          "To the maximum extent permitted by law, we disclaim warranties of merchantability, fitness for a particular purpose, title, non-infringement, uninterrupted operation, error-free operation, and accuracy of user-submitted rights information."
        ]
      },
      {
        heading: "Limitation of liability",
        body: [
          "To the maximum extent permitted by law, Split Sheet Studio, Blak Marigold Studio, and their owners, operators, contractors, and affiliates will not be liable for indirect, incidental, special, consequential, punitive, exemplary, lost-profit, lost-royalty, lost-opportunity, lost-data, lost-deal, or music-clearance damages.",
          "To the maximum extent permitted by law, our total liability for any claim relating to the service or software is limited to the amount you paid to us for the service or software during the three months before the claim, or one hundred U.S. dollars if you paid nothing."
        ]
      },
      {
        heading: "Indemnity",
        body: [
          "You agree to defend, indemnify, and hold harmless Split Sheet Studio, Blak Marigold Studio, and their owners, operators, contractors, and affiliates from claims, damages, liabilities, costs, and expenses arising from your submitted content, your split-sheet information, your signature requests, your misuse of the service, your violation of these terms, or your violation of another person’s rights."
        ]
      },
      {
        heading: "Contact",
        body: [
          "Questions about these terms can be sent to the support email listed on this website."
        ]
      }
    ]
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How Split Sheet Studio collects, uses, stores, and shares information.",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "We collect account information such as name, email address, password hash, verification status, plan level, and authentication session data.",
          "We collect split-sheet workflow information that users submit, including song metadata, contributor names, roles, emails, addresses, phone numbers, PRO details, IPI numbers, publisher details, ownership percentages, typed signatures, drawn signatures, recipient selections, notes, timestamps, and audit events.",
          "We maintain a contact record when someone creates an account, is named as a contributor, signs a split sheet, or voluntarily joins an email list. The record may include email, display name, source, consent status, consent timestamp, IP-related request data, user agent, and unsubscribe status.",
          "We collect technical information such as IP-related request data, user agent, rate-limit events, server logs, plugin version checks, download events, and error data."
        ]
      },
      {
        heading: "How we use information",
        body: [
          "We use information to provide the hosted app, plugin API, account access, signature links, final PDFs, email delivery, support, fraud prevention, rate limiting, security, debugging, updates, and service improvement.",
          "We may use aggregated or de-identified operational data to understand reliability, feature usage, and product performance.",
          "We send educational or promotional email only after an explicit optional opt-in. Being added as a contributor, receiving a signature request, signing a split sheet, or creating an account does not by itself require marketing consent."
        ]
      },
      {
        heading: "Payment information",
        body: [
          "When payments are enabled, payment information is processed by Stripe. We do not intentionally store full card numbers on our servers.",
          "We may store Stripe customer IDs, subscription IDs, checkout session IDs, payment status, purchase records, download tokens, and plan status so that purchases and subscription limits work correctly."
        ]
      },
      {
        heading: "How we share information",
        body: [
          "We share information as needed with service providers that run the product, including hosting, database, storage, email, payment, logging, security, and support providers.",
          "We may share split-sheet packets and signature links with recipients selected by the user. We may disclose information if required by law, legal process, security investigation, fraud prevention, or to protect rights and safety.",
          "We do not sell personal information as a data broker."
        ]
      },
      {
        heading: "Security",
        body: [
          "We use practical safeguards such as hashed passwords, session controls, rate limiting, TLS in production, protected storage, access controls, and operational monitoring.",
          "No online system can be guaranteed perfectly secure. You are responsible for protecting your credentials, devices, inboxes, DAW workstation, and shared links."
        ]
      },
      {
        heading: "Retention",
        body: [
          "We retain account records, split-sheet records, generated PDFs, audit events, purchase records, and operational logs for as long as reasonably needed to provide the service, support users, maintain records, comply with legal obligations, resolve disputes, and enforce agreements.",
          "You may request deletion or export, but some records may be retained where needed for security, audit integrity, payment records, legal obligations, or legitimate business purposes."
        ]
      },
      {
        heading: "Children",
        body: [
          "The service is not directed to children under 13. Do not use the service if you are under 13. If you believe a child submitted information, contact us."
        ]
      },
      {
        heading: "Your choices",
        body: [
          "You can update account information, control recipient selections, avoid optional fields, request support, and choose whether to submit split-sheet information.",
          "Marketing choices are optional. Each marketing contact has an unsubscribe preference, and unsubscribing does not prevent transactional messages related to accounts, split-sheet invitations, signatures, purchases, security, or completed records.",
          "A later transactional event does not automatically resubscribe an unsubscribed contact. A new explicit opt-in is required."
        ]
      },
      {
        heading: "Changes",
        body: [
          "We may update this Privacy Policy as the product, law, infrastructure, or business changes. The updated date will show when the page was last changed."
        ]
      },
      {
        heading: "Contact",
        body: [
          "Privacy questions and requests can be sent to the support email listed on this website."
        ]
      }
    ]
  },
  refunds: {
    slug: "refund-policy",
    title: "Refund Policy",
    description: "Refund rules for Split Sheet Studio plans, plugin downloads, and digital products.",
    sections: [
      {
        heading: "No-refund policy",
        body: [
          "All Split Sheet Studio subscriptions, hosted account access, plugin access, standalone app access, protected downloads, and digital services are non-refundable except where a refund is required by law.",
          "By purchasing or subscribing, you understand that access to digital services and software begins immediately and that payments are final."
        ]
      },
      {
        heading: "Subscription plans",
        body: [
          "You may cancel future renewal through the billing portal or support. Cancellation stops future billing at the end of the current billing period but does not refund the current or prior paid period except where required by law.",
          "If you believe a charge was duplicated or caused by a verified billing error, contact support promptly so the account and payment record can be reviewed."
        ]
      },
      {
        heading: "Plugin and software access",
        body: [
          "The Windows VST3 plugin and standalone Windows app are included with paid packages during launch. Access to those digital downloads and software benefits is non-refundable except where required by law.",
          "If the installer cannot be downloaded or the delivered build is materially defective on a supported Windows/VST3 setup, contact support so we can troubleshoot or replace access."
        ]
      },
      {
        heading: "No refunds for workflow or user data issues",
        body: [
          "Refunds are not provided for incorrect split percentages, incorrect recipient emails, contributor disputes, publishing disagreements, duplicate submissions, missed sync licensing opportunities, DAW/user configuration problems outside supported requirements, or failure to review information before submission."
        ]
      },
      {
        heading: "Chargebacks",
        body: [
          "If you dispute a charge with your payment provider, account access, download access, or subscription benefits may be paused while the dispute is reviewed."
        ]
      },
      {
        heading: "Contact",
        body: [
          "Refund requests should include the account email, purchase email, approximate purchase date, and a clear explanation of the issue."
        ]
      }
    ]
  },
  esign: {
    slug: "electronic-signature-consent",
    title: "Electronic Signature Consent",
    description: "Consent terms for electronic records, electronic signatures, and split-sheet signature links.",
    sections: [
      {
        heading: "Consent to electronic records",
        body: [
          "By using Split Sheet Studio, submitting a split sheet, clicking agreement checkboxes, typing your signature name, drawing a signature, opening a signature link, or submitting a signature form, you consent to receive and use electronic records for the workflow."
        ]
      },
      {
        heading: "Consent to electronic signatures",
        body: [
          "You agree that typed names, drawn signatures, checkbox confirmations, button submissions, timestamps, audit events, and related electronic records may be used as electronic signatures for the split-sheet workflow, subject to applicable law."
        ]
      },
      {
        heading: "Hardware and software requirements",
        body: [
          "You need a device with internet access, a modern browser or supported VST3 host, an email account capable of receiving links, and software capable of opening PDF files.",
          "If you cannot access electronic records, do not sign electronically until you can review the record in a format that works for you."
        ]
      },
      {
        heading: "Paper copies and withdrawal",
        body: [
          "You may print or save generated PDFs for your records. You may request help accessing a record by contacting support.",
          "Withdrawing electronic consent may prevent you from using signature-link workflows or plugin workflows because the service is designed around electronic records."
        ]
      },
      {
        heading: "Accuracy of contact information",
        body: [
          "You are responsible for keeping your email address and contact details accurate. Users who send signature links are responsible for entering correct recipient emails."
        ]
      },
      {
        heading: "Review before signing",
        body: [
          "Do not sign a split sheet unless you have reviewed the song details, contributor details, ownership percentages, signature flow, and final confirmations."
        ]
      }
    ]
  },
  disclaimer: {
    slug: "disclaimer",
    title: "Legal Disclaimer",
    description: "Important disclaimers about music rights, publishing, royalties, copyrights, and sync licensing.",
    sections: [
      {
        heading: "No professional advice",
        body: [
          "Split Sheet Studio is not a law firm, accounting firm, publisher, PRO, distributor, label, copyright office, sync licensing agency, or royalty administrator.",
          "Nothing on the website, in the plugin, in generated PDFs, in blog posts, in emails, or in documentation should be treated as legal, tax, royalty, copyright, publishing, sync licensing, clearance, or accounting advice."
        ]
      },
      {
        heading: "No ownership verification",
        body: [
          "We do not verify that a contributor owns the rights they claim, that percentages are correct, that a publisher is authorized, that a song is cleared, or that information is suitable for a PRO, distributor, label, publisher, sync agency, music supervisor, or court."
        ]
      },
      {
        heading: "No guarantee of enforceability",
        body: [
          "We do not guarantee that a split sheet, signature packet, audit trail, PDF, or electronic signature will be enforceable in every jurisdiction or every dispute.",
          "Enforceability can depend on facts, law, signer authority, consent, records, identity, contract terms, and other circumstances outside our control."
        ]
      },
      {
        heading: "No guarantee of revenue or placement",
        body: [
          "We do not guarantee royalties, publishing income, sync placements, playlist placements, label deals, distribution outcomes, copyright registrations, PRO collections, metadata acceptance, or dispute resolution."
        ]
      },
      {
        heading: "Use qualified professionals",
        body: [
          "For important releases, catalog administration, publishing deals, samples, interpolations, producer agreements, work-for-hire issues, master ownership, sync licensing, and disputes, consult qualified legal and music-business professionals."
        ]
      }
    ]
  }
};

function listLegalPages() {
  return Object.values(legalPages);
}

function getLegalPage(slug) {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  return legalPages[normalizedSlug] || listLegalPages().find((page) => page.slug === normalizedSlug) || null;
}

module.exports = {
  commonNotice,
  getLegalPage,
  legalPages,
  listLegalPages,
  updatedLabel
};
