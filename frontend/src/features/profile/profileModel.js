import { validProfile, sortProfiles } from '../risk-assessment/riskAssessmentModel.js';
export function validUser(user, id) { return !!user && Number.isSafeInteger(user.userId) && user.userId > 0 && String(user.userId) === String(id) && typeof user.name === 'string' && typeof user.email === 'string' && ['USER','ADMIN'].includes(user.role); }
export const profileInitials = name => typeof name === 'string' ? name.trim().split(/\s+/).filter(Boolean).slice(0,2).map(word=>word[0]).join('').toUpperCase() : '';
export const latestRisk = records => sortProfiles((records || []).filter(validProfile))[0] || null;
