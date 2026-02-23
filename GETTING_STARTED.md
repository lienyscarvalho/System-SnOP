# 🚀 Guia de Início Rápido - Sistema S&OP V.tal

Bem-vindo ao Sistema Integrado de Gestão S&OP V.tal! Este guia o ajudará a começar rapidamente.

## 📋 Sumário

1. [Instalação Local](#instalação-local)
2. [Deployment na Vercel](#deployment-na-vercel)
3. [Configuração BigQuery](#configuração-bigquery)
4. [Próximos Passos](#próximos-passos)

---

## 🖥️ Instalação Local

### Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org))
- npm ou pnpm
- Git

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/lienyscarvalho/gestor-sop.git
cd gestor-sop

# 2. Instale as dependências
npm install
# ou
pnpm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
# ou
pnpm dev
```

Acesse `http://localhost:3000` no seu navegador.

### Estrutura do Projeto

```
gestor-sop/
├── client/
│   ├── src/
│   │   ├── pages/           # Páginas do sistema
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── lib/             # Utilitários (exportação, BigQuery)
│   │   ├── data/            # Dados de exemplo
│   │   └── App.tsx          # Aplicação principal
│   └── index.html
├── cloud-functions/         # Cloud Functions para BigQuery
├── scripts/                 # Scripts de setup
├── DEPLOYMENT.md            # Guia de deployment
├── BIGQUERY_SETUP.md        # Guia de BigQuery
└── README.md                # Documentação completa
```

---

## 🌐 Deployment na Vercel

### Passo 1: Preparar GitHub

Seu código já está no GitHub! Verifique em:
👉 https://github.com/lienyscarvalho/gestor-sop

### Passo 2: Conectar Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **New Project**
3. Selecione **Import Git Repository**
4. Escolha `gestor-sop`
5. Clique em **Import**

### Passo 3: Configurar Variáveis de Ambiente

Na página de configuração do Vercel, adicione:

```
VITE_ENVIRONMENT=production
VITE_APP_TITLE=S&OP - Gestão Integrada V.tal
VITE_APP_ID=vtal-sop-system
```

### Passo 4: Deploy

Clique em **Deploy** e aguarde a conclusão.

### Passo 5: Acessar Aplicação

Após o deploy, você receberá uma URL como:
```
https://gestor-sop.vercel.app
```

---

## 🔗 Configuração BigQuery

### Opção 1: Configuração Rápida (Recomendado)

```bash
# Execute o script de setup
bash scripts/setup-vercel.sh
```

### Opção 2: Configuração Manual

Siga o guia completo em [BIGQUERY_SETUP.md](./BIGQUERY_SETUP.md)

### Passos Principais

1. **Criar Dataset**: `sop_vtal`
2. **Criar Tabelas**: 6 tabelas conforme especificado
3. **Service Account**: Gerar credenciais
4. **Cloud Function**: Deploy da função de sincronização
5. **Variáveis de Ambiente**: Configurar no Vercel

---

## 🎯 Próximos Passos

### Semana 1: Setup Inicial

- [ ] Instalar e testar localmente
- [ ] Deploy na Vercel
- [ ] Configurar domínio customizado (opcional)
- [ ] Testar todas as páginas

### Semana 2: Integração BigQuery

- [ ] Criar dataset no BigQuery
- [ ] Deploy da Cloud Function
- [ ] Configurar variáveis de ambiente
- [ ] Testar sincronização de dados

### Semana 3: Dados Reais

- [ ] Integrar com banco de dados real
- [ ] Importar histórico de dados
- [ ] Validar dados no BigQuery
- [ ] Configurar relatórios

### Semana 4: Produção

- [ ] Testes de carga
- [ ] Configurar monitoramento
- [ ] Documentar processos
- [ ] Treinar usuários

---

## 📊 Funcionalidades Principais

### 1. Dashboard Executivo
- KPIs em tempo real
- Gráficos de tendência
- Alertas operacionais

### 2. Planejamento de Demanda
- Previsão por tenant
- Análise por região
- Filtros avançados

### 3. Gestão de Suprimento
- Capacidade de técnicos
- Distribuição por PSR
- Planejamento de recursos

### 4. Gestão de PSRs
- Performance de prestadores
- Scorecard de qualidade
- Análise de custos

### 5. Qualidade
- Rastreamento de defeitos
- Taxa de retrabalho
- Satisfação do cliente

### 6. Capacitação
- Programas de treinamento
- Certificações
- Taxa de conclusão

### 7. Resultados
- Acompanhamento de metas
- Performance regional
- Análise de variações

### 8. Planos de Ação
- Gestão de desvios
- Ações corretivas
- Follow-up de planos

---

## 🔧 Comandos Úteis

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Verificar tipos TypeScript
npm run check

# Formatar código
npm run format
```

### Git

```bash
# Fazer commit
git add .
git commit -m "Sua mensagem"

# Fazer push
git push origin main

# Ver histórico
git log --oneline
```

### Vercel

```bash
# Deploy preview
vercel

# Deploy produção
vercel --prod

# Ver logs
vercel logs
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```bash
rm -rf node_modules
npm install
```

### Erro: "Port 3000 already in use"

```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erro: "BigQuery API not enabled"

1. Acesse Google Cloud Console
2. Ative a BigQuery API
3. Verifique permissões da Service Account

---

## 📚 Documentação

- [README.md](./README.md) - Documentação completa
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guia de deployment
- [BIGQUERY_SETUP.md](./BIGQUERY_SETUP.md) - Configuração BigQuery
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel Docs](https://vercel.com/docs)

---

## 🆘 Suporte

### Recursos

- 📖 [Documentação Completa](./README.md)
- 🐛 [Reportar Bugs](https://github.com/lienyscarvalho/gestor-sop/issues)
- 💬 [Discussões](https://github.com/lienyscarvalho/gestor-sop/discussions)

### Contato

- **Email**: suporte@vtal.com.br
- **Telefone**: +55 (XX) XXXX-XXXX
- **GitHub**: [@lienyscarvalho](https://github.com/lienyscarvalho)

---

## ✅ Checklist de Deployment

- [ ] Código clonado localmente
- [ ] Dependências instaladas
- [ ] Servidor local funcionando
- [ ] Repositório GitHub atualizado
- [ ] Vercel conectado ao GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Build de produção testada
- [ ] URL de produção acessível
- [ ] BigQuery dataset criado
- [ ] Cloud Function deployada
- [ ] Sincronização de dados testada
- [ ] Monitoramento configurado

---

## 🎉 Parabéns!

Você está pronto para usar o Sistema S&OP V.tal!

Para mais informações, consulte a [documentação completa](./README.md).

---

**Versão**: 1.0.0  
**Data**: 2026-02-23  
**Mantido por**: V.tal Telecomunicações

Boa sorte! 🚀
