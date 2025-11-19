const axios = require('axios');

// Configuração base para testes
const API_BASE = 'http://localhost:3001/api';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhkMjYxYWFmLWYwNTctNDk0OC1iYjYxLWM2YTQwYjY3NDg3ZCIsImVtYWlsIjoiYWRtaW5AamFuaWNlY29ycmVpYS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzA4NDI2MDAsImV4cCI6MTczMzQzNDYwMH0.j5T3xLj36aZ5Q1Vw1YQNjhUQdR1XsfevJ8dOQQ2oHt8';

// Função para testar endpoints
async function testEndpoints() {
  console.log('🚀 Testando endpoints da API após correções...\n');
  
  const endpoints = [
    {
      name: 'Testimonials',
      url: '/testimonials',
      auth: true
    },
    {
      name: 'Blog Posts', 
      url: '/blog',
      auth: true
    },
    {
      name: 'Leads',
      url: '/leads',
      auth: true
    },
    {
      name: 'Palestras',
      url: '/palestras',
      auth: true
    },
    {
      name: 'Mentorias',
      url: '/mentorias', 
      auth: true
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
      
      if (endpoint.auth) {
        config.headers = {
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        };
      }
      
      const response = await axios(config);
      
      if (response.status >= 200 && response.status < 300) {
        console.log(`✅ ${endpoint.name}: SUCESSO (${response.status})`);
        if (response.data && Array.isArray(response.data)) {
          console.log(`   📊 ${response.data.length} registros encontrados`);
        }
      } else {
        console.log(`❌ ${endpoint.name}: ERRO (${response.status})`);
        if (response.data && response.data.error) {
          console.log(`   📝 ${response.data.error}`);
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

// Verificar se o servidor está rodando antes de testar
async function checkServer() {
  try {
    await axios.get(`${API_BASE}/health`, { timeout: 5000 });
    console.log('✅ Servidor API está rodando\n');
    await testEndpoints();
  } catch (error) {
    console.log('❌ Servidor API não está respondendo');
    console.log('📝 Certifique-se de executar: npm run dev');
  }
}

checkServer();