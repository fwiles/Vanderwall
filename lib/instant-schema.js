// Field and option IDs from ENGLISH - META FORM.pdf. See copy/instant-form-source.md.
export const lawmaticsEndpoint = 'https://api.lawmatics.com/v1/forms/38523386-dfcf-4408-932e-aaca2901fd97/submit';
export const questions = [
  {
    name: 'custom_field_944045', short: 'Type of help', title: 'What type of immigration help do you need?',
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
    name: 'custom_field_944049', short: 'Location', title: 'Where is the person who needs immigration help?',
    hint: 'Tell us where they are currently located.',
    options: [['1799599', 'Inside the United States'], ['1799600', 'Outside the United States']]
  },
  {
    name: 'custom_field_944050', short: 'Your next step', title: 'Are you looking to hire an immigration attorney?',
    hint: 'Whether you’re starting a case or exploring your options, tell us where you are.',
    options: [['1799605', 'Yes, I’m looking for help to start a case.'], ['1799606', 'Yes, I’m looking for help with a case that is pending.'], ['1799607', 'Maybe, I want to understand my options']]
  },
  {
    name: 'custom_field_944051', short: 'Consultation', title: 'Would you be willing to invest $150 in a consultation?',
    hint: 'A consultation is an opportunity to speak directly with an immigration attorney. No payment is collected on this form.',
    options: [['1799610', 'Yes, I’m ready to invest $150 to speak directly with an immigration attorney.'], ['1799609', 'I’m open to a paid consultation, but I’m not ready to schedule yet.'], ['1799608', 'I’m looking for free or pro bono immigration help.']]
  }
];
