// Client-supplied service-fit criteria. These are not eligibility determinations.
export const questions = [
  { name: 'spouse_location', title: 'Where is the spouse seeking a green card currently living?', options: [
    ['inside', 'Inside the United States'], ['outside', 'Outside the United States', true]
  ] },
  { name: 'marital_status', title: 'Are you currently legally married?', options: [
    ['married', 'Yes'], ['planning', 'No, but we plan to marry'], ['not-planning', 'No, and we do not currently plan to marry', true]
  ] },
  { name: 'petitioner_status', title: 'What is the immigration status of the petitioning spouse?', options: [
    ['citizen', 'U.S. citizen'], ['resident', 'Lawful permanent resident / green card holder'], ['neither', 'Neither', true]
  ] },
  { name: 'entry', title: 'How did the spouse seeking a green card most recently enter the United States?', options: [
    ['visa', 'With a visa and inspection by an immigration officer'], ['esta', 'Through the Visa Waiver Program / ESTA'], ['parole', 'With parole granted by immigration officials'], ['without-inspection', 'Without inspection by an immigration officer', true], ['other', 'Another way'], ['unsure', 'Not sure']
  ] },
  { name: 'proceedings', title: 'Is that spouse currently detained by immigration authorities, involved in an active immigration court case, or have they ever received a deportation order?', options: [
    ['detained', 'Currently detained', true], ['court', 'In an active immigration court case', true], ['order', 'Prior deportation order', true], ['none', 'None of the above'], ['unsure', 'Not sure']
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
