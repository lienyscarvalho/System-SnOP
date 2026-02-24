-- Database Schema for S&OP Management System (V.tal)

-- Enable RLS
-- NOTE: In a production environment, you should add specific RLS policies.

-- 1. Regional Performance Table
CREATE TABLE IF NOT EXISTS regional_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_d0 INT NOT NULL,
  realizado INT NOT NULL,
  projecao INT NOT NULL,
  vendas INT NOT NULL,
  eficacia INT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Operators Performance Table
CREATE TABLE IF NOT EXISTS operators_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  meta INT NOT NULL,
  ok INT NOT NULL,
  proj INT NOT NULL,
  gap INT NOT NULL,
  vendas INT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PSR Performance Table
CREATE TABLE IF NOT EXISTS psr_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  total INT NOT NULL,
  sem_producao INT NOT NULL,
  sem_instalacao_ok INT NOT NULL,
  oportunidades INT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Attribution Status Table
CREATE TABLE IF NOT EXISTS attribution_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL,
  count INT NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Action Plan Table
CREATE TABLE IF NOT EXISTS action_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia TEXT NOT NULL,
  acao TEXT NOT NULL,
  impacto TEXT NOT NULL,
  status TEXT DEFAULT 'Pendente',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert initial mockup data
INSERT INTO regional_performance (meta_d0, realizado, projecao, vendas, eficacia)
VALUES (944, 578, 727, 685, 64);

INSERT INTO operators_performance (name, meta, ok, proj, gap, vendas)
VALUES 
('NIO', 822, 512, 621, -310, 591),
('TIM', 117, 66, 102, -51, 92),
('Outros', 5, 0, 3, -5, 2);

INSERT INTO psr_performance (name, total, sem_producao, sem_instalacao_ok, oportunidades)
VALUES 
('SEREDE', 943, 790, 461, 1251),
('TELEMONT', 293, 220, 153, 373),
('TEL', 59, 35, 49, 84),
('ABILITY', 61, 26, 37, 63),
('OPERADOR', 60, 60, 60, 60);

INSERT INTO attribution_status (status, count, percentage)
VALUES 
('Em execução', 131, 76.6),
('Recebido', 22, 12.9),
('Em deslocamento', 10, 5.8),
('Atribuído', 8, 4.7);

INSERT INTO action_plan (dia, acao, impacto)
VALUES 
('Dia 1', 'Reunião emergencial e Redistribuição OPERADOR', 'Alta'),
('Dia 2', 'Rotina de atribuição 3x/dia e Kick-off Gamificação', 'Média'),
('Dia 3', 'Auditoria ferramentas e Treinamento TRPV', 'Alta'),
('Dia 4', 'Expansão redistribuição SEREDE', 'Crítica'),
('Dia 5', 'Consolidação e Planejamento Semana 2', 'Alta');
