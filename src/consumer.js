require("dotenv").config();

const amqp = require("amqplib");
const PlayistsService = require("./PlaylistsService");
const MailSender = require("./MailSender");
const Listener = require("./Listener");


const init = async () => {
  const playistsService = new PlayistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playistsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue("export:playlists", {
    durable: true,
  });

  channel.consume("export:playlists", listener.eventListener, { noAck: true });
};

init();
