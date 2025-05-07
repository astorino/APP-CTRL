# APP-CTRL - Aplicativo de Controle Financeiro

Este projeto implementa um aplicativo de controle financeiro com uma arquitetura moderna e escalável, utilizando:

- **Frontend Web**: React.js com TypeScript e Tailwind CSS
- **Frontend Mobile**: React Native com TypeScript e Tailwind CSS
- **Backend**: NestJS com TypeORM
- **BFF (Backend for Frontend)**: GraphQL com Apollo Server
- **Banco de Dados**: PostgreSQL
- **Observabilidade**: Grafana, Prometheus, Loki e Tempo

## Arquitetura

O projeto segue os princípios de Clean Architecture, Domain-Driven Design (DDD), Inversion of Control (IoC) e SOLID, organizados em uma estrutura de monorepo:

```
/
├── frontend/
│   ├── mobile/     # Aplicativo React Native
│   └── web/        # Aplicativo React.js
├── backend/        # API NestJS
├── bff/            # GraphQL BFF
├── shared/         # Código compartilhado
└── observability/  # Configuração de monitoramento
```

## Desenvolvimento

Todo o desenvolvimento é realizado exclusivamente dentro de containers Docker, garantindo consistência entre ambientes de desenvolvimento e produção.

### Pré-requisitos

- Docker
- Docker Compose

### Comandos

```bash
# Iniciar todos os serviços
npm start

# Construir as imagens Docker
npm run build

# Executar testes
npm run test

# Parar os serviços
npm run stop

# Limpar volumes e containers
npm run clean

# Executar apenas a stack de observabilidade
docker-compose -f docker-compose.observability.yml up
```

## Observabilidade

O projeto inclui uma stack completa de observabilidade:

- **Prometheus**: Coleta de métricas
- **Grafana**: Visualização de métricas, logs e traces
- **Loki**: Agregação de logs
- **Tempo**: Rastreamento distribuído

Acesse o Grafana em `http://localhost:3000` após iniciar os serviços.

## CI/CD

O projeto utiliza GitHub Actions para integração e entrega contínuas, com pipelines configurados para:

1. Executar testes em containers isolados
2. Construir imagens Docker
3. (Configurar deploy conforme necessário)

## Estrutura de Diretórios

- `/frontend/mobile`: Aplicativo React Native
- `/frontend/web`: Aplicativo React.js
- `/backend`: API NestJS
- `/bff`: GraphQL BFF
- `/shared`: Código compartilhado
- `/observability`: Configuração de monitoramento
  - `/prometheus`: Configuração do Prometheus
  - `/grafana`: Dashboards e configuração do Grafana
  - `/loki`: Configuração do Loki
  - `/tempo`: Configuração do Tempo

## Contribuição

1. Certifique-se de que todos os testes passam antes de enviar um pull request
2. Siga os padrões de código e arquitetura estabelecidos
3. Documente novas funcionalidades ou alterações significativas