const request  = require("supertest");
const { expect } = require("chai");
//const { query } = require("express");

describe.only("Testes de Transferência", () => {
  it('Validar que é possível transferir grana entre duas contas', async () => {
    const resposta = await request('http://localhost:4000/graphql')
      .post('')
      .send({
        query: `
          mutation Mutation($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              token
            }
          }`,
        variables: {
          username: 'julio',
          password: '123456'
        }
      });
    console.log(resposta.body.data.login.token);
    expect(resposta.status).to.equal(200);
  });
});