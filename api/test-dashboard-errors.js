// Script para testar se os erros do dashboard foram resolvidos
const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Simular requisições que o dashboard faz
async function testDashboardRequests() {
  console.log('🔍 Testando requisições do dashboard admin...\n');
  
  // Testes que normalmente causavam erros
  const tests = [
    {
      name: 'Listar Testimonials',
      url: '/testimonials',
      expectedError: 'status column'
    },
    {
      name: 'Listar Blog Posts', 
      url: '/blog/posts',
      expectedError: 'status column'
    },
    {
      name: 'Listar Leads',
      url: '/leads',
      expectedError: 'status column'
    },
    {
      name: 'Listar Palestras',
      url: '/palestras',
      expectedError: 'status column'
    },
    {
      name: 'Listar Mentorias',
      url: '/mentorias',
      expectedError: 'status column'
    }
  ];
  
  let allPassed = true;
  
  for (const test of tests) {
    console.log(`📡 Testando: ${test.name}`);
    
    try {
      const response = await axios.get(`${API_BASE}${test.url}`, {
        timeout: 10000,
        validateStatus: () => true
      });
      
      if (response.status >= 200 && response.status < 300) {
        console.log(`✅ ${test.name}: SUCESSO (${response.status})`);
        
        // Verificar se tem dados
        if (response.data && Array.isArray(response.data)) {
          console.log(`   📊 ${response.data.length} registros encontrados`);
        } else if (response.data) {
          console.log(`   📄 Dados recebidos com sucesso`);
        }
        
      } else if (response.status === 500) {
        console.log(`❌ ${test.name}: ERRO 500 (Internal Server Error)`);
        allPassed = false;
        
        // Verificar se é o erro esperado
        if (response.data && response.data.error) {
          const errorMessage = JSON.stringify(response.data.error).toLowerCase();
          if (errorMessage.includes(test.expectedError.toLowerCase())) {
            console.log(`   📝 ERRO ESPERADO: ${test.expectedError}`);
          } else {
            console.log(`   📝 ${response.data.error}`);
          }
        }
        
      } else {
        console.log(`⚠️  ${test.name}: Status ${response.status}`);
        if (response.data && response.data.error) {
          console.log(`   📝 ${response.data.error}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ ${test.name}: FALHA NA CONEXÃO`);
      console.log(`   📝 ${error.message}`);
      allPassed = false;
    }
    
    console.log('');
  }
  
  if (allPassed) {
    console.log('🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ Os erros do dashboard foram resolvidos!');
  } else {
    console.log('⚠️  ALGUNS TESTES FALHARAM!');
    console.log('❌ Ainda existem problemas no sistema.');
  }
}

testDashboardRequests();