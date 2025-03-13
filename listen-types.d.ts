/**
 * Archivo generado automáticamente. No modificar.
 */

export type listenTypes = '**' | 'user.created' | 'user.*' | 'email.sent' | 'email.*';

declare module '@nestjs/event-emitter' {
  // Sobrescribimos la interfaz de EventEmitter2 para modificar el tipo del primer parámetro de emit
  export interface EventEmitter2 {
    emit<T = any>(event: listenTypes, value?: T): Promise<any>;
    emitAsync<T = any>(event: listenTypes, value?: T): Promise<any>;
  }
}
