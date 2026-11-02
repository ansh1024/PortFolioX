// Development-only fixtures. Never imported by the real Tracker or production entry.
import React, { useMemo, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@fontsource-variable/manrope';
import '@fontsource-variable/dm-sans';
import '../src/styles/tokens.css';
import '../src/styles/globals.css';
import DashboardLayout from '../src/layouts/DashboardLayout.jsx';
import IpoTrackerPage from '../src/pages/IpoTrackerPage.jsx';
import { createIpoApi } from '../src/features/ipo/ipoApi.js';
import { initialMaster, masterPayload, indiaToday } from '../src/features/ipo/ipoModel.js';
import { ApiError } from '../src/api/client.js';

function fixtureApi(mode, rejectWrite) {
  const today = indiaToday();
  const future = new Date(`${today}T00:00:00Z`); future.setUTCDate(future.getUTCDate() + 7);
  const next = future.toISOString().slice(0, 10);
  let ipos = mode === 'Empty' ? [] : [
    { ipoId: 1, ...masterPayload({ ...initialMaster(), companyName: 'Test Horizon Industries', sector: 'Test sector', price: '120', gmp: '10', openingDate: today, closingDate: today, ipoStatus: 'OPEN' }) },
    { ipoId: 2, ...masterPayload({ ...initialMaster(), companyName: 'Test Cedar Labs', sector: 'Test sector', price: '80', openingDate: next, closingDate: next, ipoStatus: 'UPCOMING' }) },
  ];
  let applications = mode === 'Empty' ? [] : [{ applicationId: '101', ipoId: 1, companyName: 'Test Horizon Industries', lotsApplied: 1, lotsAllotted: 0, applicationStatus: 'SUBMITTED', allotmentStatus: 'PENDING' }];
  return createIpoApi({ request: async (path, { method = 'GET', body, signal } = {}) => {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    if (mode === 'Loading') return new Promise((resolve, reject) => signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true }));
    if (mode === 'Error') throw new ApiError('Test network error', 500);
    if (mode === 'Denied') throw new ApiError('Test session unavailable', 401);
    if (method !== 'GET' && rejectWrite.current) { rejectWrite.current = false; throw new ApiError('Test write rejected. Please correct the record.', 400, { companyName: 'Test company error from server' }); }
    const url = new URL(path, 'http://fixture.invalid');
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] === 'ipos') {
      if (parts[2] === 'score') return { totalScore: 50, gmpScore: 10, subscriptionScore: 0, fundamentalScore: 20, sectorScore: 10, historicalScore: 10, verdict: 'WATCH', calculatedAt: new Date().toISOString() };
      if (method === 'GET') return structuredClone(parts[1] ? ipos.find(item => item.ipoId === Number(parts[1])) : ipos);
      if (method === 'POST') { const record = { ...body, ipoId: Math.max(0, ...ipos.map(item => item.ipoId)) + 1 }; ipos.push(record); return structuredClone(record); }
      if (method === 'PUT') { ipos = ipos.map(item => item.ipoId === Number(parts[1]) ? { ...body, ipoId: item.ipoId } : item); return structuredClone(ipos.find(item => item.ipoId === Number(parts[1]))); }
      if (method === 'DELETE') { ipos = ipos.filter(item => item.ipoId !== Number(parts[1])); return null; }
    }
    if (method === 'GET') return structuredClone(applications);
    if (method === 'POST') { const ipoId = Number(url.searchParams.get('ipoId')); const record = { applicationId: String(Math.max(100, ...applications.map(item => Number(item.applicationId))) + 1), ipoId, companyName: ipos.find(item => item.ipoId === ipoId).companyName, lotsApplied: Number(url.searchParams.get('lotsApplied')), lotsAllotted: 0, applicationStatus: 'SUBMITTED', allotmentStatus: 'PENDING' }; applications.push(record); return structuredClone(record); }
    if (method === 'DELETE') { applications = applications.filter(item => item.applicationId !== parts[1]); return null; }
    throw new Error('Unexpected fixture request');
  } });
}
function Harness() {
  const [mode, setMode] = useState('Admin');
  const rejectWrite = useRef(false);
  const api = useMemo(() => mode === 'Disconnected' ? null : fixtureApi(mode, rejectWrite), [mode]);
  return <><p>TEST HARNESS · Synthetic IPO records · No backend requests or real bids</p><nav aria-label="Test modes">{['Admin', 'User', 'Empty', 'Loading', 'Error', 'Denied', 'Disconnected'].map(value => <button className="text-button" key={value} onClick={() => setMode(value)}>{value}</button>)}<button className="text-button" onClick={() => { rejectWrite.current = true; }}>Reject next write</button></nav><MemoryRouter key={mode} initialEntries={['/dashboard/ipo-tracker']}><Routes><Route path="/dashboard" element={<DashboardLayout />}><Route path="ipo-tracker" element={<IpoTrackerPage api={api} role={mode === 'Admin' || mode === 'Empty' ? 'ADMIN' : 'USER'} />} /></Route></Routes></MemoryRouter></>;
}
const root = import.meta.hot?.data.root ?? createRoot(document.getElementById('root'));
if (import.meta.hot) import.meta.hot.data.root = root;
root.render(<Harness />);

import '../src/styles/polish.css';
