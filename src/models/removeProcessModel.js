const database = require("../database/config");

function removerprocessos(dados) {
  const query = `
      INSERT INTO Processlog (name, dtTime, cpu_percent, fkMachine) VALUES (
          '${dados.nomePeocesso}',
          '${dados.dataHoraProcesso}',
          '${dados.percentualCpuProcesso}',
          '${dados.fkMaquina}'
      );
 
`;
  return database.executar(query);
}

module.exports = {
    removerprocessos
};