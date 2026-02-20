export const regionalPerformance = {
  metaD0: 944,
  realizado: 578,
  gap: -366,
  projecao: 727,
  vendas: 685,
  eficacia: 64,
};

export const operadoras = [
  { name: 'NIO', meta: 822, ok: 512, proj: 621, gap: -310, vendas: 591 },
  { name: 'TIM', meta: 117, ok: 66, proj: 102, gap: -51, vendas: 92 },
  { name: 'Outros', meta: 5, ok: 0, proj: 3, gap: -5, vendas: 2 },
];

export const tecnicos = {
  total: 1421,
  semProducao: 1134,
  semInstalacaoOK: 702,
  oportunidades: 1836,
};

export const psrs = [
  { name: 'SEREDE', total: 943, semProducao: 790, semInstalacaoOK: 461, oportunidades: 1251 },
  { name: 'TELEMONT', total: 293, semProducao: 220, semInstalacaoOK: 153, oportunidades: 373 },
  { name: 'TEL', total: 59, semProducao: 35, semInstalacaoOK: 49, oportunidades: 84 },
  { name: 'ABILITY', total: 61, semProducao: 26, semInstalacaoOK: 37, oportunidades: 63 },
  { name: 'OPERADOR', total: 60, semProducao: 60, semInstalacaoOK: 60, oportunidades: 60 },
];

export const statusAtribuicao = [
  { status: 'Em execução', count: 131, percentage: 76.6 },
  { status: 'Recebido', count: 22, percentage: 12.9 },
  { status: 'Em deslocamento', count: 10, percentage: 5.8 },
  { status: 'Atribuído', count: 8, percentage: 4.7 },
];

export const recomendacoesSeteDias = [
  { dia: 'Dia 1', acao: 'Reunião emergencial e Redistribuição OPERADOR', impacto: 'Alta' },
  { dia: 'Dia 2', acao: 'Rotina de atribuição 3x/dia e Kick-off Gamificação', impacto: 'Média' },
  { dia: 'Dia 3', acao: 'Auditoria ferramentas e Treinamento TRPV', impacto: 'Alta' },
  { dia: 'Dia 4', acao: 'Expansão redistribuição SEREDE', impacto: 'Crítica' },
  { dia: 'Dia 5', acao: 'Consolidação e Planejamento Semana 2', impacto: 'Alta' },
];
