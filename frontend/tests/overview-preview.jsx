// Development-only state harness. Not an application route or production build entry.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import '@fontsource-variable/manrope';
import '@fontsource-variable/dm-sans';
import '../src/styles/tokens.css';
import '../src/styles/globals.css';
import '../src/styles/dashboard.css';
import OverviewPage, { OverviewContent } from '../src/pages/OverviewPage.jsx';
import { loadOverview, overviewEndpoints } from '../src/features/overview/overviewData.js';

const emptyLoader = options => loadOverview({ ...options, request: async () => [] });
const fixtures = {
  applications: [{ applicationId: 'test-ipo', companyName: 'Test company', allotmentStatus: 'PENDING', applicationStatus: 'SUBMITTED', lotsApplied: 1, lotsAllotted: 0 }],
  holdings: [{ holdingId: 'test-holding', mutualFundId: 'test-fund', mutualFundName: 'Test fund', investedAmount: 100, sipAmount: 10, frequency: 'MONTHLY' }],
  journals: [{ journalId: 'test-note', companyName: 'Test company', content: 'Synthetic journal note for visual verification.', createdAt: '2026-01-01T12:00:00' }],
  profiles: [],
};

function StateHarness() {
  const [status, setStatus] = useState('loading');
  const resources = ['ready', 'populated'].includes(status) ? Object.fromEntries(Object.keys(overviewEndpoints).map(key => [key, { status: 'ready', data: status === 'populated' ? fixtures[key] : [] }])) : {};
  return <MemoryRouter><div className="dash-shell" data-theme="light"><div className="dash-content">
    <p>TEST HARNESS · Synthetic records only · No account requests</p>
    <nav aria-label="Test states">{['loading', 'ready', 'populated', 'connected-empty', 'error', 'blocked'].map(value => <button className="text-button" key={value} onClick={() => setStatus(value)}>{value}</button>)}</nav>
    {status === 'connected-empty' ? <OverviewPage loader={emptyLoader} /> : <OverviewContent status={status === 'populated' ? 'ready' : status} resources={resources} reload={() => setStatus('loading')} />}
  </div></div></MemoryRouter>;
}
createRoot(document.getElementById('root')).render(<StateHarness />);

import '../src/styles/polish.css';
