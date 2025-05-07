# Contexto do Produto

## Por que este projeto existe
O App-Ctrl existe porque muitas pessoas enfrentam dificuldades para gerenciar suas finanças pessoais de forma eficiente. Apesar da abundância de aplicativos financeiros no mercado, muitos são complexos demais, não oferecem uma experiência consistente entre plataformas ou não funcionam bem offline. Este projeto visa preencher essa lacuna, oferecendo uma solução intuitiva, multiplataforma e focada na experiência do usuário, construída sobre uma base técnica sólida que garante qualidade, segurança e manutenibilidade.

## Problemas que resolve
- **Falta de visibilidade financeira**: Muitas pessoas não têm uma visão clara de para onde vai seu dinheiro
- **Dificuldade em manter orçamentos**: Usuários têm problemas para estabelecer e seguir limites de gastos
- **Categorização manual trabalhosa**: A classificação manual de transações consome tempo e é propensa a erros
- **Inconsistência entre dispositivos**: Dados financeiros frequentemente ficam isolados em um único dispositivo
- **Dependência de conexão**: Muitos aplicativos não funcionam adequadamente sem internet
- **Complexidade excessiva**: Aplicativos financeiros tendem a ser sobrecarregados com funcionalidades raramente usadas
- **Falta de insights personalizados**: Ausência de análises e recomendações baseadas nos padrões individuais de gastos

## Como deve funcionar
O App-Ctrl deve funcionar como um assistente financeiro pessoal que acompanha o usuário em sua jornada para uma melhor saúde financeira. O aplicativo deve ser simples de usar, mas poderoso em suas capacidades analíticas. 

O usuário começa registrando suas transações (manualmente ou via importação), que são automaticamente categorizadas. O sistema então gera visualizações e relatórios que ajudam a entender padrões de gastos. O usuário pode estabelecer orçamentos por categoria e receber alertas quando se aproximar dos limites. 

Todos os dados são sincronizados entre dispositivos, permitindo que o usuário acesse suas informações financeiras de qualquer lugar, mesmo offline. O aplicativo aprende com o comportamento do usuário ao longo do tempo, oferecendo insights cada vez mais personalizados e relevantes.

## Fluxos principais
1. **Registro de transações**:
   - Usuário abre o aplicativo
   - Seleciona "Nova transação"
   - Preenche detalhes (valor, data, categoria, descrição)
   - Sistema sugere categoria automaticamente
   - Usuário confirma e salva a transação
   - Dashboard atualiza com novos valores e gráficos

2. **Configuração de orçamento**:
   - Usuário acessa seção de orçamentos
   - Visualiza orçamentos existentes
   - Seleciona "Novo orçamento" ou edita existente
   - Escolhe categoria e define limite mensal
   - Configura alertas (ex: 80% do limite)
   - Salva configurações
   - Sistema monitora gastos e envia alertas conforme configurado

3. **Análise de relatórios**:
   - Usuário acessa seção de relatórios
   - Seleciona tipo de relatório (gastos por categoria, evolução mensal, etc.)
   - Define período de análise
   - Visualiza gráficos e dados
   - Aplica filtros para análise mais detalhada
   - Exporta ou compartilha relatório se necessário

4. **Sincronização entre dispositivos**:
   - Usuário faz alterações em um dispositivo
   - Sistema sincroniza automaticamente quando online
   - Alterações ficam em fila quando offline
   - Ao recuperar conexão, sistema sincroniza alterações pendentes
   - Em caso de conflitos, sistema aplica regras de resolução predefinidas

## Funcionalidades Detalhadas

### 1. Funcionalidades Principais

#### 1.1. Cadastro de Transações
- Entrada e saída de dinheiro com:
  - Valor
  - Categoria (Ex: Alimentação, Transporte, Lazer, etc.)
  - Forma de pagamento (Dinheiro, Cartão, Pix, Boleto)
  - Data
  - Descrição (opcional)
- Opção de transações recorrentes (ex: aluguel, salário)

#### 1.2. Visualização por Período
- Tela de resumo mensal com:
  - Total de ganhos e gastos
  - Saldo atual
- Gráfico de pizza e barras (ganhos x gastos por categoria)
- Filtro por dia, semana, mês, ano

#### 1.3. Planejamento Financeiro
- Definir orçamento mensal por categoria
- Alertas quando estiver próximo de estourar o orçamento
- Criação de metas (ex: juntar R$ 500 para emergência)
- Visualização de progresso das metas

#### 1.4. Dívidas e Parcelamentos
- Registro de dívidas com:
  - Valor total
  - Parcelas
  - Data de vencimento
- Notificações de vencimento

#### 1.5. Relatórios e Exportações
- Exportar dados em PDF e Excel
- Histórico completo por mês
- Sugestões baseadas nos gastos (ex: "Você gastou muito com delivery")

### 2. Funcionalidades de Acessibilidade e Inclusão
- Interface simples com ícones autoexplicativos
- Modo noturno e letras grandes
- Linguagem sem termos técnicos (ex: "gasto", não "passivo")
- Tutoriais passo a passo (vídeo ou texto curto)

### 3. Segurança e Privacidade
- Cadastro por e-mail ou número de telefone
- Proteção por PIN, biometria ou senha
- Armazenamento local ou na nuvem (opcional)
- Política de privacidade clara e objetiva

### 4. Notificações Inteligentes
- Alertas de vencimento de contas
- Dicas de economia semanais
- Resumo financeiro semanal e mensal automático

### 5. Configurações
- Moeda (real, dólar, etc.)
- Idioma (português, inglês, espanhol)
- Backup automático

### 6. Diferenciais para Popularização
- Uso offline
- Gratuito com versão PRO (sem anúncios, mais relatórios)
- Sugestões de economia baseadas em perfil de gastos
- Simulador de parcelamentos e juros simples

## Objetivos da experiência do usuário
- **Simplicidade**: Interface limpa e intuitiva que não sobrecarrega o usuário com opções desnecessárias
- **Feedback imediato**: Respostas visuais claras para ações do usuário e atualizações em tempo real
- **Consistência**: Experiência uniforme entre plataformas (web e mobile)
- **Personalização**: Adaptação às preferências e padrões de uso individuais
- **Confiabilidade**: Funcionamento estável mesmo em condições de conectividade limitada
- **Transparência**: Clareza sobre como os dados são usados e protegidos
- **Acessibilidade**: Design inclusivo que atende usuários com diferentes necessidades

## Personas
1. **Maria, 28 anos, Profissional Iniciante**
   - Recém-formada que começou a trabalhar e quer organizar suas finanças
   - Tem pouca experiência com gestão financeira
   - Busca uma ferramenta simples e intuitiva para começar a controlar seus gastos
   - Usa principalmente o smartphone, mas ocasionalmente acessa pelo computador
   - Preocupa-se em economizar para objetivos de médio prazo (viagem, carro)

2. **Carlos, 42 anos, Pai de Família**
   - Gerencia as finanças da família
   - Precisa acompanhar gastos de múltiplas pessoas
   - Busca recursos avançados de categorização e relatórios
   - Alterna frequentemente entre dispositivos (computador no trabalho, tablet em casa)
   - Foco em planejamento financeiro de longo prazo (educação dos filhos, aposentadoria)

3. **Ana, 35 anos, Empreendedora**
   - Precisa separar gastos pessoais e profissionais
   - Busca insights detalhados sobre seus padrões de gastos
   - Valoriza a possibilidade de exportar dados para análises mais complexas
   - Usa múltiplos dispositivos e precisa de sincronização confiável
   - Interesse em visualizações avançadas e projeções financeiras

## Diferencial competitivo
- **Arquitetura técnica robusta**: Base sólida construída com Clean Architecture e DDD, garantindo qualidade e manutenibilidade
- **Experiência multiplataforma consistente**: Mesma experiência de alta qualidade em web e mobile
- **Funcionamento offline confiável**: Capacidade de operar completamente sem conexão à internet
- **Categorização inteligente**: Sistema de aprendizado que melhora a precisão da categorização ao longo do tempo
- **Equilíbrio entre simplicidade e poder**: Interface intuitiva que não sacrifica funcionalidades avançadas
- **Privacidade e segurança por design**: Dados criptografados e controle total do usuário sobre suas informações
- **Insights personalizados**: Análises e recomendações que se adaptam ao comportamento financeiro individual