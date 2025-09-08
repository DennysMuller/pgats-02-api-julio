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
    // console.log(resposta.body.data.login.token);
    
    const respostaTransferencia = await request('http://localhost:4000/graphql')
      .post('')
      .set('Authorization', `Bearer ${resposta.body.data.login.token}`)
      .send({
        query: `
          mutation CreateTransfer($from: String!, $to: String!, $value: Int!) {
            createTransfer(from: $from, to: $to, value: $value) {
              date
              from
              to
              value
            }
          }`,
        variables: {
          from: 'julio',
          to: 'priscila',
          value: 15
        }
      });
    // console.log(respostaTransferencia.body);
    expect(respostaTransferencia.status).to.equal(200);
  });
});