import { DynamicModule, Global, Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { EventEmitterModuleOptions } from "@nestjs/event-emitter/dist/interfaces";
import { EventsFlowService } from "./services/events-flow.service";

/**
 * Módulo principal para nestjs-events-flow.
 *
 * IMPORTANTE: Para evitar problemas de inyección de dependencias, esta librería ahora
 * recomienda dos formas de uso:
 *
 * Opción 1 (Recomendada): Usar EventEmitterModule y EventsFlowService por separado
 * ```typescript
 * import { Module } from "@nestjs/common";
 * import { EventEmitterModule } from "@nestjs/event-emitter";
 * import { EventsFlowService } from "nestjs-events-flow";
 *
 * @Module({
 *   imports: [
 *     EventEmitterModule.forRoot({
 *       wildcard: true,
 *       delimiter: '.',
 *     }),
 *   ],
 *   providers: [EventsFlowService],  // Añadir EventsFlowService como proveedor
 *   exports: [EventsFlowService],    // Exportarlo si otros módulos lo necesitan
 * })
 * export class AppModule {}
 * ```
 *
 * Opción 2: Usar EventsFlowGlobalModule después de EventEmitterModule
 * ```typescript
 * import { Module } from "@nestjs/common";
 * import { EventEmitterModule } from "@nestjs/event-emitter";
 * import { EventsFlowGlobalModule } from "nestjs-events-flow";
 *
 * @Module({
 *   imports: [
 *     EventEmitterModule.forRoot({...}),
 *     EventsFlowGlobalModule,
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  providers: [EventsFlowService],
  exports: [EventsFlowService],
})
export class EventsFlowModule {
  static forRoot(options?: EventEmitterModuleOptions): DynamicModule {
    return {
      global: options?.global || false,
      module: EventsFlowModule,
      providers: [EventsFlowService],
      exports: [EventsFlowService],
      imports: [EventEmitterModule.forRoot(options)],
    };
  }
}
