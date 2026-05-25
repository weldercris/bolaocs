-- 1. Create players table
create table if not exists players (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  team text not null,
  goals integer default 0,
  number integer,
  position text,
  created_at timestamptz default now()
);

-- 2. Create favorites table
create table if not exists favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  item_type text not null check (item_type in ('team', 'game', 'player')),
  item_id text not null, -- can be uuid for game/player, or text for team name
  created_at timestamptz default now(),
  unique(user_id, item_type, item_id)
);

-- 3. Update games and predictions
alter table games add column if not exists scorers jsonb default '[]'::jsonb;
alter table predictions add column if not exists predicted_scorers jsonb default '[]'::jsonb;

-- 4. Update points calculation
drop trigger if exists on_game_result_updated on games;
drop function if exists update_predictions_points();
drop function if exists calculate_points(integer, integer, integer, integer);

create or replace function calculate_points(
  pred_home integer,
  pred_away integer,
  real_home integer,
  real_away integer,
  pred_scorers jsonb,
  real_scorers jsonb
) returns integer as $$
declare
  points integer := 0;
  pred_diff integer;
  real_diff integer;
  pred_winner text;
  real_winner text;
  pred_scorer text;
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
  -- Acertar vencedor/empate = 3 pontos
  elsif pred_winner = real_winner then
    points := 3;
    -- Saldo de gols = +1 ponto
    pred_diff := pred_home - pred_away;
    real_diff := real_home - real_away;
    if pred_diff = real_diff then
      points := points + 1;
    end if;
  end if;

  -- Extra points for scorers (+2 per correct scorer)
  if pred_scorers is not null and real_scorers is not null then
    for pred_scorer in select jsonb_array_elements_text(pred_scorers)
    loop
      if real_scorers ? pred_scorer then
         points := points + 2;
      end if;
    end loop;
  end if;

  return points;
end;
$$ language plpgsql;

create or replace function update_predictions_points()
returns trigger as $$
begin
  -- Só atualiza se o jogo tiver resultado
  if new.home_score is not null and new.away_score is not null then
    update predictions
    set points = calculate_points(
        home_score, away_score, 
        new.home_score, new.away_score,
        predicted_scorers, new.scorers
    )
    where game_id = new.id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger on_game_result_updated
  after update of home_score, away_score, scorers on games
  for each row execute function update_predictions_points();

-- 5. RLS Policies
alter table players enable row level security;
alter table favorites enable row level security;

create policy "Players are public" on players for select using (auth.role() = 'authenticated');
create policy "Admin manages players" on players for all using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

create policy "Favorites select" on favorites for select using (auth.uid() = user_id);
create policy "Favorites insert" on favorites for insert with check (auth.uid() = user_id);
create policy "Favorites delete" on favorites for delete using (auth.uid() = user_id);

-- Drop the old update policy for predictions
drop policy if exists "Usuário edita palpite antes do jogo" on predictions;
