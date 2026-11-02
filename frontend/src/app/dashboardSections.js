// One source for route paths, sidebar labels, page titles and placeholders.
export const dashboardSections = [
  { path: '', label: 'Overview', icon: 'overview', heading: 'A place for the whole picture.', description: 'Your investment workspace starts here. Choose a section from the navigation to explore what’s coming next.' },
  { path: 'ipo-tracker', label: 'IPO Tracker', icon: 'ipo', heading: 'Your next opportunity, in focus.', description: 'A dedicated space for IPO details and applications. Browse recorded issues and manage your applications.' },
  { path: 'mutual-funds', label: 'Mutual Funds', icon: 'funds', heading: 'Make room for the long view.', description: 'A dedicated space for your mutual funds. Research recorded scheme details and associated SIP holdings.' },
  { path: 'sip-holdings', label: 'SIP Holdings', icon: 'sip', heading: 'One step at a time.', description: 'A dedicated space for your SIP holdings. Review contributions and manage recorded holdings.' },
  { path: 'risk-assessment', label: 'Risk Assessment', icon: 'risk', heading: 'Find your own perspective.', description: 'Complete eight questions and review returned risk profiles.' },
  { path: 'ipo-scoring', label: 'IPO Scoring', icon: 'ipo', heading: 'Look beyond the headline.', description: 'Review backend IPO scoring and returned factor breakdowns.' },
  { path: 'decision-journal', label: 'Decision Journal', icon: 'journal', heading: 'Keep the reasoning close.', description: 'A dedicated space for the thinking behind your decisions. Record and revisit the reasoning behind your IPO decisions.' },
  { path: 'profile', label: 'Profile', icon: 'profile', heading: 'Profile & preferences.', description: 'Your account information and investment perspective.' },
];

export function sectionUrl(section) {
  return `/dashboard${section.path ? `/${section.path}` : ''}`;
}
