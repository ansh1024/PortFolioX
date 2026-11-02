export default function ProfilePanel({title,caption,children}) { return <section className="pf-panel"><header><h3>{title}</h3>{caption && <span>{caption}</span>}</header>{children}</section>; }
export function ProfileFields({items}) { return <dl className="pf-fields">{items.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value || 'Unavailable'}</dd></div>)}</dl>; }
