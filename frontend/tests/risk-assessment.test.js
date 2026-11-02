import test from 'node:test';
import { riskQuestionnaire } from '../src/features/risk-assessment/riskQuestionnaire.js';
import assert from 'node:assert/strict';
import { answerPayload, dimensions, hasQuestionnaire, initialAnswers, validateAnswers, validProfile, sortProfiles, confirmedPrompts } from '../src/features/risk-assessment/riskAssessmentModel.js';
import { createRiskAssessmentApi, loadRiskAssessment } from '../src/features/risk-assessment/riskAssessmentApi.js';

test('questionnaire contains all eight confirmed prompts and single-choice integer mappings', () => {
  const keys = ['lossReaction','lossTolerance','emergencySavings','essentialExpenseDependency','debtManageability','investmentHorizon','investmentExperience','investmentObjective'];
  assert.deepEqual(dimensions.map(([key]) => key), keys);
  assert.equal(Object.keys(confirmedPrompts).length, 8);
  assert.equal(hasQuestionnaire(riskQuestionnaire), true);
  assert.deepEqual(riskQuestionnaire.map(q => q.key), keys);
  for (const q of riskQuestionnaire) {
    assert.deepEqual(q.answers.map(a => a.value), [0, 1, 2, 3]);
    assert.ok(q.answers.every(a => a.label.length > 0));
    assert.equal(q.prompt, confirmedPrompts[q.key]);
  }
  assert.equal(riskQuestionnaire[3].answers[0].label, 'I depend heavily on my investments for essential expenses.');
  assert.equal(hasQuestionnaire(null), false);
  assert.equal(hasQuestionnaire(dimensions.map(([key]) => ({ key, prompt: confirmedPrompts[key], answers: [] }))), false);
  assert.equal(Object.keys(validateAnswers(initialAnswers())).length, 8);
});
test('answer validation uses only backend codes 0–3 and payload excludes identity or derived scores', () => {
  const answers = Object.fromEntries(dimensions.map(([key]) => [key, 0]));
  assert.deepEqual(validateAnswers(answers), {});
  for (const value of [null, '', '1', -1, 4, 1.5]) assert.ok(validateAnswers({ ...answers, lossReaction: value }).lossReaction);
  const body = answerPayload({ ...answers, userId: 99, riskScore: 100 });
  assert.deepEqual(Object.keys(body), dimensions.map(([key]) => key));
  assert.equal(body.userId, undefined);
});
test('profile display trusts returned safeguard category and sorts dates without modifying response', () => {
  const capped = { riskProfileId: '102', riskScore: 87.5, riskCategory: 'MODERATE', calculatedAt: '2026-11-02T12:00:00' };
  assert.equal(validProfile(capped), true);
  assert.equal(validProfile({ ...capped, riskScore: 101 }), false);
  const records = [{ ...capped, riskProfileId: '101', calculatedAt: '2026-11-01T12:00:00' }, capped];
  assert.equal(sortProfiles(records)[0].riskProfileId, '102');
  assert.equal(records[0].riskProfileId, '101');
});
test('risk adapter uses exact owner-scoped GET/POST contract', async () => {
  const calls = [];
  const api = createRiskAssessmentApi({ request: async (path, init) => { calls.push([path, init]); return []; } });
  const body = answerPayload(Object.fromEntries(dimensions.map(([key]) => [key, 1])));
  await api.list(); await api.assess(body);
  assert.deepEqual(calls.map(([path, init]) => [path, init.method || 'GET']), [['/risk-profiles/me', 'GET'], ['/risk-profiles/me', 'POST']]);
  assert.deepEqual(calls[1][1].body, body);
});
test('risk loader distinguishes unavailable, empty, unauthorized, malformed and abort', async () => {
  assert.equal((await loadRiskAssessment(null)).status, 'blocked');
  assert.deepEqual((await loadRiskAssessment({ list: async () => [] })).profiles, []);
  assert.equal((await loadRiskAssessment({ list: async () => [{}] })).status, 'error');
  assert.equal((await loadRiskAssessment({ list: async () => { throw { status: 401 }; } })).profiles, null);
  await assert.rejects(loadRiskAssessment({ list: async () => { throw new DOMException('Aborted', 'AbortError'); } }), { name: 'AbortError' });
});

test('dependency codes adapt UI capacity direction to the existing backend without changing answers', () => {
  for (const code of [0, 1, 2, 3]) {
    const answers = Object.fromEntries(dimensions.map(([key]) => [key, code]));
    const payload = answerPayload(answers);
    assert.equal(payload.essentialExpenseDependency, 3 - code);
    for (const [key] of dimensions) if (key !== 'essentialExpenseDependency') assert.equal(payload[key], code);
    assert.equal(answers.essentialExpenseDependency, code);
    assert.ok(Object.values(payload).every(Number.isInteger));
  }
  assert.throws(() => answerPayload(initialAnswers()), /Complete all eight/);
});
