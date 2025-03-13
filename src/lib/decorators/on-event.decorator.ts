import { OnEvent as NestOnEvent } from '@nestjs/event-emitter';
import { listenTypes } from '../../../listen-types';

/**
 * Decorador para escuchar eventos específicos.
 * Proporciona autocompletado para los nombres de eventos.
 * 
 * @param event Nombre del evento a escuchar (tipado con autocompletado)
 * @returns Decorador de método configurado para el evento especificado
 */
export function OnEvent<T = any>(event: listenTypes): MethodDecorator {
  return NestOnEvent(event);
}