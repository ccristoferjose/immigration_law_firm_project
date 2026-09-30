import type { Dictionary } from './en';

/** Spanish UI strings and page copy. Must mirror en.ts. */
const es: Dictionary = {
  meta: {
    home: {
      title: 'Abogada de Inmigración en Commerce, CA | Área de Los Ángeles',
      description:
        'Servicios legales de inmigración en español para familias del área de Los Ángeles: residencia, ciudadanía, visas, permisos de trabajo y defensa contra deportación.',
    },
    about: {
      title: 'Sobre Nuestra Oficina de Inmigración',
      description:
        'Conozca nuestra firma de inmigración en Commerce, CA, a nuestra abogada y cómo apoyamos a nuestros clientes en español e inglés, en persona o por video.',
    },
    services: {
      title: 'Servicios de Inmigración',
      description:
        'Conozca los asuntos de inmigración que atendemos: peticiones familiares, residencia permanente, ciudadanía, visas, permisos de trabajo y defensa contra deportación.',
    },
    resources: {
      title: 'Recursos de Inmigración y Enlaces Oficiales',
      description:
        'Recursos oficiales de inmigración, herramientas para consultar el estado de su caso y una lista de lo que debe traer a su consulta de inmigración.',
    },
    faq: {
      title: 'Preguntas Frecuentes sobre Inmigración',
      description:
        'Respuestas a preguntas comunes sobre consultas de inmigración, idiomas, reuniones virtuales y los asuntos de inmigración que atendemos.',
    },
    contact: {
      title: 'Contáctenos y Programe una Consulta',
      description:
        'Llame al (213) 221-5099, use nuestro formulario en línea o visítenos en Commerce, CA, para solicitar una consulta de inmigración en español o inglés.',
    },
    thankYou: {
      title: 'Gracias',
      description: 'Hemos recibido su mensaje.',
    },
  },

  nav: {
    label: 'Navegación principal',
    home: 'Inicio',
    about: 'Nosotros',
    services: 'Servicios de Inmigración',
    resources: 'Recursos',
    faq: 'Preguntas Frecuentes',
    contact: 'Contacto',
    schedule: 'Programar Consulta',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    skipToContent: 'Saltar al contenido principal',
    languageLabel: 'Idioma',
    homeLink: 'página de inicio',
  },

  common: {
    attorneysAtLaw: 'Derecho de Inmigración',
    learnMore: 'Más información',
    learnMoreAbout: 'Más información sobre',
    scheduleConsultation: 'Programar una Consulta',
    ourServices: 'Nuestros Servicios',
    viewAllServices: 'Ver todos los servicios',
    call: 'Llamar',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    address: 'Dirección',
    officeHours: 'Horario de oficina',
    breadcrumb: 'Ruta de navegación',
    overviewHeading: 'Información general',
    helpWithHeading: 'Cómo podemos ayudarle',
    processHeading: 'Cómo funciona el proceso',
    faqHeading: 'Preguntas frecuentes',
    relatedServices: 'Otros servicios de inmigración',
    noGuarantee:
      'Cada caso es diferente. Esta página ofrece información general, no asesoría legal, y no se puede garantizar ningún resultado en particular.',
    draftNotice:
      'Borrador — esta página está pendiente de revisión por la abogada y puede cambiar.',
    servicesCarousel: {
      list: 'Elija un servicio',
      previous: 'Servicio anterior',
      next: 'Servicio siguiente',
      position: 'Servicio {n} de {total}',
    },
    mapTitle: 'Mapa con la ubicación de nuestra oficina en Commerce, CA',
    getDirections: 'Obtener indicaciones',
    opensNewTab: '(se abre en una pestaña nueva)',
  },

  home: {
    hero: {
      badge: 'Licencia en California desde 2010',
      primaryCta: 'Programar una Consulta',
      secondaryCta: 'Nuestros Servicios',
      confidential: 'Consultas confidenciales',
      imageAlt: 'Balanza de la justicia y libros de derecho sobre un escritorio en una oficina legal',
    },
    trust: {
      heading: 'Por qué nuestros clientes nos contactan',
      items: [
        { title: 'Atención en español', body: 'Nuestra abogada y nuestro personal hablan español. También atendemos en inglés.' },
        { title: 'Más de 15 años con licencia', body: 'Licencia activa ante el Colegio de Abogados de California desde 2010.' },
        { title: 'En persona o por video', body: 'Reúnase en nuestra oficina o desde su casa por videollamada.' },
        { title: 'Próximos pasos claros', body: 'Le explicamos sus opciones en un lenguaje sencillo.' },
      ],
    },
    services: {
      title: 'Servicios de Inmigración',
      subtitle: 'Apoyo legal integral en todo su proceso migratorio.',
    },
    attorney: {
      eyebrow: 'Conozca a su abogada',
      title: 'Atención personal en cada caso',
      bio: [
        'Nuestra firma ayuda a personas y familias de todo el área metropolitana de Los Ángeles a enfrentar asuntos migratorios con compasión, precisión y tenacidad. Cada caso recibe la atención personal que merece.',
        'Nuestra abogada tiene licencia activa en California desde 2010 y enfoca su práctica en el derecho de inmigración, con experiencia adicional en derecho familiar, derecho administrativo y contratos. Atiende a sus clientes directamente en español, al igual que nuestro personal.',
      ],
      points: [
        'Abogada y personal de habla hispana',
        'Más de 15 años con licencia en California',
        'Reuniones en nuestra oficina de Commerce o por video',
      ],
      cta: 'Sobre la firma',
      imageAlt: 'Manos revisando documentos junto a una computadora portátil en un escritorio',
    },
    process: {
      title: 'Cómo funciona el proceso',
      subtitle: 'Un camino claro desde su primera llamada hasta el siguiente paso en su caso.',
      steps: [
        { title: 'Contáctenos', body: 'Llame, escriba un correo o envíe el formulario breve. Indíquenos qué tipo de asunto necesita resolver.' },
        { title: 'Consulta', body: 'Reúnase con la abogada en nuestra oficina de Commerce o por video para hablar sobre su situación y sus preguntas.' },
        { title: 'Revisión de opciones', body: 'Le explicamos las opciones que podrían estar disponibles, los pasos probables y los documentos necesarios.' },
        { title: 'Siguiente paso', body: 'Si decide trabajar con nosotros, preparamos, presentamos y damos seguimiento a su caso, manteniéndole informado.' },
      ],
    },
    why: {
      title: 'Por qué elegir nuestra firma',
      subtitle: 'Sabemos lo mucho que está en juego para usted y su familia.',
      items: [
        { title: 'Comunicación bilingüe', body: 'Cada conversación y explicación de documentos está disponible en español o inglés.' },
        { title: 'Preparación cuidadosa', body: 'Revisamos formularios, pruebas y trámites en detalle antes de presentarlos para reducir errores y demoras.' },
        { title: 'Reuniones flexibles', body: 'Visítenos en Commerce, a minutos del centro de Los Ángeles, o reúnase con nosotros desde casa por videollamada segura.' },
        { title: 'Orientación honesta', body: 'Le decimos qué esperar, incluidos los riesgos, para que tome decisiones informadas.' },
      ],
    },
    gallery: {
      title: 'Nuestro Compromiso',
      subtitle: 'Atención cercana, preparación cuidadosa y comunicación clara en cada etapa.',
      slides: [
        { caption: 'Le acompañamos en cada etapa.', alt: 'Dos personas dándose la mano sobre un escritorio' },
        { caption: 'Un proceso claro y ordenado.', alt: 'Sala de reuniones luminosa con mesa y sillas' },
        { caption: 'Cada documento, revisado con cuidado.', alt: 'Persona firmando documentos en un escritorio' },
      ],
      previous: 'Diapositiva anterior',
      next: 'Diapositiva siguiente',
      pause: 'Pausar presentación',
      play: 'Reproducir presentación',
      slideOf: 'Diapositiva {n} de {total}',
    },
    faq: {
      title: 'Preguntas comunes',
      subtitle: 'Respuestas rápidas antes de contactarnos.',
      viewAll: 'Ver todas las preguntas',
    },
    cta: {
      title: 'Programe su consulta',
      body: 'Solicite una consulta en español o inglés. Nos comunicaremos con usted para confirmar un horario.',
      button: 'Programar una Consulta',
    },
    contact: {
      title: 'Contacto',
      subtitle: 'Llámenos o visítenos en nuestra oficina en Commerce. Atendemos a clientes de todo el área metropolitana de Los Ángeles.',
    },
  },

  about: {
    title: 'Sobre la Firma',
    intro:
      'FarFan Law Firm es una firma de derecho migratorio en Commerce, California, dedicada a ayudar a personas y familias del área metropolitana de Los Ángeles a entender sus opciones y seguir adelante con confianza.',
    sections: [
      {
        heading: 'Nuestro enfoque',
        body: [
          'Los asuntos migratorios afectan todos los aspectos de la vida de una persona. Nos tomamos el tiempo para escuchar, explicar el proceso en un lenguaje sencillo y preparar cada trámite con cuidado.',
          'Nos comunicamos en español e inglés y ofrecemos reuniones en persona y virtuales, para que pueda trabajar con nosotros de la forma que más le convenga.',
        ],
      },
      {
        heading: 'Nuestra abogada',
        body: [
          'Nuestra abogada tiene licencia activa ante el Colegio de Abogados de California desde 2010. Su práctica se enfoca en el derecho de inmigración, con experiencia adicional en derecho familiar, derecho administrativo y contratos.',
          'Habla español con sus clientes, al igual que nuestro personal, para que cada explicación, documento y conversación sea clara desde el primer día.',
        ],
      },
      {
        heading: 'Qué puede esperar',
        body: [
          'El primer paso es una consulta, en la que la abogada revisa su situación y le explica las opciones que podrían estar disponibles. No tiene ninguna obligación de contratar a la firma después de la consulta.',
          'La relación abogado-cliente solo se establece después de que usted y la firma firmen un acuerdo de representación por escrito.',
        ],
      },
    ],
  },

  servicesIndex: {
    title: 'Servicios de Inmigración',
    intro:
      'Ayudamos a personas y familias con diversos asuntos migratorios. Elija un servicio para conocer cómo funciona el proceso en general y cómo podemos ayudarle.',
  },

  resources: {
    title: 'Recursos de Inmigración',
    intro:
      'Estos recursos oficiales del gobierno le pueden ayudar a consultar el estado de su caso, encontrar formularios y obtener más información. Esta página es solo informativa.',
    officialHeading: 'Recursos oficiales del gobierno',
    links: [
      { title: 'USCIS — Servicio de Ciudadanía e Inmigración de EE. UU.', body: 'Formularios, instrucciones de presentación e información general sobre beneficios migratorios.', href: 'https://www.uscis.gov/es' },
      { title: 'Estado de casos en línea de USCIS', body: 'Consulte el estado de una solicitud pendiente con su número de recibo.', href: 'https://egov.uscis.gov/' },
      { title: 'EOIR — Corte de Inmigración', body: 'Información sobre la corte de inmigración, audiencias e información automatizada de casos.', href: 'https://www.justice.gov/eoir' },
      { title: 'Departamento de Estado de EE. UU. — Visas', body: 'Información sobre visas, el Boletín de Visas mensual y el proceso consular.', href: 'https://travel.state.gov/content/travel/en/us-visas.html' },
      { title: 'Localizador de detenidos de ICE', body: 'Localice a una persona que se encuentra bajo detención migratoria.', href: 'https://locator.ice.gov/' },
    ],
    prepareHeading: 'Qué traer a su consulta',
    checklist: [
      'Pasaporte y otros documentos de identidad',
      'Avisos, recibos o cartas de USCIS, la corte de inmigración u otras agencias',
      'Copias de solicitudes o peticiones presentadas anteriormente',
      'Registros de entradas y salidas de los Estados Unidos, si los tiene',
      'Registros de arrestos o de la corte, si corresponde',
      'Una lista de sus preguntas',
    ],
    scamsHeading: 'Protéjase de los fraudes migratorios',
    scamsBody:
      'Solo los abogados con licencia y los representantes acreditados pueden dar asesoría legal de inmigración. Los “notarios” y los consultores de inmigración no están autorizados para representarle. Obtenga más información en la página de USCIS sobre cómo evitar estafas.',
    scamsLink: { label: 'USCIS: Evite las estafas', href: 'https://www.uscis.gov/es/evite-las-estafas' },
    externalNote: '(abre el sitio web oficial en una pestaña nueva)',
  },

  faqPage: {
    title: 'Preguntas Frecuentes',
    intro: 'Respuestas generales a preguntas comunes. Para recibir asesoría sobre su situación específica, programe una consulta.',
    generalHeading: 'Sobre las consultas',
    byServiceHeading: 'Preguntas por servicio',
  },

  generalFaqs: [
    {
      q: '¿Ofrecen consultas en español?',
      a: 'Sí. Atendemos a nuestros clientes en español e inglés, incluidas las consultas, la explicación de documentos y la comunicación de seguimiento.',
    },
    {
      q: '¿Puedo reunirme con la abogada por video?',
      a: 'Sí. Las consultas están disponibles en persona en nuestra oficina o por videollamada, según su preferencia.',
    },
    {
      q: '¿Dónde está su oficina?',
      a: 'Nuestra oficina está en 5800 S Eastern Ave, Suite 500, Commerce, CA 90040. Atendemos a clientes de todo el área metropolitana de Los Ángeles, en persona o por video.',
    },
    {
      q: '¿Qué debo traer a mi consulta?',
      a: 'Traiga sus documentos de identidad, los avisos o cartas de agencias de inmigración o de la corte y copias de todo lo que haya presentado antes. Nuestra página de Recursos tiene una lista completa.',
    },
    {
      q: '¿Contactar a la firma me convierte en cliente?',
      a: 'No. Contactarnos o enviar el formulario no crea una relación abogado-cliente. Esa relación comienza solo después de firmar un acuerdo de representación por escrito.',
    },
    {
      q: '¿Pueden garantizar el resultado de mi caso?',
      a: 'Ningún abogado puede garantizar un resultado. Las decisiones migratorias las toman las agencias del gobierno y las cortes, y cada caso depende de sus propios hechos.',
    },
  ],

  contactPage: {
    title: 'Contáctenos',
    intro:
      'Cuéntenos brevemente cómo podemos ayudarle y nos comunicaremos con usted para programar una consulta. También puede llamarnos directamente al (213) 221-5099.',
    officeHeading: 'Información de la oficina',
    formHeading: 'Solicitar una consulta',
    mapHeading: 'Cómo llegar a nuestra oficina',
  },

  form: {
    requiredNote: 'Los campos marcados con * son obligatorios.',
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    phoneHint: 'Opcional',
    preferredLanguage: 'Idioma preferido',
    languages: { en: 'Inglés', es: 'Español' },
    matter: 'Asunto de inmigración',
    matterPlaceholder: 'Seleccione un asunto',
    matterOther: 'Otro / no estoy seguro',
    contactMethod: 'Método de contacto preferido',
    contactMethods: { email: 'Correo electrónico', phone: 'Teléfono' },
    message: 'Mensaje breve',
    messageHint: 'Describa brevemente cómo podemos ayudarle. Por favor, no incluya detalles confidenciales.',
    consent:
      'Entiendo que enviar este formulario no crea una relación abogado-cliente y que no debo incluir información confidencial o altamente sensible.',
    submit: 'Enviar solicitud',
    submitting: 'Enviando…',
    errorSummary: 'Por favor, corrija los campos señalados.',
    errors: {
      nameRequired: 'Por favor, escriba su nombre completo.',
      emailRequired: 'Por favor, escriba su correo electrónico.',
      emailInvalid: 'Por favor, escriba un correo electrónico válido.',
      phoneInvalid: 'Por favor, escriba un número de teléfono válido.',
      phoneRequiredForCall: 'Por favor, escriba un número de teléfono si prefiere que le llamemos.',
      matterRequired: 'Por favor, seleccione un asunto de inmigración.',
      messageTooLong: 'Por favor, escriba un mensaje de menos de {max} caracteres.',
      consentRequired: 'Por favor, confirme que leyó el aviso anterior.',
      server: 'No pudimos enviar su solicitud. Inténtelo de nuevo o llámenos.',
      rateLimited: 'Recibimos varias solicitudes desde su conexión. Espere unos minutos e inténtelo de nuevo, o llámenos al (213) 221-5099.',
    },
    disclaimerTitle: 'Aviso importante',
    disclaimer: [
      'Enviar este formulario no crea una relación abogado-cliente. La relación abogado-cliente se establece solo después de firmar un acuerdo de representación por escrito.',
      'Por favor, no envíe información confidencial o altamente sensible (como detalles de su historial migratorio, antecedentes penales o números de identificación) por medio de este formulario.',
    ],
  },

  thankYou: {
    title: 'Gracias — recibimos su solicitud',
    body: 'Nos comunicaremos con usted por el medio que prefiera para programar una consulta. Si su asunto es urgente, llame a nuestra oficina.',
    back: 'Volver al inicio',
  },

  footer: {
    navHeading: 'Navegación',
    servicesHeading: 'Servicios',
    legalHeading: 'Legal',
    contactHeading: 'Contacto',
    privacy: 'Política de Privacidad',
    terms: 'Términos de Uso',
    disclaimer: 'Aviso Legal',
    accessibility: 'Accesibilidad',
    rights: 'Todos los derechos reservados.',
    attorneyAdvertising: 'Publicidad de abogados.',
    notice:
      'La información de este sitio web es solo de carácter general y no constituye asesoría legal. Contactar a la firma no crea una relación abogado-cliente. Los resultados anteriores no garantizan un resultado similar.',
    barPrefix: 'Licencia:',
  },
};

export default es;
