import { Module } from '@nestjs/common';
import { EventsFlowModule, EventsFlowService } from 'nestjs-events-flow';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    EventsFlowModule.forRoot({
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
