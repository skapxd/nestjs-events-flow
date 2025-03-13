import { Injectable, Optional } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { listenTypes } from '../../../listen-types';

/**
 * Servicio que envuelve a EventEmitter2 para proporcionar tipos mejorados.
 * Facilita la emisión de eventos tipados y proporciona autocompletado.
 */
@Injectable()
export class EventsFlowService {
  private readonly emitter: EventEmitter2;

  constructor(@Optional() eventEmitter?: EventEmitter2) {
    // Si no se inyecta EventEmitter2, creamos una nueva instancia
    this.emitter = eventEmitter || new EventEmitter2({
      delimiter: '.',
      wildcard: true,
    });
  }

  /**
   * Emite un evento con el nombre y datos especificados.
   * @param event Nombre del evento a emitir (autocompletado)
   * @param data Datos a enviar con el evento
   * @returns Promesa que se resuelve cuando se completa la emisión
   */
  emit<T = any>(event: listenTypes, data?: T): boolean {
    return this.emitter.emit(event, data);
  }

  /**
   * Emite un evento de forma asíncrona con el nombre y datos especificados.
   * @param event Nombre del evento a emitir (autocompletado)
   * @param data Datos a enviar con el evento
   * @returns Promesa que se resuelve cuando se completa la emisión
   */
  emitAsync<T = any>(event: listenTypes, data?: T): Promise<any[]> {
    return this.emitter.emitAsync(event, data);
  }

  /**
   * Elimina todos los listeners para un evento específico o para todos los eventos.
   * @param event Nombre del evento opcional
   * @returns Referencia a la instancia de EventEmitter
   */
  removeAllListeners(event?: listenTypes): EventEmitter2 {
    return this.emitter.removeAllListeners(event);
  }

  /**
   * Accede directamente al EventEmitter2 subyacente.
   * @returns La instancia de EventEmitter2
   */
  get nativeEmitter(): EventEmitter2 {
    return this.emitter;
  }
}