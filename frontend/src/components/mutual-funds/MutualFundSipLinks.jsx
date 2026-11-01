import { Link } from 'react-router-dom';
import { dashboardSections, sectionUrl } from '../../app/dashboardSections.js';
import { associatedHoldings, numeric } from '../../features/mutual-funds/mutualFundModel.js';
import { frequencyLabel } from '../../features/sip-holdings/sipHoldingModel.js';

const sipRoute = sectionUrl(dashboardSections.find(section => section.path === 'sip-holdings'));
export default function MutualFundSipLinks({ fundId, holdings, status }) {
  const associated = associatedHoldings(holdings, fundId);
  return <section className="mf-sip-links"><div className="mf-section-title"><h3>Your associated SIP records</h3><span>{numeric(associated?.length)}</span></div>
    {associated ? associated.length ? <ul>{associated.map(holding => <li key={holding.holdingId}><span>Holding #{holding.holdingId}</span><strong>{frequencyLabel(holding.frequency)}</strong></li>)}</ul> : <p>No SIP records for this fund in your loaded account.</p>
      : <p>{status === 'error' ? 'Your SIP records could not be loaded. Retry from the catalogue.' : 'Connect your account to identify your SIP records for this fund.'}</p>}
    <Link to={sipRoute}>Open SIP Holdings <span aria-hidden="true">↗</span></Link>
  </section>;
}
