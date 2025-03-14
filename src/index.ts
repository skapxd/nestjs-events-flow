// Exportar decoradores
export {
  EmitsEvents,
  Events,
  EventsOptions,
  EMITS_EVENTS_KEY,
  EVENTS_METADATA_KEY,
} from './lib/decorators/index';

// Exportar módulos
export { EventsFlowModule } from './lib/events-flow.module';

// Exportar servicios
export { EventsFlowService } from './lib/services/events-flow.service';

// Exportar utilidades
export { extractEventsDocumentation } from './lib/utils/documentation-helper';
export { generateEventsDocumentation } from './lib/utils/documentation-generator';
export { generateEventsHtml } from './lib/utils/generate-events-flow-html';
export { generateListenTypesDefinition } from './lib/utils/generate-listen-types-definition';

// Exportar tipos
export { listenTypes } from '../listen-types';

// Re-exportar tipos importantes de @nestjs/event-emitter para conveniencia
export { EventEmitterModuleOptions } from '@nestjs/event-emitter/dist/interfaces';