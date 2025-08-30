# Testes GraphQL - Transferências (External)

Este projeto contém testes automatizados para a mutation de transferências da API GraphQL, utilizando Mocha, SuperTest e Chai.

## Estrutura dos Testes

- `test/graphql/external/transferExternal.test.js`: Testes automatizados para a mutation de transferências.
- `test/graphql/fixture/respostas/`: dados prontos e organizados usados para tornar os testes mais eficientes e consistentes.

## Casos de Teste

1. **Transferência com sucesso**
2. **Sem saldo disponível para transferir**
3. **Token de autenticação não informado**

## Pré-requisitos

- Node.js instalado
- Dependências instaladas (`npm install`)
- API GraphQL rodando localmente

## Executando os Testes

```bash
npm test
```

Ou diretamente com Mocha:

```bash
npx mocha test/graphql/external/transferExternal.test.js
```

## Observações

- Os testes dependem de autenticação JWT. Ajuste a função `getValidToken()` conforme a sua implementação de login.
- O arquivo que contém os dados para uso dos testes está em: `test/graphql/fixture/respostas/` para consulta e ajuste quando necessário.

## Pipeline CI (GitHub Actions)

O pipeline executa os testes automaticamente a cada push/pull request.

---

## Sugestão de Testes Adicionais

- Transferência para usuário inexistente
- Valor de transferência inválido (negativo ou zero)
- Token inválido ou expirado

---

Dúvidas? Abra uma issue ou entre em contato com o mantenedor do projeto.
