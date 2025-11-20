#!/bin/bash

# Script para testar o upload de imagens
# Salve como: test-upload.sh

echo "🧪 Testando Upload de Imagens"
echo "=============================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuração
API_URL="https://api.janicecorreia.com.br/api/media/upload"
TOKEN="SEU_TOKEN_JWT_AQUI"  # Substitua pelo seu token

echo "📍 URL da API: $API_URL"
echo ""

# Verificar se o arquivo de teste existe
if [ ! -f "test-image.jpg" ]; then
    echo -e "${YELLOW}⚠️  Criando imagem de teste...${NC}"
    # Criar uma imagem de teste pequena (1x1 pixel)
    echo -e "\xff\xd8\xff\xe0\x00\x10\x4a\x46\x49\x46\x00\x01" > test-image.jpg
fi

echo "📤 Enviando arquivo de teste..."
echo ""

# Fazer upload
response=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@test-image.jpg" \
  "$API_URL")

# Separar corpo e status code
http_body=$(echo "$response" | head -n -1)
http_code=$(echo "$response" | tail -n 1)

echo "📊 Status Code: $http_code"
echo "📄 Response:"
echo "$http_body" | jq . 2>/dev/null || echo "$http_body"
echo ""

# Verificar resultado
if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Upload bem-sucedido!${NC}"
    
    # Extrair URL
    url=$(echo "$http_body" | jq -r '.url' 2>/dev/null)
    if [ "$url" != "null" ] && [ ! -z "$url" ]; then
        echo -e "${GREEN}🔗 URL da imagem: $url${NC}"
    fi
else
    echo -e "${RED}❌ Erro no upload${NC}"
    
    # Mostrar erro detalhado
    error=$(echo "$http_body" | jq -r '.error' 2>/dev/null)
    if [ "$error" != "null" ] && [ ! -z "$error" ]; then
        echo -e "${RED}📝 Erro: $error${NC}"
    fi
fi

echo ""
echo "=============================="
echo "🏁 Teste finalizado"