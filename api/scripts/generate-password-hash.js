// Script para gerar hash de senha para o usuário admin
// Execute: node api/scripts/generate-password-hash.js

const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Digite a senha para o admin: ', (password) => {
  if (password.length < 8) {
    console.log('❌ Senha deve ter no mínimo 8 caracteres');
    rl.close();
    return;
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('❌ Erro ao gerar hash:', err);
      rl.close();
      return;
    }

    console.log('\n✅ Hash gerado com sucesso!');
    console.log('\nAtualize o arquivo init-db.sql com este hash:');
    console.log('\n------------------------------------------');
    console.log(hash);
    console.log('------------------------------------------\n');
    console.log('Substitua na linha do INSERT INTO users:');
    console.log(`password_hash: '${hash}'`);
    
    rl.close();
  });
});
