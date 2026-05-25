-- ============================================================
-- BOLÃO COPA 2026 - Schema completo
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- Habilitar extensão de uuid
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABELAS
-- ============================================================

-- Perfis de usuário (estende auth.users do Supabase)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  avatar_emoji text default '⚽',
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Jogos da Copa
create table games (
  id uuid default uuid_generate_v4() primary key,
  home_team text not null,
  away_team text not null,
  home_flag text,  -- emoji da bandeira
  away_flag text,
  match_date timestamptz not null,
  stadium text,
  round text not null default 'Fase de Grupos',  -- 'Fase de Grupos', 'Oitavas', 'Quartas', 'Semi', 'Final'
  group_name text,  -- 'A', 'B', etc
  home_score integer,  -- null até ser lançado
  away_score integer,
  status text default 'scheduled',  -- 'scheduled', 'live', 'finished'
  allow_predictions boolean default true,
  created_at timestamptz default now()
);

-- Palpites dos participantes
create table predictions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  game_id uuid references games(id) on delete cascade not null,
  home_score integer not null,
  away_score integer not null,
  points integer default 0,
  history jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, game_id)
);

-- ============================================================
-- FUNÇÕES E TRIGGERS
-- ============================================================

-- Criar perfil automaticamente ao registrar usuário
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_emoji)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_emoji', '⚽')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Calcular pontos de um palpite
create or replace function calculate_points(
  pred_home integer,
  pred_away integer,
  real_home integer,
  real_away integer
) returns integer as $$
declare
  points integer := 0;
  pred_diff integer;
  real_diff integer;
  pred_winner text;
  real_winner text;
begin
  -- Determinar vencedor/empate
  if pred_home > pred_away then pred_winner := 'home';
  elsif pred_home < pred_away then pred_winner := 'away';
  else pred_winner := 'draw';
  end if;

  if real_home > real_away then real_winner := 'home';
  elsif real_home < real_away then real_winner := 'away';
  else real_winner := 'draw';
  end if;

  -- Placar exato = 5 pontos
  if pred_home = real_home and pred_away = real_away then
    points := 5;
    return points;
  end if;

  -- Acertar vencedor/empate = 3 pontos
  if pred_winner = real_winner then
    points := 3;
    -- Saldo de gols = +1 ponto
    pred_diff := pred_home - pred_away;
    real_diff := real_home - real_away;
    if pred_diff = real_diff then
      points := points + 1;
    end if;
  end if;

  return points;
end;
$$ language plpgsql;

-- Atualizar pontos quando resultado for lançado
create or replace function update_predictions_points()
returns trigger as $$
begin
  -- Só atualiza se o jogo tiver resultado
  if new.home_score is not null and new.away_score is not null then
    update predictions
    set points = calculate_points(home_score, away_score, new.home_score, new.away_score)
    where game_id = new.id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger on_game_result_updated
  after update of home_score, away_score on games
  for each row execute function update_predictions_points();

-- Updated_at automático nas predictions
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger predictions_updated_at
  before update on predictions
  for each row execute function set_updated_at();

-- ============================================================
-- VIEWS
-- ============================================================

-- Ranking geral
create or replace view ranking as
select
  p.id,
  p.username,
  p.full_name,
  p.avatar_emoji,
  p.avatar_url,
  coalesce(sum(pr.points), 0) as total_points,
  count(pr.id) as total_predictions,
  count(case when pr.points = 5 then 1 end) as exact_scores,
  count(case when pr.points >= 3 then 1 end) as correct_results,
  rank() over (order by coalesce(sum(pr.points), 0) desc) as position
from profiles p
left join predictions pr on pr.user_id = p.id
group by p.id, p.username, p.full_name, p.avatar_emoji, p.avatar_url
order by total_points desc;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table profiles enable row level security;
alter table games enable row level security;
alter table predictions enable row level security;

-- Profiles: todos podem ver (mas apenas logados), só o próprio usuário ou admin pode editar
create policy "Profiles são públicos" on profiles for select using (auth.role() = 'authenticated');
create policy "Usuário edita próprio perfil" on profiles for update using (auth.uid() = id);

-- Games: todos podem ver (mas apenas logados), só admin pode criar/editar
create policy "Jogos são públicos" on games for select using (auth.role() = 'authenticated');
create policy "Admin cria jogos" on games for insert
  with check (exists (select 1 from profiles where id = auth.uid() and is_admin = true));
create policy "Admin edita jogos" on games for update
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));
create policy "Admin deleta jogos" on games for delete
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

-- Predictions: usuário vê os próprios, admin vê todos; só pode criar/editar antes do jogo começar
create policy "Usuário vê próprios palpites" on predictions for select
  using (auth.uid() = user_id);
create policy "Admin vê todos palpites" on predictions for select
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));
create policy "Usuário cria palpite antes do jogo" on predictions for insert
  with check (
    auth.uid() = user_id and
    exists (select 1 from games where id = game_id and match_date > now() and allow_predictions = true)
  );
create policy "Usuário edita palpite antes do jogo" on predictions for update
  using (
    auth.uid() = user_id and
    exists (select 1 from games where id = game_id and match_date > now() and allow_predictions = true)
  );

-- ============================================================
-- SEED INICIAL
-- ============================================================

-- Jogos da Copa 2026 (fase de grupos - amostra)
insert into games (home_team, away_team, home_flag, away_flag, match_date, stadium, round, group_name) values
('Brasil', 'Marrocos', '🇧🇷', '🇲🇦', '2026-06-12 18:00:00+00', 'MetLife Stadium, Nova Jersey', 'Fase de Grupos', 'C'),
('Brasil', 'Haiti', '🇧🇷', '🇭🇹', '2026-06-17 21:00:00+00', 'AT&T Stadium, Dallas', 'Fase de Grupos', 'C'),
('Brasil', 'Escócia', '🇧🇷', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '2026-06-22 18:00:00+00', 'SoFi Stadium, Los Angeles', 'Fase de Grupos', 'C'),
('Argentina', 'Argélia', '🇦🇷', '🇩🇿', '2026-06-13 15:00:00+00', 'Gillette Stadium, Boston', 'Fase de Grupos', 'J'),
('Argentina', 'Áustria', '🇦🇷', '🇦🇹', '2026-06-18 18:00:00+00', 'Rose Bowl, Los Angeles', 'Fase de Grupos', 'J'),
('França', 'Senegal', '🇫🇷', '🇸🇳', '2026-06-14 21:00:00+00', 'Lumen Field, Seattle', 'Fase de Grupos', 'I'),
('Espanha', 'Cabo Verde', '🇪🇸', '🇨🇻', '2026-06-15 18:00:00+00', 'Arrowhead Stadium, Kansas City', 'Fase de Grupos', 'H'),
('Alemanha', 'Portugal', '🇩🇪', '🇵🇹', '2026-06-16 21:00:00+00', 'Estadio Azteca, Cidade do México', 'Fase de Grupos', 'D'),
('Inglaterra', 'Uruguai', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇺🇾', '2026-06-19 15:00:00+00', 'BC Place, Vancouver', 'Fase de Grupos', 'B'),
('Portugal', 'Turquia', '🇵🇹', '🇹🇷', '2026-06-20 21:00:00+00', 'Lincoln Financial Field, Filadélfia', 'Fase de Grupos', 'D');
