const amqp = require("amqplib");

async function consumeDLQ() {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();

  await channel.assertQueue("dead_letter_queue", { durable: true });

  channel.consume("dead_letter_queue", (msg) => {
    if (!msg) return;

    const content = msg.content.toString();
    const payload = JSON.parse(content);
    const xDeath = msg.properties.headers["x-death"];

    console.log(`☠️ Mensagem na DLQ: ${content}`);
    console.log(
      "🧾 Histórico de falhas (x-death):",
      JSON.stringify(xDeath, null, 2)
    );

    channel.ack(msg);
  });

  console.log("👂 Aguardando mensagens da DLQ...");
}

consumeDLQ().catch(console.error);
