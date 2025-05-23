const amqp = require("amqplib");

async function consume() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "eventos_topic";
  const queue = "fila_clientes";

  await channel.assertExchange(exchange, "topic", { durable: false });
  await channel.assertQueue(queue, { durable: false });

  await channel.bindQueue(queue, exchange, "cliente.*"); // escuta cliente.criado, cliente.atualizado

  console.log("👂 [CLIENTES] Aguardando mensagens...");

  channel.consume(queue, (msg) => {
    console.log("📥 [CLIENTES] Mensagem:", msg.content.toString());
    channel.ack(msg);
  });
}

consume().catch(console.error);
