![](https://img.shields.io/github/stars/pandao/editor.md.svg) ![](https://img.shields.io/github/forks/pandao/editor.md.svg) ![](https://img.shields.io/github/tag/pandao/editor.md.svg) ![](https://img.shields.io/github/release/pandao/editor.md.svg) ![](https://img.shields.io/github/issues/pandao/editor.md.svg) ![](https://img.shields.io/bower/v/editor.md.svg)

## Universidad de Costa Rica
## Sede del Atlántico
## Recinto de Guápiles

------------
### Tarea de Migración de Sistema con NodeJs
### Curso IF-7100
### Profesor: Arturo Guillén

------------
#### Instrucciones generales:

   - Lea detenidamente las indicaciones.
   - No se limite con el uso de internet.
   - Cualquier intento de fraude será penalizado. (¡Si chat gpt eres tu!) 😅)

------------
# Migración de JavaScript a TypeScript para Sistema en Node.js y Express.js

## Objetivo
Migrar todo el sistema de Node.js y Express.js de JavaScript a TypeScript, asegurando que todas las funcionalidades, configuraciones, métodos de seguridad y estructura del framework se preserven y funcionen correctamente.

## Requisitos Previos
1. **Node.js y npm** instalados.
2. **TypeScript** instalado (`npm install -g typescript`).
3. **ts-node** instalado para la ejecución de TypeScript (`npm install -g ts-node`).
4. **Archivo de Configuración de TypeScript (tsconfig.json)**.

## Pasos de la Tarea

### 1. Configurar TypeScript
Crear un archivo `tsconfig.json` en la raíz del proyecto si no existe.
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 2. Renombrar Archivos
Renombrar todos los archivos `.js` en el directorio `src` a `.ts`.

### 3. Instalar Dependencias de TypeScript
Instalar los paquetes necesarios de TypeScript y definiciones de tipos.

```bash
npm install typescript @types/node @types/express
```

### 4. Actualizar Declaraciones de Importación
Actualizar todas las declaraciones de importación de CommonJS a la sintaxis de módulos de ES6 donde sea necesario.

```typescript
// Cambiar de:
const express = require('express');
// A:
import express from 'express';
```

### 5. Agregar Anotaciones de Tipo
Agregar anotaciones de tipo a todos los parámetros y tipos de retorno de funciones.

```typescript
// Ejemplo
function add(a: number, b: number): number {
  return a + b;
}
```

### 6. Definir Interfaces
Definir interfaces para los objetos de solicitud y respuesta en Express.

```typescript
import { Request, Response } from 'express';

interface CustomRequest extends Request {
  user?: any;
}

interface CustomResponse extends Response {
  data?: any;
}
```

### 7. Actualizar Middleware
Actualizar todas las funciones de middleware para usar las interfaces definidas.

```typescript
const middleware = (req: CustomRequest, res: CustomResponse, next: NextFunction): void => {
  // Lógica del middleware
  next();
};
```

### 8. Actualizar Archivos de Configuración
Asegurarse de que todos los archivos de configuración y variables de entorno estén correctamente tipados.

```typescript
// config.ts
interface Config {
  port: number;
  dbUrl: string;
  jwtSecret: string;
}

const config: Config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  dbUrl: process.env.DB_URL || '',
  jwtSecret: process.env.JWT_SECRET || ''
};

export default config;
```

### 9. Preservar Métodos de Seguridad
Asegurarse de que todos los métodos de seguridad y middlewares (por ejemplo, autenticación, autorización) estén tipados y funcionales.

```typescript
import jwt from 'jsonwebtoken';

const authenticate = (req: CustomRequest, res: CustomResponse, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(401).send({ error: 'Not authenticated' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Not authenticated' });
  }
};
```

### 10. Refactorizar Lógica de Negocio
Refactorizar toda la lógica de negocio para asegurar el uso adecuado de tipos y adherencia a las mejores prácticas de TypeScript.

### 11. Probar y Depurar
Ejecutar el compilador de TypeScript para verificar errores.

```bash
tsc
```

### 12. Ejecutar el Proyecto
Actualizar los scripts en el `package.json` para usar `ts-node` durante el desarrollo.

```json
"scripts": {
  "start": "ts-node src/index.ts",
  "build": "tsc"
}
```

## Notas
- Asegurarse de que todas las dependencias sean compatibles con TypeScript.
- Mantener la estructura y modularidad del framework existente.
- Realizar pruebas rigurosas, especialmente en funcionalidades relacionadas con la seguridad.

Siguiendo estos pasos, la migración de JavaScript a TypeScript será sistemática, preservando la integridad y funcionalidad del sistema original de Node.js y Express.js.

## Detalles adicionales:
- Realice la tarea en su grupo de proyecto.
- Recuerde entregar el proyecto migrado en un archivo con extención zip.
- Recuerde guardar la solucion en git (debe mostrar el historial de cambios de git)
- Fecha de entrega **02/07/2024**.
- Valor de la tarea **9%**.
- 
## Rubrica de Evaluación - Migración de JavaScript a TypeScript

### Criterios de Evaluación

#### 1. Configuración de TypeScript
- **Puntos clave:**
  - Creación y configuración correcta del archivo `tsconfig.json`.
  - Uso adecuado de opciones como `target`, `module`, `strict`, `esModuleInterop`, entre otros.

#### 2. Renombrar Archivos
- **Puntos clave:**
  - Todos los archivos `.js` en el directorio `src` fueron renombrados a `.ts`.
  - Verificación de que los cambios de nombres no afecten la funcionalidad existente.

#### 3. Instalación de Dependencias de TypeScript
- **Puntos clave:**
  - Correcta instalación de `typescript`, `@types/node`, y `@types/express` utilizando `npm`.
  - Verificación de compatibilidad y adecuación de las definiciones de tipos instaladas.

#### 4. Actualización de Declaraciones de Importación
- **Puntos clave:**
  - Todas las declaraciones de importación de CommonJS fueron actualizadas a la sintaxis de módulos de ES6 (`import`).
  - No se encontraron errores de importación después de la migración.

#### 5. Anotaciones de Tipo
- **Puntos clave:**
  - Todas las funciones tienen anotaciones de tipo para parámetros y tipos de retorno.
  - Se utilizan tipos adecuados según las necesidades de cada función.
  - Uso de tipos definidos por el usuario cuando sea necesario (interfaces, tipos personalizados).

#### 6. Definición de Interfaces
- **Puntos clave:**
  - Interfaces definidas correctamente para objetos de solicitud (`Request`) y respuesta (`Response`) en Express.
  - Uso adecuado de interfaces para proporcionar tipos específicos a las propiedades adicionales de solicitud y respuesta.

#### 7. Actualización de Middleware
- **Puntos clave:**
  - Todas las funciones de middleware han sido actualizadas para usar las interfaces definidas (`CustomRequest`, `CustomResponse`).
  - Middleware adaptado para cumplir con las mejores prácticas y la estructura modular existente.

#### 8. Actualización de Archivos de Configuración
- **Puntos clave:**
  - Archivos de configuración (`config.ts`, etc.) actualizados para incluir tipos específicos (`number`, `string`, etc.) en lugar de `any`.
  - Uso correcto de variables de entorno y configuraciones seguras.

#### 9. Preservación de Métodos de Seguridad
- **Puntos clave:**
  - Métodos de seguridad como autenticación y autorización refacturados para asegurar que todos los parámetros y resultados estén correctamente tipados.
  - Uso seguro y adecuado de bibliotecas como `jsonwebtoken`.

#### 10. Refactorización de Lógica de Negocio
- **Puntos clave:**
  - Lógica de negocio refactorizada para aprovechar al máximo las capacidades de TypeScript.
  - Eliminación de código redundante y mejoras en la legibilidad y mantenibilidad del código.

#### 11. Pruebas y Depuración
- **Puntos clave:**
  - Compilación exitosa del código TypeScript utilizando `tsc`.
  - Pruebas exhaustivas realizadas para verificar la funcionalidad correcta del sistema migrado.
  - Manejo efectivo de errores y excepciones durante las pruebas.

#### 12. Ejecución del Proyecto
- **Puntos clave:**
  - Scripts de ejecución y construcción actualizados en el `package.json` para utilizar `ts-node` y `tsc` según corresponda.
  - Verificación de que el proyecto se pueda ejecutar sin problemas utilizando los scripts definidos.

### Recuerde
- **Organización y Documentación:**
  - Uso de comentarios claros y documentación adecuada en el código TypeScript migrado.
  - Mantenimiento de la estructura y modularidad del framework original de Node.js y Express.js.


