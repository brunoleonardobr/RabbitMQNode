const amqp = require("amqplib");
const { randomUUID } = require("crypto");

async function publish() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "meu_direct_exchange";
  const routingKey = "cliente.criado";

  // Gera um ID aleatório para o cliente
  const clienteId = randomUUID();
  const message = JSON.stringify({ id: clienteId, nome: "João da Silva" });

  await channel.assertExchange(exchange, "direct", { durable: false });
  channel.publish(exchange, routingKey, Buffer.from(message), {
    persistent: true,
  });

  console.log("✅ Mensagem publicada:", message);

  await channel.close();
  await connection.close();
}

publish().catch(console.error);
