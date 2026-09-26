import { Users, IdCard, Flag, Plane, Briefcase, Shield, HeartHandshake, FileSearch } from 'lucide-react';
import type { Service } from './types';
import type { ServiceId } from '@/lib/routes';

export const services: Service[] = [
  // ---------------------------------------------------------------------------
  // Family-based immigration
  // ---------------------------------------------------------------------------
  {
    id: 'family-immigration',
    icon: Users,
    en: {
      name: "Family Immigration",
      title: "Family-Based Immigration",
      metaTitle: "Family-Based Immigration & Family Petitions",
      metaDescription:
        "Guidance on family-based immigration petitions, including Form I-130, for U.S. citizens and permanent residents hoping to bring relatives to the United States.",
      summary:
        "Help with family petitions for U.S. citizens and permanent residents who hope to bring close relatives to the United States.",
      intro:
        "Keeping families together is at the heart of U.S. immigration law. If you are a U.S. citizen or lawful permanent resident, you may be able to petition for certain family members. We can review your situation, explain the options that may be available, and help you prepare a careful, well-organized petition.",
      overview: [
        "Family-based immigration usually begins with a petition, most often Form I-130, Petition for Alien Relative, filed with U.S. Citizenship and Immigration Services (USCIS). The petition asks the government to recognize the qualifying family relationship between the petitioner and the relative.",
        "Which relatives you may petition for, and how long the process may take, depends on whether you are a U.S. citizen or a permanent resident and on the relationship involved. Some categories are subject to annual limits, which can mean waiting periods that vary by category and country. Processing times are set by the government and change over time.",
        "Once a petition is approved, the relative may continue the process either by applying to adjust status inside the United States or through consular processing abroad with the National Visa Center (NVC) and the Department of State. Which path may apply depends on each person's circumstances and immigration history.",
      ],
      helpWith: [
        "Petitions for spouses, children, parents, and siblings (Form I-130)",
        "Reviewing whether a family relationship may support a petition",
        "Gathering evidence of the relationship, such as birth and marriage records",
        "Next steps after approval, including adjustment of status or consular processing",
        "Responding to USCIS requests for evidence (RFEs)",
        "Preparing for interviews with USCIS or a U.S. consulate",
      ],
      process: [
        {
          title: "Consultation",
          body: "We listen to your family's story, learn about your goals, and review your immigration history and documents.",
        },
        {
          title: "Case review",
          body: "An attorney reviews the options that may be available depending on your circumstances and explains possible next steps in plain language.",
        },
        {
          title: "Preparation and filing",
          body: "We help you gather evidence, complete the required forms carefully, and assemble an organized filing.",
        },
        {
          title: "Follow-up",
          body: "We help you understand government notices, respond to requests for evidence, and prepare for interviews as your case moves forward.",
        },
      ],
      faqs: [
        {
          q: "Which family members can I petition for?",
          a: "It depends on your status. U.S. citizens may be able to petition for spouses, children, parents, and siblings, while permanent residents may petition for a more limited group of relatives. An attorney can review your specific relationship and situation.",
        },
        {
          q: "How long does a family petition take?",
          a: "Processing times vary and are set by the government. Some categories also have waiting periods based on annual limits, the relative's country of birth, and other factors. We can explain what may affect timing in your case.",
        },
        {
          q: "Can my relative stay in the United States while the case is pending?",
          a: "That depends on your relative's current status, how they entered, and their immigration history. Some people may be able to adjust status inside the U.S., while others may need to complete the process abroad. An attorney can review the details.",
        },
      ],
    },
    es: {
      name: "Inmigración familiar",
      title: "Inmigración basada en la familia",
      metaTitle: "Inmigración familiar y peticiones familiares",
      metaDescription:
        "Orientación sobre peticiones familiares de inmigración, incluido el Formulario I-130, para ciudadanos y residentes permanentes que desean traer a familiares.",
      summary:
        "Ayuda con peticiones familiares para ciudadanos estadounidenses y residentes permanentes que desean reunirse con sus seres queridos en los Estados Unidos.",
      intro:
        "Mantener a las familias unidas es uno de los pilares de la ley de inmigración de los Estados Unidos. Si usted es ciudadano estadounidense o residente permanente legal, es posible que pueda presentar una petición para ciertos familiares. Podemos revisar su situación, explicarle las opciones que podrían estar disponibles y ayudarle a preparar una petición cuidadosa y bien organizada.",
      overview: [
        "La inmigración basada en la familia normalmente comienza con una petición, por lo general el Formulario I-130, Petición de Familiar Extranjero, que se presenta ante el Servicio de Ciudadanía e Inmigración de los Estados Unidos (USCIS). Con esta petición se solicita al gobierno que reconozca el parentesco entre el peticionario y su familiar.",
        "Los familiares por los que usted puede presentar una petición, y el tiempo que puede tardar el proceso, dependen de si usted es ciudadano o residente permanente y del tipo de parentesco. Algunas categorías tienen límites anuales, lo que puede significar periodos de espera que varían según la categoría y el país. Los tiempos de trámite los fija el gobierno y cambian con el tiempo.",
        "Una vez aprobada la petición, el familiar puede continuar el proceso solicitando un ajuste de estatus dentro de los Estados Unidos o mediante el trámite consular en el extranjero, con el Centro Nacional de Visas (NVC) y el Departamento de Estado. El camino que corresponda dependerá de las circunstancias y del historial migratorio de cada persona.",
      ],
      helpWith: [
        "Peticiones para cónyuges, hijos, padres y hermanos (Formulario I-130)",
        "Revisar si un parentesco podría respaldar una petición",
        "Reunir pruebas del parentesco, como actas de nacimiento y de matrimonio",
        "Pasos posteriores a la aprobación, como el ajuste de estatus o el trámite consular",
        "Responder a solicitudes de evidencia (RFE) de USCIS",
        "Prepararse para entrevistas con USCIS o en un consulado de los Estados Unidos",
      ],
      process: [
        {
          title: "Consulta",
          body: "Escuchamos la historia de su familia, conocemos sus metas y revisamos su historial migratorio y sus documentos.",
        },
        {
          title: "Revisión del caso",
          body: "Un abogado analiza las opciones que podrían estar disponibles según sus circunstancias y le explica los posibles próximos pasos en palabras sencillas.",
        },
        {
          title: "Preparación y presentación",
          body: "Le ayudamos a reunir las pruebas, llenar con cuidado los formularios necesarios y armar una solicitud ordenada.",
        },
        {
          title: "Seguimiento",
          body: "Le ayudamos a entender los avisos del gobierno, responder a solicitudes de evidencia y prepararse para las entrevistas a medida que avanza su caso.",
        },
      ],
      faqs: [
        {
          q: "¿Por cuáles familiares puedo presentar una petición?",
          a: "Depende de su estatus. Los ciudadanos estadounidenses pueden pedir a cónyuges, hijos, padres y hermanos, mientras que los residentes permanentes pueden pedir a un grupo más limitado de familiares. Un abogado puede revisar su parentesco y su situación en particular.",
        },
        {
          q: "¿Cuánto tarda una petición familiar?",
          a: "Los tiempos de trámite varían y los fija el gobierno. Algunas categorías también tienen periodos de espera según los límites anuales, el país de nacimiento del familiar y otros factores. Podemos explicarle qué podría influir en los tiempos de su caso.",
        },
        {
          q: "¿Mi familiar puede quedarse en los Estados Unidos mientras se tramita el caso?",
          a: "Eso depende del estatus actual de su familiar, de cómo ingresó al país y de su historial migratorio. Algunas personas podrían ajustar su estatus dentro de los Estados Unidos, mientras que otras tendrían que completar el proceso en el extranjero. Un abogado puede revisar los detalles.",
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Green cards
  // ---------------------------------------------------------------------------
  {
    id: 'green-cards',
    icon: IdCard,
    en: {
      name: "Green Cards",
      title: "Green Cards & Permanent Residence",
      metaTitle: "Green Cards, Adjustment of Status & Renewals",
      metaDescription:
        "Help with green card applications, adjustment of status (Form I-485), consular processing, removing conditions, and renewing or replacing a green card.",
      summary:
        "Guidance through the green card process, from adjustment of status and consular processing to renewals and removing conditions.",
      intro:
        "A green card allows a person to live and work permanently in the United States. The path to permanent residence can involve many forms, deadlines, and supporting documents. We can review your circumstances, explain the options that may be available, and help you prepare a complete and organized application.",
      overview: [
        "Lawful permanent residence, commonly called a green card, may be available through several routes, including family relationships, certain employment categories, and some humanitarian programs. Each route has its own requirements, and whether a person may be eligible depends on their individual history.",
        "People who are already in the United States may be able to apply for adjustment of status using Form I-485 with USCIS. Others may need to complete consular processing through the National Visa Center and a U.S. embassy or consulate abroad, which typically involves Form DS-260 and an interview. Factors such as manner of entry, prior immigration violations, and criminal history can affect which path may apply.",
        "Some green cards are conditional and require a separate filing to remove conditions before they expire. Permanent residents also need to keep their cards current and may need to renew or replace them. Processing times vary and are set by the government.",
      ],
      helpWith: [
        "Adjustment of status applications (Form I-485)",
        "Consular processing through the NVC and U.S. consulates (Form DS-260)",
        "Removing conditions on residence (Form I-751)",
        "Renewing or replacing a green card (Form I-90)",
        "Related work and travel permit applications filed with a green card case",
        "Interview preparation and responses to requests for evidence",
      ],
      process: [
        {
          title: "Consultation",
          body: "We learn about your background, how you entered the United States, and your goals for permanent residence.",
        },
        {
          title: "Options review",
          body: "An attorney reviews which path may be available depending on your circumstances and flags issues that may need attention.",
        },
        {
          title: "Application preparation",
          body: "We help you complete the forms, gather civil documents and evidence, and organize a thorough filing.",
        },
        {
          title: "Interview and follow-up",
          body: "We help you prepare for interviews, understand notices, and respond to any requests from USCIS or the consulate.",
        },
      ],
      faqs: [
        {
          q: "What is the difference between adjustment of status and consular processing?",
          a: "Adjustment of status is completed inside the United States with USCIS. Consular processing is completed at a U.S. embassy or consulate abroad. Which one may apply depends on your situation, including how you entered the country and your immigration history.",
        },
        {
          q: "Can I work or travel while my green card application is pending?",
          a: "Some applicants may be able to request a work permit and advance travel permission while an adjustment application is pending. Traveling without the right permission can create serious problems, so it is important to speak with an attorney before making travel plans.",
        },
        {
          q: "My green card is expiring. What should I do?",
          a: "It depends on the type of card. A 10-year card is usually renewed with Form I-90, while a 2-year conditional card generally requires a filing to remove conditions. We can review your card and explain the next steps.",
        },
      ],
    },
    es: {
      name: "Residencia permanente",
      title: "Green card y residencia permanente",
      metaTitle: "Green card, ajuste de estatus y renovaciones",
      metaDescription:
        "Ayuda con solicitudes de green card, ajuste de estatus (I-485), trámite consular, eliminación de condiciones y renovación o reemplazo de la tarjeta.",
      summary:
        "Orientación durante el proceso de la green card, desde el ajuste de estatus y el trámite consular hasta renovaciones y eliminación de condiciones.",
      intro:
        "La green card, o tarjeta de residente permanente, permite a una persona vivir y trabajar de manera permanente en los Estados Unidos. El camino hacia la residencia puede incluir muchos formularios, plazos y documentos. Podemos revisar sus circunstancias, explicarle las opciones que podrían estar disponibles y ayudarle a preparar una solicitud completa y ordenada.",
      overview: [
        "La residencia permanente legal puede obtenerse por distintas vías, como el parentesco familiar, ciertas categorías de empleo y algunos programas humanitarios. Cada vía tiene sus propios requisitos, y que una persona pueda calificar depende de su historia individual.",
        "Las personas que ya se encuentran en los Estados Unidos podrían solicitar un ajuste de estatus con el Formulario I-485 ante USCIS. Otras tal vez tengan que completar el trámite consular a través del Centro Nacional de Visas y una embajada o consulado de los Estados Unidos en el extranjero, lo que normalmente incluye el Formulario DS-260 y una entrevista. Factores como la forma de ingreso, infracciones migratorias previas o antecedentes penales pueden influir en el camino que corresponda.",
        "Algunas green cards son condicionales y requieren una solicitud aparte para eliminar las condiciones antes de que venzan. Los residentes permanentes también deben mantener su tarjeta vigente y, en algunos casos, renovarla o reemplazarla. Los tiempos de trámite varían y los fija el gobierno.",
      ],
      helpWith: [
        "Solicitudes de ajuste de estatus (Formulario I-485)",
        "Trámite consular a través del NVC y los consulados (Formulario DS-260)",
        "Eliminación de condiciones de la residencia (Formulario I-751)",
        "Renovación o reemplazo de la green card (Formulario I-90)",
        "Solicitudes de permiso de trabajo y de viaje presentadas junto con el caso de residencia",
        "Preparación para entrevistas y respuestas a solicitudes de evidencia",
      ],
      process: [
        {
          title: "Consulta",
          body: "Conocemos sus antecedentes, cómo ingresó a los Estados Unidos y sus metas en cuanto a la residencia permanente.",
        },
        {
          title: "Revisión de opciones",
          body: "Un abogado analiza qué camino podría estar disponible según sus circunstancias y señala los asuntos que podrían requerir atención.",
        },
        {
          title: "Preparación de la solicitud",
          body: "Le ayudamos a llenar los formularios, reunir documentos civiles y pruebas, y armar una solicitud completa.",
        },
        {
          title: "Entrevista y seguimiento",
          body: "Le ayudamos a prepararse para las entrevistas, entender los avisos y responder a cualquier solicitud de USCIS o del consulado.",
        },
      ],
      faqs: [
        {
          q: "¿Cuál es la diferencia entre el ajuste de estatus y el trámite consular?",
          a: "El ajuste de estatus se realiza dentro de los Estados Unidos ante USCIS. El trámite consular se completa en una embajada o consulado de los Estados Unidos en el extranjero. Cuál corresponda depende de su situación, incluida la forma en que ingresó al país y su historial migratorio.",
        },
        {
          q: "¿Puedo trabajar o viajar mientras mi solicitud de residencia está pendiente?",
          a: "Algunos solicitantes pueden pedir un permiso de trabajo y un permiso de viaje por adelantado mientras su ajuste de estatus está pendiente. Viajar sin el permiso adecuado puede causar problemas graves, por lo que es importante hablar con un abogado antes de hacer planes de viaje.",
        },
        {
          q: "Mi green card está por vencer. ¿Qué debo hacer?",
          a: "Depende del tipo de tarjeta. Una tarjeta de 10 años normalmente se renueva con el Formulario I-90, mientras que una tarjeta condicional de 2 años por lo general requiere una solicitud para eliminar las condiciones. Podemos revisar su tarjeta y explicarle los próximos pasos.",
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Citizenship
  // ---------------------------------------------------------------------------
  {
    id: 'citizenship',
    icon: Flag,
    en: {
      name: "Citizenship",
      title: "Citizenship & Naturalization",
      metaTitle: "U.S. Citizenship & Naturalization (Form N-400)",
      metaDescription:
        "Guidance for permanent residents considering U.S. citizenship, including Form N-400 preparation, reviewing your history, and getting ready for the interview.",
      summary:
        "Support for permanent residents who are considering U.S. citizenship, from reviewing the N-400 to preparing for the interview.",
      intro:
        "Becoming a U.S. citizen is a meaningful step for many permanent residents and their families. Before applying, it is important to understand the requirements and review your history carefully. We can help you understand the process, identify issues that may need attention, and prepare your application with care.",
      overview: [
        "Naturalization is the process through which a lawful permanent resident may become a U.S. citizen. It generally involves filing Form N-400, Application for Naturalization, with USCIS, attending a biometrics appointment, and completing an interview that usually includes English and civics tests.",
        "General requirements include a period of permanent residence, continuous residence and physical presence in the United States, and good moral character. The specific requirements can depend on your situation, such as whether you are married to a U.S. citizen or have served in the military. Long trips abroad, past arrests, tax issues, or earlier immigration problems may affect an application and are worth reviewing with an attorney before filing.",
        "Some people may already be U.S. citizens through their parents and may not need to naturalize. Others may qualify for certain accommodations or exceptions to the English and civics requirements based on age, time as a resident, or a medical condition. Processing times vary and are set by the government.",
      ],
      helpWith: [
        "Reviewing your history before you apply for naturalization",
        "Preparing and filing Form N-400",
        "Reviewing travel history, prior arrests, and other potential concerns",
        "Requests for exceptions or accommodations, where they may apply",
        "Preparing for the naturalization interview and tests",
        "Questions about citizenship through a U.S. citizen parent",
      ],
      process: [
        {
          title: "Consultation",
          body: "We talk about your goals and review how long you have been a resident, your travel, and your background.",
        },
        {
          title: "History review",
          body: "An attorney reviews your records for issues that may affect an application and explains any concerns in plain language.",
        },
        {
          title: "Application",
          body: "We help you complete Form N-400 accurately, gather supporting documents, and prepare the filing.",
        },
        {
          title: "Interview preparation",
          body: "We help you understand what to expect at the interview and how to prepare for the English and civics tests.",
        },
      ],
      faqs: [
        {
          q: "When can I apply for citizenship?",
          a: "It depends on how long you have been a permanent resident, your time in the United States, and other factors, such as whether you are married to a U.S. citizen. USCIS publishes the general requirements, and an attorney can review how they may apply to you.",
        },
        {
          q: "Can a past arrest or long trip abroad affect my application?",
          a: "It may. Certain arrests, convictions, long absences, and other issues can affect naturalization and, in some cases, create other immigration risks. It is a good idea to have an attorney review your history before you file.",
        },
        {
          q: "What happens at the naturalization interview?",
          a: "A USCIS officer usually reviews your application with you under oath and gives the English and civics tests, unless an exception applies. We can help you understand what to expect and how to prepare.",
        },
      ],
    },
    es: {
      name: "Ciudadanía",
      title: "Ciudadanía y naturalización",
      metaTitle: "Ciudadanía estadounidense y naturalización (N-400)",
      metaDescription:
        "Orientación para residentes permanentes que desean la ciudadanía: preparación del Formulario N-400, revisión de su historial y preparación para la entrevista.",
      summary:
        "Apoyo para residentes permanentes que están considerando la ciudadanía, desde la revisión del N-400 hasta la preparación para la entrevista.",
      intro:
        "Hacerse ciudadano estadounidense es un paso muy significativo para muchos residentes permanentes y sus familias. Antes de presentar la solicitud, es importante entender los requisitos y revisar su historial con cuidado. Podemos ayudarle a comprender el proceso, identificar asuntos que podrían requerir atención y preparar su solicitud con esmero.",
      overview: [
        "La naturalización es el proceso mediante el cual un residente permanente legal puede convertirse en ciudadano de los Estados Unidos. Por lo general, incluye presentar el Formulario N-400, Solicitud de Naturalización, ante USCIS, asistir a una cita de datos biométricos y completar una entrevista que normalmente incluye exámenes de inglés y de educación cívica.",
        "Entre los requisitos generales están un periodo de residencia permanente, residencia continua y presencia física en los Estados Unidos, y buen carácter moral. Los requisitos específicos pueden variar según su situación, por ejemplo, si está casado con un ciudadano estadounidense o si ha servido en las fuerzas armadas. Viajes largos al extranjero, arrestos anteriores, asuntos de impuestos o problemas migratorios previos podrían afectar una solicitud, y conviene revisarlos con un abogado antes de presentarla.",
        "Algunas personas ya podrían ser ciudadanas a través de sus padres y quizás no necesiten naturalizarse. Otras podrían tener derecho a ciertas adaptaciones o excepciones a los requisitos de inglés y educación cívica por su edad, sus años como residente o una condición médica. Los tiempos de trámite varían y los fija el gobierno.",
      ],
      helpWith: [
        "Revisión de su historial antes de solicitar la naturalización",
        "Preparación y presentación del Formulario N-400",
        "Revisión de viajes, arrestos previos y otros posibles asuntos de preocupación",
        "Solicitudes de excepciones o adaptaciones, cuando podrían aplicar",
        "Preparación para la entrevista y los exámenes de naturalización",
        "Preguntas sobre la ciudadanía a través de un padre o madre ciudadano",
      ],
      process: [
        {
          title: "Consulta",
          body: "Hablamos sobre sus metas y revisamos cuánto tiempo lleva como residente, sus viajes y sus antecedentes.",
        },
        {
          title: "Revisión del historial",
          body: "Un abogado revisa sus registros para detectar asuntos que podrían afectar la solicitud y le explica cualquier inquietud en palabras sencillas.",
        },
        {
          title: "Solicitud",
          body: "Le ayudamos a llenar el Formulario N-400 con precisión, reunir los documentos de apoyo y preparar la solicitud.",
        },
        {
          title: "Preparación para la entrevista",
          body: "Le ayudamos a saber qué esperar en la entrevista y cómo prepararse para los exámenes de inglés y educación cívica.",
        },
      ],
      faqs: [
        {
          q: "¿Cuándo puedo solicitar la ciudadanía?",
          a: "Depende de cuánto tiempo lleva como residente permanente, del tiempo que ha pasado en los Estados Unidos y de otros factores, como si está casado con un ciudadano estadounidense. USCIS publica los requisitos generales, y un abogado puede revisar cómo podrían aplicarse en su caso.",
        },
        {
          q: "¿Un arresto anterior o un viaje largo pueden afectar mi solicitud?",
          a: "Es posible. Ciertos arrestos, condenas, ausencias prolongadas y otros asuntos pueden afectar la naturalización y, en algunos casos, generar otros riesgos migratorios. Es recomendable que un abogado revise su historial antes de presentar la solicitud.",
        },
        {
          q: "¿Qué pasa en la entrevista de naturalización?",
          a: "Normalmente, un oficial de USCIS repasa su solicitud con usted bajo juramento y le hace los exámenes de inglés y educación cívica, a menos que aplique una excepción. Podemos ayudarle a saber qué esperar y cómo prepararse.",
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Visas
  // ---------------------------------------------------------------------------
  {
    id: 'visas',
    icon: Plane,
    en: {
      name: "Visas",
      title: "Visas",
      metaTitle: "U.S. Visa Guidance: Immigrant & Nonimmigrant Visas",
      metaDescription:
        "Guidance on U.S. immigrant and nonimmigrant visas, including visa applications, consular processing, extensions, and changes of status for you and your family.",
      summary:
        "Guidance on temporary and immigrant visas, consular processing, and extensions or changes of status.",
      intro:
        "Whether you hope to visit, study, work, or join family in the United States, the right visa depends on your purpose and your personal circumstances. We can help you understand the options that may be available, prepare your application, and get ready for what comes next.",
      overview: [
        "U.S. visas generally fall into two groups. Nonimmigrant visas are for temporary stays, such as visiting, studying, or certain types of work. Immigrant visas are for people who intend to live permanently in the United States, often based on a family relationship or employment.",
        "Visa applications from abroad are usually handled by the Department of State at a U.S. embassy or consulate, and often require an online application such as Form DS-160 or DS-260 and an interview. People already in the United States in a lawful status may, in some cases, be able to ask USCIS to extend or change their status. Admission at the border is decided by U.S. Customs and Border Protection (CBP).",
        "Each visa category has its own requirements, and consular officers have broad discretion. Past immigration violations, prior visa denials, and other factors can affect an application. Processing times and appointment availability vary and are set by the government.",
      ],
      helpWith: [
        "Understanding which visa categories may fit your purpose",
        "Immigrant visa applications and consular processing (Form DS-260)",
        "Nonimmigrant visa applications (Form DS-160)",
        "Extensions and changes of nonimmigrant status",
        "Preparing for consular interviews",
        "Reviewing prior visa denials and next steps",
      ],
      process: [
        {
          title: "Consultation",
          body: "We learn why you want to come to or remain in the United States and review your background and prior travel.",
        },
        {
          title: "Options review",
          body: "An attorney explains which visa categories may be available depending on your circumstances and what each may require.",
        },
        {
          title: "Application preparation",
          body: "We help you complete forms accurately and organize supporting documents for USCIS or the consulate.",
        },
        {
          title: "Interview and next steps",
          body: "We help you prepare for your interview and understand any follow-up requests or decisions.",
        },
      ],
      faqs: [
        {
          q: "What is the difference between an immigrant and a nonimmigrant visa?",
          a: "A nonimmigrant visa is for a temporary purpose, such as tourism, study, or certain work. An immigrant visa is for people who plan to live permanently in the United States. The right option depends on your goals and circumstances.",
        },
        {
          q: "My visa was denied. Can I apply again?",
          a: "In many cases, a person may reapply, but it depends on the reason for the denial. Some denials relate to issues that must be addressed before a new application. An attorney can review the denial and explain possible next steps.",
        },
        {
          q: "Does having a visa guarantee entry into the United States?",
          a: "No. A visa allows a person to travel to a U.S. port of entry and request admission, but the final decision is made by U.S. Customs and Border Protection at the border.",
        },
      ],
    },
    es: {
      name: "Visas",
      title: "Visas",
      metaTitle: "Visas para Estados Unidos: inmigrantes y no inmigrantes",
      metaDescription:
        "Orientación sobre visas de inmigrante y de no inmigrante para Estados Unidos: solicitudes, trámite consular, extensiones y cambios de estatus para su familia.",
      summary:
        "Orientación sobre visas temporales y de inmigrante, trámite consular, y extensiones o cambios de estatus.",
      intro:
        "Ya sea que desee visitar, estudiar, trabajar o reunirse con su familia en los Estados Unidos, la visa adecuada depende de su propósito y de sus circunstancias personales. Podemos ayudarle a entender las opciones que podrían estar disponibles, preparar su solicitud y prepararse para los siguientes pasos.",
      overview: [
        "Las visas de los Estados Unidos se dividen, en general, en dos grupos. Las visas de no inmigrante son para estancias temporales, como visitas, estudios o ciertos tipos de trabajo. Las visas de inmigrante son para personas que desean vivir de forma permanente en los Estados Unidos, muchas veces con base en un parentesco familiar o en un empleo.",
        "Las solicitudes de visa desde el extranjero normalmente las tramita el Departamento de Estado en una embajada o consulado de los Estados Unidos, y suelen requerir una solicitud en línea, como el Formulario DS-160 o DS-260, y una entrevista. Las personas que ya están en los Estados Unidos con un estatus legal podrían, en algunos casos, pedir a USCIS una extensión o un cambio de estatus. La admisión en la frontera la decide la Oficina de Aduanas y Protección Fronteriza (CBP).",
        "Cada categoría de visa tiene sus propios requisitos, y los oficiales consulares tienen amplia discreción. Infracciones migratorias anteriores, negaciones de visa previas y otros factores pueden afectar una solicitud. Los tiempos de trámite y la disponibilidad de citas varían y los fija el gobierno.",
      ],
      helpWith: [
        "Entender qué categorías de visa podrían ajustarse a su propósito",
        "Solicitudes de visa de inmigrante y trámite consular (Formulario DS-260)",
        "Solicitudes de visa de no inmigrante (Formulario DS-160)",
        "Extensiones y cambios de estatus de no inmigrante",
        "Preparación para entrevistas consulares",
        "Revisión de negaciones de visa anteriores y los próximos pasos",
      ],
      process: [
        {
          title: "Consulta",
          body: "Conocemos el motivo por el que desea venir o permanecer en los Estados Unidos y revisamos sus antecedentes y viajes anteriores.",
        },
        {
          title: "Revisión de opciones",
          body: "Un abogado le explica qué categorías de visa podrían estar disponibles según sus circunstancias y qué requiere cada una.",
        },
        {
          title: "Preparación de la solicitud",
          body: "Le ayudamos a llenar los formularios con precisión y a organizar los documentos de apoyo para USCIS o el consulado.",
        },
        {
          title: "Entrevista y próximos pasos",
          body: "Le ayudamos a prepararse para su entrevista y a entender cualquier solicitud adicional o decisión.",
        },
      ],
      faqs: [
        {
          q: "¿Cuál es la diferencia entre una visa de inmigrante y una de no inmigrante?",
          a: "Una visa de no inmigrante es para un propósito temporal, como turismo, estudios o ciertos trabajos. Una visa de inmigrante es para quienes planean vivir de forma permanente en los Estados Unidos. La opción adecuada depende de sus metas y circunstancias.",
        },
        {
          q: "Me negaron la visa. ¿Puedo volver a solicitarla?",
          a: "En muchos casos es posible volver a solicitarla, pero depende del motivo de la negación. Algunas negaciones se deben a asuntos que deben resolverse antes de presentar una nueva solicitud. Un abogado puede revisar la negación y explicarle los posibles próximos pasos.",
        },
        {
          q: "¿Tener una visa garantiza la entrada a los Estados Unidos?",
          a: "No. La visa permite viajar a un puerto de entrada de los Estados Unidos y solicitar la admisión, pero la decisión final la toma la Oficina de Aduanas y Protección Fronteriza en la frontera.",
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Work permits
  // ---------------------------------------------------------------------------
  {
    id: 'work-permits',
    icon: Briefcase,
    en: {
      name: "Work Permits",
      title: "Work Permits (EAD)",
      metaTitle: "Work Permit Consultations: EAD & Form I-765",
      metaDescription:
        "Consultations on U.S. work permits (Employment Authorization Documents), including initial applications, renewals, and Form I-765 filings tied to pending cases.",
      summary:
        "Consultations on employment authorization, including initial work permit applications and renewals using Form I-765.",
      intro:
        "Being able to work legally helps you support your family and plan for the future. Many people may be able to request a work permit based on a pending application or their current status. We can review your situation, explain whether a work permit option may be available, and help you prepare an accurate application.",
      overview: [
        "A work permit, formally called an Employment Authorization Document (EAD), is a card issued by USCIS that shows a person is authorized to work in the United States for a specific period. Most requests are made using Form I-765, Application for Employment Authorization.",
        "Work authorization is usually tied to a specific category, such as a pending green card application, a pending asylum application after a required waiting period, certain humanitarian programs, or some dependent visa categories. Whether a category may apply to you depends on your circumstances, and the required evidence differs by category.",
        "Work permits have expiration dates, and renewing on time is important. In some situations, the law may extend work authorization while a timely renewal is pending, but the rules depend on the category. Processing times vary and are set by the government.",
      ],
      helpWith: [
        "Consultations on whether a work permit category may be available",
        "Initial work permit applications (Form I-765)",
        "Work permit renewals and replacements",
        "Work permits connected to pending green card or asylum cases",
        "Correcting errors on an issued work permit card",
        "Understanding notices and requests for evidence",
      ],
      process: [
        {
          title: "Consultation",
          body: "We review your current status, any pending applications, and your work history.",
        },
        {
          title: "Category review",
          body: "An attorney explains which work permit category may apply depending on your circumstances and what evidence is typically needed.",
        },
        {
          title: "Application",
          body: "We help you complete Form I-765 carefully and gather the supporting documents for your category.",
        },
        {
          title: "Follow-up",
          body: "We help you track your case, understand notices, and plan ahead for renewals.",
        },
      ],
      faqs: [
        {
          q: "Who can apply for a work permit?",
          a: "Work permits are available only in specific categories, such as certain pending applications or humanitarian programs. Whether you may be able to apply depends on your status and history. An attorney can review your situation.",
        },
        {
          q: "When should I renew my work permit?",
          a: "USCIS generally allows renewals to be filed before the current card expires. Filing on time is important, and the specific timing and rules can depend on your category. We can help you plan ahead.",
        },
        {
          q: "Can I work while my work permit application is pending?",
          a: "Generally, a person should not work without valid authorization. In some renewal situations, work authorization may be automatically extended for a period, depending on the category. Please speak with an attorney before making decisions about employment.",
        },
      ],
    },
    es: {
      name: "Permisos de trabajo",
      title: "Permisos de trabajo (EAD)",
      metaTitle: "Consultas sobre permisos de trabajo: EAD y Formulario I-765",
      metaDescription:
        "Consultas sobre permisos de trabajo en EE. UU. (EAD), incluidas solicitudes iniciales, renovaciones y el Formulario I-765 basado en un caso pendiente.",
      summary:
        "Consultas sobre autorización de empleo, incluidas solicitudes iniciales y renovaciones de permisos de trabajo con el Formulario I-765.",
      intro:
        "Poder trabajar legalmente le ayuda a mantener a su familia y a planear su futuro. Muchas personas podrían solicitar un permiso de trabajo con base en una solicitud pendiente o en su estatus actual. Podemos revisar su situación, explicarle si podría existir una opción de permiso de trabajo y ayudarle a preparar una solicitud precisa.",
      overview: [
        "El permiso de trabajo, conocido formalmente como Documento de Autorización de Empleo (EAD), es una tarjeta emitida por USCIS que demuestra que una persona está autorizada para trabajar en los Estados Unidos durante un periodo determinado. La mayoría de las solicitudes se presentan con el Formulario I-765, Solicitud de Autorización de Empleo.",
        "La autorización de empleo normalmente está ligada a una categoría específica, como una solicitud de residencia pendiente, una solicitud de asilo pendiente después del periodo de espera requerido, ciertos programas humanitarios o algunas categorías de visa para dependientes. Que una categoría pueda aplicarse en su caso depende de sus circunstancias, y las pruebas necesarias varían según la categoría.",
        "Los permisos de trabajo tienen fecha de vencimiento, y es importante renovarlos a tiempo. En algunas situaciones, la ley podría extender la autorización de empleo mientras una renovación presentada a tiempo está pendiente, pero las reglas dependen de la categoría. Los tiempos de trámite varían y los fija el gobierno.",
      ],
      helpWith: [
        "Consultas sobre si podría estar disponible una categoría de permiso de trabajo",
        "Solicitudes iniciales de permiso de trabajo (Formulario I-765)",
        "Renovación y reemplazo de permisos de trabajo",
        "Permisos de trabajo vinculados a casos de residencia o asilo pendientes",
        "Corrección de errores en una tarjeta de permiso de trabajo ya emitida",
        "Entender avisos y solicitudes de evidencia",
      ],
      process: [
        {
          title: "Consulta",
          body: "Revisamos su estatus actual, sus solicitudes pendientes y su historial laboral.",
        },
        {
          title: "Revisión de la categoría",
          body: "Un abogado le explica qué categoría de permiso de trabajo podría aplicarse según sus circunstancias y qué pruebas suelen necesitarse.",
        },
        {
          title: "Solicitud",
          body: "Le ayudamos a llenar con cuidado el Formulario I-765 y a reunir los documentos de apoyo para su categoría.",
        },
        {
          title: "Seguimiento",
          body: "Le ayudamos a dar seguimiento a su caso, entender los avisos y planear con anticipación las renovaciones.",
        },
      ],
      faqs: [
        {
          q: "¿Quién puede solicitar un permiso de trabajo?",
          a: "Los permisos de trabajo solo están disponibles en categorías específicas, como ciertas solicitudes pendientes o programas humanitarios. Que usted pueda solicitarlo depende de su estatus y de su historial. Un abogado puede revisar su situación.",
        },
        {
          q: "¿Cuándo debo renovar mi permiso de trabajo?",
          a: "Por lo general, USCIS permite presentar la renovación antes de que venza la tarjeta actual. Es importante presentarla a tiempo, y los plazos y reglas específicos pueden depender de su categoría. Podemos ayudarle a planear con anticipación.",
        },
        {
          q: "¿Puedo trabajar mientras mi solicitud de permiso de trabajo está pendiente?",
          a: "En general, una persona no debe trabajar sin una autorización válida. En algunas renovaciones, la autorización de empleo podría extenderse automáticamente por un tiempo, según la categoría. Hable con un abogado antes de tomar decisiones sobre su empleo.",
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Removal defense
  // ---------------------------------------------------------------------------
  {
    id: 'removal-defense',
    icon: Shield,
    en: {
      name: "Removal Defense",
      title: "Deportation & Removal Defense",
      metaTitle: "Deportation & Removal Defense in Immigration Court",
      metaDescription:
        "Representation for people facing deportation in immigration court, including review of the Notice to Appear, possible forms of relief, bond, and appeals.",
      summary:
        "Guidance and representation for people in removal proceedings, including possible forms of relief and appeals.",
      intro:
        "Receiving a Notice to Appear or learning that a loved one has been detained can be frightening. You do not have to face immigration court alone. We can review your case, explain what may happen next, and discuss the defenses and forms of relief that may be available depending on your circumstances.",
      overview: [
        "Removal proceedings, often called deportation proceedings, usually begin when the government files a Notice to Appear (NTA) with the immigration court, which is part of the Executive Office for Immigration Review (EOIR). An immigration judge decides whether the person may be removed and whether any form of relief may be granted.",
        "Depending on a person's history, possible options may include challenging the government's charges, applying for relief such as cancellation of removal, adjustment of status, asylum or related protection, or requesting voluntary departure. Whether any of these may be available depends on individual facts, and each has its own requirements. People detained by Immigration and Customs Enforcement (ICE) may, in some cases, be able to request a bond hearing.",
        "If an immigration judge rules against a person, there may be the option to appeal to the Board of Immigration Appeals (BIA), usually within a strict deadline. Missing a court date or deadline can have serious consequences, so it is important to seek legal advice as early as possible.",
      ],
      helpWith: [
        "Reviewing a Notice to Appear and the charges against you",
        "Representation at immigration court hearings",
        "Applications for relief from removal that may be available",
        "Bond requests for people detained by ICE",
        "Appeals to the Board of Immigration Appeals",
        "Motions to reopen or reconsider, where they may apply",
      ],
      process: [
        {
          title: "Urgent consultation",
          body: "We review your court documents, upcoming hearing dates, and any deadlines as soon as possible.",
        },
        {
          title: "Case evaluation",
          body: "An attorney reviews your history and explains the defenses and forms of relief that may be available depending on your circumstances.",
        },
        {
          title: "Case preparation",
          body: "We help gather evidence, prepare applications and filings, and get you ready for each hearing.",
        },
        {
          title: "Hearings and appeals",
          body: "We represent you in court and, if needed, discuss whether an appeal or motion may be an option.",
        },
      ],
      faqs: [
        {
          q: "I received a Notice to Appear. What should I do?",
          a: "Read it carefully, keep it safe, and make sure the court has your current address. Do not miss any hearing. Speak with an attorney as soon as possible so your options can be reviewed before important deadlines pass.",
        },
        {
          q: "My family member was detained by ICE. Can they be released?",
          a: "It depends on the person's history and the legal basis for detention. In some cases, a person may be able to request a bond hearing before an immigration judge. An attorney can review the situation and explain possible options.",
        },
        {
          q: "Can I appeal an immigration judge's decision?",
          a: "In many cases, a decision may be appealed to the Board of Immigration Appeals, but the deadline is short and strict. If you have received a decision, contact an attorney right away to discuss whether an appeal may be possible.",
        },
      ],
    },
    es: {
      name: "Defensa contra deportación",
      title: "Defensa contra la deportación",
      metaTitle: "Defensa contra la deportación en la corte de inmigración",
      metaDescription:
        "Representación para personas en riesgo de deportación ante la corte de inmigración: revisión del Aviso de Comparecencia, posibles alivios, fianza y apelaciones.",
      summary:
        "Orientación y representación para personas en procesos de deportación, incluidas las posibles formas de alivio y apelaciones.",
      intro:
        "Recibir un Aviso de Comparecencia o enterarse de que un ser querido ha sido detenido puede causar mucho miedo. No tiene que enfrentar la corte de inmigración solo. Podemos revisar su caso, explicarle lo que podría suceder y hablar sobre las defensas y formas de alivio que podrían estar disponibles según sus circunstancias.",
      overview: [
        "Los procesos de remoción, conocidos comúnmente como procesos de deportación, suelen comenzar cuando el gobierno presenta un Aviso de Comparecencia (NTA) ante la corte de inmigración, que forma parte de la Oficina Ejecutiva de Revisión de Casos de Inmigración (EOIR). Un juez de inmigración decide si la persona puede ser deportada y si se le puede conceder algún tipo de alivio.",
        "Según el historial de cada persona, las posibles opciones podrían incluir impugnar los cargos del gobierno, solicitar alivios como la cancelación de remoción, el ajuste de estatus, el asilo u otra protección relacionada, o pedir la salida voluntaria. Que alguna de estas opciones esté disponible depende de los hechos de cada caso, y cada una tiene sus propios requisitos. Las personas detenidas por el Servicio de Inmigración y Control de Aduanas (ICE) podrían, en algunos casos, solicitar una audiencia de fianza.",
        "Si un juez de inmigración falla en contra de una persona, podría existir la opción de apelar ante la Junta de Apelaciones de Inmigración (BIA), normalmente dentro de un plazo estricto. No presentarse a una audiencia o dejar pasar un plazo puede tener consecuencias graves, por lo que es importante buscar asesoría legal lo antes posible.",
      ],
      helpWith: [
        "Revisión del Aviso de Comparecencia y de los cargos en su contra",
        "Representación en audiencias ante la corte de inmigración",
        "Solicitudes de alivio contra la deportación que podrían estar disponibles",
        "Solicitudes de fianza para personas detenidas por ICE",
        "Apelaciones ante la Junta de Apelaciones de Inmigración",
        "Mociones para reabrir o reconsiderar, cuando podrían aplicar",
      ],
      process: [
        {
          title: "Consulta urgente",
          body: "Revisamos lo antes posible sus documentos de la corte, las fechas de sus próximas audiencias y cualquier plazo pendiente.",
        },
        {
          title: "Evaluación del caso",
          body: "Un abogado revisa su historial y le explica las defensas y formas de alivio que podrían estar disponibles según sus circunstancias.",
        },
        {
          title: "Preparación del caso",
          body: "Le ayudamos a reunir pruebas, preparar solicitudes y escritos, y prepararse para cada audiencia.",
        },
        {
          title: "Audiencias y apelaciones",
          body: "Le representamos ante la corte y, si es necesario, hablamos sobre si una apelación o moción podría ser una opción.",
        },
      ],
      faqs: [
        {
          q: "Recibí un Aviso de Comparecencia. ¿Qué debo hacer?",
          a: "Léalo con cuidado, guárdelo en un lugar seguro y asegúrese de que la corte tenga su dirección actual. No falte a ninguna audiencia. Hable con un abogado lo antes posible para revisar sus opciones antes de que venzan plazos importantes.",
        },
        {
          q: "ICE detuvo a mi familiar. ¿Pueden liberarlo?",
          a: "Depende del historial de la persona y del fundamento legal de la detención. En algunos casos, la persona podría solicitar una audiencia de fianza ante un juez de inmigración. Un abogado puede revisar la situación y explicarle las posibles opciones.",
        },
        {
          q: "¿Puedo apelar la decisión de un juez de inmigración?",
          a: "En muchos casos, la decisión puede apelarse ante la Junta de Apelaciones de Inmigración, pero el plazo es corto y estricto. Si ya recibió una decisión, comuníquese con un abogado de inmediato para hablar sobre si una apelación podría ser posible.",
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Humanitarian relief
  // ---------------------------------------------------------------------------
  {
    id: 'humanitarian-relief',
    icon: HeartHandshake,
    en: {
      name: "Humanitarian Relief",
      title: "Humanitarian Relief",
      metaTitle: "Humanitarian Immigration Relief & Protection Options",
      metaDescription:
        "General information on humanitarian immigration protections such as asylum, U and T visas, VAWA, and TPS, and how an attorney can review whether one may apply.",
      summary:
        "A careful review of whether a humanitarian immigration option may apply to people who have faced danger, abuse, or crisis.",
      intro:
        "U.S. immigration law includes certain protections for people who have faced persecution, violence, abuse, or crisis. These cases can be deeply personal, and every situation is different. We can listen to your story in confidence, review your circumstances, and explain whether any humanitarian option may apply to you.",
      overview: [
        "Humanitarian protections are a group of different legal options, each with its own requirements and deadlines. As general information, they can include asylum for people who fear persecution in their home country, U visas for certain victims of crimes who help law enforcement, T visas for certain survivors of human trafficking, VAWA self-petitions for certain survivors of abuse by a U.S. citizen or permanent resident family member, and Temporary Protected Status (TPS) for nationals of designated countries.",
        "Depending on the type of protection and whether a person is in removal proceedings, applications may be filed with USCIS or presented before an immigration judge. Asylum, for example, is generally requested with Form I-589 and is subject to a filing deadline with limited exceptions. TPS designations and registration periods are set by the government and can change.",
        "Because these options are complex and depend heavily on individual facts, it is important to speak with an attorney before filing. The firm will review your situation and let you know whether any humanitarian option may apply and whether it is something the firm can assist with.",
      ],
      helpWith: [
        "Confidential review of whether a humanitarian option may apply",
        "General information about asylum and related protection (Form I-589)",
        "Understanding options for survivors of crime, trafficking, or abuse",
        "Questions about Temporary Protected Status registration and renewal",
        "Gathering declarations and supporting evidence",
        "Related work permit applications, where available",
      ],
      process: [
        {
          title: "Confidential consultation",
          body: "We listen to your story with care and respect, at a pace that is comfortable for you.",
        },
        {
          title: "Options review",
          body: "An attorney reviews whether any humanitarian protection may apply depending on your circumstances and explains any deadlines.",
        },
        {
          title: "Evidence and preparation",
          body: "If an option may apply and the firm can assist, we help you prepare your statement, gather evidence, and complete the forms.",
        },
        {
          title: "Filing and follow-up",
          body: "We help you understand notices, prepare for interviews or hearings, and plan next steps.",
        },
      ],
      faqs: [
        {
          q: "How do I know if I may qualify for humanitarian relief?",
          a: "Each form of humanitarian protection has its own requirements, and the answer depends on your specific facts. The best first step is a confidential consultation, where an attorney can review your situation and explain whether any option may apply.",
        },
        {
          q: "Is there a deadline to apply for asylum?",
          a: "Generally, asylum must be requested within a set period after arriving in the United States, with limited exceptions. Because deadlines matter, it is important to speak with an attorney as soon as possible.",
        },
        {
          q: "Will my information be kept private?",
          a: "We treat what you share with care and discretion. Certain humanitarian applications also have specific confidentiality protections under the law. An attorney can explain how your information may be used in the process.",
        },
      ],
    },
    es: {
      name: "Alivio humanitario",
      title: "Alivio humanitario",
      metaTitle: "Alivio migratorio humanitario y opciones de protección",
      metaDescription:
        "Información general sobre protecciones humanitarias como asilo, visas U y T, VAWA y TPS, y cómo un abogado puede revisar si alguna podría aplicar en su caso.",
      summary:
        "Una revisión cuidadosa de si alguna opción migratoria humanitaria podría aplicar a personas que han enfrentado peligro, abuso o crisis.",
      intro:
        "La ley de inmigración de los Estados Unidos incluye ciertas protecciones para personas que han sufrido persecución, violencia, abuso o situaciones de crisis. Estos casos pueden ser muy personales, y cada situación es distinta. Podemos escuchar su historia de manera confidencial, revisar sus circunstancias y explicarle si alguna opción humanitaria podría aplicar en su caso.",
      overview: [
        "Las protecciones humanitarias son un conjunto de opciones legales distintas, cada una con sus propios requisitos y plazos. Como información general, pueden incluir el asilo para personas que temen persecución en su país de origen, la visa U para ciertas víctimas de delitos que colaboran con las autoridades, la visa T para ciertos sobrevivientes de trata de personas, las autopeticiones bajo VAWA para ciertos sobrevivientes de abuso por parte de un familiar ciudadano o residente permanente, y el Estatus de Protección Temporal (TPS) para ciudadanos de países designados.",
        "Según el tipo de protección y si la persona está en un proceso de deportación, la solicitud podría presentarse ante USCIS o ante un juez de inmigración. El asilo, por ejemplo, generalmente se solicita con el Formulario I-589 y tiene un plazo de presentación con excepciones limitadas. Las designaciones de TPS y sus periodos de inscripción los fija el gobierno y pueden cambiar.",
        "Como estas opciones son complejas y dependen mucho de los hechos de cada caso, es importante hablar con un abogado antes de presentar una solicitud. La firma revisará su situación y le dirá si alguna opción humanitaria podría aplicar y si es un asunto en el que la firma puede ayudarle.",
      ],
      helpWith: [
        "Revisión confidencial de si alguna opción humanitaria podría aplicar",
        "Información general sobre el asilo y protecciones relacionadas (Formulario I-589)",
        "Opciones para sobrevivientes de delitos, trata de personas o abuso",
        "Preguntas sobre la inscripción y renovación del Estatus de Protección Temporal",
        "Preparación de declaraciones y reunión de pruebas de apoyo",
        "Solicitudes de permiso de trabajo relacionadas, cuando estén disponibles",
      ],
      process: [
        {
          title: "Consulta confidencial",
          body: "Escuchamos su historia con cuidado y respeto, al ritmo con el que usted se sienta cómodo.",
        },
        {
          title: "Revisión de opciones",
          body: "Un abogado revisa si alguna protección humanitaria podría aplicar según sus circunstancias y le explica los plazos que correspondan.",
        },
        {
          title: "Pruebas y preparación",
          body: "Si alguna opción podría aplicar y la firma puede ayudarle, le apoyamos para preparar su declaración, reunir pruebas y llenar los formularios.",
        },
        {
          title: "Presentación y seguimiento",
          body: "Le ayudamos a entender los avisos, prepararse para entrevistas o audiencias y planear los próximos pasos.",
        },
      ],
      faqs: [
        {
          q: "¿Cómo sé si podría calificar para un alivio humanitario?",
          a: "Cada forma de protección humanitaria tiene sus propios requisitos, y la respuesta depende de los hechos de su caso. El mejor primer paso es una consulta confidencial, en la que un abogado puede revisar su situación y explicarle si alguna opción podría aplicar.",
        },
        {
          q: "¿Hay un plazo para solicitar asilo?",
          a: "En general, el asilo debe solicitarse dentro de un periodo determinado después de llegar a los Estados Unidos, con excepciones limitadas. Como los plazos son importantes, conviene hablar con un abogado lo antes posible.",
        },
        {
          q: "¿Mi información se mantendrá en privado?",
          a: "Tratamos lo que usted nos comparte con cuidado y discreción. Además, ciertas solicitudes humanitarias cuentan con protecciones de confidencialidad específicas bajo la ley. Un abogado puede explicarle cómo podría usarse su información durante el proceso.",
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Document review
  // ---------------------------------------------------------------------------
  {
    id: 'document-review',
    icon: FileSearch,
    en: {
      name: "Document Review",
      title: "Immigration Document Review",
      metaTitle: "Immigration Form & Document Review Before Filing",
      metaDescription:
        "Attorney review of immigration forms, evidence, and filings before submission to help spot errors, missing documents, and inconsistencies that may cause delays.",
      summary:
        "A careful review of your forms, evidence, and filings before you submit them to the government.",
      intro:
        "Small mistakes on immigration forms can lead to delays, requests for evidence, or other problems. If you have prepared an application yourself, or want a second look before you file, we can review your forms and supporting documents and point out issues that may need attention.",
      overview: [
        "Immigration applications often involve long forms, detailed instructions, and many supporting documents. Common problems include missing signatures, outdated form editions, incomplete answers, inconsistent dates or names, and missing translations or evidence.",
        "A document review focuses on the materials you have prepared. We check forms for completeness and consistency, compare answers with your supporting documents and prior filings, and note where additional evidence may be helpful. We also flag questions or facts that may raise legal concerns and may be worth discussing further with an attorney.",
        "A review can help reduce avoidable errors, but it cannot guarantee how USCIS, the Department of State, or any other agency will decide a case. Processing times and decisions are made by the government.",
      ],
      helpWith: [
        "Reviewing forms such as the I-130, I-485, I-765, and N-400 before filing",
        "Checking consistency between forms, documents, and prior filings",
        "Identifying missing evidence, signatures, or translations",
        "Reviewing responses to requests for evidence (RFEs)",
        "Flagging answers that may raise legal concerns",
        "Organizing your filing so it is clear and complete",
      ],
      process: [
        {
          title: "Share your documents",
          body: "You provide the forms and supporting documents you plan to submit, along with any prior filings or notices.",
        },
        {
          title: "Attorney review",
          body: "An attorney reviews your materials for completeness, accuracy, and consistency.",
        },
        {
          title: "Feedback",
          body: "We explain what we found in plain language, including corrections, missing items, and any concerns.",
        },
        {
          title: "Next steps",
          body: "We discuss whether your filing may be ready or whether further changes or legal advice may be helpful.",
        },
      ],
      faqs: [
        {
          q: "I prepared my own application. Can you just review it?",
          a: "Yes, a document review is designed for that. We review the materials you prepared and let you know about errors, missing items, or questions that may need further attention.",
        },
        {
          q: "Does a document review mean my application will be approved?",
          a: "No. A review can help reduce avoidable mistakes, but decisions are made by the government, and no one can guarantee an outcome.",
        },
        {
          q: "What should I bring for a document review?",
          a: "Bring the completed forms, all supporting documents, copies of any prior immigration applications, and any notices you have received from USCIS, the immigration court, or a consulate.",
        },
      ],
    },
    es: {
      name: "Revisión de documentos",
      title: "Revisión de documentos migratorios",
      metaTitle: "Revisión de formularios y documentos antes de presentar",
      metaDescription:
        "Revisión por un abogado de formularios, pruebas y solicitudes migratorias antes de presentarlas, para detectar errores, faltantes e inconsistencias.",
      summary:
        "Una revisión cuidadosa de sus formularios, pruebas y solicitudes antes de presentarlos ante el gobierno.",
      intro:
        "Pequeños errores en los formularios de inmigración pueden causar demoras, solicitudes de evidencia u otros problemas. Si usted preparó su solicitud por su cuenta, o desea una segunda opinión antes de presentarla, podemos revisar sus formularios y documentos de apoyo y señalarle los asuntos que podrían requerir atención.",
      overview: [
        "Las solicitudes de inmigración suelen incluir formularios largos, instrucciones detalladas y muchos documentos de apoyo. Entre los problemas más comunes están las firmas faltantes, las ediciones de formularios desactualizadas, las respuestas incompletas, las fechas o nombres que no coinciden, y la falta de traducciones o pruebas.",
        "La revisión de documentos se enfoca en los materiales que usted preparó. Verificamos que los formularios estén completos y sean coherentes, comparamos las respuestas con sus documentos de apoyo y solicitudes anteriores, y señalamos dónde podrían ser útiles pruebas adicionales. También identificamos preguntas o hechos que podrían generar inquietudes legales y que conviene hablar con más detalle con un abogado.",
        "Una revisión puede ayudar a reducir errores evitables, pero no puede garantizar cómo decidirá un caso USCIS, el Departamento de Estado o cualquier otra agencia. Los tiempos de trámite y las decisiones dependen del gobierno.",
      ],
      helpWith: [
        "Revisión de formularios como el I-130, I-485, I-765 y N-400 antes de presentarlos",
        "Verificar la coherencia entre formularios, documentos y solicitudes anteriores",
        "Identificar pruebas, firmas o traducciones faltantes",
        "Revisión de respuestas a solicitudes de evidencia (RFE)",
        "Señalar respuestas que podrían generar inquietudes legales",
        "Organizar su solicitud para que sea clara y completa",
      ],
      process: [
        {
          title: "Comparta sus documentos",
          body: "Usted nos entrega los formularios y documentos de apoyo que piensa presentar, junto con solicitudes o avisos anteriores.",
        },
        {
          title: "Revisión por un abogado",
          body: "Un abogado revisa sus materiales para verificar que estén completos, sean precisos y coherentes.",
        },
        {
          title: "Comentarios",
          body: "Le explicamos en palabras sencillas lo que encontramos, incluidas las correcciones, los elementos faltantes y cualquier inquietud.",
        },
        {
          title: "Próximos pasos",
          body: "Hablamos sobre si su solicitud podría estar lista o si serían útiles más cambios o asesoría legal.",
        },
      ],
      faqs: [
        {
          q: "Yo preparé mi propia solicitud. ¿Pueden solo revisarla?",
          a: "Sí, la revisión de documentos está pensada para eso. Revisamos los materiales que usted preparó y le informamos sobre errores, elementos faltantes o preguntas que podrían requerir más atención.",
        },
        {
          q: "¿Una revisión de documentos significa que aprobarán mi solicitud?",
          a: "No. Una revisión puede ayudar a reducir errores evitables, pero las decisiones las toma el gobierno y nadie puede garantizar un resultado.",
        },
        {
          q: "¿Qué debo traer para una revisión de documentos?",
          a: "Traiga los formularios llenos, todos los documentos de apoyo, copias de cualquier solicitud migratoria anterior y los avisos que haya recibido de USCIS, la corte de inmigración o un consulado.",
        },
      ],
    },
  },
];

export function getService(id: ServiceId): Service {
  const service = services.find((s) => s.id === id);
  if (!service) {
    throw new Error(`Unknown service: ${id}`);
  }
  return service;
}
