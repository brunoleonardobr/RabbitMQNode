const amqp = require("amqplib");

async function consume() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "meu_direct_exchange";
  const queue = "fila_cliente_criado";
  const routingKey = "cliente.criado";

  await channel.assertExchange(exchange, "direct", { durable: false });
  await channel.assertQueue(queue, { durable: false });
  await channel.bindQueue(queue, exchange, routingKey);

  console.log("👂 Aguardando mensagens...");

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const conteudo = msg.content.toString();
      console.log("📥 Mensagem recebida:", conteudo);
      channel.ack(msg);
    }
  });
}

consume().catch(console.error);
