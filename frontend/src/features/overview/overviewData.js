import { ApiError } from '../../api/client.js';

export const overviewEndpoints = {
  applications: '/ipo-applications', holdings: '/sip-holdings',
  journals: '/journal/me', profiles: '/risk-profiles/me',
};

// A future authenticated caller supplies request(path, { signal }). No token lookup here.
export async function loadOverview({ request, signal } = {}) {
  if (!request) return { status: 'blocked', resources: {} };
  const entries = await Promise.all(Object.entries(overviewEndpoints).map(async ([key, path]) => {
    try {
      const data = await request(path, { signal });
      if (!Array.isArray(data) || data.some(item => !item || typeof item !== 'object' || Array.isArray(item))) {
        throw new ApiError('Unexpected account data format.');
      }
      return [key, { status: 'ready', data }];
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      return [key, { status: 'error', data: null, statusCode: error.status || 0 }];
    }
  }));
  const resources = Object.fromEntries(entries);
  // Never retain a partial account response after authentication has failed.
  if (entries.some(([, value]) => [401, 403].includes(value.statusCode))) {
    return { status: 'blocked', resources: {} };
  }
  return { status: entries.every(([, value]) => value.status === 'error') ? 'error' : 'ready', resources };
}

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
const count = new Intl.NumberFormat('en-IN');
export const formatMoney = value => value === null ? '—' : money.format(value);
export const formatCount = value => value === null ? '—' : count.format(value);
export const label = value => typeof value === 'string' ? value.replaceAll('_', ' ').toLowerCase() : 'Not recorded';
function amount(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && !/^\d+(\.\d+)?$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}
function date(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(T|$)/.test(value)) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}
export function formatDate(value) {
  return date(value) === null ? 'Date not recorded' : new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(value));
}

export function deriveOverview(resources = {}) {
  const read = key => resources[key]?.status === 'ready' ? resources[key].data : null;
  const applications = read('applications');
  const holdings = read('holdings');
  const journals = read('journals');
  const profiles = read('profiles');
  const invested = holdings?.map(item => amount(item.investedAmount));
  const sipInvested = invested && invested.every(value => value !== null)
    ? invested.reduce((sum, value) => sum + value, 0) : null;
  const fundIds = holdings?.map(item => item.mutualFundId);
  const fundCount = fundIds && fundIds.every(id => typeof id === 'string' && id.length)
    ? new Set(fundIds).size : null;
  const contributions = holdings ? Object.entries(Object.groupBy(holdings, item => item.frequency || 'UNSPECIFIED'))
    .map(([frequency, items]) => {
      const amounts = items.map(item => amount(item.sipAmount));
      return { frequency, amount: amounts.every(value => value !== null) ? amounts.reduce((sum, value) => sum + value, 0) : null };
    }) : [];
  const activity = (journals || []).map(item => ({
    id: item.journalId, title: item.companyName || 'IPO decision',
    description: item.content?.trim() || 'No note recorded.',
    date: item.updatedAt || item.createdAt, type: 'Journal decision',
  })).filter(item => date(item.date) !== null)
    .sort((a, b) => date(b.date) - date(a.date)).slice(0, 4);
  const risk = profiles?.filter(item => date(item.calculatedAt) !== null)
    .sort((a, b) => date(b.calculatedAt) - date(a.calculatedAt))[0] || null;
  const ipoStatuses = ['PENDING', 'ALLOTTED', 'NOT_ALLOTTED'].map(status => ({
    status, count: applications ? applications.filter(item => item.allotmentStatus === status).length : null,
  }));
  const otherStatusCount = applications?.filter(item => !ipoStatuses.some(entry => entry.status === item.allotmentStatus)).length ?? null;
  // Rank only when every holding has an identifiable fund and a recorded cost.
  // Otherwise a missing amount could change the order of the largest holdings.
  let topHoldings = null;
  if (holdings && fundCount !== null && sipInvested !== null) {
    const grouped = new Map();
    for (const holding of holdings) {
      const fund = grouped.get(holding.mutualFundId) || {
        id: holding.mutualFundId, name: holding.mutualFundName || 'Unnamed fund', invested: 0,
      };
      fund.invested += amount(holding.investedAmount);
      grouped.set(fund.id, fund);
    }
    topHoldings = [...grouped.values()].sort((a, b) => b.invested - a.invested || a.id.localeCompare(b.id)).slice(0, 3);
  }
  return { applications, holdings, journals, profiles, sipInvested, fundCount, contributions, activity, risk, ipoStatuses, otherStatusCount, topHoldings,
    applicationCount: applications?.length ?? null, holdingCount: holdings?.length ?? null,
    empty: [applications, holdings, journals, profiles].every(items => Array.isArray(items) && items.length === 0),
  };
}
