import { Module } from '@nestjs/common';
import {
  EventsFlowGlobalModule,
  EventsFlowModule,
  EventsFlowService,
} from 'nestjs-events-flow';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    EventsFlowModule.forRoot({
      delimiter: '.',
      wildcard: true,
      global: true,
      verboseMemoryLeak: true,
    }),
    EventsFlowGlobalModule,
    EventsModule,
  ],
  providers: [EventsFlowService],
})
export class AppModule {}
