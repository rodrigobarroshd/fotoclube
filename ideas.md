# Ideias de Design - Dashboard de Pedidos de Camisas

## Resposta 1: Minimalismo Corporativo Moderno
**Probabilidade: 0.08**

### Design Movement
Minimalismo corporativo com influências de design de sistemas modernos (inspirado em Stripe, Linear, Vercel).

### Core Principles
- Clareza radical: cada elemento tem propósito funcional
- Hierarquia visual através de espaçamento e peso tipográfico
- Foco em dados: informação é o protagonista, não a decoração
- Eficiência cognitiva: reduzir fricção na leitura de status

### Color Philosophy
- Paleta neutra como base: tons de cinza (50-900) para estrutura
- Accent color único: azul profundo (blue-700) para ações e status "em progresso"
- Status colors semânticos: verde para concluído, amarelo para pendente, vermelho para cancelado
- Fundo branco puro com bordas sutis em cinza-100

### Layout Paradigm
- Sidebar esquerda fixa com navegação e filtros
- Grid assimétrico: coluna principal para tabela de pedidos, painel lateral para detalhes
- Uso de cards com bordas mínimas e sombras suaves
- Espaçamento generoso (16px base) para respiração visual

### Signature Elements
1. **Badges de status**: Pills arredondadas com cores semânticas e ícones
2. **Timeline visual**: Linha horizontal mostrando progresso do pedido (recebido → processando → enviado → entregue)
3. **Micro-interactions**: Hover suave em linhas de tabela, transições de 200ms

### Interaction Philosophy
- Cliques revelam detalhes em drawer lateral (não modals)
- Filtros aplicam-se instantaneamente sem botão "aplicar"
- Feedback visual imediato: mudança de cor ao clicar, loading spinners minimalistas

### Animation
- Transições suaves de 200-300ms em todas as mudanças de estado
- Fade-in para novos elementos
- Slide-in do drawer lateral
- Skeleton loaders com pulse suave

### Typography System
- Display: Geist Sans Bold (24px) para títulos principais
- Body: Geist Sans Regular (14px) para conteúdo
- Mono: IBM Plex Mono (12px) para IDs de pedido
- Hierarquia: Bold para status, Regular para detalhes

---

## Resposta 2: Design Artesanal com Textura
**Probabilidade: 0.07**

### Design Movement
Artesanal digital com influências de design editorial e branding premium (inspirado em Notion, Figma, Framer).

### Core Principles
- Humanização através de textura e imperfeição controlada
- Tipografia expressiva como elemento de design
- Profundidade através de layering e sombras dramáticas
- Narrativa visual: cada pedido conta uma história

### Color Philosophy
- Paleta quente e acessível: tons terrosos (marrom, ocre, verde sálvia)
- Fundo com textura sutil: padrão de linho ou papel
- Accent color: laranja quente para ações primárias
- Gradientes suaves para transições entre seções

### Layout Paradigm
- Layout em cascata: cards de pedidos em grid 2-3 colunas com tamanhos variados
- Uso de espaço negativo assimétrico
- Sidebar flutuante com efeito glassmorphism
- Divisores customizados com padrões geométricos

### Signature Elements
1. **Cards com bordas orgânicas**: Uso de border-radius variável
2. **Badges texturizadas**: Com padrão de fundo e sombra interna
3. **Ícones customizados**: Estilo hand-drawn ou ilustrativo

### Interaction Philosophy
- Hover revela informações adicionais com efeito parallax suave
- Cliques abrem modal com animação de scale + fade
- Transições fluidas que sugerem movimento natural

### Animation
- Entrance animations com delay em cascata
- Hover effects com scale e shadow elevation
- Transitions de 400-500ms para sensação de fluidez
- Micro-animations em botões com ripple effect

### Typography System
- Display: Playfair Display Bold (28px) para títulos
- Body: Lato Regular (15px) para conteúdo
- Accent: Montserrat Medium (12px) para labels
- Hierarquia: Tamanho e peso combinados

---

## Resposta 3: Design Utilitário Colorido
**Probabilidade: 0.09**

### Design Movement
Utilitarismo digital com paleta vibrante (inspirado em Figma, Slack, Discord).

### Core Principles
- Funcionalidade extrema: máximo de informação em mínimo espaço
- Cores como ferramenta de categorização e rápida identificação
- Densidade de informação otimizada
- Acessibilidade através de contraste e clareza

### Color Philosophy
- Paleta multi-cor: cada status tem cor distinta e vibrante
- Fundo cinza claro (gray-50) para contraste
- Accent colors: violeta para ações, ciano para filtros, magenta para urgência
- Uso estratégico de cor para agrupar informações relacionadas

### Layout Paradigm
- Tabela densa com linhas alternadas em cinza-50/branco
- Sidebar colapsável com ícones coloridos
- Barra de filtros horizontal com chips removíveis
- Density toggle: usuário escolhe entre "compacto" e "confortável"

### Signature Elements
1. **Ícones coloridos**: Cada tipo de ação tem cor própria
2. **Chips de filtro**: Removíveis, com cores correspondentes ao status
3. **Indicadores de progresso**: Barras horizontais coloridas

### Interaction Philosophy
- Cliques rápidos sem transições longas
- Feedback instantâneo com mudança de cor
- Drag-and-drop para reordenar colunas
- Teclado-first: atalhos para ações comuns

### Animation
- Transições rápidas de 150ms
- Fade-in para novos elementos
- Slide-in para notificações
- Minimal animation para máxima performance

### Typography System
- Display: Inter Bold (22px) para títulos
- Body: Inter Regular (13px) para conteúdo
- Mono: Roboto Mono (11px) para dados estruturados
- Hierarquia: Cor e tamanho combinados

---

## Design Escolhido: **Minimalismo Corporativo Moderno**

Este design foi selecionado por oferecer o melhor equilíbrio entre:
- **Clareza**: Usuários da loja precisam identificar rapidamente o status dos pedidos
- **Profissionalismo**: Transmite confiança e seriedade
- **Eficiência**: Reduz tempo de busca por informações
- **Escalabilidade**: Funciona bem com 10 ou 1000 pedidos
- **Responsividade**: Adapta-se naturalmente a mobile e desktop
