import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSub } from '@google-cloud/pubsub';
import { LoggerService } from '../logger/logger.service';
import { uuid as v4 } from 'uuidv4';

@Injectable()
export class SuscriberService {
  private client: PubSub;
  private subscription: string;
  private timeout: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    const buffer = Buffer.from(
      this.configService.get<string>('pubsub.subscriberB64'),
      'base64',
    );

    const credentialDecoded = buffer ? buffer.toString() : null;
    const credentialJson = JSON.parse(credentialDecoded);

    this.client = new PubSub({
      projectId: configService.get<string>('pubsub.projectId'),
      credentials: credentialJson,
    });

    this.subscription = configService.get<string>('pubsub.subscriptionName');

    this.timeout = parseInt(configService.get<string>('timeout'));
  }

  listenMessageTopic = () => {
    // References an existing subscription
    const subscription = this.client.subscription(this.subscription);

    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = (message) => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);
      messageCount += 1;

      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);

    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${messageCount} message(s) received.`);
    }, 60 * 1000 * this.timeout);
  };
}
