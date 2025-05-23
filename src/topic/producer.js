const amqp = require("amqplib");

async function publish() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "eventos_topic";
  await channel.assertExchange(exchange, "topic", { durable: false });

  const mensagens = [
    { key: "cliente.criado", msg: "Novo cliente João" },
    { key: "cliente.atualizado", msg: "Cliente João atualizado" },
    { key: "pedido.entregue", msg: "Pedido #123 entregue" },
    { key: "email.enviado", msg: "Email enviado para João" },
  ];

  mensagens.forEach(({ key, msg }) => {
    channel.publish(exchange, key, Buffer.from(msg));
    console.log(`✅ Publicado: '${msg}' com routing key '${key}'`);
  });

  await channel.close();
  await connection.close();
}

publish().catch(console.error);
