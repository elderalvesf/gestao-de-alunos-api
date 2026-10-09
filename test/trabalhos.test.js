import request from 'supertest';
import { expect } from 'chai';
import dados from './helpers/dados.js';
import { obterTokenAdmin, obterTokenAluno } from './helpers/autenticacao.js';
import { montarAluno } from './helpers/geradores.js';

describe('Aluno - Entrega de trabalhos', () => {
  let tokenAdmin;

  before(async () => {
    tokenAdmin = await obterTokenAdmin();
  });

  dados.entregaTrabalho.forEach((caso) => {
    it(caso.descricao, async () => {
      // Admin cadastra o aluno
      const aluno = montarAluno(caso.aluno);
      const cadastro = await request(process.env.BASE_URL)
        .post('/api/admin/alunos')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send(aluno);
      expect(cadastro.status).to.equal(201);
      const alunoId = cadastro.body.id;

      // Admin matricula o aluno na disciplina (pré-requisito para a entrega)
      if (caso.matricularNaDisciplina) {
        const matricula = await request(process.env.BASE_URL)
          .post(`/api/admin/disciplinas/${caso.disciplinaId}/matriculas`)
          .set('Authorization', `Bearer ${tokenAdmin}`)
          .send({ alunoId });
        expect(matricula.status).to.equal(201);
      }

      // Aluno faz login e registra a entrega do trabalho
      const tokenAluno = await obterTokenAluno(aluno.email, aluno.senha);
      const resposta = await request(process.env.BASE_URL)
        .post(`/api/alunos/${alunoId}/trabalhos`)
        .set('Authorization', `Bearer ${tokenAluno}`)
        .set('Content-Type', 'application/json')
        .send({ disciplinaId: caso.disciplinaId, ...caso.trabalho });

      expect(resposta.status).to.equal(caso.statusEsperado);

      if (caso.statusEsperado === 201) {
        expect(resposta.body.id).to.be.a('string');
        expect(resposta.body.alunoId).to.equal(alunoId);
        expect(resposta.body.disciplinaId).to.equal(caso.disciplinaId);
        expect(resposta.body.titulo).to.equal(caso.trabalho.titulo);
        expect(resposta.body.status).to.equal('entregue');
      } else {
        expect(resposta.body.error).to.equal(caso.erroEsperado);
      }
    });
  });
});
