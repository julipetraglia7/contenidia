import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.href.split('#')[0] }
    });
    setBusy(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">Contenidia</div>
        <h1 className="auth-title">Iniciar sesión</h1>
        {sent ? (
          <p className="auth-sent">
            Revisá tu bandeja de entrada — te enviamos un link mágico. Puede tardar hasta 30 segundos.
          </p>
        ) : (
          <>
            <p className="auth-sub">Ingresá tu email y te mandamos un link para entrar.</p>
            <form onSubmit={submit} className="auth-form">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoFocus
                autoComplete="email"
              />
              <button type="submit" disabled={busy}>
                {busy ? 'Enviando…' : 'Enviar link mágico'}
              </button>
              {error && <p className="auth-error">{error}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
