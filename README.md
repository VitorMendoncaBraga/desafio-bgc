# Desafio BGC Brasil

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Serverless](https://img.shields.io/badge/Framework-Serverless-orange)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)

**Desafio da empresa BGC Brasil**

[Características](#-características) • [Instalação](#-instalação) • [Documentação](#-documentação)

</div>

---

## 📖 Sobre

Desafio BGC é uma solução Serverless robusta desenvolvida para monitorar e catalogar automaticamente os produtos mais vendidos (Bestsellers) da Amazon Brasil. Construído sobre o ecossistema AWS utilizando Node.js 20 e TypeScript, o projeto combina automação de coleta de dados (web scraping) com uma API REST performática.

O sistema utiliza Puppeteer para extração inteligente de dados e DynamoDB para armazenamento escalável, garantindo acesso rápido aos rankings atualizados de diversas categorias. Projetado com foco em Clean Architecture e princípios de desenvolvimento moderno, a solução oferece uma gama completa de endpoints otimizados: desde a consulta rápida dos "Top 3" líderes de ranking, até a navegação paginada por categorias específicas e uma funcionalidade de busca global por título com suporte a filtragem case-insensitive. Esta arquitetura demonstra eficiência em processamento de dados em nuvem, garantindo respostas rápidas e escalabilidade automática sob demanda.

## ✨ Características

### 🏛️ Arquitetura Serverless
- Deploy otimizado utilizando AWS Lambda, API Gateway e DynamoDB via Serverless Framework.

### 🤖 Web Scrapping Automatizado
- Robô inteligente com Puppeteer que navega e extrai dados de múltiplas categorias da Amazon.

### ⚙️ Alta Performance:
- Armazenamento NoSQL com DynamoDB utilizando Global Secondary Indexes (GSI) para consultas complexas de ranking.

### 🎯 Código Moderno
- Desenvolvido inteiramente em TypeScript, garantindo tipagem estática e segurança no desenvolvimento.

### 📖 API RESTful
- Endpoints claros e documentados com swagger para consumo dos dados coletados.

## 🚀 Instalação

### Requisitos do Sistema

- **Node.js**: 20+ 

- **AWS CLI**: Configurado com credenciais válidas para provisionamento de recursos na nuvem.

- **Serverless Framework**: Global ou via npx para gerenciamento de deploy.

- **Navegador**: O Puppeteer baixará uma instância do Chromium localmente, mas é necessário que o sistema operacional suporte a execução de navegadores headless (geralmente padrão em Windows/Mac).

- **Gerenciador de Pacotes**: npm (nativo do Node) ou yarn.

### Instalação 

```bash
# Clonar repositório
git clone https://github.com/VitorMendoncaBraga/desafio-bgc

# Instalar dependências
npm install

# Configurar credenciais da AWS (caso ainda não possua)
aws configure

# Realizar o deploy da infraestrutura e funções Lambda
npx serverless deploy

# Executar o scraper localmente para popular o banco de dados
npm run scrapper

# Executar os testes unitários (Vitest)
npm run test

```

## 📘 Documentação da API

O sistema oferece dois endpoints principais para consulta de dados, permitindo tanto uma visão rápida dos líderes de venda quanto uma navegação mais profunda pelos produtos catalogados.

### Top 3 (Ranking Rápido)

Retorna os 3 primeiros colocados de uma categoria específica. Ideal para vitrines e destaques.

Endpoint: GET /dev/bestsellers/top3

#### Parâmetros Disponíveis

| Parâmetro  | Tipo   | Padrão | Descrição                                                        |
| ---------- | ------ | ------ | ---------------------------------------------------------------- |
| `category` | string | -      | Obrigatório. Slug da categoria desejada (ex: books, electronics) |

#### Categorias suportadas

Para garantir o sucesso da requisição, utilize os slugs abaixo no parâmetro category:
```
books, fashion, kitchen, home, appliances, electronics, sports, videogames, furniture, pet-products.
```

Exemplo de URL: 
```
https://{api-id}.execute-api.us-east-1.amazonaws.com/dev/bestsellers/top3?category=books
```

No caso, o endpoint oficial é: 
```https://vz8ic0fnl0.execute-api.us-east-1.amazonaws.com/dev/bestsellers/top3?category=books```

#### 📥 Exemplos de requisições

A API exige obrigatoriamente o parâmetro category na URL. Caso ele não seja enviado, a requisição retornará um erro de validação.

✅ **Requisição com Sucesso**
Para buscar os produtos, utilize o parâmetro via Query String:
```
URL: GET /dev/bestsellers?category=books
```
❌ **Requisição com Erro (Parâmetro ausente)**
URL: `GET /dev/bestsellers`

**Resposta (400 Bad Request):**
```json
{
  "error": "Invalid category query"
}
```

#### 📥 Exemplo de resposta

Ao realizar uma chamada para o endpoint, a API retornará um JSON contendo uma lista com os 3 produtos de melhor ranking (1º, 2º e 3º lugares):

```json
{
  "products": [
    {
      "id": "A-Menina-que-Roubava-Livros-books",
      "title": "A Menina que Roubava Livros",
      "price": "R$ 45,90",
      "ranking": 1,
      "category": "books",
      "image": "https://images-amazon.com/...",
      "link": "https://amazon.com.br/...",
      "dataScraping": "2026-01-13T12:00:00Z"
    },
    ...
  ]
}
```

### Lista Paginada (Catálogo Completo)

Lista os produtos de uma categoria em lotes de 10 itens por vez.

Endpoint: GET /dev/bestsellers/{category}

#### Parâmetros Disponíveis

| Parâmetro  | Tipo   | Padrão | Descrição                                                        |
| ---------- | ------ | ------ | ---------------------------------------------------------------- |
| `category` | string | -      | Obrigatório. Slug da categoria desejada (ex: books, electronics) |
| `page`     | number | 1      | Opcional, é o número da página para navegação (10 itens/página)  |

#### Categorias suportadas

Para garantir o sucesso da requisição, utilize os slugs abaixo no parâmetro category:
```
books, fashion, kitchen, home, appliances, electronics, sports, videogames, furniture, pet-products.
```

Exemplo de URL: 
```
https://{api-id}.execute-api.us-east-1.amazonaws.com/dev/bestsellers/books
```

No caso, o endpoint oficial utilizando a categoria 'books' é: 
```https://vz8ic0fnl0.execute-api.us-east-1.amazonaws.com/dev/bestsellers/books```

#### 📥 Exemplos de requisições

A API exige obrigatoriamente o parâmetro category na URL. Caso ele não seja enviado, a requisição retornará um erro de validação.

✅ **Requisição com Sucesso**
Para buscar os produtos, utilize o parâmetro via parâmetro:
```
URL: GET /dev/bestsellers/books
```
Ou de forma paginada:
```
URL: GET /dev/bestsellers/books?page=2
```
❌ **Requisição com Erro (Parâmetro ausente)**
URL: `GET /dev/bestsellers`

**Resposta (400 Bad Request):**
```json
{
  "error": "Error of parameters validation"
}
```

#### 📥 Exemplo de resposta

Ao realizar uma chamada para o endpoint, a API retornará um JSON contendo uma lista com 10 produtos de forma paginada

```json
{
  "products": [
    {
      "id": "A-Menina-que-Roubava-Livros-books",
      "title": "A Menina que Roubava Livros",
      "price": "R$ 45,90",
      "ranking": 1,
      "category": "books",
      "image": "https://images-amazon.com/...",
      "link": "https://amazon.com.br/...",
      "dataScraping": "2026-01-13T12:00:00Z"
    },
    ...
  ]
}
```

### Busca de produtos pelo título

Permite localizar produtos específicos em todo o catálogo utilizando palavras-chave (busca parcial). A busca varre todas as categorias e retorna os resultados de forma paginada.

Endpoint: GET /dev/bestsellers/search

No caso, o endpoint oficial é: 
```https://vz8ic0fnl0.execute-api.us-east-1.amazonaws.com/dev/bestsellers/search?query=a```

#### Parâmetros Disponíveis

| Parâmetro | Tipo   | Padrão | Descrição                                                                                  |
| --------- | ------ | ------ | ------------------------------------------------------------------------------------------ |
| `query`   | string | -      | Obrigatório. Termo de pesquisa a ser encontrado no título do produto (ex: echo, iphone). |
| `page`    | number | 1      | Opcional, é o número da página para navegação (10 itens/página)                            |

#### 📥 Exemplos de requisições

A API exige obrigatoriamente o parâmetro query na URL (Query String).

✅ **Requisição com Sucesso**
Busca simples:
```
URL: GET /dev/bestsellers/search?query=echo
```
Ou de forma paginada:
```
URL: GET /dev/bestsellers/search?query=a&page=2
```
❌ **Requisição com Erro (Parâmetro ausente)**
URL: `GET /dev/bestsellers/search`

**Resposta (400 Bad Request):**
```json
{
  "error": "Query misses on request"
}
```

#### 📥 Exemplo de resposta

Ao realizar uma chamada para o endpoint, a API retornará um JSON contendo uma lista com os produtos encontrados

```json
{
  "products": [
    {
      "image": "https://images-na.ssl-images-amazon.com/images/I/61V5FRUgX8L._AC_UL600_SR600,400_.jpg",
      "ranking": 8,
      "category": "electronics",
      "link": "https://www.amazon.com.br/Echo-Pop-Cor-Preta/dp/B09WXVH7WK/ref=zg_bs_g_electronics_d_sccl_8/143-5496990-5368024?psc=1",
      "price": "R$ 379,00",
      "id": "Echo Pop (Geração mais recente) | Smart speaker compacto com som envolvente e Alexa | Cor Preta-electronics",
      "dataScraping": "2026-01-13T13:02:22.490Z",
      "title": "Echo Pop (Geração mais recente) | Smart speaker compacto com som envolvente e Alexa | Cor Preta"
    },
    ...
  ]
}
```

### Endpoint de documentação 

Documentação dos endpoints utilizando swagger 

Endpoint: GET /dev/docs

Exemplo de URL: 
```
https://{api-id}.execute-api.us-east-1.amazonaws.com/dev/docs
```

No caso, o endpoint oficial é: 
```https://vz8ic0fnl0.execute-api.us-east-1.amazonaws.com/dev/docs```


## 🏗️ Estrutura do Projeto

```
├── src/
│   ├── docs/                    # Documentação com swagger
│   │   └── swagger.json 
│   ├── entities/                # Definições de tipos e interfaces de domínio
│   │   └── product.ts           # Entidade Product e tipos de Categoria
│   ├── functions/               # Pontos de entrada das funções AWS Lambda
│   │   ├── get-all-by-category.ts
│   │   ├── get-docs.ts           
│   │   └── get-top-3.ts           
│   ├── repositories/            # Camada de acesso a dados
│   │   ├── dynamo-db/           # Implementação real (Produção)
│   │   │   └── dynamo-db-product-repository.ts
│   │   ├── in-memory/           # Implementação mockada (Testes)
│   │   │   └── in-memory-product-repository.ts
│   │   └── product-repository.ts # Interface/Contrato do repositório
│   ├── scrapper/                # Automação de coleta de dados
│   │   └── index.ts             # Script Puppeteer (Amazon Scraper)
│   └── use-cases/               # Regras de negócio e testes unitários
│       ├── errors/              # Erros customizados da aplicação
│       ├── fetch-products-by-title.spec.ts
│       ├── fetch-products-by-title.ts
│       ├── get-top-3-bestsellers-by-category.ts
│       ├── get-top-3-bestsellers-by-category.spec.ts
│       ├── get-all-bestsellers-by-category.spec.ts
│       └── get-all-bestsellers-by-category.ts
├── .gitignore                   # Arquivos ignorados pelo Git
├── package-lock.json            # Travamento de versões das dependências
├── package.json                 # Scripts e dependências (Zod, Puppeteer, SDK)
├── README.md                    # Documentação do projeto
├── serverless.yml               # Configuração da Infraestrutura como Código (AWS)
├── tsconfig.json                # Configurações do TypeScript
└── vite.config.ts               # Configuração do Vitest (Suporte a Paths)
```

## 👤 Autor

**Vitor Mendonça**

- GitHub: (https://github.com/VitorMendoncaBraga)
- Email: vmbbraga5@gmail.com
