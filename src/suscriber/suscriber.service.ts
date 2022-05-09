/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSub } from '@google-cloud/pubsub';
import { LoggerService } from '../logger/logger.service';
import { uuid as v4 } from 'uuidv4';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class SuscriberService {
  private client: PubSub;
  private subscription: string;
  private timeout: number;
  private firestore: Firestore;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    const buffer: Buffer = Buffer.from(
      this.configService.get<string>('pubsub.subscriberB64'),
      'base64',
    );

    const credentialDecoded: string = buffer ? buffer.toString() : null;
    const credentialJson: any = JSON.parse(credentialDecoded);

    this.client = new PubSub({
      projectId: configService.get<string>('pubsub.projectId'),
      credentials: credentialJson,
    });

    this.subscription = configService.get<string>('pubsub.subscriptionName');
    this.timeout = parseInt(configService.get<string>('timeout'));

    this.firestore = new Firestore({
      projectId: configService.get<string>('pubsub.projectId'),
      credentials: credentialJson,
    });
  }

  postDataToFirestore = async (sku, data) => {

    const docRef  = this.firestore.doc(
      `alonso-entrenamiento/${sku}`,
    );

    this.firestore.getAll(docRef)
     .then(res => JSON.stringify(res))
     .then( async (json) => {
      const jsonParsed = JSON.parse(json)
      const isCreated = jsonParsed[0]['_createTime'] ? true : false;
      try {
        if (isCreated) {
          console.log("update")
          await docRef.update({
            body:data,
          })
        } else {
          console.log("create")
          await docRef.set({
            body: data,
          });
        }
      } catch (err) {
        throw err;
      }
      
      })
     


  }

  listenMessageTopic = () => {
    // References an existing subscription
    const subscription: any = this.client.subscription(this.subscription);

    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = (message): void => {
      console.log(`Received message ${message.id}:`);
      const messageData = JSON.parse(message.data.toString())
      const messageSku = messageData.productDetail.sku
      console.log(`\tSKU: ${messageSku}`);
      console.log(messageData);
      this.postDataToFirestore(messageSku, messageData);
      messageCount += 1;

      message.ack();
    };

    /* this.postDataToFirestore() */
    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);

    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${messageCount} message(s) received.`);
    }, 60 * 1000 * this.timeout);
  };
}
