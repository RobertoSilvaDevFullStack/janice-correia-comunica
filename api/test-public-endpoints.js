const axios = require('axios');

// Configuração base para testes
const API_BASE = 'http://localhost:3001/api';

async function testHealth() {
  try {
    console.log('🔍 Verificando se servidor API está rodando...');
    const response = await axios.get(`${API_BASE}/health`, { timeout: 5000 });
    console.log('✅ Servidor API está rodando!');
    return true;
  } catch (error) {
    console.log('❌ Servidor API não está respondendo');
    console.log(`📝 Erro: ${error.message}`);
    return false;
  }
}

async function testPublicEndpoints() {
  console.log('\n🚀 Testando endpoints públicos após correções...\n');
  
  const endpoints = [
    {
      name: 'Testimonials Público',
      url: '/testimonials/public',
      auth: false
    },
    {
      name: 'Blog Posts Públicos', 
      url: '/blog/public',
      auth: false
    },
    {
      name: 'Palestras Públicas',
      url: '/palestras/public',
      auth: false
    },
    {
      name: 'Mentorias Públicas',
      url: '/mentorias/public',
      auth: false
    }
  ];
  
  for (const endpoint of endpoints) {
    console.log(`📡 Testando: ${endpoint.name}`);
    
    try {
      const config = {
        method: 'GET',
        url: `${API_BASE}${endpoint.url}`,
        timeout: 10000,
        validateStatus: () => true // Não jogar erro em status 4xx/5xx
      };
      
      const response = await axios(config);
      
      if (response.status >= 200 && response.status < 300) {
        console.log(`✅ ${endpoint.name}: SUCESSO (${response.status})`);
        if (response.data && Array.isArray(response.data)) {
          console.log(`   📊 ${response.data.length} registros encontrados`);
        } else if (response.data) {
          console.log(`   📄 Dados recebidos com sucesso`);
        }
      } else {
        console.log(`❌ ${endpoint.name}: ERRO (${response.status})`);
        if (response.data && response.data.error) {
          console.log(`   📝 ${response.data.error}`);
        } else if (response.data && response.data.message) {
          console.log(`   📝 ${response.data.message}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint.name}: FALHA NA CONEXÃO`);
      console.log(`   📝 ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('✅ Testes concluídos!');
}

// Executar testes
async function runTests() {
  const isRunning = await testHealth();
  if (isRunning) {
    await testPublicEndpoints();
  }
}

runTests();