/**
 * English UI strings and page copy.
 * es.ts must mirror this shape exactly (enforced by the `Dictionary` type).
 */
const en = {
  meta: {
    home: {
      title: 'Immigration Lawyer | English & Spanish',
      description:
        'Bilingual immigration legal services for families and individuals: green cards, citizenship, visas, work permits, removal defense and more.',
    },
    about: {
      title: 'About Our Immigration Law Office',
      description:
        'Learn about our immigration law office, our attorney, and how we support clients in English and Spanish, in person or by video.',
    },
    services: {
      title: 'Immigration Services',
      description:
        'Explore the immigration matters we handle, including family petitions, green cards, citizenship, visas, work permits and deportation defense.',
    },
    resources: {
      title: 'Immigration Resources & Official Links',
      description:
        'Helpful official immigration resources, case status tools, and a checklist of what to bring to your immigration consultation.',
    },
    faq: {
      title: 'Immigration FAQ',
      description:
        'Answers to common questions about immigration consultations, languages, virtual meetings, and the immigration matters we handle.',
    },
    contact: {
      title: 'Contact Us & Schedule a Consultation',
      description:
        'Contact our immigration law office by phone, email, or our simple online form to request a consultation in English or Spanish.',
    },
    thankYou: {
      title: 'Thank You',
      description: 'Your message has been received.',
    },
  },

  nav: {
    label: 'Main navigation',
    home: 'Home',
    about: 'About',
    services: 'Immigration Services',
    resources: 'Resources',
    faq: 'FAQ',
    contact: 'Contact',
    schedule: 'Schedule Consultation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skipToContent: 'Skip to main content',
    languageLabel: 'Language',
    homeLink: 'home page',
  },

  common: {
    attorneysAtLaw: 'Attorneys at Law',
    learnMore: 'Learn more',
    learnMoreAbout: 'Learn more about',
    scheduleConsultation: 'Schedule a Consultation',
    ourServices: 'Our Services',
    viewAllServices: 'View all services',
    call: 'Call',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    officeHours: 'Office hours',
    breadcrumb: 'Breadcrumb',
    overviewHeading: 'Overview',
    helpWithHeading: 'How we can help',
    processHeading: 'How the process works',
    faqHeading: 'Frequently asked questions',
    relatedServices: 'Other immigration services',
    noGuarantee:
      'Every case is different. This page provides general information, not legal advice, and no particular outcome can be guaranteed.',
    draftNotice:
      'Draft — this page is pending review by the attorney and may change.',
  },

  home: {
    hero: {
      badge: 'Trusted immigration counsel',
      primaryCta: 'Schedule a Consultation',
      secondaryCta: 'Our Services',
      confidential: 'Confidential consultations',
      imageAlt: 'Scales of justice and law books on a desk in a law office',
    },
    trust: {
      heading: 'Why clients reach out to us',
      items: [
        { title: 'English & Español', body: 'Speak with us in the language you are most comfortable with.' },
        { title: 'Confidential consultations', body: 'Your situation is discussed privately and respectfully.' },
        { title: 'In person or by video', body: 'Meet at our office or from home by video call.' },
        { title: 'Clear next steps', body: 'We explain your options in plain language.' },
      ],
    },
    services: {
      title: 'Immigration Services',
      subtitle: 'Comprehensive legal support across the full immigration journey.',
    },
    attorney: {
      eyebrow: 'Meet your attorney',
      title: 'Personal attention for every case',
      /* TODO(attorney): replace with the attorney's real biography, bar admissions and education. */
      bio: [
        'Our office helps individuals and families navigate complex immigration matters with compassion, precision and tenacity. Every case is treated with the personal attention it deserves.',
        '[Attorney biography pending — to be provided by the firm: education, bar admissions and practice focus.]',
      ],
      points: [
        'Bilingual service (English / Spanish)',
        'Transparent, flat-rate consultations',
        'In-person and virtual meetings available',
      ],
      cta: 'About the firm',
      imageAlt: 'Attorney reviewing documents with a client at a desk',
    },
    process: {
      title: 'How the process works',
      subtitle: 'A clear path from your first call to the next step in your case.',
      steps: [
        { title: 'Contact us', body: 'Call, email, or send the short form. Tell us briefly what kind of matter you need help with.' },
        { title: 'Consultation', body: 'Meet with the attorney in person or by video to discuss your situation and questions.' },
        { title: 'Review your options', body: 'We explain the options that may be available to you, the likely steps, and what documents are needed.' },
        { title: 'Move forward', body: 'If you decide to work with us, we prepare, file, and follow up while keeping you informed.' },
      ],
    },
    why: {
      title: 'Why choose our firm',
      subtitle: 'We know how much is at stake for you and your family.',
      items: [
        { title: 'Bilingual communication', body: 'Every conversation and document explanation is available in English or Spanish.' },
        { title: 'Careful preparation', body: 'Forms, evidence and filings are reviewed in detail before submission to reduce errors and delays.' },
        { title: 'Flexible meetings', body: 'Choose an in-person meeting at our office or a secure video consultation.' },
        { title: 'Honest guidance', body: 'We tell you what to expect, including the risks, so you can make informed decisions.' },
      ],
    },
    gallery: {
      title: 'Our Space & Team',
      subtitle: 'A welcoming office and a team ready to help.',
      slides: [
        { caption: 'Our team, by your side.', alt: 'Two professionals shaking hands across a desk' },
        { caption: 'A welcoming space for every client.', alt: 'Bright office meeting room with a table and chairs' },
        { caption: 'Guidance you can trust.', alt: 'Person signing documents at a desk' },
      ],
      previous: 'Previous slide',
      next: 'Next slide',
      pause: 'Pause slideshow',
      play: 'Play slideshow',
      slideOf: 'Slide {n} of {total}',
    },
    testimonials: {
      title: 'What clients say',
      /* TODO(attorney): replace with real, permission-granted client testimonials or remove this section.
         Many state bar rules restrict testimonials in attorney advertising. */
      items: [
        { name: 'Maria G.', quote: 'They handled my work permit case with patience and clarity. I always knew what was happening.' },
        { name: 'David K.', quote: 'Professional and human. They treated my case like it mattered — because to me, it does.' },
        { name: 'Aisha R.', quote: 'Booking, consultations, follow-ups — everything was easy. Highly recommend.' },
      ],
      note: 'Testimonials reflect individual experiences. Results depend on the facts of each case and are not guaranteed.',
    },
    faq: {
      title: 'Common questions',
      subtitle: 'Quick answers before you reach out.',
      viewAll: 'See all FAQs',
    },
    cta: {
      title: 'Ready to take the first step?',
      body: 'Request a consultation in English or Spanish. We will contact you to confirm a time.',
      button: 'Schedule a Consultation',
    },
    contact: {
      title: 'Contact',
      subtitle: 'Reach out by phone or email, or send us a short message.',
    },
  },

  about: {
    title: 'About the Firm',
    intro:
      'We are an immigration law office dedicated to helping individuals and families understand their options and move forward with confidence.',
    sections: [
      {
        heading: 'Our approach',
        body: [
          'Immigration matters affect every part of a person’s life. We take time to listen, explain the process in plain language, and prepare each filing carefully.',
          'We communicate in English and Spanish and offer both in-person and virtual meetings, so you can work with us in the way that suits you.',
        ],
      },
      {
        heading: 'Our attorney',
        /* TODO(attorney): replace with real biography and credentials. */
        body: ['[Attorney biography pending — to be provided by the firm: education, bar admissions, professional memberships and practice focus.]'],
      },
      {
        heading: 'What to expect',
        body: [
          'Your first step is a consultation, where the attorney reviews your situation and explains the options that may be available. There is no obligation to hire the firm after a consultation.',
          'An attorney-client relationship is only formed after both you and the firm sign a written engagement agreement.',
        ],
      },
    ],
  },

  servicesIndex: {
    title: 'Immigration Services',
    intro:
      'We assist individuals and families with a range of immigration matters. Choose a service below to learn how the process generally works and how we can help.',
  },

  resources: {
    title: 'Immigration Resources',
    intro:
      'These official government resources can help you check case status, find forms, and learn more. This page is for general information only.',
    officialHeading: 'Official government resources',
    links: [
      { title: 'USCIS — U.S. Citizenship and Immigration Services', body: 'Forms, filing instructions, and general information about immigration benefits.', href: 'https://www.uscis.gov/' },
      { title: 'USCIS Case Status Online', body: 'Check the status of a pending application using your receipt number.', href: 'https://egov.uscis.gov/' },
      { title: 'EOIR — Immigration Court', body: 'Information about immigration court, hearings, and automated case information.', href: 'https://www.justice.gov/eoir' },
      { title: 'U.S. Department of State — Visas', body: 'Visa information, the monthly Visa Bulletin, and consular processing.', href: 'https://travel.state.gov/content/travel/en/us-visas.html' },
      { title: 'ICE Online Detainee Locator', body: 'Locate a person who is currently in immigration detention.', href: 'https://locator.ice.gov/' },
    ],
    prepareHeading: 'What to bring to your consultation',
    checklist: [
      'Passport and any other identity documents',
      'Any notices, receipts, or letters from USCIS, the immigration court, or other agencies',
      'Copies of any applications or petitions filed in the past',
      'Records of entries to and departures from the United States, if available',
      'Any arrest or court records, if applicable',
      'A list of your questions',
    ],
    scamsHeading: 'Protect yourself from immigration scams',
    scamsBody:
      'Only licensed attorneys and accredited representatives may give immigration legal advice. “Notarios” and immigration consultants are not authorized to represent you. Learn more on the USCIS “Avoid Scams” page.',
    scamsLink: { label: 'USCIS: Avoid Scams', href: 'https://www.uscis.gov/scams-fraud-and-misconduct/avoid-scams' },
    externalNote: '(opens official website in a new tab)',
  },

  faqPage: {
    title: 'Frequently Asked Questions',
    intro: 'General answers to common questions. For advice about your specific situation, please schedule a consultation.',
    generalHeading: 'About consultations',
    byServiceHeading: 'Questions by service',
  },

  generalFaqs: [
    {
      q: 'Do you offer consultations in Spanish?',
      a: 'Yes. We serve clients in English and Spanish, including consultations, document explanations, and follow-up communication.',
    },
    {
      q: 'Can I meet with the attorney by video?',
      a: 'Yes. Consultations are available in person at our office or by video call, depending on your preference.',
    },
    {
      q: 'What should I bring to my consultation?',
      a: 'Bring identity documents, any notices or letters from immigration agencies or the court, and copies of anything you have filed before. Our Resources page has a full checklist.',
    },
    {
      q: 'Does contacting the firm make me a client?',
      a: 'No. Contacting us or submitting the form does not create an attorney-client relationship. That relationship begins only after a written engagement agreement is signed.',
    },
    {
      q: 'Can you guarantee the result of my case?',
      a: 'No attorney can guarantee a result. Immigration decisions are made by government agencies and courts, and every case depends on its own facts.',
    },
  ],

  contactPage: {
    title: 'Contact Us',
    intro:
      'Tell us briefly how we can help and we will contact you to schedule a consultation. You can also call or email us directly.',
    officeHeading: 'Office information',
    formHeading: 'Request a consultation',
  },

  form: {
    requiredNote: 'Fields marked with * are required.',
    fullName: 'Full name',
    email: 'Email',
    phone: 'Phone',
    phoneHint: 'Optional',
    preferredLanguage: 'Preferred language',
    languages: { en: 'English', es: 'Spanish' },
    matter: 'Immigration matter',
    matterPlaceholder: 'Select a matter',
    matterOther: 'Other / not sure',
    contactMethod: 'Preferred contact method',
    contactMethods: { email: 'Email', phone: 'Phone' },
    message: 'Short message',
    messageHint: 'Briefly describe how we can help. Please do not include confidential details.',
    consent:
      'I understand that submitting this form does not create an attorney-client relationship and that I should not include confidential or highly sensitive information.',
    submit: 'Send request',
    submitting: 'Sending…',
    errorSummary: 'Please correct the highlighted fields.',
    errors: {
      nameRequired: 'Please enter your full name.',
      emailRequired: 'Please enter your email address.',
      emailInvalid: 'Please enter a valid email address.',
      phoneInvalid: 'Please enter a valid phone number.',
      phoneRequiredForCall: 'Please enter a phone number if you prefer to be contacted by phone.',
      matterRequired: 'Please select an immigration matter.',
      messageTooLong: 'Please keep your message under {max} characters.',
      consentRequired: 'Please confirm that you have read the notice above.',
      server: 'We could not send your request. Please try again or call us.',
    },
    disclaimerTitle: 'Important notice',
    /* TODO(attorney): review and finalize this wording. */
    disclaimer: [
      'Submitting this form does not create an attorney-client relationship. An attorney-client relationship is formed only after a written engagement agreement is signed.',
      'Please do not send confidential or highly sensitive information (such as immigration history details, criminal records, or identification numbers) through this form.',
    ],
  },

  thankYou: {
    title: 'Thank you — we received your request',
    body: 'We will contact you using your preferred method to schedule a consultation. If your matter is urgent, please call our office.',
    back: 'Back to home',
  },

  footer: {
    navHeading: 'Navigation',
    servicesHeading: 'Services',
    legalHeading: 'Legal',
    contactHeading: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    disclaimer: 'Legal Disclaimer',
    accessibility: 'Accessibility',
    rights: 'All rights reserved.',
    attorneyAdvertising: 'Attorney Advertising.',
    /* TODO(attorney): review and finalize this wording. */
    notice:
      'The information on this website is for general information only and is not legal advice. Contacting the firm does not create an attorney-client relationship. Prior results do not guarantee a similar outcome.',
    barPrefix: 'Licensed:',
  },
};

export default en;
export type Dictionary = typeof en;
