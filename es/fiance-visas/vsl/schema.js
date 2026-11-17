// Samuel's ES FIance Visa LP tab t.4t199yylhd7j. Supplied by Samuel; publication and activation approved by user.
export const questionsApproved = true;
export const questions = [
  { name: 'citizen', title: '¿Es usted ciudadano(a) de Estados Unidos?', options: ['Sí', 'No', 'No estoy seguro(a)'] },
  { name: 'location', title: '¿Dónde vive actualmente su prometido(a)?', options: ['Fuera de Estados Unidos', 'Dentro de Estados Unidos', 'Otro', 'No estoy seguro(a)'] },
  { name: 'married', title: '¿Actualmente están legalmente casados?', options: ['No', 'Sí', 'No estoy seguro(a) de nuestro estado civil legal'] },
  { name: 'met', title: '¿Se han reunido en persona durante los últimos dos años?', options: ['Sí', 'No', 'No estoy seguro(a)'] },
  { name: 'consultation', title: '¿Estaría dispuesto(a) a invertir $150 en una consulta de 45 minutos directamente con un abogado de inmigración para hablar sobre su caso y sus opciones migratorias?', options: [
    'A. Sí, estoy listo(a) para invertir $150 para hablar directamente con un abogado de inmigración sobre mi caso.',
    'B. Estoy dispuesto(a) a tener una consulta pagada, pero todavía no estoy listo(a) para agendarla.',
    'C. Busco ayuda migratoria gratuita o pro bono.'
  ] }
];
// All supplied choices proceed; no legal eligibility determination.
export function nextStep(step, option) {
  return Number.isInteger(step) && questions[step]?.options.includes(option) ? step + 1 : step;
}
