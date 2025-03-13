import { Injectable, Optional } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'node:crypto';
import { listenTypes } from '../../../listen-types';

/**
 * Interfaz para el seguimiento de eventos
 */
export interface EventTraceNode {
  id: string;
  event: listenTypes;
  timestamp: number;
  parentNode?: EventTraceNode;
}

/**
 * Opciones para la emisión de eventos
 */
export interface EmitOptions {
  parentTrace?: EventTraceNode;
}

/**
 * Servicio que envuelve a EventEmitter2 para proporcionar tipos mejorados.
 * Facilita la emisión de eventos tipados y proporciona autocompletado.
 * Incluye capacidades de seguimiento de secuencia de eventos stateless.
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
   * @param options Opciones para el seguimiento del evento
   * @returns Resultado de la emisión
   */
  emit<T = any>(event: listenTypes, data?: T, options?: EmitOptions): boolean {
    const eventTrace = this.createEventTraceNode(event, options?.parentTrace);
    const enhancedData = this.enhanceDataWithTrace(data, eventTrace);
    
    return this.emitter.emit(event, enhancedData);
  }

  /**
   * Emite un evento de forma asíncrona con el nombre y datos especificados.
   * @param event Nombre del evento a emitir (autocompletado)
   * @param data Datos a enviar con el evento
   * @param options Opciones para el seguimiento del evento
   * @returns Promesa que se resuelve cuando se completa la emisión
   */
  emitAsync<T = any>(event: listenTypes, data?: T, options?: EmitOptions): Promise<any[]> {
    const eventTrace = this.createEventTraceNode(event, options?.parentTrace);
    const enhancedData = this.enhanceDataWithTrace(data, eventTrace);
    
    return this.emitter.emitAsync(event, enhancedData);
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

  /**
   * Extrae la traza de un evento recibido.
   * @param eventData Datos del evento recibido
   * @returns Nodo de traza del evento o undefined si no existe
   */
  extractEventTrace<T = any>(eventData: T): EventTraceNode | undefined {
    if (!eventData || typeof eventData !== 'object') {
      return undefined;
    }
    
    const data = eventData as any;
    return data._eventTrace;
  }

  /**
   * Obtiene el camino completo de eventos que llevaron al evento actual
   * @param traceNode Nodo de traza desde el que reconstruir el camino
   * @returns Array con la secuencia completa de eventos desde el origen hasta el actual
   */
  getEventPath(traceNode: EventTraceNode): EventTraceNode[] {
    const path: EventTraceNode[] = [traceNode];
    let currentNode = traceNode;
    
    while (currentNode.parentNode) {
      path.unshift(currentNode.parentNode);
      currentNode = currentNode.parentNode;
    }
    
    return path;
  }

  /**
   * Crea un nodo de traza para un evento
   * @param event Nombre del evento
   * @param parentNode Nodo padre opcional del que este evento fue disparado
   * @returns Nodo de traza creado
   */
  private createEventTraceNode(event: listenTypes, parentNode?: EventTraceNode): EventTraceNode {
    return {
      id: randomUUID(),
      event,
      timestamp: Date.now(),
      parentNode
    };
  }

  /**
   * Añade información de traza a los datos del evento
   * @param data Datos originales del evento
   * @param traceNode Nodo de traza a añadir
   * @returns Datos mejorados con información de traza
   */
  private enhanceDataWithTrace<T>(data: T | undefined, traceNode: EventTraceNode): T & { _eventTrace?: EventTraceNode } {
    if (!data) {
      return { _eventTrace: traceNode } as T & { _eventTrace?: EventTraceNode };
    }
    
    if (typeof data === 'object' && data !== null) {
      return {
        ...data as object,
        _eventTrace: traceNode
      } as T & { _eventTrace?: EventTraceNode };
    }
    
    // Si data no es un objeto, creamos uno nuevo con la propiedad value y _eventTrace
    return {
      value: data,
      _eventTrace: traceNode
    } as unknown as T & { _eventTrace?: EventTraceNode };
  }
}