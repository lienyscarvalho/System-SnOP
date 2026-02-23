#!/bin/bash

# Script de Configuração para Vercel
# Este script configura o projeto para deployment na Vercel

set -e

echo "🚀 Iniciando configuração para Vercel..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI não encontrado. Instalando...${NC}"
    npm install -g vercel
fi

echo -e "${BLUE}📝 Passo 1: Fazer login na Vercel${NC}"
vercel login

echo ""
echo -e "${BLUE}📝 Passo 2: Conectar projeto ao Vercel${NC}"
vercel link

echo ""
echo -e "${BLUE}📝 Passo 3: Configurar variáveis de ambiente${NC}"
echo ""
echo "Você precisa configurar as seguintes variáveis de ambiente:"
echo "  - VITE_BIGQUERY_PROJECT_ID"
echo "  - VITE_BIGQUERY_DATASET_ID"
echo "  - VITE_BIGQUERY_API_KEY"
echo ""
echo "Você pode fazer isso de duas formas:"
echo "1. Via CLI: vercel env add VITE_BIGQUERY_PROJECT_ID"
echo "2. Via Dashboard: https://vercel.com/dashboard"
echo ""

read -p "Deseja configurar as variáveis agora? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    read -p "VITE_BIGQUERY_PROJECT_ID: " bigquery_project_id
    read -p "VITE_BIGQUERY_DATASET_ID: " bigquery_dataset_id
    read -sp "VITE_BIGQUERY_API_KEY: " bigquery_api_key
    echo ""
    
    vercel env add VITE_BIGQUERY_PROJECT_ID "$bigquery_project_id"
    vercel env add VITE_BIGQUERY_DATASET_ID "$bigquery_dataset_id"
    vercel env add VITE_BIGQUERY_API_KEY "$bigquery_api_key"
    
    echo -e "${GREEN}✅ Variáveis de ambiente configuradas!${NC}"
fi

echo ""
echo -e "${BLUE}📝 Passo 4: Build e Deploy${NC}"
echo ""
echo "Para fazer deploy, execute um dos comandos:"
echo "  - vercel deploy (preview)"
echo "  - vercel deploy --prod (produção)"
echo ""

echo -e "${GREEN}✅ Configuração concluída!${NC}"
echo ""
echo "Próximos passos:"
echo "1. Faça push de suas mudanças para GitHub"
echo "2. Configure auto-deploy no Vercel (Settings > Git)"
echo "3. Teste a aplicação em produção"
echo ""
echo "Documentação: https://vercel.com/docs"
