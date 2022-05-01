import { Controller, Get } from '@nestjs/common';
import { SuscriberService } from './suscriber.service';

@Controller('suscriber')
export class SuscriberController {
  constructor(private readonly suscriberService: SuscriberService) {}
  @Get()
  receiveMessageTopic() {
    this.suscriberService.listenMessageTopic();
  }
}
