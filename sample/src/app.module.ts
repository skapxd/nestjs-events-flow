import { Module } from '@nestjs/common';
import { EventsFlowService } from 'nestjs-events-flow';
import { EventsModule } from './events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      delimiter: '.',
      wildcard: true,
      global: true,
      verboseMemoryLeak: true,
    }),
    EventsModule,
  ],
  providers: [EventsFlowService],
})
export class AppModule {}
