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

### 1. Configurar el módulo EventEmitter en tu aplicación

```typescript
import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    EventEmitterModule.forRoot({
      delimiter: ".",
      wildcard: true,
      global: true,
      verboseMemoryLeak: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 2. Usar los decoradores en tus controladores o servicios

```typescript
import { Controller, Get } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Events } from "nestjs-events-flow";

@Controller()
export class AppController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Get()
  @Events({
    emit: ["user.created"],
  })
  async createUser() {
    // Lógica para crear usuario
    await this.eventEmitter.emit("user.created", { id: 1, name: "John" });
    return { success: true };
  }

  @Events({
    listen: ["user.created"],
  })
  async handleUserCreated(data: any) {
    console.log("User created:", data);
    // Lógica para manejar el evento
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
