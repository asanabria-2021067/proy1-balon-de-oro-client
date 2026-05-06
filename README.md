# Tracker del Balón de Oro

Explorador histórico completo del prestigioso Balón de Oro. Frontend construido con HTML + CSS + JavaScript puro sin frameworks ni librerías reactivas.

Esta aplicación demuestra cómo construir una interfaz web completa y profesional utilizando únicamente tecnologías nativas del navegador. Implementa un patrón MVC (Model-View-Controller) estricto con separación clara de responsabilidades, módulos ES6, y una arquitectura escalable sin dependencias pesadas.

Demo en Vivo: http://158.23.57.118/angel/proy1-balon-de-oro-client/index.html

## Stack Tecnológico

- **HTML5, CSS3, JavaScript ES6+** (vanilla, sin frameworks ni librerías reactivas)
- **Fetch API nativa** para comunicación con el backend
- **JSZip 3.10.1** cargado dinámicamente (solo para exportación Excel)
- **Google Fonts** (Inter) - Tipografía moderna y legible

## Cómo Ejecutar Localmente

Este proyecto es una aplicación web estática que requiere un servidor HTTP para funcionar correctamente. No se puede abrir directamente con file:// debido a restricciones CORS y la carga de módulos ES6.

**Opción A: VS Code Live Server (Recomendado)**
1. Instala la extensión Live Server en VS Code
2. Click derecho en index.html
3. Selecciona "Open with Live Server"
4. Se abrirá automáticamente en http://localhost:5500

**Opción B: Servidor HTTP de Python**
```bash
python3 -m http.server 8080
```
Luego abre http://localhost:8080 en tu navegador

**Opción C: Servidor HTTP de Node.js**
```bash
npx http-server -p 8080
```
Luego abre http://localhost:8080 en tu navegador

Importante: La API de producción está configurada en https://proy1-balon-de-oro-api.vercel.app/api (ver js/core/api.js). Para cambiar a una API local, modifica la variable BASE_URL en ese archivo.

## Funcionalidades Principales

**Vista de Ceremonias**
- Sección hero con imagen de fondo y título dinámico basado en el año seleccionado
- Selector de año funcional (1998-2025, excluyendo 2020 cuando no hubo ceremonia)
- Grid responsive de top 10 nominaciones del año seleccionado
- Visualización de posición, nombre, club y foto de cada nominado
- Indicador visual especial para el ganador del año

**Gestión de Jugadores**
- CRUD completo (Create, Read, Update, Delete) de jugadores
- Formulario de creación con validación client-side
- Upload de foto mediante input file con preview en tiempo real antes de enviar
- Visualización de lista de jugadores con paginación
- Edición inline de jugadores existentes
- Confirmación antes de eliminar jugadores
- Feedback visual de operaciones exitosas o fallidas

**Exportación de Datos**
- Generación manual de archivos CSV (valores separados por comas)
- Generación de archivos Excel en formato SpreadsheetML (XML compatible con Excel)
- Compresión de Excel usando JSZip cargado dinámicamente solo cuando se necesita
- No requiere librerías pesadas como xlsx.js
- Download automático del archivo generado

**Tema Dark Gold Premium**
- UI elegante con paleta de colores oscuros y dorados
- CSS Grid para layout responsive multi-columna
- Transiciones CSS suaves en hover y focus
- Efectos de elevación en cards con box-shadow
- Modo oscuro por defecto optimizado para reducir fatiga visual
- Tipografía Inter desde Google Fonts para legibilidad óptima

**Sistema de Notificaciones Toast**
- Notificaciones no-intrusivas en esquina superior derecha
- Auto-dismissible después de 3 segundos
- Tipos de notificación: success, error, info
- Animaciones de entrada y salida con CSS transitions
- Cierre manual con botón X
- Stack de múltiples notificaciones si ocurren simultáneamente

**Búsqueda Inteligente de Jugadores**
- Input de búsqueda con debounce de 300ms
- Reduce requests innecesarios al API mientras el usuario escribe
- Búsqueda por nombre de jugador
- Feedback visual de estado de carga
- Reinicio de búsqueda al limpiar el input

## Arquitectura: Patrón MVC

Separación limpia de responsabilidades usando Model-View-Controller clásico:

**CORE** → Llamadas API + gestión de estado global (cero DOM, cero lógica de negocio)
**MODELS** → Funciones de transformación puras (cero DOM, cero fetch)
**VIEWS** → Manipulación DOM exclusivamente (recibe datos ya procesados)
**CONTROLLERS** → Capa de orquestación (api → model → view)
**UTILS** → Lógica autocontenida de exportación

## Detalles Técnicos de Implementación

**ES Modules Nativos**
Todo el código JavaScript está organizado en módulos ES6 usando import/export nativo del navegador:
- No requiere bundler (Webpack, Rollup, Vite)
- Carga bajo demanda mediante import dinámico donde es apropiado
- Cada módulo tiene una responsabilidad única y claramente definida
- El navegador cachea módulos automáticamente

**Fetch API para Comunicación HTTP**
Todas las peticiones al backend usan la Fetch API nativa:
- Manejo de promesas con async/await para código limpio
- Configuración de headers (Content-Type, etc.)
- Manejo de errores HTTP con try/catch
- Parsing automático de respuestas JSON
- No requiere axios ni otras librerías de HTTP

**FormData para Upload de Archivos**
El upload de fotos de jugadores usa la interfaz FormData nativa:
- Construcción de multipart/form-data sin librerías
- Permite enviar archivos + campos de texto en una sola petición
- Compatible con la configuración multer del backend

**FileReader API para Preview de Imágenes**
Preview de foto antes de upload usando FileReader:
- Lee el archivo seleccionado como Data URL
- Muestra la imagen en un elemento img antes de enviar al servidor
- Validación de tipo MIME en el cliente
- Feedback inmediato al usuario

**Debounce Manual para Búsqueda**
Implementación de debounce sin lodash ni otras librerías:
- setTimeout y clearTimeout para controlar llamadas
- Espera 300ms después del último keystroke antes de hacer fetch
- Reduce carga en el servidor y mejora UX

**Template Literals para Generación de HTML**
Todo el HTML dinámico se genera con template literals:
- Sintaxis clara y legible con backticks
- Interpolación de variables con ${}
- Multi-línea sin concatenación compleja
- Evita innerHTML inseguro al sanitizar inputs

**CSS Custom Properties (Variables CSS)**
Sistema de diseño basado en variables CSS:
- Permite cambiar tema completo modificando variables raíz
- Reutilización de colores, espaciados y tamaños
- Facilita mantenimiento y consistencia visual
- Compatible con todos los navegadores modernos

**Responsive Design con Media Queries**
Layout adaptativo sin framework CSS:
- Mobile-first approach con breakpoints en 480px y 768px
- CSS Grid con auto-fit y minmax para columnas dinámicas
- Flexbox para alineación y distribución de elementos
- Imágenes responsive con max-width: 100%

## Estructura del Proyecto

```
├── index.html
├── css/
│   └── styles.css           # Metodología BEM, tema dark gold
├── js/
│   ├── app.js               # Conecta controllers, navegación, event listeners
│   ├── core/
│   │   ├── api.js           # Todas las llamadas fetch() (cero DOM, cero lógica)
│   │   └── state.js         # Gestión de estado global
│   ├── models/
│   │   ├── ceremony.model.js  # Funciones puras: transformar, filtrar, formatear
│   │   └── player.model.js    # Funciones puras: validar, transformar
│   ├── views/
│   │   ├── ceremony.view.js   # Manipulación DOM para ceremonias
│   │   ├── player.view.js     # Manipulación DOM para jugadores
│   │   └── toast.view.js      # Sistema de notificaciones
│   ├── controllers/
│   │   ├── ceremony.ctrl.js   # Orquesta ceremonias (api → model → view)
│   │   └── player.ctrl.js     # Orquesta jugadores (api → model → view)
│   └── utils/
│       └── export.js          # Exportación CSV + Excel SpreadsheetML
└── assets/
    ├── silhouette.svg         # Fallback para foto de jugador
    └── placeholder-hero.svg   # Fallback para fondo del hero
```

**Responsabilidades por Capa:**

| Capa | Puede Importar | No Puede Importar | Propósito |
|------|----------------|-------------------|-----------|
| **CORE** | Nada | DOM, models | Solo fetch + state |
| **MODELS** | Nada | DOM, core/api | Transformación pura de datos |
| **VIEWS** | models (helpers) | core/api | Solo manipulación DOM |
| **CONTROLLERS** | Todas las capas | Nada | Orquestación |
| **UTILS** | core, views | models, controllers | Exports autocontenidos |

## Convenciones de Diseño

**BEM (Block, Element, Modifier)**
- Componentes modulares y reutilizables
- Estructura de clases clara: `bloque__elemento--modificador`
- Evita guerras de especificidad y colisiones de nombres

**Variables CSS (Custom Properties)**
```css
--bg-primary: #0a0a0f       /* Fondo principal oscuro profundo */
--bg-surface: #12121a       /* Superficie secundaria */
--bg-card: #1a1a2e          /* Fondo de cards */
--color-primary: #f5c518    /* Oro característico del Balón de Oro */
--color-accent: #e8a900     /* Acento oro más intenso */
--color-text: #ffffff       /* Texto principal */
--color-muted: #888899      /* Texto secundario */
--color-border: #1e1e2e     /* Bordes sutiles */
```

**Breakpoints Responsive**
- Desktop: 3 columnas
- Tablet (768px): 2 columnas
- Mobile (480px): 1 columna

## Desafíos Implementados

**Calidad Visual del Cliente**
- Tema premium dark gold con paleta de colores profesional
- Animaciones suaves con CSS transitions y transforms
- Grid responsive profesional con CSS Grid y Flexbox
- Tipografía legible con font-family Inter de Google Fonts
- Efectos hover refinados en cards y botones
- Feedback visual inmediato en todas las interacciones

**Calidad del Historial de Git**
- Commits siguiendo Conventional Commits spec
- Mensajes descriptivos con contexto claro
- Historial limpio sin commits de "fix typo" o "wip"
- Cada commit representa una unidad lógica de cambio

**Organización del Código**
- Arquitectura MVC estricta con separación clara de capas
- ES modules nativos con import/export
- BEM (Block Element Modifier) para CSS modular
- Separación rigurosa de responsabilidades
- Sin mezcla de lógica de negocio con manipulación DOM
- Un archivo, una responsabilidad

**Exportación de Lista**
- Generación manual de CSV sin librerías externas
- Generación de Excel en formato SpreadsheetML (XML)
- Uso de JSZip solo para comprimir Excel (cargado dinámicamente)
- Sin dependencias pesadas como xlsx.js (más de 1MB)
- Download automático con createObjectURL y elemento a temporal

## Backend

**Repositorio:** [proy1-balon-de-oro-api](https://github.com/asanabria-2021067/proy1-balon-de-oro-api)

**Stack:**
- Node.js + Express
- Supabase PostgreSQL
- Arquitectura Hexagonal (Puertos y Adaptadores)
- Desplegado en Vercel

## Reflexión Técnica

**Cuándo usar JavaScript Vanilla vs Frameworks**

JavaScript Vanilla es ideal cuando:
- El bundle size es crítico (aplicaciones móviles, países con conexión lenta)
- El proyecto tiene interactividad limitada o moderada
- No hay necesidad de componentes reutilizables complejos
- El equipo tiene disciplina para mantener arquitectura consistente
- Se requiere máximo control sobre el código y zero dependencias

Este proyecto demuestra que con JavaScript Vanilla moderno se puede:
- Mantener bundle size menor a 10KB gzipped sin minificar
- Cargar y ejecutar instantáneamente (First Contentful Paint < 1s)
- Lograr arquitectura limpia con patrón MVC
- Evitar overhead de Virtual DOM y reconciliation
- Tener control total sobre cada byte enviado al navegador

Frameworks como React o Vue serían más apropiados cuando:
- La aplicación tiene estado complejo y altamente reactivo
- Se necesita reutilización extensiva de componentes
- El equipo es grande y necesita herramientas de desarrollo estandarizadas
- Se requiere ecosistema rico de librerías y tooling
- Formularios complejos con validación multi-step y estado derivado

Desventajas encontradas con Vanilla en este proyecto:
- Sincronización manual del DOM se vuelve verbosa con mucha interactividad
- No hay reactividad automática, cada cambio de estado requiere actualizar DOM explícitamente
- Sin type safety (podría mitigarse con TypeScript puro sin framework)
- Mapeo manual de eventos y cleanup de listeners
- No hay componentes reutilizables out-of-the-box

Conclusión: JavaScript Vanilla está subestimado. Con ES modules, arquitectura MVC, y APIs modernas del navegador (fetch, template literals, destructuring, async/await, FormData, FileReader), se pueden construir aplicaciones web profesionales sin frameworks. Solo requiere disciplina arquitectónica, separación rigurosa de responsabilidades, y entender profundamente el DOM y las APIs del navegador.

**Performance Metrics Logrados**
- Bundle size total: menos de 10KB gzipped
- First Contentful Paint: menos de 1 segundo
- Time to Interactive: menos de 1.5 segundos
- Zero dependencias en runtime (solo JSZip cargado bajo demanda para Excel)
- Compatibilidad: todos los navegadores modernos sin transpilación
