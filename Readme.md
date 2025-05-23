## Instalação

- clonar o projeto
- na raiz do projeto rodar o comando npm install (necessário instalar o node)
- rodar o rabbitmq no docker - comando `docker run -d --hostname rabbitmq-host --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`

### Rodar os exemplos

Para rodar cada exemplo utilizar os comandos do node.js na raiz

#### direct

- node src/direct/consumer.js
- node src/direct/producer.js

#### fanout

- node src/fanout/consumer-a.js
- node src/fanout/consumer-b.js
- node src/fanout/producer.js

#### topic

- node src/topic/consumer-clientes.js
- node src/topic/consumer-tudo.js
- node src/topic/producer.js

#### retry

- node src/retry/setup.js
- node src/retry/consumer.js
- node src/retry/producer.js

#### dlq

- node src/retry/setup.js
- node src/retry/consumer.js
- node src/retry/producer.js
- node src/dlq/consumer-dlq.js

#### schedule

- node src/schedule/setup.js
- node src/schedule/consumer.js
- node node src/schedule/producer.js
