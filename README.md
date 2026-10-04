# VOTAÍ SM
### Resultados Eleitorais Oficiais de Santa Maria/RN • Eleições 2026

Uma plataforma full stack moderna, ultraveloz e mobile-first projetada para acompanhar, em tempo real, os resultados oficiais das **Eleições Gerais de 2026** no município de **Santa Maria, Rio Grande do Norte**, utilizando exclusivamente a infraestrutura oficial de dados do **Tribunal Superior Eleitoral (TSE)**.

---

## 🏛️ Identificação do Município Alvo

* **Município:** Santa Maria
* **Unidade Federativa:** Rio Grande do Norte (RN)
* **Código Oficial TSE do Município:** `16241` (5 dígitos)
* **Código IBGE:** `2409335` (7 dígitos) / `240933` (6 dígitos)
* **Zona Eleitoral:** `0008`

A descoberta desses parâmetros foi realizada diretamente a partir do arquivo de configuração oficial de municípios do TSE:
`https://resultados.tse.jus.br/oficial/ele2024/619/config/mun-e000619-cm.json`
Contendo a entrada oficial:
```json
{
  "cd": "16241",
  "cdi": "2409332",
  "nm": "SANTA MARIA",
  "c": "n",
  "z": [ "0008" ]
}
```

---

## 🔍 Como Funciona a Integração com o TSE

O Tribunal Superior Eleitoral disponibiliza os resultados através de uma rede de distribuição (CDN) baseada em arquivos JSON estáticos e atualizados dinamicamente durante a apuração.

### 1. Parâmetros das Eleições 2026 Descobertos
A partir do arquivo mestre de pleitos do TSE (`https://resultados.tse.jus.br/oficial/comum/config/ele-c.json`):
* **Pleito:** `3220` (04/10/2026)
* **Ciclo:** `ele2026`
* **Eleição Ordinária Federal (1º Turno):** Código `6257`
  * Cargo: `1` (Presidente)
* **Eleição Ordinária Estadual (1º Turno):** Código `6259`
  * Cargos: `3` (Governador), `5` (Senador), `6` (Deputado Federal), `7` (Deputado Estadual)

### 2. Estrutura dos Arquivos de Totalização por Município
O padrão oficial de nomenclatura de arquivos de urna e totalização (`tp: "u"`) identificado no TSE é:
```
https://resultados.tse.jus.br/oficial/<ciclo>/<cd_eleicao>/dados/<uf>/<uf><cd_municipio>-c<cargo>-e<eleicao>-u.json
```

Exemplos reais e oficiais testados para Santa Maria/RN:
* **Presidente:** `https://resultados.tse.jus.br/oficial/ele2026/6257/dados/rn/rn16241-c0001-e006257-u.json`
* **Governador:** `https://resultados.tse.jus.br/oficial/ele2026/6259/dados/rn/rn16241-c0003-e006259-u.json`
* **Senador:** `https://resultados.tse.jus.br/oficial/ele2026/6259/dados/rn/rn16241-c0005-e006259-u.json`
* **Deputado Federal:** `https://resultados.tse.jus.br/oficial/ele2026/6259/dados/rn/rn16241-c0006-e006259-u.json`
* **Deputado Estadual:** `https://resultados.tse.jus.br/oficial/ele2026/6259/dados/rn/rn16241-c0007-e006259-u.json`

---

## 🏗️ Arquitetura do Sistema

Para proteger o TSE contra excesso de requisições individuais dos usuários e garantir latência inferior a 50ms para os eleitores, a arquitetura implementa uma camada intermediária:

```
                TRIBUNAL SUPERIOR ELEITORAL (TSE)
                                 │
                   (HTTP Fetch / Timeout 8s)
                                 ▼
                     BACKEND DO VOTAÍ SM
         ┌───────────────────────────────────────┐
         │ • Client HTTP com Headers e Resiliência│
         │ • Cache em Memória com TTL (10s)      │
         │ • Parser e Validação de Schema        │
         │ • Normalizador de Contratos de Dados  │
         │ • Rate Limiting e Headers de Segurança│
         └───────────────────────────────────────┘
                                 │
                 (JSON limpo /api/results/*)
                                 ▼
                    FRONTEND MOBILE-FIRST
         ┌───────────────────────────────────────┐
         │ • Next.js App Router & React 19       │
         │ • Smart Polling (sem piscar a tela)   │
         │ • Microinterações de Números e Votos  │
         │ • Acessibilidade WCAG e Modo Reduzido │
         │ • Heurísticas de Usabilidade Nielsen  │
         └───────────────────────────────────────┘
```

---

## 🚀 Tecnologias Utilizadas

* **Framework Full Stack:** Next.js 15 (App Router, Server Components & Route Handlers)
* **Biblioteca de UI:** React 19 & TypeScript 5
* **Estilização:** Tailwind CSS com sistema de design tokens estrito
* **Ícones:** Google Material Symbols (SVGs inline de alto rendimento)
* **Tipografia:** Inclusive Sans (Interface), DM Serif Display (Títulos), Inter (Números e dados)
* **Testes:** Vitest para testes unitários de parser, cálculos e cache
* **Animações e Acessibilidade:** Suporte nativo a `prefers-reduced-motion`

---

## 🎨 Identidade Visual e Paleta

A paleta de cores foi aplicada com rigor arquitetural:
* **Verde Escuro (`#386641`):** Headers, elementos estruturais e textos de destaque
* **Verde (`#6A994E`):** Ações primárias, abas ativas e botões de interação
* **Verde Claro (`#A7C957`):** Indicadores positivos, barras de progresso e detalhes
* **Creme (`#F2E8CF` / `#FAF7EE`):** Superfícies de fundo e cards neutros
* **Vermelho (`#BC4749`):** Alertas de indisponibilidade e dados negativos

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env.local` baseado no `.env.example`:

```env
# URL base do CDN oficial do TSE
TSE_BASE_URL=https://resultados.tse.jus.br

# Intervalos de polling e cache no backend (em milissegundos)
TSE_POLL_INTERVAL=15000
TSE_CACHE_TTL=10000

# Parâmetros de Santa Maria/RN
TSE_ELECTION_CYCLE=ele2026
TSE_UF=rn
TSE_CITY_CODE=16241
TSE_IBGE_CODE=2409335

# Códigos das Eleições 2026 (1º Turno)
TSE_ELECTION_FEDERAL=6257
TSE_ELECTION_ESTADUAL=6259

# Calangos Marketing
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/calangosmarketing
```

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
* Node.js v18.17+ ou v20+ ou v22+
* npm ou pnpm ou yarn

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000` no seu navegador (ative o modo responsivo em 390px para inspecionar a experiência mobile).

### 3. Executar os Testes Automatizados
```bash
npm test
```

### 4. Build de Produção
```bash
npm run build
npm start
```

---

## 📡 Endpoints da API Interna

* `GET /api/results?office=presidente` - Retorna os dados consolidados do cargo informado
* `GET /api/results/presidente` - Resultados para Presidente em Santa Maria/RN
* `GET /api/results/governador` - Resultados para Governador do RN
* `GET /api/results/senador` - Resultados para Senador
* `GET /api/results/deputado-federal` - Votação para Deputado Federal
* `GET /api/results/deputado-estadual` - Votação para Deputado Estadual
* `GET /api/status` - Status do sistema, saúde do cache e conectividade com o TSE

---

## ⚖️ Transparência e Responsabilidade sobre os Dados

> **IMPORTANTE:**
> Os resultados exibidos pelo **VOTAÍ SM** não são produzidos, calculados ou alterados por esta aplicação. Os dados eleitorais são obtidos a partir das informações públicas e oficiais disponibilizadas pelo **Tribunal Superior Eleitoral (TSE)**.
>
> O **VOTAÍ SM** é uma iniciativa independente e **não possui vínculo oficial com o Tribunal Superior Eleitoral ou a Justiça Eleitoral**.
>
> A fonte oficial definitiva para conferência é: [https://resultados.tse.jus.br/](https://resultados.tse.jus.br/)

---

## 👨‍💻 Desenvolvedor & Créditos

Desenvolvido por **Fábio Gutemberg**, CEO da **Calangos Marketing**.
* Especialista em engenharia de software full stack, produtos mobile-first e visualização de dados.
* Instagram: [Calangos Marketing](https://instagram.com/calangosmarketing)

© 2026 VOTAÍ SM • Resultados Eleitorais de Santa Maria/RN

