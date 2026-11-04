// Samuel's EN FIance Visa LP tab t.3tj1brblix8k. Supplied, not user-approved.
export const questionsApproved = false;
export const questions = [
  { name: 'citizen', title: 'Are you a U.S. citizen?', options: ['Yes', 'No', 'Not sure'] },
  { name: 'location', title: 'Where is your fiancé(e) currently living?', options: ['Outside the United States', 'Inside the United States', 'Other / not sure'] },
  { name: 'married', title: 'Are you currently legally married?', options: ['No', 'Yes', 'Not sure about our legal status'] },
  { name: 'met', title: 'Have you met in person within the past two years?', options: ['Yes', 'No', 'Not sure'] },
  { name: 'consultation', title: 'Would you be willing to invest $150 in a 45-minute consultation directly with an immigration attorney to discuss your case and immigration options?', options: [
    'A. Yes, I am ready to invest $150 to speak directly with an immigration attorney about my case.',
    'B. I am open to a paid consultation, but I am not ready to schedule it yet.',
    'C. I am looking for free or pro bono immigration assistance.'
  ] }
];
// Every supplied choice proceeds. This is intake routing, not eligibility screening.
export function nextStep(step, option) {
  return Number.isInteger(step) && questions[step]?.options.includes(option) ? step + 1 : step;
}
