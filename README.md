# 🏆 Tracker del Balón de Oro

Explorador histórico completo del prestigioso Balón de Oro. Frontend construido con **HTML + CSS + JavaScript puro** - cero frameworks, máximo rendimiento.

**Demo en Vivo:** http://158.23.57.118/angel/proy1-balon-de-oro-client/index.html

## 🛠️ Stack Tecnológico

- **HTML5, CSS3, JavaScript ES6+** (vanilla, sin frameworks ni librerías reactivas)
- **Fetch API nativa** para comunicación con el backend
- **JSZip 3.10.1** cargado dinámicamente (solo para exportación Excel)
- **Google Fonts** (Inter) - Tipografía moderna y legible

## 🚀 Cómo Ejecutar Localmente

**Opción A: VS Code Live Server**
- Click derecho en `index.html` → Open with Live Server

**Opción B: Servidor HTTP de Python**
```bash
python3 -m http.server 8080
```
Luego abre http://localhost:8080

**Importante:** La API de producción está en `https://proy1-balon-de-oro-api.vercel.app/api` (ya configurada en `js/core/api.js`).

## ✨ Funcionalidades Principales

- **Vista de Ceremonias**: Sección hero impactante + grid de top 10 nominaciones con selector de año (1998-2025, excluyendo 2020)
- **Gestión de Jugadores**: CRUD completo con upload de foto y preview en tiempo real
- **Exportación**: Generación manual de CSV y Excel (SpreadsheetML) sin dependencias externas pesadas
- **Tema Dark Gold Premium**: UI elegante con CSS Grid, transiciones suaves, efectos hover refinados
- **Notificaciones Toast**: Sistema de feedback auto-dismissible con animaciones
- **Búsqueda Inteligente**: Búsqueda de jugadores con debounce de 300ms para optimizar requests

## 🏗️ Arquitectura: Patrón MVC

Separación limpia de responsabilidades usando Model-View-Controller clásico:

**CORE** → Llamadas API + gestión de estado global (cero DOM, cero lógica de negocio)
**MODELS** → Funciones de transformación puras (cero DOM, cero fetch)
**VIEWS** → Manipulación DOM exclusivamente (recibe datos ya procesados)
**CONTROLLERS** → Capa de orquestación (api → model → view)
**UTILS** → Lógica autocontenida de exportación

## 📁 Estructura del Proyecto

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

## 🎨 Convenciones de Diseño

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

## ✅ Desafíos Implementados

- ✅ **[Subjetivo] Calidad visual del cliente** - Tema premium dark gold, animaciones suaves, grid responsive profesional
- ✅ **[Subjetivo] Calidad del historial de Git** - Conventional commits, historial limpio y descriptivo
- ✅ **[Subjetivo] Organización del código** - Arquitectura MVC estricta, ES modules, BEM CSS, separación rigurosa de responsabilidades
- ✅ **Exportar lista** - Generación manual de CSV + Excel (SpreadsheetML) con JSZip, sin dependencias pesadas

## 🔗 Backend

**Repositorio:** [proy1-balon-de-oro-api](https://github.com/asanabria-2021067/proy1-balon-de-oro-api)

**Stack:**
- Node.js + Express
- Supabase PostgreSQL
- Arquitectura Hexagonal (Puertos y Adaptadores)
- Desplegado en Vercel

## 💭 Reflexión

**¿Volvería a usar JavaScript Vanilla para un proyecto de esta escala?**

Sí, definitivamente para proyectos donde el rendimiento crítico y el control total del bundle sean prioridades absolutas. JavaScript Vanilla mantiene el bundle minúsculo (<10KB gzipped), carga instantáneamente y se ejecuta sin el overhead de ningún framework.

Sin embargo, para aplicaciones con estado altamente dinámico o formularios complejos, un framework como React o Vue facilitaría significativamente la reactividad y la reutilización de componentes. La sincronización manual del DOM en este proyecto funciona perfectamente, pero se vuelve verbosa con más interactividad.

**Conclusión Clave:** JavaScript Vanilla está subestimado. Con ES modules, arquitectura MVC y APIs modernas (fetch, template literals, destructuring), puedes construir aplicaciones de grado producción sin frameworks - solo requiere disciplina en la organización del código y separación clara de responsabilidades.
