# Contexto Ativo

## Foco de Trabalho Atual
Estamos iniciando o projeto App-Ctrl, um aplicativo de controle financeiro pessoal. O foco atual está na configuração inicial do projeto, definição da arquitetura e estrutura de código seguindo Clean Architecture, Domain-Driven Design (DDD), Inversion of Control (IoC), princípios SOLID, e práticas de BDD/TDD. A stack tecnológica definida inclui React Native com Tailwind CSS e TypeScript para o frontend, GraphQL como BFF, NestJS com TypeORM para o backend, PostgreSQL como banco de dados, e Docker para infraestrutura. Para observabilidade, utilizamos a stack Grafana, Prometheus, Loki, e Tempo para monitoramento completo. **IMPORTANTE: Todo o desenvolvimento DEVE ser realizado exclusivamente em containers Docker, nunca localmente.**

## Mudanças Recentes
- Inicialização do taskmaster-ai para gerenciamento de tarefas do projeto
- Criação do PRD (Product Requirements Document) detalhando os requisitos do aplicativo
- Definição das premissas arquiteturais: Clean Architecture, DDD, IoC, SOLID, BDD, TDD
- Definição da stack tecnológica específica: React Native, Tailwind CSS, TypeScript, GraphQL, NestJS, TypeORM, PostgreSQL, Docker
- Estabelecimento da diretriz de desenvolvimento 100% containerizado (Docker-only)
- Definição da stack de observabilidade: Grafana, Prometheus, Loki, Tempo
- Atualização da primeira tarefa para incorporar as premissas arquiteturais e a stack tecnológica
- Documentação das decisões arquiteturais e tecnológicas no memory-bank

## Próximos Passos
1. Criar configuração Docker Compose para orquestrar todos os serviços, incluindo a stack de observabilidade
2. Criar Dockerfiles para cada componente do sistema (frontend, BFF, backend, etc.)
3. Configurar a estrutura de monorepo com Yarn Workspaces ou Nx dentro de containers
4. Configurar container de desenvolvimento para inicialização de projetos
5. Configurar containers Docker para PostgreSQL, NestJS, GraphQL BFF e React Native
6. Configurar containers para Grafana, Prometheus, Loki e Tempo
7. Implementar a estrutura de pastas seguindo Clean Architecture dentro dos containers
8. Configurar os frameworks de teste para BDD e TDD em ambiente containerizado
9. Implementar o container de injeção de dependência para IoC
10. Modelar o domínio seguindo os princípios de DDD
11. Instrumentar todos os serviços para expor métricas, logs e traces
12. Criar dashboards no Grafana para monitoramento do sistema

## Decisões Ativas e Considerações
- **Docker-Only**: Todo desenvolvimento, testes e build DEVE ser realizado exclusivamente em containers Docker, nunca localmente
- **Stack Frontend**: React Native com Tailwind CSS e TypeScript para desenvolvimento mobile
- **BFF**: GraphQL como camada intermediária entre frontend e backend
- **Stack Backend**: NestJS com TypeORM para API e lógica de negócios
- **Banco de Dados**: PostgreSQL como sistema de gerenciamento de banco de dados relacional
- **Infraestrutura**: Docker para containerização de todo o ambiente de desenvolvimento
- **Observabilidade**: Stack Grafana (Grafana, Prometheus, Loki, Tempo) para monitoramento completo
- **Arquitetura**: Adoção da Clean Architecture para separação clara de responsabilidades
- **Modelagem de Domínio**: Uso de DDD para focar nas regras de negócio e criar uma linguagem ubíqua
- **Testabilidade**: Implementação de BDD/TDD desde o início do projeto
- **Desacoplamento**: Uso de IoC para reduzir dependências entre componentes
- **Manutenibilidade**: Adesão aos princípios SOLID para facilitar manutenção e extensão
- **Estrutura de Projeto**: Monorepo para compartilhamento de código entre componentes

## Padrões e Preferências Importantes
- **Desenvolvimento Containerizado**: Nenhuma dependência deve ser instalada diretamente na máquina host
- **Docker Compose**: Orquestração de todos os serviços em ambiente de desenvolvimento
- **Volumes Docker**: Para persistência de código entre reinicializações de containers
- **Observabilidade por Design**: Todos os serviços devem ser instrumentados para expor métricas, logs e traces
- **Métricas Padronizadas**: Uso de Prometheus para coleta e armazenamento de métricas
- **Logs Estruturados**: Formato JSON com campos padronizados enviados para Loki
- **Rastreamento Distribuído**: OpenTelemetry para instrumentação e Tempo para armazenamento
- **Dashboards**: Visualizações padronizadas no Grafana para todos os serviços
- **Nomenclatura**: CamelCase para variáveis e funções, PascalCase para classes e interfaces
- **Organização de Código**: Um componente por arquivo, seguindo a estrutura da Clean Architecture
- **Estilo de Código**: Uso de ESLint e Prettier para garantir consistência
- **Estilização**: Tailwind CSS para estilização consistente e eficiente
- **Tipagem**: TypeScript com configuração strict para garantir segurança de tipos
- **ORM**: TypeORM para interação com o banco de dados PostgreSQL
- **API**: GraphQL para consultas flexíveis e eficientes
- **Commits**: Conventional Commits para padronização de mensagens
- **Testes**: Jest para testes unitários, Cucumber para BDD, Detox para testes E2E mobile
- **Documentação**: Comentários JSDoc para APIs públicas, README para cada módulo

## Aprendizados e Insights do Projeto
- A combinação de Clean Architecture com DDD proporciona uma base sólida para aplicativos complexos
- O uso de taskmaster-ai facilita o gerenciamento e acompanhamento de tarefas do projeto
- A definição clara de premissas arquiteturais e stack tecnológica no início do projeto ajuda a evitar desvios e inconsistências
- A documentação no memory-bank é essencial para manter o contexto entre sessões
- GraphQL como BFF oferece flexibilidade para diferentes necessidades de frontend
- NestJS proporciona uma estrutura organizada que se alinha bem com Clean Architecture e DDD
- O desenvolvimento 100% containerizado garante consistência entre ambientes e elimina problemas de "funciona na minha máquina"
- A stack Grafana oferece uma solução completa de observabilidade que se integra bem com aplicações containerizadas

## Bloqueios e Desafios Atuais
- Garantir que todos os membros da equipe compreendam e sigam as premissas arquiteturais
- Equilibrar a complexidade da arquitetura com a velocidade de desenvolvimento inicial
- Configurar corretamente todos os containers Docker para suportar hot-reload e desenvolvimento eficiente
- Implementar efetivamente os princípios de DDD em um contexto de aplicativo financeiro
- Integrar GraphQL como BFF mantendo a separação de responsabilidades da Clean Architecture
- Configurar TypeORM para trabalhar eficientemente com os princípios de DDD
- Garantir performance adequada em ambiente de desenvolvimento containerizado
- Configurar testes automatizados para execução em containers
- Implementar instrumentação eficiente para observabilidade sem impacto significativo na performance
- Configurar alertas adequados no Prometheus para detecção proativa de problemas
- Balancear o volume de logs e traces para evitar sobrecarga de armazenamento