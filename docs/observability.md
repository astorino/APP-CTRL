# Stack de Observabilidade

Este documento descreve a stack de observabilidade implementada no projeto APP-CTRL.

## Visão Geral

A stack de observabilidade é composta por quatro componentes principais:

1. **Prometheus**: Coleta e armazenamento de métricas
2. **Grafana**: Visualização de métricas, logs e traces
3. **Loki**: Agregação e consulta de logs
4. **Tempo**: Rastreamento distribuído

Esta combinação fornece os três pilares da observabilidade:
- **Métricas**: Valores numéricos que representam o estado do sistema
- **Logs**: Registros de eventos que ocorrem no sistema
- **Traces**: Rastreamento de requisições através de múltiplos serviços

## Componentes

### Prometheus

O Prometheus é responsável por coletar métricas de todos os serviços. Ele funciona através de um modelo de pull, onde o Prometheus consulta endpoints de métricas em intervalos regulares.

**Configuração**: `/observability/prometheus/prometheus.yml`

**Endpoints monitorados**:
- Backend: `backend:3000`
- BFF: `bff:4000`
- Web: `web:3001`

**Acesso**: http://localhost:9090

### Grafana

O Grafana é a interface de visualização para métricas, logs e traces. Ele se conecta ao Prometheus, Loki e Tempo para fornecer dashboards unificados.

**Configuração**:
- Datasources: `/observability/grafana/provisioning/datasources/datasources.yml`
- Dashboards: `/observability/grafana/provisioning/dashboards/dashboards.yml`

**Dashboards pré-configurados**:
- App Overview: Visão geral do status dos serviços

**Acesso**: http://localhost:3002

### Loki

O Loki é um sistema de agregação de logs inspirado no Prometheus. Ele é otimizado para armazenar e consultar logs de forma eficiente.

**Configuração**: `/observability/loki/loki-config.yml`

**Acesso**: http://localhost:3100

### Tempo

O Tempo é um sistema de rastreamento distribuído de alto desempenho. Ele permite rastrear requisições através de múltiplos serviços.

**Configuração**: `/observability/tempo/tempo-config.yml`

**Acesso**: http://localhost:3200

## Instrumentação dos Serviços

### Backend (NestJS)

O backend é instrumentado com:

1. **Prometheus Client**:
   ```typescript
   // Exemplo de instrumentação
   import { PrometheusController } from './prometheus/prometheus.controller';
   
   @Module({
     controllers: [PrometheusController],
   })
   export class AppModule {}
   ```

2. **OpenTelemetry para tracing**:
   ```typescript
   // Exemplo de configuração
   import { NodeSDK } from '@opentelemetry/sdk-node';
   import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
   import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
   
   const sdk = new NodeSDK({
     traceExporter: new OTLPTraceExporter({
       url: 'http://tempo:4318/v1/traces',
     }),
     instrumentations: [getNodeAutoInstrumentations()],
   });
   
   sdk.start();
   ```

3. **Structured Logging**:
   ```typescript
   // Exemplo de logger estruturado
   import { Logger } from 'nestjs-pino';
   
   @Injectable()
   export class AppService {
     constructor(private readonly logger: Logger) {}
     
     getHello(): string {
       this.logger.log('Hello world request received');
       return 'Hello World!';
     }
   }
   ```

### BFF (GraphQL)

O BFF é instrumentado com:

1. **Apollo Server com OpenTelemetry**:
   ```typescript
   // Exemplo de configuração
   import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
   
   const server = new ApolloServer({
     typeDefs,
     resolvers,
     plugins: [ApolloServerPluginInlineTrace()],
   });
   ```

2. **Prometheus metrics**:
   ```typescript
   // Exemplo de configuração
   import { createApolloQueryMetrics } from 'apollo-metrics';
   
   const server = new ApolloServer({
     typeDefs,
     resolvers,
     plugins: [createApolloQueryMetrics()],
   });
   ```

### Frontend (React/React Native)

Os frontends são instrumentados com:

1. **OpenTelemetry para browser/mobile**:
   ```typescript
   // Exemplo de configuração para web
   import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
   import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
   
   const provider = new WebTracerProvider();
   provider.addSpanProcessor(
     new SimpleSpanProcessor(
       new OTLPTraceExporter({
         url: 'http://localhost:4318/v1/traces',
       })
     )
   );
   provider.register();
   ```

2. **Error tracking**:
   ```typescript
   // Exemplo de error boundary
   class ErrorBoundary extends React.Component {
     componentDidCatch(error, errorInfo) {
       // Log error to Loki
       fetch('/api/log', {
         method: 'POST',
         body: JSON.stringify({ error, errorInfo }),
       });
     }
     
     render() {
       return this.props.children;
     }
   }
   ```

## Consultas Comuns

### Prometheus (Métricas)

```promql
# Taxa de requisições HTTP por serviço
sum by (job) (rate(http_requests_total[5m]))

# Tempo de resposta médio
avg by (job) (http_request_duration_seconds_sum / http_request_duration_seconds_count)

# Uso de memória
process_resident_memory_bytes
```

### Loki (Logs)

```logql
# Logs de erro do backend
{job="backend"} |= "error"

# Logs de um serviço específico com nível de log
{job="bff"} | json | level="error"

# Contagem de erros por serviço
sum by (job) (count_over_time({level="error"}[1h]))
```

### Tempo (Traces)

Consultas são feitas principalmente através da interface do Grafana, que permite:

- Buscar traces por ID
- Filtrar traces por serviço, duração, status
- Visualizar spans individuais e suas relações

## Alertas

Os alertas são configurados no Prometheus e visualizados no Grafana. Exemplos de alertas:

```yaml
groups:
  - name: app-alerts
    rules:
      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is above 10% for 5 minutes"
```

## Execução Independente

A stack de observabilidade pode ser executada independentemente dos serviços principais:

```bash
docker-compose -f docker-compose.observability.yml up
```

Isso é útil para:
- Analisar logs e métricas históricas
- Configurar novos dashboards e alertas
- Testar a instrumentação de novos serviços