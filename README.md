# Livro dos Monstros

Um catálogo interativo de criaturas para D&D 5ª Edição, com dados da API Open5e.

## Funcionalidades

- **Busca** - Pesquise criaturas por nome
- **Filtros** - Filtre por CR (Challenge Rating), tipo (dragão, besta, etc.) e tamanho (Small, Medium, Large, Huge, Gargantuan)
- **Ordenação** - Organize por nome ou dificuldade (CR)
- **Detalhes completos** - Stat blocks, ações, habilidades especiais e descrições
- **Multi-idioma** - Interface em Português, English e Español
- **Página automatizada** - Deploy via GitHub Pages (`npm run deploy`)

## Stack

- **React 19** - Biblioteca de UI
- **Vite** - Build tool
- **React Router** - Navegação entre páginas
- **Tailwind CSS** - Estilização
- **Open5e API** - Dados das criaturas

## Getting Started

```bash
npm install
npm run dev
```

## Deploy

O deploy é feito automaticamente para GitHub Pages:

```bash
npm run deploy
```

## Estrutura do Projeto

```
src/
├── components/       # Componentes React
├── pages/           # Páginas (HomePage, MonsterPage)
├── services/        # Lógica de API e normalização
├── context/         # Context (idioma)
├── data/            # JSON (traduções, overrides)
└── styles/          # Arquivos CSS
```

## Aprendizados

### 1. API CORS
A API Open5e não tem CORS configurado para requisições direto do browser. Resolvi usando uma approach que não requer proxy - a API permite requests simples.

### 2. Deduplicação de Monstros
A API retorna múltiplas versões da mesma criatura (young, ancient, adult, etc.). Implementei um sistema de deduplicação que:
- Normaliza nomes removendo prefixos como "young", "ancient", "adult"
- Mantém apenas a versão com maior CR

### 3. Traduções
Monster names são traduzidos do inglês via `translations.json`. O sistema busca traduções parciais (ex: "young black dragon" → "Filhote de Dragão Negro").

### 4. Context para Idioma
O `LanguageContext` gerencia a língua da interface sem necessidade de libraries externas como i18n.

## Tecnologias Escolhidas

| Decisão | Rationale |
|---------|-----------|
| React | Componentização natural, curva de aprendizado suave |
| Vite | Build rápido, HMR eficiente |
| Tailwind | Rapid prototyping, consistência visual |
| CSS Modules | Escopo automático de estilos |

## Créditos

- [Open5e](https://open5e.com) - Dados das criaturas
- [D&D 5e SRD](https://dnd5eapi.co) - Referência de dados