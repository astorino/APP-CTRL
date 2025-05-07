# Contexto Técnico

## Tecnologias Utilizadas
- **React Native** - Framework para desenvolvimento mobile multiplataforma
- **Tailwind CSS** - Framework de CSS utilitário para estilização
- **TypeScript** - Superset tipado de JavaScript para maior segurança e produtividade
- **GraphQL** - Linguagem de consulta para APIs como BFF (Backend for Frontend)
- **NestJS** - Framework para construção de aplicações server-side eficientes e escaláveis
- **TypeORM** - ORM (Object-Relational Mapping) para TypeScript e JavaScript
- **PostgreSQL** - Sistema de gerenciamento de banco de dados relacional
- **Docker** - Plataforma de containerização para desenvolvimento e implantação
- **Docker Compose** - Ferramenta para definir e executar aplicações Docker multi-container
- **Jest** - Framework de testes para JavaScript
- **Cucumber** - Framework para BDD (Behavior-Driven Development)
- **Grafana** - Plataforma de visualização e monitoramento
- **Prometheus** - Sistema de monitoramento e alerta
- **Loki** - Sistema de agregação de logs
- **Tempo** - Rastreamento distribuído

## Configuração de Desenvolvimento
O ambiente de desenvolvimento é configurado como um monorepo usando Yarn Workspaces ou Nx, permitindo compartilhamento de código entre os projetos. **IMPORTANTE: Todo o desenvolvimento deve ser realizado exclusivamente dentro de containers Docker, nunca localmente.**

1. **Configuração Inicial do Ambiente**:
   ```bash
   # Clonar o repositório
   git clone [repo-url]
   cd app-ctrl
   
   # Iniciar todos os containers de desenvolvimento
   docker-compose up -d
   ```

2. **Execução do Ambiente de Desenvolvimento**:
   ```bash
   # Todos os serviços são executados em containers Docker
   # Para iniciar todos os serviços
   docker-compose up -d
   
   # Para visualizar logs de um serviço específico
   docker-compose logs -f [service-name]
   ```

3. **Execução de Comandos nos Containers**:
   ```bash
   # Executar comandos no container do frontend
   docker-compose exec frontend yarn [command]
   
   # Executar comandos no container do backend
   docker-compose exec backend yarn [command]
   
   # Executar comandos no container do BFF
   docker-compose exec bff yarn [command]
   ```

4. **Execução de Testes**:
   ```bash
   # Testes unitários
   docker-compose exec [service] yarn test
   
   # Testes BDD
   docker-compose exec [service] yarn test:bdd
   
   # Testes e2e
   docker-compose exec [service] yarn test:e2e
   ```

5. **Linting e Formatação**:
   ```bash
   # Verificar estilo de código
   docker-compose exec [service] yarn lint
   
   # Formatar código
   docker-compose exec [service] yarn format
   ```

6. **Build para Produção**:
   ```bash
   # Build de imagens Docker para produção
   docker-compose -f docker-compose.prod.yml build
   ```

7. **Gerenciamento de Containers**:
   ```bash
   # Parar todos os containers
   docker-compose down
   
   # Reiniciar um serviço específico
   docker-compose restart [service]
   
   # Visualizar status dos containers
   docker-compose ps
   ```

8. **Acesso à Observabilidade**:
   ```bash
   # Acessar Grafana (interface de visualização)
   # Abrir navegador em http://localhost:3000
   
   # Verificar métricas diretamente no Prometheus
   # Abrir navegador em http://localhost:9090
   
   # Explorar logs no Loki via Grafana
   # Abrir navegador em http://localhost:3000/explore
   
   # Visualizar traces no Tempo via Grafana
   # Abrir navegador em http://localhost:3000/explore
   ```

## Restrições Técnicas
- **Ambiente de Desenvolvimento**: Todo desenvolvimento DEVE ser realizado em containers Docker, nunca localmente
- **Compatibilidade Mobile**: iOS 12+ e Android 7+
- **Tamanho do Aplicativo**: <50MB para aplicativos móveis
- **Performance**: Tempo de carregamento inicial <3s em conexões 4G
- **Acessibilidade**: Conformidade com WCAG 2.1 nível AA
- **Offline First**: Funcionalidades principais devem funcionar offline
- **Tipagem Estrita**: Uso rigoroso de TypeScript com configuração strict
- **Observabilidade**: Todos os serviços devem expor métricas, logs e traces

## Dependências
### Frontend (React Native)
- **React Native** - Framework mobile principal
- **React Navigation** - Navegação para React Native
- **Tailwind CSS (via react-native-tailwindcss)** - Estilização
- **Apollo Client** - Cliente GraphQL para consumo da API
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **Reanimated** - Animações fluidas
- **Victory Native** - Visualização de dados e gráficos
- **i18next** - Internacionalização
- **date-fns** - Manipulação de datas
- **AsyncStorage** - Armazenamento local
- **OpenTelemetry** - Instrumentação para observabilidade

### BFF (GraphQL)
- **Apollo Server** - Servidor GraphQL
- **GraphQL Tools** - Utilitários para GraphQL
- **DataLoader** - Otimização de consultas
- **GraphQL Code Generator** - Geração de tipos a partir do schema
- **GraphQL Shield** - Proteção e autorização para GraphQL
- **OpenTelemetry** - Instrumentação para observabilidade
- **Prometheus Client** - Exposição de métricas

### Backend (NestJS)
- **NestJS** - Framework backend
- **TypeORM** - ORM para PostgreSQL
- **Passport** - Autenticação
- **JWT** - Tokens de autenticação
- **bcrypt** - Hashing de senhas
- **Class Validator** - Validação de dados
- **Winston** - Logging
- **Nodemailer** - Envio de emails
- **Multer** - Upload de arquivos
- **Nest Schedule** - Agendamento de tarefas
- **OpenTelemetry** - Instrumentação para observabilidade
- **Prometheus Client** - Exposição de métricas
- **Winston Loki Transport** - Envio de logs para Loki

### Observabilidade
- **Grafana** - Visualização de dashboards, métricas, logs e traces
- **Prometheus** - Coleta e armazenamento de métricas
- **Loki** - Agregação e consulta de logs
- **Tempo** - Rastreamento distribuído
- **OpenTelemetry** - Instrumentação de código para observabilidade
- **Prometheus Node Exporter** - Métricas do sistema
- **cAdvisor** - Métricas de containers

### Outras
- **TypeScript** - Tipagem estática
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Jest** - Testes unitários
- **Cucumber** - Testes BDD
- **Supertest** - Testes de API
- **Detox** - Testes E2E para mobile
- **Storybook** - Documentação de componentes
- **Husky** - Git hooks
- **Commitlint** - Padronização de commits

## Padrões de Uso de Ferramentas
- **Git Flow**: Modelo de branching com branches de feature, develop, release e master
- **Conventional Commits**: Padronização de mensagens de commit (feat, fix, docs, etc.)
- **CI/CD**: Integração e entrega contínua usando GitHub Actions ou similar
- **Docker-First**: Todo desenvolvimento e execução DEVE ser feito em containers Docker
- **ESLint/Prettier**: Configurados para garantir consistência de código e princípios SOLID
- **Jest**: Testes unitários com cobertura mínima de 80%
- **Cucumber**: Especificações BDD em linguagem Gherkin
- **TypeORM Migrations**: Versionamento do schema do banco de dados
- **Observabilidade**: Instrumentação de código para métricas, logs e traces

## Infraestrutura
- **Desenvolvimento**: 100% containerizado com Docker
  - Container PostgreSQL
  - Container NestJS API
  - Container GraphQL BFF
  - Container React Native (para build e testes)
  - Containers para serviços auxiliares (Redis, etc.)
  - Stack de observabilidade (Grafana, Prometheus, Loki, Tempo)
- **Volumes Docker**: Para persistência de dados entre reinicializações de containers
- **Docker Networks**: Redes isoladas para comunicação segura entre containers
- **Docker Compose**: Orquestração de todos os containers de desenvolvimento
- **Hot Reload**: Configurado dentro dos containers para desenvolvimento eficiente
- **CI/CD**: Pipeline automatizado para testes, build e deploy usando containers Docker

## Observabilidade
A observabilidade do sistema é implementada usando a stack Grafana, seguindo o princípio de que todos os serviços devem ser observáveis por padrão.

### Componentes de Observabilidade
- **Grafana**: Interface unificada para visualização de métricas, logs e traces
- **Prometheus**: Coleta, armazenamento e consulta de métricas
- **Loki**: Agregação, indexação e consulta de logs
- **Tempo**: Rastreamento distribuído para análise de performance e depuração

### Implementação
1. **Métricas (Prometheus)**:
   - Métricas de negócio: transações, usuários ativos, etc.
   - Métricas técnicas: latência, taxa de erros, uso de recursos
   - Métricas de sistema: CPU, memória, disco, rede
   - Métricas de aplicação: tempo de resposta, contadores de cache, etc.
   - Alertas baseados em thresholds predefinidos

2. **Logs (Loki)**:
   - Logs estruturados em formato JSON
   - Níveis de log padronizados (debug, info, warn, error)
   - Contexto enriquecido (request ID, user ID, etc.)
   - Retenção configurável por ambiente
   - Consultas e filtros via Grafana

3. **Traces (Tempo)**:
   - Rastreamento de requisições através de múltiplos serviços
   - Identificação de gargalos de performance
   - Correlação com logs e métricas
   - Amostragem configurável para controle de volume
   - Visualização de cascata para análise de latência

4. **Dashboards (Grafana)**:
   - Dashboard de visão geral do sistema
   - Dashboards específicos por serviço
   - Dashboards de negócio (KPIs)
   - Dashboards de infraestrutura
   - Dashboards de performance

### Instrumentação
- **Frontend**: OpenTelemetry para React Native
- **BFF**: Instrumentação Apollo Server com OpenTelemetry
- **Backend**: Módulo NestJS para OpenTelemetry
- **Infraestrutura**: Node Exporter e cAdvisor

## Docker Compose
Exemplo de estrutura do docker-compose.yml incluindo observabilidade:
```yaml
version: '3.8'

services:
  # Serviços de aplicação
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: appctrl
      POSTGRES_PASSWORD: appctrl
      POSTGRES_DB: appctrl
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://appctrl:appctrl@postgres:5432/appctrl
      OTEL_EXPORTER_OTLP_ENDPOINT: http://tempo:4317
    ports:
      - "3000:3000"

  bff:
    build:
      context: ./bff
      dockerfile: Dockerfile.dev
    volumes:
      - ./bff:/app
      - /app/node_modules
    depends_on:
      - backend
    environment:
      OTEL_EXPORTER_OTLP_ENDPOINT: http://tempo:4317
    ports:
      - "4000:4000"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - bff
    environment:
      OTEL_EXPORTER_OTLP_ENDPOINT: http://tempo:4317
    ports:
      - "8081:8081"

  # Serviços de observabilidade
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./observability/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'
    ports:
      - "9090:9090"

  loki:
    image: grafana/loki:latest
    volumes:
      - ./observability/loki/loki-config.yaml:/etc/loki/local-config.yaml
      - loki-data:/loki
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml

  tempo:
    image: grafana/tempo:latest
    command: -config.file=/etc/tempo.yaml
    volumes:
      - ./observability/tempo/tempo-config.yaml:/etc/tempo.yaml
      - tempo-data:/tmp/tempo
    ports:
      - "3200:3200"  # tempo
      - "4317:4317"  # otlp grpc

  grafana:
    image: grafana/grafana:latest
    volumes:
      - ./observability/grafana/provisioning:/etc/grafana/provisioning
      - grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    ports:
      - "3001:3000"
    depends_on:
      - prometheus
      - loki
      - tempo

  node-exporter:
    image: prom/node-exporter:latest
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    ports:
      - "9100:9100"

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
    ports:
      - "8080:8080"

volumes:
  postgres-data:
  prometheus-data:
  loki-data:
  tempo-data:
  grafana-data:
```

## Segurança
- **Autenticação**: JWT com refresh tokens e expiração curta
- **Autorização**: RBAC (Role-Based Access Control)
- **Criptografia**: Dados sensíveis criptografados em repouso e em trânsito
- **Isolamento de Containers**: Configuração segura de containers Docker
- **Secrets Management**: Gerenciamento seguro de secrets em Docker
- **Proteção contra Ataques**:
  - CSRF (Cross-Site Request Forgery)
  - XSS (Cross-Site Scripting)
  - SQL Injection
  - MITM (Man-in-the-Middle)
- **Validação de Dados**: Validação rigorosa de todas as entradas de usuário
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Auditoria**: Logging de ações sensíveis para rastreabilidade
- **Conformidade**: LGPD (Lei Geral de Proteção de Dados)