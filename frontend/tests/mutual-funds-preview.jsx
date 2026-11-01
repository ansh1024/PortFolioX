// Development-only test fixtures; never imported by production routes.
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@fontsource-variable/manrope';
import '@fontsource-variable/dm-sans';
import '../src/styles/tokens.css';
import '../src/styles/globals.css';
import DashboardLayout from '../src/layouts/DashboardLayout.jsx';
import MutualFundsPage from '../src/pages/MutualFundsPage.jsx';
import { ApiError } from '../src/api/client.js';
import { createMutualFundApi } from '../src/features/mutual-funds/mutualFundApi.js';
import { createSipHoldingApi } from '../src/features/sip-holdings/sipHoldingApi.js';

function App() {
  const [mode, setMode] = useState('Admin');
  const connection = useMemo(() => {
    let funds = mode === 'Empty' ? [] : [
      { fundId: 'TEST-A', fundName: 'Test Equity Scheme', amc: 'Test House', category: 'EQUITY', nav: '25.20', aum: 1200, return1Month: '-1.2', return1Year: '8.5', return3Year: '12.4' },
      { fundId: 'TEST-B', fundName: 'Test Debt Scheme', amc: 'Test AMC', category: 'DEBT', nav: '14', aum: 900 },
    ];
    if (mode === 'Pagination') funds.push(...Array.from({ length: 12 }, (_, index) => ({ fundId: `TEST-P${index}`, fundName: `Test catalogue entry ${String(index).padStart(2, '0')}`, amc: 'Test AMC', category: 'HYBRID', nav: null, aum: null })));
    let writes = 0;
    const request = async (path, { method = 'GET', body, signal } = {}) => {
      if (mode === 'Loading') return new Promise((resolve, reject) => signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))));
      if (mode === 'Error') throw new ApiError('Test connection error', 500);
      if (mode === 'Denied') throw new ApiError('Test session unavailable', 401);
      if (path === '/sip-holdings') {
        if (mode === 'Partial SIP') throw new ApiError('Test SIP failure', 500);
        return mode === 'Empty' ? [] : [{ holdingId: '101', mutualFundId: 'TEST-A', frequency: 'MONTHLY' }];
      }
      const parts = path.split('/').filter(Boolean);
      const id = parts[1] && decodeURIComponent(parts[1]);
      if (mode === 'Detail error' && method === 'GET' && id) throw new ApiError('Test missing fund', 404);
      if (method === 'GET') return structuredClone(id ? funds.find(fund => fund.fundId === id) : funds);
      writes++;
      if (mode === 'Write error') throw new ApiError('Test write rejected', 400, { fundName: 'Test scheme name error' });
      if (method === 'POST') { funds.push(body); return structuredClone(body); }
      if (method === 'PUT') { funds = funds.map(fund => fund.fundId === id ? body : fund); return structuredClone(body); }
      funds = funds.filter(fund => fund.fundId !== id); return null;
    };
    return { api: createMutualFundApi({ request }), sipApi: createSipHoldingApi({ request }) };
  }, [mode]);
  return <><p>TEST HARNESS · Synthetic fund records · No backend requests</p><div>{['Admin', 'User', 'Empty', 'Loading', 'Error', 'Denied', 'Write error', 'Detail error', 'Partial SIP', 'Pagination'].map(value => <button key={value} onClick={() => setMode(value)}>{value}</button>)}</div>
    <MemoryRouter initialEntries={['/dashboard/mutual-funds']}><Routes><Route element={<DashboardLayout />}><Route path="/dashboard/mutual-funds" element={<MutualFundsPage key={mode} {...connection} role={mode === 'User' ? 'USER' : 'ADMIN'} />} /></Route></Routes></MemoryRouter>
  </>;
}
const root = import.meta.hot?.data.root || createRoot(document.getElementById('root'));
if (import.meta.hot) import.meta.hot.data.root = root;
root.render(<App />);
