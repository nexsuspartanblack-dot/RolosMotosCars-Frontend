# Rolo's Motos Cars

Aplicación frontend para la gestión de un taller de motocicletas y automóviles, desarrollada como parte del proyecto formativo del programa Análisis y Desarrollo de Software (ADSO) del SENA.

## Descripción

Rolo's Motos Cars es una interfaz web que permite administrar información básica de un taller mediante diferentes módulos. La aplicación cuenta con una interfaz futurista inspirada en una estética cyberpunk, con colores oscuros y detalles en amarillo neón y cian.

## Módulos implementados

- **Panel principal:** muestra indicadores generales de clientes, vehículos, citas, servicios y repuestos.
- **Clientes:** permite registrar, consultar, editar y eliminar clientes.
- **Vehículos:** permite registrar y administrar motocicletas y automóviles asociados a sus propietarios.
- **Citas:** permite programar, consultar, modificar y eliminar citas de servicio.
- **Servicios:** permite registrar y administrar los servicios realizados o pendientes.
- **Repuestos:** permite registrar y administrar repuestos, consultar existencias y detectar niveles bajos de inventario.

## Tecnologías utilizadas

- React.
- JavaScript.
- HTML5.
- CSS3.
- Vite.
- LocalStorage del navegador.

## Requisitos

- Node.js.
- npm.
- Visual Studio Code u otro editor de código.

## Instalación y ejecución

Clonar o descargar el proyecto y abrir una terminal en la carpeta `Frontend`.

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir en el navegador la dirección local que indique Vite, normalmente:

```text
http://localhost:5173/
```

## Compilación para producción

Para generar la versión de producción:

```bash
npm run build
```

Los archivos generados se almacenan en la carpeta `dist`.

## Almacenamiento y alcance

La aplicación utiliza LocalStorage para conservar los registros en el navegador. Esto permite realizar pruebas de registro, consulta, edición, eliminación y persistencia de información.

Esta versión corresponde al componente frontend del proyecto formativo. No cuenta todavía con integración a una API, servidor backend ni base de datos MySQL. Los registros se almacenan localmente en el navegador donde se utiliza la aplicación.

## Proyecto formativo

**Programa:** Análisis y Desarrollo de Software (ADSO)  
**Institución:** Servicio Nacional de Aprendizaje (SENA)  
**Proyecto:** Rolo's Motos Cars