export const IPO_STATUSES = ['OPEN', 'CLOSED', 'UPCOMING', 'ALLOTMENT', 'LISTED'];
export const numericFields = [
  ['price', 'Issue price (₹)'], ['gmp', 'GMP (₹)'], ['subscriptionQib', 'QIB subscription'],
  ['subscriptionShni', 'Small HNI subscription'], ['subscriptionBhni', 'Big HNI subscription'],
  ['subscriptionRetail', 'Retail subscription'], ['subscriptionEmployee', 'Employee subscription'],
];
export const text = value => typeof value === 'string' && value ? value.replaceAll('_', ' ').toLowerCase() : 'Not recorded';
export const number = value => value === null || value === undefined || value === '' || !Number.isFinite(Number(value)) ? '—' : new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(Number(value));
export const money = value => number(value) === '—' ? '—' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value));
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
export function dateLabel(value) {
  return validDate(value) ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`)) : 'Not recorded';
}
export const indiaToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export const initials = name => (name || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase() || 'IP';
export function issueEvents(ipos, today = indiaToday()) {
  if (!ipos) return null;
  return ipos.flatMap(ipo => [['openingDate', 'Opens'], ['closingDate', 'Closes'], ['allotmentDate', 'Allotment']]
    .filter(([key]) => validDate(ipo[key]) && ipo[key] >= today)
    .map(([key, label], order) => ({ id: `${ipo.ipoId}-${key}`, ipo, date: ipo[key], label, order })))
    .sort((a, b) => a.date.localeCompare(b.date) || a.ipo.companyName.localeCompare(b.ipo.companyName) || a.order - b.order).slice(0, 4);
}
export function summarize(ipos, applications, today = indiaToday()) {
  return { total: ipos?.length ?? null,
    open: ipos ? ipos.filter(ipo => validDate(ipo.openingDate) && validDate(ipo.closingDate) && ipo.openingDate <= today && ipo.closingDate >= today && ipo.ipoStatus === 'OPEN').length : null,
    upcoming: ipos ? ipos.filter(ipo => validDate(ipo.openingDate) && ipo.openingDate > today && ipo.ipoStatus === 'UPCOMING').length : null,
    applications: applications?.length ?? null };
}
export function filterIpos(ipos, { query = '', status = '', sort = 'openingDate', direction = 'asc' } = {}) {
  const filtered = ipos.filter(ipo => (ipo.companyName || '').toLowerCase().includes(query.trim().toLowerCase()) && (!status || ipo.ipoStatus === status));
  return filtered.sort((a, b) => {
    const x = a[sort], y = b[sort];
    const missingX = x === null || x === undefined || x === '';
    const missingY = y === null || y === undefined || y === '';
    if (missingX || missingY) return missingX === missingY ? 0 : missingX ? 1 : -1;
    const comparison = sort === 'price' ? Number(x) - Number(y) : String(x).localeCompare(String(y), 'en-IN', { sensitivity: 'base' });
    return direction === 'desc' ? -comparison : comparison;
  });
}
export function initialMaster(record = {}) {
  return Object.fromEntries(['companyName', 'sector', 'openingDate', 'closingDate', 'allotmentDate', 'ipoStatus', ...numericFields.map(([key]) => key)].map(key => [key, record[key] ?? '']));
}
export function validateMaster(values) {
  const errors = {};
  if (!values.companyName?.trim()) errors.companyName = 'Company name is required.';
  for (const key of ['openingDate', 'closingDate']) if (!validDate(values[key])) errors[key] = 'Enter a valid date.';
  if (validDate(values.openingDate) && validDate(values.closingDate) && values.closingDate < values.openingDate) errors.closingDate = 'Close date cannot precede open date.';
  if (values.allotmentDate && !validDate(values.allotmentDate)) errors.allotmentDate = 'Enter a valid allotment date.';
  if (values.ipoStatus && !IPO_STATUSES.includes(values.ipoStatus)) errors.ipoStatus = 'Select a supported status.';
  for (const [key] of numericFields) {
    const value = values[key];
    if (key !== 'price' && value === '') continue;
    const parsed = Number(value);
    if (value === '' || !Number.isFinite(parsed) || Math.abs(parsed) > 3.402823466e38 || (key === 'price' ? Math.fround(parsed) <= 0 : parsed < 0)) errors[key] = key === 'price' ? 'Enter a positive, finite price.' : 'Enter a nonnegative, finite amount.';
  }
  return errors;
}
export function masterPayload(values) {
  return { companyName: values.companyName.trim(), sector: values.sector?.trim() || null,
    openingDate: values.openingDate, closingDate: values.closingDate, allotmentDate: values.allotmentDate || null,
    ipoStatus: values.ipoStatus || null, ...Object.fromEntries(numericFields.map(([key]) => [key, values[key] === '' ? 0 : Number(values[key])])) };
}
export function validateApplication({ ipoId, lotsApplied }) {
  const errors = {};
  if (!/^\d+$/.test(String(ipoId)) || Number(ipoId) <= 0) errors.ipoId = 'Select an IPO.';
  if (!/^\d+$/.test(String(lotsApplied)) || Number(lotsApplied) < 1 || Number(lotsApplied) > 2147483647) errors.lotsApplied = 'Enter a whole number of lots between 1 and 2,147,483,647.';
  return errors;
}
