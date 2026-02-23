/**
 * Cloud Function para sincronizar dados do S&OP com BigQuery
 * Deploy: gcloud functions deploy syncBigQuery --runtime nodejs18 --trigger-http
 */

const { BigQuery } = require('@google-cloud/bigquery');
const functions = require('@google-cloud/functions-framework');

const bigquery = new BigQuery();

// Configurações
const PROJECT_ID = process.env.GCP_PROJECT_ID;
const DATASET_ID = 'sop_vtal';

// Tabelas do BigQuery
const TABLES = {
  orders: 'ordens_servico',
  psrPerformance: 'desempenho_psr',
  technicians: 'tecnicos',
  qualityDefects: 'defeitos_qualidade',
  trainingPrograms: 'programas_treinamento',
  actionPlans: 'planos_acao',
};

/**
 * Sincronizar dados com BigQuery
 */
functions.http('syncBigQuery', async (req, res) => {
  try {
    // Verificar autenticação
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.SYNC_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { dataType, data } = req.body;

    if (!dataType || !data || !Array.isArray(data)) {
      return res.status(400).json({
        error: 'Invalid request. Required: dataType (string), data (array)',
      });
    }

    const tableName = TABLES[dataType];
    if (!tableName) {
      return res.status(400).json({
        error: `Invalid dataType. Supported: ${Object.keys(TABLES).join(', ')}`,
      });
    }

    // Inserir dados no BigQuery
    const dataset = bigquery.dataset(DATASET_ID);
    const table = dataset.table(tableName);

    const rows = data.map(item => ({
      ...item,
      timestamp: new Date().toISOString(),
      _load_time: new Date().toISOString(),
    }));

    await table.insert(rows);

    console.log(`✅ ${rows.length} registros inseridos em ${tableName}`);

    res.status(200).json({
      success: true,
      message: `${rows.length} registros sincronizados com sucesso`,
      table: tableName,
      rowsInserted: rows.length,
    });
  } catch (error) {
    console.error('❌ Erro ao sincronizar com BigQuery:', error);
    res.status(500).json({
      error: 'Erro ao sincronizar com BigQuery',
      details: error.message,
    });
  }
});

/**
 * Webhook para receber dados em tempo real
 */
functions.http('webhookReceive', async (req, res) => {
  try {
    const { event, data } = req.body;

    console.log(`📨 Webhook recebido: ${event}`);
    console.log(`📊 Dados: ${JSON.stringify(data).substring(0, 100)}...`);

    // Processar diferentes tipos de eventos
    switch (event) {
      case 'orders.created':
        await syncOrdersData(data);
        break;
      case 'psr.performance':
        await syncPSRPerformance(data);
        break;
      case 'quality.defect':
        await syncQualityDefects(data);
        break;
      default:
        console.warn(`⚠️ Evento não reconhecido: ${event}`);
    }

    res.status(200).json({
      success: true,
      message: 'Webhook processado com sucesso',
      event,
    });
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    res.status(500).json({
      error: 'Erro ao processar webhook',
      details: error.message,
    });
  }
});

/**
 * Sincronizar dados de ordens
 */
async function syncOrdersData(data) {
  const dataset = bigquery.dataset(DATASET_ID);
  const table = dataset.table(TABLES.orders);

  const rows = Array.isArray(data) ? data : [data];
  const processedRows = rows.map(row => ({
    ...row,
    timestamp: new Date().toISOString(),
  }));

  await table.insert(processedRows);
  console.log(`✅ ${processedRows.length} ordens sincronizadas`);
}

/**
 * Sincronizar performance de PSR
 */
async function syncPSRPerformance(data) {
  const dataset = bigquery.dataset(DATASET_ID);
  const table = dataset.table(TABLES.psrPerformance);

  const rows = Array.isArray(data) ? data : [data];
  const processedRows = rows.map(row => ({
    ...row,
    timestamp: new Date().toISOString(),
  }));

  await table.insert(processedRows);
  console.log(`✅ ${processedRows.length} registros de performance sincronizados`);
}

/**
 * Sincronizar defeitos de qualidade
 */
async function syncQualityDefects(data) {
  const dataset = bigquery.dataset(DATASET_ID);
  const table = dataset.table(TABLES.qualityDefects);

  const rows = Array.isArray(data) ? data : [data];
  const processedRows = rows.map(row => ({
    ...row,
    timestamp: new Date().toISOString(),
  }));

  await table.insert(processedRows);
  console.log(`✅ ${processedRows.length} defeitos sincronizados`);
}

/**
 * Endpoint para health check
 */
functions.http('health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'S&OP BigQuery Sync',
  });
});
