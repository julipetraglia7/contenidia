# Contenidia — app (React + Vite + Supabase)

Rediseño desde cero. Los `.html` sueltos que hay en la raíz del repo son la versión vieja, no la vamos a tocar más.

---

## Paso a paso para arrancar Fase 1

### 1) Instalar Node.js

Vas a [nodejs.org/en/download](https://nodejs.org/en/download) → descargá el instalador **LTS** para Windows → siguiente → siguiente → finish.

Comprobá que funciona abriendo una terminal nueva:

```bash
node --version
npm --version
```

Los dos comandos tienen que devolver un número de versión.

### 2) Crear el proyecto en Supabase

1. Entrá a [supabase.com](https://supabase.com) → **Sign up** con GitHub o email.
2. Dashboard → **New project**.
3. Elegí:
   - Organization: la que sale por default.
   - Name: `contenidia`.
   - Database password: **guardala aparte, la vas a necesitar solo si querés acceso directo a la DB**.
   - Region: la más cercana (South America / Brazil si estás en Argentina).
   - Plan: **Free**.
4. Esperá ~2 minutos a que termine de crearse.

### 3) Copiar credenciales al proyecto

1. En el dashboard del proyecto → **Project Settings** (ícono de engranaje) → **API**.
2. Copiá dos valores:
   - **Project URL** (algo tipo `https://xxxxxxxxxxxx.supabase.co`).
   - **anon / public key** (empieza con `eyJhbGciOi...`).
3. En tu compu, dentro de `app/`, copiá `.env.example` a `.env.local`:

```bash
cd app
copy .env.example .env.local
```

4. Abrí `.env.local` con Notepad y pegá los dos valores.

### 4) Correr el schema en Supabase

1. En Supabase → **SQL Editor** → **+ New query**.
2. Abrí `app/db/schema.sql` de este repo, copiá TODO el contenido.
3. Pegalo en el SQL Editor de Supabase → **Run** (botón verde arriba a la derecha).
4. Tiene que decir "Success. No rows returned."

### 5) Crear el usuario admin

1. Supabase → **Authentication** → **Users** → **Add user** → **Send invitation**.
2. Poné tu email → **Send invitation**.
3. Te llega un mail con un link → click → ya sos usuario.

*(Alternativa: podés dejar que el login del app te mande el magic link la primera vez. Funciona igual.)*

### 6) Instalar dependencias y arrancar

```bash
cd app
npm install
npm run dev
```

Se abre en `http://localhost:5173`. Login con tu email → llega magic link → click → estás dentro.

---

## Qué hay en Fase 1

- **Login por magic link** (Supabase Auth).
- **Home de clientes** — lista + crear + eliminar.
- **Modelo de datos completo** ya definido en la DB (clientes, planificaciones, piezas de contenido) — solo la primera pantalla lo usa por ahora.

## Qué falta

- **Fase 2**: editor de planificación (calendario semana/mes, CRUD de piezas, upload de media).
- **Fase 3**: repositorio de planificaciones dentro de cada cliente.
- **Fase 4**: vista cliente + descarga.
- **Fase 5**: pase de diseño.
- **Fase 6**: migrar el contenido de La Cabrera desde los `.html` viejos.

---

## Estructura

```
app/
├── package.json          # deps: React, Vite, Supabase, React Router
├── vite.config.js
├── index.html            # entry point de Vite
├── .env.example          # plantilla de credenciales
├── .env.local            # ← creá vos con tus credenciales reales (no se commitea)
├── db/
│   └── schema.sql        # correr en Supabase → SQL Editor
└── src/
    ├── main.jsx          # bootstrap React + Router
    ├── App.jsx           # gate de sesión + rutas
    ├── supabaseClient.js # cliente Supabase compartido
    ├── styles/
    │   └── global.css    # design tokens + estilos base
    ├── components/
    │   └── Layout.jsx    # topbar con logout
    └── pages/
        ├── Login.jsx     # magic link
        └── ClientsHome.jsx # lista de clientes
```
