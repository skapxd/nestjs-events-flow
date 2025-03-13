# NestJS Events Flow Sample

This sample project demonstrates how to use the `Events` decorator from the `nestjs-events-flow` package to document and manage event flows in a NestJS application.

## Installation and Setup

Hay dos formas de configurar este proyecto para pruebas de desarrollo local:

### Opción 1: Usando referencia local a través de file:../

Esta configuración apunta directamente al directorio del proyecto principal:

```bash
# En el directorio raíz del proyecto
$ yarn build

# En el directorio del proyecto de ejemplo (sample)
$ yarn install
$ yarn start:dev
```

Con esta configuración, el proyecto de ejemplo usa automáticamente la versión local del paquete `nestjs-events-flow` referenciando directamente al directorio padre (`file:../`).

### Opción 2: Usando Yarn/NPM Link

Si prefieres usar el método tradicional de enlace:

```bash
# En el directorio raíz del paquete
$ yarn build
$ yarn link

# En este directorio de ejemplo
$ yarn install
$ yarn use-local  # Este comando ejecuta "yarn link nestjs-events-flow"

# Para desvincular cuando termines
$ yarn unlink-local
```

## Running the app

```bash
# Development mode
$ yarn run start

# Watch mode
$ yarn run start:dev
```

## How to use Events Decorator

The `Events` decorator provides a way to document and register event handlers in your NestJS application. It works alongside `@nestjs/event-emitter` to automatically register event listeners and provide metadata about event flows.

### Basic Usage

In this sample app, we demonstrate:

1. **Emitting events** - Using `@Events({emit: ['event.name']})` to document events emitted by a method
2. **Listening for events** - Using `@Events({listen: ['event.name']})` to register a method as an event listener
3. **Chaining events** - A method can both listen for events and emit new events

### Example from the sample:

```typescript
// Creating a user and emitting an event
@Events({
  emit: ['user.created'],
  listen: []
})
async createUser(username: string, email: string): Promise<number> {
  // ...create user logic
  
  // Emit an event
  this.eventEmitter.emit('user.created', eventPayload);
  
  return userId;
}

// Listening for the user.created event and emitting a new event
@Events({
  emit: ['email.sent'],
  listen: ['user.created']
})
async onUserCreated(payload: UserCreatedEvent): Promise<void> {
  // Handle the user.created event
  
  // Emit a new event
  this.eventEmitter.emit('email.sent', emailEvent);
}

// Listening for the email.sent event
@Events({
  emit: [],
  listen: ['email.sent']
})
async onEmailSent(payload: EmailSentEvent): Promise<void> {
  // Handle the email.sent event
}
```

## Testing the Event Flow

To test the event flow in this sample:

1. Start the application
2. Make a POST request to `/users` with the following payload:
   ```json
   {
     "username": "testuser",
     "email": "test@example.com"
   }
   ```
3. The application will:
   - Create a user (simulated)
   - Emit a `user.created` event
   - The `onUserCreated` method will handle that event
   - Send a welcome email (simulated)
   - Emit an `email.sent` event
   - The `onEmailSent` method will handle that event

You should see the corresponding logs in the console.

## Benefits of using Events Decorator

1. **Self-documenting code** - The decorator clearly shows what events a method emits or listens for
2. **Automatic registration** - Event listeners are automatically registered with `@nestjs/event-emitter`
3. **Metadata for visualization** - The decorator provides metadata that can be used to generate event flow visualizations
