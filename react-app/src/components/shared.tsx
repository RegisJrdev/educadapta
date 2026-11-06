import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, ChevronLeft, ChevronRight, Search, X, Leaf } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
export { Button, Input };
export function Brand() { return <a href="/" className="brand" aria-label="EducAdapta — início"><span className="brand-icon"><img src="/images/logo.png" alt=""/></span><span>Educ<span className="brand-accent">Adapta</span><small>EDUCAÇÃO QUE INCLUI</small></span></a>; }
export function Avatar({ name, index = 0, small = false }: any) { return <span className={`avatar avatar-${index % 5} ${small ? 'small' : ''}`} aria-hidden="true">{name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}</span>; }
export function Badge({ children, tone = 'green' }: any) { return <span className={`badge ${tone}`}><i/>{children}</span>; }
export const riskLabels = { baixo: 'Rotina', atencao: 'Atenção pontual', moderado: 'Acompanhamento próximo', alto: 'Apoio prioritário' };
export function Risk({ value }: any) { return <Badge tone={{ baixo: 'green', atencao: 'amber', moderado: 'orange', alto: 'rose' }[value] || 'gray'}>{riskLabels[value] || value}</Badge>; }
export function Heading({ eyebrow, title, description, children }: any) { return <div className="page-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p>{description}</p></div><div className="heading-actions">{children}</div></div>; }
export function Panel({ title, subtitle, action, children, className = '' }: any) { return <section className={`panel ${className}`}><div className="panel-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div>{children}</section>; }
export function Empty({ title = 'Nenhum resultado encontrado', description = 'Tente buscar por outro termo.' }: any) { return <div className="empty"><Search/><h3>{title}</h3><p>{description}</p></div>; }
export function Field({ label, children, hint }: any) { return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>; }
export function Modal({ open, onOpenChange, title, description, children }: any) { return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="app-dialog"><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description || 'Confira os detalhes abaixo.'}</DialogDescription></DialogHeader>{children}</DialogContent></Dialog>; }
export function DataTable({ rows, columns, searchPlaceholder = 'Buscar...', filters, searchable = true }: any) {
 const [search, setSearch] = useState('');
 const [page, setPage] = useState(0);
 const [pageSize, setPageSize] = useState(7);
 const viewport = useRef<HTMLDivElement>(null);
 const measuredPageSize = useRef(7);
 const matches = rows.filter((r: any) => JSON.stringify(r).toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')));
 const pages = Math.max(1, Math.ceil(matches.length / pageSize));
 const current = Math.min(page, pages - 1);
 useEffect(() => {
  const element = viewport.current;
  if (!element || typeof ResizeObserver === 'undefined') return;
  const resize = () => {
   const headerHeight = element.querySelector('thead')?.getBoundingClientRect().height || 34;
   const rowHeight = element.querySelector('tbody tr')?.getBoundingClientRect().height || 62;
   const size = Math.max(1, Math.min(25, Math.floor((element.clientHeight - headerHeight) / rowHeight)));
   // Preserve the first visible record when the device changes orientation or size.
   if (measuredPageSize.current !== size) {
    const previous = measuredPageSize.current;
    measuredPageSize.current = size;
    setPage(previousPage => Math.floor(previousPage * previous / size));
    setPageSize(size);
   }
  };
  const observer = new ResizeObserver(resize);
  observer.observe(element);
  resize();
  return () => observer.disconnect();
 }, [columns, matches.length]);
 return <div className="data-table">
  {(searchable || filters) && <div className="table-toolbar">
   {searchable && <div className="search-field"><Search size={16}/><Input aria-label={searchPlaceholder} placeholder={searchPlaceholder} value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}/>{search && <button aria-label="Limpar busca" onClick={() => setSearch('')}><X size={14}/></button>}</div>}{filters}
  </div>}
  <div ref={viewport} className="table-scroll" tabIndex={0} role="region" aria-label="Registros da tabela">
   <table><thead><tr>{columns.map((col: any) => <th key={col.key}>{col.label}</th>)}</tr></thead><tbody>{matches.slice(current * pageSize, (current + 1) * pageSize).map((row: any) => <tr key={row.id}>{columns.map((col: any) => <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>)}</tr>)}</tbody></table>
   {!matches.length && <Empty/>}
  </div>
  <div className="table-footer"><span>{matches.length ? current * pageSize + 1 : 0}–{Math.min((current + 1) * pageSize, matches.length)} de {matches.length} registros</span><div><Button variant="outline" size="icon" aria-label="Página anterior" disabled={!current} onClick={() => setPage(current - 1)}><ChevronLeft/></Button><span>{current + 1} / {pages}</span><Button variant="outline" size="icon" aria-label="Próxima página" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}><ChevronRight/></Button></div></div>
 </div>;
}
export function exportCsv(filename: string, rows: any[]) {
 const columns = Object.keys(rows[0] || {});
 const quote = (v: any) => '"' + String(v ?? '').replace(/^[=+@-]/, "'$&").replaceAll('"', '""') + '"';
 const text = '\uFEFF' + [columns.map(quote).join(';'), ...rows.map(row => columns.map(col => quote(row[col])).join(';'))].join('\r\n');
 const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8;' }));
 const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}
export function Export({ rows, filename = 'educadapta.csv' }: any) { return <Button variant="outline" onClick={() => exportCsv(filename, rows)}><ArrowDownToLine/>Exportar</Button>; }
export function TextLink({ children, onClick }: any) { return <Button variant="ghost" className="text-link" onClick={onClick}>{children}<ArrowUpRight size={15}/></Button>; }
