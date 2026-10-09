import request from 'supertest';
import { expect } from 'chai';
import dados from './helpers/dados.js';
import { obterTokenAdmin } from './helpers/autenticacao.js';
import { montarAluno } from './helpers/geradores.js';

describe('Admin - Cadastro de alunos', () => {
  let tokenAdmin;

  before(async () => {
    tokenAdmin = await obterTokenAdmin();
  });

  dados.cadastroAluno.forEach((caso) => {
    it(caso.descricao, async () => {
      const aluno = montarAluno(caso.aluno);

      const resposta = await request(process.env.BASE_URL)
        .post('/api/admin/alunos')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .set('Content-Type', 'application/json')
        .send(aluno);

      expect(resposta.status).to.equal(caso.statusEsperado);

      if (caso.statusEsperado === 201) {
        expect(resposta.body.id).to.be.a('string');
        expect(resposta.body.nome).to.equal(aluno.nome);
        expect(resposta.body.email).to.equal(aluno.email);
        expect(resposta.body.matricula).to.equal(aluno.matricula);
        expect(resposta.body).to.not.have.property('senha');
      } else {
        expect(resposta.body.error).to.equal(caso.erroEsperado);
      }
    });
  });
});
