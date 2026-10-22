// Client-supplied service-fit criteria. These are not eligibility determinations.
export const questions = [
  { name: 'spouse_location', title: 'Where is the spouse seeking a green card currently living?', options: [
    ['inside', 'Inside the United States'], ['outside', 'Outside the United States']
  ] },
  { name: 'marital_status', title: 'Are you currently legally married?', options: [
    ['married', 'Yes'], ['planning', 'No, but we plan to marry'], ['not-planning', 'No, and we do not currently plan to marry', true]
  ] },
  { name: 'petitioner_status', title: 'What is the immigration status of the petitioning spouse?', options: [
    ['citizen', 'U.S. citizen'], ['resident', 'Lawful permanent resident / green card holder'], ['neither', 'Neither', true]
  ] },
  { name: 'entry', title: 'How did the spouse seeking a green card most recently enter the United States?', options: [
    ['visa', 'With a visa and inspection by an immigration officer'], ['esta', 'Through the Visa Waiver Program / ESTA'], ['parole', 'With parole granted by immigration officials'], ['without-inspection', 'Without inspection by an immigration officer'], ['other', 'Another way'], ['unsure', 'Not sure']
  ] },
  { name: 'proceedings', title: 'Is that spouse currently detained by immigration authorities, involved in an active immigration court case, or have they ever received a deportation order?', options: [
    ['detained', 'Currently detained', true], ['court', 'In an active immigration court case', true], ['order', 'Prior deportation order'], ['none', 'None of the above'], ['unsure', 'Not sure']
  ] },
  { name: 'consultation', title: 'Would you be willing to invest $150 for a 45-minute consultation directly with an immigration attorney to discuss your case and immigration options?', options: [
    ['ready', 'Yes, I’m ready to invest $150 to speak directly with an immigration attorney about my case.'], ['not-ready', 'I’m open to a paid consultation, but I’m not ready to book yet.'], ['free', 'I’m looking for free or pro bono immigration help.', true]
  ] }
];
export const contactMethods = ['Phone call', 'Text message', 'Email'];
export const states = 'Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|District of Columbia|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|U.S. territory|Outside the United States'.split('|');
export const disqualificationMessage = 'Based on your answers, we cannot offer a consultation through this form. This is a service-fit decision, not a determination of immigration eligibility. Your request has not been sent.';
export function isDisqualified(answers) {
  return questions.some(q => q.options.some(([value, , disqualified]) => disqualified && answers[q.name] === value));
}

// Preserve answer values and screening flags across languages.
const spanishCopy = [
  ['¿Dónde vive actualmente el cónyuge que desea obtener la residencia permanente?', [
    'Dentro de Estados Unidos', 'Fuera de Estados Unidos'
  ]],
  ['¿Están legalmente casados actualmente?', [
    'Sí', 'No, pero planeamos casarnos', 'No, y actualmente no planeamos casarnos'
  ]],
  ['¿Cuál es el estatus migratorio del cónyuge que presenta la petición?', [
    'Ciudadano de Estados Unidos', 'Residente permanente legal / titular de una tarjeta de residencia', 'Ninguno de los anteriores'
  ]],
  ['¿Cómo ingresó por última vez a Estados Unidos el cónyuge que desea obtener la residencia permanente?', [
    'Con una visa y una inspección por un oficial de inmigración', 'A través del Programa de Exención de Visa / ESTA', 'Con un permiso de permanencia temporal (parole) otorgado por las autoridades de inmigración', 'Sin inspección por un oficial de inmigración', 'De otra manera', 'No estoy seguro/a'
  ]],
  ['¿Ese cónyuge está actualmente detenido por las autoridades de inmigración, tiene un caso activo en la corte de inmigración o ha recibido alguna vez una orden de deportación?', [
    'Actualmente está detenido', 'Tiene un caso activo en la corte de inmigración', 'Recibió una orden de deportación anteriormente', 'Ninguna de las anteriores', 'No estoy seguro/a'
  ]],
  ['¿Estaría dispuesto/a a invertir $150 en una consulta de 45 minutos directamente con un abogado de inmigración para hablar sobre su caso y sus opciones migratorias?', [
    'Sí, estoy listo/a para invertir $150 para hablar directamente con un abogado de inmigración sobre mi caso.', 'Estoy abierto/a a una consulta de pago, pero todavía no estoy listo/a para agendarla.', 'Busco ayuda de inmigración gratuita o pro bono.'
  ]]
];
export const spanishQuestions = questions.map((question, index) => ({
  ...question,
  title: spanishCopy[index][0],
  options: question.options.map(([value, , ...flags], option) => [value, spanishCopy[index][1][option], ...flags])
}));
export const spanishDisqualificationMessage = 'Según sus respuestas, no podemos ofrecerle una consulta a través de este formulario. Esta decisión se basa en los servicios que ofrecemos y no determina su elegibilidad migratoria. Su solicitud no se ha enviado.';
