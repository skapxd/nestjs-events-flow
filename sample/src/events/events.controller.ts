import { Body, Controller, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { Events } from 'nestjs-events-flow';
import { BodyDto } from './dto';
import type { EmailSentEvent, UserCreatedEvent } from '../types';

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
   * Usando el decorador OnEvent con autocompletado
   */
  @Events({ listen: ['email.sent'] })
  onEmailSent(payload: EmailSentEvent) {
    return this.service.onEmailSent(payload);
  }

  /**
   * Ejemplo de uso del decorador OnEvent con el comodín global
   */
  @Events({ listen: ['**'] })
  onAllEvents(payload: unknown) {
    return this.service.onAllEvents(payload);
  }

  /**
   * Método adicional para demostrar el comodín para eventos de email
   */
  @Events({ listen: ['email.*'] })
  onAllEmailEvents(payload: unknown) {
    console.log('Se detectó un evento relacionado con email:', payload);
  }
}
