export const categories = ['EQUITY', 'DEBT', 'HYBRID', 'OTHERS'];
export const periods = [['return1Day','1D'],['return1Month','1M'],['return6Month','6M'],['return1Year','1Y'],['return3Year','3Y'],['return5Year','5Y']];
export const fields = ['fundId','fundName','amc','category','nav','aum',...periods.map(([key])=>key)];
export const present = v => v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v));
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
export function selectFunds(funds,{query='',category='',amc='',sort='fundName',direction='asc'}={}) {
 return funds.filter(f=>(f.fundName||'').toLowerCase().includes(query.trim().toLowerCase())&&(!category||f.category===category)&&(!amc||f.amc===amc)).sort((a,b)=>{if(!present(a[sort]) && !['fundName','amc'].includes(sort)) return present(b[sort])?1:0; if(!present(b[sort]) && !['fundName','amc'].includes(sort))return -1; return (['fundName','amc'].includes(sort)?String(a[sort]||'').localeCompare(String(b[sort]||'')):Number(a[sort])-Number(b[sort]))*(direction==='asc'?1:-1);});
}
