# nestjs-events-flow

Una librería de decoradores para NestJS que proporciona una manera sencilla de documentar y visualizar el flujo de eventos en tu aplicación.

## Características

- Decoradores para documentar eventos emitidos y escuchados
- Generación automática de documentación de eventos en formato JSON
- Visualización del flujo de eventos con diagramas Mermaid
- Generación de definiciones de tipos TypeScript para eventos
- Soporte para patrones comodín (wildcards) en eventos jerárquicos

## Instalación

```bash
npm install nestjs-events-flow
```

## Requisitos

- NestJS 9.x o superior
- @nestjs/event-emitter 2.x o superior
- reflect-metadata

## Desarrollo local

Este proyecto incluye dos opciones para probar el paquete localmente sin necesidad de publicarlo:

### Opción 1: Usando referencia local directa (Recomendado)

```bash
# Construir el paquete principal
yarn build

# Ir al directorio del proyecto de ejemplo
cd sample

# Instalar dependencias (usará la referencia file:../ configurada en package.json)
yarn install

# Ejecutar el proyecto de ejemplo
yarn start:dev
```

### Opción 2: Usando Yarn/NPM Link

```bash
# En el directorio raíz del paquete
yarn build
yarn link

# En el proyecto donde quieras usar el paquete
cd /ruta/a/tu/proyecto
yarn link nestjs-events-flow
```

Para más detalles, consulta el [README del proyecto de ejemplo](./sample/README.md).

## Uso básico

### 1. Configurar los módulos necesarios

Hay dos formas recomendadas de usar esta biblioteca:

#### Opción 1: Mantener EventEmitterModule y agregar EventsFlowGlobalModule

```typescript
import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { EventsFlowGlobalModule } from "nestjs-events-flow";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    // 1. Configura EventEmitterModule normalmente
    EventEmitterModule.forRoot({
      delimiter: ".",
      wildcard: true,
      global: true,
      verboseMemoryLeak: true,
    }),
    // 2. Añade EventsFlowGlobalModule para habilitar autocompletado en toda la app
    EventsFlowGlobalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

#### Opción 2: Proporcionar EventsFlowService en el módulo que lo necesita

```typescript
import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { EventsFlowService } from "nestjs-events-flow";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    EventEmitterModule.forRoot({...}),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Proporcionar EventsFlowService directamente en el módulo
    EventsFlowService,
  ],
  // Exportarlo si es necesario en otros módulos
  exports: [EventsFlowService],
})
export class AppModule {}
```

> **Importante**: EventsFlowService debe usarse *después* de configurar EventEmitterModule, ya que depende de su funcionalidad.

### 2. Usar los decoradores y servicios en tus controladores

```typescript
import { Controller, Get } from "@nestjs/common";
import { EventsFlowService, Events, OnEvent } from "nestjs-events-flow";

@Controller()
export class AppController {
  // Usar EventsFlowService para obtener autocompletado de eventos
  constructor(private readonly eventService: EventsFlowService) {}

  @Get()
  @Events({
    emit: ["user.created"],
  })
  async createUser() {
    // Ahora tendrás autocompletado en emit
    await this.eventService.emit("user.created", { id: 1, name: "John" });
    return { success: true };
  }

  // Usar OnEvent con autocompletado
  @OnEvent("user.created")
  async handleUserCreated(data: any) {
    console.log("User created:", data);
    // Lógica para manejar el evento
  }

  // También puedes usar el decorador Events para múltiples eventos
  @Events({
    listen: ["user.created", "user.updated"],
  })
  async handleUserEvents(data: any) {
    console.log("User event:", data);
    // Lógica para manejar múltiples eventos
  }
}
```

### 3. Generar la documentación de eventos

En tu archivo main.ts:

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { extractEventsDocumentation } from "nestjs-events-flow";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Generar documentación de eventos
  await extractEventsDocumentation(app, {
    outputDir: ".", // Directorio de salida
    typeFile: "listen-types.d.ts", // Archivo de definiciones TypeScript
    docFile: "public/event-doc.json", // Documentación JSON
    htmlFile: "public/events-flow.html", // Visualización HTML
    generateTypeFileInPackage: true, // Genera el archivo de tipos en el paquete en lugar del proyecto
  });

  await app.listen(3000);
}
bootstrap();
```

## Visualización de flujo de eventos

Después de ejecutar tu aplicación, se generará un archivo HTML con un diagrama Mermaid que muestra el flujo de eventos entre los diferentes métodos de tus controladores y servicios.

Para ver el diagrama, simplemente abre el archivo `public/events-flow.html` en tu navegador.

## Licencia

MIT


[![Reproducible Build](https://img.shields.io/badge/Reproducible-Build-brightgreen)](https://reproducible-builds.org)
