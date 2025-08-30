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

## Testes Automatizados

Os testes automatizados para a mutation de transferências GraphQL estão em:

- `test/graphql/external/mutationTransfer.External.test.js`

### Casos de Teste
1. Transferência realizada com sucesso
2. Falha ao transferir sem saldo disponível
3. Falha ao transferir para usuário remetente ou destinatário não encontrado
4. Falha ao transferir sem informar o token de autenticação
5. Falha ao passar credenciais inválidas

#### Como executar os testes

```sh
npm test
# ou
npx mocha test/graphql/external/mutationTransfer.External.test.js
```
