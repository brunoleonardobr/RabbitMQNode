const amqp = require("amqplib");

async function consume() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "notificacoes_fanout";
  const queue = "fila_sms";

  await channel.assertExchange(exchange, "fanout", { durable: false });
  await channel.assertQueue(queue, { durable: false });
  await channel.bindQueue(queue, exchange, "");

  console.log("📱 [SMS] Aguardando notificações...");

  channel.consume(queue, (msg) => {
    console.log("📱 SMS recebido:", msg.content.toString());
    channel.ack(msg);
  });
}

consume().catch(console.error);
