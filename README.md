# ⚽ Bolão Copa 2026

Plataforma de bolão da Copa do Mundo 2026 para disputar com amigos!

## ✨ Funcionalidades

- 🔐 Login e cadastro de usuários com avatar personalizável
- 📅 Lista de jogos da Copa por fase/rodada
- 🎯 Palpites com prazo automático (fecha quando o jogo começa)
- 🏆 Ranking automático com pontuação
- 🎖️ Medalhas para o pódio (ouro, prata, bronze)
- 🛡️ Área administrativa para lançar resultados
- 📱 Layout responsivo para celular
- 📊 Compartilhamento do ranking

## 🧮 Sistema de pontuação

| Resultado | Pontos |
|-----------|--------|
| ⭐ Placar exato | 5 pts |
| ✅ Acertar vencedor ou empate | 3 pts |
| ➕ Saldo de gols correto (bônus) | +1 pt |

---

## 🚀 Como rodar localmente

### 1. Clonar e instalar

```bash
git clone <seu-repo>
cd bolao-copa
npm install
```

### 2. Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Crie um novo projeto
3. Vá em **SQL Editor** e execute o arquivo `supabase/migrations/001_schema.sql`
4. Vá em **Project Settings → API** e copie:
   - `Project URL`
   - `anon/public` key

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env`:
```
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
```

### 4. Rodar o projeto

```bash
npm run dev
```

Acesse: http://localhost:5173

---

## 🌐 Deploy na Vercel

### Método 1: Via GitHub (recomendado)

1. Faça push do projeto para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. Adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Clique em Deploy!

### Método 2: Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 👤 Criar primeiro usuário Admin

1. Cadastre sua conta normalmente pelo site
2. Vá no Supabase → **Table Editor → profiles**
3. Encontre seu usuário e mude `is_admin` para `true`

A partir daí, você pode dar permissão de admin para outros usuários pelo **Painel Admin** do site.

---

## 🗄️ Estrutura do banco de dados

```
profiles       → usuários (estende auth.users do Supabase)
games          → jogos da Copa (data, times, resultado)
predictions    → palpites de cada usuário por jogo
ranking (view) → pontuação calculada automaticamente
```

### Função de cálculo de pontos

Quando um resultado é lançado no admin, o PostgreSQL recalcula automaticamente os pontos de todos os palpites daquele jogo via trigger.

---

## 🏗️ Estrutura do projeto

```
src/
  components/
    layout/     → Layout, Navbar
    ui/         → GameCard, PredictionModal, LoadingScreen
  contexts/     → AuthContext (auth + profile)
  lib/          → supabase.js, scoring.js
  pages/        → Home, Login, Register, Games, Predictions, Ranking, Profile, Admin
supabase/
  migrations/   → 001_schema.sql (schema completo + seed)
```

---

## 🔒 Segurança (Row Level Security)

- Usuários só veem e editam seus próprios palpites
- Jogos são públicos (leitura)
- Apenas admins podem criar/editar jogos e lançar resultados
- Palpites são bloqueados automaticamente quando o jogo começa

---

## 🛠️ Tech stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend/DB**: Supabase (PostgreSQL + Auth + RLS)
- **Hospedagem**: Vercel
- **Fontes**: Bebas Neue + Outfit (Google Fonts)
