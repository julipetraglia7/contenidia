import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const DEFAULT_COLORS = {
  bg: '#191919',
  card: '#211a1a',
  border: '#5a3a38',
  ink: '#f7f7df',
  accent: '#a91917',
  accentSoft: '#d28379'
};

export default function ClientsHome() {
  const [clients, setClients] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');

  async function fetchClients() {
    setError('');
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, brand_colors, created_at, updated_at')
      .order('updated_at', { ascending: false });
    if (error) setError(error.message);
    else setClients(data || []);
  }

  useEffect(() => { fetchClients(); }, []);

  async function createClient(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from('clients').insert({
      name: newName.trim(),
      brand_colors: DEFAULT_COLORS,
      owner_id: userData?.user?.id
    });
    setLoading(false);
    if (error) setError(error.message);
    else { setNewName(''); fetchClients(); }
  }

  async function deleteClient(id, name) {
    if (!confirm(`¿Eliminar el cliente "${name}" y todas sus planificaciones?`)) return;
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) setError(error.message);
    else fetchClients();
  }

  return (
    <div className="page">
      <div className="page-eyebrow">Contenidia</div>
      <h1 className="page-title">Clientes</h1>
      <p className="page-sub">Cada cliente es una carpeta con sus planificaciones mensuales.</p>

      <form onSubmit={createClient} className="create-row">
        <input
          type="text"
          placeholder="Nombre del cliente (ej: La Cabrera · Marbella)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" disabled={loading || !newName.trim()}>
          + Nuevo cliente
        </button>
      </form>

      {error && <p className="page-error">{error}</p>}

      {clients === null ? (
        <p className="page-loading">Cargando clientes…</p>
      ) : clients.length === 0 ? (
        <p className="page-empty">Todavía no tenés clientes. Creá el primero arriba.</p>
      ) : (
        <ul className="client-list">
          {clients.map((c) => (
            <li key={c.id} className="client-card">
              <div className="client-swatches">
                {['bg', 'card', 'border', 'ink', 'accent', 'accentSoft'].map((k) => (
                  <span key={k} className="swatch-dot" style={{ background: c.brand_colors?.[k] || '#000' }} />
                ))}
              </div>
              <div className="client-info">
                <div className="client-name">{c.name}</div>
                <div className="client-meta">
                  Última edición: {new Date(c.updated_at).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div className="client-actions">
                <button type="button" onClick={() => alert('Abrir cliente — próxima fase')}>Abrir</button>
                <button type="button" className="danger" onClick={() => deleteClient(c.id, c.name)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
