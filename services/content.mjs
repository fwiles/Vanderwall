// Service landing copy. Research and claim mapping: copy/service-landing-research.html.
const sources = {
  fiance: 'https://travel.state.gov/content/travel/en/us-visas/immigrate/family-immigration/nonimmigrant-visa-for-a-fiance-k-1.html',
  spouse: 'https://travel.state.gov/content/travel/en/us-visas/immigrate/family-immigration/immigrant-visa-for-spouse.html',
  eligibility: 'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-245/section-245.1',
  filing: 'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-245/section-245.2',
  work: 'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-274a/subpart-B/section-274a.12',
  medical: 'https://content.govdelivery.com/accounts/USDHSCIS/bulletins/3c50050'
};
export const servicePages = [
  {
    slug: 'fiance-visas',
    en: {
      title: 'K-1 Fiancé & Partner Visa Lawyers | Vanderwall Immigration',
      description: 'Planning a life together in the U.S.? Get help with K-1 fiancé visas, spouse visa options and the next green card steps. Book a free intake appointment.',
      eyebrow: 'K-1 fiancé visas · Immigration help for couples',
      heading: 'Your future together deserves a clear immigration plan.',
      lead: 'Ready to bring your fiancé to the United States? Already married and comparing your options? Vanderwall Immigration helps you understand the path ahead, prepare your case and take the next step together.',
      checks: ['A plan for your relationship, your timeline and your next chapter.', 'Help organizing relationship evidence and visa paperwork.', 'English and Spanish support from offices in Beaverton and Salem.'],
      formTitle: 'Let’s talk about your future together',
      questions: [
        ['Which best describes your relationship?', ['Engaged / planning to marry — interested in a K-1', 'Already married — interested in a spouse visa', 'Entered with a K-1 and now need a green card', 'Not sure which path fits us']],
        ['Where is the partner who needs immigration help?', ['Outside the United States', 'Inside the United States', 'Not sure how to describe our situation']]
      ],
      servicesTitle: 'From “which visa?” to a plan you understand',
      servicesLead: 'You should know what comes next before making life-changing plans.',
      services: [
        ['Choose the right starting point', 'Review your relationship, citizenship and immigration history before committing to a filing strategy.'],
        ['Build a well-supported case', 'Get help bringing your documents and relationship story together into a consistent application.'],
        ['Prepare for the next stage', 'Understand the consular process and plan ahead for the green card application after marriage.']
      ],
      stanceTitle: 'Fiancé visa or spouse visa? Start with your situation.',
      stanceLead: 'Searching for a “partner visa” can lead to very different answers. Your marital status and your partner’s location help determine which process to discuss.',
      cards: [
        ['Engaged, with a partner abroad', 'A K-1 is for the foreign fiancé of a U.S. citizen. Both must be free to marry and intend to marry within 90 days of K-1 entry.'],
        ['Already married', 'Discuss a spouse immigrant visa, such as CR-1 or IR-1 for a U.S. citizen’s spouse. Living together alone does not establish a qualifying marriage.'],
        ['Your partner is already in the U.S.', 'Ask whether adjustment of status is available before deciding to travel or start a different application.']
      ],
      stanceCta: 'Talk through our options',
      faqs: [
        ['Do we have to have met in person?', 'Generally, you must have met in person during the two years before filing the K-1 petition. Limited waivers exist. Discuss your circumstances before assuming an exception applies.', sources.fiance],
        ['Does a K-1 automatically include a green card?', 'No. After marrying the U.S. citizen petitioner within 90 days of entry, the foreign spouse must separately apply for adjustment of status and meet its requirements.', sources.eligibility],
        ['What if my partner is a permanent resident?', 'K-1 sponsorship requires U.S. citizenship. If your partner has a green card, discuss marriage-based immigration options and visa availability with an attorney.', sources.fiance],
        ['Can I work as soon as I arrive?', 'Do not assume arrival or a pending application authorizes employment. Ask about the employment authorization you need and how to plan for the period before you can work.', sources.work],
        ['How long will it take?', 'Timing varies by case and government processing. Ask us to discuss the stages and planning considerations for your situation; we cannot promise an approval date.'],
        ['What should we prepare for an attorney consultation?', 'Bring identification, relationship records, prior marriage documents if applicable, and any immigration notices. You do not need to upload documents to book an intake appointment.']
      ],
      finalTitle: 'Start planning your life together.',
      finalLead: 'You do not need to know which form to file before contacting us. Start with a free intake appointment and learn the next steps.',
      related: ['Already in the U.S.? Explore adjustment of status', '/adjustment-of-status/']
    },
    es: {
      title: 'Abogados de Visas K-1 para Prometidos y Parejas | Vanderwall Immigration',
      description: '¿Planean una vida juntos en EE. UU.? Ayuda con visas K-1, opciones para cónyuges y los próximos pasos hacia la residencia. Reserve una cita gratuita de admisión.',
      eyebrow: 'Visas K-1 para prometidos · Inmigración para parejas',
      heading: 'Su futuro juntos merece un plan migratorio claro.',
      lead: '¿Quiere traer a su prometido(a) a Estados Unidos? ¿Ya están casados y están comparando opciones? Vanderwall Immigration le ayuda a entender el camino, preparar su caso y dar el siguiente paso en pareja.',
      checks: ['Un plan que tenga en cuenta su relación, sus tiempos y su futuro.', 'Ayuda para organizar las pruebas de su relación y los documentos.', 'Atención en español e inglés, con oficinas en Beaverton y Salem.'],
      formTitle: 'Hablemos de su futuro juntos',
      questions: [
        ['¿Cuál opción describe mejor su relación?', ['Estamos comprometidos o planeamos casarnos — visa K-1', 'Ya estamos casados — visa para cónyuge', 'Entré con una K-1 y ahora necesito la residencia', 'No sabemos qué opción nos corresponde']],
        ['¿Dónde está la persona que necesita ayuda migratoria?', ['Fuera de Estados Unidos', 'Dentro de Estados Unidos', 'No sé cómo describir nuestra situación']]
      ],
      servicesTitle: 'De las dudas sobre visas a un plan claro',
      servicesLead: 'Conozca los próximos pasos antes de tomar decisiones que cambiarán su vida.',
      services: [
        ['Elegir por dónde empezar', 'Revisar su relación, ciudadanía e historial migratorio antes de elegir una estrategia.'],
        ['Preparar un caso bien documentado', 'Recibir ayuda para reunir sus documentos y presentar la historia de su relación de manera coherente.'],
        ['Prepararse para la siguiente etapa', 'Entender el proceso consular y planear la solicitud de residencia después del matrimonio.']
      ],
      stanceTitle: '¿Visa de prometido o de cónyuge? Depende de su situación.',
      stanceLead: 'Buscar una “visa para pareja” puede llevar a respuestas muy distintas. Su estado civil y la ubicación de su pareja ayudan a determinar qué proceso considerar.',
      cards: [
        ['Comprometidos y con una persona en el extranjero', 'La K-1 es para el prometido extranjero de un ciudadano estadounidense. Ambos deben poder casarse legalmente y tener intención de hacerlo dentro de los 90 días de la entrada con K-1.'],
        ['Ya están casados', 'Pregunte por una visa de inmigrante para cónyuge, como CR-1 o IR-1 para el cónyuge de un ciudadano. Vivir juntos, por sí solo, no establece un matrimonio válido para este trámite.'],
        ['Su pareja ya está en Estados Unidos', 'Consulte si puede solicitar un ajuste de estatus antes de decidir viajar o iniciar otro trámite.']
      ],
      stanceCta: 'Hablar de nuestras opciones',
      faqs: [
        ['¿Tenemos que habernos conocido en persona?', 'Generalmente deben haberse visto en persona durante los dos años anteriores a la petición K-1. Existen excepciones limitadas que requieren una exención. Consulte antes de suponer que califica.', sources.fiance],
        ['¿La K-1 incluye automáticamente la residencia?', 'No. Después de casarse con el ciudadano peticionario dentro de los 90 días de su entrada, el cónyuge extranjero debe solicitar el ajuste de estatus por separado y cumplir sus requisitos.', sources.eligibility],
        ['¿Y si mi pareja es residente permanente?', 'Para patrocinar una K-1 se requiere ciudadanía estadounidense. Si su pareja tiene residencia permanente, consulte las opciones por matrimonio y la disponibilidad de visas.', sources.fiance],
        ['¿Puedo trabajar al llegar?', 'No suponga que su llegada o una solicitud pendiente le autorizan a trabajar. Pregunte qué autorización de empleo necesita y cómo planear el tiempo antes de poder trabajar.', sources.work],
        ['¿Cuánto tarda el proceso?', 'Depende del caso y de los tiempos del gobierno. Podemos hablar de las etapas y de lo que debe considerar al planear; no podemos prometer una fecha de aprobación.'],
        ['¿Qué debemos preparar para la consulta con un abogado?', 'Identificación, pruebas de la relación, documentos de matrimonios anteriores si corresponde y avisos migratorios. No necesita subir documentos para reservar la cita de admisión.']
      ],
      finalTitle: 'Empiecen a planear su vida juntos.',
      finalLead: 'No necesita saber qué formulario presentar para contactarnos. Empiece con una cita gratuita de admisión y conozca los próximos pasos.',
      related: ['¿Ya está en EE. UU.? Conozca el ajuste de estatus', '/es/adjustment-of-status/']
    }
  },
  {
    slug: 'adjustment-of-status',
    en: {
      title: 'I-485 Adjustment of Status Lawyers | Vanderwall Immigration',
      description: 'Already in the U.S. and considering a green card? Get help reviewing eligibility, preparing Form I-485 and planning your next steps. Free intake appointment.',
      eyebrow: 'Form I-485 · Adjustment of status attorneys',
      heading: 'Build your future here. Understand your green card options.',
      lead: 'If you are already in the United States, adjustment of status may let you apply for permanent residence here. Vanderwall Immigration helps you understand eligibility and prepare for the steps ahead.',
      checks: ['An eligibility review before you commit to filing.', 'Help with the I-485 application and supporting evidence.', 'Clear guidance in English or Spanish, from preparation to interview.'],
      formTitle: 'Let’s talk about your green card',
      questions: [
        ['What do you need help with?', ['Green card through marriage or family', 'Adjustment after entering with a K-1 fiancé visa', 'An I-485 already filed / a USCIS notice', 'Another basis for adjustment of status', 'Not sure whether I qualify']],
        ['Where is the person applying for a green card?', ['Inside the United States', 'Outside the United States', 'Not sure which process applies']]
      ],
      servicesTitle: 'More than a form. A plan for your case.',
      servicesLead: 'Get help connecting your immigration history, supporting documents and next steps.',
      services: [
        ['Understand eligibility first', 'Review your entry history, immigration category and potential obstacles before filing.'],
        ['Prepare the application', 'Get help assembling the I-485 and supporting evidence, with attention to consistency and completeness.'],
        ['Know what comes next', 'Prepare for an interview if required and understand what a USCIS request means for your case.']
      ],
      stanceTitle: 'Before you file, get answers to the questions that matter.',
      stanceLead: 'Your family, work and travel plans depend on more than a receipt notice. Make room for those questions at the start.',
      cards: [
        ['Can I apply from inside the U.S.?', 'Eligibility depends on your category, entry history, visa availability and other requirements. Marriage alone does not make everyone eligible.'],
        ['What documents belong in my packet?', 'Ask about the petition, financial sponsorship and medical documentation that apply to your case. Missing required items can hold up a filing.'],
        ['What happens while I wait?', 'Discuss employment authorization and travel before making commitments. Filing an I-485 does not itself give permission to work or travel.']
      ],
      stanceCta: 'Discuss my next step',
      faqs: [
        ['What is Form I-485?', 'It is the application to adjust to permanent resident status while in the United States. It is different from a family petition, such as Form I-130, which establishes the qualifying relationship.', sources.filing],
        ['Can I file the I-130 and I-485 together?', 'In eligible cases, yes. An attorney can review whether your category and visa availability permit concurrent filing.', sources.filing],
        ['What if I overstayed or entered without inspection?', 'The rules and exceptions depend on your history and category. An overstay and entry without inspection are different issues. Have an attorney review your circumstances before filing.', sources.eligibility],
        ['Can I work while my I-485 is pending?', 'You need valid employment authorization. Eligible adjustment applicants can request a work permit, but a pending I-485 alone does not authorize employment.', sources.work],
        ['Can I travel outside the United States?', 'Departure without advance parole generally abandons a pending adjustment application, with limited exceptions. Have an attorney review your status and travel plans before leaving.', sources.filing],
        ['Do I need a medical exam with my application?', 'If USCIS requires Form I-693 or a partial I-693 for your filing, it must accompany the I-485. Ask about the requirements for your category before submitting the packet.', sources.medical],
        ['How long will my case take?', 'There is no single timeline for every I-485. Case details and government processing affect the wait. We can discuss preparation and next steps without promising a decision date.']
      ],
      finalTitle: 'Take the next step toward your future here.',
      finalLead: 'Whether you are getting started or already have a USCIS notice, book a free intake appointment to discuss the next steps.',
      related: ['Planning to bring a fiancé to the U.S.? Explore K-1 visas', '/fiance-visas/']
    },
    es: {
      title: 'Abogados de Ajuste de Estatus I-485 | Vanderwall Immigration',
      description: '¿Está en EE. UU. y quiere solicitar la residencia? Ayuda para revisar su elegibilidad, preparar el I-485 y planear los próximos pasos. Cita gratuita de admisión.',
      eyebrow: 'Formulario I-485 · Abogados de ajuste de estatus',
      heading: 'Construya su futuro aquí. Conozca sus opciones de residencia.',
      lead: 'Si ya está en Estados Unidos, el ajuste de estatus podría permitirle solicitar la residencia permanente aquí. Vanderwall Immigration le ayuda a entender si cumple los requisitos y a preparar los siguientes pasos.',
      checks: ['Revisión de su elegibilidad antes de decidir presentar la solicitud.', 'Ayuda con el formulario I-485 y las pruebas de respaldo.', 'Orientación clara en español o inglés, desde la preparación hasta la entrevista.'],
      formTitle: 'Hablemos de su residencia',
      questions: [
        ['¿En qué necesita ayuda?', ['Residencia por matrimonio o petición familiar', 'Ajuste después de entrar con visa K-1', 'Un I-485 ya presentado o un aviso de USCIS', 'Otro motivo para solicitar el ajuste de estatus', 'No sé si cumplo los requisitos']],
        ['¿Dónde está la persona que solicita la residencia?', ['Dentro de Estados Unidos', 'Fuera de Estados Unidos', 'No sé qué proceso corresponde']]
      ],
      servicesTitle: 'Más que un formulario. Un plan para su caso.',
      servicesLead: 'Reciba ayuda para organizar su historial migratorio, sus documentos y los próximos pasos.',
      services: [
        ['Entender primero su elegibilidad', 'Revisar su entrada al país, categoría migratoria y posibles obstáculos antes de presentar la solicitud.'],
        ['Preparar la solicitud', 'Recibir ayuda con el I-485 y las pruebas de respaldo, prestando atención a que sean completas y coherentes.'],
        ['Conocer lo que sigue', 'Prepararse para una entrevista si se requiere y entender qué significa una solicitud de USCIS para su caso.']
      ],
      stanceTitle: 'Antes de presentar, aclare las preguntas importantes.',
      stanceLead: 'Sus planes de familia, trabajo y viajes dependen de más que un aviso de recibo. Hable de esas dudas desde el principio.',
      cards: [
        ['¿Puedo solicitar desde Estados Unidos?', 'Depende de su categoría, historial de entrada, disponibilidad de visas y otros requisitos. Casarse no significa que toda persona pueda ajustar su estatus.'],
        ['¿Qué documentos debo incluir?', 'Pregunte qué petición, patrocinio económico y documentos médicos corresponden a su caso. La falta de documentos requeridos puede retrasar el trámite.'],
        ['¿Qué pasa mientras espero?', 'Consulte sobre permisos de trabajo y viajes antes de hacer planes. Presentar el I-485 no otorga por sí solo autorización para trabajar o viajar.']
      ],
      stanceCta: 'Hablar de mi próximo paso',
      faqs: [
        ['¿Qué es el formulario I-485?', 'Es la solicitud para ajustar su estatus al de residente permanente dentro de Estados Unidos. Es distinto de una petición familiar, como el I-130, que establece el vínculo familiar correspondiente.', sources.filing],
        ['¿Puedo presentar el I-130 y el I-485 juntos?', 'Sí, en casos elegibles. Un abogado puede revisar si su categoría y la disponibilidad de visas permiten presentarlos al mismo tiempo.', sources.filing],
        ['¿Qué pasa si excedí mi estadía o entré sin inspección?', 'Las reglas y excepciones dependen de su historial y categoría. Exceder una estadía y entrar sin inspección son situaciones distintas. Consulte su caso con un abogado antes de presentar.', sources.eligibility],
        ['¿Puedo trabajar mientras mi I-485 está pendiente?', 'Necesita una autorización de empleo válida. Los solicitantes elegibles pueden pedir un permiso de trabajo, pero tener un I-485 pendiente no autoriza por sí solo a trabajar.', sources.work],
        ['¿Puedo viajar fuera de Estados Unidos?', 'Salir sin permiso adelantado de viaje generalmente implica abandonar la solicitud pendiente, con excepciones limitadas. Consulte su estatus y sus planes con un abogado antes de salir.', sources.filing],
        ['¿Debo incluir el examen médico con la solicitud?', 'Si USCIS exige el I-693 completo o parcial para su trámite, debe incluirlo con el I-485. Consulte los requisitos de su categoría antes de enviar los documentos.', sources.medical],
        ['¿Cuánto tardará mi caso?', 'No hay un plazo único para todos los I-485. Influyen los detalles del caso y los tiempos del gobierno. Podemos hablar de la preparación y los próximos pasos sin prometer una fecha de decisión.']
      ],
      finalTitle: 'Dé el próximo paso hacia su futuro aquí.',
      finalLead: 'Ya sea que esté empezando o tenga un aviso de USCIS, reserve una cita gratuita de admisión para hablar de los próximos pasos.',
      related: ['¿Quiere traer a su prometido(a)? Conozca la visa K-1', '/es/fiance-visas/']
    }
  }
];
