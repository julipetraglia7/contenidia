import { supabase } from '../supabaseClient';

export default function Layout({ children, session }) {
  async function logout() {
    await supabase.auth.signOut();
  }
  return (
    <div className="layout">
      <header className="topbar">
        <div className="topbar-brand">Contenidia</div>
        <div className="topbar-right">
          <span className="topbar-user">{session?.user?.email}</span>
          <button type="button" onClick={logout} className="topbar-logout">Salir</button>
        </div>
      </header>
      <main className="layout-main">{children}</main>
    </div>
  );
}
