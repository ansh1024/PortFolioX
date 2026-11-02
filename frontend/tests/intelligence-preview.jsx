// Isolated test-only responses. Never imported by the production application.
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import '@fontsource-variable/manrope'; import '@fontsource-variable/dm-sans';
import '../src/styles/tokens.css'; import '../src/styles/globals.css';
import DashboardLayout from '../src/layouts/DashboardLayout.jsx';
import RiskAssessmentPage from '../src/pages/RiskAssessmentPage.jsx';
import IpoScoringPage from '../src/pages/IpoScoringPage.jsx';
import { createRiskAssessmentApi } from '../src/features/risk-assessment/riskAssessmentApi.js';
import { createIpoScoringApi } from '../src/features/ipo-scoring/ipoScoringApi.js';
import { ApiError } from '../src/api/client.js';
function App() {
  const [mode, setMode] = useState('Records');
  const apis = useMemo(() => {
    let next = 103;
    const request = async (path, { method = 'GET', signal, body } = {}) => {
      if (mode === 'Loading') return new Promise((resolve, reject) => signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))));
      if (mode === 'Denied') throw new ApiError('Test account unavailable', 401);
      if (mode === 'Error') throw new ApiError('Test connection failed', 500);
      if (path === '/risk-profiles/me') {
        if (method === 'POST') {
          if (!body || Object.keys(body).length !== 8 || !Object.values(body).every(v => Number.isInteger(v) && v >= 0 && v <= 3)) throw new Error('Invalid test request');
          if (mode === 'Assessment error') throw new ApiError('Test save failed. Your answers are preserved.', 400);
          // Fixed synthetic response, not a browser scoring implementation.
          return { riskProfileId: `TEST-${next++}`, riskScore: 87.5, riskCategory: 'MODERATE', calculatedAt: '2026-11-02T13:00:00' };
        }
        return mode === 'Empty' ? [] : [{ riskProfileId: 'TEST-102', riskScore: 87.5, riskCategory: 'MODERATE', calculatedAt: '2026-11-02T12:00:00' }, { riskProfileId: 'TEST-101', riskScore: 12.5, riskCategory: 'LOW', calculatedAt: '2026-11-01T12:00:00' }];
      }
      if (path === '/ipos') return mode === 'Empty' ? [] : [{ ipoId: 1, companyName: 'Test Horizon Industries', sector: 'Industrials', price: 240, gmp: 24, ipoStatus: 'OPEN', openingDate: '2026-11-01', closingDate: '2026-11-05' }, { ipoId: 2, companyName: 'Test Cedar Labs', sector: 'Technology', price: 120, gmp: 12, ipoStatus: 'UPCOMING', openingDate: '2026-11-10', closingDate: '2026-11-13' }];
      if (method === 'POST') {
        if (mode === 'Missing metrics') throw new ApiError('Test IPO metrics unavailable', 500);
        if (mode === 'Malformed result') return { totalScore: null };
        return { scoreLogId: `TEST-${next++}`, ipoId: Number(path.split('/')[2]), companyName: path.includes('/1/') ? 'Test Horizon Industries' : 'Test Cedar Labs', gmpScore: 10, subscriptionScore: 0, fundamentalScore: 20, sectorScore: 10, historicalScore: 10, totalScore: 50, verdict: 'WATCH', calculatedAt: '2026-11-02T12:00:00' };
      }
    };
    return { risk: createRiskAssessmentApi({ request }), scoring: createIpoScoringApi({ request }) };
  }, [mode]);
  return <MemoryRouter initialEntries={['/dashboard/risk-assessment']}><p>TEST HARNESS · Synthetic API responses · No backend requests or financial recommendations</p><div>{['Records', 'Empty', 'Loading', 'Error', 'Denied', 'Missing metrics', 'Malformed result', 'Assessment error'].map(value => <button key={value} onClick={() => setMode(value)}>{value}</button>)} <Link to="/dashboard/risk-assessment">Risk route</Link> · <Link to="/dashboard/ipo-scoring">Scoring route</Link></div><Routes><Route element={<DashboardLayout />}><Route path="/dashboard/risk-assessment" element={<RiskAssessmentPage key={`risk-${mode}`} api={apis.risk} />} /><Route path="/dashboard/ipo-scoring" element={<IpoScoringPage key={`score-${mode}`} api={apis.scoring} />} /></Route></Routes></MemoryRouter>;
}
const root = import.meta.hot?.data.root || createRoot(document.getElementById('root'));
if (import.meta.hot) import.meta.hot.data.root = root;
root.render(<App />);
