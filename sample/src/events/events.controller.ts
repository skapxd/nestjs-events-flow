import { Body, Controller, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { Events } from 'nestjs-events-flow';
import { BodyDto } from './dto';
import { EmailSentEvent, UserCreatedEvent } from 'src/types';

@Controller('user')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  /**
   * Creates a new user and emits user.created event
   */
  @Events({
    emit: ['user.created'],
    listen: [],
  })
  @Post()
  createUser(@Body() body: BodyDto) {
    return this.service.createUser(body.username, body.email);
  }

  /**
   * Listens for user.created event and sends a welcome email
   */
  @Events({
    emit: ['email.sent'],
    listen: ['user.created'],
  })
  onUserCreated(payload: UserCreatedEvent) {
    return this.service.onUserCreated(payload);
  }

  /**
   * Listens for email.sent event and logs it
   */
  @Events({
    emit: [],
    listen: ['email.sent'],
  })
  onEmailSent(payload: EmailSentEvent) {
    return this.service.onEmailSent(payload);
  }

  @Events({
    listen: ['**'],
  })
  onAllEvents(payload: unknown) {
    return this.service.onAllEvents(payload);
  }
}
