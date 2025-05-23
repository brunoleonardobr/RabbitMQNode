const amqp = require("amqplib");

async function setup() {
  // Conecta ao RabbitMQ
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  // 🟥 1. Cria a Dead Letter Queue (DLQ)
  // Aqui irão parar as mensagens que falharam várias vezes no processamento
  await channel.assertQueue("dead_letter_queue", { durable: true });

  // 🟨 2. Cria a fila de Retry
  // Essa fila é usada para reprocessar mensagens com atraso (delay)
  await channel.assertQueue("retry_queue", {
    durable: true,
    arguments: {
      // Quando a mensagem expirar (TTL), ela será enviada de volta para a fila principal
      "x-dead-letter-exchange": "", // default exchange
      "x-dead-letter-routing-key": "main_queue", // volta para a fila principal
      "x-message-ttl": 5000, // tempo de vida da mensagem na retry_queue (5 segundos)
    },
  });

  // 🟩 3. Cria a fila principal
  // Essa fila é onde as mensagens são inicialmente processadas
  // Se falhar, vão para a retry_queue automaticamente
  await channel.assertQueue("main_queue", {
    durable: true,
    arguments: {
      // Se der erro, envie a mensagem para a retry_queue
      "x-dead-letter-exchange": "", // default exchange
      "x-dead-letter-routing-key": "dead_letter_queue",
    },
  });

  console.log("✅ Filas configuradas.");

  // Encerra canal e conexão
  await channel.close();
  await connection.close();
}

setup().catch(console.error);
