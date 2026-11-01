export const categories = ['EQUITY', 'DEBT', 'HYBRID', 'OTHERS'];
export const periods = [['return1Day','1D'],['return1Month','1M'],['return6Month','6M'],['return1Year','1Y'],['return3Year','3Y'],['return5Year','5Y']];
export const fields = ['fundId','fundName','amc','category','nav','aum',...periods.map(([key])=>key)];
export const present = v => v !== null && v !== undefined && String(v).trim() !== '' && Number.isFinite(Number(v));
export const numeric = v => present(v) ? new Intl.NumberFormat('en-IN',{maximumFractionDigits:2}).format(Number(v)) : '—';
export const percent = v => present(v) ? `${Number(v)>0?'+':''}${numeric(v)}%` : '—';
export const label = v => v ? v.charAt(0)+v.slice(1).toLowerCase() : 'Not recorded';
export const initials = v => (v||'Fund').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
export const initial = (fund={}) => Object.fromEntries(fields.map(key=>[key,fund[key]??'']));
export function validate(values) {
 const errors={}; for(const key of ['fundId','fundName','amc']) {if(!values[key]?.trim()) errors[key]='This field is required.'; else if(values[key].length>255) errors[key]='Use at most 255 characters.';}
 if(!categories.includes(values.category)) errors.category='Choose a category.';
 for(const key of ['nav',...periods.map(([key])=>key)]) if(values[key]!=='' && (!present(values[key]) || (key==='nav' && Number(values[key])<0))) errors[key]='Enter a valid number'+(key==='nav'?' of zero or greater.':'.');
 if(!/^\d+$/.test(String(values.aum)) || !Number.isSafeInteger(Number(values.aum))) errors.aum='Enter a nonnegative whole number within the safe numeric range.';
 return errors;
}
export function payload(values) {return Object.fromEntries(fields.map(key=>[key,['fundId','fundName','amc'].includes(key)?values[key].trim():key==='category'?values[key]:key==='aum'?Number(values[key]):values[key]===''?null:values[key]]));}
export const defaultFilters = { query: '', category: '', amc: '', sort: 'fundName', direction: 'asc' };
export const sortOptions = [['fundName', 'Scheme name'], ['amc', 'Fund house'], ['category', 'Category'], ['nav', 'Recorded NAV'], ['aum', 'Recorded AUM']];
export function selectFunds(funds, { query = '', category = '', amc = '', sort = 'fundName', direction = 'asc' } = {}) {
  const textSort = ['fundName', 'amc', 'category'].includes(sort);
  return funds.filter(fund => (fund.fundName || '').toLowerCase().includes(query.trim().toLowerCase())
    && (!category || (category === 'UNRECORDED' ? !categories.includes(fund.category) : fund.category === category))
    && (!amc || fund.amc === amc)).sort((a, b) => {
      const missing = value => textSort ? !value : !present(value);
      if (missing(a[sort]) || missing(b[sort])) return missing(a[sort]) === missing(b[sort]) ? 0 : missing(a[sort]) ? 1 : -1;
      const comparison = textSort ? String(a[sort]).localeCompare(String(b[sort]), 'en-IN', { sensitivity: 'base' }) : Number(a[sort]) - Number(b[sort]);
      return (direction === 'asc' ? comparison : -comparison) || String(a.fundId).localeCompare(String(b.fundId));
    });
}
export function categoryDistribution(funds) {
  if (!funds) return null;
  const groups = categories.map(category => ({ category, name: label(category), count: funds.filter(f => f.category === category).length }));
  const unknown = funds.filter(f => !categories.includes(f.category)).length;
  return unknown ? [...groups, { category: 'UNRECORDED', name: 'Not recorded', count: unknown }] : groups;
}
export function catalogueSummary(funds) {
  if (!funds) return { total: null, categories: null, houses: null };
  return { total: funds.length, categories: new Set(funds.map(f => f.category).filter(c => categories.includes(c))).size,
    houses: new Set(funds.map(f => f.amc).filter(Boolean)).size };
}
export function associatedHoldings(holdings, fundId) {
  return holdings ? holdings.filter(holding => holding.mutualFundId === fundId) : null;
}
