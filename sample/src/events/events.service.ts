import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent, EmailSentEvent } from 'src/types';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  createUser(username: string, email: string): number {
    // Simulating user creation
    const userId = Math.floor(Math.random() * 1000);

    // Emit an event after user is created
    const eventPayload: UserCreatedEvent = {
      id: userId,
      email,
      username,
    };

    // Emit the event
    this.eventEmitter.emit('user.created', eventPayload);

    return userId;
  }

  async onUserCreated(payload: UserCreatedEvent): Promise<void> {
    console.log(`New user created: ${payload.username} (${payload.email})`);
    console.log('Sending welcome email...');

    // Simulate sending an email
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Emit email sent event
    const emailEvent: EmailSentEvent = {
      email: payload.email,
      template: 'welcome',
      success: true,
    };

    this.eventEmitter.emit('email.sent', emailEvent);
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
}
