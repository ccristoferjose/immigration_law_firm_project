/**
 * ============================================================================
 * ⚠️  DRAFT LEGAL CONTENT — ATTORNEY REVIEW REQUIRED BEFORE LAUNCH  ⚠️
 * ============================================================================
 * Everything in this file is an editable DRAFT provided as a starting point.
 * It is NOT final legal text. The responsible attorney must review, edit and
 * approve every document (in both English and Spanish) before the site goes live,
 * including confirming compliance with the attorney advertising and ethics rules
 * of each jurisdiction where the attorney is licensed.
 *
 * Keep these documents in sync with what the site actually does (form delivery,
 * Google Analytics, Google Maps embed). Update the effective / last-reviewed dates
 * whenever the content changes.
 * ============================================================================
 */
import type { Locale } from '@/lib/i18n';
import type { LegalDoc } from './types';

export type LegalDocId = 'privacy' | 'terms' | 'disclaimer' | 'accessibility';

export const legalDocs: Record<LegalDocId, Record<Locale, LegalDoc>> = {
  /* ------------------------------------------------------------------------ */
  /* Privacy Policy                                                           */
  /* ------------------------------------------------------------------------ */
  privacy: {
    en: {
      title: "Privacy Policy",
      metaDescription:
        "Learn what information our immigration law firm collects through this website, how we use it to respond to you, and how we protect it. We never sell your data.",
      intro:
        "This Privacy Policy explains what information the Firm collects when you visit this website or submit the contact form, how that information is used, and the choices you have. Effective date: September 29, 2026.",
      sections: [
        {
          heading: "Information we collect",
          paragraphs: [
            "When you use our contact form, we collect the information you choose to provide: your name, email address, phone number, preferred language, the type of legal matter, your preferred contact method, and a short message.",
            "If website analytics are enabled, we may also collect basic technical information automatically, such as your browser type, device type, general location (city or region), pages visited and the date and time of your visit. This information is used in aggregate and is not used to identify you personally.",
          ],
        },
        {
          heading: "How we use your information",
          paragraphs: [
            "We use the information you submit to review and respond to your inquiry, to contact you in your preferred language and by your preferred method, and to determine whether the Firm may be able to help with your matter.",
            "We use technical and analytics data only to understand how the website is used and to improve its content, performance and accessibility.",
          ],
        },
        {
          heading: "What we do not do",
          paragraphs: [
            "We do not sell, rent or trade your personal information.",
            "We do not send the contents of the contact form to analytics or advertising tools, and we do not use your form submission for advertising purposes.",
          ],
        },
        {
          heading: "Maps, cookies and third-party tracking",
          paragraphs: [
            "Our home and contact pages include an embedded Google Maps map so you can find our office. When the map loads, Google receives technical information such as your IP address and may set cookies, under Google's own privacy policy. You can use the directions links or our written address instead.",
            "If Google Analytics is enabled, it uses cookies to measure visits, including which pages are viewed. We have turned off Google's advertising and cross-device (Google signals) features, and we do not use advertising pixels, session recording or heatmaps. Other than Google, we do not allow third parties to collect personal information about your online activities over time and across websites through this site.",
          ],
        },
        {
          heading: "Do Not Track signals",
          paragraphs: [
            "Some browsers send a \"Do Not Track\" signal. Because there is no common industry standard for these signals, this website does not currently respond to them differently. You can still block or delete cookies in your browser settings.",
          ],
        },
        {
          heading: "Service providers",
          paragraphs: [
            "We rely on a small number of third-party service providers to operate this website: our website hosting provider, the service that delivers contact form messages to the Firm, Google Maps (for the office map) and, if enabled, Google Analytics.",
            "These providers may process your information only as needed to provide their services to the Firm and are not permitted to use it for their own marketing.",
          ],
        },
        {
          heading: "Retention and security",
          paragraphs: [
            "We keep contact form submissions only as long as reasonably necessary to respond to your inquiry, manage any resulting representation, and meet our legal and professional obligations.",
            "We use reasonable administrative and technical safeguards, including encrypted (HTTPS) connections, to protect your information. However, no method of transmission over the internet is completely secure. Please do not send confidential or highly sensitive information through the contact form.",
          ],
        },
        {
          heading: "Children's privacy",
          paragraphs: [
            "This website is intended for adults. We do not knowingly collect personal information from children under 13 through this website. If a matter involves a child, a parent or legal guardian should contact us on the child's behalf.",
          ],
        },
        {
          heading: "Your choices and rights",
          paragraphs: [
            "You may ask us to access, correct or delete the personal information you submitted through this website, subject to any legal or professional obligations that require us to keep certain records.",
            "You can limit the technical data collected by adjusting your browser settings, blocking cookies, or using privacy tools. Depending on where you live, you may have additional rights under applicable law.",
          ],
        },
        {
          heading: "Contact us",
          paragraphs: [
            "If you have questions about this Privacy Policy or want to make a request about your information, please call the Firm at (213) 221-5099, use the form on our Contact page, or write to us at 5800 S Eastern Ave, Suite 500, Commerce, CA 90040.",
          ],
        },
        {
          heading: "Changes to this policy",
          paragraphs: [
            "We may update this Privacy Policy from time to time. When we do, we will post the updated version on this page and change the effective date above.",
          ],
        },
      ],
    },
    es: {
      title: "Política de privacidad",
      metaDescription:
        "Conozca qué información recopila nuestra firma de inmigración en este sitio web, cómo la usamos para responderle y cómo la protegemos. Nunca vendemos sus datos.",
      intro:
        "Esta Política de privacidad explica qué información recopila la Firma cuando usted visita este sitio web o envía el formulario de contacto, cómo se utiliza esa información y qué opciones tiene usted. Fecha de vigencia: 29 de septiembre de 2026.",
      sections: [
        {
          heading: "Información que recopilamos",
          paragraphs: [
            "Cuando usted utiliza nuestro formulario de contacto, recopilamos la información que decide proporcionar: su nombre, correo electrónico, número de teléfono, idioma de preferencia, tipo de asunto legal, método de contacto preferido y un mensaje breve.",
            "Si las herramientas de análisis del sitio están activadas, también podemos recopilar automáticamente información técnica básica, como el tipo de navegador, el tipo de dispositivo, la ubicación general (ciudad o región), las páginas visitadas y la fecha y hora de su visita. Esta información se usa de forma agregada y no para identificarle personalmente.",
          ],
        },
        {
          heading: "Cómo usamos su información",
          paragraphs: [
            "Usamos la información que usted envía para revisar y responder a su consulta, comunicarnos con usted en su idioma y por el medio que prefiera, y determinar si la Firma puede ayudarle con su asunto.",
            "Usamos los datos técnicos y de análisis únicamente para entender cómo se utiliza el sitio web y mejorar su contenido, rendimiento y accesibilidad.",
          ],
        },
        {
          heading: "Lo que no hacemos",
          paragraphs: [
            "No vendemos, alquilamos ni intercambiamos su información personal.",
            "No enviamos el contenido del formulario de contacto a herramientas de análisis ni de publicidad, y no usamos sus mensajes con fines publicitarios.",
          ],
        },
        {
          heading: "Mapas, cookies y rastreo de terceros",
          paragraphs: [
            "Nuestras páginas de inicio y de contacto incluyen un mapa de Google Maps para ayudarle a encontrar nuestra oficina. Cuando el mapa se carga, Google recibe información técnica, como su dirección IP, y puede instalar cookies, conforme a su propia política de privacidad. En su lugar, puede usar los enlaces de indicaciones o nuestra dirección escrita.",
            "Si Google Analytics está activado, utiliza cookies para medir las visitas, incluidas las páginas que se consultan. Hemos desactivado las funciones publicitarias y de seguimiento entre dispositivos de Google (Google signals), y no usamos píxeles publicitarios, grabación de sesiones ni mapas de calor. Aparte de Google, no permitimos que terceros recopilen información personal sobre sus actividades en línea a lo largo del tiempo y en distintos sitios web a través de este sitio.",
          ],
        },
        {
          heading: "Señales de «No rastrear» (Do Not Track)",
          paragraphs: [
            "Algunos navegadores envían una señal de «No rastrear». Como no existe un estándar común para estas señales, este sitio web actualmente no responde a ellas de manera diferente. Aun así, puede bloquear o eliminar cookies en la configuración de su navegador.",
          ],
        },
        {
          heading: "Proveedores de servicios",
          paragraphs: [
            "Trabajamos con un número reducido de proveedores externos para operar este sitio web: nuestro proveedor de alojamiento web, el servicio que entrega a la Firma los mensajes del formulario de contacto, Google Maps (para el mapa de la oficina) y, si está activado, Google Analytics.",
            "Estos proveedores solo pueden procesar su información en la medida necesaria para prestar sus servicios a la Firma y no pueden usarla para su propio mercadeo.",
          ],
        },
        {
          heading: "Conservación y seguridad",
          paragraphs: [
            "Conservamos los mensajes del formulario de contacto solo durante el tiempo razonablemente necesario para responder a su consulta, gestionar cualquier representación que resulte de ella y cumplir con nuestras obligaciones legales y profesionales.",
            "Aplicamos medidas administrativas y técnicas razonables, incluidas conexiones cifradas (HTTPS), para proteger su información. Sin embargo, ningún método de transmisión por internet es completamente seguro. Por favor, no envíe información confidencial o muy delicada a través del formulario de contacto.",
          ],
        },
        {
          heading: "Privacidad de los menores",
          paragraphs: [
            "Este sitio web está dirigido a personas adultas. No recopilamos a sabiendas información personal de menores de 13 años a través de este sitio. Si un asunto involucra a un menor, su padre, madre o tutor legal debe comunicarse con nosotros en su nombre.",
          ],
        },
        {
          heading: "Sus opciones y derechos",
          paragraphs: [
            "Usted puede solicitarnos acceder, corregir o eliminar la información personal que envió a través de este sitio web, sujeto a las obligaciones legales o profesionales que nos exijan conservar ciertos registros.",
            "Puede limitar los datos técnicos que se recopilan ajustando la configuración de su navegador, bloqueando cookies o utilizando herramientas de privacidad. Según el lugar donde viva, es posible que tenga derechos adicionales conforme a la ley aplicable.",
          ],
        },
        {
          heading: "Contáctenos",
          paragraphs: [
            "Si tiene preguntas sobre esta Política de privacidad o desea hacer una solicitud sobre su información, llame a la Firma al (213) 221-5099, use el formulario de nuestra página de Contacto o escríbanos a 5800 S Eastern Ave, Suite 500, Commerce, CA 90040.",
          ],
        },
        {
          heading: "Cambios a esta política",
          paragraphs: [
            "Podemos actualizar esta Política de privacidad periódicamente. Cuando lo hagamos, publicaremos la versión actualizada en esta página y cambiaremos la fecha de vigencia indicada arriba.",
          ],
        },
      ],
    },
  },

  /* ------------------------------------------------------------------------ */
  /* Terms of Use                                                             */
  /* ------------------------------------------------------------------------ */
  terms: {
    en: {
      title: "Terms of Use",
      metaDescription:
        "Read the terms that govern your use of this immigration law firm website, including that its content is general information and not legal advice for your case.",
      intro:
        "These Terms of Use apply to your use of this website. By accessing or using the site, you agree to these terms. If you do not agree, please do not use the site. Effective date: September 29, 2026.",
      sections: [
        {
          heading: "Informational purposes only",
          paragraphs: [
            "The content on this website is provided for general informational purposes only. It is not legal advice and should not be relied on as a substitute for advice from a licensed attorney about your specific situation.",
            "Immigration law is complex and changes often. The right course of action depends on the facts of each case.",
          ],
        },
        {
          heading: "No attorney-client relationship",
          paragraphs: [
            "Using this website, reading its content, or submitting the contact form does not create an attorney-client relationship with the Firm. An attorney-client relationship is formed only after the Firm agrees to represent you and a written engagement agreement is signed.",
          ],
        },
        {
          heading: "No guarantee of results",
          paragraphs: [
            "Every case is different. Nothing on this website is a promise or guarantee of any particular outcome. Decisions in immigration matters are made by government agencies and courts, not by the Firm.",
          ],
        },
        {
          heading: "Accuracy and changes to content",
          paragraphs: [
            "We try to keep the information on this website accurate and current, but we do not guarantee that it is complete, accurate or up to date. We may change, add or remove content at any time without notice.",
          ],
        },
        {
          heading: "External links",
          paragraphs: [
            "This website may include links to government agencies or other third-party websites for your convenience. We do not control and are not responsible for the content, accuracy or privacy practices of those websites, and a link does not imply endorsement.",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: [
            "Unless otherwise noted, the text, graphics, logos and other content on this website belong to the Firm or are used with permission. You may view and print pages for your personal, non-commercial use. Any other copying, distribution or modification requires the Firm's prior written permission.",
          ],
        },
        {
          heading: "Limitation of liability",
          paragraphs: [
            "This website is provided \"as is\" and \"as available,\" without warranties of any kind. To the fullest extent permitted by law, the Firm is not liable for any damages arising from your use of, or inability to use, this website or any information on it.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: [
            "These Terms of Use are governed by the laws of the State of California, without regard to its conflict-of-law rules, and by applicable federal law.",
          ],
        },
        {
          heading: "Changes to these terms",
          paragraphs: [
            "We may update these Terms of Use from time to time. The updated version will be posted on this page with a new effective date. Your continued use of the website after changes are posted means you accept the updated terms.",
          ],
        },
      ],
    },
    es: {
      title: "Términos de uso",
      metaDescription:
        "Lea los términos que rigen el uso de este sitio web de nuestra firma de inmigración, incluido que su contenido es información general y no asesoría legal.",
      intro:
        "Estos Términos de uso se aplican al uso que usted haga de este sitio web. Al acceder al sitio o utilizarlo, usted acepta estos términos. Si no está de acuerdo, por favor no utilice el sitio. Fecha de vigencia: 29 de septiembre de 2026.",
      sections: [
        {
          heading: "Solo con fines informativos",
          paragraphs: [
            "El contenido de este sitio web se ofrece únicamente con fines informativos generales. No constituye asesoría legal y no debe utilizarse como sustituto de la orientación de un abogado autorizado sobre su situación particular.",
            "Las leyes de inmigración son complejas y cambian con frecuencia. La mejor opción depende de los hechos de cada caso.",
          ],
        },
        {
          heading: "No existe relación abogado-cliente",
          paragraphs: [
            "Usar este sitio web, leer su contenido o enviar el formulario de contacto no crea una relación abogado-cliente con la Firma. Esa relación se establece solo después de que la Firma acepte representarle y se firme un contrato de servicios por escrito.",
          ],
        },
        {
          heading: "Sin garantía de resultados",
          paragraphs: [
            "Cada caso es diferente. Nada de lo que aparece en este sitio web es una promesa ni una garantía de un resultado determinado. Las decisiones en asuntos migratorios las toman las agencias del gobierno y los tribunales, no la Firma.",
          ],
        },
        {
          heading: "Exactitud y cambios en el contenido",
          paragraphs: [
            "Procuramos que la información de este sitio web sea correcta y esté actualizada, pero no garantizamos que sea completa, exacta ni vigente. Podemos cambiar, agregar o eliminar contenido en cualquier momento sin previo aviso.",
          ],
        },
        {
          heading: "Enlaces externos",
          paragraphs: [
            "Este sitio web puede incluir enlaces a agencias del gobierno u otros sitios de terceros para su conveniencia. No controlamos ni somos responsables del contenido, la exactitud o las prácticas de privacidad de esos sitios, y un enlace no implica respaldo.",
          ],
        },
        {
          heading: "Propiedad intelectual",
          paragraphs: [
            "Salvo que se indique lo contrario, los textos, gráficos, logotipos y demás contenido de este sitio web pertenecen a la Firma o se utilizan con autorización. Usted puede ver e imprimir páginas para su uso personal y no comercial. Cualquier otra copia, distribución o modificación requiere la autorización previa y por escrito de la Firma.",
          ],
        },
        {
          heading: "Limitación de responsabilidad",
          paragraphs: [
            "Este sitio web se ofrece \"tal como está\" y \"según disponibilidad\", sin garantías de ningún tipo. En la máxima medida permitida por la ley, la Firma no será responsable de ningún daño derivado del uso, o la imposibilidad de uso, de este sitio web o de la información que contiene.",
          ],
        },
        {
          heading: "Ley aplicable",
          paragraphs: [
            "Estos Términos de uso se rigen por las leyes del Estado de California, sin tener en cuenta sus normas sobre conflicto de leyes, y por la legislación federal aplicable.",
          ],
        },
        {
          heading: "Cambios a estos términos",
          paragraphs: [
            "Podemos actualizar estos Términos de uso periódicamente. La versión actualizada se publicará en esta página con una nueva fecha de vigencia. Si usted continúa usando el sitio web después de publicados los cambios, se entiende que acepta los términos actualizados.",
          ],
        },
      ],
    },
  },

  /* ------------------------------------------------------------------------ */
  /* Legal Disclaimer                                                         */
  /* ------------------------------------------------------------------------ */
  disclaimer: {
    en: {
      title: "Legal Disclaimer",
      metaDescription:
        "Important notices about this website: attorney advertising, general information only, no attorney-client relationship until engaged, and no guaranteed results.",
      intro:
        "Please read this disclaimer before using this website or contacting the Firm. It explains important limits on the information provided here and on how an attorney-client relationship is formed.",
      sections: [
        {
          heading: "Attorney advertising",
          paragraphs: [
            "This website may be considered attorney advertising under the rules of some jurisdictions.",
          ],
        },
        {
          heading: "General information, not legal advice",
          paragraphs: [
            "The information on this website is general in nature and is not legal advice. It may not apply to your situation. You should not act or refrain from acting based on this information without first consulting a licensed attorney about your specific facts.",
          ],
        },
        {
          heading: "No attorney-client relationship until engaged",
          paragraphs: [
            "Visiting this website, calling or emailing the Firm, or submitting the contact form does not create an attorney-client relationship. An attorney-client relationship exists only after the Firm has agreed to represent you and a written engagement agreement has been signed.",
          ],
        },
        {
          heading: "Do not send confidential information",
          paragraphs: [
            "Until an attorney-client relationship has been established, please do not send confidential or highly sensitive information, such as immigration documents, identification numbers or details of criminal history, through the contact form or by email. Information sent before you are a client may not be treated as confidential or privileged.",
            "A brief description of the type of help you need is enough for us to respond.",
          ],
        },
        {
          heading: "No guarantee of results",
          paragraphs: [
            "Every case depends on its own facts and circumstances. Any prior results described on this website do not guarantee a similar outcome, and the Firm cannot guarantee the result of any matter.",
          ],
        },
        {
          heading: "Jurisdiction and bar admission",
          paragraphs: [
            "The Firm's attorney is licensed to practice law in California by the State Bar of California. Immigration law is federal, which allows an immigration attorney to represent clients in immigration matters before federal agencies and immigration courts regardless of the state where the client lives. The Firm does not provide advice on matters of state law outside the jurisdiction(s) where its attorneys are licensed.",
          ],
        },
        {
          heading: "Translations",
          paragraphs: [
            "Spanish translations of this website are provided for convenience only. If there is any difference or inconsistency between the English and Spanish versions, the English version governs.",
          ],
        },
      ],
    },
    es: {
      title: "Aviso legal",
      metaDescription:
        "Avisos sobre este sitio: publicidad de abogados, información general, sin relación abogado-cliente hasta ser contratados y sin garantía de resultados.",
      intro:
        "Por favor, lea este aviso antes de usar este sitio web o comunicarse con la Firma. Aquí se explican límites importantes sobre la información que se ofrece en el sitio y sobre cómo se establece una relación abogado-cliente.",
      sections: [
        {
          heading: "Publicidad de abogados",
          paragraphs: [
            "Este sitio web puede considerarse publicidad de abogados (Attorney Advertising) según las normas de algunas jurisdicciones.",
          ],
        },
        {
          heading: "Información general, no asesoría legal",
          paragraphs: [
            "La información de este sitio web es de carácter general y no constituye asesoría legal. Es posible que no se aplique a su situación. No debe actuar ni dejar de actuar con base en esta información sin antes consultar a un abogado autorizado sobre los hechos de su caso.",
          ],
        },
        {
          heading: "Sin relación abogado-cliente hasta la contratación",
          paragraphs: [
            "Visitar este sitio web, llamar o escribir por correo electrónico a la Firma, o enviar el formulario de contacto no crea una relación abogado-cliente. Esa relación existe solo después de que la Firma haya aceptado representarle y se haya firmado un contrato de servicios por escrito.",
          ],
        },
        {
          heading: "No envíe información confidencial",
          paragraphs: [
            "Mientras no exista una relación abogado-cliente, por favor no envíe información confidencial o muy delicada, como documentos migratorios, números de identificación o detalles de antecedentes penales, a través del formulario de contacto o por correo electrónico. La información enviada antes de ser cliente podría no considerarse confidencial ni protegida por el secreto profesional.",
            "Una breve descripción del tipo de ayuda que necesita es suficiente para que podamos responderle.",
          ],
        },
        {
          heading: "Sin garantía de resultados",
          paragraphs: [
            "Cada caso depende de sus propios hechos y circunstancias. Los resultados anteriores que se describan en este sitio web no garantizan un resultado similar, y la Firma no puede garantizar el resultado de ningún asunto.",
          ],
        },
        {
          heading: "Jurisdicción y licencia para ejercer",
          paragraphs: [
            "La abogada de la Firma tiene licencia para ejercer la abogacía en California, otorgada por el Colegio de Abogados de California (State Bar of California). Las leyes de inmigración son federales, lo que permite a un abogado de inmigración representar a clientes en asuntos migratorios ante agencias federales y tribunales de inmigración sin importar el estado donde viva el cliente. La Firma no brinda asesoría sobre asuntos de derecho estatal fuera de la(s) jurisdicción(es) donde sus abogados tienen licencia.",
          ],
        },
        {
          heading: "Traducciones",
          paragraphs: [
            "Las traducciones al español de este sitio web se ofrecen únicamente para su conveniencia. Si existe alguna diferencia o inconsistencia entre la versión en inglés y la versión en español, prevalecerá la versión en inglés.",
          ],
        },
      ],
    },
  },

  /* ------------------------------------------------------------------------ */
  /* Accessibility Statement                                                  */
  /* ------------------------------------------------------------------------ */
  accessibility: {
    en: {
      title: "Accessibility Statement",
      metaDescription:
        "Our commitment to an accessible website for everyone. We aim to meet WCAG 2.2 Level AA and welcome your feedback about any barriers you find on this site.",
      intro:
        "The Firm is committed to making this website accessible to everyone, including people with disabilities, and to offering its content in both English and Spanish.",
      sections: [
        {
          heading: "Our commitment",
          paragraphs: [
            "We want every visitor to be able to find information about our services and contact us easily. We treat accessibility as an ongoing effort and work to improve the site over time.",
          ],
        },
        {
          heading: "Accessibility standard",
          paragraphs: [
            "Our goal is for this website to conform to the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA. These guidelines explain how to make web content more accessible for people with a wide range of disabilities.",
          ],
        },
        {
          heading: "Measures we take",
          paragraphs: [
            "We build the site using semantic HTML and clear heading structure; support full keyboard navigation with visible focus indicators; provide text alternatives for meaningful images; use color combinations with sufficient contrast; and design layouts that work on phones, tablets and computers and when text is enlarged.",
            "All main content is available in both English and Spanish, and each page identifies its language so assistive technologies can read it correctly.",
          ],
        },
        {
          heading: "Known limitations",
          paragraphs: [
            "Despite our efforts, some content may not yet be fully accessible. For example, some documents or content provided by third parties, such as linked government websites or embedded services, may not meet the same standards. The embedded Google Maps map on our home and contact pages is provided by Google and may not be fully accessible; our address is always shown as text, with direct links to directions in Google Maps, Apple Maps and Waze.",
          ],
        },
        {
          heading: "Feedback and assistance",
          paragraphs: [
            "If you have difficulty using any part of this website, or if you need information in a different format, please let us know. You can call us at (213) 221-5099 or send us a message through the form on our Contact page, and we will work with you to provide the information in an accessible way.",
            "Please describe the page and the problem you experienced. We will do our best to respond promptly and to provide the information you need in an accessible way.",
          ],
        },
        {
          heading: "Review of this statement",
          paragraphs: [
            "This statement was last reviewed on September 29, 2026.",
          ],
        },
      ],
    },
    es: {
      title: "Declaración de accesibilidad",
      metaDescription:
        "Nuestro compromiso con un sitio web accesible para todos. Buscamos cumplir con WCAG 2.2 nivel AA y agradecemos sus comentarios sobre las barreras que encuentre.",
      intro:
        "La Firma se compromete a que este sitio web sea accesible para todas las personas, incluidas las personas con discapacidad, y a ofrecer su contenido en inglés y en español.",
      sections: [
        {
          heading: "Nuestro compromiso",
          paragraphs: [
            "Queremos que todos los visitantes puedan encontrar información sobre nuestros servicios y comunicarse con nosotros fácilmente. Consideramos la accesibilidad un esfuerzo continuo y trabajamos para mejorar el sitio con el tiempo.",
          ],
        },
        {
          heading: "Estándar de accesibilidad",
          paragraphs: [
            "Nuestro objetivo es que este sitio web cumpla con las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2, nivel AA. Estas pautas explican cómo hacer que el contenido web sea más accesible para personas con distintos tipos de discapacidad.",
          ],
        },
        {
          heading: "Medidas que tomamos",
          paragraphs: [
            "Construimos el sitio con HTML semántico y una estructura clara de encabezados; permitimos la navegación completa con el teclado con indicadores de foco visibles; ofrecemos textos alternativos para las imágenes con contenido relevante; usamos combinaciones de colores con contraste suficiente; y diseñamos páginas que funcionan en teléfonos, tabletas y computadoras, y cuando se amplía el texto.",
            "Todo el contenido principal está disponible en inglés y en español, y cada página indica su idioma para que las tecnologías de asistencia puedan leerla correctamente.",
          ],
        },
        {
          heading: "Limitaciones conocidas",
          paragraphs: [
            "A pesar de nuestros esfuerzos, es posible que parte del contenido aún no sea completamente accesible. Por ejemplo, algunos documentos o contenidos de terceros, como sitios web del gobierno enlazados o servicios integrados, podrían no cumplir con los mismos estándares. El mapa de Google Maps integrado en nuestras páginas de inicio y de contacto lo proporciona Google y podría no ser completamente accesible; nuestra dirección siempre aparece como texto, con enlaces directos a indicaciones en Google Maps, Apple Maps y Waze.",
          ],
        },
        {
          heading: "Comentarios y asistencia",
          paragraphs: [
            "Si tiene dificultades para usar cualquier parte de este sitio web o necesita información en otro formato, por favor avísenos. Puede llamarnos al (213) 221-5099 o enviarnos un mensaje mediante el formulario de nuestra página de Contacto, y buscaremos la manera de ofrecerle la información en un formato accesible.",
            "Describa la página y el problema que encontró. Haremos todo lo posible por responderle con prontitud y brindarle la información que necesita de forma accesible.",
          ],
        },
        {
          heading: "Revisión de esta declaración",
          paragraphs: [
            "Esta declaración se revisó por última vez el 29 de septiembre de 2026.",
          ],
        },
      ],
    },
  },
};
