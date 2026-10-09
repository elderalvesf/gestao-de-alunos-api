import request from 'supertest';
import { expect } from 'chai';
import dados from './helpers/dados.js';

describe('Login', () => {
  dados.login.forEach((caso) => {
    it(caso.descricao, async () => {
      const credenciais = caso.usarCredenciaisAdmin
        ? { email: process.env.ADMIN_EMAIL, senha: process.env.ADMIN_SENHA }
        : { email: caso.email, senha: caso.senha };

      const resposta = await request(process.env.BASE_URL)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(credenciais);

      expect(resposta.status).to.equal(caso.statusEsperado);

      if (caso.statusEsperado === 200) {
        expect(resposta.body.token).to.be.a('string').and.not.be.empty;
        expect(resposta.body.usuario.email).to.equal(credenciais.email);
        expect(resposta.body.usuario.role).to.equal(caso.roleEsperada);
      } else {
        expect(resposta.body.error).to.equal(caso.erroEsperado);
      }
    });
  });
});
