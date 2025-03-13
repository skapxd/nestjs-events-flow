import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsFlowGlobalModule } from 'nestjs-events-flow';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Primero configuramos EventEmitterModule
    EventEmitterModule.forRoot({
      delimiter: '.',
      wildcard: true,
      global: true,
      verboseMemoryLeak: true,
    }),
    // Luego añadimos EventsFlowGlobalModule para habilitar el autocompletado
    EventsFlowGlobalModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
