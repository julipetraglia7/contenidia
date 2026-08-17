import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Login from './pages/Login.jsx';
import ClientsHome from './pages/ClientsHome.jsx';
import Layout from './components/Layout.jsx';

export default function App() {
  // undefined = cargando, null = sin sesión, object = sesión activa.
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="app-loading">Cargando…</div>;
  }
  if (!session) {
    return <Login />;
  }

  return (
    <Layout session={session}>
      <Routes>
        <Route path="/" element={<ClientsHome />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
