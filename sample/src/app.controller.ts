import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { EventsService } from './events/events.service';
import { OnEvent, EventsFlowService } from 'nestjs-events-flow';
import { UserCreatedEvent, EmailSentEvent } from './types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventsService: EventsService,
    private readonly eventsFlowService: EventsFlowService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Ejemplo usando EventsFlowService para emitir eventos con autocompletado
   */
  @Post('users')
  createUser(@Body() createUserDto: { username: string; email: string }): {
    userId: number;
  } {
    // Usamos el servicio que ya tiene la lógica
    const userId = this.eventsService.createUser(
      createUserDto.username,
      createUserDto.email,
    );

    // O podemos emitir eventos directamente con autocompletado
    // this.eventsFlowService.emit('user.created', {...});

    return { userId };
  }
  
  /**
   * Ejemplo usando el decorador OnEvent con autocompletado
   */
  @OnEvent('user.created')
  handleUserCreated(payload: UserCreatedEvent) {
    console.log(`[AppController] Detectado nuevo usuario: ${payload.username}`);
  }
}