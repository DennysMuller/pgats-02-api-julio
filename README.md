# API de Transferências e Usuários

Esta API permite o registro, login, consulta de usuários e transferências de valores entre usuários. O objetivo é servir de base para estudos de testes e automação de APIs.


# API GraphQL

Além da API REST, este projeto expõe os mesmos serviços via GraphQL usando ApolloServer.

## Como rodar a API GraphQL

1. Instale as dependências necessárias:
   ```sh
   npm install apollo-server-express@3 express graphql jsonwebtoken dotenv
   ```
2. Copie o arquivo `.env.example` de `graphql/` para `.env` e ajuste as variáveis se necessário.
3. Execute a API do GraphQL:
   ```sh
   node graphql/server.js
   ```   
   ```sh
   npm run start-graphql
   ```

4. Acesse o playground GraphQL em: [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Estrutura dos principais arquivos GraphQL
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

---

## Testes Automatizados GraphQL

Os testes automatizados para a mutation de transferências GraphQL estão em:

- `test/graphql/external/transferExternal.test.js`

### Casos de Teste
1. Transferência com sucesso
2. Sem saldo disponível para transferir
3. Token de autenticação não informado

#### Como executar os testes

```sh
npm test
# ou
npx mocha test/graphql/external/transferExternal.test.js
```

As respostas dos testes são salvas em `test/graphql/fixture/respostas/`.

#### Pipeline CI
O pipeline de integração contínua executa os testes automaticamente a cada push/pull request (ver `.github/workflows/ci-graphql.yml`).

#### Testes adicionais sugeridos
- Transferência para usuário inexistente
- Valor de transferência inválido
- Token inválido ou expirado

---

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

## Tecnologias
- Node.js
- Express
- Swagger (documentação)
- Banco de dados em memória (variáveis)


## Instalação

1. Clone o repositório:
   ```sh
   git clone <repo-url>
   cd pgats-02-api
   ```

2. Instale as dependências:
  ```sh
  npm install express swagger-ui-express bcryptjs
  ```

### Relatórios de Testes com Mochawesome

Para gerar relatórios de testes em formato HTML e JSON, instale o pacote [mochawesome](https://github.com/adamgruber/mochawesome) como dependência de desenvolvimento:

```sh
npm install -D mochawesome
```

O `mochawesome` é um repórter para o framework de testes Mocha, que permite criar relatórios visuais e detalhados dos testes automatizados. Após instalar, você pode rodar seus testes com o seguinte comando para gerar o relatório:

```sh
mocha --reporter mochawesome
```

O relatório será gerado na pasta `mochawesome-report` do projeto.

## Como rodar

- Para iniciar o servidor:
  ```sh
  node server.js
  ```
- A API estará disponível em `http://localhost:3000`
- A documentação Swagger estará em `http://localhost:3000/api-docs`

## Endpoints principais

### Registro de usuário
- `POST /users/register`
  - Body: `{ "username": "string", "password": "string", "favorecidos": ["string"] }`

### Login
- `POST /users/login`
  - Body: `{ "username": "string", "password": "string" }`

### Listar usuários
- `GET /users`

### Transferências
- `POST /transfers`
  - Body: `{ "from": "string", "to": "string", "value": number }`
- `GET /transfers`

## Regras de negócio
- Não é permitido registrar usuários duplicados.
- Login exige usuário e senha.
- Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos.
- O saldo inicial de cada usuário é de R$ 10.000,00.

## Testes

O projeto possui testes automatizados para os principais endpoints, localizados na pasta `test/`. Os testes utilizam Mocha, Chai, Supertest e Sinon para mocks.

- Para rodar todos os testes:
  ```sh
  npm test
  ```

- Para rodar os testes e gerar um relatório visual com o Mochawesome:
  ```sh
  npx mocha --reporter mochawesome
  ```

- O relatório será gerado na pasta `mochawesome-report` em formato HTML e JSON.

### Estrutura dos testes

- `test/controller/`: Testes dos controllers, incluindo mocks das funções de serviço.
- `test/external/`: Testes de integração com serviços externos.
- `test/fixture/`: Dados de exemplo para os testes.

### Exemplo de teste mockando o service

No arquivo `test/controller/userController.test.js`, o método `listUsers` do service é mockado para garantir isolamento dos testes de API.

---

---

Para dúvidas, consulte a documentação Swagger ou o código-fonte.
