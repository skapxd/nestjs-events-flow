import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
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
  exports: [EventsFlowService]
})
export class EventsFlowModule {
  /**
   * @deprecated Usar EventEmitterModule.forRoot() y agregar EventsFlowService como proveedor
   */
  static forRoot(options?: EventEmitterModuleOptions): DynamicModule {
    console.warn('DEPRECATION WARNING: EventsFlowModule.forRoot() está obsoleto. Usa EventEmitterModule.forRoot() y provee EventsFlowService en tu módulo principal.');
    
    return {
      global: options?.global || false,
      module: EventsFlowModule,
      providers: [EventsFlowService],
      exports: [EventsFlowService],
    };
  }
}

/**
 * Módulo global que proporciona el servicio EventsFlowService.
 * Debe usarse DESPUÉS de importar EventEmitterModule.
 */
@Global()
@Module({
  providers: [EventsFlowService],
  exports: [EventsFlowService]
})
export class EventsFlowGlobalModule {}
