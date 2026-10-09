import request from 'supertest';

async function realizarLogin(email, senha) {
  const resposta = await request(process.env.BASE_URL)
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send({ email, senha });

  if (resposta.status !== 200) {
    throw new Error(`Falha no login de "${email}": ${resposta.status} ${JSON.stringify(resposta.body)}`);
  }

  return resposta.body.token;
}

export async function obterTokenAdmin() {
  return realizarLogin(process.env.ADMIN_EMAIL, process.env.ADMIN_SENHA);
}

export async function obterTokenAluno(email, senha) {
  return realizarLogin(email, senha);
}
