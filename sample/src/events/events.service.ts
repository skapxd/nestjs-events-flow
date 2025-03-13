import { Injectable, Logger } from '@nestjs/common';
import { EventsFlowService } from 'nestjs-events-flow';
import { UserCreatedEvent, EmailSentEvent } from 'src/types';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  // Usar EventsFlowService para obtener autocompletado
  constructor(private readonly eventsFlow: EventsFlowService) {}

  createUser(username: string, email: string): number {
    // Simulating user creation
    const userId = Math.floor(Math.random() * 1000);

    // Emit an event after user is created
    const eventPayload: UserCreatedEvent = {
      id: userId,
      email,
      username,
    };

    // Emit the event - ahora con autocompletado
    this.eventsFlow.emit('user.created', eventPayload);

    return userId;
  }

  async onUserCreated(payload: UserCreatedEvent): Promise<void> {
    console.log(`New user created: ${payload.username} (${payload.email})`);
    console.log('Sending welcome email...');

    // Simulate sending an email
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Emit email sent event - ahora con autocompletado
    const emailEvent: EmailSentEvent = {
      email: payload.email,
      template: 'welcome',
      success: true,
    };

    // Si necesitas esperar las respuestas del evento, usa emitAsync
    // await this.eventsFlow.emitAsync('email.sent', emailEvent);

    // Para emisión normal (no necesita esperar las respuestas)
    this.eventsFlow.emit('email.sent', emailEvent);
  }

  onEmailSent(payload: EmailSentEvent): void {
    console.log(
      `Email sent to ${payload.email} using template: ${payload.template}`,
    );
    console.log(
      `Email delivery status: ${payload.success ? 'SUCCESS' : 'FAILED'}`,
    );
  }

  onAllEvents(payload: unknown) {
    this.logger.log(payload);
  }

  // Método para demostrar acceso al emitter nativo si es necesario
  useNativeEmitter() {
    // Puedes acceder al EventEmitter2 nativo si lo necesitas
    const nativeEmitter = this.eventsFlow.nativeEmitter;
    // ...hacer algo con el emitter nativo
  }
}
