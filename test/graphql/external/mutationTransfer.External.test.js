// Testes automatizados para a mutation de Transferências na API GraphQL
// Utiliza Mocha, SuperTest e Chai
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const path = require('path');
const fs = require('fs');

describe('GraphQL: Transferências de valores', function () {
  let token;
  const baseUrl = 'http://localhost:4000/graphql';
  
  // Carrega fixture de sucesso uma vez
  const dados = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../fixture/respostas/mutationTransferSucesso.json'),
      'utf8'
    )
  );
  
  before(async function () {
    // Função utilitária para obter token JWT válido
    async function getValidToken() {
      const res = await request(baseUrl)
        .post('')
        .send({
            query:
                    `mutation Mutation($username: String!, $password: String!) {
                        login(username: $username, password: $password) {
                            token
                        }
                    }
                `,
            variables: dados.user
          });
          return res.body.data.login.token;
    }
      token = await getValidToken();
      //console.log('Token:', token);
  });

  it('Deve realizar uma transferência com sucesso', async function () {
    const mutation = `mutation 
      CreateTransfer($from: String!, $to: String!, $value: Int!) {
        createTransfer(from: $from, to: $to, value: $value) {
          from
          to
          value
          date
        }
      }`;

    const res = await request(baseUrl)
      .post('')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        query: mutation, 
        variables: dados.transfer 
      });
    // console.log(res.body);
    expect(res.status).to.equal(200);
    expect(res.body.data.createTransfer.from).to.equal(dados.transfer.from);
    expect(res.body.data.createTransfer.to).to.equal(dados.transfer.to);
    expect(res.body.data.createTransfer.value).to.equal(dados.transfer.value);
    
  });

  it('Deve falhar ao transferir sem saldo disponível', async function () {
    const mutation = `mutation 
      CreateTransfer($from: String!, $to: String!, $value: Int!) {
        createTransfer(from: $from, to: $to, value: $value) {
          from
          to
          value
          date
        }
      }`;
    const res = await request(baseUrl)
      .post('')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        query: mutation, 
        variables: dados.saldoInsuficiente 
      });
   //console.log(res.body);
  expect(res.status).to.equal(200);
  expect(res.body.errors).to.exist;
  // expect(res.body.errors[0].message).to.match(/saldo/i);
  expect(res.body.errors[0].message).to.equal('Saldo insuficiente');
  });

  it('Deve falhar ao transferir sem informar o token de autenticação', async function () {
    const mutation = `mutation 
      CreateTransfer($from: String!, $to: String!, $value: Int!) {
        createTransfer(from: $from, to: $to, value: $value) {
          from
          to
          value
          date
        }
      }`;
    const res = await request(baseUrl)
      .post('')
      .send({ 
        query: mutation,
        variables: dados.transfer 
      });
    // console.log(res.body);
    expect(res.status).to.equal(200);
    expect(res.body.errors[0].message).to.equal('Não autenticado');
  });
});
