import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { numeric } from '../../features/mutual-funds/mutualFundModel.js';

function CountTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return <div className="mf-chart-tooltip"><strong>{item.name}</strong><span>{numeric(item.count)} catalogue records</span></div>;
}

export default function MutualFundCategoryChart({ distribution }) {
  return <ResponsiveContainer width="100%" height="100%" minWidth={0}>
    <BarChart data={distribution} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }} accessibilityLayer={false}>
      <XAxis type="number" hide allowDecimals={false} domain={[0, 'dataMax']} />
      <YAxis type="category" dataKey="name" width={76} tickLine={false} axisLine={false} tick={{ fill: 'var(--color-muted)', fontSize: 10 }} />
      <Tooltip content={<CountTooltip />} cursor={{ fill: 'var(--color-paper)' }} />
      <Bar dataKey="count" fill="var(--color-blue)" barSize={7} radius={[0, 3, 3, 0]} isAnimationActive={false} />
    </BarChart>
  </ResponsiveContainer>;
}
