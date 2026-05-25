
alter table games add column if not exists match_number integer unique;
alter table games add column if not exists penalty_home_score integer;
alter table games add column if not exists penalty_away_score integer;

-- Remover todos os jogos existentes para aplicar a carga completa
DELETE FROM games;

INSERT INTO games (match_number, home_team, away_team, match_date, stadium, round, group_name) VALUES
(1, 'Mexico', 'South Africa', '2026-06-11 13:00:00-600', 'Mexico City', 'Fase de Grupos', 'A'),
(2, 'South Korea', 'Czech Republic', '2026-06-11 20:00:00-600', 'Guadalajara (Zapopan)', 'Fase de Grupos', 'A'),
(3, 'Czech Republic', 'South Africa', '2026-06-18 12:00:00-400', 'Atlanta', 'Fase de Grupos', 'A'),
(4, 'Mexico', 'South Korea', '2026-06-18 19:00:00-600', 'Guadalajara (Zapopan)', 'Fase de Grupos', 'A'),
(5, 'Czech Republic', 'Mexico', '2026-06-24 19:00:00-600', 'Mexico City', 'Fase de Grupos', 'A'),
(6, 'South Africa', 'South Korea', '2026-06-24 19:00:00-600', 'Monterrey (Guadalupe)', 'Fase de Grupos', 'A'),
(7, 'Canada', 'Bosnia & Herzegovina', '2026-06-12 15:00:00-400', 'Toronto', 'Fase de Grupos', 'B'),
(8, 'Qatar', 'Switzerland', '2026-06-13 12:00:00-700', 'San Francisco Bay Area (Santa Clara)', 'Fase de Grupos', 'B'),
(9, 'Switzerland', 'Bosnia & Herzegovina', '2026-06-18 12:00:00-700', 'Los Angeles (Inglewood)', 'Fase de Grupos', 'B'),
(10, 'Canada', 'Qatar', '2026-06-18 15:00:00-700', 'Vancouver', 'Fase de Grupos', 'B'),
(11, 'Switzerland', 'Canada', '2026-06-24 12:00:00-700', 'Vancouver', 'Fase de Grupos', 'B'),
(12, 'Bosnia & Herzegovina', 'Qatar', '2026-06-24 12:00:00-700', 'Seattle', 'Fase de Grupos', 'B'),
(13, 'Brazil', 'Morocco', '2026-06-13 18:00:00-400', 'New York/New Jersey (East Rutherford)', 'Fase de Grupos', 'C'),
(14, 'Haiti', 'Scotland', '2026-06-13 21:00:00-400', 'Boston (Foxborough)', 'Fase de Grupos', 'C'),
(15, 'Scotland', 'Morocco', '2026-06-19 18:00:00-400', 'Boston (Foxborough)', 'Fase de Grupos', 'C'),
(16, 'Brazil', 'Haiti', '2026-06-19 20:30:00-400', 'Philadelphia', 'Fase de Grupos', 'C'),
(17, 'Scotland', 'Brazil', '2026-06-24 18:00:00-400', 'Miami (Miami Gardens)', 'Fase de Grupos', 'C'),
(18, 'Morocco', 'Haiti', '2026-06-24 18:00:00-400', 'Atlanta', 'Fase de Grupos', 'C'),
(19, 'USA', 'Paraguay', '2026-06-12 18:00:00-700', 'Los Angeles (Inglewood)', 'Fase de Grupos', 'D'),
(20, 'Australia', 'Turkey', '2026-06-13 21:00:00-700', 'Vancouver', 'Fase de Grupos', 'D'),
(21, 'USA', 'Australia', '2026-06-19 12:00:00-700', 'Seattle', 'Fase de Grupos', 'D'),
(22, 'Turkey', 'Paraguay', '2026-06-19 20:00:00-700', 'San Francisco Bay Area (Santa Clara)', 'Fase de Grupos', 'D'),
(23, 'Turkey', 'USA', '2026-06-25 19:00:00-700', 'Los Angeles (Inglewood)', 'Fase de Grupos', 'D'),
(24, 'Paraguay', 'Australia', '2026-06-25 19:00:00-700', 'San Francisco Bay Area (Santa Clara)', 'Fase de Grupos', 'D'),
(25, 'Germany', 'Curaçao', '2026-06-14 12:00:00-500', 'Houston', 'Fase de Grupos', 'E'),
(26, 'Ivory Coast', 'Ecuador', '2026-06-14 19:00:00-400', 'Philadelphia', 'Fase de Grupos', 'E'),
(27, 'Germany', 'Ivory Coast', '2026-06-20 16:00:00-400', 'Toronto', 'Fase de Grupos', 'E'),
(28, 'Ecuador', 'Curaçao', '2026-06-20 19:00:00-500', 'Kansas City', 'Fase de Grupos', 'E'),
(29, 'Curaçao', 'Ivory Coast', '2026-06-25 16:00:00-400', 'Philadelphia', 'Fase de Grupos', 'E'),
(30, 'Ecuador', 'Germany', '2026-06-25 16:00:00-400', 'New York/New Jersey (East Rutherford)', 'Fase de Grupos', 'E'),
(31, 'Netherlands', 'Japan', '2026-06-14 15:00:00-500', 'Dallas (Arlington)', 'Fase de Grupos', 'F'),
(32, 'Sweden', 'Tunisia', '2026-06-14 20:00:00-600', 'Monterrey (Guadalupe)', 'Fase de Grupos', 'F'),
(33, 'Netherlands', 'Sweden', '2026-06-20 12:00:00-500', 'Houston', 'Fase de Grupos', 'F'),
(34, 'Tunisia', 'Japan', '2026-06-20 22:00:00-600', 'Monterrey (Guadalupe)', 'Fase de Grupos', 'F'),
(35, 'Japan', 'Sweden', '2026-06-25 18:00:00-500', 'Dallas (Arlington)', 'Fase de Grupos', 'F'),
(36, 'Tunisia', 'Netherlands', '2026-06-25 18:00:00-500', 'Kansas City', 'Fase de Grupos', 'F'),
(37, 'Belgium', 'Egypt', '2026-06-15 12:00:00-700', 'Seattle', 'Fase de Grupos', 'G'),
(38, 'Iran', 'New Zealand', '2026-06-15 18:00:00-700', 'Los Angeles (Inglewood)', 'Fase de Grupos', 'G'),
(39, 'Belgium', 'Iran', '2026-06-21 12:00:00-700', 'Los Angeles (Inglewood)', 'Fase de Grupos', 'G'),
(40, 'New Zealand', 'Egypt', '2026-06-21 18:00:00-700', 'Vancouver', 'Fase de Grupos', 'G'),
(41, 'Egypt', 'Iran', '2026-06-26 20:00:00-700', 'Seattle', 'Fase de Grupos', 'G'),
(42, 'New Zealand', 'Belgium', '2026-06-26 20:00:00-700', 'Vancouver', 'Fase de Grupos', 'G'),
(43, 'Spain', 'Cape Verde', '2026-06-15 12:00:00-400', 'Atlanta', 'Fase de Grupos', 'H'),
(44, 'Saudi Arabia', 'Uruguay', '2026-06-15 18:00:00-400', 'Miami (Miami Gardens)', 'Fase de Grupos', 'H'),
(45, 'Spain', 'Saudi Arabia', '2026-06-21 12:00:00-400', 'Atlanta', 'Fase de Grupos', 'H'),
(46, 'Uruguay', 'Cape Verde', '2026-06-21 18:00:00-400', 'Miami (Miami Gardens)', 'Fase de Grupos', 'H'),
(47, 'Cape Verde', 'Saudi Arabia', '2026-06-26 19:00:00-500', 'Houston', 'Fase de Grupos', 'H'),
(48, 'Uruguay', 'Spain', '2026-06-26 18:00:00-600', 'Guadalajara (Zapopan)', 'Fase de Grupos', 'H'),
(49, 'France', 'Senegal', '2026-06-16 15:00:00-400', 'New York/New Jersey (East Rutherford)', 'Fase de Grupos', 'I'),
(50, 'Iraq', 'Norway', '2026-06-16 18:00:00-400', 'Boston (Foxborough)', 'Fase de Grupos', 'I'),
(51, 'France', 'Iraq', '2026-06-22 17:00:00-400', 'Philadelphia', 'Fase de Grupos', 'I'),
(52, 'Norway', 'Senegal', '2026-06-22 20:00:00-400', 'New York/New Jersey (East Rutherford)', 'Fase de Grupos', 'I'),
(53, 'Norway', 'France', '2026-06-26 15:00:00-400', 'Boston (Foxborough)', 'Fase de Grupos', 'I'),
(54, 'Senegal', 'Iraq', '2026-06-26 15:00:00-400', 'Toronto', 'Fase de Grupos', 'I'),
(55, 'Argentina', 'Algeria', '2026-06-16 20:00:00-500', 'Kansas City', 'Fase de Grupos', 'J'),
(56, 'Austria', 'Jordan', '2026-06-16 21:00:00-700', 'San Francisco Bay Area (Santa Clara)', 'Fase de Grupos', 'J'),
(57, 'Argentina', 'Austria', '2026-06-22 12:00:00-500', 'Dallas (Arlington)', 'Fase de Grupos', 'J'),
(58, 'Jordan', 'Algeria', '2026-06-22 20:00:00-700', 'San Francisco Bay Area (Santa Clara)', 'Fase de Grupos', 'J'),
(59, 'Algeria', 'Austria', '2026-06-27 21:00:00-500', 'Kansas City', 'Fase de Grupos', 'J'),
(60, 'Jordan', 'Argentina', '2026-06-27 21:00:00-500', 'Dallas (Arlington)', 'Fase de Grupos', 'J'),
(61, 'Portugal', 'DR Congo', '2026-06-17 12:00:00-500', 'Houston', 'Fase de Grupos', 'K'),
(62, 'Uzbekistan', 'Colombia', '2026-06-17 20:00:00-600', 'Mexico City', 'Fase de Grupos', 'K'),
(63, 'Portugal', 'Uzbekistan', '2026-06-23 12:00:00-500', 'Houston', 'Fase de Grupos', 'K'),
(64, 'Colombia', 'DR Congo', '2026-06-23 20:00:00-600', 'Guadalajara (Zapopan)', 'Fase de Grupos', 'K'),
(65, 'Colombia', 'Portugal', '2026-06-27 19:30:00-400', 'Miami (Miami Gardens)', 'Fase de Grupos', 'K'),
(66, 'DR Congo', 'Uzbekistan', '2026-06-27 19:30:00-400', 'Atlanta', 'Fase de Grupos', 'K'),
(67, 'England', 'Croatia', '2026-06-17 15:00:00-500', 'Dallas (Arlington)', 'Fase de Grupos', 'L'),
(68, 'Ghana', 'Panama', '2026-06-17 19:00:00-400', 'Toronto', 'Fase de Grupos', 'L'),
(69, 'England', 'Ghana', '2026-06-23 16:00:00-400', 'Boston (Foxborough)', 'Fase de Grupos', 'L'),
(70, 'Panama', 'Croatia', '2026-06-23 19:00:00-400', 'Toronto', 'Fase de Grupos', 'L'),
(71, 'Panama', 'England', '2026-06-27 17:00:00-400', 'New York/New Jersey (East Rutherford)', 'Fase de Grupos', 'L'),
(72, 'Croatia', 'Ghana', '2026-06-27 17:00:00-400', 'Philadelphia', 'Fase de Grupos', 'L'),
(73, '2A', '2B', '2026-06-28 12:00:00-700', 'Los Angeles (Inglewood)', '16-avos', null),
(74, '1E', '3A/B/C/D/F', '2026-06-29 16:30:00-400', 'Boston (Foxborough)', '16-avos', null),
(75, '1F', '2C', '2026-06-29 19:00:00-600', 'Monterrey (Guadalupe)', '16-avos', null),
(76, '1C', '2F', '2026-06-29 12:00:00-500', 'Houston', '16-avos', null),
(77, '1I', '3C/D/F/G/H', '2026-06-30 17:00:00-400', 'New York/New Jersey (East Rutherford)', '16-avos', null),
(78, '2E', '2I', '2026-06-30 12:00:00-500', 'Dallas (Arlington)', '16-avos', null),
(79, '1A', '3C/E/F/H/I', '2026-06-30 19:00:00-600', 'Mexico City', '16-avos', null),
(80, '1L', '3E/H/I/J/K', '2026-07-01 12:00:00-400', 'Atlanta', '16-avos', null),
(81, '1D', '3B/E/F/I/J', '2026-07-01 17:00:00-700', 'San Francisco Bay Area (Santa Clara)', '16-avos', null),
(82, '1G', '3A/E/H/I/J', '2026-07-01 13:00:00-700', 'Seattle', '16-avos', null),
(83, '2K', '2L', '2026-07-02 19:00:00-400', 'Toronto', '16-avos', null),
(84, '1H', '2J', '2026-07-02 12:00:00-700', 'Los Angeles (Inglewood)', '16-avos', null),
(85, '1B', '3E/F/G/I/J', '2026-07-02 20:00:00-700', 'Vancouver', '16-avos', null),
(86, '1J', '2H', '2026-07-03 18:00:00-400', 'Miami (Miami Gardens)', '16-avos', null),
(87, '1K', '3D/E/I/J/L', '2026-07-03 20:30:00-500', 'Kansas City', '16-avos', null),
(88, '2D', '2G', '2026-07-03 13:00:00-500', 'Dallas (Arlington)', '16-avos', null),
(89, 'W74', 'W77', '2026-07-04 17:00:00-400', 'Philadelphia', 'Oitavas', null),
(90, 'W73', 'W75', '2026-07-04 12:00:00-500', 'Houston', 'Oitavas', null),
(91, 'W76', 'W78', '2026-07-05 16:00:00-400', 'New York/New Jersey (East Rutherford)', 'Oitavas', null),
(92, 'W79', 'W80', '2026-07-05 18:00:00-600', 'Mexico City', 'Oitavas', null),
(93, 'W83', 'W84', '2026-07-06 14:00:00-500', 'Dallas (Arlington)', 'Oitavas', null),
(94, 'W81', 'W82', '2026-07-06 17:00:00-700', 'Seattle', 'Oitavas', null),
(95, 'W86', 'W88', '2026-07-07 12:00:00-400', 'Atlanta', 'Oitavas', null),
(96, 'W85', 'W87', '2026-07-07 13:00:00-700', 'Vancouver', 'Oitavas', null),
(97, 'W89', 'W90', '2026-07-09 16:00:00-400', 'Boston (Foxborough)', 'Quartas', null),
(98, 'W93', 'W94', '2026-07-10 12:00:00-700', 'Los Angeles (Inglewood)', 'Quartas', null),
(99, 'W91', 'W92', '2026-07-11 17:00:00-400', 'Miami (Miami Gardens)', 'Quartas', null),
(100, 'W95', 'W96', '2026-07-11 20:00:00-500', 'Kansas City', 'Quartas', null),
(101, 'W97', 'W98', '2026-07-14 14:00:00-500', 'Dallas (Arlington)', 'Semi', null),
(102, 'W99', 'W100', '2026-07-15 15:00:00-400', 'Atlanta', 'Semi', null),
(103, 'L101', 'L102', '2026-07-18 17:00:00-400', 'Miami (Miami Gardens)', 'Terceiro Lugar', null),
(104, 'W101', 'W102', '2026-07-19 15:00:00-400', 'New York/New Jersey (East Rutherford)', 'Final', null);


-- Drop existing trigger if it exists to avoid errors
drop trigger if exists advance_teams_trigger on games;
drop function if exists advance_teams_in_bracket();

create or replace function advance_teams_in_bracket()
returns trigger as $$
declare
  winner_name text;
  loser_name text;
  m_num text;
begin
  -- Only run if there is a match number and a result is being published/updated
  if new.match_number is null then
    return new;
  end if;

  if new.home_score is not null and new.away_score is not null then
    -- Check if it's a draw and we have penalties
    if new.home_score > new.away_score then
      winner_name := new.home_team;
      loser_name := new.away_team;
    elsif new.away_score > new.home_score then
      winner_name := new.away_team;
      loser_name := new.home_team;
    elsif new.home_score = new.away_score then
      -- It's a draw. Check penalties
      if new.penalty_home_score is not null and new.penalty_away_score is not null then
        if new.penalty_home_score > new.penalty_away_score then
          winner_name := new.home_team;
          loser_name := new.away_team;
        elsif new.penalty_away_score > new.penalty_home_score then
          winner_name := new.away_team;
          loser_name := new.home_team;
        else
          return new; -- Penaltis empatados? Invalido, nao avanca
        end if;
      else
        return new; -- Sem penaltis lançados, não avança ainda
      end if;
    end if;

    m_num := new.match_number::text;

    -- Update future games waiting for this winner (W<match_number>)
    update games set home_team = winner_name where home_team = 'W' || m_num;
    update games set away_team = winner_name where away_team = 'W' || m_num;
    
    -- Update future games waiting for this loser (L<match_number>)
    update games set home_team = loser_name where home_team = 'L' || m_num;
    update games set away_team = loser_name where away_team = 'L' || m_num;
  end if;
  
  return new;
end;
$$ language plpgsql;

create trigger advance_teams_trigger
  after update of home_score, away_score, penalty_home_score, penalty_away_score on games
  for each row execute function advance_teams_in_bracket();
