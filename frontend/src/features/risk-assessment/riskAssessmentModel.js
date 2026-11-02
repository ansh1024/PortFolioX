import { validDate, dateLabel, number } from '../ipo/ipoModel.js';
export { number };
export const dimensions = [
  ['lossReaction', 'Reaction to loss'], ['lossTolerance', 'Loss tolerance'],
  ['emergencySavings', 'Emergency savings'], ['essentialExpenseDependency', 'Essential expense dependency'],
  ['debtManageability', 'Debt manageability'], ['investmentHorizon', 'Investment horizon'],
  ['investmentExperience', 'Investment experience'], ['investmentObjective', 'Investment objective'],
];
export { confirmedPrompts } from './riskQuestionnaire.js';
export const riskCategories = ['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'];
export const categoryLabel = value => riskCategories.includes(value) ? value.toLowerCase().replaceAll('_', ' ').replace(/^./, c => c.toUpperCase()) : 'Not recorded';
export const initialAnswers = () => Object.fromEntries(dimensions.map(([key]) => [key, null]));
export function validateAnswers(values) {
  return Object.fromEntries(dimensions.filter(([key]) => !Number.isInteger(values[key]) || values[key] < 0 || values[key] > 3)
    .map(([key]) => [key, 'Choose one answer before continuing.']));
}
// The legacy backend reverses dependency codes and safeguards wire code 3.
// Keep user-facing codes unchanged; adapt only at the request boundary.
export function answerPayload(values) {
  if (Object.keys(validateAnswers(values)).length) throw new Error('Complete all eight answers with integer codes 0–3.');
  return Object.fromEntries(dimensions.map(([key]) => [key, key === 'essentialExpenseDependency' ? 3 - values[key] : values[key]]));
}
export function hasQuestionnaire(questions) {
  return Array.isArray(questions) && questions.length === dimensions.length && dimensions.every(([key]) => {
    const question = questions.find(item => item.key === key);
    return question?.prompt?.trim() && Array.isArray(question.answers) && question.answers.length === 4
      && [0, 1, 2, 3].every(value => question.answers.some(answer => answer.value === value && answer.label?.trim()));
  });
}
export function validTimestamp(value) {
  return typeof value === 'string' && validDate(value.slice(0, 10)) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value) && Number.isFinite(Date.parse(value));
}
export function sortProfiles(profiles) {
  return [...(profiles || [])].sort((a, b) => {
    const x = validTimestamp(a.calculatedAt) ? a.calculatedAt : '';
    const y = validTimestamp(b.calculatedAt) ? b.calculatedAt : '';
    return y.localeCompare(x);
  });
}
export const recordDate = value => validTimestamp(value) ? dateLabel(value.slice(0, 10)) : 'Date not recorded';
export const validRiskScore = value => value !== null && value !== undefined && String(value).trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100;
export function validProfile(profile) {
  return profile && typeof profile === 'object' && !Array.isArray(profile) && typeof profile.riskProfileId === 'string' && validRiskScore(profile.riskScore) && riskCategories.includes(profile.riskCategory);
}
