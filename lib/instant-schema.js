// Field and option IDs from ENGLISH - META FORM.pdf. See copy/instant-form-source.md.
export const lawmaticsEndpoint = 'https://api.lawmatics.com/v1/forms/38523386-dfcf-4408-932e-aaca2901fd97/submit';
export const questions = [
  {
    name: 'custom_field_944045', short: 'Type of help', title: 'What type of immigration help are you looking for?',
    hint: 'Choose the option that best fits. It’s okay if you’re not sure yet.',
    options: [
      ['1799586', 'Green card through family or marriage'],
      ['1799587', 'Fiancé(e) visa'],
      ['1799588', 'Citizenship or naturalization'],
      ['1799589', 'Work permit'],
      ['1799590', 'Humanitarian immigration (ex. U visa, T visa, VAWA)'],
      ['1799591', 'Deportation, Immigration court, Detention'],
      ['1799592', 'Asylum'],
      ['1799593', 'Other / Not sure']
    ]
  },
  {
    name: 'custom_field_944048', short: 'Who needs help', title: 'Who needs immigration help?',
    hint: 'You can reach out for yourself or someone in your family.',
    options: [['1799594', 'Me'], ['1799595', 'My spouse or fiancé(e)'], ['1799596', 'My parent'], ['1799597', 'My child'], ['1799598', 'Another family member']]
  },
  {
    name: 'custom_field_944049', short: 'Location', title: 'Where is the person who needs immigration help currently located?',
    hint: 'Tell us where they are currently located.',
    options: [['1799599', 'Inside the United States'], ['1799600', 'Outside the United States']]
  },
  {
    name: 'custom_field_944050', short: 'Your next step', title: 'Are you looking to hire an immigration attorney?',
    hint: 'Whether you’re starting a case or exploring your options, tell us where you are.',
    options: [['1799605', 'Yes, I’m looking for help to start a case.'], ['1799606', 'Yes, I’m looking for help with a case that is pending.'], ['1799607', 'Maybe, I want to understand my options']]
  },
  {
    name: 'custom_field_944051', short: 'Consultation', title: 'Would you be willing to invest $150 for a 45-minute consultation directly with an immigration attorney to discuss your case and immigration options?',
    hint: 'A consultation is an opportunity to speak directly with an immigration attorney. No payment is collected on this form.',
    options: [['1799610', 'Yes, I’m ready to invest $150 to speak directly with an immigration attorney about my case.'], ['1799609', 'I’m open to a paid consultation, but I’m not ready to book yet.'], ['1799608', 'I’m looking for free or pro bono immigration help.']]
  }
];

// Spanish IDs and full labels verified against its own public Lawmatics form.
export const spanishQuestions = [
  {
    "name": "custom_field_944054",
    "short": "Tipo de ayuda",
    "title": "¿Qué tipo de ayuda migratoria está buscando?",
    "hint": "Elija la opción que mejor describa su situación. No hay problema si aún no está seguro(a).",
    "options": [
      [
        "1799615",
        "Residencia permanente por familia o matrimonio"
      ],
      [
        "1799616",
        "Visa de prometido(a)"
      ],
      [
        "1799617",
        "Ciudadanía o naturalización"
      ],
      [
        "1799618",
        "Permiso de trabajo"
      ],
      [
        "1799619",
        "Inmigración humanitaria (por ejemplo, visa U, visa T, VAWA)"
      ],
      [
        "1799620",
        "Deportación, corte de inmigración o detención"
      ],
      [
        "1799621",
        "Asilo"
      ],
      [
        "1799622",
        "Otro / No estoy seguro(a)"
      ]
    ]
  },
  {
    "name": "custom_field_944055",
    "short": "Quién necesita ayuda",
    "title": "¿Quién necesita ayuda migratoria?",
    "hint": "Puede solicitar ayuda para usted o para un familiar.",
    "options": [
      [
        "1799623",
        "Yo"
      ],
      [
        "1799624",
        "Mi esposo(a) o prometido(a)"
      ],
      [
        "1799625",
        "Mi padre o madre"
      ],
      [
        "1799626",
        "Mi hijo(a)"
      ],
      [
        "1799627",
        "Otro familiar"
      ]
    ]
  },
  {
    "name": "custom_field_944056",
    "short": "Ubicación",
    "title": "¿Dónde se encuentra actualmente la persona que necesita ayuda migratoria?",
    "hint": "Indique dónde se encuentra esa persona actualmente.",
    "options": [
      [
        "1799628",
        "Dentro de Estados Unidos"
      ],
      [
        "1799629",
        "Fuera de Estados Unidos"
      ]
    ]
  },
  {
    "name": "custom_field_944057",
    "short": "Su próximo paso",
    "title": "¿Está buscando contratar a un abogado de inmigración?",
    "hint": "Cuéntenos si desea iniciar un caso, continuar uno pendiente o conocer sus opciones.",
    "options": [
      [
        "1799630",
        "Sí, necesito ayuda para iniciar un caso."
      ],
      [
        "1799631",
        "Sí, necesito ayuda con un caso que está pendiente."
      ],
      [
        "1799632",
        "Tal vez, quiero entender mis opciones."
      ]
    ]
  },
  {
    "name": "custom_field_944059",
    "short": "Consulta",
    "title": "¿Estaría dispuesto(a) a invertir $150 por una consulta de 45 minutos directamente con un abogado de inmigración para hablar sobre su caso y sus opciones migratorias?",
    "hint": "No se realiza ningún cobro a través de este formulario.",
    "options": [
      [
        "1799719",
        "Sí, estoy listo(a) para invertir $150 para hablar directamente con un abogado de inmigración sobre mi caso."
      ],
      [
        "1799718",
        "Estoy dispuesto(a) a tener una consulta pagada, pero todavía no estoy listo(a) para agendarla."
      ],
      [
        "1799717",
        "Estoy buscando ayuda migratoria gratuita o pro bono."
      ]
    ]
  }
];
export const spanishLawmaticsEndpoint = "https://api.lawmatics.com/v1/forms/763da8f0-71d6-4400-9942-15a3a003bb56/submit";
export const instantForms = {
  en: { questions, lawmaticsEndpoint },
  es: { questions: spanishQuestions, lawmaticsEndpoint: spanishLawmaticsEndpoint }
};

// Client screening rules received September 29, 2026. Local-only options never
// reach Lawmatics; its public forms do not yet define these service categories.
for (const [language, form] of Object.entries(instantForms)) {
  const service = form.questions[0];
  service.options.splice(service.options.length - 1, 0, ['affirmative-asylum', language === 'es' ? 'Asilo afirmativo' : 'Affirmative Asylum']);
  // The public CRM forms currently have only the broader Asylum category.
  service.lawmaticsValues = { 'affirmative-asylum': language === 'es' ? '1799621' : '1799592' };
  service.options.splice(service.options.length - 1, 0, ...(language === 'es' ? [
    ['employment-business-investment', 'Visas de empleo, negocios o inversión'],
    ['student-tourist-exchange', 'Visas de estudiante, turista o intercambio J-1'],
    ['agriculture-seasonal', 'Visas agrícolas o de temporada']
  ] : [
    ['employment-business-investment', 'Employment, Business or Investment Visas'],
    ['student-tourist-exchange', 'Student, Tourist, J-1 Exchange Visitor Visas'],
    ['agriculture-seasonal', 'Agriculture, Seasonal Visa']
  ]));
  service.disqualifyingOptions = [language === 'es' ? '1799620' : '1799591',
    'employment-business-investment', 'student-tourist-exchange', 'agriculture-seasonal'];
  form.questions[4].disqualifyingOptions = [language === 'es' ? '1799717' : '1799608'];
}

export function isDisqualified(language, answers) {
  return instantForms[language].questions.some(q => q.disqualifyingOptions?.includes(answers[q.name]));
}

export const disqualificationMessages = {
  en: 'Based on your answers, we cannot offer a consultation through this form. Your request has not been sent. You can go back to review your answers.',
  es: 'Según sus respuestas, no podemos ofrecerle una consulta a través de este formulario. Su solicitud no se ha enviado. Puede volver para revisar sus respuestas.'
};
