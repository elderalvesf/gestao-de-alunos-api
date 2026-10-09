// Gera um sufixo único para que os dados cadastrados não colidam entre execuções,
// já que o MongoDB persiste os registros (e-mail e matrícula são únicos).
export function gerarSufixoUnico() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export function montarAluno({ nome, emailBase, senha }) {
  const sufixo = gerarSufixoUnico();
  const aluno = { nome, matricula: sufixo, senha };
  if (emailBase !== undefined) aluno.email = `${emailBase}.${sufixo}@example.com`;
  return aluno;
}
