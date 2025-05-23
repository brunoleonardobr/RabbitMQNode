const amqp = require("amqplib");

async function consume() {
  // Conecta ao servidor RabbitMQ
  const conn = await amqp.connect("amqp://localhost");

  // Cria um canal de comunicação
  const channel = await conn.createChannel();

  // Inicia o consumo da fila 'main_queue'
  channel.consume("main_queue", (msg) => {
    if (!msg) return; // Proteção contra mensagens nulas

    // Converte o conteúdo da mensagem para string e depois para JSON
    const content = msg.content.toString();
    const originalPayload = JSON.parse(content);

    // Recupera o número de tentativas anteriores (vem no header personalizado 'x-attempts')
    const attempts = msg.properties.headers["x-attempts"] || 0;

    console.log(`🔁 Tentativa ${attempts + 1} de processar: ${content}`);

    // Se já tentou 3 vezes, envia a mensagem para a Dead Letter Queue
    if (attempts >= 3) {
      console.log(`❌ Enviando para DLQ: ${originalPayload.id}`);

      // Rejeita a mensagem → RabbitMQ envia para DLQ (definida em x-dead-letter-routing-key)
      // Isso ativa o header x-death automaticamente
      channel.reject(msg, false);
      return;
    }

    // Simula erro: sistema indisponível
    const erro = "Sistema indisponível";

    console.log(`⚠️ Erro simulado: ${erro}`);
    console.log(
      "↩️ Reenfileirando para retry_queue com erro e tentativas atualizadas"
    );

    // Cria novo payload com erro incluso (para facilitar diagnóstico)
    const newPayload = {
      ...originalPayload,
      erro,
      tentativa: attempts + 1,
    };

    // Envia a mesma mensagem para a fila de retry com o contador de tentativas incrementado
    channel.sendToQueue(
      "retry_queue",
      Buffer.from(JSON.stringify(newPayload)),
      {
        persistent: true,
        headers: {
          "x-attempts": attempts + 1, // incrementa a tentativa
        },
      }
    );

    // Marca a mensagem atual como processada
    channel.ack(msg);
  });

  console.log("👂 Aguardando mensagens...");
}

// Trata erros da função async principal
consume().catch(console.error);
