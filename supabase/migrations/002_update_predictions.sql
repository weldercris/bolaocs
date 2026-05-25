-- Executar no SQL Editor do Supabase para aplicar as alterações

alter table games add column if not exists allow_predictions boolean default true;
alter table predictions add column if not exists history jsonb default '[]'::jsonb;

-- Atualizar as políticas de segurança (RLS) da tabela predictions
drop policy if exists "Usuário cria palpite antes do jogo" on predictions;
create policy "Usuário cria palpite antes do jogo" on predictions for insert
  with check (
    auth.uid() = user_id and
    exists (select 1 from games where id = game_id and match_date > now() and allow_predictions = true)
  );

drop policy if exists "Usuário edita palpite antes do jogo" on predictions;
create policy "Usuário edita palpite antes do jogo" on predictions for update
  using (
    auth.uid() = user_id and
    exists (select 1 from games where id = game_id and match_date > now() and allow_predictions = true)
  );
