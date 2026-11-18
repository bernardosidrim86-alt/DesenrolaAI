create table public.journeys (
  id text primary key,
  title text not null,
  category text not null,
  description text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.journeys enable row level security;
grant select on public.journeys to anon, authenticated;
create policy "Active journeys are visible to everyone"
  on public.journeys for select to anon, authenticated using (is_active = true);
alter table public.missions
  add column journey_id text references public.journeys(id) on delete set null,
  add column lesson_content text not null default '',
  add column question text not null default '',
  add column options jsonb not null default '[]'::jsonb,
  add column correct_option text,
  add column explanation text not null default '',
  add column estimated_minutes integer not null default 3 check (estimated_minutes between 1 and 60);
alter table public.missions add constraint missions_options_array_check check (jsonb_typeof(options) = 'array');
insert into public.journeys (id, title, category, description, sort_order)
values
  ('vida-real-101', 'Vida real 101', 'Autonomia', 'Uma introdução prática para tomar decisões e se virar melhor no cotidiano.', 1),
  ('dinheiro-e-escolhas', 'Seu dinheiro, suas escolhas', 'Dinheiro e consumo', 'Aprenda a organizar prioridades e fazer escolhas mais conscientes com seu dinheiro.', 2),
  ('converse-com-confianca', 'Converse com confiança', 'Comunicação e relações', 'Pratique clareza, escuta e limites em situações comuns.', 3)
on conflict (id) do update set title = excluded.title, category = excluded.category, description = excluded.description, sort_order = excluded.sort_order, is_active = true;
update public.missions set journey_id = 'vida-real-101',
  lesson_content = 'Quando surge uma escolha, uma pausa curta para entender o problema, comparar possibilidades e pensar nas consequências pode evitar decisões por impulso.',
  question = 'Você quer comprar algo que custa caro. O que faz primeiro?',
  options = '[{"id":"a","text":"Decidir na hora, sem pensar muito."},{"id":"b","text":"Pesquisar, comparar opções e avaliar o que faz sentido para mim."},{"id":"c","text":"Escolher o que outra pessoa recomendou, sem conferir."}]'::jsonb,
  correct_option = 'b',
  explanation = 'Comparar opções, conferir se a compra cabe no orçamento e pensar se você realmente precisa do item ajuda a decidir com mais consciência.',
  estimated_minutes = 3 where id = 'autonomia-decisao-01';
update public.missions set journey_id = 'dinheiro-e-escolhas',
  lesson_content = 'Ter controle do dinheiro começa por enxergar para onde ele está indo. Priorize gastos essenciais, acompanhe pequenas despesas e evite assumir compromissos sem entender o custo total.',
  question = 'Você percebeu que está gastando mais do que recebe. Qual é o primeiro passo mais útil?',
  options = '[{"id":"a","text":"Fazer outra compra parcelada para resolver o aperto."},{"id":"b","text":"Anotar receitas e despesas, identificar excessos e priorizar o essencial."},{"id":"c","text":"Ignorar os gastos e esperar o próximo mês."}]'::jsonb,
  correct_option = 'b',
  explanation = 'Registrar o que entra e sai ajuda a encontrar os pontos de atenção e montar um plano realista antes de assumir novas dívidas.',
  estimated_minutes = 4 where id = 'dinheiro-escolhas-01';
update public.missions set journey_id = 'converse-com-confianca',
  lesson_content = 'Comunicar limites não precisa virar confronto. Fale com respeito, seja direto sobre o que consegue fazer e evite prometer algo que vai prejudicar você.',
  question = 'Alguém pede um favor que você não consegue fazer agora. Como responder?',
  options = '[{"id":"a","text":"Aceitar mesmo sabendo que não vai conseguir cumprir."},{"id":"b","text":"Desaparecer e não responder."},{"id":"c","text":"Explicar com respeito que não consegue ajudar neste momento."}]'::jsonb,
  correct_option = 'c',
  explanation = 'Uma resposta clara e respeitosa protege seu limite e evita criar uma expectativa que você não poderá cumprir.',
  estimated_minutes = 4 where id = 'comunicacao-limites-01';
create index missions_journey_sort_idx on public.missions (journey_id, sort_order) where is_active = true;