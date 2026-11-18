insert into public.missions
  (id, journey_id, category, title, description, reward_xp, lesson_content, question, options, correct_option, explanation, estimated_minutes, sort_order)
values
(
  'autonomia-prioridades-02', 'vida-real-101', 'Organização e autonomia',
  'O que vem primeiro?',
  'Aprenda a organizar tarefas quando tudo parece urgente.',
  100,
  'Quando várias coisas pedem sua atenção, tentar resolver tudo ao mesmo tempo costuma atrapalhar. Liste o que precisa ser feito, identifique prazos e consequências e comece pelo que realmente não pode esperar.',
  'Você tem uma prova amanhã, precisa arrumar o quarto e recebeu um convite para sair. Como decide o que fazer primeiro?',
  '[{"id":"a","text":"Ver o que tem prazo mais próximo e maior consequência, reservar tempo para estudar e organizar o restante."},{"id":"b","text":"Fazer primeiro a tarefa mais fácil, mesmo que a prova fique para depois."},{"id":"c","text":"Tentar fazer tudo ao mesmo tempo, sem planejar."}]'::jsonb,
  'a',
  'Priorizar significa olhar para prazo e impacto. Você pode reorganizar tarefas menores depois de garantir o que é mais importante.',
  4, 2
),
(
  'autonomia-tempo-03', 'vida-real-101', 'Organização e autonomia',
  'Faça o tempo caber',
  'Monte um plano realista para não depender da correria de última hora.',
  100,
  'Um bom planejamento não precisa preencher cada minuto. Estime quanto tempo uma tarefa leva, separe um horário para começar e deixe uma pequena margem para imprevistos. Um plano possível vale mais do que uma agenda impossível.',
  'Você precisa entregar um trabalho daqui a três dias. Qual plano aumenta a chance de terminar bem?',
  '[{"id":"a","text":"Deixar tudo para a última noite e torcer para dar tempo."},{"id":"b","text":"Dividir o trabalho em partes, começar hoje e reservar um momento para revisar."},{"id":"c","text":"Esperar aparecer vontade para começar."}]'::jsonb,
  'b',
  'Dividir uma entrega em etapas reduz a pressão e cria oportunidades para perceber problemas antes do prazo final.',
  4, 3
),
(
  'autonomia-informacao-04', 'vida-real-101', 'Autonomia',
  'Leia antes de aceitar',
  'Reconheça o que merece atenção antes de confirmar um serviço ou compromisso.',
  100,
  'Antes de aceitar uma oferta, assinatura ou serviço, confira o preço total, a duração, as cobranças recorrentes, as regras de cancelamento e o que está incluído. Não tenha vergonha de pedir tempo para ler.',
  'Um aplicativo oferece sete dias grátis e depois começa a cobrar mensalmente. O que você deve conferir antes de aceitar?',
  '[{"id":"a","text":"Somente a aparência da oferta, porque o primeiro período é grátis."},{"id":"b","text":"Se outras pessoas estão usando o aplicativo."},{"id":"c","text":"O valor depois do teste, a data da primeira cobrança e como cancelar."}]'::jsonb,
  'c',
  'O período grátis pode virar uma cobrança recorrente. Entender preço, data e cancelamento evita surpresas.',
  3, 4
),
(
  'autonomia-seguranca-05', 'vida-real-101', 'Mundo digital',
  'A urgência pode ser armadilha',
  'Aprenda a pausar antes de clicar em mensagens suspeitas.',
  100,
  'Mensagens fraudulentas costumam criar pressa, ameaçar bloqueios ou prometer vantagens. Não use o link recebido para conferir. Abra o aplicativo ou site oficial por conta própria e procure os canais de atendimento conhecidos.',
  'Você recebe uma mensagem dizendo que sua conta será bloqueada em dez minutos e que precisa clicar em um link. O que faz?',
  '[{"id":"a","text":"Clicar rápido para evitar o bloqueio."},{"id":"b","text":"Não clicar, verificar pelo aplicativo ou site oficial e denunciar a mensagem suspeita."},{"id":"c","text":"Encaminhar a mensagem para amigos perguntando se o link funciona."}]'::jsonb,
  'b',
  'A pressa é um sinal de alerta. Verifique qualquer aviso por um canal oficial, sem abrir links ou compartilhar códigos.',
  4, 5
),
(
  'autonomia-pedido-06', 'vida-real-101', 'Comunicação',
  'Peça ajuda com clareza',
  'Descubra como explicar um problema para receber uma ajuda mais útil.',
  100,
  'Pedir ajuda fica mais fácil quando você explica o contexto, diz o que já tentou e descreve exatamente onde travou. Isso dá à outra pessoa informações para orientar você sem precisar adivinhar.',
  'Você não consegue resolver um problema e vai pedir ajuda. Qual mensagem é mais clara?',
  '[{"id":"a","text":"Não consigo fazer nada, resolve para mim."},{"id":"b","text":"Está tudo errado e ninguém me ajuda."},{"id":"c","text":"Estou tentando concluir esta etapa, já fiz estas duas tentativas e travei neste ponto. Pode me orientar?"}]'::jsonb,
  'c',
  'Uma boa solicitação mostra o objetivo, o que já foi tentado e a dúvida específica. Isso facilita uma orientação objetiva.',
  3, 6
),
(
  'autonomia-plano-07', 'vida-real-101', 'Desenvolvimento pessoal',
  'Transforme vontade em plano',
  'Dê um primeiro passo concreto para uma meta que importa para você.',
  100,
  'Metas vagas são difíceis de colocar em prática. Defina uma ação pequena, um momento para realizá-la e uma forma simples de perceber o avanço. Começar pequeno ajuda a criar consistência.',
  'Você quer aprender uma habilidade nova, mas ainda não começou. Qual é o melhor primeiro passo?',
  '[{"id":"a","text":"Escolher uma habilidade, separar 20 minutos em um dia específico e definir o que vai praticar."},{"id":"b","text":"Esperar ter bastante tempo livre e motivação."},{"id":"c","text":"Tentar aprender várias habilidades ao mesmo tempo."}]'::jsonb,
  'a',
  'Uma ação específica e pequena torna o início mais fácil. Depois de começar, você pode ajustar o ritmo e ampliar a meta.',
  3, 7
)
on conflict (id) do update set
  journey_id = excluded.journey_id,
  category = excluded.category,
  title = excluded.title,
  description = excluded.description,
  reward_xp = excluded.reward_xp,
  lesson_content = excluded.lesson_content,
  question = excluded.question,
  options = excluded.options,
  correct_option = excluded.correct_option,
  explanation = excluded.explanation,
  estimated_minutes = excluded.estimated_minutes,
  sort_order = excluded.sort_order,
  is_active = true;
