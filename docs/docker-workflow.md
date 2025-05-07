# Fluxo de Desenvolvimento com Docker

Este documento descreve o fluxo de desenvolvimento baseado em Docker para o projeto APP-CTRL.

## Princípios

- **Desenvolvimento Exclusivamente em Containers**: Todo o desenvolvimento deve ser realizado dentro de containers Docker, nunca localmente.
- **Consistência de Ambiente**: Garantir que todos os desenvolvedores trabalhem no mesmo ambiente.
- **Isolamento**: Cada serviço é isolado em seu próprio container.
- **Observabilidade**: Monitoramento integrado de todos os serviços.

## Estrutura de Containers

O projeto utiliza os seguintes containers:

1. **backend**: API NestJS
2. **bff**: GraphQL Backend for Frontend
3. **web**: Frontend React.js
4. **mobile**: Frontend React Native
5. **postgres**: Banco de dados PostgreSQL
6. **prometheus**: Coleta de métricas
7. **grafana**: Visualização de métricas, logs e traces
8. **loki**: Agregação de logs
9. **tempo**: Rastreamento distribuído

## Fluxo de Trabalho

### Inicialização do Projeto

Para inicializar um novo projeto ou componente:

```bash
# Criar container de ferramentas de desenvolvimento
docker build -t dev-tools -f dev-tools/Dockerfile .

# Inicializar projeto React Native
docker run --rm -v $(pwd)/frontend/mobile:/app dev-tools npx react-native init AppCtrlMobile --template react-native-template-typescript

# Inicializar projeto React Web
docker run --rm -v $(pwd)/frontend/web:/app dev-tools npx create-react-app app-ctrl-web --template typescript

# Inicializar projeto NestJS
docker run --rm -v $(pwd)/backend:/app dev-tools nest new app-ctrl-backend
```

### Desenvolvimento Diário

1. Inicie os serviços:
   ```bash
   npm start
   ```

2. Acesse os serviços:
   - Backend: http://localhost:3000
   - BFF: http://localhost:4000
   - Web: http://localhost:3001
   - Mobile: http://localhost:8081
   - Grafana: http://localhost:3002

3. Desenvolvimento:
   - Os arquivos são montados como volumes nos containers
   - As alterações são refletidas automaticamente (hot-reload)
   - Os logs são exibidos no terminal e coletados pelo Loki

4. Testes:
   ```bash
   npm test
   ```

5. Ao finalizar, pare os serviços:
   ```bash
   npm run stop
   ```

### Adição de Dependências

Para adicionar dependências a um projeto:

```bash
# Exemplo para o backend
docker-compose exec backend npm install --save @nestjs/typeorm typeorm pg

# Exemplo para o frontend web
docker-compose exec web npm install --save axios react-router-dom

# Exemplo para o frontend mobile
docker-compose exec mobile npm install --save react-navigation
```

### Execução de Comandos

Para executar comandos em um container específico:

```bash
docker-compose exec <service> <command>

# Exemplos:
docker-compose exec backend npm run migration:generate
docker-compose exec web npm run build
docker-compose exec bff npm run codegen
```

## Observabilidade

Para acessar as ferramentas de observabilidade:

- **Grafana**: http://localhost:3002
  - Visualização de métricas, logs e traces
  - Dashboards pré-configurados

- **Prometheus**: http://localhost:9090
  - Consulta de métricas brutas
  - Configuração de alertas

- **Loki**: http://localhost:3100
  - Agregação e consulta de logs

- **Tempo**: http://localhost:3200
  - Rastreamento distribuído

## Solução de Problemas

### Containers não iniciam

Verifique os logs:
```bash
docker-compose logs <service>
```

### Problemas de permissão

Em sistemas Linux, pode ser necessário ajustar as permissões:
```bash
sudo chown -R $(id -u):$(id -g) ./
```

### Problemas de rede

Verifique se as portas estão disponíveis:
```bash
netstat -tulpn | grep <port>
```

### Limpeza completa

Para limpar completamente o ambiente:
```bash
npm run clean
docker system prune -a
```