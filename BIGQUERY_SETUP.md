# Guia de Configuração - BigQuery + Cloud Functions

## 📋 Visão Geral

Este guia descreve como configurar a integração completa do Sistema S&OP com BigQuery e Google Cloud Functions para sincronização automática de dados.

## 🔧 Pré-requisitos

- Conta Google Cloud com billing habilitado
- `gcloud` CLI instalado
- Acesso ao projeto Google Cloud
- Permissões de administrador no Google Cloud

## 📊 Passo 1: Criar Dataset no BigQuery

### 1.1 Via Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Vá para **BigQuery**
3. Clique em **Criar Dataset**
4. Configure:
   - **Nome do Dataset**: `sop_vtal`
   - **Localização**: `us-east1` (ou sua região preferida)
   - **Tipo de Armazenamento**: Standard
5. Clique em **Criar Dataset**

### 1.2 Via CLI

```bash
bq mk --dataset \
  --location=us-east1 \
  --description="Dataset S&OP V.tal" \
  sop_vtal
```

## 📋 Passo 2: Criar Tabelas

Execute os seguintes comandos para criar as tabelas:

### 2.1 Tabela de Ordens de Serviço

```sql
CREATE TABLE `seu-projeto.sop_vtal.ordens_servico` (
  id STRING NOT NULL,
  region STRING NOT NULL,
  tenant STRING NOT NULL,
  serviceType STRING NOT NULL,
  status STRING NOT NULL,
  psr STRING NOT NULL,
  date DATE,
  technician STRING,
  quality INT64,
  cost FLOAT64,
  timestamp TIMESTAMP NOT NULL,
  _load_time TIMESTAMP NOT NULL
);
```

### 2.2 Tabela de Desempenho PSR

```sql
CREATE TABLE `seu-projeto.sop_vtal.desempenho_psr` (
  psr_name STRING NOT NULL,
  region STRING NOT NULL,
  technicians INT64,
  orders_completed INT64,
  sla_compliance FLOAT64,
  quality_score FLOAT64,
  average_cost FLOAT64,
  status STRING,
  month STRING,
  timestamp TIMESTAMP NOT NULL,
  _load_time TIMESTAMP NOT NULL
);
```

### 2.3 Tabela de Técnicos

```sql
CREATE TABLE `seu-projeto.sop_vtal.tecnicos` (
  id STRING NOT NULL,
  name STRING NOT NULL,
  psr STRING NOT NULL,
  region STRING NOT NULL,
  certification STRING,
  orders_completed INT64,
  quality_score FLOAT64,
  training_hours INT64,
  status STRING,
  timestamp TIMESTAMP NOT NULL,
  _load_time TIMESTAMP NOT NULL
);
```

### 2.4 Tabela de Defeitos de Qualidade

```sql
CREATE TABLE `seu-projeto.sop_vtal.defeitos_qualidade` (
  id STRING NOT NULL,
  type STRING NOT NULL,
  count INT64,
  severity STRING,
  psr STRING NOT NULL,
  region STRING NOT NULL,
  date DATE,
  timestamp TIMESTAMP NOT NULL,
  _load_time TIMESTAMP NOT NULL
);
```

### 2.5 Tabela de Programas de Treinamento

```sql
CREATE TABLE `seu-projeto.sop_vtal.programas_treinamento` (
  id STRING NOT NULL,
  name STRING NOT NULL,
  status STRING,
  startDate DATE,
  endDate DATE,
  participants INT64,
  completed INT64,
  psr STRING,
  timestamp TIMESTAMP NOT NULL,
  _load_time TIMESTAMP NOT NULL
);
```

### 2.6 Tabela de Planos de Ação

```sql
CREATE TABLE `seu-projeto.sop_vtal.planos_acao` (
  id STRING NOT NULL,
  issue STRING NOT NULL,
  owner STRING NOT NULL,
  action STRING,
  target DATE,
  status STRING,
  progress INT64,
  responsible STRING,
  timestamp TIMESTAMP NOT NULL,
  _load_time TIMESTAMP NOT NULL
);
```

## 🔐 Passo 3: Criar Service Account

### 3.1 Via Console

1. Vá para **IAM & Admin** > **Service Accounts**
2. Clique em **Criar Service Account**
3. Configure:
   - **Nome**: `sop-bigquery-sync`
   - **Descrição**: `Service Account para sincronização S&OP`
4. Clique em **Criar e Continuar**
5. Conceda permissões:
   - `BigQuery Data Editor`
   - `BigQuery Job User`
6. Clique em **Continuar**
7. Clique em **Criar Chave** > **JSON**
8. Salve o arquivo JSON em local seguro

### 3.2 Via CLI

```bash
# Criar Service Account
gcloud iam service-accounts create sop-bigquery-sync \
  --display-name="Service Account para sincronização S&OP"

# Conceder permissões
gcloud projects add-iam-policy-binding seu-projeto-id \
  --member="serviceAccount:sop-bigquery-sync@seu-projeto-id.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataEditor"

gcloud projects add-iam-policy-binding seu-projeto-id \
  --member="serviceAccount:sop-bigquery-sync@seu-projeto-id.iam.gserviceaccount.com" \
  --role="roles/bigquery.jobUser"

# Criar chave
gcloud iam service-accounts keys create key.json \
  --iam-account=sop-bigquery-sync@seu-projeto-id.iam.gserviceaccount.com
```

## ☁️ Passo 4: Deploy da Cloud Function

### 4.1 Preparar Ambiente

```bash
# Clonar repositório
git clone https://github.com/lienyscarvalho/gestor-sop.git
cd gestor-sop/cloud-functions/sync-bigquery

# Instalar dependências
npm install
```

### 4.2 Deploy

```bash
# Deploy com autenticação (recomendado)
gcloud functions deploy syncBigQuery \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point syncBigQuery \
  --set-env-vars GCP_PROJECT_ID=seu-projeto-id,SYNC_API_KEY=sua-chave-secreta

# Ou deploy seguro (requer autenticação)
gcloud functions deploy syncBigQuery \
  --runtime nodejs18 \
  --trigger-http \
  --entry-point syncBigQuery \
  --set-env-vars GCP_PROJECT_ID=seu-projeto-id,SYNC_API_KEY=sua-chave-secreta
```

### 4.3 Obter URL da Function

```bash
gcloud functions describe syncBigQuery --gen2 --format='value(serviceConfig.uri)'
```

## 🔗 Passo 5: Configurar Vercel

### 5.1 Adicionar Variáveis de Ambiente

No dashboard da Vercel, adicione:

```
VITE_BIGQUERY_PROJECT_ID=seu-projeto-id
VITE_BIGQUERY_DATASET_ID=sop_vtal
VITE_BIGQUERY_API_KEY=sua-chave-json-base64
VITE_CLOUD_FUNCTION_URL=https://sua-regiao-seu-projeto-id.cloudfunctions.net/syncBigQuery
VITE_SYNC_API_KEY=sua-chave-secreta
```

### 5.2 Codificar Chave JSON

```bash
# Converter arquivo JSON para Base64
cat key.json | base64 -w 0 > key.json.b64

# Copiar conteúdo para VITE_BIGQUERY_API_KEY
cat key.json.b64
```

## 📤 Passo 6: Usar a Integração

### 6.1 Exportar Dados para BigQuery

No Frontend:

```typescript
import { exportToBigQuery } from '@/lib/exportService';

// Exportar dados
exportToBigQuery(orderData, 'ordens-servico');
```

### 6.2 Sincronizar via Cloud Function

```typescript
import { syncDataWithBigQuery } from '@/lib/bigqueryConfig';

const result = await syncDataWithBigQuery('orders', orderData);
console.log(result.message);
```

### 6.3 Chamar Cloud Function Diretamente

```bash
curl -X POST https://sua-regiao-seu-projeto-id.cloudfunctions.net/syncBigQuery \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-chave-secreta" \
  -d '{
    "dataType": "orders",
    "data": [
      {
        "id": "OS-SP-00001",
        "region": "SP",
        "tenant": "TIM",
        "serviceType": "FTTH Installation",
        "status": "Concluído",
        "psr": "Ability",
        "date": "2026-02-23",
        "technician": "Técnico-1",
        "quality": 98,
        "cost": 52.4
      }
    ]
  }'
```

## 📊 Passo 7: Consultar Dados

### 7.1 Query Básica

```sql
SELECT 
  DATE(date) as data,
  region,
  tenant,
  COUNT(*) as total_os,
  AVG(quality) as qualidade_media,
  AVG(cost) as custo_medio
FROM `seu-projeto.sop_vtal.ordens_servico`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY data, region, tenant
ORDER BY data DESC;
```

### 7.2 Dashboard no BigQuery

1. Acesse **Looker Studio**
2. Crie um novo relatório
3. Conecte à fonte de dados BigQuery
4. Selecione as tabelas `sop_vtal`
5. Crie visualizações

## 🔄 Passo 8: Automação com Pub/Sub (Opcional)

### 8.1 Criar Tópico Pub/Sub

```bash
gcloud pubsub topics create sop-data-sync
gcloud pubsub subscriptions create sop-data-sync-sub \
  --topic=sop-data-sync
```

### 8.2 Configurar Cloud Function para Pub/Sub

```bash
gcloud functions deploy syncBigQuery \
  --runtime nodejs18 \
  --trigger-topic sop-data-sync \
  --entry-point syncBigQuery
```

### 8.3 Publicar Mensagens

```bash
gcloud pubsub topics publish sop-data-sync \
  --message='{"dataType": "orders", "data": [...]}'
```

## 🧪 Testes

### 8.1 Testar Cloud Function

```bash
# Health check
curl https://sua-regiao-seu-projeto-id.cloudfunctions.net/health

# Sincronizar dados
curl -X POST https://sua-regiao-seu-projeto-id.cloudfunctions.net/syncBigQuery \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-chave-secreta" \
  -d '{"dataType": "orders", "data": [...]}'
```

### 8.2 Verificar Dados no BigQuery

```bash
bq query --use_legacy_sql=false '
  SELECT COUNT(*) as total_registros 
  FROM `seu-projeto.sop_vtal.ordens_servico`
'
```

## 🔒 Segurança

### Boas Práticas

1. **Chaves Seguras**: Nunca commit chaves JSON
2. **API Keys**: Use variáveis de ambiente
3. **CORS**: Configure CORS na Cloud Function
4. **Rate Limiting**: Implemente rate limiting
5. **Logs**: Monitore logs de acesso

### Exemplo de CORS

```javascript
// No index.js da Cloud Function
res.set('Access-Control-Allow-Origin', 'https://seu-dominio.vercel.app');
res.set('Access-Control-Allow-Methods', 'POST');
res.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
```

## 📈 Monitoramento

### 8.1 Logs da Cloud Function

```bash
gcloud functions logs read syncBigQuery --limit 50
```

### 8.2 Métricas do BigQuery

```bash
bq show --schema --format=prettyjson seu-projeto:sop_vtal.ordens_servico
```

## 🐛 Troubleshooting

### Erro: "Permission denied"

```bash
# Verificar permissões
gcloud projects get-iam-policy seu-projeto-id \
  --flatten="bindings[].members" \
  --filter="bindings.members:sop-bigquery-sync*"
```

### Erro: "Dataset not found"

```bash
# Listar datasets
bq ls

# Criar dataset se não existir
bq mk --dataset sop_vtal
```

### Erro: "Table not found"

```bash
# Listar tabelas
bq ls sop_vtal

# Criar tabela se não existir
bq mk --table sop_vtal.ordens_servico schema.json
```

## 📚 Documentação Adicional

- [BigQuery Documentation](https://cloud.google.com/bigquery/docs)
- [Cloud Functions Documentation](https://cloud.google.com/functions/docs)
- [Google Cloud CLI Reference](https://cloud.google.com/sdk/gcloud/reference)

## 📞 Suporte

Para suporte técnico, entre em contato com o time de desenvolvimento.

---

**Versão**: 1.0.0  
**Data**: 2026-02-23  
**Mantido por**: V.tal Telecomunicações
