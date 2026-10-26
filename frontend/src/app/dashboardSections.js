// One source for route paths, sidebar labels, page titles and placeholders.
export const dashboardSections = [
  { path: '', label: 'Overview', icon: 'overview', heading: 'A place for the whole picture.', description: 'Your investment workspace starts here. Choose a section from the navigation to explore what’s coming next.' },
  { path: 'ipo-tracker', label: 'IPO Tracker', icon: 'ipo', heading: 'Your next opportunity, in focus.', description: 'A dedicated space for IPO details and applications. The IPO tracker will be built in a later step.' },
  { path: 'mutual-funds', label: 'Mutual Funds', icon: 'funds', heading: 'Make room for the long view.', description: 'A dedicated space for your mutual funds. Fund information and tools will be added in a later step.' },
  { path: 'sip-holdings', label: 'SIP Holdings', icon: 'sip', heading: 'One step at a time.', description: 'A dedicated space for your SIP holdings. Holdings information and tools will be added in a later step.' },
  { path: 'risk-assessment', label: 'Risk Assessment', icon: 'risk', heading: 'Find your own perspective.', description: 'A dedicated space to understand your investment risk profile. The assessment will be built in a later step.' },
  { path: 'decision-journal', label: 'Decision Journal', icon: 'journal', heading: 'Keep the reasoning close.', description: 'A dedicated space for the thinking behind your decisions. Journal entries and tools will be added in a later step.' },
];

export function sectionUrl(section) {
  return `/dashboard${section.path ? `/${section.path}` : ''}`;
}
