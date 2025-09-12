const request  = require("supertest");
const { expect, use } = require("chai");
const chaiExclude = require('chai-exclude');
require('dotenv').config();
use(chaiExclude);


  // Aula 9 do vídeo a partir 3:23:15.

describe("Testes de Transferência, criado pelo Júlio de Lima, validar os erros na regra de negócio", () => {
  before(async () => {
      const loginUser = require('../fixture/requisicoes/login/loginUser.json')
      const resposta = await request(process.env.BASE_URL_GRAPHQL)
        .post('')
        .send(loginUser);
      tokens = resposta.body.data.login.token;
      // console.log(resposta.body.data.login.token);
    });
  
    /**
      Tenho que testar os erros da regra de negócio que está no service\transferService.js
        if (!sender || !recipient) throw new Error('Usuário remetente ou destinatário não encontrado'); // testarei para from e to
        if (sender.saldo < value) throw new Error('Saldo insuficiente');
      
      Teria que repetir três vezes o it
        it('Validar que não é possível transferir de uma conta que não possui saldo suficiente', async () => {
            const createTransfer = require('../fixture/requisicoes/transferencia/createTransfer.json')
            createTransfer.variables.value = 10001;
            const respostaTrasnsferencia = await request(process.env.BASE_URL_GRAPHQL)
              .post('')
              .set('Authorization', `Bearer ${tokens}`)
              .send(createTransfer);
            // console.log(respostaTrasnsferencia.body);
            // console.log(createTransfer);
            expect(respostaTrasnsferencia.status).to.equal(200);
            expect(respostaTrasnsferencia.body.errors[0].message).to.equal('Saldo insuficiente');
          });

    */

    const testeDeErrosDeNegocio = [
      {
        nomeDoTeste: 'Saldo insuficiente',
        createTransfer: {
          from: 'julio',
          to: 'priscila',
          value: 10001
        },
        mensagemEsperada: 'Saldo insuficiente'
      },
      {
        nomeDoTeste: 'Remetente não encontrado',
        createTransfer: {
          from: 'pedro',
          to: 'priscila',
          value: 15
        },
        mensagemEsperada: 'Usuário remetente ou destinatário não encontrado'
      },
      {
        nomeDoTeste: 'Destinatário não encontrado',
        createTransfer: {
          from: 'julio',
          to: 'karla',
          value: 15
        },
        mensagemEsperada: 'Usuário remetente ou destinatário não encontrado'
      }
    ];
    
    testeDeErrosDeNegocio.forEach(teste => {    
        it(`Testando a regra de negócio: ${teste.nomeDoTeste}`, async () => {
          const createTransferFixture = require('../fixture/requisicoes/transferencia/createTransfer.json')
          const respostaTrasnsferencia = await request(process.env.BASE_URL_GRAPHQL)
            .post('')
            .set('Authorization', `Bearer ${tokens}`)
            .send({
                    query: createTransferFixture.query,
                    variables: teste.createTransfer
            });
          // console.log(respostaTrasnsferencia.body);
          // console.log(createTransferFixture.query);
          // console.log(teste.createTransfer);
          // console.log(teste.mensagemEsperada);
          expect(respostaTrasnsferencia.status).to.equal(200);
          expect(respostaTrasnsferencia.body.errors[0].message).to.equal(teste.mensagemEsperada);
        
        });
      });
  });