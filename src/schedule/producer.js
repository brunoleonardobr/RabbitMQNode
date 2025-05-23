const amqp = require("amqplib");

async function publishAgendado() {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();

  const payload = {
    id: 42,
    mensagem: "Esta mensagem será processada daqui a 10 segundos",
  };

  // Envia para a fila agendada
  channel.sendToQueue("fila_agendada", Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });

  console.log("⏳ Mensagem agendada para daqui a 10 segundos.");
  await channel.close();
  await conn.close();
}

publishAgendado().catch(console.error);
