const amqp = require("amqplib");

async function consume() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "notificacoes_fanout";
  const queue = "fila_email";

  await channel.assertExchange(exchange, "fanout", { durable: false });
  await channel.assertQueue(queue, { durable: false });
  await channel.bindQueue(queue, exchange, ""); // fanout ignora routing key

  console.log("📧 [EMAIL] Aguardando notificações...");

  channel.consume(queue, (msg) => {
    console.log("📧 Email recebido:", msg.content.toString());
    channel.ack(msg);
  });
}

consume().catch(console.error);
