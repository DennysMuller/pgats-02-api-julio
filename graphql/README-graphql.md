# API GraphQL

## Como rodar a API GraphQL

1. Instale as dependências necessárias:
   ```sh
   npm install apollo-server-express@3 express graphql jsonwebtoken dotenv
   ```
2. Copie o arquivo `.env.example` para `.env` e ajuste as variáveis se necessário.
3. Execute a API:
   ```sh
   node graphql/server.js
   ```
4. Acesse o playground GraphQL em: [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Estrutura dos principais arquivos
- `graphql/app.js`: configuração do ApolloServer e Express (sem listen)
- `graphql/server.js`: inicializa o servidor (listen)
- `graphql/schema.js`: definição dos Types, Queries e Mutations
- `graphql/resolvers.js`: implementação dos resolvers
- `graphql/middlewares/auth.js`: middleware para autenticação JWT

## Autenticação
- Para Mutations de Transferências, envie o header:
  ```
  Authorization: Bearer <token>
  ```
- O token é obtido via mutation `login`.

## Exemplo de Query e Mutation
```graphql
# Listar usuários
query {
  users {
    username
    favorecidos
    saldo
  }
}

# Criar transferência (autenticado)
mutation {
  createTransfer(from: "julio", to: "priscila", value: 100) {
    from
    to
    value
    date
  }
}
```

## Observação
- O app.js e server.js da API GraphQL ficam em `graphql/` para facilitar testes com Supertest.
- A API REST permanece funcional, mas agora há suporte a GraphQL.
