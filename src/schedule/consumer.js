const amqp = require("amqplib");

async function consumeFinal() {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();

  await channel.assertQueue("fila_final", { durable: true });

  channel.consume("fila_final", (msg) => {
    if (!msg) return;

    const content = msg.content.toString();
    console.log("⏰ Mensagem recebida após agendamento:", content);
    channel.ack(msg);
  });

  console.log("👂 Aguardando mensagens na fila final...");
}

consumeFinal().catch(console.error);
