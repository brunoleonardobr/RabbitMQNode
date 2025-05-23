const amqp = require("amqplib");

async function consume() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "eventos_topic";
  const queue = "fila_tudo";

  await channel.assertExchange(exchange, "topic", { durable: false });
  await channel.assertQueue(queue, { durable: false });

  await channel.bindQueue(queue, exchange, "#"); // escuta tudo

  console.log("👂 [GERAL] Aguardando mensagens...");

  channel.consume(queue, (msg) => {
    console.log("📥 [GERAL] Mensagem:", msg.content.toString());
    channel.ack(msg);
  });
}

consume().catch(console.error);
