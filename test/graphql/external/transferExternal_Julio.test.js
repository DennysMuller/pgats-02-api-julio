const request  = require("supertest");
const { expect } = require("chai");
require('dotenv').config();

// Aula 7 sexta-feira

describe("Testes de Transferência, criado pelo Júlio de Lima", () => {
  it('Validar que é possível transferir grana entre duas contas', async () => {
    const resposta = await request(process.env.BASE_URL_GRAPHQL)
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
    
    const respostaTransferencia = await request(process.env.BASE_URL_GRAPHQL)
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

  
  // Aula 8 sábado 1ª aula, fins didáticos conforme passsos do vídeo. Não alterei a estrutura das pastas de testes como no vídeo a 1:53:57
  // 1:58:00, movido de test\external para test\graphql\external e renomeado o arquivo de transferExternalGraphQL_Julio.test.js para transferExternal_Julio.test.js
  // 2:02:35 ajustado o package.json 
  // Era "test-external"          "test-rest-external"
  // Era "test-controller"        "test-rest-controller"
  // Era "test-external-graphql"  "test-graphql-external":
  // Não existia                  "test-graphql-controller"
  // Era start                    "start-rest"
  // 2:16:16 explicação sobre criar as fixture de json para as mutation de login
  // Para não alterar esse arquivo continuaremos no arquivo: transferExternal_Julio_FixtureJson.test.js

  beforeEach(async () => { 
    const resposta = await request(process.env.BASE_URL_GRAPHQL)
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
    tokens = resposta.body.data.login.token;
    // console.log(resposta.body.data.login.token);
  });

  it('Validar que não é possível transferir de uma conta que não possui saldo suficiente', async () => {

    const respostaTrasnsferencia = await request(process.env.BASE_URL_GRAPHQL)
      .post('')
      .set('Authorization', `Bearer ${tokens}`)
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
          value: 10001
        }
      });
    // console.log(respostaConsulta.body);
    expect(respostaTrasnsferencia.status).to.equal(200);
    expect(respostaTrasnsferencia.body.errors[0].message).to.equal('Saldo insuficiente');
  
  });

});