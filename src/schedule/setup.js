const amqp = require("amqplib");

async function setup() {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();

  // Fila final: destino real das mensagens
  await channel.assertQueue("fila_final", { durable: true });

  // Fila agendada: recebe mensagens com TTL e redireciona após o tempo
  await channel.assertQueue("fila_agendada", {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": "", // usa exchange padrão
      "x-dead-letter-routing-key": "fila_final", // redireciona para fila_final
      "x-message-ttl": 10000, // 10 segundos de atraso (agendamento)
    },
  });

  console.log("✅ Fila agendada configurada.");
  await channel.close();
  await conn.close();
}

setup().catch(console.error);
