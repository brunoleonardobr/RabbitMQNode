const amqp = require("amqplib");

async function publish() {
  // Conecta ao servidor RabbitMQ
  const conn = await amqp.connect("amqp://localhost");

  // Cria um canal de comunicação
  const channel = await conn.createChannel();

  // Cria o conteúdo da mensagem a ser enviada
  const payload = {
    id: 1,
    mensagem: "Processar algo importante",
  };

  // Publica a mensagem na fila 'main_queue'
  channel.sendToQueue("main_queue", Buffer.from(JSON.stringify(payload)), {
    persistent: true, // salva a mensagem em disco (resiste a reinicialização do RabbitMQ)
    headers: {
      // Cabeçalho personalizado para controlar tentativas de reprocessamento
      "x-attempts": 0, // primeira tentativa (contador começa em 0)
    },
  });

  console.log("✅ Mensagem publicada na main_queue");

  // Fecha o canal e a conexão
  await channel.close();
  await conn.close();
}

// Executa a função e trata possíveis erros
publish().catch(console.error);
