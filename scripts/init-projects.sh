#!/bin/bash

# Script para inicializar os projetos usando o container de ferramentas de desenvolvimento

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Iniciando a criação dos projetos...${NC}"

# Construir a imagem de ferramentas de desenvolvimento
echo -e "${GREEN}Construindo a imagem de ferramentas de desenvolvimento...${NC}"
docker build -t dev-tools -f dev-tools/Dockerfile .

# Criar diretórios se não existirem
mkdir -p frontend/mobile frontend/web backend bff shared

# Inicializar o projeto React Native
echo -e "${GREEN}Inicializando o projeto React Native...${NC}"
docker run --rm -v "$(pwd)/frontend/mobile:/app" dev-tools npx react-native init AppCtrlMobile --template react-native-template-typescript

# Inicializar o projeto React Web
echo -e "${GREEN}Inicializando o projeto React Web...${NC}"
docker run --rm -v "$(pwd)/frontend/web:/app" dev-tools npx create-react-app app-ctrl-web --template typescript

# Inicializar o projeto NestJS
echo -e "${GREEN}Inicializando o projeto NestJS...${NC}"
docker run --rm -v "$(pwd)/backend:/app" dev-tools nest new app-ctrl-backend --package-manager npm

# Inicializar o projeto BFF (GraphQL)
echo -e "${GREEN}Inicializando o projeto BFF (GraphQL)...${NC}"
docker run --rm -v "$(pwd)/bff:/app" dev-tools bash -c "
  npm init -y && 
  npm install apollo-server graphql && 
  mkdir -p src && 
  touch src/index.js
"

# Adicionar Tailwind CSS ao projeto React Web
echo -e "${GREEN}Adicionando Tailwind CSS ao projeto React Web...${NC}"
docker run --rm -v "$(pwd)/frontend/web:/app" dev-tools bash -c "
  cd app-ctrl-web && 
  npm install -D tailwindcss postcss autoprefixer && 
  npx tailwindcss init -p
"

# Adicionar Tailwind CSS ao projeto React Native
echo -e "${GREEN}Adicionando Tailwind CSS ao projeto React Native...${NC}"
docker run --rm -v "$(pwd)/frontend/mobile:/app" dev-tools bash -c "
  cd AppCtrlMobile && 
  npm install tailwind-rn && 
  npm install --save-dev concurrently
"

# Adicionar TypeORM ao projeto NestJS
echo -e "${GREEN}Adicionando TypeORM ao projeto NestJS...${NC}"
docker run --rm -v "$(pwd)/backend:/app" dev-tools bash -c "
  cd app-ctrl-backend && 
  npm install --save @nestjs/typeorm typeorm pg
"

# Criar arquivo básico para o BFF
echo -e "${GREEN}Criando arquivo básico para o BFF...${NC}"
cat > bff/src/index.js << EOL
const { ApolloServer, gql } = require('apollo-server');

// Definição do schema GraphQL
const typeDefs = gql\`
  type Query {
    hello: String
  }
\`;

// Resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL BFF!'
  }
};

// Inicialização do servidor Apollo
const server = new ApolloServer({ typeDefs, resolvers });

// Iniciar o servidor
server.listen().then(({ url }) => {
  console.log(\`🚀 GraphQL BFF running at \${url}\`);
});
EOL

# Adicionar script de start ao package.json do BFF
echo -e "${GREEN}Adicionando script de start ao package.json do BFF...${NC}"
docker run --rm -v "$(pwd)/bff:/app" dev-tools bash -c "
  cd /app && 
  npm pkg set scripts.start='node src/index.js'
"

echo -e "${YELLOW}Projetos inicializados com sucesso!${NC}"
echo -e "${GREEN}Você pode iniciar o ambiente de desenvolvimento com:${NC}"
echo -e "  npm start"
echo -e "${GREEN}Ou com o ambiente de desenvolvimento específico:${NC}"
echo -e "  docker-compose -f docker-compose.dev.yml up"