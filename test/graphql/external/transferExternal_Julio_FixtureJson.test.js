const request  = require("supertest");
const { expect, use } = require("chai");
const chaiExclude = require('chai-exclude');
require('dotenv').config();
use(chaiExclude);


  // Aula 8 sábado 1ª aula, para fins didáticos conforme passsos do vídeo a partir 2:15:00.
  // 2:16:16 explicação sobre criar as fixture de json para as mutation de login
  // Para não alterar esse arquivo continuaremos no arquivo: transferExternal_Julio_FixtureJson.test.js

describe("Testes de Transferência, criado pelo Júlio de Lima, melhoria do transferExternal_Julio.test.js. Uso de Fixture", () => {
  // 2:32:30 detalhes quanto ao uso do beforeEach e before
  /**
      	        Frequência de Execução	                      Caso de Uso Principal
  before	      Uma vez por describe, antes de todos os it.	  Setup custoso e reutilizável (ex: login, conexão com DB).
  beforeEach	  Antes de cada it dentro do describe.	        Isolar testes, garantindo um estado inicial limpo para cada um 
                                                                (ex: resetar dados).
  Como o login e senha fora definido/construído (userController.js) para expirar após 1 h e os testes levam 288 milisegundos
  não teremos problemas
  Removemos o beforeEach nesse contexto
  Continuar na aula 9
   */
  before(async () => {
      const loginUser = require('../fixture/requisicoes/login/loginUser.json')
      const resposta = await request(process.env.BASE_URL_GRAPHQL)
        .post('')
        .send(loginUser);
      tokens = resposta.body.data.login.token;
      // console.log(resposta.body.data.login.token);
    });
/**
        A partir dos 0:13:36 levantou-0se a possibilidade de usar o beforeEach para não ter que duplicar a 
    constante: const createTransfer = require('../fixture/requisicoes/transferencia/createTransfer.json'), pois se ficar no escorpo anterior ao describe
    qualquer manipulação que fizer no createTransfer poderá quebrar alguns dos testes subsequentes.
        Ocorre a mesma situação se for o before.
        Solução: beforeEach para ser executado antes de cada "it"
        Não utilizar const, pois não será utilizado em nenhum momento, a não ser dentro do beforEach.
    beforeEach(() => {
      createTransfer = require('../fixture/requisicoes/transferencia/createTransfer.json')
    });

      A partir dos 0:34:35 fora falao a respeito da pasta .env para colocarmos num arquvivo a url do servidor

      A partir dos 0:37:44 fora comentado a respeito do teste: 'Validar que é possível transferir grana entre duas contas' validar apenas o status code.
 */  
    it('Validar que é possível transferir grana entre duas contas', async () => {
      const createTransfer = require('../fixture/requisicoes/transferencia/createTransfer.json')
      const respostaEsperada = require('../fixture/respostas/transferencia/validarQueEPossivelTransferirGranaEntreDuasContas.json')
      const respostaTrasnsferencia = await request(process.env.BASE_URL_GRAPHQL)
        .post('')
        .set('Authorization', `Bearer ${tokens}`)
        .send(createTransfer);
      // console.log(respostaTrasnsferencia.body);
      expect(respostaTrasnsferencia.status).to.equal(200);
      // A parti dos 0:44:30 fala-se de usar o delete para evitar o erro abaixo:
      /** 
         AssertionError: expected { data: { createTransfer: { …(4) } } } to deeply equal { data: { createTransfer: { …(4) } } }
          + expected - actual

          {
            "data": {
              "createTransfer": {
          -      "date": "2025-09-10T23:23:58.522Z" date no momento da geração do teste
          +      "date": "2025-09-10T23:15:32.870Z" date do arquivo
                "from": "julio"
                "to": "priscila"
                "value": 15
              }
      */
      // Usar a biblioteca: chai-exclude usa a v 2.1.1 pq a v do chai é 4.5.0, -D para instalar nas dependências de desenvolvimento
      // npm i chai-exclude@2.1.1 -D
      // expect(respostaTrasnsferencia.body).to.eql(respostaEsperada);
      expect(respostaTrasnsferencia.body.data.createTransfer)
        .excluding('date')
        .to.deep.equal(respostaEsperada.data.createTransfer);
    
    });

    it('Validar que não é possível transferir de uma conta que não possui saldo suficiente', async () => {
      const createTransfer = require('../fixture/requisicoes/transferencia/createTransfer.json')
      // 0:6:10 o arquivo: createTransfer.json tem value = 15, para transferir um valor alto iremos manipular
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
  });