const amqp = require("amqplib");

async function publish() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "notificacoes_fanout";
  const message = "📣 Nova campanha de marketing para todos os clientes!";

  // Exchange fanout não precisa de routing key
  await channel.assertExchange(exchange, "fanout", { durable: false });
  channel.publish(exchange, "", Buffer.from(message));

  console.log("✅ Mensagem publicada (fanout):", message);

  await channel.close();
  await connection.close();
}

publish().catch(console.error);
